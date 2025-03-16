import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import * as cheerio from 'cheerio';
import { DB } from '../connect.js';
import fs from 'fs';
import path, { resolve } from 'path';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import { rejects } from 'assert';
import "dotenv/config";

// Use the stealth plugin to avoid detection
puppeteer.use(StealthPlugin());

// Promisify DB methods for easier async/await usage
DB.run = promisify(DB.run);
DB.get = promisify(DB.get); 

// Utility function to introduce delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Get the current directory name
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Function to download images
async function downloadImage(url, folderPath) {
    try {
        const response = await fetch(url);
        const buffer = await response.arrayBuffer();
        const fileName = path.basename(url);
        const filePath = path.join(folderPath, fileName);

        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, Buffer.from(buffer));
            console.log(`Downloaded: ${fileName}`);
        } else {
            console.log(`File already exists: ${fileName}`);
        }

        return filePath;
    } catch (error) {
        console.error(`Error downloading image: ${url}`, error);
        return null;
    }
}

// Utility function to get the first two words of a string
function getFirstTwoWords(inputString) {
    const words = inputString.split(' ');
    return words.slice(0, 2).join(' ');
}

// Main function to fetch data
async function fetchDataa(baseUrls) {
    console.log(Date.now());

    const browser = await puppeteer.launch({
        executablePath: process.env.NODE_ENV === "production"
            ? process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/chromium"
            : puppeteer.executablePath(),
        headless: false, // Ensures stability in recent Puppeteer versions
        defaultViewport: { width: 1080, height: 800 },
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--single-process",
            "--no-zygote",
            "--disable-dev-shm-usage", // Avoids issues in headless mode
            "--disable-accelerated-2d-canvas", // Avoids GPU-related issues
            "--disable-gpu", // Disables GPU hardware acceleration
            "--disable-web-security", // Bypasses CORS restrictions
            "--disable-features=IsolateOrigins,site-per-process", // Disables site isolation
        ],
    });

    const page = await browser.newPage();

    // Set a realistic user-agent
    await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    );

    // Disable webdriver flag
    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', {
            get: () => false,
        });
    });

    // Randomize viewport size to mimic human behavior
    await page.setViewport({
        width: 1200 + Math.floor(Math.random() * 100),
        height: 800 + Math.floor(Math.random() * 100),
    });

    const allproducts = [];

    // Use a for...of loop to handle asynchronous operations
    for (const url of baseUrls) {
        const fullUrl = `${url}/allcategory.html`;
        let productss = []; // Initialize productss for each URL

        try {
            // Scrape categories from the current URL
            const categories = await scrapeCategories(page, fullUrl);
            // Scrape products for each category
            productss = await scrapeProducts(page, categories, url); // Pass the base URL here
        } catch (error) {
            console.error(`Error fetching data from ${url}:`, error);
        } finally {
            // Add scraped products to the final array
            allproducts.push(...productss); // Use spread operator to flatten the array
        }
    }

    // Close the browser after scraping all URLs
    await browser.close();

    console.log("finished");
    console.log(Date.now());
    return allproducts;
}

// Function to scrape categories
async function scrapeCategories(page, fullUrl, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            // Navigate to the category page
            await page.goto(fullUrl, { waitUntil: 'networkidle2', timeout: 60000 });

            // Extract category data
            const categories = await page.evaluate(() => {
                const categoryElements = document.querySelectorAll('.cat-area');
                return Array.from(categoryElements).map(element => ({
                    catTitle: element.querySelector('.cat-text').innerText,
                    catimg: element.querySelector('img').src,
                    caturl: element.querySelector('a').href,
                }));
            });

            // Add categories to the database
            for (const cat of categories) {
                const catExists = await DB.get(`SELECT catId FROM CATEGORIES WHERE catName = ?`, [cat.catTitle]);
                if (!catExists) {
                    await DB.run(`INSERT INTO CATEGORIES (catName, catImg, catSlug) VALUES (?, ?, ?)`, [cat.catTitle, cat.catimg, cat.caturl]);
                    console.log(`Added category: ${cat.catTitle}`);
                }
            }

            return categories;
        } catch (error) {
            console.error(`Attempt ${i + 1} failed:`, error.message);
            if (i === retries - 1) throw error; // Throw error if all retries fail
            await delay(Math.random() * 6000 + 1000); // Wait 5 seconds before retrying
        }
    }
}

// Function to scrape products
async function scrapeProducts(page, categories, baseUrl) {
    const products = [];

    // Loop through each category
    for (const cat of categories) {
        const catProductss = [];
        const productUrl = cat.caturl;

        try {
            // Navigate to the product page
            await page.goto(productUrl, { waitUntil: 'networkidle2', timeout: 120000 }); // Increase timeout to 120 seconds
            await page.waitForSelector('.single-product', { timeout: 60000 }); // Increase timeout

            // Get the total number of products
            const productCount = await page.evaluate(() => {
                return document.querySelector('#total_result_cnt')?.innerText || 0;
            });

            // Load all products by clicking "View More"
            await viewMore(page, productCount);
            console.log("After view more");

            // Extract product details
            const productElements = await page.evaluate(() => {
                const elements = document.querySelectorAll('.single-product');
                return Array.from(elements).map(element => ({
                    title: element.querySelector('.product-details > a > h6')?.innerText.trim(),
                    price: element.querySelector('.product-details > div > h6:nth-child(1)')?.innerText.trim(),
                    featuredimg: element.querySelector('.product-img-block img')?.src,
                    detailUrl: element.querySelector('.product-img-block img')?.parentElement.getAttribute('href'),
                    sizes: Array.from(element.querySelectorAll('.product-details > div > div > label'))
                        .slice(1) // Skip the first label if it's not a size
                        .map(label => label.innerText.trim()),
                }));
            });

            // Scrape images and descriptions for each product
            for (const product of productElements) {
                const { imageSlides, productShortDescription } = await scrapeImages(page, product.detailUrl);
                const result = getFirstTwoWords(product.title);

                // Add product to database
                catProductss.push({
                    productName: product.title,
                    productOriginalPrice: product.price,
                    productBrand: result,
                    featuredimg: product.featuredimg,
                    sizeName: product.sizes.map(String),
                    productUrl: product.detailUrl,
                    imageUrl: imageSlides,
                    productShortDescription,
                    catName: cat.catTitle,
                    productFetchedFrom: baseUrl,
                });
            }

            // Update products in the database
            for (const eachproduct of catProductss) {
                await updateProduct(eachproduct);
            }

            products.push(...catProductss);
            console.log("All products processed.");
        } catch (error) {
            console.error(`Error scraping products from ${productUrl}:`, error.message);
        }
    }

    return products;
}

// Function to handle "View More" button clicks
async function viewMore(page, productCount) {
    const count = Math.ceil(productCount / 12);
    const viewMoreButtonSelector = '#loadmore_btn_category_product';

    for (let i = 0; i < count; i++) {
        try {
            // Wait for the button to be visible and interactable
            await page.waitForSelector(viewMoreButtonSelector, { visible: true, timeout: 10000 });

            // Click the button and wait for new content to load
            await Promise.all([
                page.waitForResponse(response => response.url().includes('loadmore')), // Adjust this to match the API call or network request triggered by the button
                page.click(viewMoreButtonSelector),
            ]);

            console.log(`Button clicked = ${i}`);
            await delay(Math.random() * 5000 + 1000); // Add a random delay to mimic human behavior
        } catch (error) {
            console.error(`Error clicking "View More" button (Attempt ${i + 1}):`, error.message);

            // If the execution context is destroyed, reload the page and retry
            // if (error.message.includes('Execution context was destroyed')) {
            //     console.log('Reloading page and retrying...');
            //     await page.reload({ waitUntil: 'networkidle2' });
            //     await page.waitForSelector(viewMoreButtonSelector, { visible: true, timeout: 10000 });
            // }
        }
    }
}

// Function to scrape images
async function scrapeImages(page, url) {
    console.log(`Scraping images from: ${url}`);
    const imageSlides = [];

    try {
        // Navigate to the product detail page
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        // Extract the product description
        const productShortDescription = await page.evaluate(() => {
            return document.querySelector('#home p')?.innerHTML || '';
        });

        // Extract image URLs
        const images = await page.evaluate(() => {
            const images = [];
            document.querySelectorAll('#slider img').forEach(img => {
                const src = img.src;
                if (src) {
                    images.push(src);
                }
            });
            return images;
        });

        console.log('Scraped images:', images);
        console.log('Scraped description:', productShortDescription);

        return { imageSlides: images, productShortDescription };
    } catch (error) {
        console.error('Error fetching images:', error.message);
        return { imageSlides: [], productShortDescription: '' };
    }
}

// Start the scraping process
export { fetchDataa };
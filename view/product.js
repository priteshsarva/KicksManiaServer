import { DB } from "../connect.js";
import express from "express";
const product = express()



const sizeMap = {
    "40": ["40", "40-m6", "40-6.5", "40-6", "UK 6/EURO 40", "UK 6.5/EURO 40", "UK 6 / EURO 40", "UK-6 EUR-40", "M-6", "m-6", "UK 6|Euro 40", "UK 6.5|EURO 40", "U.K-6 Euro-40", "UK-6 EURO-40", "40-UK 6", "40 UK 6", "EURO 40", "40 - 6", "Euro 40- Uk 6"],
    "41": ["41", "41-7.5", "41-m7", "41-7", "UK 7/EURO 41", "UK7.5/EURO 41", "UK 7 / EURO 41", "UK-7 EUR-41", "7.5", "Euro-41. UK-7", "UK-7.5 EUR-41.5", "Uk 7/Euro 41", "7/ Euro 41", "41/7.5", "41/7", "41/7 5", "M7", "Euro 41", "41 7.5", "41-UK7", "41 UK 7", "UK 7", "41-42"],
    "42": ["42", "42-8", "42-7.5", "42-m8", "UK 7.5/EURO 42", "UK 8/EURO 42", "UK 8 / EURO 42", "UK-7.5 EUR-42", "m-8", "Euro-42.5 UK-8", "Euro-42. UK-7.5", "UK 8|EURO 42", "UK 8.5|EURO 42", "UK-8 EUR-42", "42-UK 8", "42 UK 8", "EURO 42", "Euro 42-UK 8", "Euro 42-UK 7.5"],
    "43": ["43", "43-8.5", "43-9", "43-m9", "UK 8.5/EURO 43", "UK 9/EURO 43", "UK 9 / EURO 43", "UK-8.5 EUR-43", "m-9", "Euro-43. Uk-8.5", "UK 9|EURO 43", "UK 9.5|EURO 43", "UK-9 EUR-43", "43-UK 9", "43 UK 9", "EURO 43", "Euro 43-UK 9", "Euro 43-UK 8.5"],
    "44": ["44", "44-9.5", "44-9", "44-m10", "UK 9.5/EURO 44", "UK 10/EURO 44", "UK 10 / EURO 44", "UK-9.5 EUR-44", "m-10", "Euro-44. Uk-9", "UK 10|EURO 44", "UK-10 EUR-44", "44-UK 10", "44 UK 10", "EURO 44", "Euro 44-UK 9", "Euro 44-UK 9.5"],
    "45": ["45", "45-10.5", "45-10", "45-m11", "UK 10.5/EURO 45", "UK 11/EURO 45", "UK 11 / EURO 45", "UK-10.5 EUR-45", "m-11", "Euro-45. Uk-10", "UK 10.5|EURO 45", "UK-11 EUR-45", "45-UK 11", "45 UK 11", "EURO 45", "Euro 45-UK 10", "Euro 45-UK 10.5"],
    "46": ["46", "46-11", "46-UK 12", "UK 11/EURO 46", "UK-11 EUR-46", "UK-10.5 EUR-46", "EURO 46", "Euro-46. Uk-11"],
    "36": ["36", "36-3.5", "U.K-3.5 Euro-36", "U.K-3 Euro-36", "EURO 36"],
    "37": ["37", "37-4", "U.K-4 Euro-37", "EURO 37"],
    "38": ["38", "38-5", "U.K-5 Euro-38", "U.K-5.5 Euro-39", "EURO 38"],
    "39": ["39", "39-6", "U.K-6 Euro-39", "EURO 39"],
    "47": ["47", "47/12", "UK 12 / EURO 47", "EURO 47"],
    "48": ["48"],
    // "nill": ["MONOGRAM", "CHECKED BROWN", "Black", "Brown", "Gold", "Silver", "Purple", "Regular", "Pcs", "S", "XXL", "M", "L", "XL"]
};


const categories = {
    "Men's Shoe": [
        "MENS+SHOES", "EID SALE", "Exclusive Offer", "Diwali Dhamaka Sale", "Winter+Dhamaka+Sale",
        "Men's Kick", "Diwali Special Sale", "PREMIUM SHOES", "Biggest Sale", "Diwali sale shoes",
        "End Of Season Sale", "Shoes", "Diwali Offer 2022", "Men's shoes", "shoes+for+men",
        "Shoe for men", "Biggest sale 2025", "DIWALI SALE", "Shoes for Men", "MENS SHOES",
        "DIWALI+SALE+", "Men’s Shoes", "Bumper Sale", "Diwali Sale", "Mens+Shoes",
        "Mega Sale", "Mens's Sneakers", "Men Shoes", "Sale Product", "Slides-Crocs",
        "Sale Products", "MEN’S SHOES", "SPECIAL SALE", "Men’s Footwear", "sell+itam",
        "DIWALI+MEN+", "Sale", "Onitsuka+Tiger+Models", "MENS KICKS", "Sale Article"
    ],
    "Slides/Crocs": [
        "FLIPFLOP", "Flipflops/Crocs", "Flip+flops", "Flip-Flop", "Foam&Slide&Crocs",
        "Crocs+", "CROCS+SLIDE", "slide+", "crocs+%2B+slide+", "Crocs", "crocs+%2B+slide",
        "Flip-flops & Slides", "Birkenstock slide", "Slides+", "crocs", "FLIP/FLOPS",
        "Flip-flop", "Flipflops", "FLIP FLOP / SANDALS", "Flip Flops", "FlipFlop & CLOG",
        "flip flops", "Flip Flops & Crocs"
    ],
    "Women's Shoe": [
        "WOMANS+SHOES", "Women Sports Shoes", "Women's Kick", "womens", "Ladies Shoes",
        "Women's Shoes", "shoes+for+women", "shoes+for+girls", "Shoe for girls", "PREMIUM+HEELS",
        "Shoes For Her", "Womans shoes", "women shoes", "Womens+Shoes", "women%27s+%26+men%27s+",
        "Womens's Sneakers", "WOMEN’S SHOES", "Women’s Shoes", "Women’s Footwear", "WOMENS SHOES",
        "DIWALI+WOMEN+SELL", "Ladies+Shoes", "womens Kicks"
    ],
    "UA Quality": [
        "UA+QUALITY+SHOE", "UA QUALITY SHOES", "Men Sports Shoes", "wall+Clock",
        "UA+Quality+Shoes", "Premium Shoes", "UA Quality", "Bottle", "Premium Shoe",
        "UA+Models", "UA+QUALITY+SHOES", "Ua Quality", "Premium Article", "Premium kicks"
    ],
    // "Nill": [
    //     "Casual Shoes", "KeyChain", "BAG PACK", "Hoodie Unisex", "50% Off", "Lace", 
    //     "Bags", "Hand bags", "Jackets", "FORMAL", "LOFFER", "mojdi", "long+boots", 
    //     "SANDAL", "SPORTS", "Belt+", "Wallet+", "Sport Jersey", "Loafer/Formal Shoes", 
    //     "Yeezy Foam Runner", "SALE % SALE % SALE", "T-Shirts", "Travelling Bags", "Wallet", 
    //     "Belts", "Hoodies", "Clothing", "SALE", "Mens Accessories", "Mens Watch", "Cap", 
    //     "Accessories", "Stoles"
    // ],
    "Formal": [
        "Loafers Or Formals", "Formals", "Party Wear Shoes"
    ]
};





// Import necessary modules
import { promisify } from 'util';

// Promisify DB methods for easier async/await usage
DB.run = promisify(DB.run);
DB.get = promisify(DB.get);

product.get('/allresults', (req, res) => {

    res.set('content-type', 'application/json');
    let sql = `SELECT * FROM PRODUCTS ;`
    // let sql = `SELECT * FROM PRODUCTS WHERE productUrl = "https://oneshoess.cartpe.in/nikee-airforce-1-first-leather-ua-oneshoess.html?color=";`

    try {
        DB.all(sql, [], (err, rows) => {
            if (err) {
                throw err;
            }
            let content = JSON.stringify(rows);
            res.send(content)
        })
    } catch (err) {
        console.log(err.message);
        res.status(467)
        res.send(`{"code":"467","status":${err.message}}`);
    }

})

product.get('/all', (req, res) => {
    res.set('content-type', 'application/json');

    const limit = parseInt(req.query.result) || 20;
    const page = parseInt(req.query.page) || 1; // default to page 1 if not provided
    const offset = (page - 1) * limit;

    const sql = `SELECT * FROM PRODUCTS WHERE sizeName <> '[]' LIMIT ? OFFSET ?`;

    try {
        DB.all(sql, [limit, offset], (err, rows) => {
            if (err) {
                throw err;
            }
            res.json(rows); // same as res.send(JSON.stringify(rows))
        });
    } catch (err) {
        console.log(err.message);
        res.status(467).send({ code: '467', status: err.message });
    }
});

product.get('/search', (req, res) => {
    const { q = '', brand, size, category } = req.query;
    const limit = parseInt(req.query.result) || 20;
    const page = parseInt(req.query.page) || 1; // default to page 1 if not provided
    const offset = (page - 1) * limit;

    let sql = `SELECT * FROM products WHERE 1=1 AND sizeName <> '[]' `;
    const params = [];

    if (q) {
        sql += ` AND LOWER(productName) LIKE ?`;
        params.push(`%${q.toLowerCase()}%`);
    }

    if (brand) {
        sql += ` AND LOWER(productBrand) = ?`;
        params.push(brand.toLowerCase());
    }

    if (size) {
        const normalizedSize = size.trim().toLowerCase();
        const matchedSizeKey = Object.keys(sizeMap).find((key) =>
            sizeMap[key].some((variant) => variant.toLowerCase() === normalizedSize)
        );

        if (matchedSizeKey) {
            const variants = sizeMap[matchedSizeKey];
            const likeClauses = variants.map(() => `JSON_EXTRACT(sizeName, '$') LIKE ?`).join(" OR ");
            sql += ` AND (${likeClauses})`;
            params.push(...variants.map(v => `%${v}%`));
        } else {
            sql += ` AND JSON_EXTRACT(sizeName, '$') LIKE ?`;
            params.push(`%${size}%`);
        }
    }

    if (category) {
        const normalizedCategory = category.trim().toLowerCase();
        const matchedCatKey = Object.keys(categories).find((key) =>
            categories[key].some((variant) => variant.toLowerCase() === normalizedCategory)
        );

        if (matchedCatKey) {
            const variants = categories[matchedCatKey];
            const likeClauses = variants.map(() => `LOWER(catName) LIKE ?`).join(" OR ");
            sql += ` AND (${likeClauses})`;
            params.push(...variants.map(v => `%${v.toLowerCase()}%`));
        } else {
            sql += ` AND LOWER(catName) LIKE ?`;
            params.push(`%${category.toLowerCase()}%`);
        }
    }


    sql += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);
    
    DB.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json(rows);
    });
});


product.get('/results/', (req, res) => {
    res.set('content-type', 'application/json');

    // Parse query parameters
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page

    // Calculate start and end indices
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    let sql = `SELECT * FROM PRODUCTS WHERE sizeName <> '[]';`;

    DB.all(sql, [], (err, rows) => {
        if (err) {
            // Handle database error
            console.error(err.message);
            res.status(500).json({ code: 500, status: "Internal Server Error", message: err.message });
            return;
        }

        // Paginate the results
        const results = rows.slice(startIndex, endIndex);

        // Send the response
        res.json({
            page,
            limit,
            totalItems: rows.length,
            results,
        });
    });
});

product.get('/search', (req, res) => {
    res.set('content-type', 'application/json');

    // Parse query parameters
    const { productName, catName, brand, size, page = 1, limit = 10 } = req.query;

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Base SQL query
    let sql = `SELECT * FROM PRODUCTS WHERE 1=1`;
    let params = [];

    // Add search conditions
    if (productName) {
        sql += ` AND productName LIKE ?`;
        params.push(`%${productName}%`);
    }
    if (catName) {
        sql += ` AND catName LIKE ?`;
        params.push(`%${catName}%`);
    }
    if (brand) {
        sql += ` AND productBrand LIKE ?`;
        params.push(`%${brand}%`);
    }
    if (size) {
        // Assuming sizeName is stored as a JSON array (e.g., ["40", "41"])
        sql += ` AND JSON_CONTAINS(sizeName, ?)`;
        params.push(`"${size}"`);
    }

    // Add pagination
    sql += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    // Execute the query
    DB.all(sql, params, (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ code: 500, status: "Internal Server Error", message: err.message });
            return;
        }

        // Query to get total count of matching products (for pagination metadata)
        let countSql = sql.replace(/SELECT \* FROM PRODUCTS/, 'SELECT COUNT(*) as total FROM PRODUCTS');
        countSql = countSql.replace(/LIMIT \? OFFSET \?/, ''); // Remove pagination for count query

        DB.get(countSql, params.slice(0, -2), (err, countResult) => { // Exclude limit and offset from params
            if (err) {
                console.error(err.message);
                res.status(500).json({ code: 500, status: "Internal Server Error", message: err.message });
                return;
            }

            // Send the response
            res.json({
                page: parseInt(page),
                limit: parseInt(limit),
                totalItems: countResult.total,
                results: rows,
            });
        });
    });
});

product.post('/add', async (req, res) => {
    try {
        console.log(req.body);

        // Serialize arrays to JSON strings
        const dynamicValues = { ...req.body };
        if (Array.isArray(dynamicValues.imageUrl)) {
            dynamicValues.imageUrl = JSON.stringify(dynamicValues.imageUrl);
        }
        if (Array.isArray(dynamicValues.sizeName)) {
            dynamicValues.sizeName = JSON.stringify(dynamicValues.sizeName);
        }

        const columns = Object.keys(dynamicValues).join(', ');
        const placeholders = Object.keys(dynamicValues).map(() => '?').join(', ');
        const values = Object.values(dynamicValues);

        res.set('content-type', 'application/json');

        // Handle Sizes
        let sizeIds = [];
        if (typeof req.body.sizeName !== 'undefined') {
            const sizeNames = Array.isArray(req.body.sizeName) ? req.body.sizeName : [req.body.sizeName];

            for (const sizeName of sizeNames) {
                // Insert size if it doesn't exist
                const sizesql = `INSERT INTO SIZES (sizeName) VALUES (?) ON CONFLICT(sizeName) DO NOTHING;`;
                await DB.run(sizesql, [sizeName]);

                // Get the sizeId
                const sizeRow = await DB.get(`SELECT sizeId FROM SIZES WHERE sizeName = ?`, [sizeName]);
                if (sizeRow) {
                    sizeIds.push(sizeRow.sizeId);
                }
            }
        }

        // Handle Category
        let catId;
        if (typeof req.body.catName !== 'undefined') {
            const catName = req.body.catName;

            // Insert category if it doesn't exist
            const catNamesql = `INSERT INTO CATEGORIES (catName) VALUES (?) ON CONFLICT(catName) DO NOTHING;`;
            await DB.run(catNamesql, [catName]);

            // Get the catId
            const catRow = await DB.get(`SELECT catId FROM CATEGORIES WHERE catName = ?`, [catName]);
            if (catRow) {
                catId = catRow.catId;
            }
        }

        // Insert Product
        const sql = `INSERT INTO PRODUCTS (${columns}) VALUES (${placeholders})`;
        await DB.run(sql, [...values]);

        // Get the last inserted productId
        const productRow = await DB.get(`SELECT last_insert_rowid() as lastID`);
        const newId = productRow.lastID;

        // Insert Product-Category Relationship
        if (catId) {
            const productCatSql = `INSERT INTO ProductCategories (ProductId, CategoryId) VALUES (?, ?)`;
            await DB.run(productCatSql, [newId, catId]);
        }

        // Insert Product-Size Relationships
        for (const sizeId of sizeIds) {
            const productSizeSql = `INSERT INTO ProductSizes (ProductId, SizeId) VALUES (?, ?)`;
            await DB.run(productSizeSql, [newId, sizeId]);
        }

        // Send Success Response
        res.status(201).json({
            status: 201,
            message: `Data added with id: ${newId}`,
        });
    } catch (err) {
        console.error(err.message);

        if (err.code === 'SQLITE_CONSTRAINT') {
            res.status(400).json({
                code: "400",
                status: "Unique constraint failed",
                message: "A record with this unique value already exists.",
            });
        } else {
            res.status(500).json({
                code: "500",
                status: "Internal Server Error",
                message: err.message,
            });
        }
    }
});


product.post('/update', (req, res) => {
    res.set('content-type', 'application/json');
    let query = 'UPDATE PRODUCTS SET ';
    const updates = []
    const values = []

    if (typeof req.body.productName !== 'undefined') {
        updates.push(`productName = ?`);
        values.push(req.body.productName);
    }
    if (typeof req.body.productPrice !== 'undefined') {
        updates.push(`productPrice = ?`);
        values.push(req.body.productPrice);
    }
    if (typeof req.body.productPriceWithoutDiscount !== 'undefined') {
        updates.push(`productPriceWithoutDiscount = ?`);
        values.push(req.body.productPriceWithoutDiscount);
    }
    if (typeof req.body.productOriginalPrice !== 'undefined') {
        updates.push(`productOriginalPrice = ?`);
        values.push(req.body.productOriginalPrice);
    }
    if (typeof req.body.productFetchedFrom !== 'undefined') {
        updates.push(`productFetchedFrom = ?`);
        values.push(req.body.productFetchedFrom);
    }
    if (typeof req.body.ProductUrl !== 'undefined') {
        updates.push(`ProductUrl = ?`);
        values.push(req.body.ProductUrl);
    }
    if (typeof req.body.productShortDescription !== 'undefined') {
        updates.push(`productShortDescription = ?`);
        values.push(req.body.productShortDescription);
    }
    if (typeof req.body.productDescription !== 'undefined') {
        updates.push(`productDescription = ?`);
        values.push(req.body.productDescription);
    }
    if (typeof req.body.productBrand !== 'undefined') {
        updates.push(`productBrand = ?`);
        values.push(req.body.productBrand);
    }
    if (typeof req.body.productLastUpdated !== 'undefined') {
        updates.push(`productLastUpdated = ?`);
        values.push(req.body.productLastUpdated);
    } else {
        updates.push(`productLastUpdated = ?`);
        values.push(Date.now());
    }

    let sql = query += updates.join(', ') + ' WHERE productId = ?';
    let id = req.body.productId;

    try {
        DB.run(sql, [...values, id], function (err) {

            if (err) {
                // console.error(err.message); // Log the error message
                // Check for specific error codes if needed
                if (err.code === 'SQLITE_CONSTRAINT') {
                    return res.status(400).send({
                        code: "400",
                        status: "Unique constraint failed",
                        message: "A record with this unique value already exists."
                    });
                } else {
                    return res.status(500).send({
                        code: "500",
                        status: "Internal Server Error",
                        message: err.message,
                    });
                }
            }


            if (this.changes === 1) {
                // file updated succefully
                res.status(200);
                let data = { status: 200, message: `data updated with id: ${id} ` }
                let content = JSON.stringify(data);
                res.send(content);
            } else {
                res.status(201);
                let data = { status: 201, message: `no data has been changed` }
                let content = JSON.stringify(data);
                res.send(content);
            }

        })

    } catch (err) {
        console.log(err.message);
        res.status(467);
        res.send(`{ "code": "467", "status":${err.message} } `);

    }
})

product.delete('/delete', (req, res) => {
    res.set('content-type', 'application/json');
    let sql = 'DELETE FROM PRODUCTS WHERE productId = ?';
    let id = req.body.productId;

    try {
        DB.run(sql, [id], function (err) {
            if (err) throw err;
            if (this.changes === 1) {
                // file deleted succefully
                res.status(200);
                let data = { status: 200, message: `data delete with id: ${id} ` }
                let content = JSON.stringify(data);
                res.send(content);
            } else {
                res.status(201);
                let data = { status: 201, message: `no data has been found` }
                let content = JSON.stringify(data);
                res.send(content);
            }

        })

    } catch (err) {
        console.log(err.message);
        res.status(467)
        res.send(`{ "code": "467", "status":${err.message} } `);
    }

})

export default product;
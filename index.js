import { DB } from "./connect.js";

import express, { json } from "express";
import bodyParser from "body-parser";
import router from "./view/routes.js";
import categories from "./view/categories.js";
import product from "./view/product.js";
import sizes from "./view/sizes.js";
import tags from "./view/tags.js";
import vendor from "./view/vendor.js";
import productSizes from "./view/productSizes.js";
import productCategories from "./view/productCategories.js";
// import fetchData from "./controller/scraper.js";
// import fetchDataa from "./controller/puppeteerScrapper.js";
// import fetchDataa from "./controller/temp.js";
import { fetchDataa } from "./controller/newtemp.js";
import brand from "./view/brand.js";
import productBrand from "./view/productBrand.js";
import { baseUrls } from "./baseUrls.js";





const app = express()
app.use(bodyParser.json());// for parsing application/json

app.get('/', async (req, res) => {
    res.set('content-type', 'application/json');
    res.status(200).json({ status: 200, server: "Runnnig" });

});

app.use(router)
app.use('/category', categories)
app.use('/product', product)
app.use('/size', sizes)
app.use('/tag', tags)
app.use('/vendor', vendor)
app.use('/productsize', productSizes)
app.use('/productcategories', productCategories)
app.use('/brand', brand)
app.use('/productbrand', productBrand)

app.get('/devproductupdates', async (req, res) => {
    res.set('content-type', 'application/json');
    try {
        const data = await fetchDataa(baseUrls);
        res.status(200).json({ status: 200, data });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }

})






app.listen(5000, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('lisitng at 5000');

})


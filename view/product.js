import { DB } from "../connect.js";
import express from "express";
const product = express()


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
    let sql = `SELECT * FROM PRODUCTS WHERE sizeName <> '[]';`
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
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
// product.post('/add', (req, res) => {
//     console.log(req.body);

//     const dynamicValues = req.body;// Extracting all keys and values from req.body 
//     // Constructing the SQL query dynamically
//     const columns = Object.keys(dynamicValues).join(', ');
//     const placeholders = Object.keys(dynamicValues).map(() => '?').join(', ');
//     const values = Object.values(dynamicValues);


//     res.set('content-type', 'application/json');
//     // let sql = 'INSERT INTO ENEMIES(ENEMIES_NAME, ENEMIES_REASON) VALUES(?,?)';
//     // console.log(`INSERT INTO PRODUCTS (${columns}) VALUES (${values})`);


//     let sizeId
//     if (typeof req.body.sizeName !== 'undefined') {
//         const sizeName = req.body.sizeName;

//         if (typeof sizeName === 'object') {
//             console.log("inside if for object");

//             sizeId = sizeName.map((size) => {
//                 console.log(`here ${size}`);
//                 let sizesql = `INSERT INTO SIZES (sizeName) VALUES (?) ON CONFLICT(sizeName) DO NOTHING;`
//                 try {
//                     DB.run(sizesql, [size], function (err) {
//                         if (err) {
//                             // console.error(err.message); // Log the error message
//                             // Check for specific error codes if needed
//                             if (err.code === 'SQLITE_CONSTRAINT') {
//                                 return res.status(400).send({
//                                     code: "400",
//                                     status: "Unique constraint failed",
//                                     message: "A record with this unique value already exists."
//                                 });
//                             } else {
//                                 return res.status(500).send({
//                                     code: "500",
//                                     status: "Internal Server Error",
//                                     message: err.message
//                                 });
//                             }
//                         }
//                         if (this.changes === 1) {

//                             sizeId = this.lastID
//                         }

//                     })

//                 } catch (err) {
//                     console.log(err.message);
//                     res.status(467)
//                     res.send(`{"code":"467","status":${err.message}}`);
//                 }
//             })

//         } else {
//             console.log("outside if for ibjects");
//             let sizesql = `INSERT INTO SIZES (sizeName) VALUES (?) ON CONFLICT(sizeName) DO NOTHING;`
//             try {
//                 DB.run(sizesql, [sizeName], function (err) {
//                     if (err) {
//                         // console.error(err.message); // Log the error message
//                         // Check for specific error codes if needed
//                         if (err.code === 'SQLITE_CONSTRAINT') {
//                             return res.status(400).send({
//                                 code: "400",
//                                 status: "Unique constraint failed",
//                                 message: "A record with this unique value already exists."
//                             });
//                         } else {
//                             return res.status(500).send({
//                                 code: "500",
//                                 status: "Internal Server Error",
//                                 message: err.message
//                             });
//                         }
//                     }
//                     if (this.changes === 1) {

//                         sizeId = this.lastID
//                     }

//                 })

//             } catch (err) {
//                 console.log(err.message);
//                 res.status(467)
//                 res.send(`{"code":"467","status":${err.message}}`);
//             }
//         }


//     }

//     let catid
//     if (typeof req.body.catName !== 'undefined') {
//         const catName = req.body.catName;
//         //to check if SizeName Exist or Not
//         let catNamesql = `INSERT INTO CATEGORIES (catName) VALUES (?) ON CONFLICT(catName) DO NOTHING;`
//         try {
//             DB.run(catNamesql, [catName], function (err) {
//                 if (err) {

//                     if (err.code === 'SQLITE_CONSTRAINT') {
//                         return res.status(400).send({
//                             code: "400",
//                             status: "Unique constraint failed",
//                             message: "A record with this unique value already exists."
//                         });
//                     } else {
//                         return res.status(500).send({
//                             code: "500",
//                             status: "Internal Server Error",
//                             message: err.message
//                         });
//                     }
//                 }

//                 if (this.changes === 1) {
//                     catid = this.lastID
//                 }

//             })

//         } catch (err) {
//             console.log(err.message);
//             res.status(467)
//             res.send(`{"code":"467","status":${err.message}}`);
//         }
//     }



//     let sql = `INSERT INTO PRODUCTS (${columns}) VALUES (${placeholders})`;
//     let newId;

//     try {
//         DB.run(sql, [...values], function (err) {
//             // console.log(err);

//             if (err) {
//                 // console.error(err.message); // Log the error message
//                 // Check for specific error codes if needed
//                 if (err.code === 'SQLITE_CONSTRAINT') {
//                     return res.status(400).send({
//                         code: "400",
//                         status: "Unique constraint failed",
//                         message: "A record with this unique value already exists.",
//                         fullerror: err.message
//                     });
//                 } else {
//                     return res.status(500).send({
//                         code: "500",
//                         status: "Internal Server Error",
//                         message: err.message
//                     });
//                 }
//             }
//             newId = this.lastID;
//             res.status(201);
//             let data = { status: 201, message: `data add with id: ${newId}` };
//             let content = JSON.stringify(data);
//             res.send(content)
//         })

//         let sqlProductCat = `SELECT catId FROM CATEGORIES WHERE catName = ?`;
//         let contentsqlProductCat

//         DB.get(sqlProductCat, [req.body.catName], function (err, rows) {
//             if (err) {

//                 if (err.code === 'SQLITE_CONSTRAINT') {
//                     return res.status(400).send({
//                         code: "400",
//                         status: "Unique constraint failed",
//                         message: "A record with this unique value already exists."
//                     });
//                 } else {
//                     return res.status(500).send({
//                         code: "500",
//                         status: "Internal Server Error",
//                         message: err.message
//                     });
//                 }
//             }

//             contentsqlProductCat = JSON.stringify(rows.catId);
//             console.log(contentsqlProductCat);

//             let productCATsql = `INSERT INTO ProductCategories (ProductId, CategoryId) VALUES (?,?)`;
//             DB.run(productCATsql, [newId, contentsqlProductCat], function (err) {
//                 if (err) {
//                     throw err;
//                 }
//             })
//         })

//         // need to add multiple size adding
//         console.log(typeof sizeName);


//         if (typeof req.body.sizeName === 'object') {

//             req.body.sizeName.map((size) => {

//                 let sqlProductSize = `SELECT sizeId FROM SIZES WHERE sizeName = ?`;
//                 let contentsqProductSize
//                 DB.get(sqlProductSize, [size], function (err, rows) {
//                     if (err) {

//                         if (err.code === 'SQLITE_CONSTRAINT') {
//                             return res.status(400).send({
//                                 code: "400",
//                                 status: "Unique constraint failed",
//                                 message: "A record with this unique value already exists."
//                             });
//                         } else {
//                             return res.status(500).send({
//                                 code: "500",
//                                 status: "Internal Server Error",
//                                 message: err.message
//                             });
//                         }
//                     }

//                     contentsqProductSize = JSON.stringify(rows.sizeId);
//                     console.log(`here you FROM OBJECT goo ${contentsqProductSize}`);

//                     let productCATsql = `INSERT INTO ProductSizes (ProductId, SizeId) VALUES (?,?)`;
//                     DB.run(productCATsql, [newId, contentsqProductSize], function (err) {
//                         if (err) {
//                             throw err;
//                         }
//                     })

//                 })

//             })



//         } else {


//             let sqlProductSize = `SELECT sizeId FROM SIZES WHERE sizeName = ?`;
//             let contentsqProductSize
//             DB.get(sqlProductSize, [req.body.sizeName], function (err, rows) {
//                 if (err) {

//                     if (err.code === 'SQLITE_CONSTRAINT') {
//                         return res.status(400).send({
//                             code: "400",
//                             status: "Unique constraint failed",
//                             message: "A record with this unique value already exists."
//                         });
//                     } else {
//                         return res.status(500).send({
//                             code: "500",
//                             status: "Internal Server Error",
//                             message: err.message
//                         });
//                     }
//                 }

//                 contentsqProductSize = JSON.stringify(rows.sizeId);
//                 console.log(`here you goo ${contentsqProductSize}`);

//                 let productCATsql = `INSERT INTO ProductSizes (ProductId, SizeId) VALUES (?,?)`;
//                 DB.run(productCATsql, [newId, contentsqProductSize], function (err) {
//                     if (err) {
//                         throw err;
//                     }
//                 })

//             })
//         }


//     } catch (err) {
//         console.log(err.message);
//         res.status(467)
//         res.send(`{"code":"467","status":${err.message}}`);
//     }
// })


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
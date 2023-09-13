const Router = require('express-promise-router')
const path = require('path')
const { query } = require('../../db/index')

const router = new Router()

/**
 * @swagger
 * /products:
 *   get:
 *     security:
 *       - SessionAuth: []
 *     summary: Retrieve the products page.
 *     description: Returns the products.html page for the user to view and manage their products.
 *     responses:
 *       200:
 *         description: Successfully retrieved products page.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 * 
 *   delete:
 *     security:
 *       - SessionAuth: []
 *     summary: Delete a product.
 *     description: Deletes a specified product from the database.
 *     parameters:
 *       - in: body
 *         name: product
 *         description: The product to delete.
 *         schema:
 *           type: object
 *           required:
 *             - idToDelete
 *           properties:
 *             idToDelete:
 *               type: integer
 *               description: The ID of the product to delete.
 *     responses:
 *       204:
 *         description: Successfully deleted product.
 * 
 * /products/create:
 *   get:
 *     security:
 *       - SessionAuth: []
 *     summary: View the create product page.
 *     description: Returns the create_product.html page for the user to add a new product.
 *     responses:
 *       200:
 *         description: Successfully retrieved create product page.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 * 
 *   post:
 *     security:
 *       - SessionAuth: []
 *     summary: Create a new product.
 *     description: Adds a new product to the database.
 *     parameters:
 *       - in: body
 *         name: product
 *         description: The product details to add.
 *         schema:
 *           type: object
 *           required:
 *             - product_name
 *             - stock
 *           properties:
 *             product_name:
 *               type: string
 *               description: The name of the product.
 *             stock:
 *               type: integer
 *               description: The stock amount of the product.
 *     responses:
 *       302:
 *         description: Successfully added product and redirected to products page.
 *       400:
 *         description: Product already exists.
 * 
 * /products/browse:
 *   get:
 *     security:
 *       - SessionAuth: []
 *     summary: View the browse products page.
 *     description: Returns the browse_product.html page for the user to browse available products.
 *     responses:
 *       200:
 *         description: Successfully retrieved browse products page.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 * 
 * /products/edit:
 *   get:
 *     security:
 *       - SessionAuth: []
 *     summary: View the edit product page.
 *     description: Returns the edit_product.html page for the user to edit their products.
 *     responses:
 *       200:
 *         description: Successfully retrieved edit product page.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 * 
 *   post:
 *     security:
 *       - SessionAuth: []
 *     summary: Edit a product.
 *     description: Edits the details of a specified product in the database.
 *     parameters:
 *       - in: body
 *         name: product
 *         description: The old and new product details.
 *         schema:
 *           type: object
 *           required:
 *             - oldValues
 *             - newValues
 *           properties:
 *             oldValues:
 *               type: object
 *               properties:
 *                 oldProductName:
 *                   type: string
 *             newValues:
 *               type: object
 *               properties:
 *                 newProductName:
 *                   type: string
 *                 newProductStock:
 *                   type: integer
 *     responses:
 *       204:
 *         description: Successfully edited product.
 *       400:
 *         description: Product name already exists.
 * 
 * /products/editjs:
 *   get:
 *     security:
 *       - SessionAuth: []
 *     summary: Retrieve the editProducts.js script.
 *     description: Returns the editProducts.js script for client-side product editing functionality.
 *     responses:
 *       200:
 *         description: Successfully retrieved editProducts.js script.
 *         content:
 *           application/javascript:
 *             schema:
 *               type: string
 * 
 * /products/productsjs:
 *   get:
 *     security:
 *       - SessionAuth: []
 *     summary: Retrieve the getProducts.js script.
 *     description: Returns the getProducts.js script for client-side product functionality.
 *     responses:
 *       200:
 *         description: Successfully retrieved getProducts.js script.
 *         content:
 *           application/javascript:
 *             schema:
 *               type: string
 * 
 * /products/browsejs:
 *   get:
 *     security:
 *       - SessionAuth: []
 *     summary: Retrieve the browseProducts.js script.
 *     description: Returns the browseProducts.js script for client-side product browsing functionality.
 *     responses:
 *       200:
 *         description: Successfully retrieved browseProducts.js script.
 *         content:
 *           application/javascript:
 *             schema:
 *               type: string
 * 
 * /products/productdata:
 *   get:
 *     security:
 *       - SessionAuth: []
 *     summary: Fetch product data for the user.
 *     description: Returns a JSON array of the user's product data.
 *     responses:
 *       200:
 *         description: Successfully retrieved product data.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   product_name:
 *                     type: string
 *                   stock:
 *                     type: integer
 * 
 * /products/allproductdata:
 *   get:
 *     security:
 *       - SessionAuth: []
 *     summary: Fetch all available product data.
 *     description: Returns a JSON array of all available products, excluding those created by the user
 */
router.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '/products.html'))
})

router.delete('/', async (req, res) => {
	const { idToDelete } = req.body
	await query('DELETE FROM products WHERE id = $1', [idToDelete])
	res.status(204).send()
})

router.get('/create', (req, res) => {
	res.sendFile(path.join(__dirname, '/create_product.html'))
})

router.post('/create', async (req, res) => {
	const productName = req.body.product_name
	const stock = req.body.stock
	const profileId = req.session.user.profile_id

	try {
		// check if product already exists
		const { rows: productRows } = await query('SELECT * FROM products WHERE product_name = $1', [productName])
		if (productRows[0]) {
			return res.send('Product already exists, choose a different name.')
		}

		// add product to database
		await query('INSERT INTO products (product_name, stock, created_by) VALUES ($1, $2, $3)', [productName, stock, profileId])
	} catch (err) {
		console.log(err)
	}

	// Redirect to /products
	res.redirect('/products')
})

router.get('/browse', (req, res) => {
	res.sendFile(path.join(__dirname, '/browse_product.html'))
})

router.get('/edit', async (req, res) => {
	res.sendFile(path.join(__dirname, '/edit_product.html'))
})

router.post('/edit', async (req, res) => {
	const { oldValues, newValues} = req.body

	// Check if the product name already exists
	const { rows: productRows } = await query('SELECT * FROM products WHERE product_name = $1', [newValues.newProductName])
	if (productRows[0]) {
		res.send('Product already exists, choose a different name.')
	}

	// Edit product in database
	await query('UPDATE products SET product_name = $1, stock = $2 WHERE product_name = $3', [newValues.newProductName, newValues.newProductStock, oldValues.oldProductName])

	// Redirect back to products page, mostly handled in client side javascript
	res.status(204).send()
})

router.get('/editjs', (req, res) => {
	res.sendFile(path.join(__dirname, '/editProducts.js'))
})

router.get('/productsjs', (req, res) => {
	res.sendFile(path.join(__dirname, './getProducts.js'))
})

router.get('/browsejs', (req, res) => {
	res.sendFile(path.join(__dirname, './browseProducts.js'))
})

router.get('/productdata', async (req, res) => {
	const { profile_id } = req.session.user
	try {
		const { rows: productRows } = await query('SELECT id, product_name, stock FROM products WHERE created_by = $1', [profile_id])
		res.json(productRows)
	} catch (err) {
		console.log(err)
	}
})

router.get('/allproductdata', async (req, res) => {
	const { profile_id } = req.session.user
	try {
		const { rows: productRows } = await query(`SELECT
			products.id, 
			products.product_name,
			products.stock,
			profiles.first_name,
			profiles.last_name 
			FROM products INNER JOIN profiles ON products.created_by = profiles.id
			WHERE stock > 0 AND created_by != $1
			ORDER BY 1 ASC`, [profile_id])
		res.json(productRows)
	} catch (err) {
		console.log(err)
	}
})

module.exports = {
	router
}

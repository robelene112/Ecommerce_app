const Router = require('express-promise-router')
const path = require('path')
const { query } = require('../../db/index')

const router = new Router()

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
	console.log('Enter /products/edit')
	console.log(req.body)
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
			WHERE stock > 0 AND created_by != $1`, [profile_id])
		res.json(productRows)
	} catch (err) {
		console.log(err)
	}
})

module.exports = {
	router
}

const Router = require('express-promise-router')
const path = require('path')
const { query } = require('../../db/index')

const router = new Router()

router.get('/', async (req, res) => {
	const { username } = req.session.user
	try {
		const { rows: productRows } = await query('SELECT * FROM products WHERE created_by = $1', [username])
	} catch (err) {
		throw err
	}
	res.sendFile(path.join(__dirname, '/products.html'))
})

router.get('/create', (req, res) => {
	res.sendFile(path.join(__dirname, '/create_product.html'))
})


router.post('/create', async (req, res) => {
	const productName = req.body.product_name
	const stock = req.body.stock
	const username = req.session.user.username

	try {
		// check if product already exists
		const { rows: productRows } = await query('SELECT * FROM products WHERE product_name = $1', [productName])
		if (productRows[0]) {
			return res.send('Product already exists, choose a different name.')
		}

		// add product to database
		await query('INSERT INTO products (product_name, stock, created_by) VALUES ($1, $2, $3)', [productName, stock, username])
	} catch (err) {
		throw err
	}

	// redirect back to products page
	res.redirect('/products')
})

router.get('/productsjs', (req, res) => {
	res.sendFile(path.join(__dirname, './getProducts.js'))
})

router.get('/productdata', async (req, res) => {
	const { username } = req.session.user
	try {
		const { rows: productRows } = await query('SELECT id, product_name, stock FROM products WHERE created_by = $1', [username])
	} catch (err) {
		throw err
	}
	res.json(productRows)
})

module.exports = {
	router
}

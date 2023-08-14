const Router = require('express-promise-router')
const path = require('path')
const { query } = require('../../db/index')

const router = new Router()

router.get('/', async (req, res) => {
	res.sendFile(path.join(__dirname, '/products.html'))
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

	// redirect back to products page
	res.redirect('/products')
})

router.get('/edit', (req, res) => {
	res.sendFile(path.join(__dirname, '/edit_product.html'))
})


router.post('/edit', (req, res) => {
})

router.get('/editjs', (req, res) => {
	res.sendFile(path.join(__dirname, '/editProducts.js'))
})


router.get('/productsjs', (req, res) => {
	res.sendFile(path.join(__dirname, './getProducts.js'))
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

module.exports = {
	router
}

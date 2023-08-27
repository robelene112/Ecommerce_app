const Router = require('express-promise-router')
const path = require('path')
const { query } = require('../../db/index')

const router = new Router()

router.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '/cart.html'))
})

router.post('/', async (req, res) => {
	const { productId, amount } = req.body
	console.log(amount)
	
	// Check if there is still stock available
	const { rows: productRows } = await query('SELECT stock FROM products WHERE id = $1', [productId])

	if (productRows[0].stock < amount) {
		return res.status(400).send()
	}

	// Subtract amount from available stock
	await query('UPDATE products SET stock = stock - $1 WHERE id = $2', [amount, productId])

	// Check if product was already added if so, add extra
	const { rows: cartRows } = await query('SELECT * FROM cart WHERE profile_id = $1 AND product_id = $2', [req.session.user.profile_id, productId])

	if (cartRows[0]) {
		// Product is already in the cart
		// There is stock available so we increase the amount column by the amount added
		await query('UPDATE cart SET amount = amount + $1 WHERE profile_id = $2 AND product_id = $3', [amount, req.session.user.profile_id, productId])
	} else {
		// Product is not already in the cart
		// Add product to the cart
		await query('INSERT INTO cart (product_id, amount, profile_id) VALUES ($1, $2, $3)', [productId, amount, req.session.user.profile_id])
	}

	res.status(204).send()
})

router.get('/cartdata', async (req, res) => {
	const { profile_id } = req.session.user

	const { rows: cartRows } = await query('SELECT * FROM cart WHERE profile_id = $1', [profile_id])
	console.log('cartRows in /cart/cartdata: ')

	res.json(cartRows)
})

module.exports = {
	router
}

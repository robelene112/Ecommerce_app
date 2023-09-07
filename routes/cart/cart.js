const Router = require('express-promise-router')
const path = require('path')
const { query } = require('../../db/index')

const router = new Router()

router.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '/cart.html'))
})

router.post('/', async (req, res) => {
	const { productId, amount } = req.body

	try {
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
	} catch (err) { console.log(err) }

	res.status(204).send()
})

router.put('/', async (req, res) => {
	const { productId, amountToDelete, currentAmount } = req.body

	try {
		if (currentAmount === amountToDelete) {
			await query('DELETE FROM cart WHERE product_id = $1 AND profile_id = $2', [productId, req.session.user.profile_id])
		} else {
			await query('UPDATE cart SET amount = amount - $1 WHERE product_id = $2 AND profile_id = $3', [amountToDelete, productId, req.session.user.profile_id])
		}
		await query('UPDATE products SET stock = stock + $1 WHERE id = $2', [amountToDelete, productId])
	} catch (err) { console.log(err) }

	res.status(204).send()
})

router.delete('/', async (req, res) => {
	const { itemAmount } = req.body

	try {
		const { rows: cartRows } = await query('SELECT product_id, amount FROM cart WHERE profile_id = $1', [req.session.user.profile_id])
		if (cartRows[0]) {
			await query('DELETE FROM cart WHERE profile_id = $1', [req.session.user.profile_id])
			for (const product of cartRows) {
				await query('UPDATE products SET stock = stock + $1 WHERE id = $2', [product.amount, product.product_id])
			}
		}
	} catch (err) { console.log(err) }

	res.status(204).send()
})

router.get('/cartdata', async (req, res) => {
	const { profile_id } = req.session.user

	try {
		const { rows: cartRows } = await query(`SELECT
		products.id,
		products.product_name,
		cart.amount,
		profiles.first_name,
		profiles.last_name
		FROM cart
		INNER JOIN products ON cart.product_id = products.id
		INNER JOIN profiles ON products.created_by = profiles.id
		WHERE cart.profile_id = $1
		ORDER BY 1 ASC`, [profile_id])

		res.json(cartRows)
	} catch (err) { console.log(err) }
})

router.get('/getcartjs', async (req, res) => {
	res.sendFile(path.join(__dirname, '/getCart.js'))
})

module.exports = {
	router
}

const Router = require('express-promise-router')
const path = require('path')
const { query } = require('../../db/index')

const router = new Router()

router.get('/placeorder', async (req, res) => {
	try {
		const { rows: cartRows } = await query('SELECT * FROM cart WHERE profile_id = $1', [req.session.user.profile_id])
		if (!cartRows[0]) {
			res.status(404).send()
		} else {
			res.sendFile(path.join(__dirname, '/place_order.html'))
		}
	} catch (err) { console.log(err) }
})

router.post('/placeorder', async (req, res) => {
	const { payment_method } = req.body
	const profileId = req.session.user.profile_id

	try {
	// Get all necessary data from cart table
	const { rows: cartRows } = await query('SELECT product_id, amount FROM cart WHERE profile_id = $1', [profileId])

	// Create record in orders table
	for (const product of cartRows) {
	await query(`INSERT INTO orders (
		profile_id,
		product_id,
		amount,
		payment_method,
		status
	) VALUES ($1, $2, $3, $4, $5)`, [
		profileId,
		product.product_id,
		product.amount,
		payment_method,
		'ordered'])
	}
	
	// Delete records in cart
	await query('DELETE FROM cart WHERE profile_id = $1', [profileId])
	} catch (err) { console.log(err) }

	res.redirect('/cart')
})

module.exports = {
	router
}

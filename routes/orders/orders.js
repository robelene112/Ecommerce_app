const Router = require('express-promise-router')
const path = require('path')
const { query } = require('../../db/index')

const router = new Router()

/**
 * @swagger
 * /orders:
 *   get:
 *     security:
 *       - SessionAuth: []
 *     summary: Retrieve the orders page.
 *     description: Returns the orders.html page for the user to view their order history.
 *     responses:
 *       200:
 *         description: Successfully retrieved orders page.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 * 
 * /orders/placeorder:
 *   get:
 *     security:
 *       - SessionAuth: []
 *     summary: View the place order page.
 *     description: Returns the place_order.html page if the user has items in their cart, otherwise returns a 404.
 *     responses:
 *       200:
 *         description: Successfully retrieved place order page.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       404:
 *         description: No items in the cart.
 * 
 *   post:
 *     security:
 *       - SessionAuth: []
 *     summary: Place an order.
 *     description: Places an order for all items in the user's cart and redirects to the cart page.
 *     parameters:
 *       - in: body
 *         name: order
 *         description: The payment method for the order.
 *         schema:
 *           type: object
 *           required:
 *             - payment_method
 *           properties:
 *             payment_method:
 *               type: string
 *               description: The method of payment for the order.
 *     responses:
 *       302:
 *         description: Successfully placed order and redirected to cart page.
 * 
 * /orders/getordersjs:
 *   get:
 *     security:
 *       - SessionAuth: []
 *     summary: Retrieve the getOrders.js script.
 *     description: Returns the getOrders.js script for client-side order functionality.
 *     responses:
 *       200:
 *         description: Successfully retrieved getOrders.js script.
 *         content:
 *           application/javascript:
 *             schema:
 *               type: string
 * 
 * /orders/orderdata:
 *   get:
 *     security:
 *       - SessionAuth: []
 *     summary: Fetch order data for the user.
 *     description: Returns a JSON array of the user's order data.
 *     responses:
 *       200:
 *         description: Successfully retrieved order data.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   order_date:
 *                     type: string
 *                   order_time:
 *                     type: string
 *                   payment_method:
 *                     type: string
 *                   status:
 *                     type: string
 */
router.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '/orders.html'))
})

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

router.get('/getordersjs', (req, res) => {
	res.sendFile(path.join(__dirname, '/getOrders.js'))
})

router.get('/orderdata', async (req, res) => {
	const { rows: orderRows } = await query('SELECT id, order_date, order_time, payment_method, status FROM orders WHERE profile_id = $1 ORDER BY id', [req.session.user.profile_id])
	res.json(orderRows)
})

module.exports = {
	router
}

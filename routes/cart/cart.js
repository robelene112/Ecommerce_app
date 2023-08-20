const Router = require('express-promise-router')
const path = require('path')
const { query } = require('../../db/index')

const router = new Router()

router.post('/', async (req, res) => {
	const { productId } = req.body
	console.log(req.body)
	console.log(productId)
	
	// Check if product was already added if so, remove the item.
	const { rows: cartRows } = await query('SELECT * FROM cart WHERE profile_id = $1 AND $2 = ANY(product_ids)', [req.session.user.profile_id, productId])
	if (cartRows[0]) {
		await query('UPDATE cart SET product_ids = array_remove(product_ids, $1) WHERE profile_id = $2', [productId, req.session.user.profile_id])
	} else {
		await query("UPDATE cart SET product_ids = array_append(product_ids, $1) WHERE profile_id = $2", [productId, req.session.user.profile_id]);
	}

	res.status(204).send()
})

module.exports = {
	router
}

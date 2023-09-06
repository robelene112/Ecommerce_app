const Router = require('express-promise-router')
const path = require('path')
const { query } = require('../../db/index')

const router = new Router()

router.get('/placeorder', (req, res) => {
	res.sendFile(path.join(__dirname, '/place_order.html'))
})

module.exports = {
	router
}

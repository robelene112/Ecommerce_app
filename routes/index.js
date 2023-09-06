const { router: usersRouter } = require('./users/users')
const { router: profileRouter } = require('./profile/profile')
const { router: productsRouter } = require('./products/products')
const { router: cartRouter } = require('./cart/cart')
const { router: ordersRouter } = require('./orders/orders')

function ensureAuthenticated(req, res, next) {
	if (req.session.authenticated) {
		return next()
	} else {
		res.send('Not logged in yet')
	}
}

function mountRouters(app) {
	app.use('/', usersRouter)
	app.use(ensureAuthenticated)
	app.use('/profile', profileRouter)
	app.use('/products', productsRouter)
	app.use('/cart', cartRouter)
	app.use('/orders', ordersRouter)
}

module.exports = {
	mountRouters
} 

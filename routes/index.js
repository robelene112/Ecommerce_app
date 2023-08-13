const { router: usersRouter } = require('./users/users')
const { router: profileRouter } = require('./profile/profile')
const { router: productsRouter } = require('./products/products')

function ensureAuthenticated(req, res, next) {
    if (req.session.authenticated) {
        return next()
    } else {
        res.send('Not logged in yet')
    }
}

const mountRouters = (app) => {
    app.use('/', usersRouter)
    app.use(ensureAuthenticated)
    app.use('/profile', profileRouter)
    app.use('/products', productsRouter)
}

module.exports = {
    mountRouters
} 

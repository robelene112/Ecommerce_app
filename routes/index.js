const { router } = require('./users/users')

const mountRouters = (app) => {
    app.use('/users', router)
}

module.exports = {
    mountRouters
} 

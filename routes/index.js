const { router: usersRouter } = require('./users/users')
const { router: profileRouter } = require('./profile/profile')

const mountRouters = (app) => {
    app.use('/users', usersRouter)
    app.use('/profile', profileRouter)
}

module.exports = {
    mountRouters
} 

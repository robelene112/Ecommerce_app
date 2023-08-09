const Router = require('express-promise-router')
const path = require('path')

const router = new Router()

function ensureAuthenticated(req, res, next) {
    if (req.session.authenticated) {
        return next()
    } else {
        res.send('Not logged in yet')
    }
}

router.get('/', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '/profile.html'))
})

router.put('/', ensureAuthenticated, (req, res) => {
     
})

module.exports = {
    router
}

const Router = require('express-promise-router')
const path = require('path')

const router = new Router()

function ensureAuthenticated(req, res, next) {
    console.log('In ensureAuthenticated:')
    console.log(req.session)
    if (req.session.authenticated) {
        return next()
    } else {
        res.send('Not logged in yet')
    }
}

router.get('/', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '/profile.html'))
})

router.get('/userprofile', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, './user_profile/user_profile.html')) 
})

module.exports = {
    router
}

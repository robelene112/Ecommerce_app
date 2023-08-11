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

router.get('/userinfo', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, './user_profile/user_profile.html')) 
})

router.post('/userinfo', ensureAuthenticated, (req, res) => {
    const {
        username,
        password,
        first_name,
        last_name,
        street,
        number,
        city,
        zip_code
    } = req.body
    console.log(req.body)
    res.sendFile(path.join(__dirname, '/profile.html'))
})

router.get('/profilejs', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, './user_profile/user_profile.js')) 
})

router.get('/cookiedata', ensureAuthenticated, (req, res) => {
    const sessionData = req.session.user
    console.log(req.session.user)
    res.json(sessionData)
})

module.exports = {
    router
}

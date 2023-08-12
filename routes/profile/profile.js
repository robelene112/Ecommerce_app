const Router = require('express-promise-router')
const path = require('path')
const { query } = require('../../db/index')

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

router.delete('/', ensureAuthenticated, async (req, res) => {
    // Remove user from database
    const userId = req.session.user.id
    const profileId = req.session.user.profile_id
    await query('DELETE FROM users WHERE id = $1', [userId])
    await query('DELETE FROM profiles WHERE id = $1', [profileId])

    // Clear session data
    req.session.destroy((err) => {
        if (err) throw err
        // Redirect back to login page, mostly handled in client-side javascript
        res.status(204).send()
    })
})

router.get('/userinfo', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, './user_profile/user_profile.html'))
})

router.post('/userinfo', ensureAuthenticated, async (req, res) => {
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
    await query('UPDATE users SET username = $1, password = $2', [username, password])
    await query(`UPDATE profiles SET
        first_name = $1,
        last_name = $2,
        street = $3,
        number = $4,
        city = $5,
        zip_code = $6`, [first_name, last_name, street, number, city, zip_code])
    res.redirect('/profile')
})

router.get('/profilejs', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, './user_profile/user_profile.js'))
})

router.get('/deleteaccountjs', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, './delete_account.js'))
})

router.get('/cookiedata', ensureAuthenticated, (req, res) => {
    const sessionData = req.session.user
    res.json(sessionData)
})

module.exports = {
    router
}

const Router = require('express-promise-router')
const { query } = require('../../db/index.js')
const path = require('path')

const router = new Router()

router.get('/', async (req, res) => {
    const { rows: userRows } = await query('SELECT * FROM users')
    const { rows: profileRows } = await query('SELECT * FROM profiles')
    res.json({ users: userRows, profiles: profileRows })
})

router.get('/login', async (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err
        res.sendFile(path.join(__dirname, '/login.html'))
    })
})

router.post('/login', async (req, res) => {
    // Authenticate user
    const { username, password } = req.body
    const { rows: userRows } = await query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password])
    if (!userRows[0]) {
        return res.status(403).send('Wrong username/password, please refresh the page and try again.')
    }

    // Get additional profile information
    const { rows: profileRows } = await query('SELECT * FROM profiles WHERE id = $1', [userRows[0].profile_id])
    const { 
            first_name,
            last_name,
            street,
            number,
            city,
            zip_code
        } = profileRows[0]
    // Populate session data
    req.session.authenticated = true
    req.session.user = {
        id: userRows[0].id,
        profile_id: userRows[0].profile_id,
        username,
        password,
        first_name,
        last_name,
        street,
        number,
        city,
        zip_code
    }

    // Redirect to user profile
    res.redirect('/profile')
})

router.get('/register', async (req, res) => {
    res.sendFile(path.join(__dirname, '/register.html'))
})

router.post('/register', async (req, res) => {
    const {
        username,
        password,
        firstName,
        lastName,
        street,
        number,
        city,
        zipCode
    } = req.body

    // Check if user already exists
    const { rows: userRows } = await query('SELECT username FROM users WHERE username = $1', [username])
    if (userRows[0]) {
        return res.send('Username already exists.')
    }

    // Create records in the 'users' and in the 'profiles' tables.
    await query('INSERT INTO profiles (first_name, last_name, street, number, city, zip_code) VALUES ($1, $2, $3, $4, $5, $6)', [firstName, lastName, street, number, city, zipCode])
    const { rows: profileRows } = await query('SELECT id FROM profiles WHERE first_name = $1 AND last_name = $2 AND street = $3', [firstName, lastName, street])
    await query('INSERT INTO users (username, password, profile_id) VALUES ($1, $2, $3)', [username, password, profileRows[0].id])

    // Redirect back to login page
    res.redirect('/users/login')
})

module.exports = {
    router
}


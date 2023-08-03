const Router = require('express-promise-router')
const { query } = require('../../db/index.js')
const path = require('path')

const router = new Router()

router.get('/', async (req, res) => {
    const { rows } = await query('SELECT * FROM users')
    res.send(rows)
})

router.get('/login', async (req, res) => {
    res.sendFile(path.join(__dirname, '/login.html'))
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body
    const { rows } = await query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password])
    if (!rows[0]) {
        return res.status(401).send('Wrong username/password, please refresh the page and try again.')
    }
    return res.send('Succes!')
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
    await query('INSERT INTO profiles (first_name, last_name, street, number, city, zip_code) VALUES ($1, $2, $3, $4, $5, $6)', [firstName, lastName, street, number, city, zipCode])
    const { rows } = await query('SELECT id FROM profiles WHERE first_name = $1 AND last_name = $2 AND street = $3', [firstName, lastName, street])
    await query('INSERT INTO users (username, password, profile_id) VALUES ($1, $2, $3)', [username, password, rows[0].id])
    res.redirect('/users/login')
})

module.exports = {
    router
}


const Router = require('express-promise-router')
const { query } = require('../../db/index.js')
const path = require('path')

const router = new Router()

router.get('/', (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err
        res.sendFile(path.join(__dirname, '/login.html'))
    })
})

router.post('/', async (req, res) => {
    try {
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
    } catch (err) {
        console.log(err)
    }

    // Redirect to user profile
    res.redirect('/profile')
})

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '/register.html'))
})

router.post('/register', async (req, res) => {
    const {
        username,
        password,
        first_name,
        last_name,
        street,
        number,
        city,
        zipCode
    } = req.body

    try {
        // Check if user already exists
        const { rows: userRows } = await query(`
			SELECT users.username, profiles.first_name, profiles.last_name, profiles.street
			FROM users INNER JOIN profiles
			ON users.profile_id = profiles.id
			WHERE users.username = $1
			OR (profiles.first_name = $2 AND profiles.last_name = $3)`,
			[username, first_name, last_name])

        if (userRows[0]) {
            return res.send('Username or profile already exists.')
        }

        // Create records in the 'users' and in the 'profiles' tables.
        await query('INSERT INTO profiles (first_name, last_name, street, number, city, zip_code) VALUES ($1, $2, $3, $4, $5, $6)', [first_name, last_name, street, number, city, zipCode])
        const { rows: profileRows } = await query('SELECT id FROM profiles WHERE first_name = $1 AND last_name = $2 AND street = $3', [first_name, last_name, street])
        await query('INSERT INTO users (username, password, profile_id) VALUES ($1, $2, $3)', [username, password, profileRows[0].id])
		await query("INSERT INTO cart (product_ids, profile_id) VALUES ('{}', $1)", [profileRows[0].id])
    } catch (err) {
        console.log(err)
    }

    // Redirect back to login page
    res.redirect('/')
})

module.exports = {
    router
}


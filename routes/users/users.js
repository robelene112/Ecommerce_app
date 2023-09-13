const Router = require('express-promise-router')
const { query } = require('../../db/index.js')
const path = require('path')

const router = new Router()

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Log out and retrieve the login page.
 *     description: Destroys the user's session and returns the login.html page.
 *     responses:
 *       200:
 *         description: Successfully logged out and retrieved login page.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 * 
 *   post:
 *     summary: Authenticate and log in a user.
 *     description: Authenticates the user based on the provided username and password, then redirects to the user's profile.
 *     parameters:
 *       - in: body
 *         name: user
 *         description: The user's login details.
 *         schema:
 *           type: object
 *           required:
 *             - username
 *             - password
 *           properties:
 *             username:
 *               type: string
 *               description: The username of the user.
 *             password:
 *               type: string
 *               description: The password of the user.
 *     responses:
 *       302:
 *         description: Successfully authenticated and redirected to profile page.
 *       403:
 *         description: Authentication failed.
 * 
 * /users/register:
 *   get:
 *     summary: Retrieve the user registration page.
 *     description: Returns the register.html page for new users to register.
 *     responses:
 *       200:
 *         description: Successfully retrieved registration page.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 * 
 *   post:
 *     summary: Register a new user.
 *     description: Registers a new user based on the provided details and redirects to the login page.
 *     parameters:
 *       - in: body
 *         name: user
 *         description: The new user's registration details.
 *         schema:
 *           type: object
 *           required:
 *             - username
 *             - password
 *             - first_name
 *             - last_name
 *             - street
 *             - number
 *             - city
 *             - zipCode
 *           properties:
 *             username:
 *               type: string
 *               description: Desired username for the new user.
 *             password:
 *               type: string
 *               description: Desired password for the new user.
 *             first_name:
 *               type: string
 *             last_name:
 *               type: string
 *             street:
 *               type: string
 *             number:
 *               type: string
 *             city:
 *               type: string
 *             zipCode:
 *               type: string
 *     responses:
 *       302:
 *         description: Successfully registered and redirected to login page.
 *       400:
 *         description: Registration failed (e.g., user already exists).
 */
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
    } catch (err) {
        console.log(err)
    }

    // Redirect back to login page
    res.redirect('/')
})

module.exports = {
    router
}


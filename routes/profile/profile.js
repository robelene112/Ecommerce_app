const Router = require('express-promise-router')
const path = require('path')
const { query } = require('../../db/index')

const router = new Router()

router.get('/', (req, res) => {
	console.log(req.session.user)
	res.sendFile(path.join(__dirname, '/profile.html'))
})

router.delete('/', async (req, res) => {
	try {
		// Remove user from database
		const profileId = req.session.user.profile_id
		await query('DELETE FROM users WHERE profile_id = $1', [profileId])
		await query('DELETE FROM products WHERE created_by = $1', [profileId])
		await query('DELETE FROM profiles WHERE id = $1', [profileId])
		await query('DELETE FROM cart WHERE profile_id = $1', [profileId])
	} catch (err) {
		console.log(err)
	}
	// Clear session data
	req.session.destroy((err) => {
		if (err) throw err
		// Redirect back to login page, mostly handled in client-side javascript
		res.status(204).send()
	})
})

router.get('/userinfo', (req, res) => {
	res.sendFile(path.join(__dirname, './user_profile/user_profile.html'))
})

router.post('/userinfo', async (req, res) => {
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
	try {
		// Check if username already exists
		const { rows: userRows } = await query('SELECT * FROM users WHERE username = $1 AND profile_id != $2', [username, req.session.user.profile_id])

		if (userRows[0]) {
			return res.send('Username already taken.')
		}

		const { rows: profileRows } = await query(`SELECT * FROM profiles WHERE
			first_name = $1 AND
			last_name = $2 AND
			street = $3 AND
			id != $4`, [first_name, last_name, street, req.session.user.profile_id])

		if (profileRows[0]) {
			return res.send('Combination of first name, last name and street already taken.')
		}

		// Update database
		await query('UPDATE users SET username = $1, password = $2 WHERE username = $3',
			[username, password, req.session.user.username])
		await query(`UPDATE profiles SET
        first_name = $1,
        last_name = $2,
        street = $3,
        number = $4,
        city = $5,
        zip_code = $6
		WHERE
		first_name = $7 AND
		last_name = $8 AND
		street = $9`, [first_name, last_name, street, number, city, zip_code, req.session.user.first_name, req.session.user.last_name, req.session.user.street])

		// Update session data
		req.session.user = {
			id: req.session.user.id,
			profile_id: req.session.user.profile_id,
			username,
			password,
			first_name,
			last_name,
			street,
			number,
			city,
			zip_code
		}

		// Redirect to profile page
		res.redirect('/profile')
	} catch (err) {
		console.log(err)
	}
})

router.get('/profilejs', (req, res) => {
	res.sendFile(path.join(__dirname, './user_profile/user_profile.js'))
})

router.get('/deleteaccountjs', (req, res) => {
	res.sendFile(path.join(__dirname, './delete_account.js'))
})

router.get('/cookiedata', (req, res) => {
	const sessionData = req.session.user
	res.json(sessionData)
})

module.exports = {
	router
}

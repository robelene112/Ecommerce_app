const express = require('express')
const session = require('express-session')
const { mountRouters } = require('./routes/index.js')
const path = require('path')
require('dotenv').config()

// Setup express app
const app = express()
const port = 3000

// Parse requests and populate req.body
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Setup express session
const store = new session.MemoryStore()

app.use(session({
	saveUninitialized: false,   // Do not save uninitialized sessions
	resave: false,              // Do not save unmodified sessions  
	secret: process.env.SECRET,
	store,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 7, // Cookie expires in a week
		secure: false,           // Cookies are not solely sent through HTTPS
		httpOnly: false,
		sameSite: 'none'        // Ensure cookies work cross-site
	}
}))

// Mount routes
mountRouters(app)

app.listen(port, "0.0.0.0", (err) => {
	if (err) throw err
	console.log(`Server listening on port: ${port}`)
})

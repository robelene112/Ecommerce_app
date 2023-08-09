const express = require('express')
const session = require('express-session')
const { mountRouters } = require('./routes/index.js')
require('dotenv').config()

// Setup express app
const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({extended: true}))

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
        sameSite: 'none'        // Ensure cookies work cross-site
    }
}))

// Mount routes
mountRouters(app)

app.listen(port, () => {
    console.log(`Server listening on port: ${port}`)
})

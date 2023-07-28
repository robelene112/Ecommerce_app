const express = require('express')
const path = require('node:path')
const { getAllUsers } = require('./routes/users/users.js')

const app = express()
const port = 3000

app.get('/', (req, res) => {
   console.log("'/' was requested")
   res.sendFile(path.join(__dirname, '/routes/login/login.html'))
})

app.get('/users', getAllUsers)

app.listen(port, () => {
    console.log(`Server listening on port: ${port}`)
})

const express = require('express')
const path = require('path')
const { getAllUsers } = require('./routes/users/users.js')
const { getRegister, postRegister } = require('./routes/register/register.js')
const { getLogin, postLogin } = require('./routes/login/login.js')

const app = express()
const port = 3000

app.use(express.urlencoded({extended: true}))

app.get('/login', getLogin) 
app.post('/login', postLogin)

app.get('/users', getAllUsers)

app.get('/register', getRegister)
app.post('/register', postRegister)

app.listen(port, () => {
    console.log(`Server listening on port: ${port}`)
})

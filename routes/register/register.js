const { query } = require('../../db/index.js')
const path = require('path')

function getRegister(req, res) {
    res.sendFile(path.join(__dirname, './register.html'))
}

function postRegister(req, res) {
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
   query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, password], (err, results) => {
        if (err) { throw err }
   })
   query('INSERT INTO profiles (first_name, last_name, street, number, city, zip_code) VALUES ($1, $2, $3, $4, $5, $6)', [firstName, lastName, street, number, city, zipCode], (err, results) => {
        if (err) { throw err }
   })
    res.redirect('/login')
}

module.exports = {
	getRegister,
	postRegister
}

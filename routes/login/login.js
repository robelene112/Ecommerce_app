const path = require('path') 
const { query } = require('../../db/index.js')

function getLogin(req, res) {
    console.log("'/' was requested")
    res.sendFile(path.join(__dirname, './login.html'))
}

function postLogin(req, res) {
    const {username, password} = req.body
    console.log('username, password')
    console.log(username, password)
    query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password], (err, results) =>{
        if (err) throw { err } 
        if (results.rows.length === 0) {
            console.log('hereeee')
            return res.status(401).send('Wrong username and/or password!')
        } 
        console.log('results:')
        console.log(results.rows)
        res.status(200).send('succes')
    })
}

module.exports = {
    getLogin,
    postLogin
}

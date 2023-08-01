const { query } = require('../../db/index.js')

function getAllUsers(req, res) {
    query(`SELECT * FROM users`, [], (err, results) => {
    	if (err) { throw err }
	res.status(200).send(results.rows)
    })
}

function createUser(req, res) {
    
}

module.exports = {
	getAllUsers
}

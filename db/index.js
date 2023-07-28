const Pool = require('pg').Pool
const env = require('dotenv').config()
 
const pool = new Pool({
    user: process.env.USERNAME,
    host: 'localhost',
    database: 'ecommerce',
    password: process.env.PASSWORD,
    port: 5432
})
 
const query = (text, params, callback) => {
  return pool.query(text, params, callback)
}

module.exports = {
	query
}

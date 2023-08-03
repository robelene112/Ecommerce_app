const Pool = require('pg').Pool
require('dotenv').config()

const pool = new Pool({
    user: process.env.USERNAME,
    host: 'localhost',
    database: 'ecommerce',
    password: process.env.PASSWORD,
    port: 5432
})

const query = (text, params) => { return pool.query(text, params) }

module.exports = {
    query
} 

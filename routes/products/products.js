const Router = require('express-promise-router')
const path = require('path')
const { query } = require('../../db/index')

const router = new Router()

router.get('/', async (req, res) => {
    const { username } = req.session.user
    const { rows: productRows } = await query('SELECT * FROM products WHERE created_by = $1', [username])
    res.sendFile(path.join(__dirname, '/products.html'))
})

router.get('/create', (req, res) => {
    res.sendFile(path.join(__dirname, '/create_product.html'))
})

/*
router.post('/create', async (req, res) => {
    
})
*/

router.get('/productsjs', (req, res) => {
    res.sendFile(path.join(__dirname, './getProducts.js'))
})

router.get('/productdata', async (req, res) => {
    const { username } = req.session.user
    const { rows: productRows } = await query('SELECT id, product_name, stock FROM products WHERE created_by = $1', [username])
    res.json(productRows)
})

module.exports = {
    router
}

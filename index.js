const express = require('express')
const { mountRouters } = require('./routes/index.js')

const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({extended: true}))

mountRouters(app)

app.listen(port, () => {
    console.log(`Server listening on port: ${port}`)
})

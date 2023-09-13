const express = require('express')
const session = require('express-session')
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { mountRouters } = require('./routes/index.js')
const path = require('path')
require('dotenv').config()

// Setup express app
const app = express()
const port = 3000

// Setup documentation with swagger
const swaggerOptions = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Ecommerce API",
			version: "1.0.0",
			description: "A simple ecommerce API where users can add new products and buy eachothers products",
		},
		servers: [
			{
				url: "http://localhost:3000",
			},
		],
	},
	components: {
		securitySchemes: {
			SessionAuth: {  
				type: 'apiKey',
				in: 'cookie',
				name: 'sessionid'  
			}
		}
	},
	apis: [
		"./routes/cart/cart.js",
		"./routes/orders/orders.js",
		"./routes/products/products.js",
		"./routes/profile/profile.js",
		"./routes/users/users.js"
	],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Parse requests and populate req.body
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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
		httpOnly: false,		// The cookie can only be accessed by the server
		sameSite: 'none'        // Ensure cookies work cross-site
	}
}))

// Mount routes
mountRouters(app)

app.listen(port, "0.0.0.0", (err) => {
	if (err) throw err
	console.log(`Server listening on port: ${port}`)
})

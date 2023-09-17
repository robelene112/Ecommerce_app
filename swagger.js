const cartSwagger = require('./routes/cart/cart.swagger.json')
const ordersSwagger = require('./routes/orders/orders.swagger.json')
const productsSwagger = require('./routes/products/products.swagger.json')
const profileSwagger = require('./routes/profile/profile.swagger.json')
const usersSwagger = require('./routes/users/users.swagger.json')
const util = require('util')

const swaggerOptions = {
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
	apis: [
		"./routes/cart/cart.js",
		"./routes/orders/orders.js",
		"./routes/products/products.js",
		"./routes/profile/profile.js",
		"./routes/users/users.js"
	],
};

const combinedSwagger = {
	...swaggerOptions,
	paths: {
		...cartSwagger,
		...ordersSwagger,
		...productsSwagger,
		...profileSwagger,
		...usersSwagger
	}
}

module.exports = combinedSwagger

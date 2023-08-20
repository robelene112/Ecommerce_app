async function main() {
	const allProducts = await getProducts()
	const cartData = await getCart()
	const productIds = cartData[0].product_ids

	const tableBody = document.getElementsByTagName('tbody')[0]

	for (i = 0; i < allProducts.length; i++) {
		console.log(allProducts[i])
		const tableRow = createTableRow(allProducts[i], productIds)
        tableRow.lastElementChild.textContent = productIds.includes(parseInt(tableRow.firstElementChild.textContent)) ? 'Remove' : 'Add to cart'
		tableBody.appendChild(tableRow)
	}
}

async function getProducts() {
	try {
		const response = await fetch('http://localhost:3000/products/allproductdata')
		return await response.json()
	} catch (err) {
		console.log(err)
	}
}

async function getCart() {
	try {
		const response = await fetch('http://localhost:3000/cart/cartdata')
		return await response.json()
	} catch (err) {
		console.log(err)
	}
}

function createTableRow(productObject) {
	const newTableRow = document.createElement('tr')

	const createCell = (text) => {
		const td = document.createElement('td')
		td.textContent = text
		return td
	}

	const createButtonCell = () => {
		const button = document.createElement('button')
		// button.textContent = productIds.includes(button.parentElement.firstElementChild.textContent) ? 'Remove' : 'Add to cart'

		button.addEventListener('click', async (event) => {
			event.preventDefault()

            // Change text depending on whether we're removing or adding to the cart
            if (event.target.textContent === 'Add to cart') {
                event.target.textContent = 'Remove'
            } else {
                event.target.textContent = 'Add to cart'
            }

			// Send the productId to the server
			try {
				await fetch('http://localhost:3000/cart', {
					method: 'POST',
					body: JSON.stringify({ productId: event.target.parentElement.firstElementChild.textContent }),
					headers: {
						"Content-Type": "application/json"
					}

				})
			} catch (err) { console.log(err) }
		})

		return button
	}

	newTableRow.appendChild(createCell(productObject.id))
	newTableRow.appendChild(createCell(productObject.product_name))
	newTableRow.appendChild(createCell(productObject.stock))
	newTableRow.appendChild(createCell(productObject.first_name + ' ' + productObject.last_name))
	newTableRow.appendChild(createButtonCell())
	return newTableRow
}

document.getElementById('back-button').addEventListener('click', (event) => {
	event.preventDefault()
	window.location.href = 'http://localhost:3000/products'
})

main().then().catch((err) => { console.log(err) })

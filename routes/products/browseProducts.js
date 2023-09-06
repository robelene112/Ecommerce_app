async function main() {
	const allProducts = await getProducts()

	const tableBody = document.getElementsByTagName('tbody')[0]

	for (i = 0; i < allProducts.length; i++) {
		console.log(allProducts[i])
		const tableRow = createTableRow(allProducts[i])
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

function createTableRow(productObject) {
	const newTableRow = document.createElement('tr')

	const createCell = (text) => {
		const td = document.createElement('td')
		td.textContent = text
		return td
	}

	const createInputCell = () => {
		const input = document.createElement('input')
		input.setAttribute('type', 'number')
		return input
	}

	const createButtonCell = (text) => {
		const button = document.createElement('button')
		button.textContent = text

		button.addEventListener('click', async (event) => {
			event.preventDefault()

			// Send the productId to the server
			try {
				const productId = event.target.parentElement.firstElementChild.textContent 
				const amount = event.target.parentElement.childNodes[4].value
				console.log(amount)
				const response = await fetch('http://localhost:3000/cart', {
					method: 'POST',
					body: JSON.stringify({ productId, amount }),
					headers: {
						"Content-Type": "application/json"
					}
				})
				if (response.status === 400) {
					window.alert('The amount requested exceeded the stock available.')
				} else {
					location.reload()
				}
			} catch (err) { console.log(err) }
		})

		return button
	}

	newTableRow.appendChild(createCell(productObject.id))
	newTableRow.appendChild(createCell(productObject.product_name))
	newTableRow.appendChild(createCell(productObject.stock))
	newTableRow.appendChild(createCell(productObject.first_name + ' ' + productObject.last_name))
	newTableRow.appendChild(createInputCell())
	newTableRow.appendChild(createButtonCell('Add to cart'))
	newTableRow.appendChild(createButtonCell('Remove'))
	return newTableRow
}

document.getElementById('back-button').addEventListener('click', (event) => {
	event.preventDefault()
	window.location.href = 'http://localhost:3000/products'
})

main().then().catch((err) => { console.log(err) })

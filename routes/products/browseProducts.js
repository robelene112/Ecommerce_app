async function main() {
	const allProducts = await getProducts()

	const tableBody = document.getElementsByTagName('tbody')[0]

	for (i = 0; i < allProducts.length; i++) {
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

	const createButtonCell = () => {
		const button = document.createElement('button')
		button.textContent = 'Add to cart'
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

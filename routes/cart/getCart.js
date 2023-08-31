async function main() {
	const cart = await getCart()

	const tableBody = document.getElementsByTagName('tbody')[0]

	for (i=0; i < cart.length; i++) {
		const newTableRow = createTableRow(cart[i])
		tableBody.appendChild(newTableRow)

	}
}

async function getCart() {
	try {
		const response = await fetch('http://localhost:3000/cart/cartdata')
		const cart = await response.json()
		return cart
	} catch (err) { console.log(err) }
}

function createTableRow(cartProduct) {
	const newTableRow = document.createElement('tr')
	cartProduct.full_name = cartProduct.first_name + ' ' + cartProduct.last_name
	delete cartProduct['first_name']
	delete cartProduct['last_name']

	for (const key in cartProduct) {
		const newTableCell = document.createElement('td')
		newTableCell.textContent = cartProduct[key]
		newTableRow.appendChild(newTableCell)
	}

	return newTableRow
}

main().then().catch((err) => { console.log(err) })

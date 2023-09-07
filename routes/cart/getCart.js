async function main() {
	const cart = await getCart()

	const tableBody = document.getElementsByTagName('tbody')[0]

	for (i = 0; i < cart.length; i++) {
		const newTableRow = createTableRow(cart[i])
		tableBody.appendChild(newTableRow)
	}

	const deleteAllProductsButton = document.getElementById('delete-all')
	deleteAllProductsButton.addEventListener('click', deleteAllProductsHandler)

	const placeOrderButton = document.getElementById('place-order')
	placeOrderButton.addEventListener('click', placeOrderHandler)
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

	// Create input field for deletion
	const inputField = document.createElement('input')
	inputField.setAttribute('type', 'number')

	// Create delete button
	const deleteButton = document.createElement('button')
	deleteButton.textContent = 'Delete from cart'

	deleteButton.addEventListener('click', async (event) => {
		event.preventDefault()

		const inputFieldValue = parseInt(event.target.parentElement.children[4].value)
		const currentAmount = parseInt(event.target.parentElement.children[2].textContent)

		// Check if the amount user wishes to delete exceeds the current amount in the cart 
		const amountToDelete = inputFieldValue > currentAmount ? currentAmount : inputFieldValue
		const productId = event.target.parentElement.children[0].textContent

		if (typeof amountToDelete === 'NaN') {
			window.alert('Invalid input')
		} else {
			try {
				await fetch('http://localhost:3000/cart', {
					'method': 'PUT',
					'body': JSON.stringify({ amountToDelete, productId, currentAmount }),
					'headers': {
						'Content-Type': 'application/json'
					}
				})
				location.reload()
			} catch (err) { console.log(err) }
		}

	})

	// Append input field and button to table row
	newTableRow.appendChild(inputField)
	newTableRow.appendChild(deleteButton)

	return newTableRow
}

async function deleteAllProductsHandler(e) {
	e.preventDefault()

	const message = 'Are you sure you want to delete all products from your cart?'
	if (window.confirm(message)) {
		await fetch('http://localhost:3000/cart', {
			'method': 'DELETE',
		})
		location.reload()
	}
}

async function placeOrderHandler(e) {
	e.preventDefault()
	
	try {
		const res = await fetch('http://localhost:3000/orders/placeorder')
		if (res.status !== 200) {
			window.alert('Cart is empty')
		} else {
			const htmlContent = await res.text()
			document.body.innerHTML = htmlContent
		}
	} catch (err) { console.log(err) }
} 

main().then().catch((err) => { console.log(err) })

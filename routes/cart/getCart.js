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

	console.log('Keys: ')
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
					'body': JSON.stringify({amountToDelete, productId, currentAmount}),
					'headers': {
						'Content-Type': 'application/json'
					}
				})

			} catch (err) { console.log(err) }
			location.reload()
		}

	})

	// Append input field and button to table row
	newTableRow.appendChild(inputField)
	newTableRow.appendChild(deleteButton)

	return newTableRow
}

main().then().catch((err) => { console.log(err) })

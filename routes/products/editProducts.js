// populate input fields
const allInputElements = document.getElementsByTagName('input')

allInputElements[0].setAttribute('value', localStorage.productName)
allInputElements[1].setAttribute('value', localStorage.productStock)

allInputElements[2].addEventListener('click', async (event) => {
	event.preventDefault()
	try {
		const oldValues = {
			oldProductName: localStorage.productName,
			oldProductStock: localStorage.productStock
		}

		const newValues = {
			newProductName: allInputElements[0].value,
			newProductStock: allInputElements[1].value
		}
		await fetch('http://localhost:3000/products/edit', {
			method: 'POST',
			headers: {
				"Content-type": "application/json"
			},
			body: JSON.stringify({ oldValues, newValues })
		})

		window.location.href = 'http://localhost:3000/products'
	} catch (err) {
		console.log('Post error: ')
		console.log(err)
	}

})

document.getElementById('back-button')
	.addEventListener('click', () => { window.location.href = 'http://localhost:3000/products'})

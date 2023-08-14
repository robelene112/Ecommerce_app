async function main() {
	const productData = await getProducts() 

	const table = document.getElementsByTagName('tbody')[0]

	for (i = 0; i < productData.length; i++) {
		const tableRow = createTableRow(productData[i])
		table.appendChild(tableRow)
	}
}

async function getProducts() {
	try {
		const response = await fetch('http://localhost:3000/products/productdata')
		return await response.json()
	} catch (err) {
		console.log(err)
	}
}

function createTableRow(productObject) {
    const newTableRow = document.createElement('tr');

    const createCell = (text) => {
        const td = document.createElement('td');
        td.textContent = text;
        return td;
    };

    const createButtonCell = (text) => {
        const td = document.createElement('td');
        const button = document.createElement('button');

		// Add listener
		button.addEventListener('click', () => {
			if (text === 'Edit') {
			localStorage.setItem('productName', productObject.product_name)
			localStorage.setItem('productStock', productObject.stock)
			localStorage.setItem('productId', productObject.id)

			window.location.href = 'http://localhost:3000/products/edit'
			} else {
				const deleteProduct = window.confirm('Are you sure you want to delete this product?')
				if (deleteProduct) {
					console.log('Product deleted.')
				}
			}
		})


        button.textContent = text;
        td.appendChild(button);
        return td;
    };

    newTableRow.appendChild(createCell(productObject.id));
    newTableRow.appendChild(createCell(productObject.product_name));
    newTableRow.appendChild(createCell(productObject.stock));
    newTableRow.appendChild(createButtonCell('Edit'));
    newTableRow.appendChild(createButtonCell('Delete'));

    return newTableRow;
}


main().then().catch((err) => console.log(err))

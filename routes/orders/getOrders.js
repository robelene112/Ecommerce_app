async function main() {
	const data = await getOrderData()

	const tableBody = document.getElementsByTagName('tbody')[0]

	for (const order of data) {
		// create table row
		const newTableRow = createTableRow(order)
		// append table row
		tableBody.appendChild(newTableRow)
	}
}

function createTableRow(order) {
	const newTableRow = document.createElement('tr')

	const createCell = (orderData) => {
		const newCell = document.createElement('td')
		newCell.textContent = orderData
		return newCell
	}

	for (const key in order) {
		let newCell
		if (key === 'order_date') {
			newCell = createCell(order[key].split('T')[0])
		} else if (key === 'order_time') {
			newCell = createCell(order[key].split('.')[0])
		} else {
			newCell = createCell(order[key])
		}
		newTableRow.appendChild(newCell)
	}

	return newTableRow
}

async function getOrderData() {
	// fetch order data
	try {
	const res = await fetch('http://localhost:3000/orders/orderdata')
	if (res.status === 200) {
		// await json data
		const data = await res.json()
		return data
	}
	} catch (err) { console.log(err) }
	return {}
}

main().then().catch((err) => { console.log(err) })

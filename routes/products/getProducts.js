console.log('hiii')

async function getProducts() {
    try {
        const response = await fetch('http://localhost:3000/products/productdata')
        return await response.json() 
    } catch (err) {
        throw err
    }
}

function createTableRow(productObject) {
    let newTableRow = document.createElement('tr')

    let tdProductId = document.createElement('td')
    let tdProductName = document.createElement('td')
    let tdStock = document.createElement('td')

    const textProductId = document.createTextNode(productObject.id.toString())
    const textProductName = document.createTextNode(productObject.product_name)
    const textStock = document.createTextNode(productObject.stock.toString())

    tdProductId.appendChild(textProductId)
    tdProductName.appendChild(textProductName)
    tdStock.appendChild(textStock)

    newTableRow.appendChild(tdProductId)
    newTableRow.appendChild(tdProductName)
    newTableRow.appendChild(tdStock)  

    return newTableRow 
}

async function main() {
    const productData = await getProducts() // array -> object: product 1

    const table = document.getElementsByTagName('tbody')[0]

    for (i=0; i < productData.length; i++) {
        const tableRow = createTableRow(productData[i])
        table.appendChild(tableRow)
    }
}

main().then().catch((err) => console.log(err))

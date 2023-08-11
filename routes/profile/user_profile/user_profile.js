async function fetchCookieData() {
    try {
        const cookieData = await fetch('http://localhost:3000/profile/cookiedata')
        return await cookieData.json()
    } catch (err) {
        console.log(err)
    }
}

async function main() {
    // get user and profile data
    const userInfo = await fetchCookieData()

    // populate input fields
    const allInputElements = document.getElementsByTagName('input')

    allInputElements[0].setAttribute('value', userInfo.username)
    allInputElements[1].setAttribute('value', userInfo.password)
    allInputElements[2].setAttribute('value', userInfo.first_name)
    allInputElements[3].setAttribute('value', userInfo.last_name)
    allInputElements[4].setAttribute('value', userInfo.street)
    allInputElements[5].setAttribute('value', userInfo.number)
    allInputElements[6].setAttribute('value', userInfo.city)
    allInputElements[7].setAttribute('value', userInfo.zip_code)
}

main().then(() => {})



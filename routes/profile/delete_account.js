// Make button useful
const deleteButton = document.getElementsByClassName('delete-account')[0]

console.log('deleteButton + type: ')
console.log(deleteButton)
console.log(typeof deleteButton)

deleteButton.addEventListener('click', async () => {
    // Warn user
    const yesConfirm = window.confirm('Are you sure you want to delete your account?')


    console.log('yesConfirm + type: ')
    console.log(yesConfirm)
    console.log(typeof yesConfirm)
        
    // Delete account
    if (yesConfirm) {
        try {
            await fetch('http://localhost:3000/profile', { method: 'DELETE' })
            window.location.href = 'http://localhost:3000/users/login'
        } catch (err) {
            console.log(err) 
        }
    }
})


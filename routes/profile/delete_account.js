// Make button useful
const deleteButton = document.getElementsByClassName('delete-account')[0]

deleteButton.addEventListener('click', async () => {
    // Warn user
    const yesConfirm = window.confirm('Are you sure you want to delete your account?')

    // Delete account
    if (yesConfirm) {
        try {
            await fetch('http://localhost:3000/profile', { method: 'DELETE' })
            window.location.href = 'http://localhost:3000/'
        } catch (err) {
            console.log(err) 
        }
    }
})


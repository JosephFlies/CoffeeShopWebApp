document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const password = document.getElementById('admin-password').value;
    const messageElement = document.getElementById('login-message');
    
    try {
        const response = await fetch('https://coffeeshopwebapp.onrender.com/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });
        const data = await response.json();

        if(data.success) {
            localStorage.setItem('adminLoggedIn', 'true');
            messageElement.innerText = "Login Successfull! Page is loading...";
            messageElement.style.color = 'lightgreen';

            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 1500);
        } else {
            messageElement.innerText = "Password is wrong! ❌";
            messageElement.style.color = 'red';
        }
    } catch (error) {
        console.error("Login error:", error);
        messageElement.innerText = "You could not login to the server!";
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const coffeeForm = document.querySelector('form');

    if (coffeeForm) {
        coffeeForm.addEventListener('submit', async (e) => { 
            e.preventDefault();

            const nameInput = document.getElementById('full-name');
            const emailInput = document.getElementById('email');
            const nameError = document.getElementById('name-error');
            const emailError = document.getElementById('email-error');
            const successBox = document.getElementById('success-message');
            const successText = document.getElementById('success-text');

            let hasError = false;
            if(nameInput.value.trim().length < 3) {
                nameError.style.display = 'block';
                nameInput.classList.add('input-error');
                hasError = true;
            } else {
                nameError.style.display = 'none';
                nameInput.classList.remove('input-error');
            }

            const emailValue = emailInput.value.trim();
            if(emailValue === "" || !emailValue.includes('@') || !emailValue.includes('.')) {
                emailError.style.display = 'block';
                emailInput.classList.add('input-error');
                hasError = true;
            } else {
                emailError.style.display = 'none';
                emailInput.classList.remove('input-error');
            }

            if(hasError) return;

            const formData = {
                fullName: nameInput.value,
                email: emailInput.value
            };

            try {
                const response = await fetch('https://coffeeshopwebapp.onrender.com/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();
                const successBox = document.getElementById('success-message');
                const formContainer = document.getElementById('coffee-form');
                const errorElement = document.getElementById('general-error');
                const nameInput = document.getElementById('fullName');
                const successText = document.getElementById('success-text');
            if(!data.success) {
                errorElement.innerText = data.message;
                errorElement.style.display = 'block';
                successBox.style.display = 'none';
            } else {
                errorElement.style.display = 'none';
                successBox.style.display = 'block';
                const allChildren = coffeeForm.children;
                    for (let child of allChildren) {
                        if (child.id !== 'success-message') {
                            child.style.display = 'none';
                        }
                    }
                    successText.innerText = `Congratulations ${nameInput.value}! Your 50% discount is on the way. ☕`;
                    setTimeout(() => {
                    window.location.reload();
                }, 3000);
            }
            } catch (error) {
                console.error("Connection lost:", error);
                alert("You cannot connect to the server, please make sure to initialize the server.js!");
            }
        });
    }
});
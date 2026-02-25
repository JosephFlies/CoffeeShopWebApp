document.addEventListener('DOMContentLoaded', () => {
    const coffeeForm = document.querySelector('form');

    if (coffeeForm) {
        coffeeForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('full-name');
            const emailInput = document.getElementById('email');
            const nameError = document.getElementById('name-error');
            const emailError = document.getElementById('email-error');
            const successBox = document.getElementById('success-message');
            const successText = document.getElementById('success-text');

            let hasError = false;

            // 1. İsim Kontrolü (.value kullandık)
            if (nameInput.value.trim().length < 3) {
                nameError.style.display = 'block';
                nameInput.classList.add('input-error');
                hasError = true;
            } else {
                nameError.style.display = 'none';
                nameInput.classList.remove('input-error');
            }

            // 2. Email Kontrolü (Parantezler düzeltildi)
            const emailValue = emailInput.value.trim();
            if (emailValue === "" || !emailValue.includes('@') || !emailValue.includes('.')) {
                emailError.style.display = 'block';
                emailInput.classList.add('input-error');
                hasError = true;
            } else {
                emailError.style.display = 'none';
                emailInput.classList.remove('input-error');
            }

            // 3. Başarı Durumu (Başına ! ekledik, hata YOKSA çalışacak)
            if (!hasError) {
                const allChildren = coffeeForm.children;
                for (let child of allChildren) {
                    if (child.id !== 'success-message') {
                        child.style.display = 'none';
                    }
                }
                successBox.style.display = 'block';
                // Template literal kullanımı için backtick (`) kullandık
                successText.innerText = `Congratulations ${nameInput.value}! Your 50% discount is on the way. ☕`;
            }
        });
    }
});

fetch('/register', {
    method: 'POST',
    headers: {'Content-Type': 'application/json' },
    body: JSON.stringify({
        fullName: nameInput.value,
        email: emailInput.value
    })
})
.then(response => response.json())
.then(data => console.log("Answer coming from the server:", data))
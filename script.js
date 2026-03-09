document.addEventListener('DOMContentLoaded', () => {
    const coffeeForm = document.getElementById('coffee-form');
    // Diğer tüm kodların (submit event listener vb.) buranın içinde olmalı

coffeeForm.addEventListener('submit', async (e) => { 
    e.preventDefault();

    const nameInput = document.getElementById('full-name');
    const emailInput = document.getElementById('email');
    const errorElement = document.getElementById('general-error');
    const successBox = document.getElementById('success-message');
    const successText = document.getElementById('success-text'); // Bu satırı ekledik

    errorElement.style.display = 'none';
    errorElement.innerText = '';

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
    const errorElement = document.getElementById('general-error');
    const successBox = document.getElementById('success-message'); // ID'nin HTML ile aynı olduğundan emin ol
    const successText = document.getElementById('success-text');

    if (!data.success) {
        errorElement.innerText = data.message;
        errorElement.style.display = 'block';
    } else {
    // 1. Önce hata mesajı varsa gizle
    errorElement.style.display = 'none';

    // 2. Formun içindeki her şeyi (inputlar, butonlar, labellar) gizle
    // Ama success-message DIV'ine dokunma!
    const allChildren = coffeeForm.children;
    for (let child of allChildren) {
        if (child.id !== 'success-message') {
            child.style.display = 'none';
        }
    }

    // 3. Success kutusunu göster (Yeni CSS class'ını kullanarak)
    successBox.classList.add('show-success'); 
    
    // 4. Yazıyı güncelle
    const successText = document.getElementById('success-text');
    successText.innerText = `Congratulations ${nameInput.value}! Your 50% discount is on the way. ☕`;

    // 5. Bekle ve yenile
    setTimeout(() => {
        window.location.reload();
    }, 4000); // 4 saniye yapalım ki kullanıcı okuyabilsin
}
} catch (error) {
    console.error("Backend connection error:", error);
}
});
});
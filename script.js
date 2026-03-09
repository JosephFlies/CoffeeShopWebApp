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
        // FORM GİZLEME MANTIĞI
        // coffeeForm.style.display = 'none'; // Alternatif: Komple formu gizleyip kutuyu açabilirsin
        
        const allChildren = coffeeForm.children;
        for (let child of allChildren) {
            if (child.id !== 'success-message') {
                child.style.display = 'none';
            }
        }

        // Kutuyu göster ve mesajı yaz
        if (successBox && successText) {
            successBox.style.display = 'block';
            successText.innerText = `Congratulations ${nameInput.value}! ☕`;
            
            // 3 saniye bekle ve sonra yenile
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        } else {
            // Eğer successBox bulunamazsa en azından reload yapma ki hatayı görelim
            console.error("Success box or text element not found!");
        }
    }
} catch (error) {
    console.error("Backend connection error:", error);
}
});
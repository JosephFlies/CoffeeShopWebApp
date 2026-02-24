const coffeeForm = document.querySelector('form');

coffeeForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('full-name');
    if(nameInput) {
        const name = nameInput.value;
        alert("Congragulations " + name + "! Your 50% discount code has been sent to your email. Enjoy your coffee! ☕");
    } 
});
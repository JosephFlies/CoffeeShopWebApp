const validateRegister = (fullName, email) => {
    if(!fullName || fullName.trim().length === 0) {
        return { isValid: false, message: "Name cannot be blank." };
    }

    if(!fullName || fullName.trim().length < 3) {
        return { isValid: false, message: "Name should be at least 3 characters."};
    }
    if(fullName.length > 50) {
        return { isValid: false, message: "Name cannot be more than 50 characters."}
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!email || !emailPattern.test(email)) {
        return { isValid: false, message: "Unvalid email!" };
    }

    return { isValid: true };
};

module.exports = { validateRegister };
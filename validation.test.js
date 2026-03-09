const { validateRegister } = require('./utils/validator');

describe('Register Validation Tests', () => {
    test('An error occurs when name is too short', () => {
        const res = validateRegister("Ry", "ryuzaki@mail.com");
        expect(res.isValid).toBe(false);
        expect(res.message).toBe("Name should be at least 3 characters.");
    });

    test('An error occurs when typed unvalid email', () => {
        const res = validateRegister("Ryuzaki", "yanlis-mail");
        expect(res.isValid).toBe(false);
        expect(res.message).toBe("Unvalid email!")
    });

    test('isValid should be true if typed correct values', () => {
        const res = validateRegister("Ryuzaki", "ryuzaki@gmail.com");
        expect(res.isValid).toBe(true);
    });

    test('An error occurs when name is fully blank', () => {
        const res = validateRegister("   ", "ryuzaki@mail.com");
        expect(res.isValid).toBe(false);
        expect(res.message).toBe("Name cannot be blank.");
    });
});
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const { validateRegister } = require('./utils/validator');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/')));

const PORT = process.env.PORT || 3000;
const dbURI = process.env.MONGO_URI;

mongoose.connect(dbURI, { dbName: 'CoffeeDB' })
  .then(() => console.log("Perfect, successfully connected to MongoDB! 🚀"))
  .catch(err => console.log("Connection Error Details:", err.message));

const userSchema = new mongoose.Schema({
    fullName: String,
    email: { type: String, unique: true },
    coffeeChoice: String, // Şemaya bunları da ekledik ki DB boş kalmasın
    expectations: String,
    date: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// TEK VE TEMİZ REGISTER ROTASI
app.post('/register', async (req, res) => {
    try {
        const { fullName, email, coffeeChoice, expectations } = req.body;

        // 1. Validator.js kontrolü
        const validation = validateRegister(fullName, email);
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                message: validation.message
            });
        }

        // 2. Veritabanı Kaydı
        const newUser = new User({
            fullName: fullName.trim(),
            email: email.trim().toLowerCase(),
            coffeeChoice,
            expectations
        });

        await newUser.save();
        
        res.status(201).json({
            success: true,
            message: "Registration successful!"
        });

    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ success: false, message: "This email is already registered!" });
        }
        console.error("Registration error:", err);
        res.status(500).json({ success: false, message: "Server error occurred." });
    }
});

// Admin login ve Admin users kısımları aynı kalabilir...
app.post('/admin/login', (req, res) => {
    const {password} = req.body;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Ryuzaki123";
    if (password === ADMIN_PASSWORD) {
        res.status(200).json ({ message: "Login Successfull!", success: true });
    } else {
        res.status(401).json({ message: "Wrong password!", success: false });
    }
});

app.get('/admin/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ status: "fail", message: err.message });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Your server is working! ✨ Port: ${PORT}`);
});
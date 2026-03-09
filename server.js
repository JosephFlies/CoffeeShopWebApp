require('dotenv').config();
console.log("=== RENDER SUNUCUSU CALISIYOR - LOG TESTI ===");
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const { validateRegister } = require('./utils/validator');
const app = express();
app.use(cors());

// Render portu otomatik atar, yoksa 3000 kullanır
const PORT = process.env.PORT || 3000;

// Render'daki Environment Variables'dan çekiyoruz
const dbURI = process.env.MONGO_URI;

// Veritabanı bağlantısı
mongoose.connect(dbURI, {dbName: 'CoffeeDB' })
  .then(() => {
    console.log("Perfect, successfully connected to MongoDB! 🚀");
  })
  .catch(err => {
    console.log("Connection Error Details:", err.message);
  });

const userSchema = new mongoose.Schema({
    fullName: String,
    email: { type: String, unique: true },
    date: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Middleware ayarları

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/')));

app.post('/register', async (req, res) => {
    try {
    const { fullName, email, coffeeChoice, expectations } = req.body;

    const validation = validateRegister(fullName, email);

    if(!validation.isValid) {
        return res.status(400).json({
            success: false,
            message: validation.message
        });
    }

    if(!fullName || !email || fullName.trim() === "" || email.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Full name and email fields cannot be left blank!"
        });        
    }

    if(fullName.length < 3 || fullName.length > 50) {
        return res.status(400).json({
            success: false,
            message: "Name should be between 3-50 characters."
        });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailPattern.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Unvalid email!"
        });
    }

    const newUser = new User({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        coffeeChoice,
        expectations
    });

    await newUser.save();
    res.status(201).json({
        success: true,
        message: "Register is successfull"
    });
} catch (err){
    console.error("Registration error...", err);
    res.status(500).json({
        success: false,
        message: "Server error has occured."
    });
}
});

app.post('/register', async (req, res) => {
    try {
        console.log("Data coming from form:", req.body);
        const yeniKullanici = new User(req.body);
        const kaydedilenVeri = await yeniKullanici.save();
        
        console.log("Successfully saved to MongoDB! ✅", kaydedilenVeri);
        res.status(201).json({ message: "Register is successful" });

    } catch (error) {
        console.log("No way! An error has occurred. 🔥");
        
        if (error.code === 11000) {
            return res.status(400).json({ 
                message: "This email is already registered!", 
                error: "DuplicateKey" 
            }); 
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: "Please check your information.",
                error: error.message
            });
        }

        res.status(500).json({
            message: "Something went wrong on our side.",
            error: error.message
        });
    }
});

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
        console.log("Veritabanı isteği başlıyor...");
        const users = await User.find();
        console.log("Veriler başarıyla çekildi:", users.length);
        res.json(users);
    } catch (err) {
        console.error("KRİTİK HATA:", err.message);
        res.status(500).json({ status: "fail", message: err.message });
    }
});

// Render'da çalışması için 0.0.0.0 IP'si önemlidir
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Your server is working! ✨ Port: ${PORT}`);
});
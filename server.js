require('dotenv').config();
console.log("=== RENDER SUNUCUSU CALISIYOR - LOG TESTI ===");
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
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
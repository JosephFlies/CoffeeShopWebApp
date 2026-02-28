require('dotenv').config();
console.log("=== RENDER SUNUCUSU CALISIYOR - LOG TESTI ===");
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

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

// Render'da çalışması için 0.0.0.0 IP'si önemlidir
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Your server is working! ✨ Port: ${PORT}`);
});
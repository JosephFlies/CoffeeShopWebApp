const express = require('express');
const app = express();
const path = require('path');
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use(express.static(path.join(__dirname, '/')));

app.post('/register', (req, res) => {
    const userData = req.body;
    console.log("A new member came to the server:", userData);

    res.json({message: "Saved successfully!", user: userData.fullName});
});

app.listen(PORT, () => {
    console.log(`Your server is working on http://localhost:${PORT}! ✨`);
})
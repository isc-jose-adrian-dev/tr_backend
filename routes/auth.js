const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();
const SECRET = process.env.SECRET_JWT;

// Registro
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (!password || password.length < 8 || password.length > 12) {
        return res.status(400).json({ message: 'Password must be 8-12 characters long.' });
    }

    try {
        const user = new User({ username, email, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (err) {
        res.status(400).json({ message: 'Error registering user.', error: err });
    }
});

// Inicio de sesión
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful.', token });
    } catch (err) {
        res.status(500).json({ message: 'Error logging in.', error: err });
    }
});

module.exports = router;

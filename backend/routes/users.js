const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const SECRET = 'FOR_TESTING_ONLY_WILL_CHANGE_LATER';

router.get('/', async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username']
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashedPassword });
        
        res.status(201).json({ userId: user.id, username: user.username });
    } catch (error) {
        res.status(400).json({ error: "Registration failed" });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } });
        
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: '1h' });
            res.status(200).json({ userId: user.id, username: user.username, token });
        } else {
            throw new Error('Invalid credentials');
        }
    } catch (error) {
        res.status(400).json({ error: "Login failed" });
    }
});

router.put('/change-password/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const { oldPassword, newPassword } = req.body;

        const user = await User.findOne({ where: { id: userId } });
        
        if (user && await bcrypt.compare(oldPassword, user.password)) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            await user.save();
            res.status(200).json({ message: 'Password updated successfully' });
        } else {
            throw new Error('Invalid credentials');
        }
    } catch (error) {
        res.status(400).json({ error: "Password change failed" });
    }
});

router.delete('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const { password } = req.body;

        const user = await User.findOne({ where: { id: userId } });

        if (user && await bcrypt.compare(password, user.password)) {
            await user.destroy();
            res.status(200).json({ message: 'Account deleted successfully' });
        } else {
            throw new Error('Invalid credentials');
        }
    } catch (error) {
        res.status(400).json({ error: "Account deletion failed" });
    }
});

router.get('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findOne({ where: { id: userId }, attributes: ['id', 'username'] });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user" });
    }
});

module.exports = router;

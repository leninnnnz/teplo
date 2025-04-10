const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const router = express.Router();
const dotenv = require('dotenv');

dotenv.config();

console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
    host: 'smtp.yandex.ru',
    port: 587,
    secure: false, // Используем STARTTLS
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false, // Для локальной разработки
    },
});

// Регистрация
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'Пользователь уже существует' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        user = new User({
            email,
            password: hashedPassword,
            verificationCode,
            role: 'user', // Явно задаём роль
        });

        await user.save();
        console.log('User saved:', user); // Лог для проверки

        await transporter.sendMail({
            from: `"Teplo" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Код подтверждения',
            text: `Ваш код подтверждения: ${verificationCode}`,
        });
        console.log('Email sent to:', email); // Лог для проверки отправки

        res.status(201).json({ message: 'Код отправлен на ваш email' });
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
});

router.post('/verify-code', async (req, res) => {
    const { email, code } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Пользователь не найден' });
        }
        if (user.verificationCode !== code) {
            return res.status(400).json({ message: 'Неверный код' });
        }

        user.isVerified = true;
        user.verificationCode = undefined;
        await user.save();

        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Email подтверждён', token });
    } catch (error) {
        console.error('Ошибка верификации:', error);
        res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Неверный email или пароль' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Неверный email или пароль' });
        }

        if (!user.isVerified) {
            return res.status(400).json({ message: 'Подтвердите email' });
        }

        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error('Ошибка входа:', error);
        res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Application = require('../models/Application');

// Список всех пользователей
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, 'email firstName lastName patronymic phone role');
        res.json(users);
    } catch (error) {
        console.error('Fetch users error:', error);
        res.status(500).json({ message: 'Ошибка загрузки пользователей' });
    }
});

// Список всех заявлений
router.get('/applications', async (req, res) => {
    try {
        const applications = await Application.find()
            .populate('userId', 'email firstName lastName')
            .populate('comments.author', 'firstName lastName');
        res.json(applications);
    } catch (error) {
        console.error('Fetch applications error:', error);
        res.status(500).json({ message: 'Ошибка загрузки заявлений' });
    }
});

// Заявления пользователя
router.get('/users/:id/applications', async (req, res) => {
    try {
        const applications = await Application.find({ userId: req.params.id }).populate('comments.author', 'firstName lastName');
        res.json(applications);
    } catch (error) {
        console.error('Fetch user applications error:', error);
        res.status(500).json({ message: 'Ошибка загрузки заявлений' });
    }
});

// Детали заявления
router.get('/applications/:id', async (req, res) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate('userId', 'email firstName lastName patronymic')
            .populate('comments.author', 'firstName lastName');
        if (!application) {
            return res.status(404).json({ message: 'Заявление не найдено' });
        }
        res.json(application);
    } catch (error) {
        console.error('Fetch application error:', error);
        res.status(500).json({ message: 'Ошибка загрузки заявления' });
    }
});
router.put('/applications/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const application = await Application.findByIdAndUpdate(req.params.id, { status, updatedAt: Date.now() }, { new: true });
        if (!application) {
            return res.status(404).json({ message: 'Заявление не найдено' });
        }
        res.json(application);
    } catch (error) {
        console.error('Update application error:', error);
        res.status(500).json({ message: 'Ошибка обновления заявления' });
    }
});

// Смена роли
router.put('/users/:id/role', async (req, res) => {
    try {
        const { role } = req.body;
        if (!['admin', 'employee', 'user'].includes(role)) {
            return res.status(400).json({ message: 'Недопустимая роль' });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        user.role = role;
        await user.save();

        res.json({ message: 'Роль обновлена', user: { id: user._id, email: user.email, role: user.role } });
    } catch (error) {
        console.error('Update role error:', error);
        res.status(500).json({ message: 'Ошибка обновления роли' });
    }
});

// Удаление заявления
router.delete('/applications/:id', async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ message: 'Заявление не найдено' });
        }

        await Application.findByIdAndDelete(req.params.id);
        res.json({ message: 'Заявление удалено' });
    } catch (error) {
        console.error('Delete application error:', error);
        res.status(500).json({ message: 'Ошибка удаления заявления' });
    }
});

module.exports = router;

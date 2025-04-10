const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const authRoutes = require('./routes/auth');
const User = require('./models/User');
const Application = require('./models/Application');
const multer = require('multer');
const fs = require('fs');
dotenv.config();

const app = express();

app.use(
    cors({
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }),
);

app.use(express.json());

// Настройка multer для временного сохранения файлов
const upload = multer({ dest: 'uploads/' });

// Подключение к MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log(`MongoDB connected to ${process.env.MONGO_URI}`))
    .catch((err) => console.error('MongoDB connection error:', err));

// Middleware для проверки токена
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Нет токена' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Недействительный токен' });
    }
};

// Middleware для проверки ролей
const checkRole = (roles) => (req, res, next) => {
    const userRole = req.user.role;
    if (!roles.includes(userRole)) {
        return res.status(403).json({ message: 'Доступ запрещён: недостаточно прав' });
    }
    next();
};

app.get('/api/applications', authMiddleware, async (req, res) => {
    try {
        const applications = await Application.find({ userId: req.user.id });
        res.json(applications);
    } catch (error) {
        console.error('Applications fetch error:', error);
        res.status(500).json({ message: 'Ошибка загрузки заявлений', error: error.message });
    }
});

// Подача заявления
app.post('/api/applications', authMiddleware, upload.array('documents', 5), async (req, res) => {
    try {
        const { type } = req.body;
        const files = req.files;

        if (!type) {
            return res.status(400).json({ message: 'Укажите тип заявления' });
        }

        if (!files || files.length < 3) {
            // Минимум 3 документа
            return res.status(400).json({ message: 'Прикрепите все необходимые документы' });
        }

        const applicationData = {
            userId: req.user.id,
            type,
            status: 'В обработке',
            documents: files.map((file) => ({
                data: fs.readFileSync(file.path),
                contentType: file.mimetype,
            })),
        };

        files.forEach((file) => fs.unlinkSync(file.path)); // Удаляем временные файлы

        const application = new Application(applicationData);
        await application.save();

        res.json({ message: 'Заявление подано', application });
    } catch (error) {
        console.error('Application submit error:', error);
        res.status(500).json({ message: 'Ошибка подачи заявления', error: error.message });
    }
});

// Получение деталей заявления
app.get('/api/applications/:id', authMiddleware, async (req, res) => {
    try {
        const application = await Application.findOne({ _id: req.params.id, userId: req.user.id });
        if (!application) {
            return res.status(404).json({ message: 'Заявление не найдено' });
        }
        res.json(application);
    } catch (error) {
        console.error('Application fetch error:', error);
        res.status(500).json({ message: 'Ошибка загрузки заявления', error: error.message });
    }
});

// Получение всех заявлений (только для employee)
app.get('/api/employee/applications', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'employee') {
            return res.status(403).json({ message: 'Доступ запрещён' });
        }
        const applications = await Application.find().populate('userId', 'email');
        res.json(applications);
    } catch (error) {
        console.error('Employee applications fetch error:', error);
        res.status(500).json({ message: 'Ошибка загрузки заявлений', error: error.message });
    }
});

// Обновление статуса заявления
app.put('/api/applications/:id', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'employee') {
            return res.status(403).json({ message: 'Доступ запрещён' });
        }
        const { status } = req.body;
        const application = await Application.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!application) {
            return res.status(404).json({ message: 'Заявление не найдено' });
        }
        res.json(application);
    } catch (error) {
        console.error('Application update error:', error);
        res.status(500).json({ message: 'Ошибка обновления заявления', error: error.message });
    }
});

// Пример защищённого эндпоинта для админа
app.get('/api/admin', authMiddleware, checkRole(['admin']), (req, res) => {
    res.json({ message: 'Добро пожаловать в админ-панель' });
});

// Профиль: получение данных
app.get('/api/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'Пользователь не найден' });
        res.json({
            user: {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                patronymic: user.patronymic,
                phone: user.phone,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ message: 'Ошибка загрузки профиля', error: error.message });
    }
});

// Профиль: сохранение данных
app.post('/api/profile', authMiddleware, async (req, res) => {
    try {
        const { firstName, lastName, patronymic, phone } = req.body;
        const user = await User.findByIdAndUpdate(req.user.id, { firstName, lastName, patronymic, phone }, { new: true, upsert: true });
        res.json({
            message: 'Профиль успешно сохранён',
            user: {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                patronymic: user.patronymic,
                phone: user.phone,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Profile save error:', error);
        res.status(500).json({ message: 'Ошибка сохранения профиля', error: error.message });
    }
});

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

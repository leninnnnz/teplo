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
        const applications = await Application.find({ userId: req.user.id }).populate('comments.author', 'firstName lastName');
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
            comments: [],
        };

        files.forEach((file) => fs.unlinkSync(file.path));

        const application = new Application(applicationData);
        await application.save();

        res.json({ message: 'Заявление подано', application });
    } catch (error) {
        console.error('Application submit error:', error);
        res.status(500).json({ message: 'Ошибка подачи заявления', error: error.message });
    }
});

// Получение деталей заявления (для пользователя)
app.get('/api/applications/:id', authMiddleware, async (req, res) => {
    try {
        const application = await Application.findOne({ _id: req.params.id, userId: req.user.id }).populate(
            'comments.author',
            'firstName lastName',
        );
        if (!application) {
            return res.status(404).json({ message: 'Заявление не найдено' });
        }
        res.json(application);
    } catch (error) {
        console.error('Application fetch error:', error);
        res.status(500).json({ message: 'Ошибка загрузки заявления', error: error.message });
    }
});

app.put('/api/applications/:id/edit', authMiddleware, upload.array('documents', 5), async (req, res) => {
    try {
        const { type, description } = req.body;
        const files = req.files;

        const application = await Application.findOne({ _id: req.params.id, userId: req.user.id });
        if (!application) {
            return res.status(404).json({ message: 'Заявление не найдено' });
        }
        if (application.status !== 'В обработке' && application.status !== 'Вернулось') {
            return res.status(403).json({ message: 'Редактирование доступно только для статусов "В обработке" или "Вернулось"' });
        }

        const updateData = { updatedAt: Date.now() };
        if (type) updateData.type = type;
        if (description) updateData.description = description;
        if (files && files.length > 0) {
            updateData.documents = files.map((file) => ({
                data: fs.readFileSync(file.path),
                contentType: file.mimetype,
            }));
            files.forEach((file) => fs.unlinkSync(file.path));
        }

        const updatedApplication = await Application.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json({ message: 'Заявление обновлено', application: updatedApplication });
    } catch (error) {
        console.error('Application edit error:', error);
        res.status(500).json({ message: 'Ошибка редактирования заявления', error: error.message });
    }
});

app.delete('/api/applications/:id', authMiddleware, async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ message: 'Заявление не найдено' });
        }
        if (application.status !== 'Завершённый') {
            return res.status(403).json({ message: 'Удаление доступно только для завершённых заявлений' });
        }
        if (req.user.role !== 'employee' && application.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Нет прав для удаления этого заявления' });
        }

        await Application.findByIdAndDelete(req.params.id);
        res.json({ message: 'Заявление удалено' });
    } catch (error) {
        console.error('Application delete error:', error);
        res.status(500).json({ message: 'Ошибка удаления заявления', error: error.message });
    }
});

app.get('/api/employee/applications', authMiddleware, checkRole(['employee']), async (req, res) => {
    try {
        const applications = await Application.find()
            .populate('userId', 'firstName lastName patronymic email')
            .populate('comments.author', 'firstName lastName');
        res.json(applications);
    } catch (error) {
        console.error('Employee applications fetch error:', error);
        res.status(500).json({ message: 'Ошибка загрузки заявлений', error: error.message });
    }
});

app.get('/api/employee/applications/:id', authMiddleware, checkRole(['employee']), async (req, res) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate('userId', 'firstName lastName patronymic email')
            .populate('comments.author', 'firstName lastName');
        if (!application) {
            return res.status(404).json({ message: 'Заявление не найдено' });
        }
        res.json(application);
    } catch (error) {
        console.error('Employee application details fetch error:', error);
        res.status(500).json({ message: 'Ошибка загрузки заявления', error: error.message });
    }
});

app.put('/api/applications/:id', authMiddleware, checkRole(['employee']), upload.single('commentFile'), async (req, res) => {
    try {
        const { status, comment } = req.body;
        const file = req.file;

        const updateData = { updatedAt: Date.now() };
        if (status) updateData.status = status;

        if (comment) {
            const commentData = {
                text: comment,
                author: req.user.id,
                createdAt: new Date(),
            };
            if (file) {
                commentData.file = {
                    data: fs.readFileSync(file.path),
                    contentType: file.mimetype,
                };
                fs.unlinkSync(file.path);
            }
            updateData.$push = { comments: commentData };
        }

        const application = await Application.findByIdAndUpdate(req.params.id, updateData, { new: true })
            .populate('userId', 'firstName lastName patronymic email')
            .populate('comments.author', 'firstName lastName');
        if (!application) {
            return res.status(404).json({ message: 'Заявление не найдено' });
        }
        res.json(application);
    } catch (error) {
        console.error('Application update error:', error);
        res.status(500).json({ message: 'Ошибка обновления заявления', error: error.message });
    }
});

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

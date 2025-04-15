import style from './index.module.scss';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Content, TitlePage, UIInput, Wrapper } from '../../shared/UI';

export function ProfileSettings() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [patronymic, setPatronymic] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = JSON.parse(atob(token.split('.')[1]));
                console.log('Decoded token:', decoded);
                setEmail(decoded.email || '');
                setRole(decoded.role || '');
                fetchUserData(token);
            } catch (err) {
                setError('Ошибка загрузки данных пользователя');
            }
        }
    }, []);

    const fetchUserData = async (token) => {
        try {
            const response = await fetch('http://localhost:5001/api/profile', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            console.log('Profile data:', data);
            if (response.ok) {
                setFirstName(data.user.firstName || '');
                setLastName(data.user.lastName || '');
                setPatronymic(data.user.patronymic || '');
                setPhone(data.user.phone || '');
                setRole(data.user.role || '');
            } else {
                throw new Error(data.message || 'Ошибка загрузки профиля');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSave = async () => {
        if (!firstName || !lastName || !phone) {
            setError('Заполните все обязательные поля (Имя, Фамилия, Номер телефона)');
            return;
        }
        const phoneRegex = /^\+7\d{10}$/;
        if (!phoneRegex.test(phone)) {
            setError('Введите корректный номер телефона (например, +79991234567)');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5001/api/profile', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ firstName, lastName, patronymic, phone }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Ошибка сохранения профиля');
            }
            localStorage.setItem('isProfileSet', 'true');
            localStorage.setItem('userFirstName', firstName);
            localStorage.setItem('userLastName', lastName);
            localStorage.setItem('userPatronymic', patronymic || '');
            localStorage.setItem('userPhone', phone);
            setIsEditing(false);
            navigate('/my-applications');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSkip = () => {
        console.log('User role:', role);
        localStorage.setItem('isProfileSet', 'true');
        if (role === 'employee') {
            navigate('/employee/applications');
        } else {
            navigate('/my-applications');
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const isProfileSet = localStorage.getItem('isProfileSet') === 'true';

    return (
        <Wrapper>
            <TitlePage title={'Настройки профиля'} />
            <Content>
                <p className={style.subtitle}>Заполните свои данные для начала работы</p>
                <div className={style.form}>
                    <UIInput
                        type="text"
                        id="lastName"
                        value={lastName}
                        onChange={(value) => setLastName(value)}
                        required={true}
                        placeholder="Иванов"
                        title="Фамилия"
                        disabled={!isEditing}
                    />
                    <UIInput
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={(value) => setFirstName(value)}
                        required={true}
                        placeholder="Иван"
                        title="Имя"
                        disabled={!isEditing}
                    />
                    <UIInput
                        type="text"
                        id="patronymic"
                        value={patronymic}
                        onChange={(value) => setPatronymic(value)}
                        required={false}
                        placeholder="Иванович"
                        title="Отчество"
                        disabled={!isEditing}
                    />
                    <UIInput
                        type="tel"
                        id="phone"
                        value={phone}
                        onChange={(value) => setPhone(value)}
                        required={true}
                        placeholder="+79991234567"
                        title="Номер телефона"
                        disabled={!isEditing}
                    />
                    {error && <p className={style.error}>{error}</p>}
                    <div className={style.buttonGroup}>
                        {isEditing ? (
                            <button className={style.saveButton} onClick={handleSave} disabled={loading}>
                                {loading ? 'Сохранение...' : 'Сохранить'}
                            </button>
                        ) : (
                            <button className={style.editButton} onClick={handleEdit} disabled={loading}>
                                Изменить
                            </button>
                        )}
                        <button className={style.skipButton} onClick={handleSkip} disabled={loading}>
                            {isProfileSet ? 'Выйти' : 'Пропустить'}
                        </button>
                    </div>
                </div>
            </Content>
        </Wrapper>
    );
}

export default ProfileSettings;

import style from './index.module.scss';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function ProfileSettings() {
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [theme, setTheme] = useState('light');
    const navigate = useNavigate();

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setAvatar(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        localStorage.setItem('isProfileSet', 'true');
        localStorage.setItem('userName', name);
        localStorage.setItem('userAvatar', avatar || '');
        localStorage.setItem('userTheme', theme);
        navigate('/my-applications');
    };

    const handleSkip = () => {
        localStorage.setItem('isProfileSet', 'true');
        navigate('/my-applications');
    };

    return (
        <div className={style.settingsWrapper}>
            <h1 className={style.title}>Настройки профиля</h1>
            <p className={style.subtitle}>Настройте свой аккаунт</p>
            <div className={style.form}>
                <div className={style.inputGroup}>
                    <label htmlFor="name" className={style.label}>
                        Имя
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={style.input}
                        placeholder="Введите ваше имя"
                    />
                </div>
                <div className={style.inputGroup}>
                    <label htmlFor="avatar" className={style.label}>
                        Аватар
                    </label>
                    <input type="file" id="avatar" accept="image/*" onChange={handleAvatarChange} className={style.fileInput} />
                    {avatar && <img src={avatar} alt="Аватар" className={style.avatarPreview} />}
                </div>
                <div className={style.inputGroup}>
                    <label className={style.label}>Тема</label>
                    <div className={style.themeOptions}>
                        <label>
                            <input type="radio" value="light" checked={theme === 'light'} onChange={() => setTheme('light')} />
                            Светлая
                        </label>
                        <label>
                            <input type="radio" value="dark" checked={theme === 'dark'} onChange={() => setTheme('dark')} />
                            Тёмная
                        </label>
                    </div>
                </div>
                <div className={style.buttonGroup}>
                    <button className={style.saveButton} onClick={handleSave}>
                        Сохранить
                    </button>
                    <button className={style.skipButton} onClick={handleSkip}>
                        Пропустить
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProfileSettings;

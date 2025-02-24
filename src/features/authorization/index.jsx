import style from './index.module.scss';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconEye, IconEyeOff } from '../../shared/UI/icons';

export function Authorization() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState('weak');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [code, setCode] = useState('');
    const navigate = useNavigate();

    const checkPasswordStrength = (pwd) => {
        const hasLength = pwd.length >= 8;
        const hasLetter = /[a-zA-Z]/.test(pwd);
        const hasNumber = /\d/.test(pwd);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);

        if (pwd.length === 0) return 'weak';
        if (!hasLength || !(hasLetter || hasNumber || hasSpecial)) return 'weak';
        if (hasLength && (hasLetter || hasNumber) && !hasSpecial) return 'medium';
        if (hasLength && hasLetter && hasNumber && hasSpecial) return 'strong';
        return 'medium';
    };

    const getStrengthMessage = (strength, pwd) => {
        switch (strength) {
            case 'weak':
                return pwd.length === 0 ? 'Введите пароль' : 'Слишком простой пароль';
            case 'medium':
                return 'Неплохой пароль';
            case 'strong':
                return 'Хороший пароль';
            default:
                return 'Введите пароль';
        }
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        if (!isLogin) setPasswordStrength(checkPasswordStrength(newPassword));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLogin) {
            console.log('Login - Email:', email, 'Password:', password);
            const isProfileSet = localStorage.getItem('isProfileSet') === 'true';
            navigate(isProfileSet ? '/my-applications' : '/profile-settings');
        } else if (!isCodeSent) {
            if (password !== confirmPassword) {
                alert('Пароли не совпадают!');
                return;
            }
            if (checkPasswordStrength(password) !== 'strong') {
                alert('Пароль должен быть сложным (буквы, цифры, спецсимволы, минимум 8 символов)!');
                return;
            }
            console.log('Register - Email:', email, 'Password:', password);
            console.log('Код отправлен на:', email, 'Пример кода: 123456');
            setIsCodeSent(true);
        } else {
            if (code === '123456') {
                console.log('Код верный, регистрация завершена');
                localStorage.setItem('isProfileSet', 'false'); // Новый пользователь
                navigate('/profile-settings');
            } else {
                alert('Неверный код!');
            }
        }
    };

    const handleBackFromCode = () => {
        setIsCodeSent(false);
        setCode('');
    };

    const toggleShowPassword = () => setShowPassword((prev) => !prev);
    const toggleShowConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

    return (
        <div className={style.authWrapper}>
            <div className={style.authContainer}>
                {!isCodeSent ? (
                    <>
                        <div className={style.tabs}>
                            <button
                                className={`${style.tab} ${isLogin ? style.activeTab : ''}`}
                                onClick={() => setIsLogin(true)}
                            >
                                Вход
                            </button>
                            <button
                                className={`${style.tab} ${!isLogin ? style.activeTab : ''}`}
                                onClick={() => setIsLogin(false)}
                            >
                                Регистрация
                            </button>
                        </div>

                        <h1 className={style.title}>
                            {isLogin ? 'Вход в личный кабинет' : 'Регистрация'}
                        </h1>
                        <p className={style.subtitle}>
                            {isLogin ? 'Введите свои данные для авторизации' : 'Создайте новый аккаунт'}
                        </p>

                        <form onSubmit={handleSubmit} className={style.form}>
                            <div className={style.inputGroup}>
                                <label htmlFor="email" className={style.label}>
                                    Электронная почта
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={style.input}
                                    placeholder="example@mail.com"
                                    required
                                />
                            </div>

                            <div className={style.inputGroup}>
                                <label htmlFor="password" className={style.label}>
                                    Пароль
                                </label>
                                <div className={style.passwordWrapper}>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        className={`${style.input} ${!isLogin ? style[passwordStrength] : ''}`}
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className={style.showPasswordButton}
                                        onClick={toggleShowPassword}
                                    >
                                        {showPassword ? <IconEyeOff /> : <IconEye />}
                                    </button>
                                </div>
                                {!isLogin && (
                                    <div className={style.passwordHint}>
                                        <span className={`${style.strengthMessage} ${style[passwordStrength]}`}>
                                            {getStrengthMessage(passwordStrength, password)}
                                        </span>
                                        <span className={style.hintText}>
                                            Используйте буквы, цифры и специальные символы для надёжного пароля
                                        </span>
                                    </div>
                                )}
                            </div>

                            {!isLogin && (
                                <div className={style.inputGroup}>
                                    <label htmlFor="confirmPassword" className={style.label}>
                                        Подтверждение пароля
                                    </label>
                                    <div className={style.passwordWrapper}>
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            id="confirmPassword"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className={style.input}
                                            placeholder="••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className={style.showPasswordButton}
                                            onClick={toggleShowConfirmPassword}
                                        >
                                            {showConfirmPassword ? <IconEyeOff /> : <IconEye />}
                                        </button>
                                    </div>
                                </div>
                            )}

                            <button type="submit" className={style.submitButton}>
                                {isLogin ? 'Войти' : 'Зарегистрироваться'}
                            </button>
                        </form>

                        <p className={style.footerText}>
                            {isLogin ? 'Забыли пароль?' : 'Уже есть аккаунт?'}{' '}
                            <a href="#" className={style.emailLink}>
                                {isLogin ? 'Восстановить' : 'Войти'}
                            </a>
                        </p>
                    </>
                ) : (
                    <>
                        <h1 className={style.title}>Подтверждение кода</h1>
                        <p className={style.subtitle}>
                            Введите 6-значный код, отправленный на {email}
                        </p>
                        <form onSubmit={handleSubmit} className={style.form}>
                            <div className={style.inputGroup}>
                                <label htmlFor="code" className={style.label}>
                                    Код подтверждения
                                </label>
                                <input
                                    type="text"
                                    id="code"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className={style.input}
                                    placeholder="123456"
                                    maxLength="6"
                                    required
                                />
                            </div>
                            <button type="submit" className={style.submitButton}>
                                Подтвердить
                            </button>
                        </form>
                        <button className={style.backButton} onClick={handleBackFromCode}>
                            <span className={style.arrow}>←</span> Вернуться назад
                        </button>
                    </>
                )}
                {!isCodeSent && (
                    <button className={style.backButton} onClick={() => navigate(-1)}>
                        <span className={style.arrow}>←</span> Вернуться назад
                    </button>
                )}
            </div>
        </div>
    );
}

export default Authorization;
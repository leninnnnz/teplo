import style from './index.module.scss';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkPasswordStrength, UIInput, UIInputPassword } from '../../shared/UI';

export function Authorization() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [code, setCode] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isLogin) {
            try {
                const response = await fetch('http://localhost:5001/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });
                const data = await response.json();

                if (!response.ok) throw new Error(data.message || 'Ошибка входа');

                localStorage.setItem('token', data.token);
                localStorage.setItem('isProfileSet', 'true');
                const isProfileSet = localStorage.getItem('isProfileSet') === 'true';
                navigate(isProfileSet ? '/my-applications' : '/profile-settings');
            } catch (error) {
                alert(error.message);
            }
        } else if (!isCodeSent) {
            if (password !== confirmPassword) {
                alert('Пароли не совпадают!');
                return;
            }
            if (checkPasswordStrength(password) !== 'strong') {
                alert('Пароль должен быть сложным (буквы, цифры, спецсимволы, минимум 8 символов)!');
                return;
            }

            try {
                const response = await fetch('http://localhost:5001/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });
                const data = await response.json();

                if (!response.ok) throw new Error(data.message || 'Ошибка регистрации');

                setIsCodeSent(true);
            } catch (error) {
                alert(error.message);
            }
        } else {
            try {
                const response = await fetch('http://localhost:5001/api/auth/verify-code', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, code }),
                });
                const data = await response.json();

                if (!response.ok) throw new Error(data.message || 'Ошибка подтверждения');

                localStorage.setItem('token', data.token);
                localStorage.setItem('isProfileSet', 'false');
                navigate('/profile-settings');
            } catch (error) {
                alert(error.message);
            }
        }
    };

    const handleBackFromCode = () => {
        setIsCodeSent(false);
        setCode('');
    };

    return (
        <div className={style.authWrapper}>
            <div className={style.authContainer}>
                {!isCodeSent ? (
                    <>
                        <div className={style.tabs}>
                            <button className={`${style.tab} ${isLogin ? style.activeTab : ''}`} onClick={() => setIsLogin(true)}>
                                Вход
                            </button>
                            <button className={`${style.tab} ${!isLogin ? style.activeTab : ''}`} onClick={() => setIsLogin(false)}>
                                Регистрация
                            </button>
                        </div>

                        <h1 className={style.title}>{isLogin ? 'Вход в личный кабинет' : 'Регистрация'}</h1>
                        <p className={style.subtitle}>{isLogin ? 'Введите свои данные для авторизации' : 'Создайте новый аккаунт'}</p>

                        <form onSubmit={handleSubmit} className={style.form}>
                            <UIInput
                                type={'email'}
                                id={'email'}
                                value={email}
                                onChange={(value) => setEmail(value)}
                                required={true}
                                placeholder={'example@mail.com'}
                                title={'Электронная почта'}
                            />
                            <UIInputPassword
                                onChange={setPassword}
                                value={password}
                                required={true}
                                title={'Пароль'}
                                isConfirmPassword={false}
                                showStrength={!isLogin} // Вкл только для "Регистрация"
                            />
                            {!isLogin && (
                                <UIInputPassword
                                    onChange={(value) => setConfirmPassword(value)}
                                    value={confirmPassword}
                                    required={true}
                                    title={'Подтверждение пароля'}
                                    isConfirmPassword={true}
                                    showStrength={false} // Выкл для подтверждения
                                />
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
                        <p className={style.subtitle}>Введите 6-значный код, отправленный на {email}</p>
                        <form onSubmit={handleSubmit} className={style.form}>
                            <UIInput
                                type={'text'}
                                value={code}
                                onChange={(value) => setCode(value)}
                                required={true}
                                title={'Код подтверждения'}
                                placeholder={'123456'}
                                maxLength={'6'}
                            />
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

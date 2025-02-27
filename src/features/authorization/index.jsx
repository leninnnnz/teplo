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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLogin) {
            console.log('Login - Email:', email, 'Password:', password);
            localStorage.setItem('isProfileSet', 'true'); // Устанавливаем при входе
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
                localStorage.setItem('isProfileSet', 'true');
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
                            <UIInputPassword onChange={setPassword} value={password} required={true} title={'Пароль'} />

                            {!isLogin && (
                                <UIInputPassword
                                    onChange={(value) => setConfirmPassword(value)}
                                    value={confirmPassword}
                                    required={true}
                                    title={'Подтверждение пароля'}
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
                                placeholder={'"123456"'}
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

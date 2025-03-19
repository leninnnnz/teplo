import style from './index.module.scss';
import { IconEye, IconEyeOff } from '../icons';
import { useState } from 'react';
import { checkPasswordStrength, getStrengthMessage } from '../../libs/utils';

export function UIInput({ type = 'text', value, onChange, classNames, placeholder, maxLength, required, title }) {
    return (
        <div className={style.inputGroup}>
            {title && (
                <label htmlFor={type} className={style.label}>
                    {title}
                </label>
            )}
            <input
                type={type}
                id={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`${style.input} ${classNames}`}
                placeholder={placeholder}
                maxLength={maxLength}
                required={required}
            />
        </div>
    );
}

export function UIInputPassword({
    value,
    onChange,
    classNames,
    required,
    title,
    isConfirmPassword = false,
    showStrength = false, // Новый пропс
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState('weak');

    const handlePasswordChange = (password) => {
        onChange(password);
        setPasswordStrength(checkPasswordStrength(password));
    };

    return (
        <div className={style.inputGroup}>
            {title && (
                <label htmlFor="password" className={style.label}>
                    {title}
                </label>
            )}
            <div className={style.passwordWrapper}>
                <input
                    type={isOpen ? 'text' : 'password'}
                    id="password"
                    value={value}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    className={`${style.input} ${!isConfirmPassword && showStrength ? style[passwordStrength] : ''} ${classNames}`}
                    placeholder="••••••••"
                    required={required}
                />
                <button type="button" className={style.showPasswordButton} onClick={() => setIsOpen((prev) => !prev)}>
                    {isOpen ? <IconEyeOff /> : <IconEye />}
                </button>
            </div>
            {!isConfirmPassword &&
                showStrength &&
                value && ( // Показываем только если showStrength === true
                    <div className={style.passwordHint}>
                        <span className={`${style.strengthMessage} ${style[passwordStrength]}`}>
                            {getStrengthMessage(passwordStrength, value)}
                        </span>
                        <span className={style.hintText}>Используйте буквы, цифры и специальные символы для надёжного пароля</span>
                    </div>
                )}
        </div>
    );
}

export const checkPasswordStrength = (pwd) => {
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

export const getStrengthMessage = (strength, pwd) => {
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

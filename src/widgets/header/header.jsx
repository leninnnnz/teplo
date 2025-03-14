import style from './index.module.scss';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function Header() {
    const [activeCategory, setActiveCategory] = useState(null);
    const [isCabinetMenuOpen, setIsCabinetMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const navigate = useNavigate();
    const location = useLocation();
    const menuRef = useRef(null);
    const cabinetMenuRef = useRef(null);

    const isInCabinet = ['/profile-settings', '/my-applications'].includes(location.pathname);

    useEffect(() => {
        const handleStorageChange = () => {
            const profileSet = localStorage.getItem('isProfileSet') === 'true';
            console.log('Storage changed, isProfileSet:', localStorage.getItem('isProfileSet'), 'isAuthenticated:', profileSet);
            setIsAuthenticated(profileSet);
        };

        handleStorageChange();
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleCategoryToggle = (category) => {
        setActiveCategory((prevCategory) => (prevCategory === category ? null : category));
        setIsCabinetMenuOpen(false);
    };

    const handleItemClick = (path) => {
        setActiveCategory(null);
        setIsCabinetMenuOpen(false);
        navigate(path);
    };

    const handleCabinetMenuToggle = () => {
        setIsCabinetMenuOpen((prev) => !prev);
        setActiveCategory(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('isProfileSet');
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setIsCabinetMenuOpen(false);
        navigate('/');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                cabinetMenuRef.current &&
                !cabinetMenuRef.current.contains(event.target)
            ) {
                setActiveCategory(null);
                setIsCabinetMenuOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    console.log('Header render, isAuthenticated:', isAuthenticated);

    const navLinks = [
        {
            category: 'Для клиентов',
            items: [
                { path: '/important-info', label: 'Важная информация' },
                { path: '/client-info', label: 'Информация для клиентов' },
                { path: '/fraud-prevention', label: 'Профилактика мошеннических действий' },
            ],
        },
        {
            category: 'О компании',
            items: [
                { path: '/financial-reports', label: 'Бухгалтерская отчетность' },
                { path: '/contacts', label: 'Контакты' },
                { path: '/procurement-info', label: 'Информация о закупках' },
                { path: '/disclosure-info', label: 'Раскрытие информации' },
                { path: '/business-scope', label: 'Сфера деятельности' },
                { path: '/partners', label: 'Партнеры' },
            ],
        },
        {
            category: 'Услуги',
            items: [
                { path: '/tariffs', label: 'Тарифы' },
                { path: '/technical-connection', label: 'Технологическое присоединение к ТС и ГВС' },
            ],
        },
        {
            category: 'Безопасность',
            items: [{ path: '/occupational-safety', label: 'Охрана труда' }],
        },
    ];

    const cabinetMenuItems = [
        { path: '/profile-settings', label: 'Настройки пользователя' },
        { path: '/my-applications', label: 'Мои заявления' },
        { action: handleLogout, label: 'Выйти' },
    ];

    return (
        <header className={style.headerWrapper}>
            <div className={style.headerContainer}>
                <div className={style.logoWrapper}>
                    <p
                        className={`${style.logoText} ${location.pathname === '/' ? style.activeLink : ''}`}
                        onClick={() => handleItemClick('/')}
                    >
                        ООО "УК "ТЕПЛОКОМПЛЕКС"
                    </p>
                    <p className={style.logoSubtitle}>Мы несем тепло в ваши дома</p>
                </div>

                <div className={style.contactWrapper}>
                    <a href={'tel:+73439379828'} className={style.contactPhone}>
                        +7 (343) 937-98-28
                    </a>
                </div>

                <div className={style.loginWrapper} ref={cabinetMenuRef}>
                    <button
                        className={style.loginButton}
                        onClick={isAuthenticated ? handleCabinetMenuToggle : () => handleItemClick('/authorization')}
                    >
                        {isAuthenticated ? 'Личный кабинет' : 'Войти'}
                    </button>
                    {isAuthenticated && isCabinetMenuOpen && (
                        <ul className={style.cabinetMenu}>
                            {cabinetMenuItems.map((item, index) => (
                                <li
                                    key={index}
                                    className={style.cabinetMenuItem}
                                    onClick={item.action ? item.action : () => handleItemClick(item.path)}
                                >
                                    {item.label}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <nav ref={menuRef} className={style.navigationMenu}>
                {navLinks.map((section, index) => (
                    <div
                        key={index}
                        className={`${style.navigationCategory} ${activeCategory === section.category ? style.activeCategory : ''}`}
                    >
                        <p className={style.categoryTitle} onClick={() => handleCategoryToggle(section.category)}>
                            {section.category}
                        </p>
                        {activeCategory === section.category && (
                            <ul className={style.navigationList}>
                                {section.items.map((item, idx) => (
                                    <li
                                        key={idx}
                                        className={`${style.navigationItem} ${location.pathname === item.path ? style.activeLink : ''}`}
                                        onClick={() => handleItemClick(item.path)}
                                    >
                                        <a className={style.navigationLink}>{item.label}</a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </nav>
            {!isInCabinet && (
                <div className={style.imageBanner}>
                    <img src="/images/img.png" alt="О компании" />
                </div>
            )}
        </header>
    );
}

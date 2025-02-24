import style from './index.module.scss';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function Header() {
    const [activeCategory, setActiveCategory] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const menuRef = useRef(null);

    // Проверяем, авторизован ли пользователь
    const isAuthenticated = localStorage.getItem('isProfileSet') === 'true';

    // Определяем, находится ли пользователь в личном кабинете
    const isInCabinet = ['/profile-settings', '/my-applications'].includes(location.pathname);

    const handleCategoryToggle = (category) => {
        setActiveCategory((prevCategory) => (prevCategory === category ? null : category));
    };

    const handleItemClick = (path) => {
        setActiveCategory(null);
        navigate(path);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveCategory(null);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

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

                <div className={style.loginWrapper}>
                    <button
                        className={style.loginButton}
                        onClick={() => handleItemClick(isAuthenticated ? '/my-applications' : '/authorization')}
                    >
                        {isAuthenticated ? 'Личный кабинет' : 'Войти'}
                    </button>
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
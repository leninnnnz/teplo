import style from './index.module.scss';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function Header() {
    const [activePage, setActivePage] = useState(window.location.pathname);
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigation = (path) => {
        setActivePage(path);
        navigate(path);
    };

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
                    <p className={`${style.logoText} ${activePage === '/' ? style.activeLink : ''}`} onClick={() => handleNavigation('/')}>
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
                    <button className={style.loginButton} onClick={() => handleNavigation('/login')}>
                        Войти
                    </button>
                </div>
            </div>

            <nav className={style.navigationMenu}>
                {navLinks.map((section, index) => (
                    <div key={index} className={style.navigationCategory}>
                        <p className={style.categoryTitle}>{section.category}</p>
                        <ul className={style.navigationList}>
                            {section.items.map((item, idx) => (
                                <li
                                    key={idx}
                                    className={`${style.navigationItem} ${location.pathname === item.path ? style.activeLink : ''}`}
                                    onClick={() => handleNavigation(item.path)}
                                >
                                    <a className={style.navigationLink}>{item.label}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </nav>
            <div className={style.imageBanner}>
                <img src="/images/img.png" alt="О компании" />
            </div>
        </header>
    );
}

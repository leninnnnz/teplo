import styles from './index.module.scss';
import { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

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
            items: [
                { path: '/occupational-safety', label: 'Охрана труда' },
            ],
        },
    ];

    return (
        <header className={styles.headerWrapper}>
            <div className={styles.headerContainer}>
                <div className={styles.logoWrapper}>
                    <p className={`${styles.logoText} ${activePage === '/' ? styles.activeLink : ''}`}
                       onClick={() => handleNavigation('/')}>ООО "УК "ТЕПЛОКОМПЛЕКС"</p>
                    <p className={styles.logoSubtitle}>Мы несем тепло в ваши дома</p>
                </div>

                <div className={styles.contactWrapper}>
                    <a href={'tel:+73439379828'} className={styles.contactPhone}>+7 (343) 937-98-28</a>
                    <i className="phoneIcon fas fa-phone-alt"></i>
                </div>

                <div className={styles.loginWrapper}>
                    <button className={styles.loginButton} onClick={() => handleNavigation('/login')}>Войти</button>
                </div>
            </div>

            <nav className={styles.navigationMenu}>
                {navLinks.map((section, index) => (
                    <div key={index} className={styles.navigationCategory}>
                        <p className={styles.categoryTitle}>{section.category}</p>
                        <ul>
                            {section.items.map((item, idx) => (
                                <li
                                    key={idx}
                                    className={`${styles.navigationItem} ${
                                        location.pathname === item.path ? styles.activeLink : ''
                                    }`}
                                    onClick={() => handleNavigation(item.path)}
                                >
                                    {item.label}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </nav>
            <div className={styles.imageBanner}>
                <img src="/images/img.png" alt="О компании"/>
            </div>
        </header>
    );
}

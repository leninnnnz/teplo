import style from './index.module.scss';

export function Footer() {
    const navLinks = [
        { path: '/client-info', label: 'Информация для клиентов' },
        { path: '/contacts', label: 'Контакты' },
        { path: '/fraud-prevention', label: 'Профилактика мошеннических действий' },
        { path: '/financial-reports', label: 'Бухгалтерская отчетность' },
        { path: '/important-info', label: 'Важная информация' },
        { path: '/disclosure-info', label: 'Раскрытие информации' },
        { path: '/business-scope', label: 'Сфера деятельности' },
        { path: '/partners', label: 'Партнеры' },
        { path: '/procurement-info', label: 'Информация о закупках' },
        { path: '/tariffs', label: 'Тарифы' },
        { path: '/technical-connection', label: 'Технологическое присоединение к ТС и ГВС' },
        { path: '/occupational-safety', label: 'Охрана труда' },
    ];

    return (
        <footer className={style.footer}>
            <div className={style.footerContainer}>
                <ul className={style.footerList}>
                    {navLinks.map((item, index) => (
                        <li key={index} className={style.footerItem}>
                            <a href={item.path} className={style.footerLink}>
                                {item.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
            <div className={style.footerBottom}>
                <p className={style.footerText}>ООО «УК ТЕПЛОКОМПЛЕКС» &copy; 2025</p>
            </div>
        </footer>
    );
}

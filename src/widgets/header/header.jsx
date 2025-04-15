import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import style from './index.module.scss';

export function Header() {
    const [activeCategory, setActiveCategory] = useState(null);
    const [isCabinetMenuOpen, setIsCabinetMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFading, setIsFading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const menuRef = useRef(null);
    const cabinetMenuRef = useRef(null);

    const images = ['/images/fountain1.jpg', '/images/fountain2.jpg'];

    console.log('Header render - isAuthenticated:', isAuthenticated, 'userRole:', userRole);

    const isInCabinet = [
        '/profile-settings',
        '/my-applications',
        '/submit-application',
        '/employee/applications',
        '/application/:id',
        '/employee/applications/:id',
        '/admin/users',
        '/admin/users/:id/applications',
        '/admin/applications/:id',
        '/admin/applications',
    ].some(
        (path) =>
            location.pathname === path ||
            location.pathname.startsWith('/application/') ||
            location.pathname.startsWith('/employee/applications/') ||
            location.pathname.startsWith('/admin/users/') ||
            location.pathname.startsWith('/admin/applications/'),
    );

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const isExpired = payload.exp * 1000 < Date.now();
                if (!isExpired) {
                    setIsAuthenticated(true);
                    setUserRole(payload.role);
                    localStorage.setItem('userRole', payload.role);
                } else {
                    handleLogout();
                }
            } catch (error) {
                console.error('Token decode error:', error);
                handleLogout();
            }
        } else {
            setIsAuthenticated(false);
            setUserRole(null);
            localStorage.removeItem('userRole');
        }
    }, []);

    useEffect(() => {
        const handleStorageChange = () => {
            const token = localStorage.getItem('token');
            let newRole = null;
            let newIsAuthenticated = false;
            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    newRole = payload.role;
                    newIsAuthenticated = payload.exp * 1000 > Date.now();
                } catch (error) {
                    console.error('Storage change token error:', error);
                }
            }
            setIsAuthenticated(newIsAuthenticated);
            setUserRole(newRole);
            console.log('Storage changed - isAuthenticated:', newIsAuthenticated, 'newRole:', newRole);
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleCategoryToggle = (category) => {
        setIsFading(true);
        setTimeout(() => {
            setActiveCategory((prevCategory) => {
                const newCategory = prevCategory === category ? null : category;
                setCurrentImageIndex(newCategory ? 1 : 0);
                setIsFading(false);
                return newCategory;
            });
        }, 250);
        setIsCabinetMenuOpen(false);
    };

    const handleItemClick = (path) => {
        setIsFading(true);
        setTimeout(() => {
            setActiveCategory(null);
            setCurrentImageIndex(0);
            setIsFading(false);
            navigate(path);
        }, 250);
        setIsCabinetMenuOpen(false);
    };

    const handleCabinetMenuToggle = () => {
        setIsFading(true);
        setTimeout(() => {
            setIsCabinetMenuOpen((prev) => !prev);
            setActiveCategory(null);
            setCurrentImageIndex(0);
            setIsFading(false);
        }, 250);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isProfileSet');
        localStorage.removeItem('userRole');
        setIsAuthenticated(false);
        setUserRole(null);
        setIsCabinetMenuOpen(false);
        setCurrentImageIndex(0);
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
                setIsFading(true);
                setTimeout(() => {
                    setActiveCategory(null);
                    setIsCabinetMenuOpen(false);
                    setCurrentImageIndex(0);
                    setIsFading(false);
                }, 250);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.addEventListener('click', handleClickOutside);
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

    const cabinetMenuItems = [];
    if (isAuthenticated) {
        cabinetMenuItems.push({ path: '/profile-settings', label: 'Настройки пользователя' });
        if (userRole === 'employee') {
            cabinetMenuItems.push({ path: '/employee/applications', label: 'Входящие заявления' });
        } else if (userRole === 'admin') {
            cabinetMenuItems.push({ path: '/admin/users', label: 'Список пользователей' });
            cabinetMenuItems.push({ path: '/admin/applications', label: 'Список заявлений' });
        } else if (userRole === 'user') {
            cabinetMenuItems.push({ path: '/my-applications', label: 'Мои заявления' });
        }
        cabinetMenuItems.push({ action: handleLogout, label: 'Выйти' });
    }

    console.log('cabinetMenuItems:', cabinetMenuItems);

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
            {!isInCabinet && (
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
            )}
            {!isAuthenticated && !isInCabinet && (
                <div className={style.imageBanner}>
                    <img src={images[currentImageIndex]} alt="Фонтан" className={`${style.bannerImage} ${isFading ? style.fadeOut : ''}`} />
                </div>
            )}
        </header>
    );
}

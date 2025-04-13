import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Content, TitlePage, Wrapper } from '../../shared/UI';
import style from './index.module.scss';

export function EmployeeApplications() {
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('Все');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    throw new Error('Вы не авторизованы');
                }

                const response = await fetch('http://localhost:5001/api/employee/applications', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    if (response.status === 401 || response.status === 403) {
                        localStorage.removeItem('token');
                        navigate('/login');
                    }
                    throw new Error(errorData.message || 'Ошибка загрузки заявлений');
                }

                const data = await response.json();
                setApplications(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [navigate]);

    const handleCardClick = (applicationId) => {
        navigate(`/employee/applications/${applicationId}`);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const getFullName = (user) => {
        if (!user || (!user.firstName && !user.lastName && !user.patronymic)) {
            console.log('No user data:', user);
            return 'Не указан';
        }
        const { firstName = '', lastName = '', patronymic = '' } = user;
        return `${lastName} ${firstName} ${patronymic}`.trim() || 'Не указан';
    };

    const filteredApplications = applications.filter((app) => {
        const matchesStatus = filterStatus === 'Все' || app.status === filterStatus;
        const matchesSearch =
            app._id.toLowerCase().includes(searchQuery.toLowerCase()) || app.type.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    if (loading) return <div className={style.loading}>Загрузка...</div>;
    if (error) return <div className={style.error}>{error}</div>;

    return (
        <Wrapper>
            <TitlePage title="Входящие заявления" />
            <Content>
                <div className={style.controls}>
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={style.filterSelect}>
                        <option value="Все">Все статусы</option>
                        <option value="В обработке">В обработке</option>
                        <option value="Одобрено">Одобрено</option>
                        <option value="Вернулось">Вернулось</option>
                    </select>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Поиск по номеру или типу"
                        className={style.searchInput}
                    />
                </div>
                <div className={style.applicationsList}>
                    {filteredApplications.length === 0 ? (
                        <p className={style.noResults}>Заявления не найдены</p>
                    ) : (
                        filteredApplications.map((app) => (
                            <div key={app._id} className={style.applicationCard} onClick={() => handleCardClick(app._id)}>
                                <div className={style.cardHeader}>
                                    <span className={style.cardNumber}>№ {app._id}</span>
                                    <span className={style.cardType}>{app.type}</span>
                                </div>
                                <div className={style.cardBody}>
                                    <p className={style.cardDate}>Пользователь: {getFullName(app.userId)}</p>
                                    <p className={style.cardDate}>Дата изменения: {formatDate(app.updatedAt || app.createdAt)}</p>
                                    <p className={style.cardStatus}>Статус: {app.status}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Content>
        </Wrapper>
    );
}

export default EmployeeApplications;

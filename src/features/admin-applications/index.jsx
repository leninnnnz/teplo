import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Content, TitlePage, Wrapper, UIInput } from '../../shared/UI';
import styles from './index.module.scss';

const AdminApplications = () => {
    const [applications, setApplications] = useState([]);
    const [filteredApplications, setFilteredApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [dateSort, setDateSort] = useState('newest');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/authorization');
            return;
        }

        const fetchApplications = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/admin/applications', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    if (response.status === 401 || response.status === 403) {
                        localStorage.removeItem('token');
                        navigate('/authorization');
                    }
                    throw new Error(errorData.message || 'Ошибка загрузки заявлений');
                }

                const data = await response.json();
                console.log('Fetched applications:', data);
                setApplications(data);
                setFilteredApplications(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [navigate]);

    useEffect(() => {
        let result = [...applications];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (app) => app._id.toLowerCase().includes(query) || (app.userId?.email && app.userId.email.toLowerCase().includes(query)),
            );
        }

        if (typeFilter) {
            result = result.filter((app) => app.type === typeFilter);
        }

        if (statusFilter) {
            result = result.filter((app) => app.status === statusFilter);
        }

        const statusOrder = {
            'В обработке': 1,
            Вернулось: 2,
            Одобрено: 3,
            Завершённый: 4,
        };
        result.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);

        if (dateSort === 'newest') {
            result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else {
            result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }

        setFilteredApplications(result);
    }, [searchQuery, typeFilter, statusFilter, dateSort, applications]);

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return `${date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })}, ${date.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
        })}`;
    };

    const handleResetFilters = () => {
        setSearchQuery('');
        setTypeFilter('');
        setStatusFilter('');
        setDateSort('newest');
    };

    return (
        <Wrapper>
            <TitlePage title="Список всех заявлений" />
            <Content>
                {loading ? (
                    <div className={styles.loading}>
                        <p>Загрузка...</p>
                    </div>
                ) : error ? (
                    <div className={styles.error}>
                        <p>{error}</p>
                    </div>
                ) : (
                    <>
                        <div className={styles.filters}>
                            <UIInput
                                type="text"
                                value={searchQuery}
                                onChange={(value) => setSearchQuery(value)}
                                placeholder="Поиск по номеру или email..."
                                className={styles.searchInput}
                            />
                            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className={styles.filterSelect}>
                                <option value="">Все типы</option>
                                <option value="ГВС">ГВС</option>
                                <option value="ХВС">ХВС</option>
                                <option value="ТС">ТС</option>
                            </select>
                            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={styles.filterSelect}>
                                <option value="">Все статусы</option>
                                <option value="В обработке">В обработке</option>
                                <option value="Вернулось">Вернулось</option>
                                <option value="Одобрено">Одобрено</option>
                                <option value="Завершённый">Завершённый</option>
                            </select>
                            <select value={dateSort} onChange={(e) => setDateSort(e.target.value)} className={styles.filterSelect}>
                                <option value="newest">Новые</option>
                                <option value="oldest">Старые</option>
                            </select>
                            <button onClick={handleResetFilters} className={styles.resetButton}>
                                Сбросить
                            </button>
                        </div>
                        <div className={styles.applicationsList}>
                            {filteredApplications.length === 0 ? (
                                <div className={styles.emptyState}>
                                    <p className={styles.emptyText}>Заявления не найдены</p>
                                </div>
                            ) : (
                                filteredApplications.map((app) => (
                                    <div
                                        key={app._id}
                                        className={styles.applicationCard}
                                        onClick={() => navigate(`/admin/applications/${app._id}`)}
                                    >
                                        <div className={styles.cardBody}>
                                            <p className={styles.cardType}>{app.type}</p>
                                            <p className={styles.cardNumber}>№ {app._id}</p>
                                            <p className={styles.cardEmail}>Пользователь: {app.userId?.email || 'Не указан'}</p>
                                            <p className={styles.cardDate}>Дата подачи: {formatDateTime(app.createdAt)}</p>
                                            {app.updatedAt && (
                                                <p className={styles.cardUpdate}>Дата изменения: {formatDateTime(app.updatedAt)}</p>
                                            )}
                                            <div className={styles.cardStatus}>
                                                <span className={styles.statusLabel}>Статус:</span>
                                                <span className={styles[`status-${app.status.toLowerCase().replace(' ', '-')}`]}>
                                                    {app.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <button className={styles.backButton} onClick={() => navigate('/admin/users')}>
                            Назад
                        </button>
                    </>
                )}
            </Content>
        </Wrapper>
    );
};

export default AdminApplications;

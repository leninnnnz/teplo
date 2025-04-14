import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Content, TitlePage, Wrapper } from '../../shared/UI';
import { HotWater, ColdWater, Heating, Pending, Approved, Rejected } from '../../shared/UI/icons';
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

    const getFullName = (user) => {
        if (!user || (!user.firstName && !user.lastName && !user.patronymic)) {
            console.log('No user data:', user);
            return 'Не указан';
        }
        const { firstName = '', lastName = '', patronymic = '' } = user;
        return `${lastName} ${firstName} ${patronymic}`.trim() || 'Не указан';
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'ГВС':
                return <HotWater className={style.typeIcon} />;
            case 'ХВС':
                return <ColdWater className={style.typeIcon} />;
            case 'ТС':
                return <Heating className={style.typeIcon} />;
            default:
                return null;
        }
    };

    const filteredApplications = applications.filter((app) => {
        const matchesStatus = filterStatus === 'Все' || app.status === filterStatus;
        const matchesSearch =
            app._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
            getFullName(app.userId).toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    return (
        <Wrapper>
            <TitlePage title="Входящие заявления" />
            <Content>
                {loading ? (
                    <div className={style.loading}>
                        <p>Загрузка...</p>
                    </div>
                ) : error ? (
                    <div className={style.error}>
                        <p>{error}</p>
                    </div>
                ) : (
                    <>
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
                                placeholder="Поиск по номеру, типу или пользователю"
                                className={style.searchInput}
                            />
                        </div>
                        <div className={style.applicationsList}>
                            {filteredApplications.length === 0 ? (
                                <div className={style.emptyState}>
                                    <p className={style.emptyText}>Заявления не найдены</p>
                                </div>
                            ) : (
                                filteredApplications.map((app) => (
                                    <div key={app._id} className={style.applicationCard} onClick={() => handleCardClick(app._id)}>
                                        <div className={style.cardBody}>
                                            <div className={style.cardTypeWrapper}>
                                                <p className={style.cardType}>{app.type}</p>
                                            </div>
                                            <p className={style.cardNumber}>№ {app._id}</p>
                                            <p className={style.cardDate}>Пользователь: {getFullName(app.userId)}</p>
                                            <p className={style.cardDate}>Дата подачи заявления: {formatDateTime(app.createdAt)}</p>
                                            {app.updatedAt && (
                                                <p className={style.cardUpdate}>
                                                    Дата последнего изменения: {formatDateTime(app.updatedAt)}
                                                </p>
                                            )}
                                            <div className={style.cardStatus}>
                                                <span className={style.statusLabel}>Статус: </span>
                                                <span className={style[`status-${app.status.toLowerCase().replace(' ', '-')}`]}>
                                                    {app.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                )}
            </Content>
        </Wrapper>
    );
}

export default EmployeeApplications;

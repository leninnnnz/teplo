import style from './index.module.scss';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Content, TitlePage, Wrapper } from '../../shared/UI';
import { HotWater, ColdWater, Heating, Pending, Approved, Rejected } from '../../shared/UI/icons';

export function MyApplications() {
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Вы не авторизованы');
                }

                const response = await fetch('http://localhost:5001/api/applications', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Ошибка загрузки заявлений');
                }

                const data = await response.json();
                setApplications(data);
            } catch (err) {
                console.error('Fetch error:', err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    const handleNewApplication = () => {
        navigate('/submit-application');
    };

    const handleCardClick = (id) => {
        navigate(`/application/${id}`);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
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

    const getStatusIcon = (status) => {
        switch (status) {
            case 'В обработке':
                return <Pending className={style.statusIcon} />;
            case 'Одобрено':
                return <Approved className={style.statusIcon} />;
            case 'Вернулось':
                return <Rejected className={style.statusIcon} />;
            default:
                return null;
        }
    };

    return (
        <Wrapper>
            <TitlePage title="Мои заявления" />
            <Content>
                {loading ? (
                    <div className={style.loading}>
                        <p>Загрузка...</p>
                    </div>
                ) : error ? (
                    <div className={style.error}>
                        <p>{error}</p>
                    </div>
                ) : applications.length === 0 ? (
                    <div className={style.emptyState}>
                        <p className={style.emptyText}>У вас пока нет заявлений</p>
                        <button className={style.submitButton} onClick={handleNewApplication}>
                            Подать заявление
                        </button>
                    </div>
                ) : (
                    <div className={style.applicationsList}>
                        {applications.map((app) => (
                            <div key={app._id} className={style.applicationCard} onClick={() => handleCardClick(app._id)}>
                                <div className={style.cardHeader}>
                                    <span className={style.cardNumber}>№ {app._id}</span>
                                    {getTypeIcon(app.type)}
                                </div>
                                <div className={style.cardBody}>
                                    <p className={style.cardType}>{app.type}</p>
                                    <p className={style.cardDate}>{formatDate(app.createdAt)}</p>
                                </div>
                                <div className={style.cardFooter}>
                                    {getStatusIcon(app.status)}
                                    <span className={style[`status-${app.status.toLowerCase().replace(' ', '-')}`]}>{app.status}</span>
                                </div>
                            </div>
                        ))}
                        <button className={style.submitButton} onClick={handleNewApplication}>
                            Подать заявление
                        </button>
                    </div>
                )}
            </Content>
        </Wrapper>
    );
}

export default MyApplications;

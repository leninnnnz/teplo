import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Content, TitlePage, Wrapper } from '../../shared/UI';
import { IconTrash } from '../../shared/UI/icons';
import style from './index.module.scss';

const AdminUserApplications = () => {
    const { id } = useParams();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/authorization');
            return;
        }

        const fetchApplications = async () => {
            try {
                const response = await fetch(`http://localhost:5001/api/admin/users/${id}/applications`, {
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
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [id, navigate]);

    const handleDelete = async (appId) => {
        if (!window.confirm('Вы уверены, что хотите удалить заявление?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5001/api/admin/applications/${appId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Ошибка удаления заявления');
            }

            setApplications(applications.filter((app) => app._id !== appId));
        } catch (err) {
            setError(err.message);
        }
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

    return (
        <Wrapper>
            <TitlePage title="Заявления пользователя" />
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
                        <div className={style.applicationsList}>
                            {applications.length === 0 ? (
                                <div className={style.emptyState}>
                                    <p className={style.emptyText}>Заявления не найдены</p>
                                </div>
                            ) : (
                                applications.map((app) => (
                                    <div
                                        key={app._id}
                                        className={style.applicationCard}
                                        onClick={() => navigate(`/admin/applications/${app._id}`)}
                                    >
                                        <div className={style.cardBody}>
                                            <p className={style.cardType}>{app.type}</p>
                                            <p className={style.cardNumber}>№ {app._id}</p>
                                            <p className={style.cardDate}>Дата подачи: {formatDateTime(app.createdAt)}</p>
                                            {app.updatedAt && (
                                                <p className={style.cardUpdate}>Дата изменения: {formatDateTime(app.updatedAt)}</p>
                                            )}
                                            <div className={style.cardStatus}>
                                                <span className={style.statusLabel}>Статус:</span>
                                                <span className={style[`status-${app.status.toLowerCase().replace(' ', '-')}`]}>
                                                    {app.status}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(app._id);
                                            }}
                                            className={style.deleteButton}
                                            title="Удалить заявление"
                                        >
                                            <IconTrash className={style.deleteIcon} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className={style.backButtonWrapper}>
                            <button onClick={() => navigate('/admin/users')} className={style.backButton}>
                                Назад
                            </button>
                        </div>
                    </>
                )}
            </Content>
        </Wrapper>
    );
};

export default AdminUserApplications;

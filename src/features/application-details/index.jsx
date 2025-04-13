import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Content, TitlePage, Wrapper } from '../../shared/UI';
import style from './index.module.scss';

export function ApplicationDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    throw new Error('Вы не авторизованы');
                }

                const response = await fetch(`http://localhost:5001/api/applications/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    if (response.status === 401) {
                        localStorage.removeItem('token');
                        navigate('/login');
                    }
                    throw new Error(errorData.message || 'Ошибка загрузки заявления');
                }

                const data = await response.json();
                setApplication(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchApplication();
    }, [id, navigate]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const handleDownload = (docIndex) => {
        if (!application || !application.documents[docIndex]) return;

        const doc = application.documents[docIndex];
        const blob = new Blob([new Uint8Array(doc.data.data)], { type: doc.contentType });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${requiredDocs[docIndex]}.${doc.contentType.split('/')[1]}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    const requiredDocs = ['Скан заполненного заявления', 'Скан паспорта', 'Скан СНИЛС'];

    const getUserFriendlyId = (id) => {
        return id.slice(-6);
    };

    if (loading) return <div className={style.loading}>Загрузка...</div>;
    if (error) return <div className={style.error}>{error}</div>;

    return (
        <Wrapper>
            <TitlePage title={`Заявление №${getUserFriendlyId(id)}`} />
            <Content>
                {application && (
                    <div className={style.detailsContainer}>
                        <div className={style.detailItem}>
                            <span className={style.detailLabel}>Тип:</span>
                            <span className={style.detailValue}>{application.type}</span>
                        </div>
                        <div className={style.detailItem}>
                            <span className={style.detailLabel}>Дата подачи:</span>
                            <span className={style.detailValue}>{formatDate(application.createdAt)}</span>
                        </div>
                        <div className={style.detailItem}>
                            <span className={style.detailLabel}>Статус:</span>
                            <span className={style.detailValue}>{application.status}</span>
                        </div>
                        <div className={style.detailItem}>
                            <span className={style.detailLabel}>Документы:</span>
                            <ul className={style.docList}>
                                {application.documents.map((doc, index) => (
                                    <li key={index} className={style.docItem}>
                                        <button className={style.downloadButton} onClick={() => handleDownload(index)}>
                                            Скачать {requiredDocs[index]}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className={style.commentSection}>
                            <span className={style.detailLabel}>Комментарий сотрудника:</span>
                            <div className={style.commentHistory}>
                                {application.comments && application.comments.length > 0 ? (
                                    application.comments.map((c, index) => (
                                        <p key={index} className={style.commentText}>
                                            <strong>{c.author ? `${c.author.lastName} ${c.author.firstName}` : 'Сотрудник'}</strong> (
                                            {formatDate(c.createdAt)}): {c.text}
                                        </p>
                                    ))
                                ) : (
                                    <p className={style.commentText}>Комментариев нет</p>
                                )}
                            </div>
                        </div>
                        <button className={style.backButton} onClick={() => navigate('/my-applications')}>
                            Назад
                        </button>
                    </div>
                )}
            </Content>
        </Wrapper>
    );
}

export default ApplicationDetails;

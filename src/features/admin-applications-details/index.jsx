import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Content, TitlePage, Wrapper } from '../../shared/UI';
import styles from './index.module.scss';

export function AdminApplicationDetails() {
    const { id } = useParams();
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/authorization');
            return;
        }

        const fetchApplication = async () => {
            try {
                const response = await fetch(`http://localhost:5001/api/admin/applications/${id}`, {
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
                    throw new Error(errorData.message || 'Ошибка загрузки заявления');
                }

                const data = await response.json();
                console.log('Fetched application:', data);
                setApplication(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchApplication();
    }, [id, navigate]);

    const handleStatusChange = async (newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5001/api/admin/applications/${id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ошибка изменения статуса');
            }

            const updatedApplication = await response.json();
            setApplication(updatedApplication);
        } catch (err) {
            setError(err.message);
        }
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

    const handleCommentFileDownload = (commentId) => {
        const comment = application.comments.find((c) => c._id === commentId);
        if (!comment || !comment.file) return;

        const blob = new Blob([new Uint8Array(comment.file.data.data)], { type: comment.file.contentType });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `comment_file_${commentId}.${comment.file.contentType.split('/')[1]}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date
            .toLocaleString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
            })
            .replace(',', '');
    };

    const requiredDocs = ['Скан заполненного заявления', 'Скан паспорта', 'Скан СНИЛС'];

    if (loading) return <div className={styles.loading}>Загрузка...</div>;
    if (error) return <div className={styles.error}>Ошибка: {error}</div>;
    if (!application) return <div className={styles.error}>Заявление не найдено</div>;

    return (
        <Wrapper>
            <TitlePage title={`Заявление №${id}`} />
            <Content>
                <div className={styles.detailsContainer}>
                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Тип:</span>
                        <span className={styles.detailValue}>{application.type || 'Не указан'}</span>
                    </div>
                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Дата подачи:</span>
                        <span className={styles.detailValue}>{formatDate(application.createdAt)}</span>
                    </div>
                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Статус:</span>
                        <span className={styles.detailValue}>
                            <select
                                value={application.status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                className={styles.statusDropdown}
                            >
                                <option value="В обработке">В обработке</option>
                                <option value="Одобрено">Одобрено</option>
                                <option value="Вернулось">Вернулось</option>
                                <option value="Завершённый">Завершённый</option>
                            </select>
                        </span>
                    </div>
                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Пользователь:</span>
                        <span className={styles.detailValue}>
                            {application.userId
                                ? `${application.userId.lastName || ''} ${application.userId.firstName || ''} ${
                                      application.userId.patronymic || ''
                                  }`.trim() || 'Не указан'
                                : 'Не указан'}
                        </span>
                    </div>
                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Документы:</span>
                        <ul className={styles.docList}>
                            {application.documents.length > 0 ? (
                                application.documents.map((doc, index) => (
                                    <li key={index} className={styles.docItem}>
                                        <button className={styles.downloadButton} onClick={() => handleDownload(index)}>
                                            Скачать {requiredDocs[index] || `Документ ${index + 1}`}
                                        </button>
                                    </li>
                                ))
                            ) : (
                                <li className={styles.docItem}>Документы отсутствуют</li>
                            )}
                        </ul>
                    </div>
                    <div className={styles.commentSection}>
                        <span className={styles.detailLabel}>Комментарии:</span>
                        <div className={styles.commentHistory}>
                            {application.comments && application.comments.length > 0 ? (
                                application.comments.map((c) => (
                                    <div key={c._id} className={styles.commentItem}>
                                        <p className={styles.commentText}>
                                            <strong>
                                                {c.author
                                                    ? `${c.author.lastName || ''} ${c.author.firstName || ''}`.trim() || 'Сотрудник'
                                                    : 'Сотрудник'}
                                            </strong>{' '}
                                            ({formatDate(c.createdAt)}): {c.text || (c.file ? '(файл без текста)' : '(пустой комментарий)')}
                                            {c.file && (
                                                <button
                                                    className={styles.downloadCommentFile}
                                                    onClick={() => handleCommentFileDownload(c._id)}
                                                >
                                                    Скачать файл
                                                </button>
                                            )}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className={styles.commentText}>Комментариев нет</p>
                            )}
                        </div>
                    </div>
                    <button className={styles.backButton} onClick={() => navigate(`/admin/users/${application.userId._id}/applications`)}>
                        Назад
                    </button>
                </div>
            </Content>
        </Wrapper>
    );
}

export default AdminApplicationDetails;

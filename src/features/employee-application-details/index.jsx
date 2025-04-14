import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Content, TitlePage, Wrapper } from '../../shared/UI';
import { IconTrash, IconAttach } from '../../shared/UI/icons';
import style from './index.module.scss';

export function EmployeeApplicationDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comment, setComment] = useState('');
    const [commentFile, setCommentFile] = useState(null);

    const fetchApplication = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                throw new Error('Вы не авторизованы');
            }

            const response = await fetch(`http://localhost:5001/api/employee/applications/${id}`, {
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

    useEffect(() => {
        fetchApplication();
    }, [id, navigate]);

    const handleStatusChange = async (newStatus) => {
        try {
            const token = localStorage.getItem('token');
            console.log('Sending status update:', { id, status: newStatus });
            const response = await fetch(`http://localhost:5001/api/employee/applications/${id}`, {
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
            console.log('Status updated:', updatedApplication);
            setApplication(updatedApplication);
        } catch (err) {
            console.error('Status change error:', err);
            setError(err.message);
        }
    };

    const handleCommentSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            if (comment) {
                formData.append('comment', comment);
            }
            if (commentFile) {
                formData.append('commentFile', commentFile);
            }

            console.log('Sending comment:', { id, comment, commentFile: commentFile?.name });
            const response = await fetch(`http://localhost:5001/api/employee/applications/${id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ошибка сохранения комментария');
            }

            const updatedApplication = await response.json();
            console.log('Comment saved:', updatedApplication);
            setApplication(updatedApplication);
            setComment('');
            setCommentFile(null);
        } catch (err) {
            console.error('Comment save error:', err);
            setError(err.message);
        }
    };

    const handleCommentDelete = async (commentId) => {
        try {
            const token = localStorage.getItem('token');
            console.log('Deleting comment:', { id, commentId });
            const response = await fetch(`http://localhost:5001/api/applications/${id}/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ошибка удаления комментария');
            }

            const updatedApplication = await response.json();
            console.log('Comment deleted:', updatedApplication);
            setApplication(updatedApplication);
        } catch (err) {
            console.error('Comment delete error:', err);
            setError(err.message);
        }
    };

    const handleFileChange = (e) => {
        setCommentFile(e.target.files[0]);
    };

    const handleFileRemove = () => {
        setCommentFile(null);
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

    const requiredDocs = ['Скан заполненного заявления', 'Скан паспорта', 'Скан СНИЛС'];

    if (loading) return <div className={style.loading}>Загрузка...</div>;
    if (error) return <div className={style.error}>Ошибка: {error}</div>;
    if (!application) return <div className={style.error}>Заявление не найдено</div>;

    return (
        <Wrapper>
            <TitlePage title={`Заявление №${id}`} />
            <Content>
                <div className={style.detailsContainer}>
                    <div className={style.detailItem}>
                        <span className={style.detailLabel}>Тип:</span>
                        <span className={style.detailValue}>{application.type || 'Не указан'}</span>
                    </div>
                    <div className={style.detailItem}>
                        <span className={style.detailLabel}>Дата подачи:</span>
                        <span className={style.detailValue}>{formatDate(application.createdAt)}</span>
                    </div>
                    <div className={style.detailItem}>
                        <span className={style.detailLabel}>Статус:</span>
                        <span className={style.detailValue}>
                            <select
                                value={application.status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                className={style.statusDropdown}
                            >
                                <option value="В обработке">В обработке</option>
                                <option value="Одобрено">Одобрено</option>
                                <option value="Вернулось">Вернулось</option>
                                <option value="Завершённый">Завершённый</option>
                            </select>
                        </span>
                    </div>
                    <div className={style.detailItem}>
                        <span className={style.detailLabel}>Пользователь:</span>
                        <span className={style.detailValue}>
                            {application.userId
                                ? `${application.userId.lastName || ''} ${application.userId.firstName || ''} ${
                                      application.userId.patronymic || ''
                                  }`.trim() || 'Не указан'
                                : 'Не указан'}
                        </span>
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
                        <span className={style.detailLabel}>Комментарии:</span>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Введите комментарий..."
                            className={style.commentInput}
                        />
                        <div className={style.actionButtons}>
                            <div className={style.fileInputWrapper}>
                                <label className={`${style.fileInputLabel} ${commentFile ? style.fileAttached : ''}`}>
                                    <span>{commentFile ? commentFile.name : 'Прикрепить файл'}</span>
                                    <input type="file" onChange={handleFileChange} className={style.fileInput} accept=".pdf,.jpg,.png" />
                                </label>
                                {commentFile && (
                                    <button className={style.removeFileButton} onClick={handleFileRemove} title="Удалить файл">
                                        <IconTrash className={style.trashIcon} />
                                    </button>
                                )}
                            </div>
                            <button className={style.submitButton} onClick={handleCommentSave}>
                                Добавить комментарий
                            </button>
                        </div>
                        <div className={style.commentHistory}>
                            {application.comments && application.comments.length > 0 ? (
                                application.comments.map((c) => (
                                    <div key={c._id} className={style.commentItem}>
                                        <p className={style.commentText}>
                                            <strong>
                                                {c.author ? `${c.author.lastName || ''} ${c.author.firstName || ''}`.trim() : 'Сотрудник'}
                                            </strong>{' '}
                                            ({formatDate(c.createdAt)}): {c.text || (c.file ? '(файл без текста)' : '(пустой комментарий)')}
                                            {c.file && (
                                                <button
                                                    className={style.downloadCommentFile}
                                                    onClick={() => handleCommentFileDownload(c._id)}
                                                >
                                                    Скачать файл
                                                </button>
                                            )}
                                        </p>
                                        <button
                                            className={style.deleteCommentButton}
                                            onClick={() => handleCommentDelete(c._id)}
                                            title="Удалить комментарий"
                                            data-testid="delete-comment-button"
                                        >
                                            <IconTrash className={style.trashIcon} />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className={style.commentText}>Комментариев нет</p>
                            )}
                        </div>
                    </div>
                    <button className={style.backButton} onClick={() => navigate('/employee/applications')}>
                        Назад
                    </button>
                </div>
            </Content>
        </Wrapper>
    );
}

export default EmployeeApplicationDetails;

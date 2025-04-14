import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Content, TitlePage, Wrapper } from '../../shared/UI';
import { IconTrash } from '../../shared/UI/icons'; // Добавляем IconAttach
import style from './index.module.scss';

export function ApplicationDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newDocuments, setNewDocuments] = useState([]);
    const [comment, setComment] = useState('');
    const [commentFile, setCommentFile] = useState(null);
    const [deletedDocs, setDeletedDocs] = useState([]);

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
                console.log('Fetched application:', data);
                setApplication(data);
                setNewDocuments(new Array(data.documents.length).fill(null));
                setDeletedDocs(new Array(data.documents.length).fill(false)); // Инициализация
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

    const handleFileChange = (index, file) => {
        const updatedDocuments = [...newDocuments];
        updatedDocuments[index] = file;
        setNewDocuments(updatedDocuments);
        const updatedDeleted = [...deletedDocs];
        updatedDeleted[index] = false; // Сбрасываем флаг удаления
        setDeletedDocs(updatedDeleted);
    };

    const handlePreviewNewDocument = (index) => {
        const file = newDocuments[index];
        if (!file) return;

        const url = window.URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    const handleRemoveDocument = (index) => {
        const updatedDocuments = [...newDocuments];
        updatedDocuments[index] = null;
        setNewDocuments(updatedDocuments);
        const updatedDeleted = [...deletedDocs];
        updatedDeleted[index] = true; // Помечаем как удалённый
        setDeletedDocs(updatedDeleted);
    };
    const handleCommentFileChange = (e) => {
        setCommentFile(e.target.files[0]);
    };

    const handleRemoveCommentFile = () => {
        setCommentFile(null);
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();

            newDocuments.forEach((file, index) => {
                if (file) {
                    formData.append(`document_${index}`, file);
                }
            });

            formData.append('comment', comment || '');
            if (commentFile) {
                formData.append('commentFile', commentFile);
            }

            formData.append('status', 'В обработке');

            console.log('Sending FormData:', {
                comment: comment || '',
                commentFile: commentFile ? commentFile.name : null,
                documents: newDocuments.map((f) => (f ? f.name : null)),
            });

            const response = await fetch(`http://localhost:5001/api/applications/${id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ошибка сохранения изменений');
            }

            const updatedApplication = await response.json();
            console.log('Updated application:', updatedApplication);
            setApplication(updatedApplication);
            setNewDocuments(new Array(updatedApplication.documents.length).fill(null));
            setDeletedDocs(new Array(updatedApplication.documents.length).fill(false)); // Сбрасываем
            setComment('');
            setCommentFile(null);
        } catch (err) {
            setError(err.message);
        }
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
                            <span className={style.detailValue}>{application.type || 'Не указан'}</span>
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
                                        {application.status === 'Вернулось' && (deletedDocs[index] || newDocuments[index]) ? (
                                            newDocuments[index] ? (
                                                <button className={style.downloadButton} onClick={() => handlePreviewNewDocument(index)}>
                                                    Скачать {newDocuments[index].name}
                                                </button>
                                            ) : (
                                                <label className={style.attachFileLabel}>
                                                    <span>Прикрепить скан {requiredDocs[index]}</span>
                                                    <input
                                                        type="file"
                                                        onChange={(e) => handleFileChange(index, e.target.files[0])}
                                                        accept=".pdf,.jpg,.png"
                                                        className={style.fileInput}
                                                    />
                                                </label>
                                            )
                                        ) : (
                                            <>
                                                <button className={style.downloadButton} onClick={() => handleDownload(index)}>
                                                    Скачать {requiredDocs[index]}
                                                </button>
                                                {application.status === 'Вернулось' && (
                                                    <div className={style.fileInputWrapper}>
                                                        <button
                                                            className={style.removeFileButton}
                                                            onClick={() => handleRemoveDocument(index)}
                                                            title="Удалить документ"
                                                        >
                                                            <IconTrash className={style.trashIcon} />
                                                        </button>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {application.status === 'Вернулось' && (
                            <div className={style.editSection}>
                                <span className={style.detailLabel}>Комментарий:</span>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Введите комментарий (необязательно)..."
                                    className={style.commentInput}
                                />
                                <div className={style.actionButtons}>
                                    <div className={style.fileInputWrapper}>
                                        <label className={`${style.fileInputLabel} ${commentFile ? style.fileAttached : ''}`}>
                                            <span>{commentFile ? commentFile.name : 'Прикрепить файл (необязательно)'}</span>
                                            <input
                                                type="file"
                                                onChange={handleCommentFileChange}
                                                accept=".pdf,.jpg,.png"
                                                className={style.fileInput}
                                            />
                                        </label>
                                        {commentFile && (
                                            <button
                                                className={style.removeFileButton}
                                                onClick={handleRemoveCommentFile}
                                                title="Удалить файл"
                                            >
                                                <IconTrash className={style.trashIcon} />
                                            </button>
                                        )}
                                    </div>
                                    <button className={style.saveButton} onClick={handleSave}>
                                        Сохранить
                                    </button>
                                </div>
                            </div>
                        )}
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
                                    </div>
                                ))
                            ) : (
                                <p className={style.commentText}>Комментариев нет</p>
                            )}
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

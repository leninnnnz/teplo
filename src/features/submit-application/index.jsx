import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Content, TitlePage, Wrapper } from '../../shared/UI';
import { IconTrash } from '../../shared/UI/icons'; // Добавляем иконку удаления
import style from './index.module.scss';

export function SubmitApplication() {
    const [type, setType] = useState('');
    const [files, setFiles] = useState({
        'Скан заполненного заявления': null,
        'Скан паспорта': null,
        'Скан СНИЛС': null,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const applicationTypes = {
        ТС: {
            name: 'Отопление (ТС)',
            template: '/templates/heating-template.pdf',
        },
        ГВС: {
            name: 'Горячее водоснабжение (ГВС)',
            template: '/templates/hot-water-template.pdf',
        },
        ХВС: {
            name: 'Холодное водоснабжение (ХВС)',
            template: '/templates/cold-water-template.pdf',
        },
    };

    const requiredDocs = ['Скан заполненного заявления', 'Скан паспорта', 'Скан СНИЛС'];

    const handleFileChange = (docName) => (e) => {
        setFiles((prev) => ({ ...prev, [docName]: e.target.files[0] }));
    };

    const handleRemoveFile = (docName) => () => {
        setFiles((prev) => ({ ...prev, [docName]: null }));
    };

    const allDocsUploaded = requiredDocs.every((doc) => files[doc] !== null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!type) {
            setError('Выберите тип заявления');
            return;
        }

        if (!allDocsUploaded) {
            setError('Прикрепите все необходимые документы');
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('type', type);
        requiredDocs.forEach((docName) => {
            if (files[docName]) formData.append('documents', files[docName]);
        });

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5001/api/applications', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Ошибка подачи заявления');
            }

            setType('');
            setFiles({
                'Скан заполненного заявления': null,
                'Скан паспорта': null,
                'Скан СНИЛС': null,
            });
            alert('Заявление успешно подано!');
            navigate('/my-applications');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <Wrapper>
            <TitlePage title="Подача заявления" />
            <Content>
                <p className={style.subtitle}>Заполните форму для подачи заявления</p>
                <form className={style.form} onSubmit={handleSubmit}>
                    <div className={style.formGroup}>
                        <label htmlFor="type" className={style.sectionTitle}>
                            Тип заявления
                        </label>
                        <select
                            id="type"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            disabled={loading}
                            className={style.select}
                        >
                            <option value="">Выберите тип</option>
                            {Object.keys(applicationTypes).map((key) => (
                                <option key={key} value={key}>
                                    {applicationTypes[key].name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {type && (
                        <>
                            <div>
                                <h3 className={style.sectionTitle}>Инструкция</h3>
                                <div className={style.instructionCard}>
                                    <p className={style.templateText}>Скачайте и заполните шаблон заявления:</p>
                                    <a href={applicationTypes[type].template} download className={style.templateButton}>
                                        Скачать шаблон для {applicationTypes[type].name}
                                    </a>
                                    <p className={style.templateText}>Необходимые документы:</p>
                                    <ol className={style.docList}>
                                        {requiredDocs.map((doc) => (
                                            <li key={doc} className={style.docItem}>
                                                {doc}
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            </div>

                            <div>
                                <h3 className={style.sectionTitle}>Прикрепите сканы документов</h3>
                                {requiredDocs.map((doc) => (
                                    <div key={doc} className={style.fileCard}>
                                        <label className={style.fileLabel}>{doc}</label>
                                        <div className={style.fileInputWrapper}>
                                            <label className={style.customFileInput}>
                                                <span>{files[doc] ? files[doc].name : 'Выбрать файл'}</span>
                                                <input
                                                    type="file"
                                                    accept=".pdf,.doc,.docx"
                                                    onChange={handleFileChange(doc)}
                                                    disabled={loading}
                                                    className={style.fileUpload}
                                                />
                                            </label>
                                            {files[doc] && (
                                                <button
                                                    type="button"
                                                    className={style.removeButton}
                                                    onClick={handleRemoveFile(doc)}
                                                    title="Удалить файл"
                                                >
                                                    <IconTrash className={style.removeIcon} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {error && <p className={style.error}>{error}</p>}
                    <div className={style.buttonGroup}>
                        <button type="button" className={style.backButton} onClick={handleBack} disabled={loading}>
                            Назад
                        </button>
                        <button type="submit" className={style.submitButton} disabled={loading || !type || !allDocsUploaded}>
                            {loading ? 'Отправка...' : 'Подать заявление'}
                        </button>
                    </div>
                </form>
            </Content>
        </Wrapper>
    );
}

export default SubmitApplication;

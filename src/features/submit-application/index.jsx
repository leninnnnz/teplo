import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Content, TitlePage, Wrapper } from '../../shared/UI';
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
        navigate(-1); // Возвращает на предыдущую страницу в истории
    };

    return (
        <Wrapper>
            <TitlePage title={'Подача заявления'} />
            <Content>
                <p className={style.subtitle}>Заполните форму для подачи заявления</p>
                <form className={style.form} onSubmit={handleSubmit}>
                    <div className={style.formGroup}>
                        <label htmlFor="type" className={style.label}>
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
                            <div className={style.templateSection}>
                                <h3 className={style.sectionTitle}>Инструкция</h3>
                                <p className={style.templateText}>
                                    Скачайте шаблон заявления:{' '}
                                    <a href={applicationTypes[type].template} download className={style.templateLink}>
                                        Шаблон для {applicationTypes[type].name}
                                    </a>
                                </p>
                                <p className={style.templateText}>Необходимые документы:</p>
                                <ul className={style.docList}>
                                    {requiredDocs.map((doc) => (
                                        <li key={doc} className={style.docItem}>
                                            {doc}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className={style.filesSection}>
                                <h3 className={style.sectionTitle}>Прикрепите сканы документов</h3>
                                {requiredDocs.map((doc) => (
                                    <div key={doc} className={style.fileInput}>
                                        <label htmlFor={doc} className={style.fileLabel}>
                                            {doc}
                                        </label>
                                        <input
                                            type="file"
                                            id={doc}
                                            accept=".pdf,.doc,.docx"
                                            onChange={handleFileChange(doc)}
                                            disabled={loading}
                                            className={style.fileUpload}
                                        />
                                        {files[doc] && <p className={style.fileName}>{files[doc].name}</p>}
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

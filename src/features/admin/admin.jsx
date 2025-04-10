import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Content, TitlePage, UIInput, Wrapper } from '../../shared/UI';
import style from './index.module.scss';

export function Admin() {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [role, setRole] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = JSON.parse(atob(token.split('.')[1]));
                setRole(decoded.role || '');
                if (decoded.role !== 'admin') {
                    navigate('/profile-settings'); // Перенаправляем не-админов
                }
            } catch (err) {
                setError('Ошибка проверки роли');
                navigate('/login');
            }
        } else {
            navigate('/login'); // Нет токена — на логин
        }
    }, [navigate]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !title) {
            setError('Укажите название и выберите файл');
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('document', file);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5001/api/admin/documents', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Ошибка загрузки документа');
            }

            console.log('Document uploaded:', data);
            setTitle('');
            setFile(null);
            alert('Документ успешно добавлен!');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (role !== 'admin') return null; // Не рендерим, если не админ

    return (
        <Wrapper>
            <Content>
                <TitlePage title={'Админ-панель'} />
                <p className={style.subtitle}>Добавление документов</p>
                <form className={style.form} onSubmit={handleSubmit}>
                    <UIInput
                        type="text"
                        id="title"
                        value={title}
                        onChange={(value) => setTitle(value)}
                        placeholder="Название документа"
                        title="Название"
                        disabled={loading}
                    />
                    <div className={style.fileInput}>
                        <label htmlFor="document">Выберите файл:</label>
                        <input type="file" id="document" accept=".pdf,.doc,.docx" onChange={handleFileChange} disabled={loading} />
                    </div>
                    {error && <p className={style.error}>{error}</p>}
                    <button type="submit" className={style.submitButton} disabled={loading}>
                        {loading ? 'Загрузка...' : 'Добавить документ'}
                    </button>
                </form>
            </Content>
        </Wrapper>
    );
}

export default Admin;

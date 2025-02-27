import style from './index.module.scss';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Content, TitlePage, Wrapper } from '../../shared/UI';

export function MyApplications() {
    const navigate = useNavigate();

    // Моковый список заявлений
    const [applications] = useState([
        { id: 1, type: 'ГВС', date: '2025-02-20', status: 'В обработке' },
        { id: 2, type: 'ХВС', date: '2025-02-18', status: 'Одобрено' },
        { id: 3, type: 'ТС', date: '2025-02-15', status: 'Вернулось' },
    ]);

    const handleNewApplication = () => {
        navigate('/new-application');
    };

    return (
        <Wrapper>
            <TitlePage title="Мои заявления" />
            <Content>
                {applications.length === 0 ? (
                    <div className={style.emptyState}>
                        <p className={style.emptyText}>У вас пока нет заявлений</p>
                        <button className={style.submitButton} onClick={handleNewApplication}>
                            Подать заявление
                        </button>
                    </div>
                ) : (
                    <>
                        <div className={style.tableWrapper}>
                            <table className={style.applicationsTable}>
                                <thead>
                                    <tr>
                                        <th>Номер</th>
                                        <th>Тип</th>
                                        <th>Дата подачи</th>
                                        <th>Статус</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applications.map((app) => (
                                        <tr key={app.id}>
                                            <td>{app.id}</td>
                                            <td>{app.type}</td>
                                            <td>{app.date}</td>
                                            <td className={style[`status-${app.status.toLowerCase().replace(' ', '-')}`]}>{app.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <button className={style.submitButton} onClick={handleNewApplication}>
                            Подать заявление
                        </button>
                    </>
                )}
            </Content>
        </Wrapper>
    );
}

export default MyApplications;

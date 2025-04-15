import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Content, TitlePage, Wrapper } from '../../shared/UI';
import style from './index.module.scss';

export function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/authorization');
            return;
        }

        try {
            const decoded = JSON.parse(atob(token.split('.')[1]));
            if (decoded.role !== 'admin') {
                navigate('/profile-settings');
            }
        } catch (err) {
            navigate('/authorization');
        }

        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/admin/users', {
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
                    throw new Error(errorData.message || 'Ошибка загрузки пользователей');
                }

                const data = await response.json();
                console.log('Fetched users:', data);
                setUsers(data);
                setFilteredUsers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [navigate]);

    useEffect(() => {
        let result = [...users];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (user) =>
                    user.email.toLowerCase().includes(query) ||
                    (user.firstName && user.firstName.toLowerCase().includes(query)) ||
                    (user.lastName && user.lastName.toLowerCase().includes(query)) ||
                    (user.patronymic && user.patronymic.toLowerCase().includes(query)),
            );
        }

        result.sort((a, b) => {
            const lastNameA = (a.lastName || '').toLowerCase();
            const lastNameB = (b.lastName || '').toLowerCase();
            const firstNameA = (a.firstName || '').toLowerCase();
            const firstNameB = (b.firstName || '').toLowerCase();

            if (lastNameA !== lastNameB) {
                if (sortOrder === 'asc') {
                    return lastNameA.localeCompare(lastNameB, 'ru');
                }
                return lastNameB.localeCompare(lastNameA, 'ru');
            }

            if (sortOrder === 'asc') {
                return firstNameA.localeCompare(firstNameB, 'ru');
            }
            return firstNameB.localeCompare(firstNameA, 'ru');
        });

        setFilteredUsers(result);
    }, [searchQuery, sortOrder, users]);

    const handleChangeRole = async (userId, newRole) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5001/api/admin/users/${userId}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ role: newRole }),
            });

            if (!response.ok) {
                throw new Error('Ошибка смены роли');
            }

            const data = await response.json();
            setUsers(users.map((user) => (user._id === userId ? { ...user, role: data.user.role } : user)));
            setFilteredUsers(filteredUsers.map((user) => (user._id === userId ? { ...user, role: data.user.role } : user)));
        } catch (err) {
            setError(err.message);
        }
    };

    const getFullName = (user) => {
        if (!user || (!user.firstName && !user.lastName && !user.patronymic)) {
            return 'Не указан';
        }
        const { firstName = '', lastName = '', patronymic = '' } = user;
        return `${lastName} ${firstName} ${patronymic}`.trim() || 'Не указан';
    };

    return (
        <Wrapper>
            <TitlePage title="Список пользователей" />
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
                        <div className={style.controls}>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Поиск по имени, email..."
                                className={style.searchInput}
                            />
                            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className={style.sortSelect}>
                                <option value="asc">По алфавиту (А-Я)</option>
                                <option value="desc">По алфавиту (Я-А)</option>
                            </select>
                        </div>
                        <div className={style.usersList}>
                            {filteredUsers.length === 0 ? (
                                <div className={style.emptyState}>
                                    <p className={style.emptyText}>Пользователи не найдены</p>
                                </div>
                            ) : (
                                filteredUsers.map((user) => (
                                    <div
                                        key={user._id}
                                        className={style.userCard}
                                        onClick={() => navigate(`/admin/users/${user._id}/applications`)}
                                    >
                                        <div className={style.cardBody}>
                                            <p className={style.cardName}>{getFullName(user)}</p>
                                            <p className={style.cardInfo}>
                                                <strong>Email:</strong> {user.email}
                                            </p>
                                            <p className={style.cardInfo}>
                                                <strong>Телефон:</strong> {user.phone || 'Не указан'}
                                            </p>
                                        </div>
                                        <div className={style.cardRole}>
                                            <span className={style.roleLabel}>Роль:</span>
                                            <select
                                                value={user.role}
                                                onChange={(e) => {
                                                    e.stopPropagation();
                                                    handleChangeRole(user._id, e.target.value);
                                                }}
                                                className={style.roleSelect}
                                            >
                                                <option value="user">Пользователь</option>
                                                <option value="employee">Сотрудник</option>
                                                <option value="admin">Админ</option>
                                            </select>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                )}
            </Content>
        </Wrapper>
    );
}

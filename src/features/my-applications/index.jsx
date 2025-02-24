import style from './index.module.scss';

export function MyApplications() {
    return (
        <div className={style.applicationsWrapper}>
            <h1 className={style.title}>Мои заявления</h1>
            <p className={style.subtitle}>Здесь будут ваши заявления</p>
        </div>
    );
}

export default MyApplications;
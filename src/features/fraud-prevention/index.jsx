import style from './index.module.scss';

export function FraudstersStop() {
    return (
        <div className={style.wrapper}>
            <h1 className={style.title}>Профилактика мошеннических действий</h1>
            <div className={style.content}>

                <div className={style.videoWrapper}>
                    <iframe
                        width="100%"
                        height="400px"
                        src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
                        title="Видео о мошенниках"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen>
                    </iframe>
                </div>

                <p className={style.text}>
                    В последнее время участились случаи мошенничества, связанные с оплатой коммунальных услуг.
                    Будьте внимательны и проверяйте информацию перед тем, как переводить деньги или сообщать свои личные
                    данные.
                    Если у вас есть сомнения, свяжитесь с нашей компанией по официальным телефонам.
                </p>
            </div>
        </div>
    );
}

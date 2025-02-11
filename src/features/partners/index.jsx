import style from './index.module.scss';

export function PartnersInformation() {
    return (
        <div className={style.wrapper}>
            <h1 className={style.title}>Партнеры</h1>
            <div className={style.content}>
                <div className={style.partnerInfo}>
                    <section className={style.partner}>
                        <h2 className={style.subtitle}>Канова и партнёры</h2>

                        <p>
                            <strong>Адрес в сети:</strong>{' '}
                            <a href="http://www.kanova.ru/" className={style.link} target="_blank" rel="noopener noreferrer">
                                www.kanova.ru
                            </a>
                        </p>

                        <p><strong>Адрес:</strong></p>
                        <p className={style.address}>
                            <a
                                href="https://www.google.com/maps/search/?api=1&query=Екатеринбург,+ул.+Белинского+83,+офис+512"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={style.addressLink}
                            >
                                Екатеринбург, ул. Белинского 83, офис 512
                            </a>
                        </p>

                        <p><strong>Телефон:</strong></p>
                        <ul className={style.phoneList}>
                            <li>
                                <a href="tel:+73432788344" className={style.phone}>+7 (343) 278-83-44</a>
                            </li>
                            <li>
                                <a href="tel:+79122467603" className={style.phone}>+7 912 24 67 603</a>
                            </li>
                        </ul>
                    </section>
                    <div className={style.logoContainer}>
                        <img
                            src="/images/partners.png"
                            alt="Логотип Канова и партнёры"
                            className={style.logo}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

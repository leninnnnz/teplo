import style from './index.module.scss';

export function BusinessScope() {

    return (
        <div className={style.wrapper}>
            <h1 className={style.title}>Сфера деятельности</h1>
            <div className={style.content}>
                <section>
                    <h2 className={style.subtitle}>Производство, передача и распределение пара и горячей воды (тепловой энергии)</h2>
                    <p>Протяженность тепловых сетей: <strong>645 км</strong></p>
                    <p>Количество тепловых пунктов: <strong>18</strong></p>
                    <p><a href="#" className={style.link}>Местонахождение тепловых пунктов</a></p>
                    <p>Персонал на 01.12.2024 г.: <strong>217 человек</strong></p>
                    <p><a href="#" className={style.link}>Свидетельство СРО</a></p>
                </section>

                <section>
                    <h2 className={style.subtitle}>Заключение договора на поставку горячего водоснабжения</h2>
                    <p>
                        Владельцу или арендатору нежилого помещения необходимо предоставить пакет документов и заявку
                        по адресу:
                    </p>
                    <ul>
                        <li>
                            <a
                                href="https://www.google.com/maps/search/?api=1&query=г.Каменск-Уральский,+ул.+Мичурина+2в"
                                className={style.addressLink}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                г. Каменск-Уральский, ул. Мичурина 2в, ООО «УК «ТЕПЛОКОМПЛЕКС»
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://www.google.com/maps/search/?api=1&query=г.Каменск-Уральский,+ул.+Октябрьская+41"
                                className={style.addressLink}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                ул. Октябрьская 41, АО «Расчетный центр Урала»
                            </a>
                        </li>
                    </ul>
                    <p><strong>Часы работы:</strong> Пн-Пт с 8:00 до 17:00, обед с 12:00 до 13:00</p>
                </section>

                <section>
                    <h2 className={style.subtitle}>Заявка и список документов</h2>
                    <ul>
                        <li><a href="#" className={style.docLink} download>Заявка на заключение договора</a></li>
                        <li><a href="#" className={style.docLink} download>Список документов</a></li>
                    </ul>
                </section>
            </div>
        </div>
    );
}

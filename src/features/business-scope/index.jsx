import style from './index.module.scss';
import {TitlePage, Wrapper, Content, SubtitlePage} from '../../shared/UI';

export function BusinessScope() {
    return (
        <Wrapper>
            <TitlePage title={'Сфера деятельности'} />
            <Content>
                <section className={style.section}>
                    <SubtitlePage subtitle={'Производство, передача и распределение пара и горячей воды (тепловой энергии)'} />
                    <p className={style.text}>
                        Протяженность тепловых сетей: 645 км
                    </p>
                    <p className={style.text}>
                        Количество тепловых пунктов: 18
                    </p>
                    <p className={style.text}>
                        <a href="#" className={style.link}>
                            Местонахождение тепловых пунктов
                        </a>
                    </p>
                    <p className={style.text}>
                        Персонал на 01.12.2024 г.: 217 человек
                    </p>
                    <p className={style.text}>
                        <a href="#" className={style.link}>
                            Свидетельство СРО
                        </a>
                    </p>
                </section>

                <section className={style.section}>
                    <SubtitlePage subtitle={'Заключение договора на поставку горячего водоснабжения'} />
                    <p className={style.text}>
                        Владельцу или арендатору нежилого помещения необходимо предоставить пакет документов и заявку по адресу:
                    </p>
                    <ul className={style.list}>
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
                    <p className={style.text}>
                        <strong>Часы работы:</strong> Пн-Пт с 8:00 до 17:00, обед с 12:00 до 13:00
                    </p>
                </section>

                <section className={style.section}>
                    <SubtitlePage subtitle={'Заявка и список документов'} />
                    <ul className={style.list}>
                        <li>
                            <a href="#" className={style.docLink} download>
                                Заявка на заключение договора
                            </a>
                        </li>
                        <li>
                            <a href="#" className={style.docLink} download>
                                Список документов
                            </a>
                        </li>
                    </ul>
                </section>
            </Content>
        </Wrapper>
    );
}

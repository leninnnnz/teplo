import style from './index.module.scss';
import { Content, SubtitlePage, TitlePage, Wrapper } from '../../shared/UI';

export function ContactsInformation() {
    return (
        <Wrapper>
            <TitlePage title={'Контактная информация'} />
            <Content>
                <section className={style.section}>
                    <SubtitlePage subtitle={'Руководство'} />
                    <p className={style.text}>
                        <span className={style.boldText}>Директор:</span> Виноградов Геннадий Николаевич
                    </p>
                    <p className={style.text}>
                        <span className={style.boldText}>Главный инженер:</span> Смирнов Константин Владиславович
                    </p>
                </section>

                <section className={style.section}>
                    <SubtitlePage subtitle={'Телефоны'} />
                    <p className={style.text}>
                        <span className={style.boldText}>Единый многоканальный номер:</span>{' '}
                        <a className={style.phoneNumber} href="tel:+73439379828">
                            +7 (343) 937-98-28
                        </a>
                    </p>
                    <ul className={style.phoneList}>
                        <li className={style.phoneItem}>
                            <span className={style.boldText}>Факс:</span> 0
                        </li>
                        <li className={style.phoneItem}>
                            <span className={style.boldText}>Оперативная диспетчерская служба:</span> 1
                        </li>
                        <li className={style.phoneItem}>
                            <span className={style.boldText}>Отдел кадров:</span> 2
                        </li>
                        <li className={style.phoneItem}>
                            <span className={style.boldText}>Бухгалтерия:</span> 3
                        </li>
                        <li className={style.phoneItem}>
                            <span className={style.boldText}>Отдел закупочной деятельности:</span> 4
                        </li>
                        <li className={style.phoneItem}>
                            <span className={style.boldText}>Отдел снабжения:</span> 5
                        </li>
                        <li className={style.phoneItem}>
                            <span className={style.boldText}>Отдел технической инспекции:</span> 6
                        </li>
                        <li className={style.phoneItem}>
                            <span className={style.boldText}>Планово-экономический отдел:</span> 7
                        </li>
                        <li className={style.phoneItem}>
                            <span className={style.boldText}>ПТО:</span> 8
                        </li>
                        <li className={style.phoneItem}>
                            <span className={style.boldText}>Отдел подготовки и проведения ремонтов:</span> 9
                        </li>
                        <li className={style.phoneItem}>
                            <span className={style.boldText}>Отдел охраны труда:</span> *
                        </li>
                    </ul>
                </section>

                <section className={style.section}>
                    <SubtitlePage subtitle={'Электронная почта'} />
                    <p className={style.text}>
                        <a className={style.emailLink} href="mailto:info@uk-teplo.ru">
                            info@uk-teplo.ru
                        </a>
                    </p>
                </section>

                <section className={style.section}>
                    <SubtitlePage subtitle={'Режим работы'} />
                    <p className={style.text}>
                        <span className={style.boldText}>Понедельник - четверг:</span> 8:00 - 17:00 (обед 12:00 - 12:48)
                    </p>
                    <p className={style.text}>
                        <span className={style.boldText}>Пятница:</span> 8:00 - 16:00 (обед 12:00 - 12:48)
                    </p>
                    <p className={style.text}>
                        <span className={style.boldText}>Диспетчерская служба:</span> круглосуточно
                    </p>
                </section>

                <section className={style.section}>
                    <SubtitlePage subtitle={'Реквизиты'} />
                    <p className={style.text}>
                        <span className={style.boldText}>ООО "УК ТЕПЛОКОМПЛЕКС"</span>
                    </p>
                    <p className={style.text}>
                        <span className={style.boldText}>ОГРН:</span> 1156612000973
                    </p>
                    <p className={style.text}>
                        <span className={style.boldText}>ИНН/КПП:</span> 6612047373 / 661201001
                    </p>
                    <p className={style.text}>
                        <span className={style.boldText}>Юридический адрес: </span>
                        <a
                            href="https://www.google.com/maps/search/?api=1&query=623418,+Свердловская+область,+г.+Каменск-Уральский,+ул.+Мичурина,+д.+2В"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={style.mapLink}
                        >
                            623418, Свердловская область, г. Каменск-Уральский, ул. Мичурина, д. 2В
                        </a>
                    </p>
                    <p className={style.text}>
                        <span className={style.boldText}>Почтовый адрес:</span> 623418, Свердловская область, г. Каменск-Уральский, ул.
                        Мичурина, д. 2В
                    </p>
                </section>

                <section className={style.section}>
                    <SubtitlePage subtitle={'Банковские реквизиты'} />
                    <p className={style.text}>
                        <span className={style.boldText}>Банк:</span> Уральский филиал ПАО «ПРОМСВЯЗЬБАНК», г. Екатеринбург
                    </p>
                    <p className={style.text}>
                        <span className={style.boldText}>Р/с:</span> 40702810105001005741
                    </p>
                    <p className={style.text}>
                        <span className={style.boldText}>К/с:</span> 30101810500100000975
                    </p>
                    <p className={style.text}>
                        <span className={style.boldText}>БИК:</span> 046577975
                    </p>
                </section>
            </Content>
        </Wrapper>
    );
}

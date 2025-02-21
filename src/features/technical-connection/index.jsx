import { useState } from 'react';
import style from './index.module.scss';
import { TitlePage, Wrapper } from '../../shared/UI';

export function TechnologicalConnection() {
    return (
        <Wrapper>
            <TitlePage title={'Технологическое присоединение к ТС и ГВС'} />

            <div className={style.content}>
                <div className={style.section}>
                    <p className={style.text}>
                        Протяженность тепловых сетей ООО «УК «ТЕПЛОКОМПЛЕКС» составляет <strong>645 км</strong>.
                    </p>
                    <p className={style.text}>
                        По вопросам подключения, присоединения к сетям, обращайтесь по телефону:{' '}
                        <a href="tel:+73439379828" className={style.phoneLink}>
                            +7 (343) 937-98-28
                        </a>
                    </p>
                </div>
                <div className={style.section}>
                    <h2 className={style.subtitle}>Административные регламенты</h2>
                    <ul className={style.documentList}>
                        <li className={style.documentItem}>
                            <a href="#" target="_blank" className={style.documentLink}>
                                Административный регламент по подключению к системе теплоснабжения
                            </a>
                        </li>
                        <li className={style.documentItem}>
                            <a href="#" target="_blank" className={style.documentLink}>
                                Административный регламент по подключению к системе ГВС
                            </a>
                        </li>
                    </ul>
                </div>
                <div className={style.section}>
                    <h2 className={style.subtitle}>Комиссия по подключению</h2>
                    <p className={style.text}>
                        Создана комиссия по подключению (технологическому присоединению) к сетям: Комиссия по технологическому подключению
                    </p>
                </div>
                <div className={style.section}>
                    <h2 className={style.subtitle}>Нормативные документы</h2>
                    <ul className={style.documentList}>
                        <li className={style.documentItem}>
                            <a href="#" target="_blank" className={style.documentLink}>
                                Федеральный закон от 27.07.2010 № 190-ФЗ «О теплоснабжении»
                            </a>
                        </li>
                        <li className={style.documentItem}>
                            <a href="#" target="_blank" className={style.documentLink}>
                                Постановление Правительства РФ от 30.11.2021 № 2115
                            </a>
                        </li>
                        <li className={style.documentItem}>
                            <a href="#" target="_blank" className={style.documentLink}>
                                Федеральный закон от 07.12.2011 № 416-ФЗ «О водоснабжении и водоотведении»
                            </a>
                        </li>
                        <li className={style.documentItem}>
                            <a href="#" target="_blank" className={style.documentLink}>
                                Постановление Правительства РФ от 30.11.2021 № 2130
                            </a>
                        </li>
                    </ul>
                </div>
                <div className={style.section}>
                    <h2 className={style.subtitle}>Подача заявки</h2>
                    <p className={style.text}>
                        Вы можете подать заявку на подключение в электронной форме, заполнив бланк и направив его по адресу:{' '}
                        <a href="mailto:info@uk-teplo.ru" className={style.emailLink}>
                            info@uk-teplo.ru
                        </a>
                    </p>
                    <ul className={style.documentList}>
                        <li className={style.documentItem}>
                            <a href="#" target="_blank" className={style.documentLink}>
                                Заявка на подключение к системам теплоснабжения
                            </a>
                        </li>
                        <li className={style.documentItem}>
                            <a href="#" target="_blank" className={style.documentLink}>
                                Заявка на подключение к системе ГВС
                            </a>
                        </li>
                        <li className={style.documentItem}>
                            <a href="#" target="_blank" className={style.documentLink}>
                                Документы к заявке по подключению ГВС
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </Wrapper>
    );
}

import { useState } from 'react';
import style from './index.module.scss';

export function TechnologicalConnection() {


    return (
        <div className={style.wrapper}>
            <h1 className={style.title}>Технологическое присоединение к ТС и ГВС</h1>

            <div className={style.content}>
                <div className={style.section}>
                    <p>Протяженность тепловых сетей ООО «УК «ТЕПЛОКОМПЛЕКС» составляет <strong>645 км</strong>.</p>
                    <p>По вопросам подключения, присоединения к сетям, обращайтесь по телефону:
                        <strong> 8 (3439) 37-98-28</strong>
                    </p>
                </div>
                <div className={style.section}>
                    <h2 className={style.subtitle}>Административные регламенты</h2>
                    <ul className={style.documentList}>
                        <li><a href="#" target="_blank">Административный регламент по подключению к системе
                            теплоснабжения</a></li>
                        <li><a href="#" target="_blank">Административный регламент по подключению к системе ГВС</a></li>
                    </ul>
                </div>
                <div className={style.section}>
                    <h2 className={style.subtitle}>Комиссия по подключению</h2>
                    <p>Создана комиссия по подключению (технологическому присоединению) к сетям: <strong>Комиссия по
                        технологическому подключению</strong></p>
                </div>
                <div className={style.section}>
                    <h2 className={style.subtitle}>Нормативные документы</h2>
                    <ul className={style.documentList}>
                        <li><a href="#" target="_blank">Федеральный закон от 27.07.2010 № 190-ФЗ «О теплоснабжении»</a>
                        </li>
                        <li><a href="#" target="_blank">Постановление Правительства РФ от 30.11.2021 № 2115</a></li>
                        <li><a href="#" target="_blank">Федеральный закон от 07.12.2011 № 416-ФЗ «О водоснабжении и
                            водоотведении»</a></li>
                        <li><a href="#" target="_blank">Постановление Правительства РФ от 30.11.2021 № 2130</a></li>
                    </ul>
                </div>
                <div className={style.section}>
                    <h2 className={style.subtitle}>Подача заявки</h2>
                    <p>Вы можете подать заявку на подключение в электронной форме, заполнив бланк и направив его по
                        адресу: <a href="mailto:info@uk-teplo.ru">info@uk-teplo.ru</a></p>
                    <ul className={style.documentList}>
                        <li><a href="#" target="_blank">Заявка на подключение к системам теплоснабжения</a></li>
                        <li><a href="#" target="_blank">Заявка на подключение к системе ГВС</a></li>
                        <li><a href="#" target="_blank">Документы к заявке по подключению ГВС</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

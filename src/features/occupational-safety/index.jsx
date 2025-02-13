import { useState } from 'react';
import style from './index.module.scss';

export function OccupationalSafety() {

    return (
        <div className={style.wrapper}>
            <h1 className={style.title}>Охрана труда</h1>
            <div className={style.content}>
                <h2 className={style.subtitle}>Специальная оценка условий труда (СУОТ)</h2>

                <ul className={style.documentList}>
                    <li>
                        <a
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Сводная ведомость результатов специальной оценки условий труда ООО УК ТЕПЛОКОМПЛЕКС
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Заключение эксперта к материалам специальной оценки условий труда ООО УК ТЕПЛОКОМПЛЕКС
                        </a>
                    </li>
                </ul>
            </div>

        </div>
    );
}

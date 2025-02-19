import { useState } from "react";
import style from "./index.module.scss";
import { TitlePage, Wrapper } from "../../shared/UI";

export function OccupationalSafety() {
    return (
        <Wrapper>
            <TitlePage title={"Охрана труда"} />
            <div className={style.content}>
                <h2 className={style.subtitle}>Специальная оценка условий труда (СУОТ)</h2>

                <ul className={style.documentList}>
                    <li className={style.documentItem}>
                        <a href="#" target="_blank" rel="noopener noreferrer" className={style.documentLink}>
                            Сводная ведомость результатов специальной оценки условий труда ООО УК ТЕПЛОКОМПЛЕКС
                        </a>
                    </li>
                    <li className={style.documentItem}>
                        <a href="#" target="_blank" rel="noopener noreferrer" className={style.documentLink}>
                            Заключение эксперта к материалам специальной оценки условий труда ООО УК ТЕПЛОКОМПЛЕКС
                        </a>
                    </li>
                </ul>
            </div>
        </Wrapper>
    );
}

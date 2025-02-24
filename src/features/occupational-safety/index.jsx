import { useState } from 'react';
import style from './index.module.scss';
import {Content, SubtitlePage, TitlePage, Wrapper} from '../../shared/UI';

export function OccupationalSafety() {
    return (
        <Wrapper>
            <TitlePage title={'Охрана труда'} />
            <Content>
                <SubtitlePage subtitle={'Специальная оценка условий труда (СУОТ)'} />
                <ul className={style.documentList}>
                    <li>
                        <a href="#" target="_blank" rel="noopener noreferrer" className={style.documentLink}>
                            Сводная ведомость результатов специальной оценки условий труда ООО УК ТЕПЛОКОМПЛЕКС
                        </a>
                    </li>
                    <li>
                        <a href="#" target="_blank" rel="noopener noreferrer" className={style.documentLink}>
                            Заключение эксперта к материалам специальной оценки условий труда ООО УК ТЕПЛОКОМПЛЕКС
                        </a>
                    </li>
                </ul>
            </Content>
        </Wrapper>
    );
}

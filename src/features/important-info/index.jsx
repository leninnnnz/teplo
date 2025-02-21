import style from './index.module.scss';
import {Content, TitlePage, Wrapper} from '../../shared/UI';

export function ImportantInformation() {
    return (
        <Wrapper>
            <TitlePage title={'Важная информация'} />
            <Content>
                <p className={style.intro}>Уважаемые абоненты!</p>

                <p className={style.mainText}>
                    В связи с угрозой распространения на территории Свердловской области новой коронавирусной инфекции, в соответствии с
                    Указом Губернатора Свердловской области от 18 марта 2020 года №100-УГ «О введении на территории Свердловской области
                    режима повышенной готовности и принятии дополнительных мер по защите населения….» ИНФОРМИРУЕМ, ЧТО ОЧНЫЙ ПРИЕМ ГРАЖДАН В
                    ООО «УК «ТЕПЛОКОМПЛЕКС» И ПРЕДСТАВИТЕЛЬСТВАХ АО «РАСЧЕТНЫЙ ЦЕНТР УРАЛА» ВРЕМЕННО ПРЕКРАЩЕН. О ВОЗОБНОВЛЕНИИ ОЧНОГО
                    ПРИЕМА ГРАЖДАН БУДЕТ СООБЩЕНО ДОПОЛНИТЕЛЬНО.
                </p>

                <div className={style.paymentInfo}>
                    <p className={style.paymentInfoText}>Оплату по платежным документам ООО «УК «ТЕПЛОКОМПЛЕКС» можно провести:</p>
                    <ul className={style.paymentMethods}>
                        <li className={style.paymentMethod}>
                            <a href="http://www.rcurala.ru" target="_blank" rel="noopener noreferrer" className={style.paymentLink}>
                                в личном кабинете на сайте www.rcurala.ru
                            </a>
                        </li>
                        <li className={style.paymentMethod}>через сайт www.rcurala.ru без регистрации в личном кабинете,</li>
                        <li className={style.paymentMethod}>через мобильное приложение «РЦ Урала онлайн»,</li>
                        <li className={style.paymentMethod}>в кассу АО «РЦ Урала»,</li>
                        <li className={style.paymentMethod}>через отделения ФГУП «Почта России», Банки (взимается комиссия)</li>
                    </ul>
                </div>

                <div className={style.contactInfo}>
                    <p className={style.contactText}>
                        Показания индивидуальных приборов учета, заявления о разноске оплат, порядке начисления платы и т.д. Вы можете
                        направить на электронную почту представительства{' '}
                        <a href="mailto:kamensk-info@rcurala.ru" className={style.emailLink}>
                            kamensk-info@rcurala.ru
                        </a>{' '}
                        или{' '}
                        <a href="mailto:call-center@rcurala.ru" className={style.emailLink}>
                            call-center@rcurala.ru
                        </a>
                        , а также{' '}
                        <a href="mailto:info@uk-teplo.ru" className={style.emailLink}>
                            info@uk-teplo.ru
                        </a>
                        .
                    </p>
                </div>

                <div className={style.phoneNumbers}>
                    <p className={style.phoneText}>Телефоны для обращения физических лиц:</p>
                    <a href="tel:83439354530" className={style.phoneLink}>
                        8 (343) 935-45-30
                    </a>
                    <br />
                    <a href="tel:83439355176" className={style.phoneLink}>
                        8 (343) 935-51-76
                    </a>
                    <br />
                    <a href="tel:88003029990" className={style.phoneLink}>
                        8 (800) 302-99-90
                    </a>{' '}
                    — АО «РЦ Урала»
                </div>

                <p className={style.closing}>
                    Приносим извинения за временные неудобства,
                    <br /> с уважением, ООО «УК «ТЕПЛОКОМПЛЕКС»
                </p>
            </Content>
        </Wrapper>
    );
}

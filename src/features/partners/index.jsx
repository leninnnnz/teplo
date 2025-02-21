import style from './index.module.scss';
import {Content, TitlePage, Wrapper} from '../../shared/UI';

export function PartnersInformation() {
    return (
        <Wrapper>
            <TitlePage title={'Партнеры'} />
            <Content>
                <div className={style.partnerInfo}>
                    <section className={style.partner}>
                        <h2 className={style.subtitle}>Канова и партнёры</h2>
                        <p className={style.text}>
                            Адрес в сети:{' '}
                            <a href="http://www.kanova.ru/" className={style.link} target="_blank" rel="noopener noreferrer">
                                www.kanova.ru
                            </a>
                        </p>

                        <p className={style.text}>
                            Адрес:{' '}
                            <a
                                href="https://www.google.com/maps/search/?api=1&query=Екатеринбург,+ул.+Белинского+83,+офис+512"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={style.addressLink}
                            >
                                Екатеринбург, ул. Белинского 83, офис 512
                            </a>
                        </p>

                        <p className={style.text}>
                            Телефон:
                            <ul className={style.phoneList}>
                                <li>
                                    <a href="tel:+73432788344" className={style.phone}>
                                        +7 (343) 278-83-44
                                    </a>
                                </li>
                                <li>
                                    <a href="tel:+79122467603" className={style.phone}>
                                        +7 (912) 246-76-03
                                    </a>
                                </li>
                            </ul>
                        </p>
                    </section>
                    <div className={style.logoContainer}>
                        <img src="/images/partners.png" alt="Логотип Канова и партнёры" className={style.logo} />
                    </div>
                </div>
            </Content>
        </Wrapper>
    );
}

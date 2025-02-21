import style from './index.module.scss';
import {Content, SubtitlePage, TitlePage, Wrapper} from '../../shared/UI';

export function PartnersInformation() {
    return (
        <Wrapper>
            <TitlePage title={'Партнеры'} />
            <Content>
                <div className={style.partnerInfo}>
                    <div>
                        <SubtitlePage subtitle={'Канова и партнёры'}/>
                        <section className={style.section}>
                            <p className={style.text}>
                                Адрес в сети:
                            </p>
                            <a href="http://www.kanova.ru/" className={style.siteLink} target="_blank"
                               rel="noopener noreferrer">
                                www.kanova.ru
                            </a>
                        </section>

                        <section className={style.section}>
                            <p className={style.text}>
                                Адрес:
                            </p>
                            <a
                                href="https://www.google.com/maps/search/?api=1&query=Екатеринбург,+ул.+Белинского+83,+офис+512"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={style.addressLink}
                            >
                                Екатеринбург, ул. Белинского 83, офис 512
                            </a>

                        </section>

                        <section className={style.section}>
                            <p className={style.text}>
                                Телефон:
                            </p>
                            <ul className={style.phoneList}>
                                <li>
                                    <a href="tel:+73432788344" className={style.phoneLink}>
                                        +7 (343) 278-83-44
                                    </a>
                                </li>
                                <li>
                                    <a href="tel:+79122467603" className={style.phoneLink}>
                                        +7 (912) 246-76-03
                                    </a>
                                </li>
                            </ul>
                        </section>


                    </div>

                    <div className={style.logoContainer}>
                        <img src="/images/partners.png" alt="Логотип Канова и партнёры" className={style.logo}/>
                    </div>
                </div>
            </Content>
        </Wrapper>
    );
}

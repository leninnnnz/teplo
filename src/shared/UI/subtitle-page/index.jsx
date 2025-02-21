import style from './index.module.scss';

export function SubtitlePage({ subtitle }) {
    return <h1 className={style.subtitle}>{subtitle}</h1>;
}

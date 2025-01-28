import style from './index.module.scss'

export function Footer({text}) {

    const data = [
        {
            id: 1,
            text: 'first'
        },
    ]


    return (
        <div className={style.footerBox}>{text}</div>
    )
}
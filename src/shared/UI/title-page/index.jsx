import style from "./index.module.scss"


export function TitlePage({title}) {
    return (
        <h1 className={style.title}>{title}</h1>
    )
}
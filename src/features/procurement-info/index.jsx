import style from './index.module.scss';

const purchases = [
    { name: "Закупка люков 18.09.2018", link: "#" },
    { name: "Положение о закупках ООО «УК «ТЕПЛОКОМПЛЕКС» с вносимыми изменениями март 2016", link: "#" },
    { name: "План закупок ООО «УК «ТЕПЛОКОМПЛЕКС» на 2017 г.", link: "#" },
    { name: "Положение о закупках ООО «УК «ТЕПЛОКОМПЛЕКС» от 29.06.2018", link: "#" },
    { name: "ПОЛОЖЕНИЕ о закупках от 10.01.2024", link: "#" },
];

export function ProcurementInformation() {
    return (
        <div className={style.wrapper}>
            <h1 className={style.title}>Информация о закупках</h1>
            <div className={style.content}>
                <ul className={style.purchaseList}>
                    {purchases.map((item, index) => (
                        <li key={index}>
                            <a href={item.link} download>
                                {item.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

import { useState } from 'react';
import style from './index.module.scss';
import {Content, SubtitlePage, TitlePage, Wrapper} from '../../shared/UI';

export function ClientInformation() {
    const [searchTerm, setSearchTerm] = useState('');
    const [contracts] = useState([
        { name: 'Договор горячего водоснабжения (муниципальный контракт)', link: '#' },
        { name: 'Договор горячего водоснабжения прочие', link: '#' },
        { name: 'Договор горячего водоснабжения. Прямые договоры (оферта)', link: '#' },
        { name: 'Договор на оказание услуг по передаче тепловой энергии', link: '#' },
        { name: 'Договор на подключение к системе теплоснабжения', link: '#' },
        { name: 'Договор на подключение к системе ГВС', link: '#' },
        { name: 'Договор по транспортировке сточных вод', link: '#' },
        { name: 'Договор по транспортировке холодной воды', link: '#' },
    ]);
    const [filteredContracts, setFilteredContracts] = useState(contracts); // Состояние для отфильтрованных данных

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        const filtered = contracts.filter(
            (contract) => contract.name.toLowerCase().includes(term), // Исправлено: применяем toLowerCase() к contract.name
        );
        setFilteredContracts(filtered);
    };

    return (
        <Wrapper>
            <TitlePage title={'Информация для клиентов'} />
            <Content>
                <section className={style.section}>
                    <SubtitlePage subtitle={'Законодательство в части присоединения к системам теплоснабжения и (или) горячего водоснабжения, системам холодного водоснабжения и водоотведения:'} />
                    <ul className={style.legislationList}>
                        {[
                            'Федеральный закон №190 «О теплоснабжении»',
                            'Постановление Правительства РФ от 30 ноября 2021 г N 2115 «Об утверждении Правил подключения (технологического присоединения) к системам теплоснабжения, включая правила недискриминационного доступа к услугам по подключению (технологическому присоединению) к системам теплоснабжения, Правил недискриминационного доступа к услугам по передаче тепловой энергии, теплоносителя, а также об изменении и признании утратившими силу некоторых актов Правительства Российской Федерации и отдельных положений некоторых актов Правительства Российской Федерации»',
                            'Постановление Правительства РФ от 22 октября 2012 г. №1075 «О ценообразовании в сфере теплоснабжения»',
                            'Постановление Правительства РФ от 31 декабря 2021 г. N 2608 «Об утверждении состава и содержания технических требований и условий, подлежащих обязательному исполнению при архитектурно-строительном проектировании в целях реконструкции, капитального ремонта существующих линейных объектов в связи с планируемыми строительством, реконструкцией или капитальным ремонтом объектов капитального строительства, Правил их выдачи и досрочного прекращения их действия, а также Правил определения размера затрат на их подготовку, подлежащих возмещению правообладателю существующего линейного объекта»',
                            'Постановление Правительства РФ от 8 августа 2012 г. N 808 «Об организации теплоснабжения в Российской Федерации и о внесении изменений в некоторые акты Правительства Российской Федерации»',
                            'Федеральный закон от 7 декабря 2011 г. N 416-ФЗ «О водоснабжении и водоотведении»',
                            'Постановление Правительства РФ от 30 ноября 2021 г. N 2130 «Об утверждении Правил подключения (технологического присоединения) объектов капитального строительства к централизованным системам горячего водоснабжения, холодного водоснабжения и (или) водоотведения, о внесении изменений в отдельные акты Правительства Российской Федерации и признании утратившими силу отдельных актов Правительства Российской Федерации и положений отдельных актов Правительства Российской Федерации»',
                            'Приказ №116 от 12.05.2016 «Показатели надежности качества объектов теплоснабжения»',
                        ].map((item, index) => (
                            <li key={index} className={style.legislationItem}>
                                <span className={style.bullet}></span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </section>
                <section className={style.section}>
                    <SubtitlePage subtitle={'Формы публичного договора'} />
                    <input
                        type="text"
                        placeholder="Поиск договора..."
                        className={style.searchInput}
                        value={searchTerm}
                        onChange={handleSearch}
                    />

                    <ul className={style.contractList}>
                        {filteredContracts.length > 0 ? (
                            filteredContracts.map((contract, index) => (
                                <li key={index}>
                                    <a href={contract.link} className={style.contractLink}>
                                        {contract.name}
                                    </a>
                                </li>
                            ))
                        ) : (
                            <p className={style.noResults}>Ничего не найдено</p>
                        )}
                    </ul>
                </section>
            </Content>
        </Wrapper>
    );
}

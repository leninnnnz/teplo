import style from './index.module.scss';
import React, { useState } from 'react';
import { TitlePage, Wrapper } from '../../shared/UI';

export function ReadyReports() {
    const reports = [
        { name: 'Бухгалтерская отчетность за 2015 год', link: '#' },
        { name: 'Бухгалтерская отчетность за 2016 год', link: '#' },
        { name: 'Бухгалтерская отчетность за 2017 год', link: '#' },
        { name: 'Бухгалтерская отчетность за 2018 год', link: '#' },
        { name: 'Бухгалтерская отчетность за 2019 год', link: '#' },
        { name: 'Бухгалтерская отчетность за 2020 год', link: '#' },
        { name: 'Бухгалтерская отчетность за 2021 год', link: '#' },
        { name: 'Бухгалтерская отчетность за 2022 год', link: '#' },
        { name: 'Бухгалтерская отчетность за 2023 год', link: '#' },
    ];

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredReports, setFilteredReports] = useState(reports);

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        setFilteredReports(reports.filter((report) => report.name.toLowerCase().includes(term)));
    };

    return (
        <Wrapper>
            <TitlePage title={'Бухгалтерская отчетность'} />
            <div className={style.content}>
                <input
                    type="text"
                    placeholder="Поиск по годам..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className={style.searchInput}
                />
                <ul className={style.reportsList}>
                    {filteredReports.length > 0 ? (
                        filteredReports.map((report, index) => (
                            <li key={index}>
                                <a href={report.link} className={style.reportLink}>
                                    {report.name}
                                </a>
                            </li>
                        ))
                    ) : (
                        <li className={style.noResults}>Ничего не найдено</li>
                    )}
                </ul>
            </div>
        </Wrapper>
    );
}

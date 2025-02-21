import React, { useRef, useEffect } from 'react';
import style from './index.module.scss';
import {Wrapper} from "../../shared/UI";
import {Link} from "react-router-dom";

export function Error() {
    const buttonRef = useRef(null);

    useEffect(() => {
        buttonRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center' // Кнопка будет в центре экрана
        });
    }, []);

    return (
        <Wrapper>
            <div className={style.content}>
                <h1 className={style.title}>404</h1>
                <p className={style.message}>Упс! Страница не найдена.</p>
                <p className={style.description}>
                    Кажется, мы не можем найти страницу, которую вы ищете.
                </p>
                <Link to='/' ref={buttonRef} className={style.button}>
                    Вернуться на главную
                </Link>
            </div>
        </Wrapper>
    );
}
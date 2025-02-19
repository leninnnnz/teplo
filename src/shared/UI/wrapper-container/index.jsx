import React from 'react';
import style from './index.module.scss';

export function Wrapper({ children, className = '' }) {
    return <div className={`${style.wrapper} ${className}`}>{children}</div>;
}

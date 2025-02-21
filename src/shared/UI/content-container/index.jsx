import React from 'react';
import style from './index.module.scss';

export function Content({ children, className = '' }) {
    return <div className={`${style.content} ${className}`}>{children}</div>;
}

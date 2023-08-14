import { useState } from 'react';
import styles from './dialog.module.css'


// 淡入淡出的弹框
export default function Dialog({ msg }) {
    return (
        <div className={styles.dialog}>
            <h3 className={styles.text}>{msg}</h3>
        </div>
    );
}
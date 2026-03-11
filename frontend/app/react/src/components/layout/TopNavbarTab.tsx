import React from 'react';
import {XIcon} from '@/plugins/xicon';

import type {TopNavBarTabItem} from './types';

import styles from './TopNavbarTab.module.css';

interface TopNavbarTabProps {
    data: TopNavBarTabItem;
}

export default function TopNavbarTab({data}: TopNavbarTabProps) {
    return (
        <div className={styles.tabContent}>
            {data.icon && (
                <XIcon name={`carbon:${data.icon}`} size={20} className={styles.icon}/>
            )}
            <span className={styles.label}>{data.label}</span>
        </div>
    );
}

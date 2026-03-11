'use client';

import React from 'react';
import styles from './Header.module.css';

import TopSearchBar from './TopSearchBar';
import TopNavbar from './TopNavbar';

export default function Header() {
    return (
        <div className={styles.fixedTop}>
            <div className={styles.headerInner}>
                {/* 第一行：Logo + 搜索框 + 操作按钮 */}
                <TopSearchBar />
                {/* 第二行：导航菜单 */}
                <TopNavbar />
            </div>
        </div>
    );
}

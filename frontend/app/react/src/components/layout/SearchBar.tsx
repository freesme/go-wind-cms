import React, {useState} from 'react';
import {Input} from 'antd';
import {SearchOutlined} from '@ant-design/icons';
import {useTranslations} from 'next-intl';

import styles from './SearchBar.module.css';

export default function SearchBar() {
    const t = useTranslations('navbar.top');
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = () => {
        console.log('Searching for:', searchQuery);
        // TODO: 实现搜索逻辑
    };

    return (
        <div className={styles.searchBarWrapper}>
            <Input
                className={styles.searchBar}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyUp={handleSearch}
                placeholder={t('search_placeholder')}
                prefix={<SearchOutlined/>}
            />
        </div>
    );
}

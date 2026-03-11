"use client";
import React, {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {env} from "@/config";
import {Spin} from 'antd';

const getDefaultLocale = () => {
    return env.defaultLocale; // 或根据浏览器、配置等动态获取
};

const HomePage: React.FC = () => {
    const router = useRouter();

    useEffect(() => {
        const locale = getDefaultLocale();
        router.replace(`/${locale}`);
    }, [router]);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
        }}>
            <Spin size="large"/>
            <main>
                <h1 style={{marginTop: 24}}>跳转中...</h1>
            </main>
        </div>
    );
};

export default HomePage;

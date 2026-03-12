"use client";

import React from "react";
import {NextIntlClientProvider} from "next-intl";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GlobalLoading from "@/components/layout/GlobalLoading";

import ReduxProvider from "@/store/ReduxProvider";
import {DEFAULT_TIME_ZONE} from "@/i18n";

import styles from './layout.module.css';

interface ClientLocaleLayoutProps {
    locale: string;
    messages: Record<string, unknown>;
    children: React.ReactNode;
}

const ClientLocaleLayout: React.FC<ClientLocaleLayoutProps> = ({locale, messages, children}) => {
    return (
        <NextIntlClientProvider timeZone={DEFAULT_TIME_ZONE} locale={locale} messages={messages}>
            <ReduxProvider>
                <div className={styles.appContainer}>
                    <Header/>
                    <main className={styles.content}>
                        {children}
                    </main>
                    <Footer/>
                    <GlobalLoading/>
                </div>
            </ReduxProvider>
        </NextIntlClientProvider>
    );
};

export default ClientLocaleLayout;

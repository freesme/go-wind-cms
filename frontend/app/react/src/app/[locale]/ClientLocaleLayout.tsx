"use client";
import React from "react";
import {NextIntlClientProvider} from "next-intl";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ReduxProvider from "@/store/ReduxProvider";
import styles from './layout.module.css';

interface ClientLocaleLayoutProps {
  messages: Record<string, unknown>;
  locale: string;
  children: React.ReactNode;
}

const ClientLocaleLayout: React.FC<ClientLocaleLayoutProps> = ({messages, locale, children}) => {
  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <ReduxProvider>
        <div className={styles.appContainer}>
          <Header/>
          <main className={styles.content}>
            {children}
          </main>
          <Footer/>
        </div>
      </ReduxProvider>
    </NextIntlClientProvider>
  );
};

export default ClientLocaleLayout;

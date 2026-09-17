import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../components/Layout';
import Head from 'next/head';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/*
        Only page-independent tags live here. Per-page metadata (title,
        description, canonical, Open Graph, Twitter Card, JSON-LD) is declared
        once through the shared `SeoHead` component, so every absolute URL is
        built from the official domain — see lib/site.ts.
      */}
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#080C0E" />

        {/* Favicons — official assets from "Codigo binario Logos finalizadas" */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icons/codigo-binario-icon-32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/icons/codigo-binario-icon-16.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/icons/codigo-binario-icon-180.png" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

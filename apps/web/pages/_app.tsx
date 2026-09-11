import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../components/Layout';
import Head from 'next/head';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://web-three-psi-39614316li.vercel.app';
const SITE_NAME = 'Código Binário';
const DEFAULT_TITLE = 'Código Binário — AI, Systems & Digital Solutions';
const DEFAULT_DESCRIPTION =
  'A Código Binário entende problemas complexos e transforma-os em sistemas, automações e soluções digitais funcionais — utilizando Inteligência Artificial quando ela realmente cria vantagem.';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#080C0E" />

        {/* Favicons — official assets from "Codigo binario Logos finalizadas" */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icons/codigo-binario-icon-32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/icons/codigo-binario-icon-16.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/icons/codigo-binario-icon-180.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Default Open Graph / Twitter (pages override title/description) */}
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={DEFAULT_TITLE} />
        <meta property="og:description" content={DEFAULT_DESCRIPTION} />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:image" content={`${SITE_URL}/logo/codigo-binario-square.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={DEFAULT_TITLE} />
        <meta name="twitter:description" content={DEFAULT_DESCRIPTION} />
        <meta name="twitter:image" content={`${SITE_URL}/logo/codigo-binario-square.png`} />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

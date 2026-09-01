import '../styles/globals.css';
import type { AppProps } from 'next/app';
import DigitalRain from '../components/DigitalRain';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <DigitalRain />
      <Component {...pageProps} />
    </>
  );
}
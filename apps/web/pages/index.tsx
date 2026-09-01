import Head from 'next/head';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';
import HowItWorks from '../components/HowItWorks';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Head>
        <title>Código Binário — Diagnóstico Inteligente</title>
        <meta
          name="description"
          content="Tem um problema operacional? A tecnologia pode resolvê-lo. Descreva o seu desafio e receba um diagnóstico técnico personalizado."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="min-h-screen bg-background">
        <Navbar />
        <Hero />
        <Services />
        <HowItWorks />
        <Footer />
      </div>
    </>
  );
}

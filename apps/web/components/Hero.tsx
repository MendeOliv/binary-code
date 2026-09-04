import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Hero() {
  const router = useRouter();
  const [problem, setProblem] = useState('');

  const handleStart = () => {
    if (problem.trim()) {
      router.push({ pathname: '/diagnostic', query: { initial: problem.trim() } });
    } else {
      router.push('/diagnostic');
    }
  };

  return (
    <section className="relative w-full bg-background px-gutter-desktop py-space-3xl overflow-hidden border-b border-surfaceContainerHigh/40">
      <div className="relative w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-space-3xl py-space-xl">
        <div className="flex-1 flex flex-col gap-space-xl max-w-2xl">
          {/* Terminal-style system tag */}
          <div className="flex items-center gap-space-xs font-codeTelemetry text-labelSm textPrimary trackingWidest uppercase">
            <span className="w-2 h-2 bg-primary inline-block" />
            <span>AUTONOMOUS SYSTEMS LAB // SOVEREIGN AI</span>
          </div>

          {/* Main headline - matches reference */}
          <h1 className="fontHeadlineXl text-[28px] sm:text-[32px] md:text-headlineXl textOnSurface trackingTight leading-none uppercase fontBold">
            THE PROBLEM IS THE INPUT.<br />
            <span className="textPrimary">THE SYSTEM IS THE ANSWER.</span>
          </h1>

          {/* Tagline */}
          <p className="fontBodyLg textBodyLg textOnSurfaceVariant">
            Engenhamos arquiteturas de inteligência artificial soberanas e sistemas autônomos para solucionar anomalias e gargalos operacionais críticos.
          </p>

          {/* CTA button - matches reference style */}
          <div className="pt-space-sm flex items-center gap-space-md">
            <a
              className="flex items-center justify-center gap-space-xs pxSpaceLg pySpaceMd bgPrimaryContainer textOnPrimary fontLabelMd textLabelMd fontBold trackingWider hover:bgPrimary transition-all shadow-[0_0_24px_rgba(78,222,163,0.3)]"
              data-path="binary-diagnostic"
              href="#"
            >
              <span>START DIAGNOSTIC →</span>
            </a>
          </div>
        </div>

        {/* Decorative hero orb - matches reference */}
        <div className="flex-shrink-0 flex items-center justify-center relative">
          <div className="absolute inset-0 bgPrimary/10 blur-2xl rounded-full" />
          <img
            alt="Código Binário Sovereign Core Emblem"
            className="relative z-10 w-64 h-64 sm:w-72 sm:h-72 object-contain"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPhWfkHJ1X-mFFYcH6w_-5Kyw9X7LlqRJopqrBDptyXYjk_Vh2D37jNIBijPTtJ8Q2megQcbk7S2LqOPcT_OO2ZnYMQnfRAZuvg7cPG4zaqLkqOf26tL6trBOBl3-_gq5a0FQS3LS5Z-WN-nAM35AEDsjT3Uv88qBOWhUayQBzdOFGdwX-X_YQLyApTOJaBxB0R1ZDJC5VKnQzNyOQrs9clCSRWgcuj157DLmHo4QU5IxkfvAiUH4xHN6hyNB1qeeE..."
          />
        </div>
      </div>
    </section>
  );
}
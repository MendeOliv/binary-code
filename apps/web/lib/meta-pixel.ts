/**
 * Centralized Meta Pixel (Código Binário) tracking layer.
 *
 * One module owns everything Meta: the public Pixel ID, the SDK loader and the
 * typed event entry point. Components never talk to `fbq` directly, so the
 * pixel is initialized exactly once and every event flows through one path.
 *
 * Why not the official inline snippet: this app enforces a strict
 * Content-Security-Policy (`script-src 'self' https://connect.facebook.net`,
 * deliberately without `'unsafe-inline'` — see next.config.js). An inline
 * <script> tag would be blocked by the browser. We therefore reproduce the
 * snippet's stub + async loader in bundled (self-hosted) JavaScript, which is
 * functionally identical and CSP-compliant.
 */

/**
 * Public Meta Pixel ID.
 *
 * `NEXT_PUBLIC_*` values are inlined at build time and are NOT secrets — the
 * ID is visible in the client bundle by design. A single fallback keeps the
 * production pixel working when the environment variable is absent from a
 * build; the env var always wins when present.
 */
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '1134226625609683';

/** Official Meta Pixel SDK. */
const FBEVENTS_SRC = 'https://connect.facebook.net/en_US/fbevents.js';

/** Standard events used by this site. */
export const MetaEvent = {
  PageView: 'PageView',
  ViewContent: 'ViewContent',
  Contact: 'Contact',
  Lead: 'Lead',
} as const;

export type MetaEventName = (typeof MetaEvent)[keyof typeof MetaEvent];

interface FbqInstance {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  push: (...args: unknown[]) => void;
  loaded: boolean;
  version: string;
}

declare global {
  interface Window {
    fbq?: FbqInstance;
    _fbq?: FbqInstance;
  }
}

let initialised = false;

/**
 * Loads fbevents.js and initializes the pixel exactly once.
 *
 * Safe on the server and safe to call repeatedly (React StrictMode, remounts).
 * It first installs the same `fbq` command stub the official snippet defines,
 * so calls made before the SDK finishes downloading are queued and replayed.
 */
export function initMetaPixel(): void {
  if (typeof window === 'undefined' || initialised || !META_PIXEL_ID) return;
  initialised = true;

  const w = window;
  let instance = w.fbq;

  if (typeof instance !== 'function') {
    const fbq = ((...args: unknown[]) => {
      if (typeof fbq.callMethod === 'function') fbq.callMethod(...args);
      else fbq.queue.push(args);
    }) as FbqInstance;
    fbq.queue = [];
    fbq.push = (...args: unknown[]) => fbq(...args);
    fbq.loaded = true;
    fbq.version = '2.0';

    w.fbq = fbq;
    w._fbq = fbq;
    instance = fbq;

    const script = document.createElement('script');
    script.async = true;
    script.src = FBEVENTS_SRC;
    const first = document.getElementsByTagName('script')[0];
    if (first && first.parentNode) first.parentNode.insertBefore(script, first);
    else document.head.appendChild(script);
  }

  instance('init', META_PIXEL_ID);
}

/**
 * Fires a standard Meta Pixel event. No-op during SSR or when the pixel is not
 * available (e.g. blocked by an extension), so tracking can never break the UI.
 */
export function trackMetaEvent(
  eventName: MetaEventName,
  params?: Record<string, unknown>,
  options?: { eventID?: string }
): void {
  if (typeof window === 'undefined') return;
  const fbq = window.fbq;
  if (typeof fbq !== 'function' || !META_PIXEL_ID) return;

  if (options?.eventID) fbq('track', eventName, params ?? {}, options);
  else fbq('track', eventName, params ?? {});
}

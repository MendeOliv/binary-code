import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { MetaEvent, initMetaPixel, trackMetaEvent } from '../lib/meta-pixel';

/**
 * Commercial pages that deserve a ViewContent event. Kept intentionally short:
 * only pages whose content is a commercial presentation (capabilities, cases).
 */
const VIEW_CONTENT_ROUTES: Record<
  string,
  { content_name: string; content_category: string }
> = {
  '/solutions': { content_name: 'Soluções', content_category: 'capabilities' },
  '/projects': { content_name: 'Projetos e Cases', content_category: 'case-studies' },
};

function fireForPath(pathname: string): void {
  trackMetaEvent(MetaEvent.PageView);
  const content = VIEW_CONTENT_ROUTES[pathname];
  if (content) trackMetaEvent(MetaEvent.ViewContent, content);
}

/**
 * Mounts the Meta Pixel once for the whole app and emits PageView on every
 * client-side navigation (Pages Router emits `routeChangeComplete`). Renders
 * nothing, so it cannot affect layout, copy or UX.
 */
export default function MetaPixel() {
  const router = useRouter();
  const initialFiredRef = useRef(false);

  useEffect(() => {
    initMetaPixel();

    // First page load. The ref absorbs React StrictMode's double effect
    // invocation in development, so PageView is never sent twice.
    if (!initialFiredRef.current) {
      initialFiredRef.current = true;
      fireForPath(router.pathname);
    }

    const handleRouteChange = (url: string) => {
      const pathname = url.split('?')[0].split('#')[0];
      fireForPath(pathname);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  return null;
}

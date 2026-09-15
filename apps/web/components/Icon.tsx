/**
 * Local inline SVG icons for CRITICAL UI controls (menu, close, send/arrows,
 * confirmation, terminal).
 *
 * Why this exists: every other icon in the app renders as a Material Symbols
 * OUTLINED ligature (`<span class="material-symbols-outlined">menu</span>`).
 * That glyph only appears once the external icon font finishes loading — on a
 * slow mobile connection (or with the font blocked) the raw word "menu",
 * "close", "arrow_forward"… is painted instead. For critical controls that is
 * unacceptable, so these components embed the same outlined geometry as local
 * SVG (no network, no font, no FOUT) while inheriting `currentColor`, exactly
 * like the font glyphs did.
 *
 * Secondary/decorative icons on content pages can keep using the icon font.
 */

interface IconProps {
  className?: string;
}

const svgProps = {
  viewBox: '0 0 24 24',
  fill: 'currentColor',
  'aria-hidden': true as const,
  focusable: false as const,
};

const baseClass = 'shrink-0';

/** Material Symbols "menu" — hamburger. */
export function IconMenu({ className }: IconProps) {
  return (
    <svg {...svgProps} className={`${baseClass} ${className ?? ''}`}>
      <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
    </svg>
  );
}

/** Material Symbols "close" — X. */
export function IconClose({ className }: IconProps) {
  return (
    <svg {...svgProps} className={`${baseClass} ${className ?? ''}`}>
      <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
    </svg>
  );
}

/** Material Symbols "arrow_forward" — used as the chat send action. */
export function IconArrowForward({ className }: IconProps) {
  return (
    <svg {...svgProps} className={`${baseClass} ${className ?? ''}`}>
      <path d="m12 4-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z" />
    </svg>
  );
}

/** Material Symbols "check_circle" — outlined success mark. */
export function IconCheckCircle({ className }: IconProps) {
  return (
    <svg {...svgProps} className={`${baseClass} ${className ?? ''}`}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8-1.41-1.42z" />
    </svg>
  );
}

/** Material Symbols "terminal" — outlined window with prompt. */
export function IconTerminal({ className }: IconProps) {
  return (
    <svg {...svgProps} className={`${baseClass} ${className ?? ''}`}>
      {/* Window frame: outer rect with inner cutout (outlined style). */}
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm16 2H4v12h16V6z" />
      {/* Prompt chevron */}
      <path d="M8 10.44 10.06 12.5 8 14.56l1.06 1.06 3.06-3.06-3.06-3.06L8 10.44z" />
      {/* Cursor line */}
      <path d="M12.5 13.25h4.5v1.5h-4.5z" />
    </svg>
  );
}

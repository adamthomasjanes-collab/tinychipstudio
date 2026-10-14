import React from 'react';

/**
 * Tiny Chip Studio — master pixel mascot.
 * Built on a 56 × 56 unit grid: hard right angles, one stepped silicon outline,
 * rectangular eyes, an off-center grin and asymmetrical walking legs.
 * No font glyphs, stroke scaling, or bitmap tracing.
 *
 * Colour comes from CSS: `currentColor` is the body and eyes, `--chip-core` is the
 * knocked-out centre. Decorative everywhere it appears, so it is hidden from
 * assistive tech unless a `title` is passed.
 */
export default function Mascot({ className = '', title }) {
  const a11y = title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true, focusable: 'false' };
  return (
    <svg className={`chip-mascot ${className}`.trim()} viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg" {...a11y}>
      <g shapeRendering="crispEdges">
        {/* Angular motion marks, upper-right. */}
        <g fill="currentColor">
          <path d="M43 4h3v5h-3zM46 1h3v4h-3z" />
          <path d="M48 13h6v3h-6z" />
          <path d="M44 20h5v3h-5zM49 17h4v3h-4z" />
        </g>
        {/* Walking limbs: staggered feet and crooked arms. */}
        <g fill="currentColor">
          <path d="M14 34h4v7h-3v4h-5v-3h2v-4h2z" />
          <path d="M32 36h4v5h4v3h-3v5h-7v-3h4v-4h-2z" />
          <path d="M8 19H4v4H1v5h3v-2h5z" />
          <path d="M38 25h5v4h3v4h-4v-2h-5z" />
        </g>
        {/* Stepped IC pins on all four sides. */}
        <g fill="currentColor">
          <path d="M12 11h3V6h3v6h3V7h3v5h3V5h3v7h3V8h3v8H12z" />
          <path d="M9 14H5v4h5v4H4v4h6v4H7v4h6V14z" />
          <path d="M36 13h4v4h4v4h-5v4h4v4h-5v5h-4z" />
        </g>
        {/* Chip body (outline). */}
        <path fill="currentColor" d="M13 11h21v3h4v5h2v14h-3v5H15v-3h-5V17h3z" />
        {/* Chip core (negative space). */}
        <path fill="var(--chip-core, #0b0d11)" d="M16 15h17v3h3v15h-3v2H17v-3h-4V19h3z" />
        {/* Two vertical eyes and an off-center grin. */}
        <g fill="currentColor">
          <path d="M19 21h4v8h-4zM29 20h4v8h-4z" />
          <path d="M22 30h3v3h6v-3h3v5h-3v2h-6v-2h-3z" />
        </g>
      </g>
    </svg>
  );
}

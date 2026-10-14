import React from 'react';
import Chip from './Chip';
import { word } from './sprite';

const L1 = word('TINY CHIP');
const L2 = word('STUDIO', { y0: 11 });
const ONE = word('TINY CHIP STUDIO');

/** The pixel wordmark on its own. `lines` = 2 (stacked) or 1. */
export function Wordmark({ lines = 2, className = '' }) {
  const runs = lines === 1 ? ONE.runs : [...L1.runs, ...L2.runs];
  const w = lines === 1 ? ONE.width : Math.max(L1.width, L2.width);
  const h = lines === 1 ? 9 : 20;
  return (
    <svg
      className={`wordmark ${className}`.trim()}
      viewBox={`0 0 ${w} ${h}`}
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      {runs.map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={1} fill="currentColor" />
      ))}
    </svg>
  );
}

/** Chip + wordmark lockup. The accessible name lives on the wrapping link. */
export default function Logo({ lines = 2, pose = 'idle', className = '' }) {
  return (
    <span className={`logo logo--${lines === 1 ? 'line' : 'stack'} ${className}`.trim()}>
      <Chip className="logo-chip" pose={pose} calm />
      <Wordmark lines={lines} />
    </span>
  );
}

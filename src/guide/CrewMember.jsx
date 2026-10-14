import React, { useState } from 'react';
import Chip from '../chip/Chip';
import { CREW } from '../chip/sprite';
import { useGuide } from './GuideContext';

/**
 * A crew member hiding somewhere on the page. Peeks out; pops up when found.
 * `pose` is what they're doing while hidden (sleep, think, wow…).
 * `peek` is the CSS direction they hide toward (up = rises from below an edge).
 */
export default function CrewMember({ crew, pose = 'idle', peek = 'up', className = '' }) {
  const { found, find } = useGuide();
  const [pop, setPop] = useState(false);
  const isFound = found.includes(crew);
  const c = CREW[crew];

  const onClick = () => {
    find(crew);
    setPop(true);
    setTimeout(() => setPop(false), 1600);
  };

  return (
    <button
      type="button"
      className={`crew crew--${crew} crew--peek-${peek} ${isFound ? 'is-found' : ''} ${pop ? 'is-pop' : ''} ${className}`.trim()}
      onClick={onClick}
      aria-label={isFound ? `${c.name}, a member of the Chip crew (found)` : 'A hidden chip! Say hi'}
    >
      <Chip crew={crew} pose={pop ? 'cheer' : isFound ? 'wave' : pose} />
    </button>
  );
}

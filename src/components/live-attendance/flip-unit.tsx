
'use client';

import React, { useState, useEffect, memo } from 'react';
import { cn } from '@/lib/utils';

interface FlipUnitProps {
  currentValue: string; // e.g., "05", "59"
  previousValue: string;
}

export const FlipUnit: React.FC<FlipUnitProps> = memo(({ currentValue, previousValue }) => {
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (currentValue !== previousValue) {
      setIsFlipping(true);
      const timer = setTimeout(() => {
        setIsFlipping(false);
      }, 580); // Slightly less than animation duration to ensure clean reset
      return () => clearTimeout(timer);
    }
  }, [currentValue, previousValue]);

  return (
    <div className="flip-card">
      {/* Static top half showing the new value underneath */}
      <div className="flip-card-static-top">
        <span className="text-emerald-600">{currentValue}</span>
      </div>
      {/* Static bottom half: show PREVIOUS during flip, NEW otherwise */}
      <div className="flip-card-static-bottom">
        <span className="text-emerald-600">{isFlipping ? previousValue : currentValue}</span>
      </div>
      {/* Top flap that animates, shows the previous value */}
      <div
        className={cn(
          'flip-card-flap flip-card-top-flap',
          isFlipping && 'animate-flip-top'
        )}
      >
        {/* Content of top flap should be previous during flip, current otherwise to match visual state before/after flip */}
        <span className="text-emerald-600">{isFlipping ? previousValue : currentValue}</span>
      </div>
      {/* Bottom flap that is revealed, shows the new value */}
      <div
        className={cn(
          'flip-card-flap flip-card-bottom-flap',
           isFlipping && 'animate-flip-bottom'
        )}
      >
        <span className="text-emerald-600">{currentValue}</span>
      </div>
    </div>
  );
});

FlipUnit.displayName = 'FlipUnit';

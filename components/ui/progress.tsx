'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, ...props }, ref) => {
    // Ensure value is a valid number between 0 and max
    const validValue = React.useMemo(() => {
      if (value === null || value === undefined) return 0;
      const numValue = Number(value);
      if (isNaN(numValue)) return 0;
      return Math.max(0, Math.min(max, numValue));
    }, [value, max]);

    // Ensure max is a valid positive number
    const validMax = React.useMemo(() => {
      const numMax = Number(max);
      if (isNaN(numMax) || numMax <= 0) return 100;
      return numMax;
    }, [max]);

    // Calculate percentage
    const percentage = React.useMemo(() => {
      return (validValue / validMax) * 100;
    }, [validValue, validMax]);

    return (
      <div
        ref={ref}
        className={cn(
          'relative h-4 w-full overflow-hidden rounded-full bg-secondary',
          className
        )}
        role="progressbar"
        aria-valuenow={validValue}
        aria-valuemin={0}
        aria-valuemax={validMax}
        {...props}
      >
        <div
          className="h-full w-full flex-1 bg-primary transition-all"
          style={{ transform: `translateX(-${100 - percentage}%)` }}
        />
      </div>
    );
  }
);

Progress.displayName = 'Progress';

export { Progress };

// Inline SVG interface icons. Unicode arrows (↗ ← →) and symbols (× ☰) are rendered
// as colour emoji by iOS Safari, so all directional UI uses these instead. Each icon
// inherits the current text colour and scales with the surrounding font size.

type Direction = 'right' | 'left' | 'up-right';

const arrowPaths: Record<Direction, string> = {
  right: 'M2 8h11.5M9.5 4l4 4-4 4',
  left: 'M14 8H2.5M6.5 4l-4 4 4 4',
  'up-right': 'M4 12l8-8M5.5 4H12v6.5',
};

export function ArrowIcon({ direction = 'right', className = '' }: { direction?: Direction; className?: string }) {
  return (
    <svg className={`ui-icon ${className}`} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d={arrowPaths[direction]} />
    </svg>
  );
}

export function CloseIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={`ui-icon ${className}`} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
    </svg>
  );
}

export function MenuIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={`ui-icon ${className}`} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M2 5.5h12M2 10.5h12" />
    </svg>
  );
}

// Hand-drawn wave: the site's signature mark beneath major headings.
export function Squiggle({ className = '' }: { className?: string }) {
  return (
    <svg className={`squiggle ${className}`} viewBox="0 0 72 10" aria-hidden="true" focusable="false">
      <path d="M2 5c5-4 9-4 14 0s9 4 14 0 9-4 14 0 9 4 14 0 9-4 12-1" />
    </svg>
  );
}

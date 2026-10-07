'use client';

const controls = [
  { code: 'KeyW', label: 'Walk forward', symbol: '↑' },
  { code: 'KeyA', label: 'Walk left', symbol: '←' },
  { code: 'KeyS', label: 'Walk backward', symbol: '↓' },
  { code: 'KeyD', label: 'Walk right', symbol: '→' },
] as const;

export default function MovementPad({ onMove }: { onMove: (code: string, down: boolean) => void }) {
  const button = (code: (typeof controls)[number]['code']) => {
    const item = controls.find((entry) => entry.code === code)!;
    return <button key={item.code} aria-label={item.label}
      onPointerDown={(event) => { onMove(item.code, true); event.currentTarget.setPointerCapture(event.pointerId); }}
      onPointerUp={() => onMove(item.code, false)} onPointerCancel={() => onMove(item.code, false)}
      onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onMove(item.code, true); } }}
      onKeyUp={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onMove(item.code, false); } }}>
      {item.symbol}
    </button>;
  };
  return <div className="mobile-pad" aria-label="Touch movement controls">
    {button('KeyW')}
    <div>{button('KeyA')}{button('KeyS')}{button('KeyD')}</div>
  </div>;
}

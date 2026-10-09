'use client';

import { useEffect, useRef } from 'react';
import { ARTIST } from '@/data/artist';
import { CloseIcon, Squiggle } from './Icon';

export default function AboutArtist({ onClose }: { onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { closeRef.current?.focus({ preventScroll: true }); }, []);
  return <section className="about-panel" role="dialog" aria-modal="true" aria-labelledby="about-title">
    <header><span>ARTIST PROFILE</span><button ref={closeRef} className="close-button" onClick={onClose} aria-label="Close artist information"><span>CLOSE</span><CloseIcon /></button></header>
    <div className="about-content"><p className="eyebrow">ARTIST / ILLUSTRATOR</p><h1 id="about-title">{ARTIST.name}</h1><Squiggle /><p className="about-bio">{ARTIST.bio}</p>
      <dl className="about-meta"><div><dt>On view</dt><dd>Selected works · 2026</dd></div><div><dt>Collection</dt><dd>Paintings, drawings, illustrations &amp; sculpture</dd></div></dl>
    </div>
    <footer>{ARTIST.name} <span>·</span> 2026</footer>
  </section>;
}

'use client';

import { ARTIST } from '@/data/artist';

export default function AboutArtist({ onClose }: { onClose: () => void }) {
  return <section className="about-panel" aria-labelledby="about-title">
    <header><span>ARTIST PROFILE</span><button onClick={onClose} aria-label="Close artist information">CLOSE ×</button></header>
    <div className="about-content"><p className="eyebrow">ARTIST / ILLUSTRATOR</p><h1 id="about-title">{ARTIST.name}</h1><p className="about-bio">{ARTIST.bio}</p>
      <dl className="about-meta"><div><dt>On view</dt><dd>Selected works · 2026</dd></div><div><dt>Collection</dt><dd>Paintings, drawings, illustrations &amp; sculpture</dd></div></dl>
    </div>
    <footer>{ARTIST.name} <span>·</span> 2026</footer>
  </section>;
}

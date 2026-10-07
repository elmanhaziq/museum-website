'use client';

import { ARTIST } from '@/data/artist';

export default function AboutArtist({ onClose }: { onClose: () => void }) {
  return <section className="about-panel" aria-labelledby="about-title">
    <header><span>ARTIST PROFILE</span><button onClick={onClose} aria-label="Close artist information">CLOSE ×</button></header>
    <div className="about-content"><p className="eyebrow">A NOTE FROM THE STUDIO</p><h1 id="about-title">{ARTIST.name}</h1><p className="about-bio">{ARTIST.bio}</p>
      <dl className="about-meta"><div><dt>Education</dt><dd>{ARTIST.education}</dd></div><div><dt>Interests</dt><dd>{ARTIST.interests}</dd></div><div><dt>Exhibitions</dt><dd>{ARTIST.exhibitions}</dd></div><div><dt>Contact</dt><dd><a href={`mailto:${ARTIST.email}`}>{ARTIST.email}</a><br /><a href={`https://instagram.com/${ARTIST.social.replace('@', '')}`} target="_blank" rel="noreferrer">{ARTIST.social}</a></dd></div></dl>
    </div>
    <footer>{ARTIST.name} <span>·</span> 2026</footer>
  </section>;
}

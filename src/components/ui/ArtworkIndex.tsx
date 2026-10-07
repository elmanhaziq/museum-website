'use client';

import { Artwork } from '@/data/artworks';
export default function ArtworkIndex({ items, onSelect, onClose }: { items: Artwork[]; onSelect: (id: string) => void; onClose: () => void }) {
  return <section className="artwork-index" aria-labelledby="works-title">
    <header><span>EXHIBITION INDEX</span><button onClick={onClose} aria-label="Close exhibition index">CLOSE ×</button></header>
    <div className="index-content"><p className="eyebrow">MAIN GALLERY / SELECTED WORKS</p><h1 id="works-title">The collection</h1>
      <ol>{items.map((item, index) => <li key={item.id}><button onClick={() => onSelect(item.id)}><span className="index-number">{String(index + 1).padStart(2, '0')}</span><span className="index-title">{item.title}</span><span className="index-year">{item.year}</span><span className="index-arrow" aria-hidden="true">↗</span></button></li>)}</ol>
      <p className="index-note">Approach a work in the gallery or choose a title here.</p>
    </div>
    <footer>ARTIST NAME <span>·</span> 2026</footer>
  </section>;
}

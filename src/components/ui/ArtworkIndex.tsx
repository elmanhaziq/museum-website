'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { Artwork } from '@/data/artworks';
import { ARTIST } from '@/data/artist';
import { ArrowIcon, CloseIcon } from './Icon';

export default function ArtworkIndex({ items, onSelect, onClose, initialScrollTop = 0, onScrollPosition }: { items: Artwork[]; onSelect: (id: string) => void; onClose: () => void; initialScrollTop?: number; onScrollPosition: (scrollTop: number) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useLayoutEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = initialScrollTop; }, [initialScrollTop]);
  useEffect(() => { closeRef.current?.focus({ preventScroll: true }); }, []);
  return <section className="artwork-index" role="dialog" aria-modal="true" aria-labelledby="works-title">
    <header><span>EXHIBITION INDEX</span><button ref={closeRef} className="close-button" onClick={onClose} aria-label="Close exhibition index"><span>CLOSE</span><CloseIcon /></button></header>
    <div className="index-scroll" ref={scrollRef} onScroll={(event) => onScrollPosition(event.currentTarget.scrollTop)}>
    <div className="index-content"><p className="eyebrow">MAIN GALLERY / SELECTED WORKS</p><h1 id="works-title">The collection</h1>
      <ol>{items.map((item, index) => <li key={item.id}><button onClick={() => onSelect(item.id)}><span className="index-number">{String(index + 1).padStart(2, '0')}</span><span className="index-thumb"><img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}${item.image.replace('/artworks/', '/artworks/thumbs/')}`} alt="" loading="lazy" decoding="async" width={64} height={64} /></span><span className="index-title">{item.title}<span className="index-medium">{item.medium}</span></span><span className="index-year">{item.year}</span><ArrowIcon className="index-arrow" /></button></li>)}</ol>
      <p className="index-note">Approach a work in the gallery or choose a title here.</p>
    </div>
    </div>
    <footer>{ARTIST.name.toUpperCase()} <span>·</span> 2026</footer>
  </section>;
}

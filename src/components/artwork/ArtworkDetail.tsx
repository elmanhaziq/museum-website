'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { Artwork } from '@/data/artworks';
import { ARTIST } from '@/data/artist';
import { ArrowIcon } from '@/components/ui/Icon';
import { ArtworkImage, ArtworkMetadata } from './ArtworkImage';

export default function ArtworkDetail({ artwork, onReturn }: { artwork: Artwork; onReturn?: () => void }) {
  const returnRef = useRef<HTMLButtonElement & HTMLAnchorElement>(null);
  useEffect(() => { if (onReturn) returnRef.current?.focus({ preventScroll: true }); }, [onReturn]);
  const returnLabel = <><ArrowIcon direction="left" /><span>RETURN TO GALLERY</span></>;
  return <section className="artwork-detail" role={onReturn ? 'dialog' : undefined} aria-modal={onReturn ? true : undefined} aria-labelledby="artwork-detail-title">
    <header className="detail-header">
      {onReturn
        ? <button type="button" ref={returnRef} onClick={onReturn} className="return-link">{returnLabel}</button>
        : <Link href="/gallery" ref={returnRef} className="return-link">{returnLabel}</Link>}
      <span className="detail-credit">{ARTIST.name} <i>·</i> {artwork.year}</span>
    </header>
    <div className="detail-layout">
      <ArtworkImage artwork={artwork} className="detail-art" />
      <article className="detail-copy">
        <p className="eyebrow">{artwork.room.replaceAll('-', ' ').toUpperCase()} / {String(artwork.year)}</p>
        <h1 id="artwork-detail-title">{artwork.title}</h1>
        <ArtworkMetadata artwork={artwork} />
        <p className="detail-description">{artwork.description}</p>
        {artwork.artistStatement && <blockquote>{artwork.artistStatement}</blockquote>}
      </article>
    </div>
    <footer className="detail-footer"><span>{ARTIST.name}</span><span>AN EXHIBITION OF WORKS</span></footer>
  </section>;
}

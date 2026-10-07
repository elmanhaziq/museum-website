'use client';

import { Artwork } from '@/data/artworks';
import { ARTIST } from '@/data/artist';
import { ArtworkImage, ArtworkMetadata } from './ArtworkImage';

export default function ArtworkDetail({ artwork, onReturn }: { artwork: Artwork; onReturn?: () => void }) {
  return <section className="artwork-detail" aria-label={`Artwork details for ${artwork.title}`}>
    <header className="detail-header">{onReturn ? <button type="button" onClick={onReturn} className="return-link">← <span>RETURN TO GALLERY</span></button> : <a href="/gallery" className="return-link">← <span>RETURN TO GALLERY</span></a>}<span>{ARTIST.name} <i>·</i> {artwork.year}</span></header>
    <div className="detail-layout">
      <ArtworkImage artwork={artwork} className="detail-art" />
      <article className="detail-copy">
        <p className="eyebrow">{artwork.room.replaceAll('-', ' ').toUpperCase()} / {String(artwork.year)}</p>
        <h1>{artwork.title}</h1>
        <ArtworkMetadata artwork={artwork} />
        <p className="detail-description">{artwork.description}</p>
        {artwork.artistStatement && <blockquote>{artwork.artistStatement}</blockquote>}
      </article>
    </div>
    <footer className="detail-footer"><span>{ARTIST.name}</span><span>AN EXHIBITION OF WORKS</span></footer>
  </section>;
}

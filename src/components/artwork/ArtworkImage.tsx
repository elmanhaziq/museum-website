'use client';

import { useEffect, useState } from 'react';
import { Artwork } from '@/data/artworks';

export function ArtworkImage({
  artwork,
  className = '',
}: {
  artwork: Artwork;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [artwork.image]);

  if (failed) {
    return (
      <div
        className={`artwork-image image-placeholder ${className}`}
        role="img"
        aria-label={artwork.alt}
      >
        <span>IMAGE UNAVAILABLE</span>
      </div>
    );
  }

  return (
    <div className={`artwork-image ${className}`}>
      <img
         src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}${artwork.image}`}
         alt={artwork.alt}
        onError={() => setFailed(true)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
  }}

      />
    </div>
  );
}

export function ArtworkMetadata({ artwork }: { artwork: Artwork }) {
  return (
    <dl className="artwork-metadata">
      <div>
        <dt>Year</dt>
        <dd>{artwork.year}</dd>
      </div>
      <div>
        <dt>Medium</dt>
        <dd>{artwork.medium}</dd>
      </div>
      {artwork.dimensions && (
        <div>
          <dt>Dimensions</dt>
          <dd>{artwork.dimensions}</dd>
        </div>
      )}
      <div>
        <dt>Gallery</dt>
        <dd>{artwork.room.replaceAll('-', ' ')}</dd>
      </div>
    </dl>
  );
}
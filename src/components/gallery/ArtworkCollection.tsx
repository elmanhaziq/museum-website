'use client';

import { Artwork as ArtworkData } from '@/data/artworks';
import Artwork from '@/components/artwork/Artwork';
import ArtworkFrame from '@/components/artwork/ArtworkFrame';
import ArtworkErrorBoundary from '@/components/artwork/ArtworkErrorBoundary';

export default function ArtworkCollection({ items, onSelect }: { items: ArtworkData[]; onSelect: (id: string) => void }) {
  return <group>{items.map((artwork) => {
    const aspect = artwork.imageAspectRatio ?? 0.75;
    const height = Math.min(1.62, 1.95 / aspect);
    const width = height * aspect;
    const fallback = <group position={artwork.position} rotation={artwork.rotation}>
      <ArtworkFrame width={width} height={height} />
      <mesh position={[0, 0, 0.079]}><planeGeometry args={[width - 0.13, height - 0.13]} /><meshBasicMaterial color="#d4ccbd" /></mesh>
    </group>;
    return <ArtworkErrorBoundary key={artwork.id} name={artwork.title} fallback={fallback}>
      <Artwork artwork={artwork} onSelect={onSelect} />
    </ArtworkErrorBoundary>;
  })}</group>;
}

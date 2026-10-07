'use client';

import { useTexture } from '@react-three/drei';
import { useEffect } from 'react';
import { DoubleSide, SRGBColorSpace } from 'three';
import { useThree } from '@react-three/fiber';
import { Artwork as ArtworkData } from '@/data/artworks';
import ArtworkFrame from './ArtworkFrame';

export default function Artwork({ artwork, onSelect }: { artwork: ArtworkData; onSelect: (id: string) => void }) {
  const texture = useTexture(artwork.image);
  const { gl } = useThree();
  const aspect = artwork.imageAspectRatio ?? 3 / 4;
  const height = Math.min(1.62, 1.95 / aspect);
  const width = height * aspect;
  useEffect(() => {
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = Math.min(gl.capabilities.getMaxAnisotropy(), 8);
    texture.needsUpdate = true;
  }, [texture, gl]);

  return <group position={artwork.position} rotation={artwork.rotation} onPointerDown={(event) => { event.stopPropagation(); onSelect(artwork.id); }}>
    <ArtworkFrame width={width} height={height} />
    <mesh position={[0, 0, 0.079]}>
      <planeGeometry args={[width - 0.13, height - 0.13]} />
      <meshBasicMaterial map={texture} toneMapped={false} side={DoubleSide} />
    </mesh>
  </group>;
}





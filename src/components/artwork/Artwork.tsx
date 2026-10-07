'use client';

import { Suspense, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { DoubleSide, SRGBColorSpace } from 'three';
import { Artwork as ArtworkData } from '@/data/artworks';
import ArtworkFrame from './ArtworkFrame';

function ArtworkTexture({ artwork, imageWidth, imageHeight, depth }: { artwork: ArtworkData; imageWidth: number; imageHeight: number; depth: number }) {
  const texture = useTexture(
  `${process.env.NEXT_PUBLIC_BASE_PATH || ''}${artwork.image}`
);
  const { gl } = useThree();
  useEffect(() => {
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = Math.min(gl.capabilities.getMaxAnisotropy(), 6);
    texture.needsUpdate = true;
  }, [texture, gl]);
  return <mesh position={[0,0,depth+0.001]}><planeGeometry args={[imageWidth,imageHeight]}/><meshBasicMaterial map={texture} toneMapped={false} side={DoubleSide}/></mesh>;
}

export default function Artwork({ artwork, onSelect }: { artwork: ArtworkData; onSelect: (id: string) => void }) {
  const { camera } = useThree();
  const [loadImage, setLoadImage] = useState(false);
  const aspect = artwork.imageAspectRatio ?? 3 / 4;
  const height = artwork.size?.[1] ?? Math.min(1.62, 1.95 / aspect);
  const width = artwork.size?.[0] ?? height * aspect;
  const imageHeight = height - 0.13;
  const imageWidth = imageHeight * aspect;
  const depth = (artwork.frameThickness ?? 0.085) * 0.54 + 0.012;
  useFrame(() => {
    if (!loadImage && camera.position.distanceToSquared({x:artwork.position[0],y:artwork.position[1],z:artwork.position[2]}) < 23*23) setLoadImage(true);
  });

  return <group position={artwork.position} rotation={artwork.rotation} onPointerDown={(event) => { event.stopPropagation(); onSelect(artwork.id); }}>
    <ArtworkFrame width={width} height={height} style={artwork.frameStyle} color={artwork.frameColor} thickness={artwork.frameThickness} />
    <mesh position={[0,0,depth]}><planeGeometry args={[imageWidth,imageHeight]}/><meshBasicMaterial color="#e5e0d6" toneMapped={false}/></mesh>
    {loadImage && <Suspense fallback={null}><ArtworkTexture artwork={artwork} imageWidth={imageWidth} imageHeight={imageHeight} depth={depth}/></Suspense>}
  </group>;
}

'use client';

import { useMemo } from 'react';
import { CanvasTexture, SRGBColorSpace } from 'three';
import { Artwork as ArtworkData } from '@/data/artworks';
import Artwork from '@/components/artwork/Artwork';
import ArtworkFrame from '@/components/artwork/ArtworkFrame';
import ArtworkErrorBoundary from '@/components/artwork/ArtworkErrorBoundary';
import FishSculpture from '@/components/artwork/FishSculpture';
import { ARTIST } from '@/data/artist';
import { placeArtworkLabel } from '@/lib/gallery-layout';

function MuseumLabel({ artwork }: { artwork: ArtworkData }) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 144;
    const context = canvas.getContext('2d');
    if (context) {
      context.clearRect(0, 0, 512, 144);
      context.fillStyle = '#b75c74';
      context.font = '600 14px Arial, sans-serif';
      context.fillText(ARTIST.name.toLocaleUpperCase(), 4, 26, 500);
      context.fillStyle = '#4f4c46';
      context.font = '500 20px Arial, sans-serif';
      context.fillText(artwork.title.toLocaleUpperCase(), 4, 69, 500);
      context.fillStyle = '#79756d';
      context.font = '16px Arial, sans-serif';
      context.fillText(`${artwork.year}  ·  ${artwork.medium}`, 4, 106, 500);
    }
    const map = new CanvasTexture(canvas);
    map.colorSpace = SRGBColorSpace;
    return map;
  }, [artwork.medium, artwork.title, artwork.year]);
  return <mesh>
    <planeGeometry args={[1.5, 0.28]} />
    <meshBasicMaterial map={texture} transparent toneMapped={false} depthWrite={false} />
  </mesh>;
}

export default function ArtworkCollection({ items, onSelect }: { items: ArtworkData[]; onSelect: (id: string) => void }) {
  return <group>{items.map((artwork) => {
    if (artwork.displayType === 'sculpture') return <group key={artwork.id} position={[artwork.position[0], 0, artwork.position[2]]} rotation={artwork.rotation} onPointerDown={(event) => { event.stopPropagation(); onSelect(artwork.id); }}>
      {/* Gallery plinth with the wall-label text set into its front face */}
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow><boxGeometry args={[1.7, 0.7, 1.1]} /><meshStandardMaterial color="#f6efe2" roughness={0.86} /></mesh>
      <mesh position={[0, 0.015, 0]}><boxGeometry args={[1.74, 0.03, 1.14]} /><meshStandardMaterial color="#d9cdb8" roughness={0.9} /></mesh>
      {artwork.showLabel !== false && <group position={[0, 0.4, 0.552]} scale={0.95}><MuseumLabel artwork={artwork} /></group>}
      <group position={[0, 0.7, 0]}><FishSculpture /></group>
      <mesh position={[0, 1.6, 0]}><sphereGeometry args={[1.05, 12, 10]} /><meshBasicMaterial transparent opacity={0} depthWrite={false} /></mesh>
    </group>;
    const aspect = artwork.imageAspectRatio ?? 0.75;
    const height = artwork.size?.[1] ?? Math.min(1.62, 1.95 / aspect);
    const width = artwork.size?.[0] ?? height * aspect;
    const imageHeight = height - 0.13;
    const imageWidth = imageHeight * aspect;
    const thickness = artwork.frameThickness ?? 0.085;
    const label = artwork.wallId ? placeArtworkLabel(artwork.wallId, artwork.offsetX ?? 0, artwork.centerY ?? artwork.position[1], height, artwork.spacing ?? .14, artwork.wallOffset ?? .015) : null;
    const fallback = <group position={artwork.position} rotation={artwork.rotation}>
      <ArtworkFrame width={width} height={height} style={artwork.frameStyle} color={artwork.frameColor} thickness={thickness} />
      <mesh position={[0, 0, thickness * 0.54 + 0.012]}><planeGeometry args={[imageWidth, imageHeight]} /><meshBasicMaterial color="#d4ccbd" /></mesh>
    </group>;
    return <ArtworkErrorBoundary key={artwork.id} name={artwork.title} fallback={fallback}>
      <Artwork artwork={artwork} onSelect={onSelect} />
      {artwork.showLabel && label && <group position={label.position} rotation={label.rotation}><MuseumLabel artwork={artwork}/></group>}
    </ArtworkErrorBoundary>;
  })}</group>;
}

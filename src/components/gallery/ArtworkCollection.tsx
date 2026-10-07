'use client';

import { useMemo } from 'react';
import { CanvasTexture, SRGBColorSpace } from 'three';
import { Artwork as ArtworkData } from '@/data/artworks';
import Artwork from '@/components/artwork/Artwork';
import ArtworkFrame from '@/components/artwork/ArtworkFrame';
import ArtworkErrorBoundary from '@/components/artwork/ArtworkErrorBoundary';
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
    if (artwork.displayType === 'sculpture') return <group key={artwork.id} position={[artwork.position[0], 0, artwork.position[2]]} onPointerDown={(event) => { event.stopPropagation(); onSelect(artwork.id); }}>
      <mesh position={[0, 0.12, 0]} receiveShadow><cylinderGeometry args={[1.18, 1.18, 0.14, 64]} /><meshStandardMaterial color="#f47f9b" roughness={0.78} /></mesh>
      <mesh position={[0, 0.58, 0]} castShadow receiveShadow><cylinderGeometry args={[0.68, 0.78, 0.82, 32]} /><meshStandardMaterial color="#fff8e8" roughness={0.72} /></mesh>
      <mesh position={[0, 1.01, 0]} castShadow><cylinderGeometry args={[0.83, 0.83, 0.07, 48]} /><meshStandardMaterial color="#f8a8ba" roughness={0.76} /></mesh>
      <group position={[0, 0, 0]}>
      <mesh position={[0, 2.13, 0]} scale={[0.72, 0.84, 0.5]} castShadow><sphereGeometry args={[1, 32, 24]} /><meshStandardMaterial color="#dedbd1" roughness={0.68} /></mesh>
        {Array.from({length: 6}, (_, row) => Array.from({length: 7}, (_, col) => {
          const y = 1.63 + row * 0.19;
          const x = (col - 3) * 0.17 + (row % 2 ? 0.06 : 0);
          const nx = x / 0.72; const ny = (y - 2.13) / 0.84;
          const z = 0.5 * Math.sqrt(Math.max(0.08, 1 - nx * nx - ny * ny)) + 0.025;
          const colors = ['#db5976','#ed6f86','#e99536','#e7c14a','#3e947a','#36a5a2','#d94f72'];
          const color = row >= 4 ? ['#b7b5aa','#d5d1c6','#94938b'][col % 3] : colors[(row * 2 + col) % colors.length];
          return <mesh key={`${row}-${col}`} position={[x,y,z]} scale={[0.082,0.108,0.032]} rotation={[0,0,(col-3)*0.035]} castShadow><sphereGeometry args={[1, 20, 14]} /><meshStandardMaterial color={color} roughness={row >= 4 ? 0.52 : 0.48} metalness={row >= 4 ? 0.34 : 0.08} /></mesh>;
        }))}
        <mesh position={[-0.7,2.08,-0.06]} rotation={[0,0,-0.28]} scale={[0.34,0.28,0.06]} castShadow><coneGeometry args={[1,1,3]} /><meshStandardMaterial color="#f4d04b" roughness={0.6} /></mesh>
        <mesh position={[0.7,2.08,-0.06]} rotation={[0,0,0.28]} scale={[0.34,0.28,0.06]} castShadow><coneGeometry args={[1,1,3]} /><meshStandardMaterial color="#f4d04b" roughness={0.6} /></mesh>
        <mesh position={[0.06,2.4,0.38]} castShadow><sphereGeometry args={[0.09,16,12]} /><meshStandardMaterial color="#242522" roughness={0.3} /></mesh>
        <mesh position={[0.09,2.43,0.455]}><sphereGeometry args={[0.027,10,8]} /><meshBasicMaterial color="#fff8e8" /></mesh>
        <mesh position={[0,1.3,0]} rotation={[Math.PI/2,0,0]}><coneGeometry args={[0.18,0.3,3]} /><meshStandardMaterial color="#ed6a7e" roughness={0.55} /></mesh>
      </group>
      {artwork.showLabel && <group>
        <mesh position={[0,.62,.91]} castShadow><boxGeometry args={[1.58,.34,.05]}/><meshStandardMaterial color="#fff8e8" roughness={.8}/></mesh>
        {[-.62,.62].map((x)=><mesh key={x} position={[x,.405,.91]} castShadow><boxGeometry args={[.055,.43,.065]}/><meshStandardMaterial color="#f0e4cf" roughness={.82}/></mesh>)}
        <group position={[0,.62,.938]}><MuseumLabel artwork={artwork}/></group>
      </group>}
      <mesh position={[0,2.05,0]}><sphereGeometry args={[1.02,16,12]} /><meshBasicMaterial transparent opacity={0} depthWrite={false} /></mesh>
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

import { MeshStandardMaterial } from 'three';

const frames: Record<string, MeshStandardMaterial> = {
  black: new MeshStandardMaterial({ color: '#3e3d37', roughness: 0.62 }),
  wood: new MeshStandardMaterial({ color: '#987d5d', roughness: 0.7 }),
  white: new MeshStandardMaterial({ color: '#f7f5ef', roughness: 0.76 }),
  shadowbox: new MeshStandardMaterial({ color: '#504c44', roughness: 0.67 }),
  canvas: new MeshStandardMaterial({ color: '#ded7c9', roughness: 0.92 }),
};
const matMaterial = new MeshStandardMaterial({ color: '#eee9dd', roughness: 0.9 });

export default function ArtworkFrame({ width, height, style = 'black', color, thickness = 0.085 }: { width: number; height: number; style?: string; color?: string; thickness?: number }) {
  const frameMaterial = color ? new MeshStandardMaterial({ color, roughness: 0.68 }) : frames[style] ?? frames.black;
  return <group>
    <mesh position={[0, 0, 0]} material={frameMaterial} castShadow receiveShadow><boxGeometry args={[width, height, thickness]} /></mesh>
    {style !== 'canvas' && <mesh position={[0, 0, thickness * 0.54]} material={matMaterial} castShadow receiveShadow><boxGeometry args={[width - 0.045, height - 0.045, 0.018]} /></mesh>}
  </group>;
}

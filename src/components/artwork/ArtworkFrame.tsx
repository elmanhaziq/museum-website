import { MeshStandardMaterial } from 'three';

const frameMaterial = new MeshStandardMaterial({ color: '#3e3d37', roughness: 0.62 });
const matMaterial = new MeshStandardMaterial({ color: '#eee9dd', roughness: 0.9 });

export default function ArtworkFrame({ width, height }: { width: number; height: number }) {
  return <group>
    <mesh position={[0, 0, 0]} material={frameMaterial}><boxGeometry args={[width, height, 0.085]} /></mesh>
    <mesh position={[0, 0, 0.046]} material={matMaterial}><boxGeometry args={[width - 0.045, height - 0.045, 0.018]} /></mesh>
  </group>;
}

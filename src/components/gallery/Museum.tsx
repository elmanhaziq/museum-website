import { GALLERY } from '@/lib/constants';

function Wall({ position, rotation = [0, 0, 0], size }: { position: [number, number, number]; rotation?: [number, number, number]; size: [number, number, number] }) {
  return <mesh position={position} rotation={rotation} receiveShadow><boxGeometry args={size} /><meshStandardMaterial color="#e9e6df" roughness={0.92} /></mesh>;
}

export default function Museum() {
  const { width, depth, height, wallThickness: t } = GALLERY;
  return (
    <group>
      <mesh position={[0, -0.12, 0]} receiveShadow><boxGeometry args={[width, 0.24, depth]} /><meshStandardMaterial color="#77736c" roughness={0.82} /></mesh>
      <mesh position={[0, height, 0]}><boxGeometry args={[width, 0.18, depth]} /><meshStandardMaterial color="#f2f0eb" roughness={0.95} /></mesh>
      <Wall position={[0, height / 2, -depth / 2]} size={[width, height, t]} />
      <Wall position={[0, height / 2, depth / 2]} size={[width, height, t]} />
      <Wall position={[-width / 2, height / 2, 0]} size={[t, height, depth]} />
      <Wall position={[width / 2, height / 2, 0]} size={[t, height, depth]} />
      {/* Quiet ceiling reveals establish the long proportions of the room. */}
      {[-5.2, 0, 5.2].map((z) => <mesh key={z} position={[0, height - 0.14, z]}><boxGeometry args={[width - 1.1, 0.08, 0.045]} /><meshStandardMaterial color="#d8d4cd" roughness={0.8} /></mesh>)}
    </group>
  );
}

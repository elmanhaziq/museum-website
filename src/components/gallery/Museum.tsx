import React, { Component, ReactNode, Suspense } from 'react';
import { Gltf } from '@react-three/drei';
import { GALLERY, MUSEUM_MODEL_URL } from '@/lib/constants';

function ProceduralMuseum() {
  const { width, depth, height, wallThickness: t } = GALLERY;
  return <group>
    <mesh position={[0, -0.12, 0]} receiveShadow><boxGeometry args={[width, 0.24, depth]} /><meshStandardMaterial color="#77736c" roughness={0.82} /></mesh>
    <mesh position={[0, height, 0]}><boxGeometry args={[width, 0.18, depth]} /><meshStandardMaterial color="#f2f0eb" roughness={0.95} /></mesh>
    <Wall position={[0, height / 2, -depth / 2]} size={[width, height, t]} />
    <Wall position={[0, height / 2, depth / 2]} size={[width, height, t]} />
    <Wall position={[-width / 2, height / 2, 0]} size={[t, height, depth]} />
    <Wall position={[width / 2, height / 2, 0]} size={[t, height, depth]} />
    {[-5.2, 0, 5.2].map((z) => <mesh key={z} position={[0, height - 0.14, z]}><boxGeometry args={[width - 1.1, 0.08, 0.045]} /><meshStandardMaterial color="#d8d4cd" roughness={0.8} /></mesh>)}
  </group>;
}

function Wall({ position, size }: { position: [number, number, number]; size: [number, number, number] }) {
  return <mesh position={position} receiveShadow><boxGeometry args={size} /><meshStandardMaterial color="#e9e6df" roughness={0.92} /></mesh>;
}

class MuseumModelBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error) { console.error('Museum model failed to load; using the procedural gallery.', error); }
  render() { return this.state.failed ? <ProceduralMuseum /> : this.props.children; }
}

export default function Museum() {
  if (!MUSEUM_MODEL_URL) return <ProceduralMuseum />;
  return <MuseumModelBoundary><Suspense fallback={<ProceduralMuseum />}><Gltf src={MUSEUM_MODEL_URL} castShadow receiveShadow /></Suspense></MuseumModelBoundary>;
}

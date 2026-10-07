import { useMemo } from 'react';
import { GALLERY } from '@/lib/constants';

export default function GalleryLighting() {
  const spots = useMemo(() => [-6, -2, 2, 6].flatMap((x) => [-5, 1, 7].map((z) => [x, GALLERY.height - 0.3, z] as [number, number, number])), []);
  return <>
    <ambientLight intensity={0.62} color="#fff9ed" />
    <hemisphereLight args={['#fffdf8', '#827c71', 1.1]} />
    <directionalLight position={[-4, 8, 5]} intensity={1.15} color="#fff6e8" castShadow shadow-mapSize={[1024, 1024]} shadow-camera-far={32} shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={12} shadow-camera-bottom={-12} />
    {spots.map(([x, y, z], index) => <spotLight key={index} position={[x, y, z]} target-position={[x * 0.52, 1.4, z]} angle={0.42} penumbra={0.85} intensity={24} distance={8} decay={2} color="#fff8ed" />)}
  </>;
}

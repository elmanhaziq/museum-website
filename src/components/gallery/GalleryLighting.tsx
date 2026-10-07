import { useMemo } from 'react';
import { Object3D } from 'three';
import { artworks, Artwork } from '@/data/artworks';
import { GALLERY } from '@/lib/constants';

function ArtworkSpotlight({ artwork, shadows }: { artwork: Artwork; shadows: boolean }) {
  const targetObject = useMemo(() => new Object3D(), [artwork.id]);
  const nx = Math.sin(artwork.rotation[1]);
  const nz = Math.cos(artwork.rotation[1]);
  const target: [number,number,number] = [artwork.position[0],artwork.position[1],artwork.position[2]];
  const fixture: [number,number,number] = [target[0]+nx*1.15,GALLERY.height-.3,target[2]+nz*1.15];
  return <>
    <primitive object={targetObject} position={target}/>
    <mesh position={fixture} rotation={[Math.PI,0,0]} castShadow={false}><cylinderGeometry args={[.055,.082,.16,12]}/><meshStandardMaterial color="#ded3c2" roughness={.72}/></mesh>
    <spotLight position={fixture} target={targetObject} angle={.43} penumbra={.94} intensity={artwork.size && artwork.size[0]>2.2 ? 15 : 10} distance={8} decay={2} color="#fff4e7" castShadow={shadows && artwork.displayType==='sculpture'} shadow-mapSize={[1024,1024]} shadow-bias={-0.00012} shadow-normalBias={0.025} />
  </>;
}

export default function GalleryLighting({ quality = 'high' }: { quality?: 'high'|'medium'|'low' }) {
  const selected = quality === 'low' ? artworks.filter((_,index) => index % 5 === 0) : quality === 'medium' ? artworks.filter((_,index) => index % 2 === 0) : artworks;
  return <>
    <ambientLight intensity={0.34} color="#fff8ef" />
    <hemisphereLight args={['#fff8ee', '#8c7868', quality === 'low' ? 0.46 : 0.58]} />
    <directionalLight position={[-4, 8, 4]} intensity={quality === 'low' ? 0.52 : 0.68} color="#fff4e7" castShadow={quality === 'high'} shadow-mapSize={[1536,1536]} shadow-camera-far={64} shadow-camera-left={-14} shadow-camera-right={14} shadow-camera-top={14} shadow-camera-bottom={-48} shadow-bias={-0.00012} shadow-normalBias={0.025} />
    {selected.map((artwork) => <ArtworkSpotlight key={artwork.id} artwork={artwork} shadows={quality==='high'}/>)}
  </>;
}

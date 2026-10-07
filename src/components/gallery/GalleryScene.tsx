'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import Museum from './Museum';
import Player from './Player';
import GalleryLighting from './GalleryLighting';

export default function GalleryScene() {
  const [active, setActive] = useState(false);
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowHint(false), 6500);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Escape') setActive(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => { window.clearTimeout(timer); window.removeEventListener('keydown', onKeyDown); };
  }, []);

  return <>
    <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 1.65, 8.2], fov: 62, near: 0.1, far: 60 }} onCreated={({ gl }) => { gl.setClearColor('#e8e5df'); }}>
      <Suspense fallback={null}>
        <Museum />
        <GalleryLighting />
        <Player active={active} />
      </Suspense>
    </Canvas>
    <header className="gallery-header"><Link href="/" aria-label="Return to exhibition entry">ARTIST NAME</Link><span>MAIN GALLERY</span></header>
    <div className="gallery-caption"><span>01</span><span>A quiet space for looking.</span></div>
    {!active && <button className="look-button" onClick={() => setActive(true)} aria-label="Begin exploring the gallery">CLICK TO EXPLORE</button>}
    {showHint && <div className={`controls-hint ${active ? 'is-visible' : ''}`} aria-live="polite">WASD to explore <span>·</span> Drag to look</div>}
    {active && <button className="exit-look" onClick={() => setActive(false)} aria-label="Exit gallery controls">ESC <span>to exit controls</span></button>}
  </>;
}

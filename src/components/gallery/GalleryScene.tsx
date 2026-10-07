'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import type { Camera, Quaternion, Vector3 } from 'three';
import { Euler as ThreeEuler, Vector3 as ThreeVector3 } from 'three';
import { gsap } from 'gsap';
import Link from 'next/link';
import { artworks as allArtworks, Artwork } from '@/data/artworks';
import Museum from './Museum';
import Player from './Player';
import GalleryLighting from './GalleryLighting';
import ArtworkCollection from './ArtworkCollection';
import CameraBridge from './CameraBridge';
import ArtworkDetail from '@/components/artwork/ArtworkDetail';
import AboutArtist from '@/components/ui/AboutArtist';
import ArtworkIndex from '@/components/ui/ArtworkIndex';
import MovementPad from '@/components/ui/MovementPad';

export default function GalleryScene() {
  const [active, setActive] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [ready, setReady] = useState(false);
  const [nearby, setNearby] = useState<Artwork | null>(null);
  const [selected, setSelected] = useState<Artwork | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [indexOpen, setIndexOpen] = useState(false);
  const cameraRef = useRef<Camera | null>(null);
  const savedPose = useRef<{ position: Vector3; quaternion: Quaternion } | null>(null);
  const activeTween = useRef<gsap.core.Tween | null>(null);

  const attachCamera = useCallback((camera: Camera | null) => { cameraRef.current = camera; }, []);
  const onNearby = useCallback((artwork: Artwork | null) => setNearby(artwork), []);

  const focusArtwork = useCallback((id: string) => {
    const artwork = allArtworks.find((item) => item.id === id);
    const camera = cameraRef.current;
    if (!artwork || !camera) return;
    activeTween.current?.kill();
    setNearby(null);
    setActive(false);
    setSelected(artwork);
    setDetailVisible(false);
    savedPose.current = { position: camera.position.clone(), quaternion: camera.quaternion.clone() };

    const normal = new ThreeVector3(0, 0, 1).applyEuler(new ThreeEuler(...artwork.rotation)).normalize();
    const target = new ThreeVector3(...artwork.position);
    const destination = target.clone().addScaledVector(normal, 2.65);
    destination.y = artwork.position[1] + 0.08;
    const startPosition = camera.position.clone();
    const startQuaternion = camera.quaternion.clone();
    camera.position.copy(destination);
    camera.lookAt(target);
    const endQuaternion = camera.quaternion.clone();
    camera.position.copy(startPosition);
    camera.quaternion.copy(startQuaternion);
    const progress = { value: 0 };
    activeTween.current = gsap.to(progress, {
      value: 1, duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1.4, ease: 'power3.inOut',
      onUpdate: () => { camera.position.lerpVectors(startPosition, destination, progress.value); camera.quaternion.slerpQuaternions(startQuaternion, endQuaternion, progress.value); },
      onComplete: () => setDetailVisible(true),
    });
  }, []);

  const returnToGallery = useCallback(() => {
    const camera = cameraRef.current;
    const pose = savedPose.current;
    if (!camera || !pose) { setSelected(null); setDetailVisible(false); setActive(true); return; }
    activeTween.current?.kill();
    setAboutOpen(false);
    setDetailVisible(false);
    const startPosition = camera.position.clone();
    const startQuaternion = camera.quaternion.clone();
    const progress = { value: 0 };
    activeTween.current = gsap.to(progress, {
      value: 1, duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1.1, ease: 'power2.inOut',
      onUpdate: () => { camera.position.lerpVectors(startPosition, pose.position, progress.value); camera.quaternion.slerpQuaternions(startQuaternion, pose.quaternion, progress.value); },
      onComplete: () => { savedPose.current = null; setSelected(null); setActive(true); },
    });
  }, []);

  useEffect(() => {
    if (active) setShowHint(true);
    const timer = active ? window.setTimeout(() => setShowHint(false), 7000) : null;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'KeyE' && active && nearby && !selected) { focusArtwork(nearby.id); return; }
      if (event.code !== 'Escape') return;
      if (indexOpen) setIndexOpen(false);
      else if (aboutOpen) setAboutOpen(false);
      else if (selected) returnToGallery();
      else setActive(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => { if (timer) window.clearTimeout(timer); window.removeEventListener('keydown', onKeyDown); };
  }, [aboutOpen, active, focusArtwork, indexOpen, nearby, returnToGallery, selected]);

  useEffect(() => () => { activeTween.current?.kill(); }, []);

  const movementKey = (code: string, isDown: boolean) => window.dispatchEvent(new KeyboardEvent(isDown ? 'keydown' : 'keyup', { code, bubbles: true }));

  return <>
    <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 1.65, 8.2], fov: 62, near: 0.1, far: 60 }} onCreated={({ gl }) => { gl.setClearColor('#e8e5df'); setReady(true); }}>
      <Suspense fallback={null}>
        <Museum />
        <GalleryLighting />
        <CameraBridge onCamera={attachCamera} />
        <ArtworkCollection items={allArtworks} onSelect={focusArtwork} />
        <Player active={active && !selected} artworks={allArtworks} onNearby={onNearby} />
      </Suspense>
    </Canvas>
    {!ready && <div className="gallery-loading" role="status"><span>ARTIST NAME</span><p>Preparing the exhibition…</p></div>}
    <header className="gallery-header"><Link href="/" aria-label="Return to exhibition entry">ARTIST NAME</Link><span>MAIN GALLERY</span><button className="about-link" onClick={() => { setActive(false); setIndexOpen(true); }}>INDEX</button><button className="about-link" onClick={() => { setActive(false); setAboutOpen(true); }}>ABOUT</button></header>
    <div className="gallery-caption"><span>01</span><span>A quiet space for looking.</span></div>
    {!active && !selected && !aboutOpen && !indexOpen && <button className="look-button" onClick={() => setActive(true)} aria-label="Begin exploring the gallery">CLICK TO EXPLORE</button>}
    {showHint && active && !selected && <div className="controls-hint is-visible" aria-live="polite">WASD to explore <span>·</span> Drag to look</div>}
    {active && !selected && <button className="exit-look" onClick={() => setActive(false)} aria-label="Exit gallery controls">ESC <span>to pause</span></button>}
    {active && !selected && <MovementPad onMove={movementKey} />}
    {nearby && active && !selected && <div className="artwork-prompt"><div><span>NEARBY WORK</span><p>{nearby.title}</p></div><button onClick={() => focusArtwork(nearby.id)}>VIEW ARTWORK <span className="key-hint">E</span><span aria-hidden="true">↗</span></button></div>}
    {selected && detailVisible && <ArtworkDetail artwork={selected} onReturn={returnToGallery} />}
    {indexOpen && <ArtworkIndex items={allArtworks} onClose={() => setIndexOpen(false)} onSelect={(id) => { setIndexOpen(false); focusArtwork(id); }} />}
    {aboutOpen && <AboutArtist onClose={() => setAboutOpen(false)} />}
  </>;
}

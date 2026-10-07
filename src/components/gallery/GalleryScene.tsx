'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Camera } from 'three';
import { ACESFilmicToneMapping, Euler, PCFSoftShadowMap, SRGBColorSpace, Vector3 } from 'three';
import { gsap } from 'gsap';
import Link from 'next/link';
import { artworks as allArtworks, Artwork } from '@/data/artworks';
import Museum from './Museum';
import GalleryLighting from './GalleryLighting';
import ArtworkCollection from './ArtworkCollection';
import CameraBridge from './CameraBridge';
import ArtworkDetail from '@/components/artwork/ArtworkDetail';
import AboutArtist from '@/components/ui/AboutArtist';
import ArtworkIndex from '@/components/ui/ArtworkIndex';
import { ARTIST } from '@/data/artist';

const sectionNames: Record<string, string> = {
  'main-gallery': 'THE EXHIBITION', 'nature-gallery': 'NATURE & LANDSCAPE',
  'portrait-gallery': 'FIGURE & PORTRAIT', 'illustration-gallery': 'ILLUSTRATION & DESIGN',
  'kawaii-gallery': 'ILLUSTRATION & DESIGN', 'sculpture-gallery': 'EXPERIMENTAL WORKS',
};
const sectionOrder = ['main-gallery', 'nature-gallery', 'portrait-gallery', 'illustration-gallery', 'kawaii-gallery', 'sculpture-gallery'];

function sectionRank(room: string) { const rank = sectionOrder.indexOf(room); return rank < 0 ? sectionOrder.length : rank; }

export default function GalleryScene() {
  const [ready, setReady] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [introOpen, setIntroOpen] = useState(true);
  const [selected, setSelected] = useState<Artwork | null>(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [indexOpen, setIndexOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [quality, setQuality] = useState<'high'|'medium'|'low'>('high');
  const [reducedMotion, setReducedMotion] = useState(false);
  const cameraRef = useRef<Camera | null>(null);
  const activeTween = useRef<gsap.core.Tween | null>(null);
  const indexScrollTop = useRef(0);
  const autoModeStarted = useRef(false);
  const [tourMode, setTourMode] = useState<'guided'|'explore'>('explore');

  const stops = useMemo(() => [...allArtworks].sort((a,b) => sectionRank(a.room)-sectionRank(b.room) || allArtworks.indexOf(a)-allArtworks.indexOf(b)), []);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 1023px)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const setQualityForDevice = () => {
      const cores = navigator.hardwareConcurrency || 4;
      const memory = (navigator as Navigator & {deviceMemory?:number}).deviceMemory || 4;
      setQuality(window.innerWidth < 700 || cores <= 4 || memory <= 4 ? 'low' : media.matches ? 'medium' : 'high');
    };
    const updateMotion = () => setReducedMotion(reduced.matches);
    setQualityForDevice(); updateMotion();
    media.addEventListener('change', setQualityForDevice); reduced.addEventListener('change', updateMotion);
    const mode = new URLSearchParams(window.location.search).get('mode');
    if (mode === 'tour') { setTourMode('guided'); setIntroOpen(false); }
    if (mode === 'explore') { setTourMode('explore'); setIntroOpen(false); }
    if (mode === 'index') { setIntroOpen(false); setIndexOpen(true); }
    return () => { media.removeEventListener('change', setQualityForDevice); reduced.removeEventListener('change', updateMotion); };
  }, []);

  const attachCamera = useCallback((camera: Camera | null) => { cameraRef.current = camera; }, []);
  const moveToStop = useCallback((index: number) => {
    const camera = cameraRef.current;
    const artwork = stops[index];
    if (!camera || !artwork) return;
    activeTween.current?.kill();
    const normal = new Vector3(0, 0, 1).applyEuler(new Euler(...artwork.rotation)).normalize();
    const target = new Vector3(...artwork.position);
    const destination = artwork.displayType === 'sculpture'
      ? new Vector3(0, 1.85, -40.3)
      : target.clone().addScaledVector(normal, 3.55);
    if (artwork.displayType === 'sculpture') target.y = 2.55;
    if (artwork.displayType !== 'sculpture') destination.y = artwork.position[1] + 0.12;
    const fromPosition = camera.position.clone();
    const fromQuaternion = camera.quaternion.clone();
    const targetQuaternion = camera.quaternion.clone();
    camera.position.copy(destination); camera.lookAt(target); targetQuaternion.copy(camera.quaternion);
    camera.position.copy(fromPosition); camera.quaternion.copy(fromQuaternion);
    const distance = fromPosition.distanceTo(destination);
    const progress = {value:0};
    setCurrentIndex(index);
    activeTween.current = gsap.to(progress, {
      value:1, duration: reducedMotion ? 0.15 : Math.min(3, Math.max(1.5, distance * 0.24)), ease:'power2.inOut',
      onUpdate:() => { camera.position.lerpVectors(fromPosition,destination,progress.value); camera.quaternion.slerpQuaternions(fromQuaternion,targetQuaternion,progress.value); },
      onComplete:() => { camera.position.copy(destination); camera.lookAt(target); },
    });
  }, [reducedMotion, stops]);

  const startExhibition = useCallback((mode: 'guided'|'explore') => {
    setTourMode(mode); setIntroOpen(false); moveToStop(0);
  }, [moveToStop]);

  const returnToEntrance = useCallback(() => {
    const camera = cameraRef.current;
    if (!camera) { setCurrentIndex(-1); setIntroOpen(true); return; }
    activeTween.current?.kill();
    const fromPosition = camera.position.clone();
    const fromQuaternion = camera.quaternion.clone();
    const destination = new Vector3(0,1.65,8.2);
    const target = new Vector3(0,2.8,.8);
    camera.position.copy(destination); camera.lookAt(target); const targetQuaternion = camera.quaternion.clone();
    camera.position.copy(fromPosition); camera.quaternion.copy(fromQuaternion);
    const progress={value:0};
    activeTween.current=gsap.to(progress,{value:1,duration:reducedMotion ? .15 : 2,ease:'power2.inOut',onUpdate:()=>{camera.position.lerpVectors(fromPosition,destination,progress.value);camera.quaternion.slerpQuaternions(fromQuaternion,targetQuaternion,progress.value);},onComplete:()=>{setCurrentIndex(-1);setIntroOpen(true);}});
  },[reducedMotion]);

  useEffect(() => {
    const mode = new URLSearchParams(window.location.search).get('mode');
    if ((mode === 'tour' || mode === 'explore') && currentIndex < 0 && ready && !autoModeStarted.current) { autoModeStarted.current=true; moveToStop(0); }
  }, [currentIndex, moveToStop, ready]);

  const openArtwork = useCallback((artwork: Artwork) => setSelected(artwork), []);
  const closeArtwork = useCallback(() => setSelected(null), []);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' && currentIndex >= 0 && !selected && !indexOpen && !aboutOpen) moveToStop(Math.max(0,currentIndex-1));
      if (event.key === 'ArrowRight' && currentIndex >= 0 && !selected && !indexOpen && !aboutOpen) moveToStop(Math.min(stops.length-1,currentIndex+1));
      if (event.key === 'Escape') {
        if (menuOpen) setMenuOpen(false); else if (indexOpen) setIndexOpen(false); else if (aboutOpen) setAboutOpen(false); else if (selected) closeArtwork(); else if (!introOpen) setIntroOpen(true);
      }
    };
    window.addEventListener('keydown',onKeyDown); return () => window.removeEventListener('keydown',onKeyDown);
  }, [aboutOpen, closeArtwork, currentIndex, indexOpen, introOpen, menuOpen, moveToStop, selected, stops.length]);
  useEffect(() => () => { activeTween.current?.kill(); }, []);

  const current = currentIndex >= 0 ? stops[currentIndex] : null;
  const startCamera = [0, 1.65, 8.2] as [number,number,number];
  const shadows = quality === 'high';
  return <>
    <Canvas shadows={shadows} dpr={quality === 'low' ? [1,1.15] : quality === 'medium' ? [1,1.35] : [1,1.5]} camera={{ position:startCamera, fov:quality === 'low' ? 66 : 62, near:.1, far:85 }} onCreated={({gl}) => { gl.setClearColor('#fff8ee'); gl.toneMapping = ACESFilmicToneMapping; gl.toneMappingExposure = 1.0; gl.outputColorSpace = SRGBColorSpace; gl.shadowMap.type = PCFSoftShadowMap; setReady(true); }}>
      <Suspense fallback={null}><Museum/><GalleryLighting quality={quality}/><CameraBridge onCamera={attachCamera}/><ArtworkCollection items={allArtworks} onSelect={(id) => { const index = stops.findIndex((item) => item.id === id); if (index >= 0) moveToStop(index); }}/></Suspense>
    </Canvas>
    {!ready && <div className="gallery-loading" role="status"><span>{ARTIST.name.toUpperCase()}</span><p>Preparing the exhibition…</p></div>}
    <header className="gallery-header"><Link href="/" aria-label="Return to exhibition entry">{ARTIST.name.toUpperCase()}</Link><span className="gallery-section-name">{current ? sectionNames[current.room] : 'SELECTED WORKS'}</span><nav className="desktop-gallery-nav" aria-label="Gallery navigation"><button className="about-link" onClick={() => { setMenuOpen(false); indexScrollTop.current=0; setIndexOpen(true); }}>INDEX</button><button className="about-link" onClick={() => { setMenuOpen(false); setAboutOpen(true); }}>ABOUT</button></nav><button className="mobile-menu-toggle" aria-expanded={menuOpen} aria-label={menuOpen ? 'Close gallery menu' : 'Open gallery menu'} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? 'CLOSE ×' : 'MENU ☰'}</button></header>
    {menuOpen && <nav className="mobile-gallery-nav" aria-label="Gallery navigation"><button onClick={() => { setMenuOpen(false); indexScrollTop.current=0; setIndexOpen(true); }}>INDEX</button><button onClick={() => { setMenuOpen(false); setAboutOpen(true); }}>ABOUT</button></nav>}
    {current && !introOpen && !selected && !indexOpen && !aboutOpen && <section className="tour-panel" aria-live="polite">
      <div className="tour-meta"><span>{String(currentIndex+1).padStart(2,'0')} / {String(stops.length).padStart(2,'0')}</span><span>{sectionNames[current.room] ?? 'SELECTED WORKS'}</span></div>
      <h1>{current.title}</h1><p>{current.year} <span>·</span> {current.medium}</p>
      <div className="tour-actions"><button disabled={currentIndex===0} onClick={() => moveToStop(currentIndex-1)}>← PREVIOUS</button><button className="view-artwork" onClick={() => openArtwork(current)}>VIEW ARTWORK ↗</button><button disabled={currentIndex===stops.length-1} onClick={() => moveToStop(currentIndex+1)}>{currentIndex===stops.length-1 ? 'END OF EXHIBITION' : tourMode==='guided' ? 'CONTINUE →' : 'NEXT →'}</button></div>
      {currentIndex===stops.length-1 && <><p className="tour-farewell">End of exhibition · Thank you for visiting.</p><div className="tour-end-actions"><button onClick={returnToEntrance}>RETURN TO ENTRANCE</button><button onClick={() => setIndexOpen(true)}>VIEW ALL WORKS</button><button onClick={() => setAboutOpen(true)}>ABOUT KASIH ARISSA</button></div></>}
    </section>}
    {introOpen && <section className="tour-intro"><p className="eyebrow">A DIGITAL EXHIBITION</p><h1>{ARTIST.name}</h1><p className="intro-subtitle">SELECTED WORKS</p><div className="intro-actions"><button onClick={() => startExhibition('guided')}>START GUIDED TOUR <span>↗</span></button><button onClick={() => startExhibition('explore')}>EXPLORE EXHIBITION <span>↗</span></button><button onClick={() => { setIntroOpen(false); setIndexOpen(true); }}>INDEX <span>↗</span></button></div></section>}
    {selected && <ArtworkDetail artwork={selected} onReturn={closeArtwork}/>}
    {indexOpen && <ArtworkIndex items={allArtworks} initialScrollTop={indexScrollTop.current} onScrollPosition={(top) => { indexScrollTop.current=top; }} onClose={() => setIndexOpen(false)} onSelect={(id) => { const index=stops.findIndex((item)=>item.id===id); setIndexOpen(false); if(index>=0) moveToStop(index); }}/ >}
    {aboutOpen && <AboutArtist onClose={() => setAboutOpen(false)}/>}
  </>;
}

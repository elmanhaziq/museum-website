'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Camera, PerspectiveCamera } from 'three';
import { ACESFilmicToneMapping, Euler, MathUtils, PCFSoftShadowMap, SRGBColorSpace, Vector3 } from 'three';
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
import { ArrowIcon, CloseIcon, MenuIcon } from '@/components/ui/Icon';

const sectionNames: Record<string, string> = {
  'main-gallery': 'THE EXHIBITION', 'nature-gallery': 'NATURE & LANDSCAPE',
  'portrait-gallery': 'FIGURE & PORTRAIT', 'illustration-gallery': 'ILLUSTRATION & DESIGN',
  'kawaii-gallery': 'ILLUSTRATION & DESIGN', 'sculpture-gallery': 'EXPERIMENTAL WORKS',
};
const sectionOrder = ['main-gallery', 'nature-gallery', 'portrait-gallery', 'illustration-gallery', 'kawaii-gallery', 'sculpture-gallery'];

function sectionRank(room: string) { const rank = sectionOrder.indexOf(room); return rank < 0 ? sectionOrder.length : rank; }

// Distance and vertical shift that keep a wall work fully visible inside the part of the
// viewport not covered by the header and tour panel, for any screen aspect ratio.
function frameWallArtwork(camera: Camera, artwork: Artwork) {
  const perspective = camera as PerspectiveCamera;
  const aspect = artwork.imageAspectRatio ?? 0.75;
  const height = artwork.size?.[1] ?? Math.min(1.62, 1.95 / aspect);
  const width = artwork.size?.[0] ?? height * aspect;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const short = vh < 520;
  const narrow = vw < 761;
  const panel = document.querySelector<HTMLElement>('.tour-panel')?.getBoundingClientRect();
  const panelReserve = panel && panel.width > vw * 0.6 ? vh - panel.top + 12 : null;
  const top = (short ? 48 : narrow ? 64 : 76) / vh;
  const bottom = short ? 0.1 : (panelReserve ?? (narrow ? 236 : 184)) / vh;
  const usableV = Math.max(0.35, 1 - top - bottom);
  const usableH = short ? 0.62 : narrow ? 0.86 : 0.8;
  const tanV = Math.tan(MathUtils.degToRad(perspective.fov ?? 62) / 2);
  const tanH = tanV * (perspective.aspect ?? vw / vh);
  const fitV = (height + 0.45) / (2 * tanV * usableV);
  const fitH = width / (2 * tanH * usableH);
  const distance = MathUtils.clamp(Math.max(fitV, fitH), 3.55, 8);
  return { distance, lift: (bottom - top) * distance * tanV };
}

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
  const moveToStop = useCallback((index: number, quick = false) => {
    const camera = cameraRef.current;
    const artwork = stops[index];
    if (!camera || !artwork) return;
    activeTween.current?.kill();
    const normal = new Vector3(0, 0, 1).applyEuler(new Euler(...artwork.rotation)).normalize();
    const target = new Vector3(...artwork.position);
    let destination: Vector3;
    if (artwork.displayType === 'sculpture') {
      destination = new Vector3(0, 1.85, -40.3);
      target.y = 2.55;
    } else {
      const { distance, lift } = frameWallArtwork(camera, artwork);
      destination = target.clone().addScaledVector(normal, distance);
      const eyeY = Math.max(1.15, artwork.position[1] + 0.12 - lift);
      target.y = eyeY - 0.12;
      destination.y = eyeY;
    }
    const fromPosition = camera.position.clone();
    const fromQuaternion = camera.quaternion.clone();
    const targetQuaternion = camera.quaternion.clone();
    camera.position.copy(destination); camera.lookAt(target); targetQuaternion.copy(camera.quaternion);
    camera.position.copy(fromPosition); camera.quaternion.copy(fromQuaternion);
    const distance = fromPosition.distanceTo(destination);
    const progress = {value:0};
    setCurrentIndex(index);
    activeTween.current = gsap.to(progress, {
      value:1, duration: reducedMotion ? 0.15 : quick ? 0.45 : Math.min(3, Math.max(1.5, distance * 0.24)), ease:'power2.inOut',
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

  // Re-frame the current work when the viewport changes (rotation, window resize).
  useEffect(() => {
    if (currentIndex < 0) return;
    let timer = 0;
    const onResize = () => { window.clearTimeout(timer); timer = window.setTimeout(() => moveToStop(currentIndex, true), 220); };
    window.addEventListener('resize', onResize);
    return () => { window.clearTimeout(timer); window.removeEventListener('resize', onResize); };
  }, [currentIndex, moveToStop]);

  const current = currentIndex >= 0 ? stops[currentIndex] : null;
  const isLast = currentIndex === stops.length - 1;
  const openIndex = () => { setMenuOpen(false); indexScrollTop.current = 0; setIndexOpen(true); };
  const openAbout = () => { setMenuOpen(false); setAboutOpen(true); };
  const startCamera = [0, 1.65, 8.2] as [number,number,number];
  const shadows = quality === 'high';
  return <>
    <Canvas shadows={shadows} dpr={quality === 'low' ? [1,1.15] : quality === 'medium' ? [1,1.35] : [1,1.5]} camera={{ position:startCamera, fov:quality === 'low' ? 66 : 62, near:.1, far:85 }} onCreated={({gl}) => { gl.setClearColor('#fff8ee'); gl.toneMapping = ACESFilmicToneMapping; gl.toneMappingExposure = 1.0; gl.outputColorSpace = SRGBColorSpace; gl.shadowMap.type = PCFSoftShadowMap; setReady(true); }}>
      <Suspense fallback={null}><Museum/><GalleryLighting quality={quality}/><CameraBridge onCamera={attachCamera}/><ArtworkCollection items={allArtworks} onSelect={(id) => { const index = stops.findIndex((item) => item.id === id); if (index >= 0) moveToStop(index); }}/></Suspense>
    </Canvas>
    {!ready && <div className="gallery-loading" role="status"><span>{ARTIST.name.toUpperCase()}</span><p>Preparing the exhibition…</p></div>}
    <header className="gallery-header">
      <Link href="/" className="gallery-home" aria-label="Kasih Arissa, return to exhibition entry">{ARTIST.name.toUpperCase()}</Link>
      <span className="gallery-section-name">{current ? sectionNames[current.room] : 'SELECTED WORKS'}</span>
      <nav className="desktop-gallery-nav" aria-label="Gallery navigation">
        <button className="about-link" onClick={openIndex}>INDEX</button>
        <button className="about-link" onClick={openAbout}>ABOUT</button>
      </nav>
      <button className="mobile-menu-toggle" aria-expanded={menuOpen} aria-controls="mobile-gallery-nav" aria-label={menuOpen ? 'Close gallery menu' : 'Open gallery menu'} onClick={() => setMenuOpen((open) => !open)}>
        <span>{menuOpen ? 'CLOSE' : 'MENU'}</span>{menuOpen ? <CloseIcon /> : <MenuIcon />}
      </button>
    </header>
    {menuOpen && <nav id="mobile-gallery-nav" className="mobile-gallery-nav" aria-label="Gallery navigation"><button onClick={openIndex}>INDEX</button><button onClick={openAbout}>ABOUT</button></nav>}
    {current && !introOpen && !selected && !indexOpen && !aboutOpen && <section className="tour-panel" aria-label={tourMode === 'guided' ? 'Guided tour' : 'Exhibition'}>
      <div className="tour-meta"><span className="tour-count">{String(currentIndex+1).padStart(2,'0')} <i>/</i> {String(stops.length).padStart(2,'0')}</span><span>{sectionNames[current.room] ?? 'SELECTED WORKS'}</span></div>
      <div className="tour-progress" aria-hidden="true"><span style={{ transform: `scaleX(${(currentIndex+1)/stops.length})` }} /></div>
      <div className="tour-caption" aria-live="polite" aria-atomic="true"><h2>{current.title}</h2><p>{current.year} <span>·</span> {current.medium}</p></div>
      <div className="tour-actions">
        <button className="tour-step tour-prev" disabled={currentIndex===0} onClick={() => moveToStop(currentIndex-1)} aria-label="Previous artwork"><ArrowIcon direction="left" /><span>PREVIOUS</span></button>
        <button className="view-artwork" onClick={() => openArtwork(current)}><span>VIEW ARTWORK</span><ArrowIcon direction="up-right" /></button>
        {isLast
          ? <span className="tour-step tour-next tour-end-label">END</span>
          : <button className="tour-step tour-next" onClick={() => moveToStop(currentIndex+1)} aria-label={tourMode==='guided' ? 'Continue to next artwork' : 'Next artwork'}><span>{tourMode==='guided' ? 'CONTINUE' : 'NEXT'}</span><ArrowIcon direction="right" /></button>}
      </div>
      {isLast && <><p className="tour-farewell">End of exhibition · Thank you for visiting.</p><div className="tour-end-actions"><button onClick={returnToEntrance}>RETURN TO ENTRANCE</button><button onClick={openIndex}>VIEW ALL WORKS</button><button onClick={openAbout}>ABOUT THE ARTIST</button></div></>}
    </section>}
    {introOpen && <section className="tour-intro" aria-labelledby="tour-intro-title"><p className="eyebrow">A DIGITAL EXHIBITION</p><h1 id="tour-intro-title">{ARTIST.name}</h1><p className="intro-subtitle">SELECTED WORKS</p><div className="intro-actions"><button onClick={() => startExhibition('guided')}><span>START GUIDED TOUR</span><ArrowIcon direction="up-right" /></button><button onClick={() => startExhibition('explore')}><span>EXPLORE EXHIBITION</span><ArrowIcon direction="up-right" /></button><button onClick={() => { setIntroOpen(false); setIndexOpen(true); }}><span>INDEX</span><ArrowIcon direction="up-right" /></button></div></section>}
    {selected && <ArtworkDetail artwork={selected} onReturn={closeArtwork}/>}
    {indexOpen && <ArtworkIndex items={allArtworks} initialScrollTop={indexScrollTop.current} onScrollPosition={(top) => { indexScrollTop.current=top; }} onClose={() => setIndexOpen(false)} onSelect={(id) => { const index=stops.findIndex((item)=>item.id===id); setIndexOpen(false); if(index>=0) moveToStop(index); }}/ >}
    {aboutOpen && <AboutArtist onClose={() => setAboutOpen(false)}/>}
  </>;
}

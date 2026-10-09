import React, { Component, ReactNode, Suspense, useMemo } from 'react';
import { Gltf } from '@react-three/drei';
import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three';
import { GALLERY, MUSEUM_MODEL_URL } from '@/lib/constants';
import { MUSEUM_WALLS } from '@/lib/gallery-layout';

function Box({ position, size, color, roughness = 0.88 }: { position: [number,number,number]; size: [number,number,number]; color: string; roughness?: number }) {
  return <mesh position={position} receiveShadow castShadow><boxGeometry args={size}/><meshStandardMaterial color={color} roughness={roughness}/></mesh>;
}

function MuseumBench({ position, rotation = 0 }: { position:[number,number,number]; rotation?:number }) {
  return <group position={position} rotation={[0,rotation,0]}>
    <Box position={[0,.18,0]} size={[2.3,.32,.68]} color="#9a6f4f" roughness={.84}/>
    <Box position={[0,.4,0]} size={[2.42,.12,.76]} color="#f47f9b" roughness={.78}/>
  </group>;
}

function ProceduralMuseum() {
  const {width,depth,height,wallThickness}=GALLERY;
  const centerZ=GALLERY.centerZ;
  const front=centerZ+depth/2;
  const back=centerZ-depth/2;
  const floorTexture=useMemo(()=>{
    if(typeof document==='undefined') return null;
    const canvas=document.createElement('canvas'); canvas.width=1024; canvas.height=1024;
    const ctx=canvas.getContext('2d');
    if(ctx){
      ctx.fillStyle='#927052'; ctx.fillRect(0,0,1024,1024);
      const boardHeight=256, boardWidth=128;
      for(let row=0;row<4;row++) for(let col=0;col<8;col++){
        const x=col*boardWidth, y=row*boardHeight;
        const tones=['#9a7655','#a17c5a','#927052','#a58260'];
        ctx.fillStyle=tones[(row*3+col)%tones.length]; ctx.fillRect(x+2,y+2,boardWidth-4,boardHeight-4);
        const grain=ctx.createLinearGradient(x,y,x+boardWidth,y+boardHeight);
        grain.addColorStop(0,'rgba(255,235,205,.035)'); grain.addColorStop(.5,'rgba(53,31,17,.05)'); grain.addColorStop(1,'rgba(255,235,205,.025)');
        ctx.fillStyle=grain; ctx.fillRect(x+3,y+3,boardWidth-6,boardHeight-6);
        for(let line=0;line<10;line++){
          const xx=x+12+line*11;
          ctx.beginPath(); ctx.moveTo(xx,y+6); ctx.bezierCurveTo(xx-4,y+60,xx+5,y+170,xx-2,y+250);
          ctx.strokeStyle=line%3===0?'rgba(58,37,23,.075)':'rgba(240,215,185,.07)'; ctx.lineWidth=line%3===0?1.5:.8; ctx.stroke();
        }
      }
    }
    const texture=new CanvasTexture(canvas); texture.colorSpace=SRGBColorSpace;
    texture.wrapS=RepeatWrapping; texture.wrapT=RepeatWrapping; texture.repeat.set(2,5); return texture;
  },[]);

  return <group>
    {/* Natural oak boards with a matte finish; walls meet the floor at y=0. */}
    <mesh position={[0,-.12,centerZ]} receiveShadow><boxGeometry args={[width,.24,depth]}/><meshStandardMaterial map={floorTexture??undefined} roughness={.52} metalness={0} envMapIntensity={.45}/></mesh>
    <mesh position={[0,height,centerZ]}><boxGeometry args={[width,.18,depth]}/><meshStandardMaterial color="#fff8e8" roughness={.96}/></mesh>
    <mesh position={[0,height/2,front]} castShadow receiveShadow><boxGeometry args={[width,height,wallThickness]}/><meshStandardMaterial color="#f5b4c4" roughness={.88}/></mesh>
    <mesh position={[0,height/2,back]} castShadow receiveShadow><boxGeometry args={[width,height,wallThickness]}/><meshStandardMaterial color="#fff8e8" roughness={.88}/></mesh>
    {MUSEUM_WALLS.map((wall)=><mesh key={wall.id} position={wall.position} rotation={wall.rotation} castShadow receiveShadow>
      <boxGeometry args={[wall.width,wall.height,wall.depth]}/><meshStandardMaterial color={wall.color} roughness={.88}/>
    </mesh>)}
    {/* Painted skirting boards where walls meet the floor */}
    {MUSEUM_WALLS.map((wall)=><mesh key={`skirting-${wall.id}`} position={[wall.position[0],.055,wall.position[2]]} rotation={wall.rotation} receiveShadow>
      <boxGeometry args={[wall.width,.11,wall.depth+.03]}/><meshStandardMaterial color="#f2eadb" roughness={.6}/>
    </mesh>)}
    {[front,back].map((z)=><mesh key={`skirting-${z}`} position={[0,.055,z]} receiveShadow><boxGeometry args={[width,.11,wallThickness+.03]}/><meshStandardMaterial color="#f2eadb" roughness={.6}/></mesh>)}
    {/* Ceiling track rails */}
    {[-8,-2.7,2.7,8].map((x)=><Box key={`rail-${x}`} position={[x,height-.17,centerZ]} size={[.045,.06,depth-1.2]} color="#786e62"/>)}
    {[-38,-28,-18,-7,5].map((z)=><Box key={`cross-rail-${z}`} position={[0,height-.17,z]} size={[width-1.3,.055,.045]} color="#786e62"/>)}
    <MuseumBench position={[0,0,2.6]}/>
    <MuseumBench position={[0,0,-17.9]} rotation={Math.PI/2}/>
    <MuseumBench position={[-2.5,0,-37.2]} rotation={Math.PI/2}/>
  </group>;
}

class MuseumModelBoundary extends Component<{children:ReactNode},{failed:boolean}> {
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  componentDidCatch(error:Error){console.error('Museum model failed to load; using the procedural gallery.',error);}
  render(){return this.state.failed?<ProceduralMuseum/>:this.props.children;}
}

export default function Museum(){
  if(!MUSEUM_MODEL_URL) return <ProceduralMuseum/>;
  return <MuseumModelBoundary><Suspense fallback={<ProceduralMuseum/>}><Gltf src={MUSEUM_MODEL_URL} castShadow receiveShadow/></Suspense></MuseumModelBoundary>;
}

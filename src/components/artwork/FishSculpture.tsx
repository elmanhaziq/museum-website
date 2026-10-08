'use client';

import { useLayoutEffect, useMemo, useRef } from 'react';
import { Color, DoubleSide, InstancedMesh, Matrix4, Object3D, PlaneGeometry, Quaternion, Vector3 } from 'three';

// Procedural model of Kasih Arissa's "Underwater Assemblage": a round fish covered in
// silver spoon scales (head) and painted scales (body), with corrugated cardboard fins,
// paper seaweed, coral tubes and pinecone flowers on a crumpled foil base.
// Repeated parts (scales, petals) are instanced so the whole piece stays a few draw calls.

const BODY = { a: 0.5, b: 0.44, c: 0.34 }; // ellipsoid radii: length (x, head at -x), height, depth
const SCALE_COLORS = ['#e23d5b', '#f27da0', '#f3982b', '#f4d23e', '#2e8c4c', '#46b0a4', '#3b7fd4', '#f6a9c3', '#e5542d', '#8fcf5a'];

function seeded(index: number) {
  const x = Math.sin(index * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function bodyPoint(phi: number, theta: number, lift = 0) {
  const { a, b, c } = BODY;
  const point = new Vector3(a * Math.cos(phi), b * Math.sin(phi) * Math.cos(theta), c * Math.sin(phi) * Math.sin(theta));
  const normal = new Vector3(point.x / (a * a), point.y / (b * b), point.z / (c * c)).normalize();
  return { point: point.addScaledVector(normal, lift), normal };
}

function Scales() {
  const silverRef = useRef<InstancedMesh>(null);
  const colourRef = useRef<InstancedMesh>(null);
  const layout = useMemo(() => {
    const silver: Matrix4[] = [];
    const colour: { matrix: Matrix4; color: Color }[] = [];
    const dummy = new Object3D();
    const forward = new Vector3(0, 0, 1);
    let index = 0;
    for (let row = 1; row < 15; row++) {
      const phi = (row / 15) * Math.PI;
      const ring = Math.max(6, Math.round(26 * Math.sin(phi)));
      for (let step = 0; step < ring; step++) {
        const theta = (step / ring) * Math.PI * 2 + (row % 2 ? Math.PI / ring : 0);
        const { point, normal } = bodyPoint(phi, theta, 0.012);
        dummy.position.copy(point);
        dummy.quaternion.copy(new Quaternion().setFromUnitVectors(forward, normal));
        const isHead = point.x < -0.1 || (point.y > 0.3 && point.x < 0.12);
        dummy.scale.set(isHead ? 0.07 : 0.06, isHead ? 0.085 : 0.075, 0.03);
        dummy.updateMatrix();
        if (isHead) silver.push(dummy.matrix.clone());
        else colour.push({ matrix: dummy.matrix.clone(), color: new Color(SCALE_COLORS[Math.floor(seeded(index) * SCALE_COLORS.length)]) });
        index++;
      }
    }
    return { silver, colour };
  }, []);

  useLayoutEffect(() => {
    layout.silver.forEach((matrix, i) => silverRef.current?.setMatrixAt(i, matrix));
    layout.colour.forEach(({ matrix, color }, i) => { colourRef.current?.setMatrixAt(i, matrix); colourRef.current?.setColorAt(i, color); });
    if (silverRef.current) silverRef.current.instanceMatrix.needsUpdate = true;
    if (colourRef.current) {
      colourRef.current.instanceMatrix.needsUpdate = true;
      if (colourRef.current.instanceColor) colourRef.current.instanceColor.needsUpdate = true;
    }
  }, [layout]);

  return <>
    <instancedMesh ref={silverRef} args={[undefined, undefined, layout.silver.length]} castShadow>
      <sphereGeometry args={[1, 12, 8]} />
      <meshStandardMaterial color="#d4d7dc" metalness={0.35} roughness={0.3} />
    </instancedMesh>
    <instancedMesh ref={colourRef} args={[undefined, undefined, layout.colour.length]} castShadow>
      <sphereGeometry args={[1, 12, 8]} />
      <meshStandardMaterial roughness={0.32} metalness={0.05} />
    </instancedMesh>
  </>;
}

// Corrugated cardboard fan: alternating light/dark wedges.
function Fan({ radius, start, length, wedges = 9, light = '#dccaa5', dark = '#bca57e', opacity = 1 }: { radius: number; start: number; length: number; wedges?: number; light?: string; dark?: string; opacity?: number }) {
  const step = length / wedges;
  return <group>
    {Array.from({ length: wedges }, (_, i) => <mesh key={i}>
      <circleGeometry args={[radius, 3, start + i * step, step]} />
      <meshStandardMaterial color={i % 2 ? dark : light} roughness={0.9} side={DoubleSide} transparent={opacity < 1} opacity={opacity} />
    </mesh>)}
  </group>;
}

function Fish() {
  const eye = bodyPoint(2.42, 1.05, 0.02);
  return <group>
    <mesh scale={[BODY.a * 0.97, BODY.b * 0.97, BODY.c * 0.97]} castShadow><sphereGeometry args={[1, 32, 20]} /><meshStandardMaterial color="#c9c3b8" roughness={0.6} /></mesh>
    <Scales />
    {/* Eye */}
    <group position={eye.point}>
      <mesh><sphereGeometry args={[0.062, 20, 14]} /><meshStandardMaterial color="#161614" roughness={0.18} /></mesh>
      <mesh position={[0.018, 0.022, 0.05]}><sphereGeometry args={[0.016, 10, 8]} /><meshBasicMaterial color="#ffffff" /></mesh>
    </group>
    {/* Tail, dorsal and pectoral fins */}
    <group position={[BODY.a - 0.04, 0, 0]}><Fan radius={0.42} start={-0.75} length={1.5} wedges={11} /></group>
    <group position={[-0.02, BODY.b - 0.08, -0.12]} rotation={[-0.25, 0, 0.35]}><Fan radius={0.36} start={Math.PI / 2 - 0.2} length={1.35} wedges={10} /></group>
    <group position={[0.12, -0.06, BODY.c + 0.02]} rotation={[0.1, -0.35, 0]}><Fan radius={0.3} start={-0.95} length={1.05} wedges={8} light="#f3ece2" dark="#e2d8ca" opacity={0.9} /></group>
  </group>;
}

function Seaweed({ position, height, phase = 0, lean = 0, width = 0.1 }: { position: [number, number, number]; height: number; phase?: number; lean?: number; width?: number }) {
  const [blade, rib] = useMemo(() => [width, 0.014].map((w) => {
    const geometry = new PlaneGeometry(w, height, 1, 24);
    geometry.translate(0, height / 2, 0);
    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      pos.setX(i, pos.getX(i) + Math.sin(y * 5.2 + phase) * 0.06 + y * lean);
      pos.setZ(i, Math.cos(y * 4.1 + phase) * 0.03);
    }
    geometry.computeVertexNormals();
    return geometry;
  }), [height, lean, phase, width]);
  return <group position={position}>
    <mesh geometry={blade} castShadow><meshStandardMaterial color="#a2a64c" roughness={0.8} side={DoubleSide} /></mesh>
    <mesh geometry={rib} position={[0, 0, 0.004]}><meshStandardMaterial color="#3e4120" roughness={0.8} side={DoubleSide} /></mesh>
    <mesh geometry={rib} position={[0, 0, -0.004]}><meshStandardMaterial color="#3e4120" roughness={0.8} side={DoubleSide} /></mesh>
  </group>;
}

function CoralTube({ position, height, tilt }: { position: [number, number, number]; height: number; tilt: [number, number, number] }) {
  const radius = 0.055;
  return <group position={position} rotation={tilt}>
    <mesh position={[0, height / 2, 0]} castShadow><cylinderGeometry args={[radius, radius * 1.05, height, 18, 1, true]} /><meshStandardMaterial color="#f1c4c5" roughness={0.75} side={DoubleSide} /></mesh>
    <mesh position={[0, height - 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[radius * 0.92, 18]} /><meshStandardMaterial color="#9c4a6e" roughness={0.9} /></mesh>
    {[0.25, 0.55, 0.8].map((t, i) => <mesh key={t} position={[Math.sin(i * 2.1) * radius, height * t, Math.cos(i * 2.1) * radius]} rotation={[0, i * 2.1, 0]}>
      <circleGeometry args={[0.017, 12]} /><meshStandardMaterial color="#a64f8a" roughness={0.8} side={DoubleSide} />
    </mesh>)}
  </group>;
}

function PineconeFlower({ position, radius, color, metalness = 0 }: { position: [number, number, number]; radius: number; color: string; metalness?: number }) {
  const ref = useRef<InstancedMesh>(null);
  const matrices = useMemo(() => {
    const dummy = new Object3D();
    const list: Matrix4[] = [];
    [[0, 11, 1], [0.35, 9, 0.8], [0.7, 6, 0.55]].forEach(([y, count, spread], tier) => {
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + tier * 0.4;
        dummy.position.set(Math.cos(angle) * radius * 0.55 * spread, y * radius, Math.sin(angle) * radius * 0.55 * spread);
        dummy.rotation.set(0, -angle, -Math.PI / 2 + 0.5 + tier * 0.35);
        dummy.scale.setScalar(radius);
        dummy.updateMatrix();
        list.push(dummy.matrix.clone());
      }
    });
    return list;
  }, [radius]);
  useLayoutEffect(() => {
    matrices.forEach((matrix, i) => ref.current?.setMatrixAt(i, matrix));
    if (ref.current) ref.current.instanceMatrix.needsUpdate = true;
  }, [matrices]);
  return <instancedMesh ref={ref} args={[undefined, undefined, matrices.length]} position={position} castShadow>
    <coneGeometry args={[0.32, 0.75, 6]} />
    <meshStandardMaterial color={color} roughness={0.7} metalness={metalness} flatShading />
  </instancedMesh>;
}

export default function FishSculpture() {
  const foilTop = 0.18;
  return <group>
    {/* Crumpled foil base: two overlapping faceted discs */}
    <mesh position={[-0.2, 0.09, 0.04]} castShadow receiveShadow><cylinderGeometry args={[0.5, 0.53, 0.18, 13]} /><meshStandardMaterial color="#dfe1e5" metalness={0.3} roughness={0.42} flatShading /></mesh>
    <mesh position={[0.34, 0.08, -0.04]} castShadow receiveShadow><cylinderGeometry args={[0.4, 0.43, 0.16, 11]} /><meshStandardMaterial color="#d7dade" metalness={0.3} roughness={0.45} flatShading /></mesh>
    {/* Fish on a hidden post, head raised to the upper left */}
    <mesh position={[0.02, foilTop + 0.2, -0.02]}><cylinderGeometry args={[0.03, 0.03, 0.4, 8]} /><meshStandardMaterial color="#8a8d92" metalness={0.6} roughness={0.4} /></mesh>
    <group position={[0.02, foilTop + 0.78, -0.02]} rotation={[0, 0, -0.62]}><Fish /></group>
    {/* Paper seaweed */}
    <Seaweed position={[-0.56, foilTop, 0.06]} height={1.42} phase={0.4} lean={0.02} />
    <Seaweed position={[-0.08, foilTop, -0.32]} height={1.6} phase={2.1} lean={-0.03} />
    <Seaweed position={[0.6, foilTop, 0.08]} height={1.18} phase={1.2} lean={-0.04} />
    <Seaweed position={[0.14, foilTop, 0.36]} height={0.98} phase={3.0} lean={0.05} width={0.11} />
    {/* Coral tubes and pinecone flowers */}
    <CoralTube position={[-0.46, foilTop, 0.3]} height={0.3} tilt={[0.12, 0, 0.2]} />
    <CoralTube position={[-0.34, foilTop, 0.4]} height={0.24} tilt={[0.2, 0, -0.08]} />
    <CoralTube position={[-0.38, foilTop, 0.2]} height={0.38} tilt={[-0.05, 0, 0.05]} />
    <PineconeFlower position={[0.27, foilTop + 0.02, 0.3]} radius={0.16} color="#e8c69c" />
    <PineconeFlower position={[-0.04, foilTop + 0.02, 0.4]} radius={0.115} color="#c9a145" metalness={0.35} />
  </group>;
}

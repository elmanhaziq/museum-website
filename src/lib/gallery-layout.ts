import { GALLERY } from './constants';

export type Vec3 = [number, number, number];
export interface WallSurface {
  id: string; room: string; position: Vec3; width: number; height: number; depth: number;
  rotation: Vec3; normal: Vec3; tangent: Vec3; color: string;
}

export const ROOM_DIVIDERS = [0.8, -12.2, -23.8, -34.2, -41.3] as const;
const halfWidth = GALLERY.width / 2;
const halfDepth = GALLERY.depth / 2;
const front = GALLERY.centerZ + halfDepth;
const back = GALLERY.centerZ - halfDepth;
const zones = [
  { id: 'main-gallery', front, back: ROOM_DIVIDERS[0], color: '#f5b4c4' },
  { id: 'nature-gallery', front: ROOM_DIVIDERS[0], back: ROOM_DIVIDERS[1], color: '#fff8e8' },
  { id: 'portrait-gallery', front: ROOM_DIVIDERS[1], back: ROOM_DIVIDERS[2], color: '#fff1a8' },
  { id: 'illustration-gallery', front: ROOM_DIVIDERS[2], back: ROOM_DIVIDERS[3], color: '#fff8e8' },
  { id: 'kawaii-gallery', front: ROOM_DIVIDERS[3], back: ROOM_DIVIDERS[4], color: '#f8a8ba' },
  { id: 'sculpture-gallery', front: ROOM_DIVIDERS[4], back, color: '#fff8e8' },
];

const sideWalls: WallSurface[] = zones.flatMap((zone) => {
  const center = (zone.front + zone.back) / 2;
  const length = zone.front - zone.back;
  return [
    { id: `${zone.id}-west`, room: zone.id, position: [-halfWidth, GALLERY.height / 2, center], width: length, height: GALLERY.height, depth: GALLERY.wallThickness, rotation: [0, Math.PI / 2, 0], normal: [1, 0, 0], tangent: [0, 0, -1], color: zone.color },
    { id: `${zone.id}-east`, room: zone.id, position: [halfWidth, GALLERY.height / 2, center], width: length, height: GALLERY.height, depth: GALLERY.wallThickness, rotation: [0, -Math.PI / 2, 0], normal: [-1, 0, 0], tangent: [0, 0, 1], color: zone.color },
  ];
});

const partitionWalls: WallSurface[] = ROOM_DIVIDERS.flatMap((z, index) => {
  const neighbors = [zones[index], zones[index + 1]];
  const [leftGap, rightGap] = GALLERY.openings;
  const segments = [
    { x: (-halfWidth + leftGap[0]) / 2, width: leftGap[0] + halfWidth },
    { x: (rightGap[1] + halfWidth) / 2, width: halfWidth - rightGap[1] },
    { x: 0, width: rightGap[0] - leftGap[1] },
  ];
  const fixed = segments.map((segment, piece) => ({
    id: `divider-${index}-${piece}`, room: 'architecture', position: [segment.x, GALLERY.height / 2, z] as Vec3,
    width: segment.width, height: GALLERY.height, depth: GALLERY.wallThickness,
    rotation: [0, 0, 0] as Vec3, normal: [0, 0, 1] as Vec3, tangent: [1, 0, 0] as Vec3,
    color: index % 2 ? '#fff1a8' : '#f8a8ba',
  }));
  const faceNames = [
    { id: `${neighbors[0].id}-end`, room: neighbors[0].id, normal: [0,0,1] as Vec3, rotation: [0,0,0] as Vec3 },
    { id: `${neighbors[1].id}-entry`, room: neighbors[1].id, normal: [0,0,-1] as Vec3, rotation: [0,Math.PI,0] as Vec3 },
  ];
  const centerSegment = segments[2];
  const faces = faceNames.map((face) => ({
    id: face.id, room: face.room, position: [centerSegment.x, GALLERY.height/2, z] as Vec3,
    width: centerSegment.width, height: GALLERY.height, depth: GALLERY.wallThickness,
    rotation: face.rotation, normal: face.normal, tangent: [1,0,0] as Vec3,
    color: zones.find((zone) => zone.id === face.room)?.color ?? '#fff8e8',
  }));
  return [...fixed, ...faces];
});

export const MUSEUM_WALLS: WallSurface[] = [...sideWalls, ...partitionWalls.filter((wall) => wall.id.startsWith('divider-'))];
export const ARTWORK_WALLS = new Map([...sideWalls, ...partitionWalls.filter((wall) => !wall.id.startsWith('divider-'))].map((wall) => [wall.id, wall]));

export function placeArtworkOnWall(wallId: string, offsetX: number, centerY: number, frameDepth = 0.085, wallOffset = 0.015) {
  const wall = ARTWORK_WALLS.get(wallId);
  if (!wall) throw new Error(`Unknown artwork wall: ${wallId}`);
  const depth = wall.depth / 2 + wallOffset + frameDepth / 2;
  return {
    position: [wall.position[0] + wall.tangent[0] * offsetX + wall.normal[0] * depth, centerY, wall.position[2] + wall.tangent[2] * offsetX + wall.normal[2] * depth] as Vec3,
    rotation: wall.rotation,
  };
}

export function placeArtworkLabel(wallId: string, offsetX: number, centerY: number, imageHeight: number, labelGap = 0.14, wallOffset = 0.015) {
  const wall = ARTWORK_WALLS.get(wallId);
  if (!wall) throw new Error(`Unknown artwork wall: ${wallId}`);
  const surface = wall.depth / 2 + wallOffset;
  return {
    position: [wall.position[0] + wall.tangent[0] * offsetX + wall.normal[0] * surface, centerY - imageHeight / 2 - labelGap - 0.12, wall.position[2] + wall.tangent[2] * offsetX + wall.normal[2] * surface] as Vec3,
    rotation: wall.rotation,
  };
}

export function validateArtworkPlacement(items: Array<{id:string; wallId?:string; offsetX?:number; size?:[number,number]; wallOffset?:number; frameThickness?:number; centerY?:number; position?:Vec3; rotation?:Vec3; spacing?:number; displayType?:string}>) {
  const occupied = new Map<string, Array<{id:string; left:number; right:number; bottom:number; top:number}>>();
  for (const item of items) {
    if (item.displayType === 'sculpture') continue;
    const wall = item.wallId ? ARTWORK_WALLS.get(item.wallId) : undefined;
    const issues: string[] = [];
    if (!wall) issues.push('references an unknown wall');
    if (wall && item.size && item.offsetX !== undefined && item.centerY !== undefined) {
      const left = item.offsetX - item.size[0] / 2; const right = item.offsetX + item.size[0] / 2;
      const bottom = item.centerY - item.size[1] / 2; const top = item.centerY + item.size[1] / 2;
      if (left < -wall.width / 2 + 0.18 || right > wall.width / 2 - 0.18) issues.push('extends beyond wall boundaries');
      if ((item.wallOffset ?? 0.015) < 0.005 || (item.wallOffset ?? 0.015) > 0.04) issues.push('has an invalid wall offset');
      if (bottom < 0.45 || top > wall.height - 0.35) issues.push('is outside the normal hanging height');
      if (item.position && item.rotation) {
        const expected = placeArtworkOnWall(wall.id, item.offsetX, item.centerY, item.frameThickness ?? 0.055, item.wallOffset ?? 0.015);
        const positionError = Math.hypot(item.position[0]-expected.position[0], item.position[1]-expected.position[1], item.position[2]-expected.position[2]);
        const rotationError = Math.hypot(item.rotation[0]-expected.rotation[0], item.rotation[1]-expected.rotation[1], item.rotation[2]-expected.rotation[2]);
        if (positionError > 0.005) issues.push('is not mounted on its referenced wall');
        if (rotationError > 0.005) issues.push('does not face inward from its wall');
      }
      if (bottom - (item.spacing ?? 0.14) - 0.28 < 0.18) issues.push('has a label below the clear wall area');
      const peers = occupied.get(wall.id) ?? [];
      if (peers.some((peer) => left < peer.right && right > peer.left && bottom < peer.top && top > peer.bottom)) issues.push('overlaps another artwork on the same wall');
      peers.push({id:item.id,left,right,bottom,top}); occupied.set(wall.id,peers);
    }
    if (issues.length && process.env.NODE_ENV === 'development') console.warn(`[Gallery Validation] Artwork "${item.id}": ${issues.join('; ')}.`);
  }
}

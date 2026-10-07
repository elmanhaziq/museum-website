export const GALLERY = {
  width: 22,
  depth: 58,
  centerZ: -17.5,
  height: 5.8,
  wallThickness: 0.28,
  movementSpeed: 2.15,
  playerRadius: 0.55,
  artworkInteractionRadius: 2.85,
  openings: [[-8, -3], [3, 8]] as const,
} as const;

// Add a .glb/.gltf to public/models and set this path to replace the procedural room.
export const MUSEUM_MODEL_URL: string | null = null;

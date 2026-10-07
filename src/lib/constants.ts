export const GALLERY = {
  width: 16,
  depth: 22,
  height: 5.8,
  wallThickness: 0.28,
  movementSpeed: 2.15,
  playerRadius: 0.55,
  artworkInteractionRadius: 2.75,
} as const;

// Add a .glb/.gltf to public/models and set this path to replace the procedural room.
export const MUSEUM_MODEL_URL: string | null = null;

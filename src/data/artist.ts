export interface Artwork {
  id: string;
  title: string;
  year: number;
  medium: string;
  dimensions?: string;
  image: string;
  alt: string;
  description: string;
  artistStatement?: string;
  room: string;
  position: [number, number, number];
  rotation: [number, number, number];
  interactionRadius?: number;
}

export const ARTIST = {
  name: 'Kasih Arissa',
  role: 'Artist / Illustrator',
  bio: 'A personal collection moving between painting, drawing, character illustration, graphic design, and mixed-media objects.',
} as const;

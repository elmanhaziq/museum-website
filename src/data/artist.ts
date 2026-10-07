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
  name: 'Artist Name',
  bio: 'An emerging artist exploring memory, place, and the quiet poetry of everyday objects.',
  education: 'Fine Art · 2022—2026',
  interests: 'Painting, printmaking, collected places, and the slow observation of ordinary life.',
  exhibitions: 'Selected studio works · 2022—2026',
  email: 'hello@example.com',
  social: '@artistname',
} as const;

export interface Artwork {
  id: string;
  title: string;
  year: number;
  medium: string;
  dimensions?: string;
  image: string;
  imageAspectRatio?: number;
  alt: string;
  description: string;
  artistStatement?: string;
  room: string;
  position: [number, number, number];
  rotation: [number, number, number];
  interactionRadius?: number;
}

export const artworks: Artwork[] = [
  {
    id: 'rooms-for-quiet', title: 'Rooms for Quiet', year: 2026, medium: 'Acrylic and graphite on paper', dimensions: '42 × 59.4 cm',
    image: '/artworks/rooms-for-quiet.png', imageAspectRatio: 0.75, alt: 'Layered pale green and rust forms arranged like a quiet interior',
    description: 'A study of the spaces we make for ourselves: the threshold, the pause, and the light that gathers there.',
    artistStatement: 'I wanted this room to feel remembered rather than built. Each shape holds a small distance between one thought and the next.',
    room: 'main-gallery', position: [-3.7, 2.35, -10.72], rotation: [0, 0, 0],
  },
  {
    id: 'tidal-memory', title: 'Tidal Memory', year: 2025, medium: 'Oil and cold wax on canvas', dimensions: '60 × 80 cm',
    image: '/artworks/tidal-memory.png', imageAspectRatio: 4 / 3, alt: 'Quiet blue and ochre currents gathered around a soft central form',
    description: 'A landscape assembled from fragments of shoreline, weather, and recollection.',
    artistStatement: 'The marks follow a rhythm more than a map. I am interested in how a place stays with us after its details have disappeared.',
    room: 'main-gallery', position: [0, 2.35, -10.72], rotation: [0, 0, 0],
  },
  {
    id: 'near-place', title: 'A Map of a Near Place', year: 2025, medium: 'Ink, pastel, and collage', dimensions: '50 × 70 cm',
    image: '/artworks/near-place.png', imageAspectRatio: 7 / 9, alt: 'An abstract map of fine dark paths over warm cream and muted coral shapes',
    description: 'An imagined map of familiar routes, drawn from the small landmarks that rarely appear on a map.',
    artistStatement: 'This work treats navigation as a form of attention. Its paths arrive nowhere in particular; they simply ask to be followed.',
    room: 'main-gallery', position: [3.7, 2.35, -10.72], rotation: [0, 0, 0],
  },
  {
    id: 'objects-at-rest', title: 'Objects at Rest', year: 2024, medium: 'Gouache on paper', dimensions: '40 × 50 cm',
    image: '/artworks/objects-at-rest.png', imageAspectRatio: 5 / 6, alt: 'A still life of simple vessels and fruit in muted earthy colors',
    description: 'A still life about the quiet arrangement of ordinary things after they have been used.',
    artistStatement: 'I return to familiar objects because they hold the scale of everyday life. Their weight and silhouette become a way to look slowly.',
    room: 'main-gallery', position: [-7.5, 2.35, -3.4], rotation: [0, Math.PI / 2, 0],
  },
  {
    id: 'blue-hour', title: 'Blue Hour, Folded', year: 2024, medium: 'Monotype and pencil', dimensions: '46 × 61 cm',
    image: '/artworks/blue-hour.png', imageAspectRatio: 5 / 4, alt: 'Layered blue evening shapes crossed by a fine pencil line',
    description: 'A small record of the moment when familiar shapes begin to soften into evening.',
    artistStatement: 'The edges are intentionally uncertain. At dusk the eye completes what the light has left unfinished.',
    room: 'main-gallery', position: [7.5, 2.35, 2.8], rotation: [0, -Math.PI / 2, 0],
  },
  {
    id: 'returning', title: 'A Study in Returning', year: 2023, medium: 'Oil on linen', dimensions: '55 × 70 cm',
    image: '/artworks/returning.png', imageAspectRatio: 1, alt: 'An abstract composition of a central dark oval among warm nested shapes',
    description: 'An abstract composition shaped around repetition, return, and the possibility of beginning again.',
    artistStatement: 'The repeated forms are not identical. Each return carries a little of what came before it.',
    room: 'main-gallery', position: [7.5, 2.35, -3.4], rotation: [0, -Math.PI / 2, 0],
  },
];






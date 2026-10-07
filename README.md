# Interactive Art Museum

A walkable gallery portfolio built with Next.js, TypeScript, React Three Fiber, Three.js, GSAP, and Tailwind CSS.

## Run locally

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000, enter the gallery, and use WASD to move. Drag to look around. Approach a framed work and choose **View artwork**, or open **Index** to select a piece. Escape returns from an artwork presentation or pauses movement.

## Project structure

- `src/data/artworks.ts` contains artwork metadata, paths, and gallery positions.
- `src/data/artist.ts` contains the artist profile.
- `public/artworks/` contains the original vector studies and optimized PNGs used in the gallery.
- `src/components/gallery/` contains the museum, lighting, movement, camera bridge, and proximity detection.
- `src/components/artwork/` contains reusable frames, artwork surfaces, and presentation layouts.

Replace the sample artwork, biography, education, contact, and social details in the data files before publishing. New works can be added by placing an image in `public/artworks/` and adding its metadata and position to `src/data/artworks.ts`.

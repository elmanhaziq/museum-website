# Kasih Arissa — Interactive Art Museum

A guided virtual exhibition for Kasih Arissa, built with Next.js, TypeScript, React Three Fiber, Three.js, and GSAP.

## Run locally

Requirements: Node.js and pnpm.

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Choose **Start Guided Tour**, **Explore Exhibition**, or **Index**. Inside the gallery, use **Previous** and **Next** (or the left and right arrow keys), open an artwork for its detail view, and return to the same tour stop. The gallery also works with touch controls on mobile.

To create a production build and run it locally:

```bash
pnpm build
pnpm start
```

## Project structure

- `src/data/artworks.ts` holds the artwork metadata, image paths, and exhibition positions.
- `src/data/artist.ts` holds the artist profile.
- `src/components/gallery/` contains the museum scene, lighting, artwork placements, and guided tour camera.
- `src/components/artwork/` contains artwork surfaces, frames, and detail presentation.
- `src/components/ui/` contains the Index, About, and other interface panels.
- `public/artworks/` contains the artwork images and related graphic assets.

The museum artwork images are included in the archive. Dependencies and build output are not; install dependencies with `pnpm install` before running the project.

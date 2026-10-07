import { notFound } from 'next/navigation';
import ArtworkDetail from '@/components/artwork/ArtworkDetail';
import { artworks } from '@/data/artworks';

export function generateStaticParams() { return artworks.map(({ id }) => ({ id })); }

export default async function ArtworkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const artwork = artworks.find((item) => item.id === id);
  if (!artwork) notFound();
  return <ArtworkDetail artwork={artwork} />;
}

import Link from 'next/link';
import { ARTIST } from '@/data/artist';
import { ArrowIcon } from '@/components/ui/Icon';

export default function Home() {
  return (
    <main className="entry-screen">
      <header className="entry-topline"><span>{ARTIST.name.toUpperCase()}</span><span>PORTFOLIO&nbsp; / &nbsp;2026</span></header>
      <div className="entry-center">
        <p className="eyebrow">ARTIST / ILLUSTRATOR · A DIGITAL EXHIBITION</p>
        <h1><span>Kasih Arissa</span> <em>Selected Works</em></h1>
        <nav className="entry-options" aria-label="Enter the exhibition">
          <Link href="/gallery?mode=tour" className="enter-link"><span>Start guided tour</span><ArrowIcon direction="up-right" /></Link>
          <Link href="/gallery?mode=explore" className="enter-link"><span>Explore exhibition</span><ArrowIcon direction="up-right" /></Link>
          <Link href="/gallery?mode=index" className="enter-link"><span>Index</span><ArrowIcon direction="up-right" /></Link>
        </nav>
      </div>
      <footer className="entry-footer"><span>SELECTED WORKS · 2026</span><span>CURATED VIRTUAL EXHIBITION</span></footer>
    </main>
  );
}

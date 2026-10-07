import Link from 'next/link';
import { ARTIST } from '@/data/artist';

export default function Home() {
  return (
    <main className="entry-screen">
      <div className="entry-topline"><span>{ARTIST.name.toUpperCase()}</span><span>PORTFOLIO&nbsp; / &nbsp;2026</span></div>
      <div className="entry-center">
        <p className="eyebrow">ARTIST / ILLUSTRATOR · A DIGITAL EXHIBITION</p>
        <h1>Kasih Arissa<br />Selected Works</h1>
        <div className="entry-options">
          <Link href="/gallery?mode=tour" className="enter-link">Start guided tour <span aria-hidden="true">↗</span></Link>
          <Link href="/gallery?mode=explore" className="enter-link">Explore exhibition <span aria-hidden="true">↗</span></Link>
          <Link href="/gallery?mode=index" className="enter-link">Index <span aria-hidden="true">↗</span></Link>
        </div>
      </div>
      <div className="entry-footer"><span>SELECTED WORKS · 2026</span><span>CURATED VIRTUAL EXHIBITION</span></div>
    </main>
  );
}

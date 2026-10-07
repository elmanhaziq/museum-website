import Link from 'next/link';

export default function Home() {
  return (
    <main className="entry-screen">
      <div className="entry-topline"><span>ARTIST NAME</span><span>PORTFOLIO&nbsp; / &nbsp;2026</span></div>
      <div className="entry-center">
        <p className="eyebrow">SELECTED WORKS · 2022—2026</p>
        <h1>A collection<br />of works</h1>
        <Link href="/gallery" className="enter-link">Enter the gallery <span aria-hidden="true">↗</span></Link>
      </div>
      <div className="entry-footer"><span>AN INTERACTIVE EXHIBITION</span><span>SCROLL IS NOT REQUIRED</span></div>
    </main>
  );
}

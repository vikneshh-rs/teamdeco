import Link from "next/link";
import { ArrowUpRight, Layers3, Sparkles } from "lucide-react";

export default function Home() {
  return <main className="marketing-shell">
    <nav className="topbar glass">
      <Link href="/" className="brand"><span className="brand-mark"><Layers3 size={20}/></span>Team DeCo</Link>
      <div className="nav-links"><a href="#services">Services</a><a href="#work">Our work</a><Link href="/client">Client portal</Link></div>
      <Link className="button button-dark" href="/client">Track a project <ArrowUpRight size={16}/></Link>
    </nav>
    <section className="hero">
      <div className="eyebrow"><Sparkles size={14}/> DIGITAL PRODUCTS · DESIGN · ENGINEERING</div>
      <h1>We turn ambitious ideas into <span>digital reality.</span></h1>
      <p className="hero-copy">A design-led technology studio building thoughtful digital experiences, useful software and products that move businesses forward.</p>
      <div className="hero-actions"><a className="button button-blue" href="mailto:hello@teamdeco.in">Start a conversation <ArrowUpRight size={17}/></a><Link className="button button-soft" href="/client">Track your project</Link></div>
      <div className="hero-orbit"><div className="orbit-ring ring-one"></div><div className="orbit-ring ring-two"></div><div className="orbit-core"><Layers3 size={40}/></div><span className="orbit-chip chip-a">Design</span><span className="orbit-chip chip-b">Engineering</span><span className="orbit-chip chip-c">AI systems</span></div>
    </section>
    <section className="service-strip" id="services"><div><small>01 / STRATEGY</small><h3>Think clearly.</h3><p>Product direction, discovery and digital strategy.</p></div><div><small>02 / DESIGN</small><h3>Design boldly.</h3><p>Brand, UX and interfaces built around people.</p></div><div><small>03 / BUILD</small><h3>Build thoughtfully.</h3><p>Websites, software and AI-powered workflows.</p></div></section>
    <section className="bottom-cta" id="work"><div><small>YOUR PROJECT, IN VIEW</small><h2>Great work deserves<br/>clear progress.</h2></div><Link className="button button-dark" href="/client">Open client portal <ArrowUpRight size={16}/></Link></section>
    <footer><Link href="/" className="brand"><span className="brand-mark"><Layers3 size={17}/></span>Team DeCo</Link><span>© {new Date().getFullYear()} Team DeCo</span><Link href="/manage">Team access</Link></footer>
  </main>;
}

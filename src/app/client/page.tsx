import { Search, ArrowUpRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ClientLookup() {
  return <main className="portal-bg">
    <header className="portal-top">
      <Link href="/" className="brand" aria-label="Team DeCo Home">
        <Image src="/logo.png" alt="DeCo - Crafting Digital Excellence" width={103} height={42} priority className="brand-logo-img" />
      </Link>
      <span className="top-label">CLIENT PROJECT PORTAL</span>
      <Link href="/" className="text-link">Main website ↗</Link>
    </header>
    <section className="lookup-wrap">
      <div className="eyebrow"><span className="status-dot"></span> PROJECT TRACKING</div>
      <h1>Your project.<br/><span>Your progress.</span></h1>
      <p className="hero-copy">See the latest milestones, timeline and live deployment for your Team DeCo project.</p>
      <form className="lookup-card" action="/client/project" method="GET">
        <label htmlFor="projectId">Project ID</label>
        <div className="lookup-input"><Search size={18}/><input id="projectId" name="id" placeholder="e.g. DC-7F3K9P2Q" required autoComplete="off"/></div>
        <button className="button button-blue full-width" type="submit">View project status <ArrowUpRight size={17}/></button>
        <p className="privacy-note"><ShieldCheck size={14}/> Only approved client-facing project details are shown.</p>
      </form>
      <div className="lookup-help">Your Project ID is provided by Team DeCo. Need help? <a href="mailto:hello@teamdeco.in">Contact us</a>.</div>
    </section>
    <footer className="portal-footer"><span>© {new Date().getFullYear()} Team DeCo</span><span>Built with care. Delivered with clarity.</span></footer>
  </main>;
}

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, CheckCircle2, Circle, CircleDot, Clock3, Globe2, MessageCircle, PhoneCall, CalendarDays, Sparkles, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

interface MilestoneItem {
  name: string;
  date: string;
  state: "done" | "active" | "upcoming";
  detail: string;
}

interface ProjectData {
  id: string;
  name: string;
  status: string;
  progress: number;
  updated: string;
  url: string;
  updateTitle: string;
  updateNotes: string;
  nextMeeting?: string;
  milestones: MilestoneItem[];
}

const fallbackDemo: ProjectData = {
  name: "Website Development",
  id: "DC-7F3K9P2Q",
  status: "In progress",
  progress: 65,
  updated: "Demo preview · Connect Supabase for live records",
  url: "https://vercel.com",
  updateTitle: "Development is underway",
  updateNotes: "Milestone progress and project notes will appear here as Team DeCo publishes updates.",
  nextMeeting: "Thursday · 4:00 PM IST",
  milestones: [
    { name: "Discovery & requirements", date: "Phase 01", state: "done", detail: "Scope and requirements confirmed" },
    { name: "UI/UX design", date: "Phase 02", state: "done", detail: "Design direction approved" },
    { name: "Development", date: "Phase 03", state: "active", detail: "Core features in development" },
    { name: "Testing & quality assurance", date: "Phase 04", state: "upcoming", detail: "Functional and responsive testing" },
    { name: "Final delivery", date: "Phase 05", state: "upcoming", detail: "Handover and launch" }
  ]
};

async function getProjectData(rawId: string | undefined): Promise<ProjectData | null> {
  const queryId = (rawId || "").trim().toUpperCase();
  if (!queryId) return null;

  try {
    const supabase = await createClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("projects")
        .select("*, milestones(*)")
        .eq("id", queryId)
        .maybeSingle();

      if (!error && data) {
        const sortedMilestones = (data.milestones || []).sort(
          (a: { order_index?: number }, b: { order_index?: number }) => (a.order_index ?? 0) - (b.order_index ?? 0)
        );

        return {
          id: data.id,
          name: data.name,
          status: data.status || "In progress",
          progress: Number(data.progress ?? 0),
          updated: data.updated_label || "Live database record",
          url: data.url || "https://vercel.com",
          updateTitle: data.update_title || "Development is underway",
          updateNotes: data.update_notes || "Milestone progress and project notes will appear here as Team DeCo publishes updates.",
          nextMeeting: data.next_meeting || "",
          milestones: sortedMilestones.map((m: { name: string; phase: string; state: "done" | "active" | "upcoming"; detail: string }) => ({
            name: m.name,
            date: m.phase,
            state: m.state,
            detail: m.detail
          }))
        };
      }
    }
  } catch (err) {
    console.error("Error querying Supabase:", err);
  }

  // Fallback to static demo if Supabase is not configured or ID matches demo
  if (queryId === fallbackDemo.id) {
    return fallbackDemo;
  }

  return null;
}

export default async function ProjectPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  const project = await getProjectData(id);

  if (!project) {
    return (
      <main className="portal-bg">
        <header className="portal-top">
          <Link href="/" className="brand" aria-label="Team DeCo Home">
            <Image src="/logo.png" alt="DeCo - Crafting Digital Excellence" width={103} height={42} priority className="brand-logo-img" />
          </Link>
          <span className="top-label">CLIENT PROJECT PORTAL</span>
        </header>
        <section className="lookup-wrap">
          <div className="eyebrow">PROJECT NOT FOUND</div>
          <h1>Let&apos;s check<br /><span>that ID.</span></h1>
          <p className="hero-copy">We couldn&apos;t find an active project matching ID <code>{id || "unknown"}</code>. Please check the ID provided by your team or contact support.</p>
          <Link href="/client" className="button button-blue">
            <ArrowLeft size={16} /> Try another ID
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="portal-bg project-bg">
      <header className="portal-top">
        <Link href="/" className="brand" aria-label="Team DeCo Home">
          <Image src="/logo.png" alt="DeCo - Crafting Digital Excellence" width={103} height={42} priority className="brand-logo-img" />
        </Link>
        <span className="top-label">PROJECT OVERVIEW / {project.id}</span>
        <Link href="/client" className="text-link">← All projects</Link>
      </header>

      <section className="project-wrap">
        <div className="elite-hero glass">
          <div className="elite-top-meta">
            <span className="elite-badge">
              <Sparkles size={12} /> PRIVATE CLIENT SUITE · BESPOKE ENGAGEMENT
            </span>
            <span className="elite-id-tag">
              PROJECT ID: <code>{project.id}</code>
            </span>
          </div>

          <div className="elite-welcome-row">
            <div className="elite-text-block">
              <h1 className="elite-welcome-heading">
                <span className="welcome-playfair">Welcome,</span>
                {project.name}
              </h1>
              <p className="elite-welcome-copy">
                It is our distinct honor to engineer and craft this flagship experience alongside you. This private executive suite gives you direct, real-time insight into each milestone, sprint deliverable, and live deployment — executed with discretion, precision, and digital excellence.
              </p>
              <div className="elite-perks">
                <span className="elite-perk-item">
                  <Sparkles size={13} /> Dedicated Studio Team
                </span>
                <span className="elite-perk-item">
                  <ShieldCheck size={13} /> Confidential Client Environment
                </span>
                <span className="elite-perk-item">
                  <CheckCircle2 size={13} /> Direct Deployment Sync
                </span>
              </div>
            </div>

            <div className="elite-status-block">
              <span className="pill" style={{
                background: "#fff1f0",
                color: "#b91c1c",
                border: "1px solid #ffd4d2"
              }}>
                <span className="status-dot" style={{ background: "#d3383b" }} /> {project.status}
              </span>
              <span className="elite-tier-label">VIP Concierge Tier</span>
            </div>
          </div>
        </div>

        <div className="stats-grid">
          <article className="stat-card glass">
            <small>OVERALL PROGRESS</small>
            <div className="stat-number">{project.progress}<span>%</span></div>
            <div className="segmented-progress-track" style={{ marginTop: "12px", marginBottom: "8px" }}>
              {[1, 2, 3, 4, 5].map((step) => {
                const stepMin = (step - 1) * 20;
                const fill = Math.max(0, Math.min(100, ((project.progress - stepMin) / 20) * 100));
                return (
                  <div key={step} className="progress-segment" title={`Phase ${step}: ${step * 20}%`}>
                    <div
                      className="progress-segment-fill"
                      style={{
                        width: `${fill}%`,
                        background: project.progress >= 100
                          ? "linear-gradient(90deg, #1b9b58, #22c55e)"
                          : "linear-gradient(90deg, #b91c1c, #e03131)"
                      }}
                    />
                  </div>
                );
              })}
            </div>
            <p>Work currently underway</p>
          </article>

          <article className="stat-card glass">
            <small>PROJECT TIMELINE</small>
            <div className="stat-number">
              {String(project.milestones.filter(m => m.state === "done").length + 1).padStart(2, "0")}
              <span>/{String(project.milestones.length || 5).padStart(2, "0")}</span>
            </div>
            <p>
              Current phase: {project.milestones.find(m => m.state === "active")?.name || project.milestones[0]?.name || "Planning"}
            </p>
          </article>

          <article className="stat-card glass">
            <small>NEXT MEETING</small>
            <div className="stat-word" style={{ fontSize: "16px", gap: "8px", color: project.nextMeeting ? "var(--ink)" : "var(--muted)" }}>
              <CalendarDays size={19} style={{ color: "var(--blue)", flexShrink: 0 }} />
              <span>{project.nextMeeting || "To be scheduled"}</span>
            </div>
            <p>{project.updated ? `Last update: ${project.updated}` : "Team DeCo project sync"}</p>
          </article>
        </div>

        <div className="project-columns">
          <section className="panel glass">
            <div className="panel-head">
              <div>
                <small>DELIVERY PLAN</small>
                <h2>Project timeline</h2>
              </div>
              <span className="count-chip">{project.milestones.length} phases</span>
            </div>
            <div className="timeline">
              {project.milestones.map((m) => (
                <div className="timeline-item" key={m.name}>
                  <div className={`timeline-icon ${m.state}`}>
                    {m.state === "done" ? <CheckCircle2 size={19} /> : m.state === "active" ? <CircleDot size={19} /> : <Circle size={19} />}
                  </div>
                  <div className="timeline-copy">
                    <div className="timeline-title-row">
                      <h3>{m.name}</h3>
                      <span className={`state-label ${m.state}`}>
                        {m.state === "done" ? "Completed" : m.state === "active" ? "In progress" : "Upcoming"}
                      </span>
                    </div>
                    <p>{m.detail}</p>
                    <small>{m.date}</small>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside className="side-stack">
            <section className="panel glass">
              <div className="panel-head">
                <div>
                  <small>DEPLOYMENT</small>
                  <h2>Live website</h2>
                </div>
                <Globe2 size={21} />
              </div>
              <p className="muted">Open the latest client-facing deployment.</p>
              <a href={project.url} target="_blank" rel="noreferrer" className="button button-dark full-width">
                View live website <ArrowUpRight size={16} />
              </a>
              <small className="demo-warning">Client verification deployment.</small>
            </section>

            <section className="panel update-panel">
              <small>TEAM DECO UPDATE</small>
              <h3>{project.updateTitle}</h3>
              <p>{project.updateNotes}</p>
              <div className="update-footer">
                <span className="status-dot" /> Latest project note
              </div>
            </section>

            {/* Direct Project Feedback / Contact Card (Luxury Golden Accent) */}
            <section
              className="panel"
              style={{
                background: "linear-gradient(138deg, #e59d1a 0%, #c47c05 55%, #9b5c00 100%)",
                color: "#ffffff",
                border: "1px solid rgba(255, 255, 255, 0.32)",
                boxShadow: "0 18px 42px rgba(196, 124, 5, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.4)",
                borderRadius: "24px",
                padding: "24px",
                position: "relative",
                overflow: "hidden"
              }}
            >
              {/* Warm decorative glow */}
              <div
                style={{
                  position: "absolute",
                  top: "-30px",
                  right: "-30px",
                  width: "135px",
                  height: "135px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(255,255,255,0.32) 0%, transparent 70%)",
                  pointerEvents: "none"
                }}
              />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <span
                  style={{
                    background: "rgba(0, 0, 0, 0.16)",
                    backdropFilter: "blur(8px)",
                    color: "#ffffff",
                    fontSize: "9px",
                    fontWeight: 800,
                    letterSpacing: "0.14em",
                    padding: "5px 10px",
                    borderRadius: "20px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <MessageCircle size={12} /> COMMENTS & FEEDBACK
                </span>
                <span style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.9)", fontWeight: 700 }}>
                  ID: <code style={{ background: "rgba(0, 0, 0, 0.18)", padding: "2px 6px", borderRadius: "6px", color: "#ffffff" }}>{project.id}</code>
                </span>
              </div>

              <h3 style={{ font: "800 24px Manrope, sans-serif", letterSpacing: "-0.04em", margin: "0 0 8px", color: "#ffffff" }}>
                Talk to us.
              </h3>

              <p style={{ fontSize: "12px", lineHeight: "1.7", color: "rgba(255, 255, 255, 0.92)", margin: "0 0 18px" }}>
                Have questions, suggestions, or feedback on this phase? We are always here to help. Send us a message or call directly with your Project ID.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                <a
                  href={`https://wa.me/918825460719?text=${encodeURIComponent(`Hi Team DeCo, I have comments on project ${project.id} (${project.name}).`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="button"
                  style={{
                    background: "#ffffff",
                    color: "#15803d",
                    fontWeight: 800,
                    fontSize: "12px",
                    padding: "12px 18px",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.14)",
                    gap: "8px"
                  }}
                >
                  <MessageCircle size={15} style={{ color: "#16a34a" }} /> Chat on WhatsApp <ArrowUpRight size={14} />
                </a>

                <a
                  href="tel:+918825460719"
                  className="button"
                  style={{
                    background: "rgba(0, 0, 0, 0.18)",
                    color: "#ffffff",
                    border: "1px solid rgba(255, 255, 255, 0.32)",
                    backdropFilter: "blur(10px)",
                    fontWeight: 700,
                    fontSize: "12px",
                    padding: "12px 18px",
                    gap: "8px"
                  }}
                >
                  <PhoneCall size={14} /> Call +91 - 8825460719
                </a>
              </div>

              <div
                style={{
                  borderTop: "1px solid rgba(255, 255, 255, 0.22)",
                  paddingTop: "12px",
                  marginTop: "16px",
                  fontSize: "10px",
                  color: "rgba(255, 255, 255, 0.88)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <span className="status-dot" style={{ background: "#ffffff" }} />
                <span>Text with Project ID on WhatsApp or call us.</span>
              </div>
            </section>
          </aside>
        </div>

        <div className="project-endnote">
          Questions about this project? <a href="mailto:hello@teamdeco.in">Contact Team DeCo</a>.
        </div>
      </section>
    </main>
  );
}

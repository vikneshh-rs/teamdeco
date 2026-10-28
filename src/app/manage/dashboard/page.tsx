import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import {
  LogOut,
  Plus,
  ArrowUpRight,
  Database,
  CheckCircle2,
  AlertTriangle,
  FolderKanban,
  Trash2,
  RefreshCw,
  ExternalLink
} from "lucide-react";
import { verifyAdminSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { logoutAction, createProjectAction, updateProjectAction } from "../actions";
import { DeleteProjectButton } from "./DeleteProjectButton";

interface DashboardProject {
  id: string;
  name: string;
  status: string;
  progress: number;
  url: string;
  updated_label: string;
  update_title: string;
  update_notes: string;
  next_meeting?: string;
}

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) {
    redirect("/manage?error=" + encodeURIComponent("Please sign in to access the management dashboard."));
  }

  const { success, error } = await searchParams;

  const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  let projects: DashboardProject[] = [];
  let dbError: string | null = null;

  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      if (supabase) {
        const { data, error: fetchErr } = await supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false });

        if (fetchErr) {
          dbError = fetchErr.message;
        } else if (data) {
          projects = data;
        }
      }
    } catch (e: unknown) {
      dbError = e instanceof Error ? e.message : "Error connecting to Supabase";
    }
  } else {
    // Demo placeholder project
    projects = [
      {
        id: "DC-7F3K9P2Q",
        name: "Website Development (Starter Demo)",
        status: "In progress",
        progress: 65,
        url: "https://vercel.com",
        updated_label: "Preview Demo",
        update_title: "Development is underway",
        update_notes: "Milestone progress and project notes will appear here as Team DeCo publishes updates.",
        next_meeting: "Thursday · 4:00 PM IST",
      },
    ];
  }

  return (
    <main className="portal-bg" style={{ minHeight: "100vh", paddingBottom: "60px" }}>
      {/* Top Header */}
      <header className="portal-top">
        <Link href="/" className="brand" aria-label="Team DeCo Home">
          <Image
            src="/logo.png"
            alt="DeCo - Crafting Digital Excellence"
            width={103}
            height={42}
            priority
            className="brand-logo-img"
          />
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span className="top-label">MANAGEMENT CONSOLE</span>
          <span className={`pill ${isSupabaseConfigured ? "pill-blue" : ""}`} style={{
            background: isSupabaseConfigured ? "#e6f8ee" : "#fff8e6",
            color: isSupabaseConfigured ? "#1b9b58" : "#b47a11",
            border: `1px solid ${isSupabaseConfigured ? "#b7edd0" : "#fae6ba"}`
          }}>
            <Database size={13} />
            {isSupabaseConfigured ? "Supabase Live" : "Supabase Setup Pending"}
          </span>
          <form action={logoutAction}>
            <button
              type="submit"
              className="button button-soft"
              style={{ padding: "8px 14px", fontSize: "11px", gap: "6px" }}
            >
              <LogOut size={14} /> Sign out
            </button>
          </form>
        </div>
      </header>

      <section style={{ maxWidth: "1180px", margin: "40px auto 0" }}>
        {/* Notifications */}
        {success && (
          <div style={{
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            color: "#166534",
            padding: "14px 18px",
            borderRadius: "16px",
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "24px"
          }}>
            <CheckCircle2 size={18} />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div style={{
            background: "#fef2f2",
            border: "1px solid #fee2e2",
            color: "#b91c1c",
            padding: "14px 18px",
            borderRadius: "16px",
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "24px"
          }}>
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Supabase Connection Setup Box (shown when credentials are empty) */}
        {!isSupabaseConfigured && (
          <div className="panel glass" style={{
            marginBottom: "32px",
            borderLeft: "5px solid var(--gold)",
            background: "linear-gradient(135deg, #fffdf8 0%, #fff 100%)"
          }}>
            <div className="panel-head" style={{ marginBottom: "12px" }}>
              <div>
                <small style={{ color: "var(--gold)" }}>DATABASE CONFIGURATION</small>
                <h2 style={{ fontSize: "20px" }}>Connect your Supabase Project</h2>
              </div>
            </div>
            <p className="muted" style={{ marginBottom: "16px" }}>
              To store real client projects and live updates, connect your Supabase database:
            </p>
            <ol style={{ fontSize: "12px", color: "var(--ink)", lineHeight: "1.9", paddingLeft: "20px", margin: "0 0 16px" }}>
              <li>
                Open your <strong>Supabase Dashboard</strong> and create a new project.
              </li>
              <li>
                Go to <strong>SQL Editor</strong>, open <code>supabase_schema.sql</code> (created in your project root), and click <strong>Run</strong>.
              </li>
              <li>
                In your Supabase project go to <strong>Project Settings → API</strong> and copy your <strong>URL</strong> and <strong>anon public key</strong>.
              </li>
              <li>
                Add them into <code>.env.local</code>:
                <pre style={{
                  background: "#101114",
                  color: "#dce8ff",
                  padding: "12px",
                  borderRadius: "12px",
                  fontSize: "11px",
                  marginTop: "8px",
                  overflowX: "auto"
                }}>
{`NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key`}
                </pre>
              </li>
            </ol>
            <div style={{ fontSize: "11px", color: "var(--muted)" }}>
              After saving <code>.env.local</code>, restart the dev server or refresh this page.
            </div>
          </div>
        )}

        {dbError && (
          <div style={{
            background: "#fff8f8",
            border: "1px solid #ffd0d0",
            color: "#c0392b",
            padding: "16px",
            borderRadius: "16px",
            marginBottom: "24px",
            fontSize: "12px"
          }}>
            <strong>Database Error:</strong> {dbError}
            <div style={{ marginTop: "6px" }}>Make sure you have run <code>supabase_schema.sql</code> in the Supabase SQL editor.</div>
          </div>
        )}

        {/* Dashboard Title & Stats */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "26px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div className="eyebrow">PORTAL MANAGEMENT</div>
            <h1 style={{ font: "800 clamp(30px, 4vw, 44px)/1.1 Manrope, sans-serif", letterSpacing: "-0.05em", margin: "10px 0 4px" }}>
              Project Operations
            </h1>
            <p className="muted" style={{ margin: 0 }}>
              Create, update progress, and publish live milestone notices for your clients.
            </p>
          </div>
          <a href="#new-project" className="button button-dark">
            <Plus size={16} /> New Project
          </a>
        </div>

        {/* Stats Summary */}
        <div className="stats-grid" style={{ marginBottom: "32px" }}>
          <article className="stat-card glass">
            <small>TOTAL PROJECTS</small>
            <div className="stat-number">{projects.length}</div>
            <p>Tracked client engagements</p>
          </article>
          <article className="stat-card glass">
            <small>ACTIVE WORKFLOWS</small>
            <div className="stat-number">
              {projects.filter(p => p.status.toLowerCase().includes("progress")).length}
            </div>
            <p>Projects currently in progress</p>
          </article>
          <article className="stat-card glass">
            <small>DATABASE STATUS</small>
            <div className="stat-word" style={{ color: isSupabaseConfigured ? "#1b9b58" : "var(--gold)" }}>
              <Database size={18} />
              {isSupabaseConfigured ? "Live Sync Active" : "Local Mockup"}
            </div>
            <p>{isSupabaseConfigured ? "Connected to Supabase" : "Using demo data"}</p>
          </article>
        </div>

        {/* Project List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "48px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ font: "800 22px Manrope, sans-serif", letterSpacing: "-0.04em", margin: 0 }}>
              All Projects ({projects.length})
            </h2>
            <span style={{ fontSize: "11px", color: "var(--muted)" }}>
              Clients can view projects using their unique ID
            </span>
          </div>

          {projects.map((p) => (
            <div key={p.id} className="panel glass" style={{ padding: "26px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "18px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                    <code style={{
                      background: "#f4f5f7",
                      color: "var(--ink)",
                      fontWeight: 800,
                      padding: "4px 8px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      border: "1px solid var(--line)"
                    }}>
                      {p.id}
                    </code>
                    <span className="pill" style={{
                      padding: "4px 10px",
                      fontSize: "10px",
                      background: "#fff1f0",
                      color: "#b91c1c",
                      border: "1px solid #ffd4d2"
                    }}>
                      <span className="status-dot" style={{ background: "#d3383b" }} /> {p.status}
                    </span>
                  </div>
                  <h3 style={{ font: "800 22px Manrope, sans-serif", margin: "4px 0" }}>{p.name}</h3>
                  <div style={{ fontSize: "11px", color: "var(--muted)", display: "flex", gap: "14px", marginTop: "4px", flexWrap: "wrap" }}>
                    <span>Target: <a href={p.url} target="_blank" rel="noreferrer" style={{ color: "#b91c1c", fontWeight: 600 }}>{p.url}</a></span>
                    <span>•</span>
                    {p.next_meeting && (
                      <>
                        <span style={{ color: "var(--ink)", fontWeight: 600 }}>Next Meeting: {p.next_meeting}</span>
                        <span>•</span>
                      </>
                    )}
                    <span>{p.updated_label}</span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <Link
                    href={`/client/project?id=${p.id}`}
                    target="_blank"
                    className="button button-soft"
                    style={{ padding: "9px 15px", fontSize: "11px" }}
                  >
                    View Client Page <ExternalLink size={13} />
                  </Link>

                  {isSupabaseConfigured && (
                    <DeleteProjectButton projectId={p.id} />
                  )}
                </div>
              </div>

              {/* Milestone Progress Track */}
              <div style={{ marginBottom: "22px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", fontWeight: 700, marginBottom: "8px", flexWrap: "wrap", gap: "6px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ color: "var(--ink)", letterSpacing: "0.02em" }}>Milestone Progress</span>
                    <span style={{
                      fontSize: "10px",
                      fontWeight: 800,
                      background: p.progress >= 100 ? "#e6f8ee" : "#fff1f0",
                      color: p.progress >= 100 ? "#1b9b58" : "#b91c1c",
                      border: `1px solid ${p.progress >= 100 ? "#b7edd0" : "#ffd4d2"}`,
                      padding: "2px 8px",
                      borderRadius: "6px"
                    }}>
                      {p.progress >= 100
                        ? "Completed"
                        : p.progress >= 80
                        ? "Phase 05 · Final Delivery"
                        : p.progress >= 60
                        ? "Phase 04 · QA & Testing"
                        : p.progress >= 40
                        ? "Phase 03 · Development"
                        : p.progress >= 20
                        ? "Phase 02 · UI/UX Design"
                        : "Phase 01 · Discovery"}
                    </span>
                  </div>
                  <span style={{
                    fontFamily: "Manrope, sans-serif",
                    fontWeight: 800,
                    fontSize: "13px",
                    color: p.progress >= 100 ? "#1b9b58" : "#b91c1c"
                  }}>
                    {p.progress}%
                  </span>
                </div>
                <div className="segmented-progress-track">
                  {[1, 2, 3, 4, 5].map((step) => {
                    const stepMin = (step - 1) * 20;
                    const fill = Math.max(0, Math.min(100, ((p.progress - stepMin) / 20) * 100));
                    return (
                      <div key={step} className="progress-segment" title={`Phase ${step}: ${step * 20}%`}>
                        <div
                          className="progress-segment-fill"
                          style={{
                            width: `${fill}%`,
                            background: p.progress >= 100
                              ? "linear-gradient(90deg, #1b9b58, #22c55e)"
                              : "linear-gradient(90deg, #b91c1c, #e03131)"
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Update Form */}
              {isSupabaseConfigured && (
                <details style={{ marginTop: "16px", borderTop: "1px solid var(--line)", paddingTop: "14px" }}>
                  <summary style={{ cursor: "pointer", fontSize: "12px", fontWeight: 700, color: "var(--ink)" }}>
                    Update Project Status & Notes
                  </summary>
                  <form action={updateProjectAction} style={{ marginTop: "16px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" }}>
                    <input type="hidden" name="id" value={p.id} />

                    <div>
                      <label style={{ fontSize: "11px" }}>Progress % (0-100)</label>
                      <input
                        name="progress"
                        type="number"
                        min="0"
                        max="100"
                        defaultValue={p.progress}
                        style={{ width: "100%", height: "42px", padding: "0 12px", border: "1px solid var(--line)", borderRadius: "10px" }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: "11px" }}>Status Text</label>
                      <select
                        name="status"
                        defaultValue={p.status}
                        style={{ width: "100%", height: "42px", padding: "0 12px", border: "1px solid var(--line)", borderRadius: "10px", background: "#fff" }}
                      >
                        <option value="In progress">In progress</option>
                        <option value="In review">In review</option>
                        <option value="Completed">Completed</option>
                        <option value="On hold">On hold</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: "11px" }}>Update Headline</label>
                      <input
                        name="updateTitle"
                        defaultValue={p.update_title}
                        style={{ width: "100%", height: "42px", padding: "0 12px", border: "1px solid var(--line)", borderRadius: "10px" }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: "11px" }}>Live Vercel / Website URL</label>
                      <input
                        name="url"
                        defaultValue={p.url || ""}
                        placeholder="https://your-project.vercel.app"
                        style={{ width: "100%", height: "42px", padding: "0 12px", border: "1px solid var(--line)", borderRadius: "10px" }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: "11px" }}>Next Meeting Date / Time</label>
                      <input
                        name="nextMeeting"
                        defaultValue={p.next_meeting || ""}
                        placeholder="e.g. 30 Oct 2026, 4:30 PM IST"
                        style={{ width: "100%", height: "42px", padding: "0 12px", border: "1px solid var(--line)", borderRadius: "10px" }}
                      />
                    </div>

                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={{ fontSize: "11px" }}>Client Note Details</label>
                      <textarea
                        name="updateNotes"
                        defaultValue={p.update_notes}
                        rows={2}
                        style={{ width: "100%", padding: "10px 12px", border: "1px solid var(--line)", borderRadius: "10px", fontFamily: "inherit", fontSize: "12px" }}
                      />
                    </div>

                    <div style={{ gridColumn: "1 / -1" }}>
                      <button type="submit" className="button button-dark" style={{ padding: "10px 18px", fontSize: "12px" }}>
                        <RefreshCw size={13} /> Save Updates
                      </button>
                    </div>
                  </form>
                </details>
              )}
            </div>
          ))}
        </div>

        {/* Create Project Section */}
        <section id="new-project" className="panel glass" style={{ padding: "34px" }}>
          <div className="panel-head" style={{ marginBottom: "20px" }}>
            <div>
              <small>NEW CLIENT ENGAGEMENT</small>
              <h2 style={{ font: "800 26px Manrope, sans-serif" }}>Create Project</h2>
            </div>
            <FolderKanban size={26} style={{ color: "var(--blue)" }} />
          </div>

          <form action={createProjectAction} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "18px" }}>
            <div>
              <label htmlFor="pId">Project ID (e.g. DC-9K8L2P)</label>
              <input
                id="pId"
                name="id"
                placeholder="e.g. DC-9K8L2P"
                required
                style={{ width: "100%", height: "46px", border: "1px solid var(--line)", borderRadius: "12px", padding: "0 14px" }}
              />
            </div>

            <div>
              <label htmlFor="pName">Project Name</label>
              <input
                id="pName"
                name="name"
                placeholder="e.g. Brand & SaaS Platform"
                required
                style={{ width: "100%", height: "46px", border: "1px solid var(--line)", borderRadius: "12px", padding: "0 14px" }}
              />
            </div>

            <div>
              <label htmlFor="pStatus">Initial Status</label>
              <select
                id="pStatus"
                name="status"
                defaultValue="In progress"
                style={{ width: "100%", height: "46px", border: "1px solid var(--line)", borderRadius: "12px", padding: "0 14px", background: "#fff" }}
              >
                <option value="In progress">In progress</option>
                <option value="Discovery">Discovery</option>
                <option value="Design Phase">Design Phase</option>
                <option value="Development">Development</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label htmlFor="pProgress">Starting Progress % (0 - 100)</label>
              <input
                id="pProgress"
                name="progress"
                type="number"
                min="0"
                max="100"
                defaultValue="10"
                style={{ width: "100%", height: "46px", border: "1px solid var(--line)", borderRadius: "12px", padding: "0 14px" }}
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label htmlFor="pUrl">Live Preview / Deployment URL</label>
              <input
                id="pUrl"
                name="url"
                placeholder="https://client-preview.teamdeco.in"
                defaultValue="https://vercel.com"
                style={{ width: "100%", height: "46px", border: "1px solid var(--line)", borderRadius: "12px", padding: "0 14px" }}
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label htmlFor="pNextMeeting">Next Meeting Date / Time (Optional)</label>
              <input
                id="pNextMeeting"
                name="nextMeeting"
                placeholder="e.g. 30 Oct 2026, 4:30 PM IST"
                style={{ width: "100%", height: "46px", border: "1px solid var(--line)", borderRadius: "12px", padding: "0 14px" }}
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label htmlFor="pUpdateTitle">Initial Update Title</label>
              <input
                id="pUpdateTitle"
                name="updateTitle"
                placeholder="e.g. Project kick-off & requirements phase"
                defaultValue="Project kick-off"
                style={{ width: "100%", height: "46px", border: "1px solid var(--line)", borderRadius: "12px", padding: "0 14px" }}
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label htmlFor="pUpdateNotes">Client Note / Status Message</label>
              <textarea
                id="pUpdateNotes"
                name="updateNotes"
                rows={3}
                placeholder="Describe what has been delivered and current focus..."
                defaultValue="Work has officially started. Discovery deliverables are being prepared."
                style={{ width: "100%", padding: "12px 14px", border: "1px solid var(--line)", borderRadius: "12px", fontFamily: "inherit", fontSize: "13px" }}
              />
            </div>

            <div style={{ gridColumn: "1 / -1", marginTop: "10px" }}>
              <button type="submit" className="button button-blue" style={{ minWidth: "180px" }}>
                <Plus size={16} /> Save & Publish Project
              </button>
            </div>
          </form>
        </section>
      </section>
    </main>
  );
}

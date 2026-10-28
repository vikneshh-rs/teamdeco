import { Layers3, LockKeyhole, ArrowUpRight, AlertCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/auth";
import { loginAction } from "./actions";

export default async function ManageLogin({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const isAuthenticated = await verifyAdminSession();
  if (isAuthenticated) {
    redirect("/manage/dashboard");
  }

  const { error } = await searchParams;

  return (
    <main className="manage-bg">
      <div className="login-card glass">
        <Link href="/" className="brand">
          <span className="brand-mark"><Layers3 size={20} /></span>
          Team DeCo
        </Link>
        <div className="login-icon">
          <LockKeyhole size={24} />
        </div>
        <div className="eyebrow">RESTRICTED ACCESS</div>
        <h1>Management<br /><span>console.</span></h1>
        <p>Sign in to manage projects and publish client updates.</p>

        {error && (
          <div style={{
            background: "#fef2f2",
            border: "1px solid #fee2e2",
            color: "#dc2626",
            padding: "12px 14px",
            borderRadius: "12px",
            fontSize: "12px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginTop: "16px"
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form action={loginAction} className="login-form">
          <label htmlFor="userId">User ID or Email</label>
          <input
            id="userId"
            name="userId"
            placeholder="e.g. deco-admin"
            defaultValue="deco-admin"
            required
            autoComplete="username"
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Admin password"
            defaultValue="deco2026!"
            required
            autoComplete="current-password"
          />

          <button className="button button-dark full-width" type="submit">
            Sign in <ArrowUpRight size={16} />
          </button>
        </form>

        <div style={{
          marginTop: "18px",
          padding: "12px 14px",
          background: "#f8f9fa",
          borderRadius: "12px",
          border: "1px solid var(--line)",
          fontSize: "11px",
          color: "var(--muted)",
          lineHeight: "1.6"
        }}>
          <strong style={{ color: "var(--ink)", display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
            <ShieldCheck size={14} style={{ color: "var(--blue)" }} /> Local Admin Credentials:
          </strong>
          <div>User ID: <code style={{ background: "#fff", padding: "2px 5px", borderRadius: "4px", border: "1px solid var(--line)" }}>deco-admin</code></div>
          <div>Password: <code style={{ background: "#fff", padding: "2px 5px", borderRadius: "4px", border: "1px solid var(--line)" }}>deco2026!</code></div>
          <small style={{ display: "block", marginTop: "4px", color: "#858c96" }}>Configured in <code>.env.local</code></small>
        </div>

        <Link className="back-link" href="/">
          ← Back to Team DeCo
        </Link>
      </div>
    </main>
  );
}

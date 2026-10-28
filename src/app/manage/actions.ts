"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { setAdminSession, clearAdminSession, verifyAdminSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function loginAction(formData: FormData) {
  const userId = (formData.get("userId") as string || "").trim();
  const password = (formData.get("password") as string || "").trim();

  if (!userId || !password) {
    redirect("/manage?error=" + encodeURIComponent("User ID and password are required."));
  }

  const expectedUser = process.env.ADMIN_USER_ID || "deco-admin";
  const expectedPass = process.env.ADMIN_PASSWORD || "deco2026!";

  // 1. Check against local admin credentials in .env.local
  if (userId === expectedUser && password === expectedPass) {
    await setAdminSession(userId);
    redirect("/manage/dashboard");
  }

  // 2. Check against Supabase Auth (if email & password user exists)
  try {
    const supabase = await createClient();
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userId,
        password: password,
      });

      if (!error && data.user) {
        await setAdminSession(data.user.email || userId);
        redirect("/manage/dashboard");
      }
    }
  } catch (err) {
    console.error("Supabase auth error:", err);
  }

  redirect("/manage?error=" + encodeURIComponent("Invalid admin credentials. Please check your user ID and password."));
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/manage");
}

export async function createProjectAction(formData: FormData) {
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) {
    redirect("/manage?error=" + encodeURIComponent("Session expired. Please sign in again."));
  }

  const rawId = (formData.get("id") as string || "").trim().toUpperCase();
  const name = (formData.get("name") as string || "").trim();
  const status = (formData.get("status") as string || "In progress").trim();
  const progress = parseInt(formData.get("progress") as string || "0", 10);
  let rawUrl = (formData.get("url") as string || "").trim();
  if (rawUrl && !/^https?:\/\//i.test(rawUrl)) {
    rawUrl = `https://${rawUrl}`;
  }
  const url = rawUrl || "https://vercel.com";
  const updateTitle = (formData.get("updateTitle") as string || "Project kick-off").trim();
  const updateNotes = (formData.get("updateNotes") as string || "Work has officially started on this project.").trim();
  const nextMeeting = (formData.get("nextMeeting") as string || "").trim();

  if (!rawId || !name) {
    redirect("/manage/dashboard?error=" + encodeURIComponent("Project ID and Name are required."));
  }

  const supabase = await createClient();
  if (!supabase) {
    redirect("/manage/dashboard?error=" + encodeURIComponent("Supabase is not configured yet. Add your credentials to .env.local first."));
  }

  const projectPayload: Record<string, unknown> = {
    id: rawId,
    name,
    status,
    progress: isNaN(progress) ? 0 : Math.min(100, Math.max(0, progress)),
    updated_label: "Updated by admin",
    url,
    update_title: updateTitle,
    update_notes: updateNotes,
  };
  if (nextMeeting) {
    projectPayload.next_meeting = nextMeeting;
  }

  let { error: insertError } = await supabase.from("projects").insert(projectPayload);

  if (insertError && insertError.message.includes("next_meeting")) {
    delete projectPayload.next_meeting;
    const retry = await supabase.from("projects").insert(projectPayload);
    insertError = retry.error;
  }

  if (insertError) {
    redirect("/manage/dashboard?error=" + encodeURIComponent(insertError.message));
  }

  // Seed default 5 milestone phases
  const defaultMilestones = [
    { project_id: rawId, name: "Discovery & requirements", phase: "Phase 01", state: "done", detail: "Scope and deliverables confirmed", order_index: 1 },
    { project_id: rawId, name: "UI/UX design", phase: "Phase 02", state: "active", detail: "Visual direction and prototypes", order_index: 2 },
    { project_id: rawId, name: "Development", phase: "Phase 03", state: "upcoming", detail: "Frontend & backend engineering", order_index: 3 },
    { project_id: rawId, name: "Testing & quality assurance", phase: "Phase 04", state: "upcoming", detail: "Cross-device verification", order_index: 4 },
    { project_id: rawId, name: "Final delivery", phase: "Phase 05", state: "upcoming", detail: "Deployment and handover", order_index: 5 },
  ];

  await supabase.from("milestones").insert(defaultMilestones);

  revalidatePath("/client/project");
  revalidatePath("/manage/dashboard");
  redirect("/manage/dashboard?success=" + encodeURIComponent(`Project ${rawId} created successfully!`));
}

export async function updateProjectAction(formData: FormData) {
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) {
    redirect("/manage?error=" + encodeURIComponent("Session expired. Please sign in again."));
  }

  const id = (formData.get("id") as string || "").trim().toUpperCase();
  const name = (formData.get("name") as string || "").trim();
  const status = (formData.get("status") as string || "In progress").trim();
  const progress = parseInt(formData.get("progress") as string || "0", 10);
  const rawEditUrl = (formData.get("url") as string || "").trim();
  const updateTitle = (formData.get("updateTitle") as string || "").trim();
  const updateNotes = (formData.get("updateNotes") as string || "").trim();
  const nextMeeting = (formData.get("nextMeeting") as string || "").trim();

  const supabase = await createClient();
  if (!supabase) {
    redirect("/manage/dashboard?error=" + encodeURIComponent("Supabase is not configured in .env.local."));
  }

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
    updated_label: `Updated on ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
  };

  if (name) updateData.name = name;
  if (status) updateData.status = status;
  if (!isNaN(progress)) updateData.progress = Math.min(100, Math.max(0, progress));
  if (rawEditUrl) {
    const formattedUrl = /^https?:\/\//i.test(rawEditUrl) ? rawEditUrl : `https://${rawEditUrl}`;
    updateData.url = formattedUrl;
  }
  if (updateTitle) updateData.update_title = updateTitle;
  if (updateNotes) updateData.update_notes = updateNotes;
  if (formData.has("nextMeeting")) {
    updateData.next_meeting = nextMeeting || null;
  }

  let { error } = await supabase.from("projects").update(updateData).eq("id", id);

  if (error && error.message.includes("next_meeting")) {
    delete updateData.next_meeting;
    const retry = await supabase.from("projects").update(updateData).eq("id", id);
    if (!retry.error) {
      redirect("/manage/dashboard?error=" + encodeURIComponent("Saved updates, but please run: ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS next_meeting text; in your Supabase SQL editor to enable Next Meeting dates."));
    }
    error = retry.error;
  }

  if (error) {
    redirect("/manage/dashboard?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/client/project");
  revalidatePath("/manage/dashboard");
  redirect("/manage/dashboard?success=" + encodeURIComponent(`Project ${id} updated successfully!`));
}

export async function deleteProjectAction(formData: FormData) {
  const isAuthenticated = await verifyAdminSession();
  if (!isAuthenticated) {
    redirect("/manage?error=" + encodeURIComponent("Session expired. Please sign in again."));
  }

  const id = (formData.get("id") as string || "").trim().toUpperCase();
  const supabase = await createClient();
  if (!supabase) {
    redirect("/manage/dashboard?error=" + encodeURIComponent("Supabase is not configured."));
  }

  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) {
    redirect("/manage/dashboard?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/client/project");
  revalidatePath("/manage/dashboard");
  redirect("/manage/dashboard?success=" + encodeURIComponent(`Project ${id} deleted.`));
}

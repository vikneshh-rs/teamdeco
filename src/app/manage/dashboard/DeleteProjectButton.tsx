"use client";

import { Trash2 } from "lucide-react";
import { deleteProjectAction } from "../actions";

export function DeleteProjectButton({ projectId }: { projectId: string }) {
  return (
    <form
      action={deleteProjectAction}
      onSubmit={(e) => {
        if (!confirm(`Are you sure you want to delete project ${projectId}?`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={projectId} />
      <button
        type="submit"
        className="button"
        title="Delete project"
        style={{
          background: "#fff1f1",
          color: "#c0392b",
          padding: "9px 14px",
          fontSize: "11px",
          border: "1px solid #ffd4d4",
          cursor: "pointer",
        }}
      >
        <Trash2 size={13} />
      </button>
    </form>
  );
}

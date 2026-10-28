export interface Milestone {
  id?: string;
  project_id?: string;
  name: string;
  phase: string;
  state: "done" | "active" | "upcoming";
  detail: string;
  order_index?: number;
}

export interface Project {
  id: string;
  name: string;
  status: string;
  progress: number;
  updated_label: string;
  url: string;
  update_title: string;
  update_notes: string;
  next_meeting?: string;
  created_at?: string;
  updated_at?: string;
  milestones?: Milestone[];
}

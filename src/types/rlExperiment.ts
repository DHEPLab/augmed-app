export type ExperimentStatus = "active" | "paused" | "completed" | "archived";

export interface ArmConfig {
  name: string;
  path_config?: Array<{ path: string }>;
}

export interface CasePoolEntry {
  user_email: string;
  case_id: number;
}

export interface Experiment {
  id: number;
  experiment_id: string;
  name: string;
  description: string | null;
  status: ExperimentStatus;
  arms: ArmConfig[];
  case_pool: CasePoolEntry[] | null;
  created_at: string;
  updated_at: string;
}

export interface RlRun {
  id: number;
  experiment_id: string;
  model_version: string | null;
  status: string;
  triggered_by: string;
  configs_generated: number | null;
  answers_consumed: number | null;
  started_at: string | null;
  completed_at: string | null;
  run_params: Record<string, unknown> | null;
}

import { request } from "./api";
import type { AxiosResponse } from "axios";
import type { Experiment, ExperimentStatus, RlRun, ArmConfig, CasePoolEntry } from "../types/rlExperiment";

interface ApiData<T> {
  data: T;
}

export const listExperiments = async (
  status?: ExperimentStatus,
): Promise<AxiosResponse<ApiData<{ experiments: Experiment[] }>>> => {
  const params = status ? `?status=${status}` : "";
  return await request<ApiData<{ experiments: Experiment[] }>>(`/v1/experiments${params}`, {
    method: "GET",
  });
};

export const getExperiment = async (
  experimentId: string,
): Promise<AxiosResponse<ApiData<Experiment>>> => {
  return await request<ApiData<Experiment>>(`/v1/experiments/${experimentId}`, {
    method: "GET",
  });
};

export const createExperiment = async (data: {
  name: string;
  arms: ArmConfig[];
  description?: string;
  case_pool?: CasePoolEntry[];
}): Promise<AxiosResponse<ApiData<Experiment>>> => {
  return await request<ApiData<Experiment>>("/v1/experiments", {
    method: "POST",
    data,
  });
};

export const updateExperimentStatus = async (
  experimentId: string,
  status: ExperimentStatus,
): Promise<AxiosResponse<ApiData<Experiment>>> => {
  return await request<ApiData<Experiment>>(`/v1/experiments/${experimentId}/status`, {
    method: "PATCH",
    data: { status },
  });
};

export const listRlRuns = async (
  experimentId: string,
): Promise<AxiosResponse<ApiData<{ runs: RlRun[] }>>> => {
  return await request<ApiData<{ runs: RlRun[] }>>(`/v1/experiments/${experimentId}/runs`, {
    method: "GET",
  });
};

export const triggerRlRun = async (
  experimentId: string,
  triggeredBy = "manual",
): Promise<AxiosResponse<ApiData<RlRun>>> => {
  return await request<ApiData<RlRun>>(`/v1/experiments/${experimentId}/runs`, {
    method: "POST",
    data: { triggered_by: triggeredBy },
  });
};

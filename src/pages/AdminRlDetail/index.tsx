import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRequest } from "ahooks";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  ArrowBack,
  Pause,
  PlayArrow,
  Refresh,
  RocketLaunch,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";

import {
  getExperiment,
  listRlRuns,
  updateExperimentStatus,
  triggerRlRun,
} from "../../services/rlExperimentService";
import type { ExperimentStatus } from "../../types/rlExperiment";
import Loading from "../../components/Loading";
import styles from "./index.module.scss";

const STATUS_COLORS: Record<ExperimentStatus, "success" | "warning" | "default" | "info"> = {
  active: "success",
  paused: "warning",
  completed: "default",
  archived: "info",
};

const AdminRlDetailPage = () => {
  const { experimentId } = useParams<{ experimentId: string }>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const {
    loading: expLoading,
    data: expData,
    run: refreshExperiment,
  } = useRequest(() => getExperiment(experimentId!), {
    ready: !!experimentId,
    onError: (err) => {
      enqueueSnackbar(`Failed to load experiment: ${err.message}`, { variant: "error" });
    },
  });

  const {
    loading: runsLoading,
    data: runsData,
    run: refreshRuns,
  } = useRequest(() => listRlRuns(experimentId!), {
    ready: !!experimentId,
    onError: (err) => {
      enqueueSnackbar(`Failed to load runs: ${err.message}`, { variant: "error" });
    },
  });

  const experiment = expData?.data?.data;
  const runs = runsData?.data?.data?.runs ?? [];

  const handleStatusChange = async (newStatus: ExperimentStatus) => {
    try {
      await updateExperimentStatus(experimentId!, newStatus);
      enqueueSnackbar(`Experiment ${newStatus}`, { variant: "success" });
      refreshExperiment();
    } catch (err: any) {
      enqueueSnackbar(`Failed: ${err.message}`, { variant: "error" });
    }
  };

  const handleTriggerRun = async () => {
    try {
      await triggerRlRun(experimentId!, "admin_panel");
      enqueueSnackbar("RL cycle triggered", { variant: "success" });
      refreshRuns();
    } catch (err: any) {
      enqueueSnackbar(`Failed to trigger run: ${err.message}`, { variant: "error" });
    }
  };

  const handleRefresh = () => {
    refreshExperiment();
    refreshRuns();
  };

  return (
    <div className={styles.container}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <IconButton onClick={() => navigate("/admin/rl")}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h5" fontWeight={600}>
          Experiment Detail
        </Typography>
        <IconButton onClick={handleRefresh} title="Refresh">
          <Refresh />
        </IconButton>
      </Box>

      <Loading loading={expLoading}>
        {experiment && (
          <>
            <Card elevation={1} sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 2 }}>
                  <Box>
                    <Typography variant="h6">{experiment.name}</Typography>
                    <Typography variant="body2" fontFamily="monospace" color="text.secondary">
                      {experiment.experiment_id}
                    </Typography>
                    {experiment.description && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {experiment.description}
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <Chip
                      label={experiment.status}
                      color={STATUS_COLORS[experiment.status]}
                    />
                    {experiment.status === "active" && (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Pause />}
                        onClick={() => handleStatusChange("paused")}
                      >
                        Pause
                      </Button>
                    )}
                    {experiment.status === "paused" && (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<PlayArrow />}
                        onClick={() => handleStatusChange("active")}
                      >
                        Resume
                      </Button>
                    )}
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Arms</Typography>
                    <Box sx={{ display: "flex", gap: 0.5, mt: 0.5 }}>
                      {experiment.arms?.map((arm) => (
                        <Chip key={arm.name} label={arm.name} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Case Pool Size</Typography>
                    <Typography variant="body1">{experiment.case_pool?.length ?? 0}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Created</Typography>
                    <Typography variant="body1">
                      {new Date(experiment.created_at).toLocaleString()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Last Updated</Typography>
                    <Typography variant="body1">
                      {new Date(experiment.updated_at).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* RL Runs Section */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
              <Typography variant="h6">RL Runs</Typography>
              <Button
                variant="contained"
                size="small"
                startIcon={<RocketLaunch />}
                disabled={experiment.status !== "active"}
                sx={{ backgroundColor: "#A8E3BD", color: "#303230", "&:hover": { backgroundColor: "#8CD4A5" } }}
                onClick={handleTriggerRun}
              >
                Run Cycle Now
              </Button>
            </Box>

            <Loading loading={runsLoading}>
              <TableContainer component={Paper} elevation={1}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                      <TableCell><strong>Run ID</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                      <TableCell><strong>Triggered By</strong></TableCell>
                      <TableCell align="center"><strong>Answers</strong></TableCell>
                      <TableCell align="center"><strong>Configs</strong></TableCell>
                      <TableCell><strong>Started</strong></TableCell>
                      <TableCell><strong>Completed</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {runs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 3, color: "#999" }}>
                          No runs yet. Trigger the first RL cycle above.
                        </TableCell>
                      </TableRow>
                    ) : (
                      runs.map((run) => (
                        <TableRow key={run.id}>
                          <TableCell>
                            <Typography variant="body2" fontFamily="monospace" fontSize={13}>
                              #{run.id}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={run.status}
                              size="small"
                              color={run.status === "completed" ? "success" : run.status === "failed" ? "error" : "default"}
                            />
                          </TableCell>
                          <TableCell>{run.triggered_by}</TableCell>
                          <TableCell align="center">{run.answers_consumed ?? "-"}</TableCell>
                          <TableCell align="center">{run.configs_generated ?? "-"}</TableCell>
                          <TableCell>
                            {run.started_at ? new Date(run.started_at).toLocaleString() : "-"}
                          </TableCell>
                          <TableCell>
                            {run.completed_at ? new Date(run.completed_at).toLocaleString() : "-"}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Loading>
          </>
        )}
      </Loading>
    </div>
  );
};

export default AdminRlDetailPage;

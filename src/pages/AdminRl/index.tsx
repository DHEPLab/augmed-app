import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRequest } from "ahooks";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import { Add, Refresh, Science } from "@mui/icons-material";
import { useSnackbar } from "notistack";

import { listExperiments } from "../../services/rlExperimentService";
import type { ExperimentStatus } from "../../types/rlExperiment";
import Loading from "../../components/Loading";
import styles from "./index.module.scss";

const STATUS_COLORS: Record<ExperimentStatus, "success" | "warning" | "default" | "info"> = {
  active: "success",
  paused: "warning",
  completed: "default",
  archived: "info",
};

const AdminRlPage = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [statusFilter, setStatusFilter] = useState<ExperimentStatus | "">("");

  const { loading, data, run } = useRequest(
    () => listExperiments(statusFilter || undefined),
    {
      refreshDeps: [statusFilter],
      onError: (err) => {
        enqueueSnackbar(`Failed to load experiments: ${err.message}`, { variant: "error" });
      },
    },
  );

  const experiments = data?.data?.data?.experiments ?? [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Science sx={{ fontSize: 28, color: "#A8E3BD" }} />
          <Typography variant="h5" fontWeight={600}>
            RL Experiments
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value as ExperimentStatus | "")}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="paused">Paused</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="archived">Archived</MenuItem>
            </Select>
          </FormControl>
          <IconButton onClick={() => run()} title="Refresh">
            <Refresh />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{ backgroundColor: "#A8E3BD", color: "#303230", "&:hover": { backgroundColor: "#8CD4A5" } }}
            onClick={() => enqueueSnackbar("Experiment creation coming soon", { variant: "info" })}
          >
            New Experiment
          </Button>
        </Box>
      </div>

      <Loading loading={loading}>
        <TableContainer component={Paper} elevation={1} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell><strong>Experiment ID</strong></TableCell>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell align="center"><strong>Arms</strong></TableCell>
                <TableCell align="center"><strong>Case Pool</strong></TableCell>
                <TableCell><strong>Created</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {experiments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4, color: "#999" }}>
                    No experiments found. Create one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                experiments.map((exp) => (
                  <TableRow
                    key={exp.experiment_id}
                    hover
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate(`/admin/rl/${exp.experiment_id}`)}
                  >
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace" fontSize={13}>
                        {exp.experiment_id}
                      </Typography>
                    </TableCell>
                    <TableCell>{exp.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={exp.status}
                        size="small"
                        color={STATUS_COLORS[exp.status]}
                      />
                    </TableCell>
                    <TableCell align="center">{exp.arms?.length ?? 0}</TableCell>
                    <TableCell align="center">{exp.case_pool?.length ?? 0}</TableCell>
                    <TableCell>
                      {new Date(exp.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Loading>
    </div>
  );
};

export default AdminRlPage;

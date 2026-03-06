import React, { useCallback, useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { CloudUpload, Preview, Upload } from "@mui/icons-material";
import { useSnackbar } from "notistack";

import { instance } from "../../services/api";
import styles from "./index.module.scss";

interface ConfigPreview {
  user_email: string;
  case_id: number;
  path_config: Array<{ path: string; style?: Record<string, unknown> }>;
  experiment_id: string | null;
  arm: string | null;
  policy_id: string | null;
}

interface PreviewResult {
  configs: ConfigPreview[];
  total: number;
  users: string[];
  cases: number[];
}

interface UploadResult {
  results: Array<{ user_email: string; case_id: number; status: string }>;
  summary: { total: number; created: number; updated: number };
}

const AdminUploadPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [experimentId, setExperimentId] = useState("");
  const [arm, setArm] = useState("");
  const [policyId, setPolicyId] = useState("");
  const [preview, setPreview] = useState<PreviewResult | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = useCallback((selectedFile: File) => {
    if (!selectedFile.name.endsWith(".csv")) {
      enqueueSnackbar("Please select a CSV file", { variant: "error" });
      return;
    }
    setFile(selectedFile);
    setPreview(null);
    setUploadResult(null);
  }, [enqueueSnackbar]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      if (e.dataTransfer.files?.[0]) {
        handleFileSelect(e.dataTransfer.files[0]);
      }
    },
    [handleFileSelect],
  );

  const handlePreview = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await instance.post("/admin/config/upload/preview", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPreview(response.data?.data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Preview failed";
      enqueueSnackbar(message, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (experimentId) formData.append("experiment_id", experimentId);
      if (arm) formData.append("arm", arm);
      if (policyId) formData.append("policy_id", policyId);

      const response = await instance.post("/admin/config/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadResult(response.data?.data);
      enqueueSnackbar(
        `Upload complete: ${response.data?.data?.summary?.created} created, ${response.data?.data?.summary?.updated} updated`,
        { variant: "success" },
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed";
      enqueueSnackbar(message, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CloudUpload sx={{ fontSize: 28, color: "#A8E3BD" }} />
          <Typography variant="h5" fontWeight={600}>
            Upload Display Configs
          </Typography>
        </Box>
      </div>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Upload a CSV file to assign case display configurations to participants.
        Format: User, Case No., Path, Collapse, Highlight, Top (optional: Experiment, Arm, Policy)
      </Typography>

      {/* File drop zone */}
      <Box sx={{ mt: 3 }}>
        <div
          className={`${styles.dropzone} ${dragActive ? styles.active : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload sx={{ fontSize: 48, color: "#999", mb: 1 }} />
          <Typography variant="body1" color="text.secondary">
            {file ? file.name : "Drop a CSV file here, or click to select"}
          </Typography>
          {file && (
            <Typography variant="caption" color="text.secondary">
              {(file.size / 1024).toFixed(1)} KB
            </Typography>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          style={{ display: "none" }}
          onChange={(e) => {
            if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
          }}
        />
      </Box>

      {/* Metadata fields */}
      <div className={styles.metadataFields}>
        <TextField
          size="small"
          label="Experiment ID"
          value={experimentId}
          onChange={(e) => setExperimentId(e.target.value)}
          helperText="Optional — overrides CSV column"
        />
        <TextField
          size="small"
          label="Arm"
          value={arm}
          onChange={(e) => setArm(e.target.value)}
          helperText="Optional — e.g., learned_policy"
        />
        <TextField
          size="small"
          label="Policy ID"
          value={policyId}
          onChange={(e) => setPolicyId(e.target.value)}
          helperText="Optional — e.g., thompson_v1"
        />
      </div>

      {/* Action buttons */}
      <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
        <Button
          variant="outlined"
          startIcon={<Preview />}
          onClick={handlePreview}
          disabled={!file || loading}
        >
          Preview
        </Button>
        <Button
          variant="contained"
          startIcon={<CloudUpload />}
          onClick={handleUpload}
          disabled={!file || loading}
          sx={{ backgroundColor: "#A8E3BD", color: "#303230", "&:hover": { backgroundColor: "#8CD4A5" } }}
        >
          Upload
        </Button>
      </Box>

      {/* Preview results */}
      {preview && (
        <Card sx={{ mt: 3 }} elevation={1}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Preview: {preview.total} config(s)
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
              <Chip label={`${preview.users.length} user(s)`} size="small" />
              <Chip label={`${preview.cases.length} case(s)`} size="small" />
            </Box>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell><strong>User</strong></TableCell>
                    <TableCell><strong>Case</strong></TableCell>
                    <TableCell align="center"><strong>Paths</strong></TableCell>
                    <TableCell><strong>Experiment</strong></TableCell>
                    <TableCell><strong>Arm</strong></TableCell>
                    <TableCell><strong>Policy</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {preview.configs.map((config, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{config.user_email}</TableCell>
                      <TableCell>{config.case_id}</TableCell>
                      <TableCell align="center">{config.path_config?.length ?? 0}</TableCell>
                      <TableCell>{config.experiment_id ?? "-"}</TableCell>
                      <TableCell>{config.arm ?? "-"}</TableCell>
                      <TableCell>{config.policy_id ?? "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Upload results */}
      {uploadResult && (
        <Card sx={{ mt: 3 }} elevation={1}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Upload Results
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <Chip label={`${uploadResult.summary.created} created`} color="success" size="small" />
              <Chip label={`${uploadResult.summary.updated} updated`} color="info" size="small" />
              <Chip label={`${uploadResult.summary.total} total`} size="small" />
            </Box>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell><strong>User</strong></TableCell>
                    <TableCell><strong>Case</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {uploadResult.results.map((r, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{r.user_email}</TableCell>
                      <TableCell>{r.case_id}</TableCell>
                      <TableCell>
                        <Chip
                          label={r.status}
                          size="small"
                          color={r.status === "created" ? "success" : "info"}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminUploadPage;

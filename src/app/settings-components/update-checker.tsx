import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, LinearProgress, TextField, Typography } from '@mui/material';

interface UpdateManifest {
  version: string;
  mandatory?: boolean;
  notes?: string;
  channel?: string;
}

const DEFAULT_MANIFEST_URL = '';

const UpdateChecker: React.FC = () => {
  const [manifestUrl, setManifestUrl] = useState(DEFAULT_MANIFEST_URL);
  const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'not-available' | 'downloading' | 'downloaded' | 'error'>('idle');
  const [manifest, setManifest] = useState<UpdateManifest | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    // Listen for update events from main
    window.api.onUpdateEvent((evt) => {
      if (!evt) return;
      switch (evt.type) {
        case 'download-progress':
          setStatus('downloading');
          setProgress(Math.round(evt.progress.percent || 0));
          break;
        case 'update-downloaded':
          setStatus('downloaded');
          setOpenDialog(true);
          break;
        case 'error':
          setStatus('error');
          setError(evt.message || 'Unknown error');
          break;
        default:
          break;
      }
    });
  }, []);

  const checkForUpdates = async () => {
    setStatus('checking');
    setError(null);
    try {
      const res = await window.api.checkForUpdates(manifestUrl || undefined);
      if (!res.success) {
        setStatus('error');
        setError(res.error || 'Failed to check for updates');
        return;
      }
      if (res.updateAvailable) {
        setManifest(res.manifest);
        setStatus('available');
        setOpenDialog(true);
      } else if (res.updateInfo) {
        // autoUpdater path
        setStatus('available');
        setManifest({ version: res.updateInfo.updateInfo?.version || '' });
        setOpenDialog(true);
      } else {
        setStatus('not-available');
      }
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const startDownload = async () => {
    setStatus('downloading');
    const res = await window.api.downloadUpdate();
    if (!res.success) {
      setStatus('error');
      setError(res.error || 'Failed to start download');
    }
  };

  const applyUpdate = async () => {
    await window.api.quitAndInstall();
  };

  const handleDialogClose = () => {
    // If update is mandatory, do not allow close
    if (manifest?.mandatory) return;
    setOpenDialog(false);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Application Updates
      </Typography>
      <Box display="flex" gap={2} alignItems="center">
        <TextField label="Manifest URL (optional)" size="small" value={manifestUrl} onChange={(e) => setManifestUrl(e.target.value)} sx={{ minWidth: 400 }} />
        <Button variant="contained" onClick={checkForUpdates}>Check for updates</Button>
      </Box>
      <Box mt={2}>
        <Typography variant="body2">Status: {status}</Typography>
        {status === 'downloading' && <LinearProgress variant="determinate" value={progress} />}
        {status === 'error' && <Typography color="error">{error}</Typography>}
      </Box>

      <Dialog open={openDialog} onClose={handleDialogClose} disableEscapeKeyDown={!!manifest?.mandatory}>
        <DialogTitle>{manifest?.mandatory ? 'Mandatory Update Available' : 'Update Available'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            A new version ({manifest?.version}) is available.
          </DialogContentText>
          {manifest?.notes && <DialogContentText>{manifest.notes}</DialogContentText>}
          {status === 'downloading' && <LinearProgress variant="determinate" value={progress} />}
        </DialogContent>
        <DialogActions>
          {!manifest?.mandatory && <Button onClick={() => setOpenDialog(false)}>Later</Button>}
          {status === 'available' && <Button onClick={startDownload} variant="contained">Download and Install</Button>}
          {status === 'downloaded' && <Button onClick={applyUpdate} variant="contained">Restart and Install</Button>}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UpdateChecker;

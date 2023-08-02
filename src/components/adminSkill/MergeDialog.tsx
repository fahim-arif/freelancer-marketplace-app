import { Forward } from '@mui/icons-material';
import { Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Stack } from '@mui/system';
import { ISkill } from 'global/interfaces/skill';
import { useState } from 'react';

interface IMergeDialogProps {
  open: boolean;
  source: ISkill;
  target: ISkill;
  merge: (source: ISkill, target: ISkill) => Promise<void>;
  onCancel: () => void;
}

export const MergeDialog = ({ open, source, target, merge, onCancel }: IMergeDialogProps) => {
  const [saving, setSaving] = useState(false);

  const handleMerge = async () => {
    setSaving(true);
    await merge(source, target);
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Merge</DialogTitle>
      <DialogContent>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Chip label={source.value} sx={{ textDecoration: 'line-through' }} />
          <Forward color="primary" />
          <Chip label={target.value} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleMerge}
          autoFocus
          endIcon={saving ? <CircularProgress color="info" size={20} /> : undefined}
        >
          Merge
        </Button>
      </DialogActions>
    </Dialog>
  );
};

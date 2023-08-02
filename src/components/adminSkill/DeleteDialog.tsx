import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { ISkill } from 'global/interfaces/skill';
import { useState } from 'react';

interface IDeleteDialogProps {
  open: boolean;
  skill: ISkill;
  deleteSkill: (skill: ISkill) => Promise<boolean>;
  onCancel: () => void;
}

export const DeleteDialog = ({ open, skill, deleteSkill, onCancel }: IDeleteDialogProps) => {
  const [saving, setSaving] = useState(false);

  const handleDelete = async () => {
    setSaving(true);
    await deleteSkill(skill);
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Delete this skill?</DialogTitle>
      <DialogContent>The skill will be deleted and un-assigned from every user.</DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleDelete}
          autoFocus
          color="error"
          endIcon={saving ? <CircularProgress color="info" size={20} /> : undefined}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

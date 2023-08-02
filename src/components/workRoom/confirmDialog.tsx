import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

interface IConfirmDialogProps {
  open: boolean;
  setOpen: React.Dispatch<boolean>;
  onConfirm: () => void | ((selectedThreadId: string, recipientUserId: string) => void);
  title: string;
  content: string;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<IConfirmDialogProps> = ({ open, title, content, onConfirm, onCancel }) => (
  <Dialog open={open}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>{content}</DialogContent>
    <DialogActions>
      <Button onClick={onCancel}>Cancel</Button>
      <Button variant="contained" onClick={onConfirm} autoFocus color="error">
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);

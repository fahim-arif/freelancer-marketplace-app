import React from 'react';
import { Box } from '@mui/system';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormControlLabel from '@mui/material/FormControlLabel';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import MonthSelect from 'components/common/Select/MonthSelect';
import YearSelect from 'components/common/Select/YearSelect';
import { IWorkHistory } from 'global/interfaces/user';
import { useFormik } from 'formik';
import { workHistoryValidation } from 'global/validations/user';
import NoWorkHistoryIcon from 'components/common/StyledIcons/NoWorkHistoryIcon';
import { FormHelperText } from '@mui/material';
import { getHistoryDateString } from 'utils/workHistoryHelper';

interface IWorkHistoryProps {
  workHistories: IWorkHistory[];
  onUpdateHistories: (histories: IWorkHistory[]) => void;
  error: boolean;
}

export default function WorkHistoryEditor(props: IWorkHistoryProps): JSX.Element {
  const [open, setOpen] = React.useState<boolean>(false);
  const [editIndex, setEditIndex] = React.useState<number>(-1);

  const form = useFormik<IWorkHistory>({
    initialValues: {
      company: '',
      title: '',
      fromMonth: 0,
      fromYear: 0,
      toMonth: 0,
      toYear: 0,
      isPresentPosition: false,
    },
    validationSchema: workHistoryValidation,
    onSubmit: (values: IWorkHistory) => {
      if (editIndex !== -1) {
        props.workHistories[editIndex] = values;
        props.onUpdateHistories([...props.workHistories]);
        setEditIndex(-1);
      } else {
        props.onUpdateHistories([...props.workHistories, values]);
      }
      form.resetForm();
      setOpen(false);
    },
  });

  const handleClickOpen = (index = -1): void => {
    if (index > -1) {
      form.setValues({ ...props.workHistories[index] });
      setEditIndex(index);
    }
    setOpen(true);
  };

  const handleClose = (): void => {
    form.resetForm();
    setEditIndex(-1);
    setOpen(false);
  };

  const getAvatarText = (history: IWorkHistory): string => history.company[0];

  const handleDelete = (index: number): void => {
    props.workHistories.splice(index, 1);
    props.onUpdateHistories(props.workHistories);
  };

  return (
    <React.Fragment>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={12} md={12}>
          <Button variant="outlined" component="label" onClick={() => handleClickOpen()}>
            Add
          </Button>
        </Grid>
      </Grid>
      {props.error && (
        <Grid sx={{ p: 1 }} item xs={12}>
          <FormHelperText error>At least one work history item must be added</FormHelperText>
        </Grid>
      )}
      <Stack direction="column" spacing={{ xs: 2 }} sx={{ p: 1 }}>
        {props.workHistories.map((history, index) => (
          <Box key={index}>
            <Stack direction="row" spacing={{ xs: 2 }}>
              <Avatar sx={{ width: 54, height: 54, bgcolor: 'primary.main', mt: 1.5 }}>{getAvatarText(history)}</Avatar>
              <Box>
                <Grid container spacing={0}>
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      <Grid item maxWidth={'75%'}>
                        <Typography variant="h6" component="div" align="left" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                          {history.company}
                        </Typography>
                      </Grid>
                      <Grid item width={'25%'}>
                        <Typography variant="h6" component="div">
                          <IconButton
                            aria-label="delete"
                            sx={{ width: 10, height: 10, mt: 1, mr: 1 }}
                            onClick={() => handleClickOpen(index)}
                          >
                            <EditOutlinedIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(index)}
                            aria-label="edit"
                            sx={{ width: 10, height: 10, mt: 1 }}
                          >
                            <HighlightOffIcon />
                          </IconButton>
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1" component="div" align="left" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                      {history.title}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1" component="div" align="left" sx={{ flexGrow: 1 }}>
                      {getHistoryDateString(history)}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Stack>
          </Box>
        ))}
      </Stack>

      {props.workHistories?.length === 0 && <NoWorkHistoryIcon></NoWorkHistoryIcon>}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="xs"
      >
        <form onSubmit={form.handleSubmit}>
          <DialogTitle>Work History Position</DialogTitle>
          <DialogContent>
            <TextField
              name="company"
              label="Company"
              value={form.values.company}
              onChange={form.handleChange}
              variant={'outlined'}
              error={form.touched.company !== undefined && Boolean(form.errors.company)}
              helperText={form.touched.company !== undefined ? form.errors.company : ''}
              margin="dense"
              fullWidth
            />
            <TextField
              name="title"
              label="Job Title"
              value={form.values.title}
              onChange={form.handleChange}
              variant={'outlined'}
              error={form.touched.title !== undefined && Boolean(form.errors.title)}
              helperText={form.touched.title !== undefined ? form.errors.title : ''}
              margin="dense"
              fullWidth
            />
            <Grid container spacing={1} sx={{ mt: 0.5 }}>
              <Grid item xs={6}>
                <MonthSelect
                  name="fromMonth"
                  value={form.values.fromMonth === 0 ? '' : form.values.fromMonth}
                  onChange={form.handleChange}
                  error={form.touched.fromMonth !== undefined && Boolean(form.errors.fromMonth)}
                  helpertext={form.touched.fromMonth !== undefined ? form.errors.fromMonth : ''}
                  label="From Month"
                />
              </Grid>
              <Grid item xs={6}>
                <YearSelect
                  name="fromYear"
                  value={form.values.fromYear === 0 ? '' : form.values.fromYear}
                  onChange={form.handleChange}
                  error={form.touched.fromYear !== undefined && Boolean(form.errors.fromYear)}
                  helpertext={form.touched.fromYear !== undefined ? form.errors.fromYear : ''}
                  label="From Year"
                />
              </Grid>
            </Grid>
            <Grid container spacing={1} sx={{ mt: 0.5 }}>
              <Grid item xs={6}>
                <MonthSelect
                  disabled={form.values.isPresentPosition}
                  name="toMonth"
                  value={form.values.toMonth === 0 ? '' : form.values.toMonth}
                  onChange={form.handleChange}
                  error={form.touched.toMonth !== undefined && Boolean(form.errors.toMonth)}
                  helpertext={form.touched.toMonth !== undefined ? form.errors.toMonth : ''}
                  label="To Month"
                />
              </Grid>
              <Grid item xs={6}>
                <YearSelect
                  disabled={form.values.isPresentPosition}
                  name="toYear"
                  value={form.values.toYear === 0 ? '' : form.values.toYear}
                  onChange={form.handleChange}
                  error={form.touched.toYear !== undefined && Boolean(form.errors.toYear)}
                  helpertext={form.touched.toYear !== undefined ? form.errors.toYear : ''}
                  label="To Year"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={form.handleChange}
                      name="isPresentPosition"
                      checked={form.values.isPresentPosition}
                      size="medium"
                    />
                  }
                  label="Present Position"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">OK</Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
}

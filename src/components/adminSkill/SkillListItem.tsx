import { Check, Close, DeleteForever, MoveDown } from '@mui/icons-material';
import { CircularProgress, Divider, IconButton, Paper, styled, TextField, Tooltip } from '@mui/material';
import { useFormik } from 'formik';
import { ISkill } from 'global/interfaces/skill';
import { useState } from 'react';
import { DeleteDialog } from './DeleteDialog';

interface ISkillListItemProps {
  skill: ISkill;
  saveSkill: (skill: ISkill) => Promise<ISkill>;
  onMergeStart?: (skill: ISkill) => void;
  onExpand: (skill: ISkill) => void;
  onCollapse: (skill: ISkill) => void;
  deleteSkill?: (skill: ISkill) => Promise<boolean>;
  editing: boolean;
  className?: string;
}

interface IEditSkillFormProps {
  skillValue: string;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  margin: theme.spacing(0.5),
  marginLeft: 0,
  marginRight: theme.spacing(1),
  padding: theme.spacing(1),
}));

const EditStyledPaper = styled(StyledPaper)(({ theme }) => ({
  borderColor: theme.palette.primary.main,
}));

const ViewStyledPaper = styled(StyledPaper)`
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const StyledForm = styled('form')`
  display: flex;
  align-items: center;
`;

const StyledTextField = styled(TextField)`
  margin-right: 2px;
`;

export const SkillListItem = ({
  skill,
  saveSkill,
  onMergeStart,
  onExpand,
  onCollapse,
  deleteSkill,
  editing,
  className,
}: ISkillListItemProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const form = useFormik<IEditSkillFormProps>({
    initialValues: {
      skillValue: skill.value,
    },
    onSubmit: async values => {
      await saveSkill({ ...skill, value: values.skillValue });
    },
  });

  const renderEditMode = () => (
    <EditStyledPaper key={skill.id} variant="outlined" className={className}>
      <StyledForm onSubmit={form.handleSubmit}>
        <StyledTextField
          name="skillValue"
          value={form.values.skillValue}
          onChange={form.handleChange}
          label=""
          placeholder="Skill value"
          hiddenLabel
          size="small"
          color="primary"
          inputProps={{
            sx: {
              paddingY: 0.5,
            },
          }}
        />

        {form.isSubmitting ? (
          <CircularProgress color="primary" size={16} />
        ) : (
          <Tooltip title="Save">
            <IconButton color="primary" size="small" type="submit">
              <Check />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title="Cancel">
          <IconButton
            color="secondary"
            size="small"
            onClick={() => {
              form.resetForm();
              onCollapse(skill);
            }}
          >
            <Close />
          </IconButton>
        </Tooltip>
        {(onMergeStart || deleteSkill) && <Divider orientation="vertical" variant="middle" flexItem />}
        {onMergeStart && (
          <Tooltip title="Merge & Delete">
            <IconButton color="warning" size="small" onClick={() => onMergeStart(skill)}>
              <MoveDown />
            </IconButton>
          </Tooltip>
        )}
        {deleteSkill && (
          <>
            <Tooltip title="Delete">
              <IconButton color="error" size="small" onClick={() => setIsDeleting(true)}>
                <DeleteForever />
              </IconButton>
            </Tooltip>
            {isDeleting && (
              <DeleteDialog
                open={isDeleting}
                skill={skill}
                deleteSkill={deleteSkill}
                onCancel={() => setIsDeleting(false)}
              />
            )}
          </>
        )}
      </StyledForm>
    </EditStyledPaper>
  );

  const renderViewMode = () => (
    <ViewStyledPaper key={skill.id} variant="outlined" onClick={() => onExpand(skill)} className={className}>
      {skill.value}
    </ViewStyledPaper>
  );

  return editing ? renderEditMode() : renderViewMode();
};

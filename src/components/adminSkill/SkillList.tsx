import { Add } from '@mui/icons-material';
import { Box, Button, styled } from '@mui/material';
import { ISkill } from 'global/interfaces/skill';
import { useState } from 'react';
import { MergeDialog } from './MergeDialog';
import { SkillListItem } from './SkillListItem';

interface ISkillListProps {
  skills: ISkill[];
  saveSkill: (skill: ISkill) => Promise<ISkill>;
  deleteSkill: (skill: ISkill) => Promise<boolean>;
  mergeSkills: (source: ISkill, target: ISkill) => Promise<void>;
}

interface IMergeProps {
  source?: ISkill;
  target?: ISkill;
}

const StyledSkillListItem = styled(SkillListItem)<{ isMergeSource: boolean; isMerging: boolean }>`
  ${({ theme, isMergeSource }) => (isMergeSource ? `border-color: ${theme.palette.warning.main};` : '')}
  &:hover {
    border-color: ${({ theme, isMerging }) => (isMerging ? theme.palette.warning.main : theme.palette.primary.main)};
  }
`;

const FlexBox = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin: 0;
`;

export const SkillList = ({ skills, saveSkill, mergeSkills, deleteSkill }: ISkillListProps) => {
  const [merge, setMerge] = useState<IMergeProps>({});
  const [editableItems, setEditableItems] = useState<{ [key: string]: boolean }>({});
  const [addingItem, setAddingItem] = useState(false);

  const handleExpand = (skill: ISkill) => {
    if (merge.source && merge.source.id != skill.id) {
      setMerge(currentMerge => ({ ...currentMerge, target: skill }));
    } else {
      if (merge.source) {
        setMerge({ source: undefined });
      }
      setEditableItems(items => ({
        ...items,
        [skill.id ?? '']: true,
      }));
    }
  };

  const handleCollapse = (skill: ISkill) => {
    setEditableItems(items => ({
      ...items,
      [skill.id ?? '']: false,
    }));
  };

  const handleAddSkill = () => {
    setAddingItem(true);
  };

  const updateSkill = async (skill: ISkill) => {
    const updatedSkill = await saveSkill(skill);
    setEditableItems(items => ({
      ...items,
      [skill.id ?? '']: false,
    }));
    return updatedSkill;
  };

  const addSkill = async (skill: ISkill) => {
    const createdSkill = await saveSkill(skill);
    setAddingItem(false);
    return createdSkill;
  };

  const handleMergeStart = (skill: ISkill) => {
    setMerge({ source: skill });
    setEditableItems(items => ({
      ...items,
      [skill.id ?? '']: false,
    }));
  };

  const handleMergeCancel = () => {
    setMerge({ source: undefined, target: undefined });
  };

  const handleMergeFinish = async (source: ISkill, target: ISkill) => {
    await mergeSkills(source, target);
    setMerge({});
  };

  const isMerging = merge.source != undefined;

  return (
    <FlexBox>
      {addingItem ? (
        <StyledSkillListItem
          key="new_item_id"
          skill={{ value: '' }}
          saveSkill={addSkill}
          onExpand={handleExpand}
          onCollapse={() => setAddingItem(false)}
          editing={true}
          isMerging={false}
          isMergeSource={true}
        />
      ) : (
        <Button variant="contained" endIcon={<Add />} size="medium" onClick={handleAddSkill} sx={{ mr: 1 }}>
          Add
        </Button>
      )}

      {skills.map(skill => (
        <StyledSkillListItem
          key={skill.id}
          skill={skill}
          saveSkill={updateSkill}
          onMergeStart={handleMergeStart}
          onExpand={handleExpand}
          onCollapse={handleCollapse}
          deleteSkill={deleteSkill}
          editing={skill.id ? editableItems[skill.id] : false}
          isMerging={isMerging}
          isMergeSource={merge.source?.id != undefined && skill.id != undefined && skill.id == merge.source.id}
        />
      ))}
      {merge.source != undefined && merge.target != undefined && (
        <MergeDialog
          open={true}
          onCancel={handleMergeCancel}
          merge={handleMergeFinish}
          source={merge.source}
          target={merge.target}
        />
      )}
    </FlexBox>
  );
};

import IApiError, { isApiError } from 'global/interfaces/api';
import { useEffect, useState } from 'react';
import { showUIError } from 'utils/errorHandler';
import { CircularProgress, Grid } from '@mui/material';
import { getSkills, mergeSkills, upsertSkill, deleteSkill } from 'services/skillService';
import { ISkill, ISkillFilters } from 'global/interfaces/skill';
import { SkillFilters } from 'components/adminSkill/SkillFilters';
import { SkillList } from 'components/adminSkill/SkillList';

const pageSize = 10000;

export const AdminSkills = () => {
  useEffect(() => {
    document.title = 'Admin - Skills';
  }, []);

  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState<ISkill[]>([]);
  const [filters, setFilters] = useState<ISkillFilters | null>(null);

  useEffect(() => {
    if (filters != null) {
      setLoading(true);
      getSkills({ ...filters, pageSize })
        .then((retrievedSkills: ISkill[]) => {
          setSkills([...retrievedSkills]);
          setLoading(false);
        })
        .catch((err: IApiError) => {
          showUIError(err.message);
        });
    }
  }, [filters]);

  const handleFilterChange = (filters: ISkillFilters) => {
    setFilters({ ...filters, pageNumber: 1 });
  };

  const handleSaveSkill = async (skill: ISkill) => {
    try {
      const upsertedSkill = await upsertSkill(skill);
      if (skill.id) {
        setSkills(currentSkills => currentSkills.map(skill => (skill.id == upsertedSkill.id ? upsertedSkill : skill)));
      } else {
        setSkills(currentSkills => [upsertedSkill, ...currentSkills]);
      }
      return upsertedSkill;
    } catch (e) {
      if (isApiError(e)) {
        showUIError(e.message);
      }
      throw e;
    }
  };

  const handleMergeSkills = async (source: ISkill, target: ISkill) => {
    try {
      await mergeSkills(source, target);
      setSkills(currentSkills => {
        const filteredSkills = currentSkills.filter(s => s.id != source.id);
        return [...filteredSkills];
      });
    } catch (e) {
      if (isApiError(e)) {
        showUIError(e.message);
      }
    }
  };

  const handleDeleteSkill = async (skill: ISkill) => {
    try {
      const deleted = await deleteSkill(skill);
      if (deleted) {
        setSkills(currentSkills => [...currentSkills.filter(s => s.id != skill.id)]);
      }
      return deleted;
    } catch (e) {
      if (isApiError(e)) {
        showUIError(e.message);
      }
      throw e;
    }
  };

  return (
    <Grid container sx={{ p: 1 }} margin={'auto'} maxWidth={'lg'}>
      <Grid item xs={12}>
        <SkillFilters onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item xs={12} sx={{ mt: 1 }}>
        <SkillList
          skills={skills}
          saveSkill={handleSaveSkill}
          mergeSkills={handleMergeSkills}
          deleteSkill={handleDeleteSkill}
        />
      </Grid>
      {loading && (
        <Grid item xs={12} sx={{ my: 1 }}>
          <CircularProgress />
        </Grid>
      )}
    </Grid>
  );
};

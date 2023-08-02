import { Button, FormGroup, Grid, Tooltip, styled } from '@mui/material';
import { FormikProps } from 'formik';
import { IFileMetadata } from 'global/interfaces/file';
import { IEditableUser, IUser } from 'global/interfaces/user';
import { useCallback, useEffect, useState } from 'react';
import { EditUserHeadSection } from './sections/EditUserHeadSection/EditUserHeadSection';
import { ISkillFilters, ISkill } from 'global/interfaces/skill';
import { VettingStatus } from 'global/enums/vettingStatus';
import { Send } from '@mui/icons-material';
import { MessagePublisherEventType } from 'global/enums/messagePublisherEventType';
import { useCustomEventListener } from 'react-custom-events';
import { nameof } from 'ts-simple-nameof';
import { EditPortfolioSection } from './sections/EditPortfolioSection';
import { EditWorkHistorySection } from './sections/EditWorkHistorySection/EditWorkHistorySection';
import { EditSellServicesSection } from './sections/EditSellServicesSection/EditSellServicesSection';
import { useDebouncedValidate } from '../../utils/formikDebounceValidation';

enum EditUserProfileSections {
  Head,
  Portfolio,
  WorkHistory,
  SellingServices,
}

const StyledForm = styled('form')`
  margin-top: 16px;
  margin-bottom: 16px;
`;

const SubmitButton = styled(Button)`
  color: ${({ theme }) => theme.palette.common.white};
`;

interface IEditUserProfileFormProps {
  form: FormikProps<IEditableUser>;
  saveImage: (file: File) => Promise<IFileMetadata>;
  getSkills: (filters: ISkillFilters | null) => Promise<ISkill[]>;
}

export const EditUserProfileForm = ({ form, getSkills, saveImage }: IEditUserProfileFormProps) => {
  const [expanded, setExpanded] = useState<EditUserProfileSections | false>(EditUserProfileSections.Head);
  const [showingError, setShowingError] = useState<boolean>(false);

  const handleChange = (section: EditUserProfileSections) =>
    useCallback(
      (_: React.SyntheticEvent, newExpanded: boolean) => {
        setExpanded(newExpanded ? section : false);
      },
      [section],
    );

  const isExpanded = (section: EditUserProfileSections) => expanded === section;

  const saveAndSubmit = (submit = false) => {
    if (form.values.isSubmittingForVetting != submit) {
      form.setFieldValue(
        nameof<IUser>(s => s.isSubmittingForVetting),
        submit,
        false,
      );
    }
    form.submitForm();
  };

  const handleOnExpand = useCallback(() => {
    if (showingError && !form.isValid) {
      scrollToFirstError();
    }
  }, [showingError, form.isValid]);

  const scrollToFirstError = () => {
    const el = document.querySelector('.Mui-error, [data-error]');
    (el?.parentElement ?? el)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setShowingError(false);
  };

  useEffect((): void => {
    if (form.isSubmitting && !form.isValid) {
      const section = Math.min(...Object.keys(form.errors).map(key => fieldToSection[key]));
      if (section === undefined) {
        return;
      }
      setShowingError(true);
      if (expanded !== section) {
        setExpanded(section);
      } else {
        scrollToFirstError();
      }
    }
  }, [form.isSubmitting]);

  useCustomEventListener(MessagePublisherEventType[MessagePublisherEventType.VideoProcessed], (id: string) => {
    const files = form.values.portfolioFiles;
    const fileIndex = files.findIndex(file => file.id === id);
    if (fileIndex > -1) {
      files[fileIndex].isProcessed = true;
      files[fileIndex].extension = '.mp4';
      form.setFieldValue('portfolioFiles', [...files]);
    }
  });

  const submitViable: boolean =
    (form.values.isSellingServices && form.values.vetting.status === VettingStatus.NotSubmitted) ||
    form.values.vetting.status === VettingStatus.UpdatesRequired;

  useDebouncedValidate({
    validate: values => {
      form.validateForm(values);
    },
    debounceTime: 200,
    values: form.values,
  });

  return (
    <StyledForm onSubmit={form.handleSubmit}>
      <EditUserHeadSection
        expanded={isExpanded(EditUserProfileSections.Head)}
        onChange={handleChange(EditUserProfileSections.Head)}
        saveImage={saveImage}
        getSkills={getSkills}
        onExpanded={handleOnExpand}
        form={form}
      />
      <EditPortfolioSection
        expanded={isExpanded(EditUserProfileSections.Portfolio)}
        onChange={handleChange(EditUserProfileSections.Portfolio)}
        onExpanded={handleOnExpand}
        form={form}
      />
      <EditWorkHistorySection
        expanded={isExpanded(EditUserProfileSections.WorkHistory)}
        onChange={handleChange(EditUserProfileSections.WorkHistory)}
        onExpanded={handleOnExpand}
        form={form}
      />
      <EditSellServicesSection
        expanded={isExpanded(EditUserProfileSections.SellingServices)}
        onChange={handleChange(EditUserProfileSections.SellingServices)}
        onExpanded={handleOnExpand}
        form={form}
      />
      <Grid container justifyContent="right" sx={{ mt: 1 }} spacing={1}>
        <Grid item xs={6} md={3}>
          <FormGroup>
            <Button variant="contained" size="large" onClick={() => saveAndSubmit(false)}>
              Save
            </Button>
          </FormGroup>
        </Grid>
        {submitViable && (
          <Grid item xs={12} md={3}>
            <Tooltip
              title={
                !form.values.isSellingServices
                  ? "You can't re-submit the profile for approval with no intent to sell your services"
                  : 'Submit'
              }
            >
              <FormGroup>
                <SubmitButton
                  color="success"
                  variant="contained"
                  size="large"
                  disabled={!form.values.isSellingServices}
                  endIcon={<Send />}
                  onClick={() => saveAndSubmit(true)}
                >
                  Submit for Approval
                </SubmitButton>
              </FormGroup>
            </Tooltip>
          </Grid>
        )}
      </Grid>
    </StyledForm>
  );
};

const sectionToFields: Record<EditUserProfileSections, string[]> = {
  [EditUserProfileSections.Head]: [
    nameof<IUser>(x => x.profileImage),
    nameof<IUser>(x => x.email),
    nameof<IUser>(x => x.firstName),
    nameof<IUser>(x => x.lastName),
    nameof<IUser>(x => x.title),
    nameof<IUser>(x => x.city),
    nameof<IUser>(x => x.country),
    nameof<IUser>(x => x.countryEditable),
    nameof<IUser>(x => x.bio),
    nameof<IUser>(x => x.skills),
    nameof<IUser>(x => x.languages),
  ],
  [EditUserProfileSections.Portfolio]: [nameof<IUser>(x => x.portfolioFiles), nameof<IUser>(x => x.isUploading)],
  [EditUserProfileSections.WorkHistory]: [nameof<IUser>(x => x.workHistories)],
  [EditUserProfileSections.SellingServices]: [
    nameof<IUser>(x => x.isScreenLinkError),
    nameof<IUser>(x => x.links),
    nameof<IUser>(x => x.mainCategory),
    nameof<IUser>(x => x.secondCategory),
    nameof<IUser>(x => x.hourlyRate),
    nameof<IUser>(x => x.fixedPackages),
  ],
};
const fieldToSection = Object.entries(sectionToFields).reduce<Record<string, EditUserProfileSections>>(
  (transformed, [key, values]) => (values.forEach(value => (transformed[value] = +key)), transformed),
  {},
);

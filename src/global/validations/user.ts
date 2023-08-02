import { FileType } from 'global/enums/fileTypes';
import { Language } from 'global/enums/language';
import { LanguageProficiency } from 'global/enums/languageProficiency';
import { LicenseType } from 'global/enums/licenseTypes';
import { VettingStatus } from 'global/enums/vettingStatus';
import { IEditableUser, IScreeningLinks, IWorkHistory } from 'global/interfaces/user';
import { object, string, number, boolean, SchemaOf, array, mixed } from 'yup';

export const workHistoryValidation: SchemaOf<IWorkHistory> = object({
  company: string().required('Company is required').max(50, 'Maximum of 50 characters allowed'),
  title: string().required('Title is required').max(50, 'Maximum of 50 characters allowed'),
  fromMonth: number().not([0], 'From month is required').required('From month is required'),
  fromYear: number().not([0], 'From year is required').required('From year is required'),
  toMonth: number()
    .defined()
    .when('isPresentPosition', {
      is: false,
      then: number().not([0], 'To month is required').required('To month is required'),
    }),
  toYear: number()
    .defined()
    .when('isPresentPosition', {
      is: false,
      then: number().not([0], 'To year is required').required('To year is required'),
    }),
  isPresentPosition: boolean().defined(),
});

export const editUserValidation: SchemaOf<IEditableUser> = object({
  isSellingServices: boolean().defined(),
  profileImage: object()
    .shape({
      id: string().required(),
      directory: string().notRequired(),
      name: string().notRequired(),
      type: mixed<FileType>().notRequired(),
      extension: string().notRequired(),
      isProcessed: boolean().notRequired(),
    })
    .notRequired()
    .nullable()
    .when('isSellingServices', {
      is: true,
      then: object().nullable().required('Profile image is required.'),
    }),
  email: string().required(),
  firstName: string().required('First Name is required').max(30, 'Maximum of 30 characters allowed'),
  lastName: string().required('Last Name is required').max(30, 'Maximum of 30 characters allowed'),
  title: string()
    .max(100, 'Maximum of 100 characters allowed')
    .notRequired()
    .nullable()
    .when('isSellingServices', {
      is: true,
      then: string().required('Title is required').nullable(),
    }),
  city: string().required('City is required').max(50, 'Maximum of 50 characters allowed'),
  country: string().required('Country is required'),
  countryEditable: boolean().required(),
  bio: string()
    .max(1000, 'Maximum of 1000 characters allowed')
    .notRequired()
    .nullable()
    .when('isSellingServices', {
      is: true,
      then: string().required('Bio is required').nullable(),
    }),
  mainCategory: string()
    .notRequired()
    .nullable()
    .when('isSellingServices', {
      is: true,
      then: string().required('Main category is required').nullable(),
    }),
  secondCategory: string().notRequired().nullable(),
  skills: array(
    object({
      id: string().notRequired(),
      value: string().required(),
    }),
  )
    .defined()
    .when('isSellingServices', {
      is: true,
      then: array().required().min(1, 'You must select at least 1 skill').max(8, 'Maximum of 8 skills are allowed'),
    }),
  languages: array(
    object({
      language: mixed<Language>().required(),
      proficiency: mixed<LanguageProficiency>().required(),
    }),
  )
    .defined()
    .test({
      name: 'uniq-languages',
      message: 'Languages should be unique.',
      test: languages =>
        languages ? languages.map(x => x.language).length === new Set(languages.map(x => x.language)).size : false,
    })
    .when('isSellingServices', {
      is: true,
      then: array().min(1, 'You must select at least 1 language'),
    }),
  portfolioFiles: array(
    object({
      id: string().required(),
      directory: string().required(),
      path: string().required(),
      name: string().required('File name is required.'),
      type: mixed<FileType>().required(),
      extension: string().required(),
      isProcessed: boolean().required(),
      isFeatured: boolean().required(),
    }),
  ).when('isSellingServices', {
    is: true,
    then: array().test({
      name: 'min-1-feat-img',
      message: 'At least 1 featured image is required.',
      test: files => (files ? files.some(f => f.type == FileType.Image && f.isFeatured) : false),
    }),
  }),
  workHistories: array(workHistoryValidation).when('isSellingServices', {
    is: true,
    then: array().min(1),
  }),
  vetting: object({
    status: mixed<VettingStatus>().required(),
    submittedOn: string().notRequired().nullable(),
    viewedOn: string().notRequired().nullable(),
  }).notRequired(),
  links: object({
    behance: string().max(1000, 'Maximum of 1000 characters are allowed').notRequired().nullable(),
    personalSite: string().max(1000, 'Maximum of 1000 characters are allowed').notRequired().nullable(),
    github: string().max(1000, 'Maximum of 1000 characters are allowed').notRequired().nullable(),
    linkedIn: string().max(1000, 'Maximum of 1000 characters are allowed').notRequired().nullable(),
    instagram: string().max(1000, 'Maximum of 1000 characters are allowed').notRequired().nullable(),
    stackOverflow: string().max(1000, 'Maximum of 1000 characters are allowed').notRequired().nullable(),
    twitter: string().max(1000, 'Maximum of 1000 characters are allowed').notRequired().nullable(),
    dribbble: string().max(1000, 'Maximum of 1000 characters are allowed').notRequired().nullable(),
    tikTok: string().max(1000, 'Maximum of 1000 characters are allowed').notRequired().nullable(),
    other: string().max(1000, 'Maximum of 1000 characters are allowed').notRequired().nullable(),
  }),
  hourlyRate: number()
    .notRequired()
    .nullable()
    .when('isSellingServices', {
      is: true,
      then: number().not([0], 'Hourly rate is required').required('Hourly rate is required').nullable(),
    }),
  fixedPackages: array(
    object({
      price: number().notRequired().nullable(),
      deliverables: array().required(),
      revisions: number().notRequired().nullable(),
      deliveryMethods: number().notRequired().nullable(),
      license: string().notRequired(),
      custom: string().max(500, 'Maximum of 500 characters are allowed').notRequired(),
    }),
  )
    .notRequired()
    .when('isSellingServices', {
      is: true,
      then: array(
        object({
          price: number().required('Price is required').not([0], 'Price is required').nullable(),
          deliverables: array()
            .required()
            .min(1, 'You must have at least 1 deliverable')
            .max(3, 'A maximum of 3 deliverables are allowed')
            .test('deliverablesNotEmpty', 'Deliverable text must not be empty', item => {
              let valid = false;
              for (let i = 0; item !== undefined && i < item.length; i++) {
                valid = item[i] !== undefined && item[i].length > 0;
                if (!valid) {
                  break;
                }
              }
              return valid;
            }),
          revisions: number().required('Revision is required').nullable(),
          deliveryMethods: number().required('Delivery is required').nullable(),
          license: string().required('License is required'),
          custom: string()
            .max(10, 'Maximum of 500 characters are allowed')
            .notRequired()
            .when('license', { is: LicenseType.Custom, then: string().required('Describe your custom license.') }),
        }),
      ),
    }),
  isUploading: boolean().required().isFalse('Please wait for files to finish uploading'),
  isSubmittingForVetting: boolean().notRequired(),
  isScreenLinkError: boolean()
    .default(undefined)
    .notRequired()
    .when(['isSellingServices', 'links'], {
      is: (isSellingServices: boolean, links: IScreeningLinks) => {
        const numValidLinks: number = Object.values(links).filter(x => x !== undefined && x !== null).length;
        if (numValidLinks > 3 && isSellingServices) {
          return true;
        }
        return false;
      },
      then: boolean().required(),
    }),
});

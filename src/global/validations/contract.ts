import { ContractType, ICreateContractForm } from 'global/interfaces/contract';
import { object, string, SchemaOf, mixed, array, number } from 'yup';
import { LicenseType } from 'global/enums/licenseTypes';

export const createContractValidation: SchemaOf<ICreateContractForm> = object({
  name: string().required('Contract Name is required').max(20, 'Maximum of 20 characters allowed'),
  contractType: mixed<ContractType>().required('Contract Type is required'),
  fixedPackageIndex: number()
    .nullable()
    .notRequired()
    .when('contractType', {
      is: ContractType.FixedPackage,
      then: number().nullable().required('Fixed package is required'),
    }),
  deliverables: array().when('contractType', {
    is: ContractType.Hourly,
    then: array()
      .min(1, 'Min of 1')
      .max(3, 'Max of 3')
      .test('deliverablesNotEmpty', 'Deliverable text must not be empty', item => {
        let valid = false;
        /* eslint-disable no-unmodified-loop-condition */
        for (let i = 0; item !== undefined && i < item.length; i++) {
          valid = item[i] !== undefined && item[i].length > 0;
          if (!valid) {
            break;
          }
        }
        return valid;
      }),
  }),
  hours: number()
    .nullable()
    .notRequired()
    .when('contractType', {
      is: ContractType.Hourly,
      then: number().nullable().required('No of Hours is required').min(1, 'Min of 1').max(100, 'Max of 100'),
    }),
  revisions: number()
    .nullable()
    .notRequired()
    .when('contractType', {
      is: ContractType.Hourly,
      then: number().nullable().required('Revision is required'),
    }),
  delivery: number()
    .nullable()
    .notRequired()
    .when('contractType', {
      is: ContractType.Hourly,
      then: number().nullable().required('Delivery is required'),
    }),
  license: string()
    .nullable()
    .notRequired()
    .when('contractType', {
      is: ContractType.Hourly,
      then: string().nullable().required('License Type is required'),
    }),
  custom: string()
    .nullable()
    .notRequired()
    .test('customLicence', 'Custom License Text is required', (item, context) => {
      const form = context.parent as ICreateContractForm;
      let valid = true;
      if (form.contractType === ContractType.Hourly && form.license === LicenseType.Custom) {
        valid = item !== undefined && item !== null && item !== '';
      }
      return valid;
    }),
  otherUserId: string().nullable().notRequired(),
});

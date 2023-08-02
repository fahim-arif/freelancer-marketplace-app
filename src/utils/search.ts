import { IModel } from 'global/interfaces/model';

export const mapToSearchParams = (formProps: IModel<string>): URLSearchParams => {
  const newSearchParams = new URLSearchParams();
  Object.entries(formProps).forEach(([key, value]) => {
    if (value) {
      newSearchParams.append(key, value);
    }
  });
  return newSearchParams;
};

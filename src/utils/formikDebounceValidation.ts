import { useCallback, useEffect, useRef } from 'react';
import { debounce } from 'lodash';
import { FormikValues } from 'formik';
import { FormikConfig } from 'formik/dist/types';

export function useDebouncedValidate<T extends FormikValues>({
  values,
  validate,
  debounceTime = 200,
}: {
  values: T;
  validate: FormikConfig<T>['validate'];
  debounceTime?: number;
}) {
  const debouncedFunction = useRef(
    debounce((validateFunc: FormikConfig<T>['validate'], data: T) => validateFunc && validateFunc(data), debounceTime),
  );

  const debounceValidate = useCallback((data: T) => debouncedFunction.current(validate, data), []);

  useEffect(() => {
    debounceValidate(values);
  }, [values]);

  useEffect(
    () => () => {
      debouncedFunction.current.cancel();
    },
    [],
  );
}

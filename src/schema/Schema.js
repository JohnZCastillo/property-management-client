import * as yup from 'yup';

export const propertySchema = yup.object({
  name: yup
    .string()
    .trim()
    .required('Name is required')
    .max(50, 'Name too long')
});

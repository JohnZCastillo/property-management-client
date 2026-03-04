import * as yup from 'yup';

export const propertySchema = yup.object({
  title: yup
    .string()
    .trim()
    .required('Name is required')
    .max(50, 'Name too long')
});

export const deleteSchema = yup.object({
  id: yup
    .string()
    .trim()
});

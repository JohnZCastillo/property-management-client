import * as yup from 'yup';

amount

export const roomSchema = yup.object({
  title: yup
    .string()
    .trim()
    .required('Name is required')
    .max(50, 'Name too long')
});

export const propertySchema = yup.object({
  title: yup
    .string()
    .trim()
    .required('Name is required')
    .max(50, 'Name too long')
});

export const guestSchema = yup.object({
  name: yup.string().trim().required('Name is required'),
  email: yup.string().trim().email('Invalid email format').required('Email is required'),
  contact: yup.string().trim().required('Contact is required'),
  age: yup.number().required('Age is required').positive('Age must be positive').integer('Age must be a whole number'),
});

export const bookingSchema = yup.object({
  timeIn: yup.date().required('From date is required').nullable(),
  timeOut: yup.date().required('To date is required').nullable(),
  propertyId: yup.number().integer().required('Property is required'),
  roomId: yup.number().integer().required('Room is required'),
  status:  yup.string().trim().required('Status is required'),
});

export const deleteSchema = yup.object({
  id: yup
    .string()
    .trim()
});

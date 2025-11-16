import * as yup from "yup";

export const UserSchema = yup
  .object({
    fullname: yup.string().required().trim().min(2),
    username: yup.string().required().trim().min(3),
    email: yup.string().email().required(),
    password: yup.string().required().matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    ),
    password2: yup.string().required('Confirm password is required').oneOf([yup.ref('password'), null], 'Passwords must match'),
    mobile: yup.string().required('mobile is required').min(11, 'mobile must be 11 digits').max(11, 'mobile must be 11 digits'),
    profile: yup.string().nullable(),
  })
  .required()
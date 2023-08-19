import * as Yup from "yup";

export const SignupSchema = Yup.object().shape({
  login: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Please enter your login"),
  password: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Please enter your password"),
  email: Yup.string()
    .email("invalid email")
    .required("Please enter your email"),
});
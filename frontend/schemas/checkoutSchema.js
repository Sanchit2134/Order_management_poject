import * as yup from "yup";

export const checkoutSchema = yup.object({
  name: yup.string().trim().required("Name is required"),
  address: yup.string().trim().required("Address is required"),
  phone: yup.string().trim().required("Phone is required"),
});
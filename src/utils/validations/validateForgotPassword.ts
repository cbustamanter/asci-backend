import {
  InvalidMessageResponse,
  RequiredMessageResponse,
} from "../ErrorMessageResponse";

export const validateForgotPassword = (email: string) => {
  if (!email.length) {
    return [
      {
        field: "email",
        message: RequiredMessageResponse("Email"),
      },
    ];
  }
  if (!email.includes("@")) {
    return [
      {
        field: "email",
        message: InvalidMessageResponse("Email"),
      },
    ];
  }
  return null;
};

import {
  InvalidMessageResponse,
  RequiredMessageResponse,
} from "../ErrorMessageResponse";
import { UserInput } from "../types/UserInput";
const validateCreateUser = (input: UserInput) => {
  const errors = [];
  if (!input.email?.includes("@")) {
    errors.push({
      field: "email",
      message: InvalidMessageResponse("Email"),
    });
  }
  if (!input.cellphone) {
    errors.push({
      field: "cellphone",
      message: RequiredMessageResponse("Teléfono"),
    });
  }
  if (!input.email) {
    errors.push({
      field: "email",
      message: RequiredMessageResponse("Email"),
    });
  }
  if (!input.names) {
    errors.push({
      field: "names",
      message: RequiredMessageResponse("Nombres"),
    });
  }
  if (!input.surnames) {
    errors.push({
      field: "surnames",
      message: RequiredMessageResponse("Apellidos"),
    });
  }
  if (typeof input.gender === "undefined") {
    errors.push({
      field: "gender",
      message: RequiredMessageResponse("Género"),
    });
  }
  if (!input.country) {
    errors.push({
      field: "country",
      message: RequiredMessageResponse("País"),
    });
  }
  return errors.length ? errors : null;
};

export default validateCreateUser;

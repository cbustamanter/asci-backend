import {
  InvalidMessageResponse,
  RequiredMessageResponse,
} from "../ErrorMessageResponse";
import { UserInput } from "../types/UserInput";
const validateCreateUser = (input: UserInput) => {
  if (!input.email?.includes("@")) {
    return [
      {
        field: "email",
        message: InvalidMessageResponse("Email"),
      },
    ];
  }
  if (!input.cellphone?.length) {
    return [
      {
        field: "cellphone",
        message: RequiredMessageResponse("Teléfono"),
      },
    ];
  }
  if (!input.email?.length) {
    return [
      {
        field: "email",
        message: RequiredMessageResponse("Email"),
      },
    ];
  }
  if (!input.names?.length) {
    return [
      {
        field: "names",
        message: RequiredMessageResponse("Nombres"),
      },
    ];
  }
  if (!input.surnames?.length) {
    return [
      {
        field: "surnames",
        message: RequiredMessageResponse("Apellidos"),
      },
    ];
  }
  if (!input.gender) {
    return [
      {
        field: "gender",
        message: RequiredMessageResponse("Género"),
      },
    ];
  }
  return null;
};

export default validateCreateUser;

export const RequiredMessageResponse = (field: string) => {
  return `${field} es requerido`;
};
export const InvalidMessageResponse = (field: string) => {
  return `${field} es inválido`;
};
export const LoginErrorMessageResponse = () => {
  return {
    errors: [{ field: "email", message: "Usuario o contraseña incorrectos" }],
  };
};
export const EmailTakenResponse = () => {
  return {
    errors: [{ field: "email", message: "El usuario ya existe" }],
  };
};

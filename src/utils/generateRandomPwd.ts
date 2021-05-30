export const generateRandomPwd = () => {
  return Math.random().toString(36).slice(-8);
};

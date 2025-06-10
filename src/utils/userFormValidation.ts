
export const validatePasswords = (password: string, confirmPassword: string) => {
  if (password !== confirmPassword) {
    return {
      isValid: false,
      error: {
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again."
      }
    };
  }

  if (!password.trim()) {
    return {
      isValid: false,
      error: {
        title: "Password Required",
        description: "Please enter a password."
      }
    };
  }

  return { isValid: true };
};

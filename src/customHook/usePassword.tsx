import { useEffect, useState } from "react";

export const checkPasswordRules = (
  password: string
): [boolean, boolean, boolean] => {
  let rules: [boolean, boolean, boolean] = [false, false, false];

  if (password.length === 0) {
    return rules;
  }
  // rule 1
  if (password.length >= 8) {
    rules[0] = true;
  }
  // rule 2
  if (
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password)
  ) {
    rules[1] = true;
  }
  if (password[0] !== " " && password[password.length - 1] !== " ") {
    // rule 3
    rules[2] = true;
  }

  return rules;
};

const usePassword = () => {
  const [password, setPassword] = useState("");
  const [passwordRules, setPasswordRules] = useState([false, false, false]);

  useEffect(() => {
    const rules = checkPasswordRules(password);
    setPasswordRules(rules);
  }, [password]);

  return { password, setPassword, passwordRules };
};

export default usePassword;

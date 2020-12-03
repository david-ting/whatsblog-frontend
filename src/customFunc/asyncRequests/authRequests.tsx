import standardRequest from "./standardRequest";
const HOST_URL = process.env.REACT_APP_HOST_URL;

export const signUpUser = (user: {
  name: string;
  email: string;
  password: string;
  profileData: string;
}) => {
  const path = `${HOST_URL}/auth/sign-up`;
  const options: RequestInit = {
    method: "POST",
    mode: "cors",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  };
  return standardRequest(path, options);
};

export const getUser = async () => {
  const path = `${HOST_URL}/auth/get_user`;
  const options: RequestInit = {
    mode: "cors",
    method: "GET",
    credentials: "include",
  };
  return standardRequest(path, options);
};

export const loginUser = async (
  key: "email" | "name",
  identity: string,
  password: string
) => {
  const path = `${HOST_URL}/auth/log-in/${key}`;
  const options: RequestInit = {
    method: "POST",
    mode: "cors",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      [key]: identity,
      password: password,
    }),
  };
  return standardRequest(path, options);
};

export const updateUserPassword = async (
  currentPassword: string,
  newPassword: string
) => {
  const path = `${HOST_URL}/auth/update_user/password`;
  const options: RequestInit = {
    method: "PUT",
    mode: "cors",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password: newPassword, currentPassword }),
  };
  return standardRequest(path, options);
};

export const updateUserProfileURL = async (profileData: string) => {
  const path = `${HOST_URL}/auth/update_user/profile_url`;
  const options: RequestInit = {
    method: "PUT",
    mode: "cors",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ profileData }),
  };
  return standardRequest(path, options);
};

export const logoutUser = async () => {
  const path = `${HOST_URL}/auth/log-out`;
  const options: RequestInit = {
    method: "POST",
    credentials: "include",
    mode: "cors",
  };
  return standardRequest(path, options);
};

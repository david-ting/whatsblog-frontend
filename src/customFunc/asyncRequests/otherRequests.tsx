import { convertImageToBase64 } from "../helperFunc";
import standardRequest from "./standardRequest";
const HOST_URL = process.env.REACT_APP_HOST_URL;

export const getAuthorProfile = (user_id: number) => {
  const path = `${HOST_URL}/author/profile/${user_id}`;
  const options: RequestInit = {
    method: "GET",
    credentials: "include",
    mode: "cors",
  };

  return standardRequest(path, options);
};

export const uploadImageToServer = async (file: File | Blob) => {
  try {
    const base64String = await convertImageToBase64(file);
    const path = `${HOST_URL}/image`;
    const options: RequestInit = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: base64String as string }),
    };
    return standardRequest(path, options);
  } catch (err) {
    throw err;
  }
};

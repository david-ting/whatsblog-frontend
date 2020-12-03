export const convertImageToBase64 = (file: File | Blob) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result);
    };
  });
};

export const localeDateString = (str: string): string => {
  const date = new Date(str);
  const options = { year: "numeric", month: "short", day: "numeric" };
  return date.toLocaleDateString("en-HK", options);
};

export const localeTimeString = (str: string): string => {
  const date = new Date(str);
  return date.toLocaleTimeString("en-HK", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

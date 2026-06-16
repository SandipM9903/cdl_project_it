// const SECRET= process.env.REACT_APP_SIMPLE_ENCRYPTION_KEY;

export const simpleEncrypt = (value) => {
  const SECRET = "8F3dK9@Q!2zL7X#A";
if (!value) return null;
  if (!SECRET) {
    alert(SECRET);
    throw new Error("Encryption secret missing");
  }

  const timestamp = Date.now();

  const combined = `${SECRET}:${value}:${timestamp}`;

  const reversed = combined.split("").reverse().join("");

  return btoa(reversed);
};
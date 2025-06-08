import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.REACT_APP_ENCRYPTION_KEY;

export const encryptTask = (taskObject) => {
  try {
    const jsonString = JSON.stringify(taskObject);
    return CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
  } catch (error) {
    console.error("Encryption failed:", error);
    return null;
  }
};

export const decryptTask = (encryptedString) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedString, SECRET_KEY);
    const decryptedJson = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedJson);
  } catch (error) {
    console.error(
      "Decryption failed. The string may be invalid or the key incorrect.",
      error
    );
    return null;
  }
};

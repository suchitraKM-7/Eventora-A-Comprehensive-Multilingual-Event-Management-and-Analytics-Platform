export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

export const getUserLanguageKey = (userId) =>
  `language_${userId}`;

export const supportedLanguages = [
  "en",
  "te",
  "hi",
  "kn",
  "ta",
];

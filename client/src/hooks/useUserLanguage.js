import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  getStoredUser,
  getUserLanguageKey,
  supportedLanguages,
} from "../config";

function useUserLanguage() {
  const { i18n } = useTranslation();
  const user = getStoredUser();

  useEffect(() => {
    if (!user?.id) return;

    const savedLanguage = localStorage.getItem(
      getUserLanguageKey(user.id)
    );

    if (
      savedLanguage &&
      supportedLanguages.includes(savedLanguage) &&
      savedLanguage !== i18n.language
    ) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n, user?.id]);
}

export default useUserLanguage;

import { useTranslation } from "react-i18next";
import {
  getStoredUser,
  getUserLanguageKey,
  supportedLanguages,
} from "../../config";

const languageOptions = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "te", label: "Telugu" },
  { code: "kn", label: "Kannada" },
  { code: "ta", label: "Tamil" },
];

function LanguageSwitcher({ compact = false }) {
  const { i18n } = useTranslation();
  const user = getStoredUser();

  const handleLanguageChange = (event) => {
    const language = event.target.value;

    if (user?.id && supportedLanguages.includes(language)) {
  localStorage.setItem(getUserLanguageKey(user.id), language);
} else {
  localStorage.setItem("selectedLanguage", language);
}

localStorage.setItem(
  "selectedLanguage",
  language
);

i18n.changeLanguage(language);
  }

  return (
    <label
      className={`flex gap-2 font-bold text-slate-700 ${
        compact
          ? "items-center text-sm"
          : "flex-col sm:flex-row sm:items-center"
      }`}
    >
      <span>{i18n.t("language")}</span>
      <select
        value={i18n.language}
        onChange={handleLanguageChange}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 font-semibold text-slate-900 shadow-sm"
      >
        {languageOptions.map((language) => (
          <option key={language.code} value={language.code}>
            {language.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default LanguageSwitcher;

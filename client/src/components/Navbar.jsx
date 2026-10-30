import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Navbar() {
  const { t } = useTranslation();

  return (
    <nav className="flex justify-between items-center p-4 border-b">
      <h1 className="text-xl font-bold">
        {t("appName")}
      </h1>

      <div className="flex gap-4">
        <Link to="/login">
          <button className="px-4 py-2 border rounded">
            {t("login")}
          </button>
        </Link>

        <Link to="/register">
          <button className="px-4 py-2 border rounded">
            {t("register")}
          </button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;

import LanguageSwitcher from "./LanguageSwitcher";

function PageHeader({
  eyebrow,
  title,
  subtitle,
  action,
  showLanguage = true,
}) {
  return (
    <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && (
          <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-2 text-4xl font-black text-slate-950">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-slate-600">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {showLanguage && <LanguageSwitcher compact />}
        {action}
      </div>
    </header>
  );
}

export default PageHeader;

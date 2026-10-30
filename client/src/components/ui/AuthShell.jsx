import weddingVenueBg from "../../assets/wedding-venue-bg.png";
import LanguageSwitcher from "./LanguageSwitcher";

function AuthShell({ children }) {
  return (
    <main
      className="flex min-h-screen items-center justify-center bg-cover bg-center px-4 py-8"
      style={{ backgroundImage: `url(${weddingVenueBg})` }}
    >
      <div className="absolute inset-0 bg-slate-950/70" />
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-4 flex justify-end">
          <div className="rounded-xl bg-white/90 px-3 py-2 shadow-lg backdrop-blur">
            <LanguageSwitcher compact />
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}

export default AuthShell;

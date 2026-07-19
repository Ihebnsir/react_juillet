import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ToastMessage } from "../components/UI/ToastMessage";

export const GithubCallbackPage = () => {
  const { loginViaProvider } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const code = query.get("code");
    const errorParam = query.get("error");

    if (errorParam) {
      setError("La connexion GitHub a été annulée ou a échoué.");
      setLoading(false);
      return;
    }

    if (!code) {
      setError("Code GitHub introuvable.");
      setLoading(false);
      return;
    }

    const completeGithubLogin = async () => {
      try {
        const response = await fetch("http://localhost:3001/auth/github/callback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || "Échec de l'authentification GitHub.");
        }

        const user = await loginViaProvider({
          email: result.email,
          nom: result.nom,
          avatar: result.avatar,
          provider: "github",
        });

        const roleRedirect =
          user.role === "admin"
            ? "/admin"
            : user.role === "centre"
            ? "/centre"
            : "/dashboard";
        navigate(roleRedirect, { replace: true });
      } catch (err) {
        setError(err.message || "Échec de l'authentification GitHub.");
      } finally {
        setLoading(false);
      }
    };

    completeGithubLogin();
  }, [location.search, loginViaProvider, navigate]);

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto max-w-2xl rounded-3xl bg-white/95 p-10 text-slate-900 shadow-2xl ring-1 ring-slate-900/10 dark:bg-slate-900/95 dark:text-slate-100">
        <h1 className="text-2xl font-semibold mb-4">Connexion GitHub</h1>
        {loading && <p>Finalisation de l'authentification GitHub...</p>}
        {!loading && error && <ToastMessage type="error" message={error} onClose={() => setError("")} />}
      </div>
    </div>
  );
};

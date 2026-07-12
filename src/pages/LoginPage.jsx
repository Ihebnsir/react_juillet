import { Link } from "react-router-dom";
import { LoginForm } from "../components/Forms/LoginForm";
import { FiArrowLeft } from "react-icons/fi";

export const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <Link
          to="/"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <FiArrowLeft /> Retour
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Connexion</h1>
        <p className="text-gray-600 mb-8">
          Accédez à votre compte SkillBridge
        </p>

        <LoginForm />

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Vous n'avez pas de compte?{" "}
            <Link
              to="/register"
              className="text-teal-600 hover:text-teal-700 font-medium transition"
            >
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

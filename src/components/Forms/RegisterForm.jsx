import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

export const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "learner",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Le nom est requis";
    if (!formData.email.trim()) newErrors.email = "L'email est requis";
    if (formData.password.length < 6)
      newErrors.password = "Le mot de passe doit avoir au moins 6 caractères";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = register(formData);
      if (result.success) {
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Nom complet
        </label>
        <div className="relative">
          <FiUser className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.name
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-teal-500"
            }`}
            placeholder="Votre nom"
          />
        </div>
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email
        </label>
        <div className="relative">
          <FiMail className="absolute left-3 top-3 text-gray-400" />
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.email
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-teal-500"
            }`}
            placeholder="exemple@email.com"
          />
        </div>
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium mb-2">
          Je suis un(e)
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="learner">Apprenant</option>
          <option value="centre">Centre de formation</option>
        </select>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-2">
          Mot de passe
        </label>
        <div className="relative">
          <FiLock className="absolute left-3 top-3 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.password
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-teal-500"
            }`}
            placeholder="Au moins 6 caractères"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-400"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
          Confirmer le mot de passe
        </label>
        <div className="relative">
          <FiLock className="absolute left-3 top-3 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.confirmPassword
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-teal-500"
            }`}
            placeholder="Confirmer votre mot de passe"
          />
        </div>
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition disabled:bg-gray-400"
      >
        {loading ? "Inscription..." : "S'inscrire"}
      </button>
    </form>
  );
};

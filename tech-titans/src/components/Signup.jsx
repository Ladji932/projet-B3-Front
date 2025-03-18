/* eslint-disable no-unused-vars */
import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useContext } from 'react';
import { ThemeContext } from "../ThemeContext";

function Signup() {
  const { isDarkMode } = useContext(ThemeContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Les mots de passe ne correspondent pas.');
      setSuccess(false);
      return;
    }

    const data = {
      login: username,
      mail: email,
      password: password,
    };

    try {
      const response = await axios.post('https://projet-b3.onrender.com/api/fetchSignup', data);
      setMessage('Inscription réussie !');
      setSuccess(true);
    } catch (error) {
      console.error("Error during signup:", error);
      setMessage('Erreur lors de l\'inscription.');
      setSuccess(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`max-w-md w-full space-y-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-10 rounded-xl shadow-2xl transform transition-all duration-300 hover:scale-[1.02]`}>
        <div>
          <h1 className={`text-center text-3xl font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            Inscription
          </h1>
          <p className={`text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Créez votre compte pour commencer
          </p>
        </div>

        {message && (
          <div className={`rounded-md p-4 ${success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            <p className="text-sm text-center">{message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Nom d'utilisateur
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`mt-1 block w-full px-4 py-3 rounded-lg text-sm transition duration-200 ease-in-out focus:ring-2 focus:ring-offset-2 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-indigo-500 focus:border-indigo-500' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500'
                }`}
                placeholder="Entrez votre nom d'utilisateur"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Adresse email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`mt-1 block w-full px-4 py-3 rounded-lg text-sm transition duration-200 ease-in-out focus:ring-2 focus:ring-offset-2 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-indigo-500 focus:border-indigo-500' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500'
                }`}
                placeholder="exemple@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`mt-1 block w-full px-4 py-3 rounded-lg text-sm transition duration-200 ease-in-out focus:ring-2 focus:ring-offset-2 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-indigo-500 focus:border-indigo-500' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500'
                  }`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium transition-colors duration-200 ${
                    isDarkMode 
                      ? 'text-gray-400 hover:text-gray-300' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {showPassword ? 'Masquer' : 'Afficher'}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Confirmer le mot de passe
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`mt-1 block w-full px-4 py-3 rounded-lg text-sm transition duration-200 ease-in-out focus:ring-2 focus:ring-offset-2 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-indigo-500 focus:border-indigo-500' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500'
                }`}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className={`w-full flex justify-center py-3 px-4 rounded-lg text-sm font-semibold text-white transition duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isDarkMode
                ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
                : 'bg-indigo-500 hover:bg-indigo-600 focus:ring-indigo-500'
            }`}
          >
            S'inscrire
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link 
            to="/connexion" 
            className={`text-sm font-medium transition duration-200 ease-in-out ${
              isDarkMode 
                ? 'text-indigo-400 hover:text-indigo-300' 
                : 'text-indigo-600 hover:text-indigo-500'
            }`}
          >
            Vous avez déjà un compte ? Connectez-vous
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
/* eslint-disable no-unused-vars */
import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {
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
    <div className="flex items-center justify-center min-h-screen bg-black px-4 sm:px-8 md:px-16">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center text-indigo-600 mb-6">Inscription</h1>
        {message && (
          <div className={`mb-4 text-center ${success ? 'text-green-600' : 'text-red-600'}`}>{message}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              name="login"
              placeholder="Nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              name="mail"
              placeholder="Adresse mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="mb-4 relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500 focus:outline-none"
            >
              {showPassword ? 'Masquer' : 'Afficher'}
            </button>
          </div>
          <div className="mb-4">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmez le mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Envoyer
          </button>
        </form>
        <Link to="/inscription" className="text-gray-800 px-4 py-2 hover:underline">
          Vous avez déjà un compte ? Connectez-vous
        </Link>
      </div>
    </div>
  );
}

export default Signup;

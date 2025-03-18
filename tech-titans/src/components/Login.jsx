/* eslint-disable react/prop-types */
import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { ThemeContext } from "../ThemeContext";

function Login({ setIsLoggedIn }) {
    const { isDarkMode } = useContext(ThemeContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                'https://projet-b3.onrender.com/api/loginManage',
                { email, password },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            );

            if (response.status === 200) {
                localStorage.setItem('auth_token', response.data.token);
                setIsLoggedIn(true);
                navigate('/');
            }
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('Erreur de réseau');
            }
        }
    };
    
    const handleGoogleSuccess = async (credentialResponse) => {
        const { credential } = credentialResponse;

        try {
            const response = await axios.post(
                'https://projet-b3.onrender.com/api/loginGoogle',
                { idToken: credential },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                }
            );

            if (response.status === 200) {
                localStorage.setItem('auth_token', response.data.token);
                setIsLoggedIn(true);
                navigate('/');
            }
        } catch (error) {
            setErrorMessage('Erreur lors de la connexion avec Google.');
        }
    };

    const handleGoogleFailure = (error) => {
        setErrorMessage('Erreur lors de la connexion avec Google.');
    };

    return (
        <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className={`max-w-md w-full space-y-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-10 rounded-xl shadow-2xl transform transition-all duration-300 hover:scale-[1.02]`}>
                <div>
                    <h1 className={`text-center text-3xl font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                        Connexion
                    </h1>
                    <p className={`text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Connectez-vous pour accéder à votre compte
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
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
                                        ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
                                }`}
                                placeholder="exemple@email.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Mot de passe
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`mt-1 block w-full px-4 py-3 rounded-lg text-sm transition duration-200 ease-in-out focus:ring-2 focus:ring-offset-2 ${
                                    isDarkMode 
                                        ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
                                }`}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {errorMessage && (
                        <div className="rounded-md bg-red-50 p-4 mt-4">
                            <p className="text-sm text-red-700">{errorMessage}</p>
                        </div>
                    )}
                    
                    {successMessage && (
                        <div className="rounded-md bg-green-50 p-4 mt-4">
                            <p className="text-sm text-green-700">{successMessage}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        className={`w-full flex justify-center py-3 px-4 rounded-lg text-sm font-semibold text-white transition duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            isDarkMode
                                ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                                : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500'
                        }`}
                    >
                        Se connecter
                    </button>
                </form>

                <div className={`mt-6 flex items-center justify-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <div className="w-full border-t border-gray-300"></div>
                    <div className="px-2 text-sm">ou</div>
                    <div className="w-full border-t border-gray-300"></div>
                </div>

                <div className="mt-6">
                    <GoogleOAuthProvider clientId="772746900391-ibsq5i8d9ahpv2o4c3uos0b15hab77sh.apps.googleusercontent.com">
                        <div className="flex justify-center">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onFailure={handleGoogleFailure}
                                useOneTap
                            />
                        </div>
                    </GoogleOAuthProvider>
                </div>

                <div className="mt-6 text-center">
                    <Link 
                        to="/inscription" 
                        className={`text-sm font-medium transition duration-200 ease-in-out ${
                            isDarkMode 
                                ? 'text-blue-400 hover:text-blue-300' 
                                : 'text-blue-600 hover:text-blue-500'
                        }`}
                    >
                        Pas de compte ? Inscrivez-vous
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
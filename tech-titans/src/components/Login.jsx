/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

function Login({setIsLoggedIn}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    console.log(setIsLoggedIn)

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
                console.log(response.data)
                console.log('Connexion réussie', response.data.token);
                localStorage.setItem('auth_token', response.data.token); 
                setIsLoggedIn(true) 
                navigate('/');
            }
        } catch (error) {
            console.error(error);
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
                localStorage.setItem('auth_token',response.data.token);
                setIsLoggedIn(true) 
                navigate('/');
            }
        } catch (error) {
            console.error(error);
            setErrorMessage('Erreur lors de la connexion avec Google.');
        }
    };

    const handleGoogleFailure = (error) => {
        console.error('Erreur Google:', error);
        setErrorMessage('Erreur lors de la connexion avec Google.');
    };

    return (
        <div className="login bg-black flex flex-col h-screen">
            <div className="bg-white p-8 justify-center rounded-lg shadow-lg my-auto mx-auto w-full max-w-md">
                <section className="flex flex-col items-center justify-center flex-grow">
                    <h1 className="text-2xl text-black font-bold mb-6">Connexion</h1>
                    <form className="flex flex-col gap-4 w-full max-w-md" onSubmit={handleSubmit}>
                        <input
                            className="border border-gray-300 rounded-lg px-4 py-2"
                            type="text"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="adresse mail"
                        />
                        <input
                            className="border border-gray-300 rounded-lg px-4 py-2"
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="mot de passe"
                        />
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                            type="submit"
                        >
                            Envoyer
                        </button>
                    </form>
                    {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
                    {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}

                    <GoogleOAuthProvider clientId="772746900391-ibsq5i8d9ahpv2o4c3uos0b15hab77sh.apps.googleusercontent.com">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onFailure={handleGoogleFailure}
                            style={{ marginTop: '50px' }}
                        />
                    </GoogleOAuthProvider>
                    <Link to="/inscription" className="text-gray-800 px-4 py-2 hover:underline">
                        Pas de compte ? Inscrivez-vous
                    </Link>
                </section>
            </div>
        </div>
    );
}

export default Login;

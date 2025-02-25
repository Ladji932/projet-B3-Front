/* eslint-disable no-unused-vars */
import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {
  const [city, setCity] = useState('');
  const [location, setLocation] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleCityChange = async (e) => {
    const input = e.target.value;
    setCity(input);

    if (input.length > 1) {
      const apiKey = 'b399e41caa67f6b206289cb4633f94af';

      try {
        const response = await axios.get(`http://api.positionstack.com/v1/forward`, {
          params: {
            access_key: apiKey,
            query: input,
          },
        });

        setSuggestions(response.data.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleCitySelect = (selectedCity) => {
    setCity(selectedCity.label);
    setSuggestions([]);
    setLocation({
      lat: selectedCity.latitude,
      lon: selectedCity.longitude,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage('Les mots de passe ne correspondent pas.');
      return;
    }

    const data = {
      login: username,
      mail: email,
      password: password,
      phone: phone,
      city: city,
      location: location,
    };

    try {
     const response = await axios.post('https://projet-b3.onrender.com/api/fetchSignup', data);
      //const response = await axios.post('http://localhost:3002/api/fetchSignup', data);
      setMessage('Inscription réussie !');
    } catch (error) {
      console.error("Error during signup:", error);
      setMessage('Erreur lors de l\'inscription.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black px-4 sm:px-8 md:px-16">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center text-indigo-600 mb-6">Inscription</h1>
        {message && (
          <div className="mb-4 text-center text-red-600">{message}</div>
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
          <div className="mb-4">
            <input
              type="text"
              id="phone"
              name="phone"
              placeholder="Numéro de téléphone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              pattern="\d{3}[-]\d{3}[-]\d{4}"
              className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-4 relative">
            <input
              type="text"
              name="city"
              placeholder="Entrez votre ville"
              value={city}
              onChange={handleCityChange}
              className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            {suggestions.length > 0 && (
              <ul className="absolute left-0 right-0 bg-white border border-gray-300 mt-1 max-h-60 overflow-y-auto z-10">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleCitySelect(suggestion)}
                    className="p-2 hover:bg-indigo-100 cursor-pointer"
                  >
                    {suggestion.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Envoyer
          </button>
        </form>
        <Link to="/inscription" className= "text-gray-800 px-4 py-2  hover:underline">
                    Vous avez déjà un compte ? Connectez-vous
                    </Link> 
      </div>
    </div>
  );
}

export default Signup;
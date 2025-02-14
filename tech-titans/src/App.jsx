/* eslint-disable react/prop-types */
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react'; 
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import EventsPage from './components/EventsPage';
import AdminPage from './components/AdminPage';
import ResultsPage from './components/ResultsPage';
import CreateEventForm from './components/CreateEvent';
import axios from 'axios';
import EventAdminInterface from './components/GeneralAdminInterface';
import AdminLogin from './components/AdminLogin';
import Cookies from "js-cookie";

function ProtectedRoute({ element, requiresAuthCheck = false, redirectTo = "/login" }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    if (!requiresAuthCheck) {
      setIsAuthenticated(Cookies.get("auth_token") !== undefined);
      return;
    }

    const checkAuth = async () => {
      try {
        await axios.get("https://projet-b3.onrender.com/api/checkAuth", { withCredentials: true });
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, [requiresAuthCheck]);

  if (isAuthenticated === null) return <div>Chargement...</div>;

  return isAuthenticated ? element : <Navigate to={redirectTo} replace />;
}



function Root() {
  const [AllEvents, setEvents] = useState([]);
  const [cookiesAccepted, setCookiesAccepted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("https://projet-b3.onrender.com/api/fetch-events");
        const shuffledEvents = response.data.events.sort(() => 0.5 - Math.random());
        setEvents(shuffledEvents);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEvents();
  }, []);




  const acceptCookies = () => setCookiesAccepted(true);
  const declineCookies = () => setCookiesAccepted(true);

  return (
    <BrowserRouter>
      <div>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} allEvents={AllEvents} />
        <Routes>
          <Route path="/" element={<Home allEvents={AllEvents} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/inscription" element={<Signup />} />
          <Route path="/AllEvent" element={<EventsPage allEvents={AllEvents} />} />
          <Route path="/userDetails" element={<AdminPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/addEvent" element={<ProtectedRoute element={<CreateEventForm />} />} />
          <Route path="/admin" element={<ProtectedRoute element={<EventAdminInterface />} requiresAuthCheck={true} redirectTo="/adminLogin" />} />
          <Route path="/adminLogin" element={<AdminLogin />} />
        </Routes>

        {!cookiesAccepted && (
          <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white py-4 px-4 flex justify-between items-center sm:flex-col sm:py-8 sm:px-6 sm:items-center">
            <p className="mb-4 sm:mb-2">Ce site utilise des cookies pour améliorer l&apos;expérience utilisateur. Acceptez-vous les cookies ?</p>
            <div className="flex space-x-4 sm:flex-col sm:space-x-0 sm:space-y-2">
              <button 
                onClick={acceptCookies} 
                className="bg-green-500 px-6 py-2 rounded-lg hover:bg-green-600 sm:px-4"
              >
                Accepter
              </button>
              <button 
                onClick={declineCookies} 
                className="ml-4 bg-red-500 px-6 py-2 rounded-lg hover:bg-red-600 sm:px-4 sm:ml-0"
              >
                Refuser
              </button>
            </div>
          </div>
        )}
      </div>
    </BrowserRouter>
  );
}

export default Root;

/* eslint-disable react/prop-types */
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react'; 
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import EventsPage from './components/EventsPage';
import AdminPage from './components/AdminPage';
import ResultsPage from './components/ResultsPage';
import CreateEventForm from './components/CreateEvent';
import axios from 'axios';
import GeneralAdminInterface from './components/GeneralAdminInterface';
import AdminLogin from './components/AdminLogin';
import EditEvent from './components/EditEvent';
import MentionLegal from './components/MentionLegal';
import PolitiqueConfi from './components/PolitiqueConfi';
import GestionCookies from './components/GestionCookies';
import Footer from './components/Footer';

function ProtectedRoute({ element, requiresAuthCheck = false, redirectTo = "/login" }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    
    if (!requiresAuthCheck) {
      setIsAuthenticated(token !== null);
      return;
    }

    const checkAuth = async () => {
      try {
        await axios.get("https://projet-b3.onrender.com/api/checkAuth", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
  }, [requiresAuthCheck]);

  if (isAuthenticated === null) return <div>Pas connecté</div>;

  return isAuthenticated ? element : <Navigate to={redirectTo} replace />;
}

function Root() {
  const [AllEvents, setEvents] = useState([]);
  const [cookiesAccepted, setCookiesAccepted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchEvents = useCallback(async () => {
    try {
      const response = await axios.get("https://projet-b3.onrender.com/api/fetch-events");
      const shuffledEvents = response.data.events.sort(() => 0.5 - Math.random());
      setEvents(shuffledEvents);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const getToken = () => localStorage.getItem("auth_token");
  const getAdminToken = () => localStorage.getItem("adminToken");

  const acceptCookies = () => setCookiesAccepted(true);
  const declineCookies = () => setCookiesAccepted(true);

  return (
    <BrowserRouter>
      <div>
        <Header isLoggedIn={!!getToken()} setIsLoggedIn={setIsLoggedIn} allEvents={AllEvents} />
        <Routes>
          <Route path="/" element={<Home allEvents={AllEvents} isLoggedIn={!!getToken()} setIsLoggedIn={setIsLoggedIn} getToken={getToken} fetchEvents={fetchEvents}/>} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/inscription" element={<Signup />} />
          <Route path="/AllEvent" element={<EventsPage allEvents={AllEvents} />} />
          <Route path="/userDetails" element={<AdminPage getToken={getToken} />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/addEvent" element={<ProtectedRoute element={<CreateEventForm getToken={getToken} fetchEvents={fetchEvents} />} />} />
          <Route path="/admin" element={<ProtectedRoute element={<GeneralAdminInterface getAdminToken={getAdminToken} allEvents={AllEvents} setEvents={setEvents} fetchEvents={fetchEvents} />} requiresAuthCheck={true} redirectTo="/adminLogin" />} />
          <Route path="/adminLogin" element={<AdminLogin />} />
          <Route path="/edit-event/:eventId" element={<EditEvent fetchEvents={fetchEvents} />} /> 
          <Route path="/MentionLegal" element={<MentionLegal />} />
          <Route path="/PolitiqueConfi" element={<PolitiqueConfi />} />
          <Route path="/GestionCookies" element={<GestionCookies />} />
        </Routes>

        {/* Intégration du Footer */}
        <Footer />

        {/* Bannière des cookies */}
        {!cookiesAccepted && (
          <div className="fixed bottom-0 left-0 w-full bg-black/30 backdrop-blur-md text-white z-50">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <p className="text-sm sm:text-base flex-grow max-w-3xl">
                Ce site utilise des cookies pour améliorer l&apos;expérience utilisateur. Acceptez-vous les cookies ?
              </p>
              <div className="flex flex-row sm:flex-row gap-3 sm:gap-4">
                <button 
                  onClick={acceptCookies} 
                  className="flex-1 md:flex-none min-w-[120px] bg-green-500 px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base font-medium hover:bg-green-600 transition-colors duration-300"
                >
                  Accepter
                </button>
                <button 
                  onClick={declineCookies} 
                  className="flex-1 md:flex-none min-w-[120px] bg-red-500 px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base font-medium hover:bg-red-600 transition-colors duration-300"
                >
                  Refuser
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </BrowserRouter>
  );
}

export default Root;

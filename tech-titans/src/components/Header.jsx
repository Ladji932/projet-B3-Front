import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { IoIosMenu, IoIosClose } from "react-icons/io";

function Header({ isLoggedIn, setIsLoggedIn, allEvents }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth_token="))
        ?.split("=")[1];
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);
    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  const eventsArray = Array.isArray(allEvents) ? allEvents : [];
  const filteredEvents = eventsArray.filter((event) =>
    event && event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    document.cookie = "auth_token=; Max-Age=0";
    navigate("/");
    setIsLoggedIn(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() === "") return;
    navigate("/results", { state: { filteredEvents } });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="w-full mx-auto px-4 py-4 flex flex-wrap justify-between items-center bg-black">
      {/* En-tête supérieur (logo et bouton mobile) */}
      <div className="flex items-center w-full justify-between">
        <Link to="/" className="blockNav1">
          <h2 className="font-bold text-white text-3xl">Event Ease</h2>
        </Link>
        <button className="lg:hidden text-3xl text-white" onClick={toggleMenu}>
          <IoIosMenu />
        </button>
      </div>

      {/* Recherche et liens (affichés sur desktop) */}
      <div className="hidden lg:flex w-full items-center justify-between mt-4">
        <div className="flex-grow max-w-lg">
          <form onSubmit={handleSearch} className="flex w-full">
            <input
              type="text"
              className="flex-grow border border-gray-300 rounded-l-lg px-4 py-2"
              placeholder="Rechercher des événements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="bg-gray-800 text-white rounded-r-lg px-4 py-2 hover:bg-blue-600"
            >
              Rechercher
            </button>
          </form>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex space-x-4">
            {isLoggedIn && (
              <Link
                to="/userDetails"
                className="bg-blue-500 text-white rounded-lg px-4 py-2"
              >
                Page utilisateur
              </Link>
            )}
            <Link
              to="/AllEvent"
              className="bg-gray-800 text-white rounded-lg px-4 py-2"
            >
              Les événements
            </Link>
          </div>
          <div className="flex space-x-4">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-600"
              >
                Déconnexion
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-gray-800 text-white rounded-lg px-4 py-2"
                >
                  Connexion
                </Link>
                <Link
                  to="/inscription"
                  className="bg-gray-800 text-white rounded-lg px-4 py-2"
                >
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Barre de recherche mobile */}
      <div className="w-full lg:hidden mt-4">
        <form onSubmit={handleSearch} className="flex w-full">
          <input
            type="text"
            className="flex-grow border border-gray-300 rounded-l-lg px-4 py-2"
            placeholder="Rechercher des événements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="bg-gray-800 text-white rounded-r-lg px-4 py-2 hover:bg-blue-600"
          >
            Rechercher
          </button>
        </form>
      </div>

      {/* Menu mobile (sidebar) */}
      <div
        className={`fixed top-0 right-0 w-64 bg-white h-full shadow-lg transform transition-transform duration-300 z-50 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } lg:hidden`}
      >
        <button
          className="absolute top-4 right-4 text-3xl"
          onClick={toggleMenu}
        >
          <IoIosClose />
        </button>
        <div className="flex flex-col items-center mt-12 space-y-6">
          {isLoggedIn && (
            <Link
              to="/userDetails"
              onClick={toggleMenu}
              className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600"
            >
              Page utilisateur
            </Link>
          )}
          <Link
            to="/AllEvent"
            onClick={toggleMenu}
            className="bg-gray-800 text-white rounded-lg px-4 py-2 hover:bg-gray-700"
          >
            Les événements
          </Link>
          {isLoggedIn ? (
            <button
              onClick={() => {
                handleLogout();
                toggleMenu();
              }}
              className="bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-600"
            >
              Déconnexion
            </button>
          ) : (
            <>
              <Link
                to="/login"
                onClick={toggleMenu}
                className="bg-gray-800 text-white rounded-lg px-4 py-2 hover:bg-gray-700"
              >
                Connexion
              </Link>
              <Link
                to="/inscription"
                onClick={toggleMenu}
                className="bg-gray-800 text-white rounded-lg px-4 py-2 hover:bg-gray-700"
              >
                Inscription
              </Link>
            </>
          )}
          <Link
            to="/"
            onClick={toggleMenu}
            className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600"
          >
            Accueil
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Header;

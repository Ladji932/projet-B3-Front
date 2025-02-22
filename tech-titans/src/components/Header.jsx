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

  // Filtrage des événements par titre
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
    <nav className="bg-black w-full px-4 py-4 overflow-x-hidden">
      {/* Barre du haut : Logo + Bouton mobile */}
      <div className="flex items-center justify-between">
        <Link to="/" className="blockNav1">
          <h2 className="font-bold text-white text-2xl sm:text-3xl">Event Ease</h2>
        </Link>
        <button className="lg:hidden text-3xl text-white" onClick={toggleMenu}>
          <IoIosMenu />
        </button>
      </div>

      {/* Barre de recherche (mobile) : visible en dessous du logo sur petit écran */}
      <div className="lg:hidden mt-4">
        <form onSubmit={handleSearch} className="flex w-full">
          <input
            type="text"
            className="flex-grow border border-gray-300 rounded-l-lg px-3 py-2"
            placeholder="Rechercher des événements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="bg-gray-800 text-white rounded-r-lg px-3 py-2 hover:bg-blue-600"
          >
            Rechercher
          </button>
        </form>
      </div>

      {/* Barre de recherche + Liens (desktop) */}
      <div className="hidden lg:flex items-center justify-between mt-4">
        {/* Recherche desktop */}
        <div className="flex-grow max-w-xl">
          <form onSubmit={handleSearch} className="flex w-full">
            <input
              type="text"
              className="flex-grow border border-gray-300 rounded-l-lg px-3 py-2"
              placeholder="Rechercher des événements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="bg-gray-800 text-white rounded-r-lg px-3 py-2 hover:bg-blue-600"
            >
              Rechercher
            </button>
          </form>
        </div>

        {/* Liens desktop */}
        <div className="flex items-center space-x-6 ml-8">
          {/* Lien(s) accessible(s) uniquement si l'utilisateur est loggé */}
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

        <div className="flex flex-col items-center mt-12 space-y-6 px-4">
          {isLoggedIn && (
            <Link
              to="/userDetails"
              onClick={toggleMenu}
              className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 w-full text-center"
            >
              Page utilisateur
            </Link>
          )}
          <Link
            to="/AllEvent"
            onClick={toggleMenu}
            className="bg-gray-800 text-white rounded-lg px-4 py-2 hover:bg-gray-700 w-full text-center"
          >
            Les événements
          </Link>
          {isLoggedIn ? (
            <button
              onClick={() => {
                handleLogout();
                toggleMenu();
              }}
              className="bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-600 w-full"
            >
              Déconnexion
            </button>
          ) : (
            <>
              <Link
                to="/login"
                onClick={toggleMenu}
                className="bg-gray-800 text-white rounded-lg px-4 py-2 hover:bg-gray-700 w-full text-center"
              >
                Connexion
              </Link>
              <Link
                to="/inscription"
                onClick={toggleMenu}
                className="bg-gray-800 text-white rounded-lg px-4 py-2 hover:bg-gray-700 w-full text-center"
              >
                Inscription
              </Link>
            </>
          )}
          <Link
            to="/"
            onClick={toggleMenu}
            className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 w-full text-center"
          >
            Accueil
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Header;

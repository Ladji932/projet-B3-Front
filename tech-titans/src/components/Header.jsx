import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosMenu, IoIosClose } from "react-icons/io";
import { useTheme } from '../ThemeContext';

function Header({ isLoggedIn, setIsLoggedIn, allEvents }) {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("auth_token");
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, [setIsLoggedIn]);

  const eventsArray = Array.isArray(allEvents) ? allEvents : [];
  const filteredEvents = eventsArray.filter((event) =>
    event && event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
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
    <nav className={`w-full px-4 py-4 px-4 py-4 shadow-lg transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gray-900 text-white border-b border-gray-800' 
        : 'bg-white text-gray-900 border-b border-gray-100'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link 
            to="/" 
            className="transform transition-transform duration-300 hover:scale-105"
          >
            <h2 className="font-bold text-2xl sm:text-3xl bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
              Event Ease
            </h2>
          </Link>

          <form onSubmit={handleSearch} className="hidden lg:flex items-center max-w-xl flex-1">
            <div className="relative flex-1">
              <input
                type="text"
                className={`w-full rounded-l-lg pl-4 pr-10 py-2.5 text-sm transition-colors duration-200 focus:outline-none focus:ring-2 ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 text-white focus:ring-blue-500' 
                    : 'bg-gray-50 border-gray-200 text-gray-900 focus:ring-blue-500'
                }`}
                placeholder="Rechercher un événement..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-r-lg text-sm font-medium transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Rechercher
            </button>
          </form>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label={isDarkMode ? "Activer le mode clair" : "Activer le mode sombre"}
          >
            <span className="text-xl">{isDarkMode ? '🌞' : '🌙'}</span>
          </button>

          <div className="hidden lg:flex items-center gap-3">
            <Link 
              to="/AllEvent"
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 bg-blue-600 text-white hover:bg-blue-700"
            >
              Les événements
            </Link>

            {isLoggedIn ? (
              <>
                <Link 
                  to="/userDetails"
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Page utilisateur
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 bg-red-600 text-white hover:bg-red-700"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Connexion
                </Link>
                <Link 
                  to="/inscription"
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 bg-blue-600 text-white hover:bg-blue-700"
                >
                  Inscription
                </Link>
              </>
            )}
          </div>

          <button 
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-lg transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Menu"
          >
            {isMenuOpen ? <IoIosClose size={28} /> : <IoIosMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`fixed inset-y-0 right-0 w-64 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full pt-16 pb-6 px-4">
          <form onSubmit={handleSearch} className="mb-6">
            <input
              type="text"
              className={`w-full px-4 py-2 rounded-lg text-sm transition-colors duration-200 ${
                isDarkMode 
                  ? 'bg-gray-700 text-white placeholder-gray-400' 
                  : 'bg-gray-50 text-gray-900 placeholder-gray-500'
              }`}
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          <div className="flex flex-col gap-3">
            {isLoggedIn && (
              <Link
                to="/userDetails"
                onClick={toggleMenu}
                className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium text-center transition-colors duration-200 ${
                  isDarkMode
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                Page utilisateur
              </Link>
            )}
            
            <Link
              to="/AllEvent"
              onClick={toggleMenu}
              className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium text-center transition-colors duration-200 ${
                isDarkMode
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Les événements
            </Link>

            {isLoggedIn ? (
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="w-full px-4 py-2.5 rounded-lg text-sm font-medium text-center bg-red-600 text-white transition-colors duration-200 hover:bg-red-700"
              >
                Déconnexion
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={toggleMenu}
                  className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium text-center transition-colors duration-200 ${
                    isDarkMode
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  Connexion
                </Link>
                <Link
                  to="/inscription"
                  onClick={toggleMenu}
                  className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium text-center transition-colors duration-200 ${
                    isDarkMode
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
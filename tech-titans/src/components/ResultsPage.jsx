import { useLocation } from "react-router-dom";
import { useTheme } from '../ThemeContext';
import { motion } from "framer-motion";

function ResultsPage() {
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const filteredEvents = location.state?.filteredEvents || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className={`min-h-screen pt-20 px-4 sm:px-6 lg:px-8 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto">
        <h1 className={`text-4xl font-bold mb-8 text-center ${
          isDarkMode ? 'text-blue-400' : 'text-blue-600'
        }`}>
          Résultats de la recherche
        </h1>

        {filteredEvents.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredEvents.map((event, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                  isDarkMode 
                    ? 'bg-gray-800 border border-gray-700' 
                    : 'bg-white border border-gray-200'
                }`}
              >
                {event.image && (
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={`${event.image}`}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${
                      isDarkMode 
                        ? 'from-gray-900/80' 
                        : 'from-black/50'
                    } to-transparent`}></div>
                  </div>
                )}
                
                <div className="p-6">
                  <h2 className={`text-2xl font-bold mb-3 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {event.title}
                  </h2>
                  
                  <p className={`mb-4 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {event.description}
                  </p>
                  
                  <div className={`space-y-2 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Catégorie:</span>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        isDarkMode 
                          ? 'bg-gray-700 text-gray-300' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {event.category}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Créé par:</span>
                      <span>{event.createdBy}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Date:</span>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        isDarkMode 
                          ? 'bg-blue-900/50 text-blue-300' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {new Date(event.dateEvent).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`text-center p-8 rounded-lg ${
              isDarkMode 
                ? 'bg-gray-800 text-gray-300' 
                : 'bg-white text-gray-500'
            }`}
          >
            <p className="text-xl">Aucun événement trouvé.</p>
            <p className="mt-2 text-sm">Essayez de modifier vos critères de recherche.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default ResultsPage;
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Trash2, LogOut, Calendar, MapPin, Mail, AlertCircle } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, eventTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all duration-300">
        <div className="flex items-center justify-center mb-4 text-red-500">
          <AlertCircle size={48} />
        </div>
        <h3 className="text-xl font-bold text-center mb-4">Confirmer la suppression</h3>
        <p className="text-gray-600 text-center mb-6">
          Êtes-vous sûr de vouloir supprimer l'événement "{eventTitle}" ? Cette action est irréversible.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

const GeneralAdminInterface = ({ fetchEvents, allEvents, setEvents, getAdminToken }) => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, eventId: null, eventTitle: '' });

  const deleteEvent = async (eventId) => {
    const authToken = getAdminToken ? getAdminToken() : null;

    if (!authToken) {
      toast.error("Authentification requise.");
      return;
    }

    try {
      await axios.delete(`https://projet-b3.onrender.com/api/user/${eventId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      setEvents(allEvents.filter(event => event._id !== eventId));
      fetchEvents();
      toast.success('Événement supprimé avec succès.');
      setDeleteModal({ isOpen: false, eventId: null, eventTitle: '' });
    } catch (err) {
      toast.error("Erreur lors de la suppression de l'événement.");
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    toast.success("Déconnexion réussie.");
    window.location.href = "/";
  };

  const openDeleteModal = (eventId, eventTitle) => {
    setDeleteModal({ isOpen: true, eventId, eventTitle });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Toaster position="top-right" />
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, eventId: null, eventTitle: '' })}
        onConfirm={() => deleteEvent(deleteModal.eventId)}
        eventTitle={deleteModal.eventTitle}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Liste des Événements
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-500 text-white rounded-lg px-6 py-3 hover:bg-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <LogOut size={20} />
            <span>Déconnexion</span>
          </button>
        </div>

        {allEvents.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-6">
              <Calendar size={48} className="mx-auto text-gray-400" />
            </div>
            <p className="text-xl text-gray-500">Aucun événement à afficher pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {allEvents.map(event => (
              <div 
                key={event._id} 
                className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
              >
                <div className="h-56 bg-gray-200 relative">
                  {event.image ? (
                    <img 
                      src={`${event.image}`} 
                      alt={event.title} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-lg font-semibold">
                      Pas d'image disponible
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <h2 className="absolute bottom-4 left-4 right-4 text-xl font-bold text-white">{event.title}</h2>
                </div>

                <div className="p-6 space-y-4">
                  <p className="text-gray-600 line-clamp-2">{event.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-500">
                      <Calendar size={18} className="mr-2" />
                      <span className="text-sm">{new Date(event.dateEvent).toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-500">
                      <MapPin size={18} className="mr-2" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-500">
                      <Mail size={18} className="mr-2" />
                      <span className="text-sm">{event.createdBy || 'Non spécifié'}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => openDeleteModal(event._id, event.title)}
                    className="w-full mt-4 flex items-center justify-center space-x-2 bg-red-500 text-white rounded-lg px-4 py-3 hover:bg-red-600 transition-all duration-300"
                  >
                    <Trash2 size={18} />
                    <span>Supprimer</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneralAdminInterface;
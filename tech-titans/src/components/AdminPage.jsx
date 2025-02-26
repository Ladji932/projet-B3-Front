import axios from 'axios';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AdminPage = ({ getToken }) => {
  console.log(getToken)
  const [adminData, setAdminData] = useState(null);
  const [participatedEvents, setParticipatedEvents] = useState([]);
  const [createdEvents, setCreatedEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 

  const token = getToken(); // Utilisation de getToken au lieu de Cookies.get
  if (!token) {
    console.log("Utilisateur non identifié. Veuillez vous connecter.");
    return null; // Retourner null pour ne rien afficher si l'utilisateur n'est pas connecté
  }

  const decodedToken = jwtDecode(token);
  const idUser = decodedToken.userId;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const request = await axios.get(`https://projet-b3.onrender.com/api/fetch-user/${idUser}`);
        setAdminData(request.data[0]);

        const userEmail = request.data[0].email;

        if (request.data[0].participatedEvents.length > 0) {
          fetchParticipatedEvents(request.data[0].participatedEvents);
        }

        fetchCreatedEvents(userEmail);
      } catch (error) {
        console.error("Erreur lors du fetch de l'utilisateur:", error);
      }
    };

    fetchUser();
  }, [idUser]);

  const fetchParticipatedEvents = async (eventIds) => {
    try {
      const response = await axios.post("https://projet-b3.onrender.com/api/fetch-user-events", { eventIds });
      const transformedEvents = response.data.map((event) => ({
        ...event,
        imageUrl: `data:image/jpeg;base64,${btoa(
          new Uint8Array(event.image.data).reduce((data, byte) => data + String.fromCharCode(byte), "")
        )}`,
      }));
      setParticipatedEvents(transformedEvents);
      setIsLoading(false);
    } catch (error) {
      console.log("Erreur lors du fetch des événements auxquels l'utilisateur a participé:", error);
      setIsLoading(false);
    }
  };
  
  const fetchCreatedEvents = async (userEmail) => {
    try {
      const response = await axios.get(`https://projet-b3.onrender.com/api/fetch-created-events/${userEmail}`);
      const transformedEvents = response.data.map((event) => ({
        ...event,
        imageUrl: `data:image/jpeg;base64,${btoa(
          new Uint8Array(event.image.data).reduce((data, byte) => data + String.fromCharCode(byte), "")
        )}`,
        createdByEmail: event.createdBy // Assurez-vous que cela contient l'e-mail
      }));

      setCreatedEvents(transformedEvents);
    } catch (error) {
      console.error("Erreur lors du fetch des événements créés par l'utilisateur:", error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await axios.delete(`https://projet-b3.onrender.com/api/event/${eventId}`, {
        data: { userId: idUser },
      });

      setCreatedEvents(createdEvents.filter(event => event._id !== eventId));
      console.log("Événement supprimé avec succès.");
    } catch (error) {
      console.error("Erreur lors de la suppression de l'événement:", error);
    }
  };

  const handleEditEvent = (eventId) => {
    navigate(`/edit-event/${eventId}`); // Utilisation de navigate pour rediriger vers la page de modification
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 via-teal-100 to-green-100 p-5">
      <div className="bg-white shadow-xl rounded-lg p-6 w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-teal-700">Page Administrateur</h1>

        {adminData ? (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <p className="font-semibold text-teal-600">Nom :</p>
              <p className="text-lg text-gray-800">{adminData.username}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <p className="font-semibold text-teal-600">Email :</p>
              <p className="text-lg text-gray-800">{adminData.email}</p>
            </div>
          
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <p className="font-semibold text-teal-600">Événements auxquels vous participez :</p>
              <ul className="grid gap-4 sm:grid-cols-2">
                {isLoading ? (
                  <div className="w-full text-center p-4 text-gray-500">
                    <span>Chargement des événements...</span>
                  </div>
                ) : (
                  participatedEvents.length > 0 ? (
                    participatedEvents.map((event, index) => (
                      <li key={index} className="overflow-hidden rounded-lg border border-gray-200 shadow-sm bg-gray-100">
                        <img src={event.imageUrl} alt={event.title} className="h-40 w-full object-cover" />
                        <div className="p-2">
                          <p className="font-medium text-teal-800">{event.title}</p>
                        </div>
                      </li>
                    ))
                  ) : (
                    <p className="text-gray-500">Aucun événement trouvé.</p>
                  )
                )}
              </ul>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <p className="font-semibold text-teal-600">Événements que vous avez créés :</p>
              <ul className="grid gap-4 sm:grid-cols-2">
                {createdEvents.length > 0 ? (
                  createdEvents.map((event, index) => (
                    <li key={index} className="overflow-hidden rounded-lg border border-gray-200 shadow-sm bg-gray-100">
                      <img src={event.imageUrl} alt={event.title} className="h-40 w-full object-cover" />
                      <div className="p-2">
                        <p className="font-medium text-teal-800">{event.title}</p>
                        <button
                          className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition"
                          onClick={() => handleEditEvent(event._id)}
                        >
                          Modifier
                        </button>
                        <button
                          className="mt-2 ml-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                          onClick={() => handleDeleteEvent(event._id)}
                        >
                          Supprimer
                        </button>
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500">Aucun événement trouvé.</p>
                )}
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">Chargement des données...</div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;

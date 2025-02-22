/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { Link } from "react-router-dom";

function Home({ allEvents, isLoggedIn, setIsLoggedIn , getCookie ,fetchEvents}) {

  console.log(allEvents)

  const [userEvents, setUserEvents] = useState([]);
  const [popup, setPopup] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);



  const authToken = getCookie("auth_token");


  const fetchUserEvents = async () => {
    if (authToken) {
      try {
        const response = await axios.get("http://localhost:3002/api/user-events", {
          headers: { Authorization: `Bearer ${authToken}` },
          withCredentials: true,
        });

        if (response.status === 200) {
          setUserEvents(response.data.events);
          if (response.data.events.length === 0) {
            console.log("Vous participez à aucun événement.");
          }
        } else {
          console.log(`Erreur lors de la récupération des événements : ${response.statusText}`);
        }
      } catch (err) {
        console.error("Erreur de récupération des événements utilisateur :", err);
      }
    } else {
      setUserEvents([]);
      console.log("Pas de token trouvé");
    }
  };

  

  
  useEffect(() => {
    const userId = localStorage.getItem("userId");
  
    const handleStorageChange = () => {
        setIsLoggedIn(!!userId);
        fetchUserEvents();
    };
  
  
    fetchUserEvents();
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
        window.removeEventListener("storage", handleStorageChange);
    };
}, []);

  const formatDate = isoDate => {
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" };
    return new Date(isoDate).toLocaleDateString("fr-FR", options);
  };

  const handlePopup = (event, type) => {
    setPopup({ event, type });
  };

  const closePopup = () => {
    setPopup(null);
  };

  const confirmAction = async () => {
    if (!popup) return;
  
    const { event, type } = popup;
    if (!authToken) {
      console.log("Utilisateur non identifié. Veuillez vous connecter.");
      closePopup();
      return;
    }
  
    let userId;
    try {
      const decodedToken = jwtDecode(authToken);
      userId = decodedToken.userId;
    } catch {
      console.log("Token utilisateur invalide. Veuillez vous reconnecter.");
      closePopup();
      return;
    }
  
    setActionLoading(true);
    try {
      const url =
        type === "participate"
          ? `http://localhost:3002/api/participate/${userId}/${event._id}`
          : `http://localhost:3002/api/withdraw/${userId}/${event._id}`;
  
      const response = await axios.post(url);
      console.log(response.data.message);
  
      await fetchUserEvents(); // Met à jour les événements auxquels l'utilisateur participe
      await fetchEvents(); // Rafraîchit tous les événements pour mettre à jour le nombre de participants
    } catch (err) {
      console.error("Erreur lors de l'action :", err);
      console.log("Une erreur est survenue lors de l'action.");
    } finally {
      setActionLoading(false);
      closePopup();
    }
  };
  
  const settings = {
    infinite: allEvents.length > 3, 
    speed: 1000,
    slidesToShow: allEvents.length < 4 ? allEvents.length : 3, 
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 740, settings: { slidesToShow: 2 } },
    ],
  };

  return (
    <div className="bg-black min-h-screen">
      {popup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-black p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
          <img src={popup.event.image} alt="" className="w-[100%] h-[30%] object-cover" />
          <h3 className="text-lg font-bold">
              {popup.type === "participate"
                ? "Confirmer la participation"
                : "Confirmer le désistement"}
            </h3>
            <p className="mt-4">
              {popup.type === "participate"
                ? `Êtes-vous sûr de vouloir participer à l'événement "${popup.event.title}" ?`
                : `Êtes-vous sûr de vouloir vous désinscrire de l'événement "${popup.event.title}" ?`}
            </p>
            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={closePopup}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Annuler
              </button>
              <button
                onClick={confirmAction}
                className={`px-4 py-2 rounded-lg text-white ${
                  actionLoading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
                }`}
                disabled={actionLoading}
              >
                {actionLoading ? "Chargement..." : "Confirmer"}
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="w-[92vw] mx-auto rounded-2xl py-14 bg-gradient-to-r from-gray-800 relative ">
        <div className="grid grid-cols-1 grid-rows-3 items-center mt-[18px] h-full px-14 text-white">
          <div>
            <h1>Bienvenue sur notre site de billetterie !</h1>
          </div>
          <div>
            <p className="text-4xl font-bold">
              Où vos rêves <span>Événementiel</span> <br /> prennent vie !
            </p>
          </div>
          <div className="pb-14">
            <p>
              Non seulement vous pouvez acheter des billets pour les événements les plus populaires, mais vous pouvez
              également créer vos propres billets personnalisés grâce à notre plateforme facile à utiliser.
            </p>
          </div>
        </div>
        <button className="absolute bottom-[-25px] left-1/2 transform -translate-x-1/2 bg-blue-600 shadow-lg text-white p-4 rounded-lg">
          Explorer les événements
        </button>
      </main>

      <section className="w-[92vw] mx-auto mt-28">
        <h2 className="text-4xl font-bold text-center text-white">Pourquoi choisir notre plateforme ?</h2>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-lg shadow-md text-center">
            <h3 className="text-2xl font-bold text-blue-600">Création simplifiée</h3>
            <p className="mt-2 text-white-600">
              Créez et gérez vos événements en quelques clics grâce à notre interface intuitive.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md text-center">
            <h3 className="text-2xl font-bold text-green-600">Billetterie personnalisée</h3>
            <p className="mt-2 text-white-600">
              Offrez à vos participants une expérience unique en personnalisant vos billets.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md text-center">
            <h3 className="text-2xl font-bold text-red-600">Notifications automatiques</h3>
            <p className="mt-2 text-white-600">
              Recevez des rappels et tenez vos participants informés de toutes les mises à jour.
            </p>
          </div>
        </div>
      </section>

      <section className="w-[92vw] mx-auto mt-28">
  <h2 className="text-4xl font-bold text-center text-white mb-12">Les événements</h2>

  <div className="relative">
    {!allEvents.length ? (
      <p className="text-center text-lg text-white-500">Aucun événement disponible.</p>
    ) : allEvents.length > 2 ? (
      <Slider
        {...{
          ...settings,
          slidesToShow: allEvents.length <= 4 ? allEvents.length : 4,
          infinite: allEvents.length > 4,
        }}
      >
        {allEvents.map(event => {
          const isParticipating = userEvents.some(userEvent => userEvent._id === event._id);

          return (
            <div key={event._id} className="p-4 w-[300px] h-[400px] flex flex-col items-center  transition-transform duration-300">
              <img src={event.image} alt={event.title} className="w-full h-48 object-cover rounded-lg" />
              <h3 className="text-xl font-bold mt-2">{event.title}</h3>
              <p className="text-white-600">{formatDate(event.dateEvent)}</p>
              <p className="text-white-600 mt-1">Participants: {event.participants.length}</p>
              <div className="mt-4">
                {isLoggedIn &&
                 <button
                 className={`px-4 py-2 rounded-lg text-white ${
                 isParticipating ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                 }`}
                onClick={() => handlePopup(event, isParticipating ? "withdraw" : "participate")}
               >
             {isParticipating ? "Se désinscrire" : "Participer"}
              </button>
                }
             
              </div>
            </div>
          );
        })}
      </Slider>
    ) : (
      <div className="flex justify-around">
        {allEvents.map(event => {
          const isParticipating = userEvents.some(userEvent => userEvent._id === event._id);

          return (
            <div key={event._id} className="p-4 w-[300px] h-[400px] flex flex-col items-center shadow-lg border rounded-lg transition-transform duration-300 transform hover:scale-105">
              <img src={event.image} alt={event.title} className="w-full h-48 object-cover rounded-lg" />
              <h3 className="text-xl font-bold mt-2">{event.title}</h3>
              <p className="text-white-600">{formatDate(event.dateEvent)}</p>




            </div>
          );
        })}
      </div>
    )}
  </div>
</section>

      <section className="w-full max-w-7xl mx-auto mt-28">
        <div className="bg-gradient-to-r from-gray-800 p-16 rounded-3xl shadow-lg text-center">
          <h2 className="text-5xl font-bold text-white mb-4 animate-in">
            Découvrez tous les événements
          </h2>
          <p className="text-xl text-white-300 mb-8 animate-in">
            Explorez des événements passionnants : conférences, concerts, ateliers et plus encore. Trouvez ce qui vous intéresse et rejoignez des expériences mémorables.
          </p>
          <div className="flex justify-center mt-10">
            <Link
              to="/AllEvent"
              className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-full text-2xl font-semibold shadow-lg hover:bg-blue-600 hover:text-white-900 hover:border-white-900 transition-all duration-300 animate-in"
            >
              Voir tous les événements
            </Link>
          </div>
        </div>
      </section>

      <section className="w-[60vw] mx-auto mt-28">
        <div className="text-center bg-black bg-gradient-to-r from-gray-800 relative p-10 rounded-xl shadow-lg">
          <h2 className="text-4xl font-bold text-white mb-4">Créer un événement</h2>
          <p className="text-lg text-white mb-8">
            Créez des événements facilement et partagez-les avec vos participants. Rejoignez notre plateforme et faites vivre des expériences uniques !
          </p>
          <Link
            to="/addEvent"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-full text-xl font-semibold shadow-lg hover:shadow-2xl hover:bg-blue-700 hover:text-white transition-all duration-300"
          >
            Créer un événement
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;

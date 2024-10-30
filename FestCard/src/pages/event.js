import React, { useEffect, useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { getUserEvents } from '../data/FirestoreService';
import { auth } from '../data/firebase-config';
import '../Css/Event.css';

const Event = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    let isMounted = true;

    const fetchEvents = async () => {
      setLoading(true);
      try {
        const user = auth.currentUser;
        if (user) {
          const userEvents = await getUserEvents(user.uid);
          if (isMounted) {
            setEvents(userEvents);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar os eventos:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  const goToMissions = (eventId) => {
    history.push(`/missions/${eventId}`);
  };

  const goToProducts = () => {
    history.push(`/products`);
  };

  const goToTicketPage = (event) => {
    history.push({
      pathname: '/ticket-page',
      state: { event }
    });
  };

  return (
    <IonPage className="event-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle className="event-header">Meus Eventos</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {loading ? (
          <p>Carregando eventos...</p>
        ) : events.length > 0 ? (
          <IonList className="event-list">
            {events.map(event => (
              <IonItem key={event.id} className="event-item">
                <IonLabel>
                  <h2>{event.title}</h2>
                  <p>Data: {event.date ? new Date(event.date.seconds * 1000).toLocaleDateString() : 'Data não disponível'}</p>
                </IonLabel>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <IonButton className="event-button" onClick={() => goToMissions(event.id)}>
                    Ver Missões
                  </IonButton>
                  <IonButton className="event-button" onClick={goToProducts}>
                    Ver Produtos
                  </IonButton>
                  <IonButton className="event-button" onClick={() => goToTicketPage(event)}>
                    Ver Ticket
                  </IonButton>
                </div>
              </IonItem>
            ))}
          </IonList>
        ) : (
          <p>Você ainda não tem eventos.</p>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Event;

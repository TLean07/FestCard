import React, { useEffect, useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { getUserEvents } from '../data/FirestoreService';
import { auth } from '../data/firebase-config';

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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Meus Eventos</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {loading ? (
          <p>Carregando eventos...</p>
        ) : events.length > 0 ? (
          <IonList>
            {events.map(event => (
              <IonItem key={event.id}>
                <IonLabel>
                  <h2>{event.title}</h2>
                  <p>Data: {new Date(event.date.seconds * 1000).toLocaleDateString()}</p>
                </IonLabel>
                <IonButton onClick={() => goToMissions(event.id)}>Ver Missões</IonButton>
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

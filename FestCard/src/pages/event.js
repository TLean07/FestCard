import React, { useEffect, useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel } from '@ionic/react';

const Event = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Carrega os eventos comprados do localStorage
    const purchasedEvents = JSON.parse(localStorage.getItem('purchasedEvents')) || [];
    setEvents(purchasedEvents);
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Meus Eventos</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {events.length === 0 ? (
          <p style={{ textAlign: 'center', marginTop: '20px' }}>Você não comprou nenhum ingresso ainda.</p>
        ) : (
          <IonList>
            {events.map((event, index) => (
              <IonItem key={index}>
                <IonLabel>
                  <h2>{event.title}</h2>
                  <p>{event.date}</p>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Event;

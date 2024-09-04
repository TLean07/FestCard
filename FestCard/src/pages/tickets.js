import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton } from '@ionic/react';

const Ticket = () => {
  // Dados fictícios dos shows
  const shows = [
    { id: 1, title: 'Rock in Rio', date: '25 de Setembro, 2024' },
    { id: 2, title: 'Lollapalooza', date: '15 de Março, 2024' },
    { id: 3, title: 'Tomorrowland', date: '10 de Julho, 2024' },
    { id: 4, title: 'Coachella', date: '20 de Abril, 2024' },
    { id: 5, title: 'Ultra Music Festival', date: '8 de Outubro, 2024' },
    { id: 6, title: 'EDC Las Vegas', date: '18 de Junho, 2024' },
    { id: 7, title: 'Burning Man', date: '30 de Agosto, 2024' },
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tickets Disponíveis</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent>
        {shows.map(show => (
          <IonCard key={show.id}>
            <IonCardHeader>
              <IonCardTitle>{show.title}</IonCardTitle>
              <IonCardSubtitle>{show.date}</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              Aproveite o melhor deste show e garanta já seu ingresso!
              <IonButton expand="block" color="primary" style={{ marginTop: '10px' }}>
                Comprar Ingresso
              </IonButton>
            </IonCardContent>
          </IonCard>
        ))}
      </IonContent>
    </IonPage>
  );
};

export default Ticket;

import React, { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/react';
import { useHistory, useLocation } from 'react-router-dom';
import { addUserEvent } from '../data/FirestoreService';
import { auth } from '../data/firebase-config';

const PurchaseConfirmation = () => {
  const history = useHistory();
  const location = useLocation();
  const { event } = location.state || {};
  const [loading, setLoading] = useState(false);

  const handleAddEvent = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user && event) {
        await addUserEvent(user.uid, event);
        history.push('/events');
      }
    } catch (error) {
      console.error("Erro ao salvar o evento:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!event) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Confirmação de Compra</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <h2>Nenhum evento encontrado!</h2>
          <IonButton onClick={() => history.push('/ticket')} expand="block" color="medium">
            Comprar Ingresso
          </IonButton>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Confirmação de Compra</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h2>Compra realizada com sucesso!</h2>
        <p>Você comprou o ingresso para:</p>
        <p><strong>{event.title}</strong></p>
        <p>Data: {event.date}</p>

        <IonButton onClick={handleAddEvent} expand="block" color="primary" disabled={loading}>
          {loading ? 'Salvando...' : 'Ver Meus Eventos'}
        </IonButton>
        <IonButton onClick={() => history.push('/ticket')} expand="block" color="medium">
          Comprar Outro Ingresso
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default PurchaseConfirmation;

import React, { useEffect, useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonToast } from '@ionic/react';
import { useLocation, useHistory } from 'react-router-dom';
import { addUserEvent } from '../data/FirestoreService'; 
import { auth } from '../data/firebase-config'; 

const PurchaseConfirmation = () => {
  const location = useLocation();
  const history = useHistory();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [hasSaved, setHasSaved] = useState(false); 

 
  const { event } = location.state || {};

  useEffect(() => {
    const handleSaveEvent = async () => {
      const user = auth.currentUser;

      if (event && user && !hasSaved) {
        try {
          await addUserEvent(user.uid, event); 
          setToastMessage('Evento salvo com sucesso!');
          setHasSaved(true);
        } catch (error) {
          console.error('Erro ao salvar o evento:', error);
          setToastMessage('Erro ao salvar o evento.');
        } finally {
          setShowToast(true);
        }
      }
    };

    if (event && !hasSaved) {
      handleSaveEvent(); 
    }
  }, [event, hasSaved]);

  const handleBuyMoreTickets = () => {
    history.push('/ticket');
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
          <h2>Nenhum evento disponível!</h2>
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
        <p><strong>{event?.title}</strong></p>
        <p>Data: {event?.date}</p>

        <IonButton onClick={handleBuyMoreTickets} expand="block" color="medium" className="ion-margin-top">
          Continuar Comprando
        </IonButton>

        <IonToast
          isOpen={showToast}
          message={toastMessage}
          duration={3000}
          onDidDismiss={() => setShowToast(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default PurchaseConfirmation;

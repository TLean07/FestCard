import React, { useEffect } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/react';
import { useHistory, useLocation } from 'react-router-dom';

const PurchaseConfirmation = () => {
  const history = useHistory();
  const location = useLocation();

  // Verifique se o evento foi passado corretamente
  const { event } = location.state || {};

  useEffect(() => {
    // Se não há evento, redireciona para /ticket, mas apenas se já não estiver em /ticket
    if (!event && history.location.pathname !== '/ticket') {
      history.replace('/ticket');
    }
  }, [event, history]);

  const handleViewEvents = () => {
    // Navega para /events apenas se já não estiver nessa rota
    if (history.location.pathname !== '/events') {
      history.push('/events');
    }
  };

  const handleBuyMoreTickets = () => {
    // Navega para /ticket apenas se já não estiver nessa rota
    if (history.location.pathname !== '/ticket') {
      history.push('/ticket');
    }
  };

  // Se o redirecionamento para /ticket ocorrer, não renderiza o conteúdo
  if (!event) {
    return null;
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

        <IonButton onClick={handleViewEvents} expand="block" className="ion-margin-top">
          Ver Meus Eventos
        </IonButton>
        
        <IonButton onClick={handleBuyMoreTickets} expand="block" color="medium" className="ion-margin-top">
          Comprar Outro Ingresso
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default PurchaseConfirmation;
 
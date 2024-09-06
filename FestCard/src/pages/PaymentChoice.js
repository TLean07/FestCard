import React, { useState, useEffect } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle } from '@ionic/react';
import { useHistory, useLocation } from 'react-router-dom';

const PaymentChoice = () => {
  const history = useHistory();
  const location = useLocation();
  const { event } = location.state || {};

  const [festCoins, setFestCoins] = useState(100); // Quantidade inicial de FestCoins do usuário
  const [cardBalance, setCardBalance] = useState(500); // Exemplo de saldo inicial do cartão
  const [error, setError] = useState(null); // Estado para erros

  useEffect(() => {
    if (!event) {
      history.replace('/ticket');
    }
  }, [event, history]);

  const handleFestCoinPurchase = () => {
    if (festCoins >= event.price) {
      setFestCoins(festCoins - event.price);
      history.push('/purchase-confirmation', { event }); // Apenas redireciona, não salva aqui
    } else {
      if (!error) setError('Saldo insuficiente de FestCoins');
    }
  };

  const handleCardPurchase = () => {
    if (cardBalance >= event.price) {
      setCardBalance(cardBalance - event.price);
      history.push('/purchase-confirmation', { event }); // Apenas redireciona, não salva aqui
    } else {
      if (!error) setError('Saldo insuficiente no cartão');
    }
  };

  if (!event) {
    return null;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Escolha a Forma de Pagamento</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>{event.title}</IonCardTitle>
            <IonCardSubtitle>Preço: {event.price} moedas</IonCardSubtitle>
          </IonCardHeader>
        </IonCard>

        <IonButton expand="block" onClick={handleFestCoinPurchase}>
          <img src="/icon.png" alt="FestCoins" style={{ width: '24px', marginRight: '8px' }} />
          Pagar com FestCoins (Saldo: {festCoins})
        </IonButton>

        <IonButton expand="block" color="secondary" onClick={handleCardPurchase} style={{ marginTop: '20px' }}>
          Pagar com Saldo do Cartão (Saldo: {cardBalance})
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default PaymentChoice;

import React, { useState, useEffect } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle } from '@ionic/react';
import { useHistory, useLocation } from 'react-router-dom';
import { AccountStore, updateFestCoins, updateBalance } from '../data/AccountStore';

const PaymentChoice = () => {
  const history = useHistory();
  const location = useLocation();
  const { event } = location.state || {};
  const festCoins = AccountStore.useState(s => s.profile.festCoins);
  const balance = AccountStore.useState(s => s.profile.balance);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!event) {
      history.replace('/ticket');
    }
  }, [event, history]);

  const handleFestCoinPurchase = () => {
    if (festCoins >= event.price) {
      updateFestCoins(event.price); // Deduz o valor de FestCoins
      history.push('/purchase-confirmation', { event });
    } else {
      setError('Saldo insuficiente de FestCoins');
    }
  };

  const handleCardPurchase = () => {
    if (balance >= event.price) {
      updateBalance(event.price); // Deduz o valor em dinheiro
      history.push('/purchase-confirmation', { event });
    } else {
      setError('Saldo insuficiente no cartão');
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
        {error && <p style={{ color: 'red' }}>{error}</p>}
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
          Pagar com Saldo do Cartão (Saldo: {balance})
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default PaymentChoice;
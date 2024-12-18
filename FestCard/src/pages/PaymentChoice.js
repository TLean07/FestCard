import React, { useState, useEffect } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonLabel, IonToast, IonList } from '@ionic/react';
import { useHistory, useLocation } from 'react-router-dom';
import { AccountStore, updateFestCoins, updateBalance, addTransactionToCard } from '../data/AccountStore';
import '../Css/PaymentChoice.css';

const PaymentChoice = () => {
  const history = useHistory();
  const location = useLocation();
  const { event } = location.state || {};
  const festCoins = AccountStore.useState(s => s.profile.festCoins);
  const cards = AccountStore.useState(s => s.cards);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [filteredCards, setFilteredCards] = useState([]);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [cashbackMessage, setCashbackMessage] = useState('');

  useEffect(() => {
    console.log("Cartões carregados:", cards);
  }, [cards]);

  useEffect(() => {
    if (!event || !event.category) {
      setFilteredCards([]);
      return;
    }

    console.log("Evento:", event);
    console.log("Categoria do evento:", event.category);
    console.log("Cartões disponíveis antes da filtragem:", cards);

    if (event.category === 'esporte') {
      const esportesCards = cards.filter(card => card.color === 'blue');
      console.log("Cartões filtrados para esporte (Azul):", esportesCards);
      setFilteredCards(esportesCards);
    } else if (event.category === 'festival') {
      const festivalCards = cards.filter(card => card.color === 'purple');
      console.log("Cartões filtrados para festival (Roxo):", festivalCards);
      setFilteredCards(festivalCards);
    } else if (event.category === 'show') {
      const showCards = cards.filter(card => card.color === 'black');
      console.log("Cartões filtrados para shows (Preto):", showCards);
      setFilteredCards(showCards);
    }

  }, [event, cards]);

  useEffect(() => {
    if (!event) {
      history.replace('/ticket');
    }
  }, [event, history]);

  const handleFestCoinPurchase = async () => {
    const festCoinValue = 0.35;
    const festCoinsNeeded = Math.ceil(event.price / festCoinValue);

    if (festCoins >= festCoinsNeeded) {
      await updateFestCoins(-festCoinsNeeded);

      const transaction = {
        name: `Compra de ingresso: ${event.title}`,
        amount: event.price,
        deposit: false,
        date: new Date().toISOString(),
        isFestCoin: true,
      };

      await addTransactionToCard(transaction, null); // Transação usando FestCoins, não associada a um cartão

      history.push('/purchase-confirmation', { event });
    } else {
      setError('Saldo insuficiente de FestCoins');
    }
  };

  const handleCardPurchase = async () => {
    const selectedCard = filteredCards.find(card => card.id === selectedCardId);
    if (!selectedCard) {
      setError('Selecione um cartão válido.');
      return;
    }

    if (selectedCard.balance >= event.price) {
      try {
        const exactPrice = event.price; // Garantir que o preço seja o correto

        console.log('Preço exato descontado:', exactPrice);
        console.log('Saldo atual do cartão antes do débito:', selectedCard.balance);

        await updateBalance(selectedCard.id, exactPrice); 

        console.log('Saldo atualizado após o débito:', selectedCard.balance - exactPrice);

        const transaction = {
          name: `Compra de ingresso: ${event.title}`,
          amount: exactPrice,
          deposit: false,
          date: new Date().toISOString(),
        };

        await addTransactionToCard(transaction, selectedCard.id); // Transação associada ao cartão

        const festCoinsEarned = Math.floor(event.price / 3); // Cashback em FestCoins
        if (festCoinsEarned > 0) {
          await updateFestCoins(festCoinsEarned); // Adiciona o cashback às FestCoins

          const festCoinTransaction = {
            name: `Cashback por compra de ingresso: ${event.title}`,
            amount: festCoinsEarned,
            deposit: true,
            date: new Date().toISOString(),
            isFestCoin: true,
          };

          await addTransactionToCard(festCoinTransaction, null);

          setCashbackMessage(`Você ganhou ${festCoinsEarned} FestCoin(s) como cashback!`);
          setShowToast(true);
        }

        history.push('/purchase-confirmation', { event });
      } catch (error) {
        setError('Erro ao processar a compra. Tente novamente.');
      }
    } else {
      setError('Saldo insuficiente no cartão selecionado.');
    }
  };

  return (
    <IonPage className="payment-choice-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle className="payment-header">Escolha a Forma de Pagamento</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {error && <IonToast isOpen={true} message={error} duration={3000} onDidDismiss={() => setError(null)} />}
        {showToast && <IonToast isOpen={true} message={cashbackMessage} duration={5000} onDidDismiss={() => setShowToast(false)} />}
        
        <IonList className="card-list">
          {filteredCards.length > 0 ? (
            filteredCards.map(card => (
              <IonItem
                key={card.id}
                button
                onClick={() => setSelectedCardId(card.id)}
                className={`card-item ${selectedCardId === card.id ? 'selected-card' : ''}`}
              >
                <IonLabel>
                  <h4>{card.description}</h4>
                  <p>FestCoins: {card.festCoins} - R$ {Number(card.balance).toFixed(2)}</p>
                </IonLabel>
              </IonItem>
            ))
          ) : (
            <IonItem>Nenhum cartão disponível</IonItem>
          )}
        </IonList>

        <IonButton expand="block" className="payment-button" onClick={handleFestCoinPurchase} disabled={!event}>
          Pagar com FestCoins (Saldo: {festCoins})
        </IonButton>

        <IonButton 
          expand="block" 
          className="payment-button" 
          onClick={handleCardPurchase} 
          style={{ marginTop: '20px' }} 
          disabled={!selectedCardId || !event}
        >
          Pagar com Saldo do Cartão (Saldo: R$ {filteredCards.find(card => card.id === selectedCardId)?.balance ? Number(filteredCards.find(card => card.id === selectedCardId).balance).toFixed(2) : '0.00'})
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default PaymentChoice;

import React, { useState, useEffect } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonLabel, IonToast, IonList } from '@ionic/react';
import { useHistory, useLocation } from 'react-router-dom';
import { AccountStore, updateFestCoins, updateBalance, addTransactionToCard } from '../data/AccountStore';

const PaymentChoice = () => {
  const history = useHistory();
  const location = useLocation();
  const { event } = location.state || {}; // Verifica se o evento existe, caso contrário, usa um objeto vazio.
  const festCoins = AccountStore.useState(s => s.profile.festCoins);
  const cards = AccountStore.useState(s => s.cards); // Carrega os cartões do estado
  const [selectedCardId, setSelectedCardId] = useState(null); // Armazena o ID do cartão selecionado
  const [filteredCards, setFilteredCards] = useState([]); // Armazena os cartões filtrados
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false); // Controle para o Toast de cashback
  const [cashbackMessage, setCashbackMessage] = useState(''); // Mensagem do cashback

  // Adicionando log para verificar os cartões
  useEffect(() => {
    console.log("Cartões carregados:", cards); // Verifica se os cartões foram carregados
  }, [cards]);

  // Função para filtrar os cartões com base na categoria do evento
  useEffect(() => {
    if (!event || !event.category) {
      setFilteredCards([]); // Se o evento ou a categoria não existirem, retorna um array vazio
      return;
    }

    console.log("Evento:", event);
    console.log("Categoria do evento:", event.category);
    console.log("Cartões disponíveis antes da filtragem:", cards);

    // Filtrando cartões pela cor correta com base na categoria do evento
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

  // Redireciona se o evento não existir
  useEffect(() => {
    if (!event) {
      history.replace('/ticket'); // Se o evento não existir, redireciona para a página de tickets
    }
  }, [event, history]);

  const handleFestCoinPurchase = async () => {
    const festCoinValue = 0.35; // Valor de cada FestCoin em reais
    const festCoinsNeeded = Math.ceil(event.price / festCoinValue); // Número de FestCoins necessários para a compra

    if (festCoins >= festCoinsNeeded) {
      // Deduz o número necessário de FestCoins do saldo do usuário
      await updateFestCoins(-festCoinsNeeded); // Agora estamos **deduzindo** a quantidade correta de FestCoins

      // Adiciona a compra como uma transação de FestCoins
      const transaction = {
        name: `Compra de ingresso: ${event.title}`,
        amount: event.price,
        deposit: false,
        date: new Date().toISOString(),
        isFestCoin: true, // Marca como transação de FestCoins
      };

      await addTransactionToCard(transaction, selectedCardId); // Função para adicionar a transação

      history.push('/purchase-confirmation', { event });
    } else {
      setError('Saldo insuficiente de FestCoins');
    }
  };

  const handleCardPurchase = async () => {
    const selectedCard = filteredCards.find(card => card.id === selectedCardId); // Encontra o cartão pelo ID
    if (!selectedCard) {
      setError('Selecione um cartão válido.');
      return;
    }

    if (selectedCard.balance >= event.price) {
      try {
        // Atualiza o saldo do cartão
        const roundedPrice = parseFloat(event.price.toFixed(2)); // Arredonda o valor para 2 casas decimais
        await updateBalance(selectedCard.id, roundedPrice);

        // Adiciona a compra como uma transação no cartão
        const transaction = {
          name: `Compra de ingresso: ${event.title}`, // Descrição da transação
          amount: roundedPrice,
          deposit: false, // É uma compra, portanto não é depósito
          date: new Date().toISOString(),
        };

        await addTransactionToCard(transaction, selectedCard.id); // Função para adicionar a transação

        // **Somente aplica cashback para compras feitas com dinheiro**
        const festCoinsEarned = Math.floor(event.price / 3); // FestCoins ganhos
        if (festCoinsEarned > 0) {
          await updateFestCoins(festCoinsEarned); // Adiciona as FestCoins ganhas ao saldo

          // Registra a transação de ganho de FestCoins como cashback
          const festCoinTransaction = {
            name: `Cashback por compra de ingresso: ${event.title}`,
            amount: festCoinsEarned,
            deposit: true, // É um depósito de FestCoins
            date: new Date().toISOString(),
            isFestCoin: true, // Marca como transação de FestCoins
          };

          await addTransactionToCard(festCoinTransaction, selectedCard.id); // Adiciona transação de FestCoins ganhas

          // Define a mensagem de cashback e mostra o Toast
          setCashbackMessage(`Você ganhou ${festCoinsEarned} FestCoin(s) como cashback!`);
          setShowToast(true);
        }

        // Redireciona para a confirmação da compra
        history.push('/purchase-confirmation', { event });
      } catch (error) {
        setError('Erro ao processar a compra. Tente novamente.');
      }
    } else {
      setError('Saldo insuficiente no cartão selecionado.');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Escolha a Forma de Pagamento</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {error && <IonToast isOpen={true} message={error} duration={3000} onDidDismiss={() => setError(null)} />}
        {showToast && <IonToast isOpen={true} message={cashbackMessage} duration={5000} onDidDismiss={() => setShowToast(false)} />}
        
        <IonList>
          {filteredCards.length > 0 ? (
            filteredCards.map(card => (
              <IonItem
                key={card.id}
                button
                onClick={() => setSelectedCardId(card.id)} // Define o cartão selecionado ao clicar
                color={selectedCardId === card.id ? 'primary' : ''} // Destaca o cartão selecionado
              >
                <IonLabel>
                  <h2>{card.description}</h2>
                  <p>FestCoins: {card.festCoins} - R$ {card.balance.toFixed(2)}</p>
                </IonLabel>
              </IonItem>
            ))
          ) : (
            <IonItem>Nenhum cartão disponível</IonItem>
          )}
        </IonList>

        <IonButton expand="block" onClick={handleFestCoinPurchase} disabled={!event}>
          Pagar com FestCoins (Saldo: {festCoins})
        </IonButton>

        <IonButton 
          expand="block" 
          color="secondary" 
          onClick={handleCardPurchase} 
          style={{ marginTop: '20px' }} 
          disabled={!selectedCardId || !event}
        >
          Pagar com Saldo do Cartão (Saldo: R$ {filteredCards.find(card => card.id === selectedCardId)?.balance.toFixed(2) || 0})
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default PaymentChoice;

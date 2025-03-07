import React, { useState } from "react";
import { IonBackButton, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonPage, IonRow, IonTitle, IonToggle, IonToolbar, useIonViewWillEnter } from "@ionic/react";
import styles from "./Account.module.css";
import DebitCard from "../components/DebitCard";
import { AccountStore, addTransactionToCard } from "../data/AccountStore";
import { useHistory, useParams } from "react-router";
import { addOutline, timerOutline, arrowBackOutline } from "ionicons/icons";
import '../Css/AddTransaction.css';

const AddTransaction = () => {
  const cards = AccountStore.useState((s) => s.cards);
  const profile = AccountStore.useState((s) => s.profile);

  const [cardID, setCardID] = useState(null);
  const [card, setCard] = useState(null);
  const [transactionName, setTransactionName] = useState("Transação Teste");
  const [transactionAmount, setTransactionAmount] = useState(0);
  const [transactionDeposit, setTransactionDeposit] = useState(false);

  const history = useHistory();
  const params = useParams();
  const [adding, setAdding] = useState(false);

  useIonViewWillEnter(() => {
    const tempCardID = params.card_id;
    setCardID(tempCardID);

    const tempCard = cards.find((c) => c.id === tempCardID);
    if (tempCard) {
      setCard(tempCard);
    } else {
      console.error("Cartão não encontrado");
    }
  });

  const addTransaction = async () => {
    if (!transactionName || !transactionAmount) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    if (!card) {
      console.error("Cartão não encontrado. Operação cancelada.");
      return;
    }

    setAdding(true);

    const newTransaction = {
      name: transactionName,
      amount: parseFloat(transactionAmount),
      deposit: transactionDeposit,
      date: new Date().toISOString(),
    };

    try {
      await addTransactionToCard(newTransaction, cardID);
      history.goBack();
    } catch (error) {
      console.error("Erro ao adicionar transação:", error);
      alert("Erro ao adicionar transação. Por favor, tente novamente.");
    } finally {
      setAdding(false);
    }
  };

  if (!card) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton routerLink="/home">
                <IonIcon icon={arrowBackOutline} style={{ color: "var(--ion-icon-color)" }} />
              </IonButton>
            </IonButtons>
            <IonTitle>Adicionar Transação</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonGrid>
            <IonRow className="ion-text-center ion-justify-content-center">
              <IonCol>
                <p>Cartão não encontrado</p>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage className={styles.accountPage}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" style={{ color: "var(--ion-icon-color)" }} />
          </IonButtons>
          <IonTitle>Adicionar Transação</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonGrid>
          <IonRow className="animate__animated animate__fadeInTopLeft animate__faster ion-justify-content-center ion-text-center">
            <IonCol
              size="12"
              className="ion-justify-content-center ion-text-center"
            >
              <DebitCard {...card} profile={profile} />
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size="6">
              <IonItem lines="full">
                <IonLabel position="floating">Nome</IonLabel>
                <IonInput
                  type="text"
                  inputMode="text"
                  placeholder="Nome da Transação"
                  value={transactionName}
                  onIonChange={(e) => setTransactionName(e.detail.value)}
                />
              </IonItem>
            </IonCol>

            <IonCol size="6">
              <IonItem lines="full">
                <IonLabel position="floating">Quantia</IonLabel>
                <IonInput
                  type="number"
                  inputMode="numeric"
                  placeholder="0"
                  value={transactionAmount}
                  onIonChange={(e) => setTransactionAmount(e.detail.value)}
                />
              </IonItem>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size="12">
              <IonItem lines="full">
                <IonLabel>Depósito?</IonLabel>
                <IonToggle
                  style={{ "--background-checked": card.color }}
                  slot="end"
                  checked={transactionDeposit}
                  onIonChange={(e) => setTransactionDeposit(e.detail.checked)}
                />
              </IonItem>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size="12">
              <IonButton
                style={{ "--background": card.color }}
                expand="block"
                disabled={adding}
                onClick={addTransaction}
              >
                {!adding ? (
                  <>
                    <IonIcon icon={addOutline} />
                    &nbsp; Adicionar Transação
                  </>
                ) : (
                  <>
                    <IonIcon icon={timerOutline} />
                    &nbsp; Adicionando...
                  </>
                )}
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default AddTransaction;
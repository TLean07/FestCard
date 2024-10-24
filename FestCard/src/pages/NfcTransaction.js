import React, { useState, useEffect } from "react";
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToast, IonToolbar, IonGrid, IonRow, IonCol, IonBackButton } from "@ionic/react";
import { NFC } from "@ionic-native/nfc";
import { FingerprintAIO } from "@ionic-native/fingerprint-aio";
import { cashOutline } from "ionicons/icons";
import { useParams, useHistory } from "react-router";
import { addTransactionToCard, AccountStore } from "../data/AccountStore";
import DebitCard from "../components/DebitCard";
import '../Css/NfcTransaction.css';

const NfcTransaction = () => {
  const { card_id } = useParams();
  const history = useHistory();
  const cards = AccountStore.useState((s) => s.cards);
  const profile = AccountStore.useState((s) => s.profile);
  const [card, setCard] = useState(null);
  const [transactionAmount, setTransactionAmount] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const selectedCard = cards.find((c) => c.id === card_id);
    if (selectedCard) {
      setCard(selectedCard);
    } else {
      console.error("Cartão não encontrado");
    }
  }, [card_id, cards]);

  const handleNfcPayment = async () => {
    try {
      const isBiometricAvailable = await FingerprintAIO.isAvailable();

      if (isBiometricAvailable) {
        try {
          await FingerprintAIO.show({
            title: "Autenticar Pagamento",
            subtitle: "Confirme sua identidade para prosseguir",
            description: "Digital necessária para continuar",
          });
        } catch (biometricError) {
          setToastMessage("Autenticação biométrica falhou.");
          setShowToast(true);
          return;
        }
      }

      NFC.enabled().then(() => {
        NFC.beginSession().subscribe(
          (nfcData) => {
            const detectedAmount = parseFloat(nfcData.tag.ndefMessage[0].payload);
            if (isNaN(detectedAmount) || detectedAmount <= 0) {
              setToastMessage("Valor inválido detectado pela maquininha.");
              setShowToast(true);
              NFC.endSession();
              return;
            }

            setTransactionAmount(detectedAmount);

            if (card.balance >= detectedAmount) {
              processTransaction(detectedAmount);
            } else {
              setToastMessage("Saldo insuficiente para realizar o pagamento.");
              setShowToast(true);
              NFC.endSession();
            }
          },
          (err) => {
            setToastMessage("Erro ao ler dados NFC.");
            setShowToast(true);
            NFC.endSession();
          }
        );
      }).catch(() => {
        setToastMessage("NFC não está ativado ou disponível.");
        setShowToast(true);
      });
    } catch (error) {
      setToastMessage("Erro durante o processo NFC.");
      setShowToast(true);
    }
  };

  const processTransaction = async (amount) => {
    const newTransaction = {
      name: "Pagamento NFC",
      amount: amount,
      deposit: false,
      date: new Date().toISOString(),
    };

    await addTransactionToCard(newTransaction, card_id);

    AccountStore.update((s) => {
      const cardToUpdate = s.cards.find((c) => c.id === card_id);
      if (cardToUpdate) {
        cardToUpdate.balance -= amount;
      }
    });

    setToastMessage(`Pagamento de R$ ${amount.toFixed(2)} realizado com sucesso!`);
    setShowToast(true);

    setTimeout(() => {
      history.push("/home");
    }, 2000);

    NFC.endSession();
  };

  if (!card) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/home" style={{ color: "var(--ion-icon-color)" }} />
            </IonButtons>
            <IonTitle>Pagamento NFC</IonTitle>
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
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" style={{ color: "var(--ion-icon-color)" }} />
          </IonButtons>
          <IonTitle>Pagamento NFC</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonGrid>
          <IonRow className="animate__animated animate__fadeInTopLeft animate__faster ion-justify-content-center ion-text-center">
            <IonCol size="12" className="ion-justify-content-center ion-text-center">
              <DebitCard {...card} profile={profile} />
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size="12">
              <IonButton
                expand="block"
                onClick={handleNfcPayment}
                style={{ "--background": card.color, "--background-hover": card.color }}
              >
                <IonIcon icon={cashOutline} />
                &nbsp;Confirmar Pagamento NFC
              </IonButton>
            </IonCol>
          </IonRow>

          {transactionAmount > 0 && (
            <IonRow>
              <IonCol size="12">
                <p>Valor detectado pela maquininha: R$ {transactionAmount.toFixed(2)}</p>
              </IonCol>
            </IonRow>
          )}
        </IonGrid>

        <IonToast isOpen={showToast} message={toastMessage} duration={2000} />
      </IonContent>
    </IonPage>
  );
};

export default NfcTransaction;
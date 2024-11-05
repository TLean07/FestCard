import React, { useState, useEffect } from "react";
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonInput, IonLabel, IonRow, IonCol, IonText, IonToast, IonGrid } from "@ionic/react";
import { qrCodeOutline, keyOutline, arrowBackOutline } from "ionicons/icons";
import { QRCodeCanvas } from "qrcode.react";
import { useParams } from "react-router-dom";
import { addTransactionToCard, AccountStore } from "../data/AccountStore"; 
import DebitCard from "../components/DebitCard";
import styles from "./Account.module.css"; 
import '../Css/PixDeposit.css';

const PixDeposit = () => {
    const { cardId } = useParams(); 
    const cards = AccountStore.useState((s) => s.cards); 
    const [amount, setAmount] = useState(""); 
    const [generatedQR, setGeneratedQR] = useState(null); 
    const [pixKey, setPixKey] = useState(""); 
    const [showToast, setShowToast] = useState(false); 
    const [toastMessage, setToastMessage] = useState(""); 
    const [card, setCard] = useState(null); 

    useEffect(() => {
        const tempCard = cards.find((c) => c.id === cardId);
        if (tempCard) {
            setCard(tempCard);
        } else {
            console.error("Cartão não encontrado");
        }

        const generatePixKey = () => {
            const randomKey = `chave-pix-${Math.random().toString(36).substr(2, 10)}`;
            setPixKey(randomKey);
        };

        generatePixKey();
    }, [cardId, cards]);

    const handleGenerateQRCode = () => {
        if (amount && parseFloat(amount) > 0) {
            const qrData = `00020126580014BR.GOV.BCB.PIX0136${pixKey}5204000053039865802BR5925Nome do Recebedor6009Cidade00000000000000000000000${amount}`;
            setGeneratedQR(qrData); 
        } else {
            setToastMessage("Por favor, insira um valor válido.");
            setShowToast(true);
        }
    };

    const handlePixDeposit = async () => {
        if (amount && parseFloat(amount) > 0) {
            await addTransactionToCard({
                name: "Depósito via Pix",
                amount: parseFloat(amount),
                deposit: true,
            }, cardId);

            setToastMessage(`Depósito de R$ ${amount} realizado com sucesso!`);
            setShowToast(true);
            setAmount(""); 
            setGeneratedQR(null);
        } else {
            setToastMessage("Erro: O valor do depósito precisa ser maior que zero.");
            setShowToast(true);
        }
    };

    if (!card) {
        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonButton slot="start" routerLink="/home" fill="clear">
                            <IonIcon icon={arrowBackOutline} style={{ color: "var(--ion-toolbar-color)" }} />
                        </IonButton>
                        <IonTitle>Depósito via Pix</IonTitle>
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
                    <IonButton slot="start" routerLink="/home" fill="clear">
                        <IonIcon icon={arrowBackOutline} style={{ color: "var(--ion-toolbar-color)" }} />
                    </IonButton>
                    <IonTitle>Depósito via Pix</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen className="ion-padding">
                <IonGrid> 
                    <IonRow className="ion-justify-content-center ion-text-center">
                        <IonCol size="12">
                            <DebitCard color={card.color} type={card.type} expiry={card.expiry} number={card.number} secret={card.secret} profile={card.profile} />
                        </IonCol>
                    </IonRow>

                    <IonRow className="ion-margin-top ion-justify-content-center">
                        <IonCol size="12" className="ion-text-center">
                            <IonLabel position="floating">Valor do Depósito (R$)</IonLabel>
                            <IonInput
                                value={amount}
                                type="number"
                                placeholder="Insira o valor"
                                onIonChange={(e) => setAmount(e.detail.value)}
                            />
                        </IonCol>
                    </IonRow>

                    <IonRow className="ion-text-center ion-margin-top">
                        <IonCol size="12">
                            <IonButton 
                                style={{ "--background": card.color }} 
                                onClick={handleGenerateQRCode}
                            >
                                <IonIcon icon={qrCodeOutline} />
                                Gerar QR Code
                            </IonButton>
                        </IonCol>
                    </IonRow>

                    {generatedQR && (
                        <IonRow className="ion-text-center ion-padding">
                            <IonCol size="12">
                                <QRCodeCanvas value={generatedQR} size={256} />
                                <IonText color="primary"></IonText>
                            </IonCol>
                        </IonRow>
                    )}

                    <IonRow className="ion-text-center ion-margin-top">
                        <IonCol size="12">
                            <IonButton 
                                style={{ "--background": card.color }} 
                                onClick={handlePixDeposit}
                            >
                                <IonIcon icon={keyOutline} />
                                Confirmar Depósito via Pix
                            </IonButton>
                        </IonCol>
                    </IonRow>
                </IonGrid>

                <IonToast
                    isOpen={showToast}
                    onDidDismiss={() => setShowToast(false)}
                    message={toastMessage}
                    duration={2000}
                />
            </IonContent>
        </IonPage>
    );
};

export default PixDeposit;

import { IonButton, IonCardSubtitle, IonCol, IonIcon, IonList, IonRow, IonToast } from "@ionic/react";
import DebitCard from "./DebitCard";
import { useState } from "react";
import { NFC } from "@ionic-native/nfc";
import { FingerprintAIO } from "@ionic-native/fingerprint-aio";
import styles from "./CardSlide.module.css";
import TransactionItem from "./TransactionItem";
import { addOutline, arrowRedoOutline, cashOutline, qrCodeOutline } from "ionicons/icons";
import { formatBalance } from "../data/Utils";

const CardSlide = (props) => {
    const { index, card, profile } = props;
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    const handleNfcPayment = async () => {
        try {
            const result = await FingerprintAIO.show({
                title: 'Autenticar Pagamento',
                subtitle: 'Confirme sua identidade para prosseguir',
                description: 'Digital necessária para continuar',
            });

            if (result) {
                NFC.enabled().then(() => {
                    NFC.beginSession().subscribe((data) => {
                        setToastMessage("Pagamento autorizado com NFC!");
                        setShowToast(true);
                        NFC.endSession();
                    }, (err) => {
                        setToastMessage("Erro ao iniciar o NFC.");
                        setShowToast(true);
                    });
                }).catch(() => {
                    setToastMessage("NFC não está ativado.");
                    setShowToast(true);
                });
            } else {
                setToastMessage("Autenticação biométrica falhou.");
                setShowToast(true);
            }
        } catch (error) {
            setToastMessage("Erro durante a autenticação ou processo NFC.");
            setShowToast(true);
        }
    };

    return (
        <>
            <IonRow className="ion-text-center">
                <IonCol size="12">
                    <IonCardSubtitle color="medium">
                        Saldo
                    </IonCardSubtitle>
                    <IonCardSubtitle id={`slide_${index}_balance`} className={`${styles.balance} animate__animated`}>
                        <span className={styles.poundSign}></span>
                        &nbsp;{formatBalance(card.balance)}
                    </IonCardSubtitle>
                </IonCol>
            </IonRow>
            <IonRow id={`card_${index}_container`} className="animate__animated ion-text-center ion-justify-content-center">
                <IonCol size="12">
                    <DebitCard key={index} {...card} profile={profile} />
                </IonCol>
            </IonRow>

            {/* Buttons Section */}
            <IonRow className="ion-text-center">
                <IonCol size="12">
                    <IonButton
                        className={styles.addButton}
                        size="small"
                        style={{ "--background": card.color, "--background-focused": card.color, "--background-hover": card.color, "--background-activated": card.color }}
                        routerLink={`/add-transaction/${card.id}`}
                    >
                        <IonIcon icon={addOutline} />
                        Adicionar Fundos
                    </IonButton>

                    <IonButton
                        className={styles.addButton}
                        size="small"
                        style={{ "--background": card.color, "--background-focused": card.color, "--background-hover": card.color, "--background-activated": card.color }}
                        onClick={handleNfcPayment}
                    >
                        <IonIcon icon={cashOutline} />
                        Pagar com Aproximação
                    </IonButton>

                    <IonButton
                        className={styles.addButton}
                        size="small"
                        style={{ "--background": card.color, "--background-focused": card.color, "--background-hover": card.color, "--background-activated": card.color }}
                        routerLink={`/pix-deposit/${card.id}`}
                    >
                        <IonIcon icon={qrCodeOutline} />
                        Depositar via Pix
                    </IonButton>
                </IonCol>
            </IonRow>

            {/* Transactions Section */}
            <IonRow className={styles.heading}>
                <IonCol size="12">
                    <h6>Transações</h6>
                </IonCol>
            </IonRow>

            {card.transactions.length > 0 && 
                <IonRow id={`slide_${index}_transactions`} className="animate__animated">
                    <IonCol size="12">
                        <IonList className={styles.transactionList}>
                            {card.transactions.slice(0).reverse().map((transaction, index) => (
                                <TransactionItem key={`card_transaction_${index}`} {...transaction} color={card.color} />
                            ))}
                        </IonList>
                    </IonCol>
                </IonRow>
            }

            {card.transactions.length === 0 &&
                <IonRow id={`slide_${index}_transactions`} className="animate__animated">
                    <IonCol size="12">
                        <h5>Sem fundos para Transação</h5>
                        <IonButton style={{ "--background": card.color }} routerLink={`/add-transaction/${card.id}`}>
                            <IonIcon icon={arrowRedoOutline} />&nbsp;Adicionar Fundos
                        </IonButton>
                    </IonCol>
                </IonRow>
            }

            {/* Toast for NFC */}
            <IonToast
                isOpen={showToast}
                onDidDismiss={() => setShowToast(false)}
                message={toastMessage}
                duration={2000}
            />
        </>
    );
};

export default CardSlide;

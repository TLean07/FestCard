import { useState } from 'react';
import { IonBackButton, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonPage, IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar, IonToast } from '@ionic/react';
import styles from "./Account.module.css";
import DebitCard from '../components/DebitCard';
import { AccountStore, addCardToAccount } from '../data/AccountStore';
import { CardStore } from '../data/CardStore';
import { addOutline, timerOutline } from 'ionicons/icons';
import { useHistory } from 'react-router';

const AddCard = () => {

  	const cards = AccountStore.useState(s => s.cards);
  	const cardColors = CardStore.useState(s => s.card_colors);
	const profile = AccountStore.useState(s => s.profile);
    const [cardType, setCardType] = useState("Unknown");
    const [cardColor, setCardColor] = useState(cardColors[0]);
    const [cardDescription, setCardDescription] = useState("");
    const [cardNumber, setCardNumber] = useState("1234 1234 1234 1234");
    const [cardSecret, setCardSecret] = useState("123");
    const [cardExpiry, setCardExpiry] = useState("01/22");
    const [cardBalance, setCardBalance] = useState(0);
    const history = useHistory();
    const [adding, setAdding] = useState(false);
    const [showToast, setShowToast] = useState({ show: false, message: '' });

    const validateCardNumber = (number) => {
        const cleanedNumber = number.replace(/\s+/g, '');

        if (cleanedNumber.length !== 16 || isNaN(cleanedNumber)) {
            return false;
        }

        let sum = 0;
        let shouldDouble = false;

        for (let i = cleanedNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cleanedNumber[i]);

            if (shouldDouble) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }

            sum += digit;
            shouldDouble = !shouldDouble;
        }

        return sum % 10 === 0;
    };

    const identifyCardType = (number) => {
        const cleanedNumber = number.replace(/\s+/g, '');

        if (cleanedNumber.startsWith('4')) {
            setCardType("Visa");
        } else if (
            (cleanedNumber.startsWith('51') || cleanedNumber.startsWith('52') || 
            cleanedNumber.startsWith('53') || cleanedNumber.startsWith('54') || 
            cleanedNumber.startsWith('55')) ||
            (parseInt(cleanedNumber.substring(0, 4)) >= 2221 && parseInt(cleanedNumber.substring(0, 4)) <= 2720)
        ) {
            setCardType("Mastercard");
        } else {
            setCardType("Unknown");
        }
    };

    const validateExpiryDate = (expiry) => {
        const [month, year] = expiry.split('/').map(num => parseInt(num, 10));
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear() % 100; 

        if (year > currentYear || (year === currentYear && month >= currentMonth)) {
            return true;
        }
        return false; 
    };

    const validateCardSecret = (secret) => {
        const cleanedSecret = secret.trim();
        return cleanedSecret.length === 3 || cleanedSecret.length === 4;
    };

    const handleCardNumberChange = (e) => {
        const newCardNumber = e.currentTarget.value;
        setCardNumber(newCardNumber);
        identifyCardType(newCardNumber);
    };

    const addCard = async () => {
        if (!validateCardNumber(cardNumber)) {
            setShowToast({ show: true, message: 'Número do cartão inválido.' });
            return;
        }

        if (!validateExpiryDate(cardExpiry)) {
            setShowToast({ show: true, message: 'Cartão vencido.' });
            return;
        }

        if (!validateCardSecret(cardSecret)) {
            setShowToast({ show: true, message: 'Número secreto inválido.' });
            return;
        }

        setAdding(true);

        const newCard = {
            id: cards.length + 1,
            type: cardType,
            color: cardColor,
            description: cardDescription,
            number: cardNumber,
            secret: cardSecret,
            expiry: cardExpiry,
            balance: cardBalance,
            transactions: [
                {
                    name: "Saldo Inicial",
                    amount: cardBalance,
                    deposit: true
                }
            ]
        };

        await addCardToAccount(newCard);
        
        setTimeout(() => {
            setAdding(false);
            history.goBack();
        }, 500);
    };

    return (
        <IonPage className={ styles.accountPage }>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton color="dark" />
                    </IonButtons>
                    <IonTitle>Adicionar Cartão</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                <IonGrid>
                    <IonRow className="animate__animated animate__fadeInTopLeft animate__faster ion-justify-content-center ion-text-center">
                        <IonCol size="12" className="ion-justify-content-center ion-text-center">
                            <DebitCard color={ cardColor } type={ cardType } expiry={ cardExpiry } number={ cardNumber } secret={ cardSecret } profile={ profile } />
                        </IonCol>
                    </IonRow>

                    <IonRow className="ion-padding-top">
                        <IonCol size="6">
                            <IonItem lines="full">
                                <IonLabel position="floating">Bandeira do cartão</IonLabel>
                                <IonInput type="text" inputmode="text" value={ cardType } readonly />
                            </IonItem>
                        </IonCol>

                        <IonCol size="6">
                            <IonItem lines="full">
                                <IonLabel position="floating">Tipo de Cartão</IonLabel>
                                <IonSelect placeholder="Select color" value={ cardColor } onIonChange={ e => setCardColor(e.currentTarget.value) }>
                                    { cardColors.map((option, index) => (
                                        <IonSelectOption key={ index } value={ option }>
                                            { option === 'blue' ? 'ESPORTES' : option === 'black' ? 'SHOWS' : option === 'purple' ? 'FESTIVAIS' : option.toUpperCase() }
                                        </IonSelectOption>
                                    ))}
                                </IonSelect> 
                            </IonItem>
                        </IonCol>
                    </IonRow>

                    <IonRow>
                        <IonCol size="6">
                            <IonItem lines="full">
                                <IonLabel position="floating">Nome do Cartão</IonLabel>
                                <IonInput type="text" inputmode="text" placeholder="Card name" value={ cardDescription } onIonChange={ e => setCardDescription(e.currentTarget.value) } />
                            </IonItem>
                        </IonCol>

                        <IonCol size="6">
                            <IonItem lines="full">
                                <IonLabel position="floating">Saldo Inicial</IonLabel>
                                <IonInput type="text" inputmode="text" placeholder="0" value={ cardBalance } onIonChange={ e => setCardBalance(e.currentTarget.value) } />
                            </IonItem>
                        </IonCol>
                    </IonRow>

                    <IonRow>
                        <IonCol size="12">
                            <IonItem lines="full">
                                <IonLabel position="floating">Número do Cartão</IonLabel>
                                <IonInput type="text" inputmode="text" placeholder="**** **** **** ****" value={ cardNumber } onIonChange={ handleCardNumberChange } />
                            </IonItem>
                        </IonCol>
                    </IonRow>

                    <IonRow>
                        <IonCol size="6">
                            <IonItem lines="full">
                                <IonLabel position="floating">Validade do cartão</IonLabel>
                                <IonInput type="text" inputmode="text" placeholder="01/22" value={ cardExpiry } onIonChange={ e => setCardExpiry(e.currentTarget.value) } />
                            </IonItem>
                        </IonCol>

                        <IonCol size="6">
                            <IonItem lines="full">
                                <IonLabel position="floating">Número secreto</IonLabel>
                                <IonInput type="text" inputmode="text" placeholder="123" value={ cardSecret } onIonChange={ e => setCardSecret(e.currentTarget.value) } />
                            </IonItem>
                        </IonCol>
                    </IonRow>

                    <IonRow>
                        <IonCol size="12">
                            <IonButton style={{ "--background": cardColor }} expand="block" disabled={ adding } onClick={ addCard }>
                                { !adding &&
                                    <>
                                        <IonIcon icon={ addOutline } />
                                        &nbsp; Adicionar Cartão
                                    </>
                                }

                                { adding &&
                                    <>
                                        <IonIcon icon={ timerOutline } />
                                        &nbsp; Adicionando...
                                    </>
                                }
                            </IonButton>
                        </IonCol>
                    </IonRow>   
                </IonGrid>

                <IonToast
                    isOpen={showToast.show}
                    message={showToast.message}
                    duration={2000}
                    onDidDismiss={() => setShowToast({ show: false, message: '' })}
                />
            </IonContent>
        </IonPage>
    );
};

export default AddCard;

// src/data/AccountStore.js
import { Store } from "pullstate";
import { auth, db } from './firebase-config';
import { doc, setDoc, updateDoc, collection, getDoc, getDocs } from "firebase/firestore"; // Importando as funções necessárias do Firestore

export const AccountStore = new Store({
    profile: {
        firstname: "",
        surname: "",
        avatar: "/User.png",
        isUsernameSet: false,
    },
    cards: [],
});

export const loadUserData = async (updateLocalState = true) => {
    const userId = auth.currentUser.uid;
    const userProfileRef = doc(db, "users", userId);
    const profileDoc = await getDoc(userProfileRef);

    let profile = {
        firstname: "",
        surname: "",
        avatar: "/User.png",
        isUsernameSet: false,
    };

    if (profileDoc.exists()) {
        profile = profileDoc.data();
    }

    const cardsCollectionRef = collection(db, "users", userId, "cards");
    const cardsSnapshot = await getDocs(cardsCollectionRef);
    const cards = cardsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        transactions: doc.data().transactions || [],
        balance: doc.data().balance || 0
    }));

    if (updateLocalState) {
        AccountStore.update(s => {
            s.profile = profile;
            s.cards = cards;
        });
    }

    return { profile, cards };
};

export const saveUserData = async () => {
    const userId = auth.currentUser.uid;
    const { profile, cards } = AccountStore.getRawState();

    try {
        const userProfileRef = doc(db, "users", userId);
        await setDoc(userProfileRef, profile, { merge: true });

        for (const card of cards) {
            const cardRef = doc(db, "users", userId, "cards", card.id);
            await updateDoc(cardRef, {
                balance: card.balance,
                transactions: card.transactions
            });
        }
    } catch (error) {
        console.error('Erro ao salvar os dados no Firestore:', error);
    }
};

export const updateProfileName = (firstname, surname) => {
    AccountStore.update(s => {
        s.profile.firstname = firstname;
        s.profile.surname = surname;
        s.profile.isUsernameSet = true;
    });
};

export const addCardToAccount = (newCard) => {
    AccountStore.update(s => {
        s.cards = [
            ...s.cards,
            { ...newCard, id: Math.random().toString(36).substr(2, 9) } // ID temporário
        ];
    });
};

export const addTransactionToCard = async (newTransaction, cardID) => {
    AccountStore.update(s => {
        const card = s.cards.find(c => parseInt(c.id) === parseInt(cardID));
        if (card) {
            card.transactions.push(newTransaction);

            if (newTransaction.deposit) {
                card.balance = (parseFloat(card.balance) || 0) + parseFloat(newTransaction.amount);
            } else {
                card.balance = (parseFloat(card.balance)|| 0) - parseFloat(newTransaction.amount);
            }
        }
    });
};

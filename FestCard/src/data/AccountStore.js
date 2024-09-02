import { Store } from "pullstate";
import { saveUserProfile, getUserProfile, addCardToFirestore, getUserCards, addTransactionToFirestore, getCardTransactions } from "./FirestoreService";
import { auth } from './firebase-config';

export const AccountStore = new Store({
    profile: {
        firstname: "",
        surname: "",
        avatar: "/User.png",
        isUsernameSet: false,
    },
    cards: [],
});

export const loadUserData = async () => {
    const userId = auth.currentUser.uid;
    const profile = await getUserProfile(userId);
    const cards = await getUserCards(userId);
    AccountStore.update(s => {
        s.profile = profile;
        s.cards = cards;
    });
};

export const updateProfileName = async (firstname, surname) => {
    AccountStore.update(s => {
        s.profile.firstname = firstname;
        s.profile.surname = surname;
        s.profile.isUsernameSet = true;
    });

    const userId = auth.currentUser.uid;
    await saveUserProfile(userId, AccountStore.getRawState().profile);
};

export const addCardToAccount = async (newCard) => {
    const userId = auth.currentUser.uid;
    const cardId = await addCardToFirestore(userId, newCard);

    AccountStore.update(s => { s.cards = [ ...s.cards, { ...newCard, id: cardId } ]; });
};

export const addTransactionToCard = async (newTransaction, cardID) => {
    const userId = auth.currentUser.uid;
    await addTransactionToFirestore(userId, cardID, newTransaction);

    AccountStore.update(s => {
        const card = s.cards.find(c => c.id === cardID);
        card.transactions.push(newTransaction);
        card.balance += newTransaction.deposit ? newTransaction.amount : -newTransaction.amount;
    });
};

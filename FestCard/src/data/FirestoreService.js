import { db } from './firebase-config';
import { doc, setDoc, getDoc, updateDoc, collection, addDoc, getDocs } from "firebase/firestore";

export const saveUserProfile = async (userId, profile) => {
  const userRef = doc(db, "users", userId);
  await setDoc(userRef, profile, { merge: true });
};

export const getUserProfile = async (userId) => {
  const userRef = doc(db, "users", userId);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("Nenhum documento encontrado!");
    return null;
  }
};

export const addCardToFirestore = async (userId, card) => {
  const cardsCollectionRef = collection(db, "users", userId, "cards");
  const cardRef = await addDoc(cardsCollectionRef, card);
  return cardRef.id;
};

export const getUserCards = async (userId) => {
  const cardsCollectionRef = collection(db, "users", userId, "cards");
  const querySnapshot = await getDocs(cardsCollectionRef);
  const cards = [];
  querySnapshot.forEach((doc) => {
    cards.push({ id: doc.id, ...doc.data() });
  });
  return cards;
};

export const addTransactionToFirestore = async (userId, cardId, transaction) => {
  const transactionsCollectionRef = collection(db, "users", userId, "cards", cardId, "transactions");
  await addDoc(transactionsCollectionRef, transaction);
};

export const getCardTransactions = async (userId, cardId) => {
  const transactionsCollectionRef = collection(db, "users", userId, "cards", cardId, "transactions");
  const querySnapshot = await getDocs(transactionsCollectionRef);
  const transactions = [];
  querySnapshot.forEach((doc) => {
    transactions.push(doc.data());
  });
  return transactions;
};

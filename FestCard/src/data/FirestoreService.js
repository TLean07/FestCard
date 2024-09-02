import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from './firebase-config';

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

export const getUserCards = async (userId) => {
  const cardsCollectionRef = collection(db, "users", userId, "cards");
  const querySnapshot = await getDocs(cardsCollectionRef);
  const cards = [];
  querySnapshot.forEach((doc) => {
    cards.push({ id: doc.id, ...doc.data() });
  });
  return cards;
};

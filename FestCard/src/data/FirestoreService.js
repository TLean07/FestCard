import { doc, getDoc, collection, getDocs, addDoc } from "firebase/firestore";
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

export const getUserEvents = async (userId) => {
  const eventsCollectionRef = collection(db, "users", userId, "events");
  const querySnapshot = await getDocs(eventsCollectionRef);
  const events = [];
  querySnapshot.forEach((doc) => {
    events.push({ id: doc.id, ...doc.data() });
  });
  return events;
};

export const addUserEvent = async (userId, eventData) => {
  const eventsCollectionRef = collection(db, "users", userId, "events");
  const docRef = await addDoc(eventsCollectionRef, {
    ...eventData,
    createdAt: new Date(), 
  });
  return docRef.id;
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

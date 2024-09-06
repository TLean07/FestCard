import { collection, getDocs, addDoc, doc, getDoc } from "firebase/firestore";
import { db } from './firebase-config'; // Certifique-se de que o Firebase está configurado corretamente

// Função para buscar o perfil do usuário
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

// Função para buscar eventos do usuário
export const getUserEvents = async (userId) => {
  const eventsCollectionRef = collection(db, "users", userId, "events");
  const querySnapshot = await getDocs(eventsCollectionRef);
  const events = [];
  querySnapshot.forEach((doc) => {
    events.push({ id: doc.id, ...doc.data() });
  });
  return events;
};

// Função para adicionar um evento para o usuário
export const addUserEvent = async (userId, eventData) => {
  try {
    const eventsCollectionRef = collection(db, "users", userId, "events");
    const docRef = await addDoc(eventsCollectionRef, {
      ...eventData,
      createdAt: new Date(), 
    });
    return docRef.id;
  } catch (error) {
    console.error("Erro ao adicionar evento:", error);
    throw error; // Propaga o erro para ser capturado no PurchaseConfirmation.js
  }
};

// Função para buscar os cartões do usuário
export const getUserCards = async (userId) => {
  const cardsCollectionRef = collection(db, "users", userId, "cards");
  const querySnapshot = await getDocs(cardsCollectionRef);
  const cards = [];
  querySnapshot.forEach((doc) => {
    cards.push({ id: doc.id, ...doc.data() });
  });
  return cards;
};

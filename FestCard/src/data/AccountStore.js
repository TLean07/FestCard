import { Store } from "pullstate";
import { auth, db } from './firebase-config';
import { doc, setDoc, getDoc, collection, getDocs, addDoc } from "firebase/firestore";

export const AccountStore = new Store({
    profile: {
        firstname: "",
        surname: "",
        avatar: "/User.png",
        isUsernameSet: false,
        festCoins: 0,
        balance: 0,
    },
    cards: [],
});

export const loadUserData = async (updateLocalState = true) => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
        console.error("User is not authenticated. Cannot load user data.");
        return;
    }

    const userProfileRef = doc(db, "users", userId);
    const profileDoc = await getDoc(userProfileRef);

    let profile = {
        firstname: "",
        surname: "",
        avatar: "/User.png",
        isUsernameSet: false,
        festCoins: 0,
        balance: 0,
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
    const userId = auth.currentUser?.uid;
    if (!userId) {
        console.error("User is not authenticated. Cannot save user data.");
        return;
    }

    const { profile, cards } = AccountStore.getRawState();

    console.log("Saving user data to Firestore:", { userId, profile, cards });

    try {
        const userProfileRef = doc(db, "users", userId);
        await setDoc(userProfileRef, {
            ...profile,
            festCoins: profile.festCoins,
            balance: profile.balance,
        }, { merge: true });

        for (const card of cards) {
            const cardRef = doc(db, "users", userId, "cards", card.id);
            console.log("Updating card:", card);

            await setDoc(cardRef, {
                type: card.type,
                color: card.color,
                description: card.description,
                number: card.number,
                balance: card.balance || 0,
                transactions: card.transactions || []
            }, { merge: true });
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
    saveUserData();
};

export const addCardToAccount = async (newCard) => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
        console.error("User is not authenticated. Cannot add card.");
        return;
    }

    try {
        // Adiciona o novo cartão ao Firestore com um ID gerado automaticamente
        const cardRef = await addDoc(collection(db, "users", userId, "cards"), {
            type: newCard.type,
            color: newCard.color,
            description: newCard.description,
            number: newCard.number,
            balance: newCard.balance || 0,
            transactions: newCard.transactions || []
        });

        // Atualiza o estado local com o novo cartão e o ID gerado pelo Firestore
        AccountStore.update(s => {
            s.cards = [
                ...s.cards,
                { ...newCard, id: cardRef.id }
            ];
        });

        // Chama `saveUserData` para persistir qualquer mudança adicional
        await saveUserData();

    } catch (error) {
        console.error("Erro ao adicionar cartão no Firestore:", error);
    }
};

export const addTransactionToCard = async (newTransaction, cardID) => {
    AccountStore.update(s => {
        const card = s.cards.find(c => c.id === cardID);
        if (card) {
            card.transactions.push(newTransaction);

            if (newTransaction.deposit) {
                card.balance = (parseFloat(card.balance) || 0) + parseFloat(newTransaction.amount);
            } else {
                card.balance = (parseFloat(card.balance) || 0) - parseFloat(newTransaction.amount);
            }
        }
    });
    saveUserData();
};

export const updateBalance = (cardId, amount) => {
    AccountStore.update(s => {
        const card = s.cards.find(c => c.id === cardId);
        if (card) {
            // Log para verificar o saldo antes da atualização
            console.log(`Saldo atual do cartão ${cardId}:`, card.balance);
            console.log(`Valor a ser descontado:`, amount);

            // Subtrai o valor correto do saldo
            card.balance = (parseFloat(card.balance) || 0) - parseFloat(amount);

            // Log para verificar o saldo após a atualização
            console.log(`Novo saldo do cartão ${cardId}:`, card.balance);
        }
    });

    // Salvar as alterações no Firestore após atualizar o saldo
    saveUserData();
};

export const updateFestCoins = async (festCoinsToAdd) => {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    console.error("User is not authenticated.");
    return;
  }

  const userProfileRef = doc(db, "users", userId);
  
  try {
    const userProfileDoc = await getDoc(userProfileRef);
    if (userProfileDoc.exists()) {
      const userProfileData = userProfileDoc.data();
      const updatedFestCoins = (userProfileData.festCoins || 0) + festCoinsToAdd;

      await setDoc(userProfileRef, {
        festCoins: updatedFestCoins
      }, { merge: true });

      AccountStore.update(s => {
        s.profile.festCoins = updatedFestCoins;
      });
    } else {
      console.error("User profile not found.");
    }
  } catch (error) {
    console.error("Erro ao atualizar FestCoins:", error);
  }
};

export const updateProfileBalance = (amount) => {
    AccountStore.update(s => {
        s.profile.balance = s.profile.balance - amount;
    });
    saveUserData();
};

export const autoSaveChanges = () => {
    const unsubscribe = AccountStore.subscribe(async () => {
        try {
            await saveUserData();
            console.log('Alterações salvas automaticamente no Firestore.');
        } catch (error) {
            console.error('Erro ao salvar alterações automaticamente no Firestore:', error);
        }
    });
    return unsubscribe;
};

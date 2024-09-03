import { Store } from "pullstate";
import { auth, db } from './firebase-config';
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";

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
        await setDoc(userProfileRef, profile, { merge: true });

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
    saveUserData(); // Salva automaticamente no Firestore após a atualização do perfil
};

export const addCardToAccount = (newCard) => {
    AccountStore.update(s => {
        s.cards = [
            ...s.cards,
            { ...newCard, id: Math.random().toString(36).substr(2, 9) } // ID temporário
        ];
    });
    saveUserData(); // Salva automaticamente no Firestore após a adição do cartão
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
    saveUserData(); // Salva automaticamente no Firestore após a adição de uma transação
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
    return unsubscribe; // Retorna a função para remover o listener quando necessário
};

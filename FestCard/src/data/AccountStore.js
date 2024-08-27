import { Store } from "pullstate";

export const AccountStore = new Store({
    profile: {
        firstname: "",
        surname: "",
        avatar: "/User.png",
        isUsernameSet: false, 
    },
    cards: [],
});

export const updateProfileName = (firstname, surname) => {
    AccountStore.update(s => {
        s.profile.firstname = firstname;
        s.profile.surname = surname;
        s.profile.isUsernameSet = true; 
    });
};

export const addCardToAccount = (newCard) => {
    AccountStore.update(s => { s.cards = [ ...s.cards, newCard ]; });
};

export const addTransactionToCard = (newTransaction, cardID) => {
    AccountStore.update(s => { 
        s.cards.find((c, index) => (parseInt(c.id) === parseInt(cardID)) ? s.cards[index].transactions = [ ...s.cards[index].transactions, newTransaction ] : false ) 
    });

    if (newTransaction.deposit) {
        AccountStore.update(s => { 
            s.cards.find((c, index) => (parseInt(c.id) === parseInt(cardID)) ? s.cards[index].balance = (parseFloat(s.cards[index].balance) + parseFloat(newTransaction.amount)) : false ) 
        });
    } else {
        AccountStore.update(s => { 
            s.cards.find((c, index) => (parseInt(c.id) === parseInt(cardID)) ? s.cards[index].balance = (parseFloat(s.cards[index].balance) - parseFloat(newTransaction.amount)) : false ) 
        });
    }
};

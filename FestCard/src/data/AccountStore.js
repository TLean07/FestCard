import { Store } from "pullstate";

export const AccountStore = new Store({
    
    profile: {
        
        firstname: "Alan",
        surname: "Montgomery",
        avatar: "/User.png",
    },
    cards: [],
});

export const addCardToAccount = (newCard) => {

    AccountStore.update(s => { s.cards = [ ...s.cards, newCard ]; });
}

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
}

// export const removeFromCart = productIndex => {

//     AccountStore.update(s => { s.product_ids.splice(productIndex, 1) });
// }
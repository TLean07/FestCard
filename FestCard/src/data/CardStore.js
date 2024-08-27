import { Store } from "pullstate";

export const CardStore = new Store({

    card_colors: [
        "blue",
        "black",
        "purple"
    ],
    card_types: [
        "visa",
        "mastercard"
    ]
});
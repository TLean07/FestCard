export const formatBalance = (balance, isFestCoin = false) => {
    if (isFestCoin) {
        return `F$ ${balance.toFixed(2)}`;
    } else {
        var formatter = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2
        });

        return formatter.format(balance);
    }
};

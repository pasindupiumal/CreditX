import React from "react";

const contractContext = React.createContext({
    contract: {CreditX: null, External: null, XUni: null}
});

export const ContractProvider = contractContext.Provider;

export default contractContext;
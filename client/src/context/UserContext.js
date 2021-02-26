import React from "react";

const userContext = React.createContext({
    user: {_address: 0x0, _name: 0x0, _active: false, _role: "", _email: ""},
    loginAdmin: () => {},
    loginStudent: () => {},
    loginEmployer: () => {},
    loginUniversity: () => {},
    logout: () => {}
});

export const userRole = {
    ADMIN: 'ADMIN',
    STUDENT: 'STUDENT',
    EMPLOYER: 'EMPLOYER',
    UNIVERSITY: 'UNIVERSITY'
};

export const UserProvider = userContext.Provider;

export default userContext;
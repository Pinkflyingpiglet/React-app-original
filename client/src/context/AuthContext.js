import { createContext, useReducer } from "react";
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {

    // for ease of testing. Need to know how to change 'user' to something more dynamic. i.e. 'user' should be populated with whoever is logged in
    // user: {
    //     _id: "653a09af41360e929c30961b",
    //     username: "jane",
    //     email:"jane@gmail.com",
    //     profilePicture:"person/Lisa.png",
    //     coverPicture:"",
    //     followers:[],
    //     followings:[],
    //     isAdmin: false,
    // },

    // need to login so that 'user' can be populated. Otherwise 'user' will remain as null which will cause errors
    user: null,
    isFetching: false,
    error: false,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

    return (
        <AuthContext.Provider 
            value={{
                user:state.user, 
                isFetching:state.isFetching, 
                error:state.error,
                dispatch
                }}
        >
            {children}
        </AuthContext.Provider>
    )
};
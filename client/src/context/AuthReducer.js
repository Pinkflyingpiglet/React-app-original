const AuthReducer = (state, action) => {
    switch(action.type) {
        case "LOGIN_START":
            return {
                user: null,
                isFetching: true,
                error: false,
            };
        case "LOGIN_SUCCESS":
            return {
                user: action.payload,
                isFetching: false,
                error: false,
            };
        case "LOGIN_FAILURE":
            return {
                user: null,
                isFetching: false,
                error: action.payload,
            };
        case "FOLLOW":
            return {
                ...state, // takes the exact state from above, i.e. LOGIN_FAILURE
                user:{
                    ...state.user, // takes all the states of user as uploaded in mongoDB
                    followings: [...state.user.followings, action.payload] // action.payload means take the payload (userId) from the "FOLLOW" type in AuthAction.js and add it to followings array
                },
            };
        case "UNFOLLOW":
            return {
                ...state,
                user:{
                    ...state.user, 
                    followings: state.user.followings.filter((following) => following !==action.payload), // removes the action.payload from followings array
                }
            };
        default:
            return state
    }
};

export default AuthReducer;
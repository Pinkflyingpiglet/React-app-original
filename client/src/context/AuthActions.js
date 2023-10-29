export const LoginStart = (userCredentials) => ({
    type:"LOGIN_START",
});

export const LoginSuccess = (user) => ({
    type:"LOGIN_SUCCESS",
    payload: user,
});

export const LoginFailure = (error) => ({
    type:"LOGIN_FAILURE",
    payload: error,
});

//this isn't an authentication action, but placed here coz lazy to create a UserAction.js file
//this 'userId' is passed to AuthReducer
export const Follow = (userId) => ({
    type: "FOLLOW",
    payload: userId,
});

export const Unfollow = (userId) => ({
    type: "UNFOLLOW",
    payload: userId,
});
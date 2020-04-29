import * as actionTypes from "./actionTypes";
import axios from "axios";

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  };
};
export const authSuccess = (token, userId, email) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    idToken: token, // a payload from the BE response.data
    userId: userId,
    email: email // payload from user input - find in response.data.email
  };
};

export const authFail = error => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error
  };
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("expirationDate");
  localStorage.removeItem("localId");
  return {
    type: actionTypes.AUTH_LOGOUT
  };
};
export const checkAuthTimeout = expirationTime => {
  return dispatch => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  };
};

export const auth = (email, password, isSignUp) => {
  return dispatch => {
    dispatch(authStart());
    const authData = {
      email: email,
      password: password,
      returnSecureToken: true
    };
    let url =
      "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyAGT2vM3uzywo3zQUAxNnkpPB6Yr3Ohets";
    if (!isSignUp) {
      url =
        "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyAGT2vM3uzywo3zQUAxNnkpPB6Yr3Ohets";
    }
    axios
      .post(url, authData)
      .then(response => {
        console.log(response);
        const expirationDate = new Date(
          new Date().getTime() + response.data.expiresIn * 1000
        );
        localStorage.setItem("token", response.data.idToken);
        localStorage.setItem("expirationDate", expirationDate);
        localStorage.setItem('userId',response.data.localId); //check if need to add email to local storage
        dispatch(authSuccess(response.data.idToken, response.data.localId, response.data.email));
        console.log(response.data);
        dispatch(checkAuthTimeout(response.data.expiresIn));
      })
      .catch(err => {
        console.log(err);
        dispatch(authFail(err.response.data.error));
      });
  };
};

export const setAuthRedirectPath = path => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT_PATH,
    path: path
  };
};

export const authCheckState = () => {
  return dispatch => {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem("expirationDate"));
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        const userId = localStorage.getItem('userId');
        dispatch(authSuccess(token,userId));
        dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime())/ 1000));
      }
    }
  };
};
// token = like a user idToken which comes from BE to track a user around the app. Expires after 1 hr.
// token comes back from the api request (idToken) when a user is successfully logged in / signed up.
// this token is stored in the auth state where it can be used and called from different places in the app
// e.g. when we fetch orders on the Orders page we use the token, which is stored in the auth reducer
//e.g when we purchase a burger on the Contact data form we use the token which is stored in the auth reducer

import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

import { checkValidity } from "../../shared/validation";

import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import Spinner from "../../components/UI/Spinner/Spinner";
import Aux from "../../hoc/Aux";

import * as actions from "../../store/actions/index";

import classes from "./Auth.css";

const auth = props => {
  const [authForm, setAuthForm] = useState({
    email: {
      elementType: "input-email",
      elementConfig: {
        type: "email",
        placeholder: "Email Address"
      },
      value: localStorage.getItem("email") || "", // check if email is in local storage or not
      validation: {
        required: true, // must not be empty
        isEmail: true
      },
      valid: false,
      touched: false
    },
    password: {
      elementType: "input",
      elementConfig: {
        type: "password",
        placeholder: "Password"
      },
      value: "",
      validation: {
        required: true,
        minLength: 6
      },
      valid: false,
      touched: false
    }
  });

  const [isSignUp, setIsSignUp] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSignIn, setSignIn] = useState(false);

  // in componentDidMount - if we reach this auth page whilst not building a burger redirect user to correct page.
  // this makes sure whenever we reach the auth page without building a burger we are redirected home
  // componentDidMount() {
  //   if (!this.props.buildingBurger && this.props.authRedirectPath !== "/") {
  //     this.props.onSetAuthRedirectPath();
  //   }
  //   const rememberMe = localStorage.getItem("rememberMe") === "true";
  //   const email = rememberMe ? localStorage.getItem("email") : "";
  //   this.setState({ email, rememberMe });
  // }

  const {buildingBurger, authRedirectPath, onSetAuthRedirectPath} = props;
  useEffect(() => {
    if (!buildingBurger && authRedirectPath !== "/") {
      onSetAuthRedirectPath();
    }
  }, [buildingBurger, authRedirectPath, onSetAuthRedirectPath]);

  const inputChangedHandler = (event, controlName) => {
    const updatedControls = {
      ...authForm,
      [controlName]: {
        ...authForm[controlName],
        value: event.target.value,
        valid: checkValidity(
          event.target.value,
          authForm[controlName].validation
        ),
        touched: true
      }
    };
    setAuthForm(updatedControls);
  };

  const handleSubmit = event => {
    props.onAuth(authForm.email.value, authForm.password.value, isSignUp);
    event.preventDefault();
  };

  // const signInHandler = e => {
  //   this.setState(previousState => {
  //     return {
  //       // callback
  //       isSignUp: !previousState.isSignUp,
  //       isSignIn: !previousState.isSignIn
  //     };
  //     // console.log(this.state.isSignUp); // false?
  //   });
  // };

  const signInHandler = e => {
    setIsSignUp(!isSignUp);
    setSignIn(!isSignIn);
  };

  // const  handleCheckboxChange = event => {
  //    const rememberMe = !this.state.rememberMe; // true
  //    this.setState(previousState => {
  //      return {
  //        rememberMe: !previousState.rememberMe
  //      };
  //    });
  //    // setting local storage for email
  //    const email = this.state.controls.email.value;
  //
  //    localStorage.setItem("rememberMe", rememberMe);
  //    localStorage.setItem("email", rememberMe ? email : "");
  //  };
  //

  // https://dmitripavlutin.com/react-usestate-hook-guide/ using prevstate in useState hook
  const handleCheckboxChange = event => {
    setRememberMe(rememberMe => !rememberMe); // prevState => !updatedState
    // setting local storage for email

    const email = authForm.email.value;

    localStorage.setItem("rememberMe", rememberMe);
    localStorage.setItem("email", rememberMe ? email : "");
  };

  const formElementsArray = [];
  for (let key in authForm) {
    formElementsArray.push({
      id: key,
      config: authForm[key]
    });
  }
  let form = formElementsArray.map(formElement => (
    <Input
      key={formElement.id}
      inputtype={formElement.config.elementType}
      elementType={formElement.config.elementType}
      elementConfig={formElement.config.elementConfig}
      value={formElement.config.value}
      invalid={!formElement.config.valid}
      shouldValidate={formElement.config.validation}
      touched={formElement.config.touched}
      changed={event => inputChangedHandler(event, formElement.id)}
      rememberMe={rememberMe}
      checkboxChanged={handleCheckboxChange}
      rememberEmail="Remember email"
    />
  ));

  if (props.loading) {
    form = <Spinner />;
  }

  let errorMessage = null;

  if (props.error) {
    errorMessage = (
      <p>{props.error.message}</p> // error from firebase which comes bk automatically
    );
  }

  let isLoggedIn = null;
  if (props.isLoggedIn) {
    isLoggedIn = <Redirect to={props.authRedirectPath} />; // if logged in redirect to home '/'
  }
  return (
    <Aux>
      <div className={classes.Auth}>
        {isLoggedIn}
        {errorMessage}

        {isSignUp ? (
          <Aux>
            <p className={classes.signUp}>Sign up to create a burger</p>
            <form onSubmit={handleSubmit}>
              {form}
              <Button btnType="Success">SIGN UP </Button>
            </form>
            <p className={classes.subText}>Already have an account?</p>
            <button
              onClick={e => signInHandler(e)}
              className={classes.btnSignIn}
            >
              Sign In
            </button>
          </Aux>
        ) : (
          <Aux>
            <p className={classes.signUp}>Sign into your account</p>
            <form onSubmit={handleSubmit}>
              {form}
              <Button btnType="Success">SIGN IN </Button>
            </form>
            <p className={classes.subText}>Already have an account?</p>
            <button
              onClick={e => signInHandler(e)}
              className={classes.btnSignIn}
            >
              Sign up
            </button>
          </Aux>
        )}
      </div>
    </Aux>
  );
};

const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isLoggedIn: state.auth.token !== null,
    buildingBurger: state.burgerBuilder.building,
    authRedirectPath: state.auth.authRedirectPath
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onAuth: (email, password, isSignUp) =>
      dispatch(actions.auth(email, password, isSignUp)),
    onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath("/"))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(auth);

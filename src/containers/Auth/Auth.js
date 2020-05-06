import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

import { checkValidity } from "../../shared/validation";

import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import Spinner from "../../components/UI/Spinner/Spinner";
import Aux from "../../hoc/Aux";

import * as actions from "../../store/actions/index";

import classes from "./Auth.css";

class Auth extends Component {
  state = {
    controls: {
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
    },
    isSignUp: true,
    rememberMe: false,
    isSignIn: false
  };

  // in componentDidMount - if we reach this auth page whilst not building a burger redirect user to correct page.
  // this makes sure whenever we reach the auth page without building a burger we are redirected home
  componentDidMount() {
    if (!this.props.buildingBurger && this.props.authRedirectPath !== "/") {
      this.props.onSetAuthRedirectPath();
    }
    const rememberMe = localStorage.getItem("rememberMe") === "true";
    const email = rememberMe ? localStorage.getItem("email") : "";
    this.setState({ email, rememberMe });
  }

  inputChangedHandler = (event, controlName) => {
    const updatedControls = {
      ...this.state.controls,
      [controlName]: {
        ...this.state.controls[controlName],
        value: event.target.value,
        valid: checkValidity(
          event.target.value,
          this.state.controls[controlName].validation
        ),
        touched: true
      }
    };
    this.setState({ controls: updatedControls });
  };

  handleSubmit = event => {
    this.props.onAuth(
      this.state.controls.email.value,
      this.state.controls.password.value,
      this.state.isSignUp
    );
    event.preventDefault();
  };

  // switchAuthModeHandler = () => {
  //   this.setState(prevState => {
  //     return {
  //       isSignUp: !prevState.isSignUp
  //     };
  //   });
  // };

  signInHandler = e => {
    this.setState(previousState => {
      return {
        // callback
        isSignUp: !previousState.isSignUp,
        sSignIn: !previousState.isSignIn
      };
      // console.log(this.state.isSignUp); // false?
    });
  };
  handleCheckboxChange = event => {
    const rememberMe = !this.state.rememberMe; // true
    this.setState(previousState => {
      return {
        rememberMe: !previousState.rememberMe
      };
    });
    // setting local storage for email
    const email = this.state.controls.email.value;

    localStorage.setItem("rememberMe", rememberMe);
    localStorage.setItem("email", rememberMe ? email : "");
  };

  render() {
    const formElementsArray = [];

    for (let key in this.state.controls) {
      formElementsArray.push({
        id: key,
        config: this.state.controls[key]
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
        changed={event => this.inputChangedHandler(event, formElement.id)}
        rememberMe={this.state.rememberMe}
        checkboxChanged={this.handleCheckboxChange.bind(this)}
        rememberEmail="Remember email"
      />
    ));

    const emailValue = formElementsArray.id;

    if (this.props.loading) {
      form = <Spinner />;
    }

    let errorMessage = null;

    if (this.props.error) {
      errorMessage = (
        <p>{this.props.error.message}</p> // error from firebase which comes bk automatically
      );
    }

    let isLoggedIn = null;
    if (this.props.isLoggedIn) {
      isLoggedIn = <Redirect to={this.props.authRedirectPath} />; // if logged in redirect to home '/'
    }
    return (
      <Aux>
        <div className={classes.Auth}>
          {isLoggedIn}
          {errorMessage}

          {this.state.isSignUp ? (
            <Aux>
              <p className={classes.signUp}>Sign up to create a burger</p>
              <form onSubmit={this.handleSubmit}>
                {form}
                <Button btnType="Success">SIGN UP </Button>
              </form>
              <p className={classes.subText}>Already have an account?</p>
              <button
                onClick={e => this.signInHandler(e)}
                className={classes.btnSignIn}
              >
                Sign In
              </button>
            </Aux>
          ) : (
            <Aux>
              <p className={classes.signUp}>Sign into your account</p>
              <form onSubmit={this.handleSubmit}>
                {form}
                <Button btnType="Success">SIGN IN </Button>
              </form>
              <p className={classes.subText}>Already have an account?</p>
              <button
                onClick={e => this.signInHandler(e)}
                className={classes.btnSignIn}
              >
                Sign up
              </button>
            </Aux>
          )}
        </div>
      </Aux>
    );
  }
}

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
export default connect(mapStateToProps, mapDispatchToProps)(Auth);

// if user clicks sign in - the signInHandler should change a prop to true which then will show a new form for sign in and replace sign up form

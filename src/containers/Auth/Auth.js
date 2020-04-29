import React, { Component } from "react";
import { connect } from "react-redux";
import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import Spinner from "../../components/UI/Spinner/Spinner";
import * as actions from "../../store/actions/index";
import { Redirect } from "react-router-dom";
import { checkValidity } from "../../shared/validation";

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
        value: localStorage.getItem('email') || "",
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
    rememberMe: false
  };

  // in componentDidMount - if we reach this auth page whilst not building a burger redirect user to correct page.
  //this makes sure whenever we reach the auth page without building a burger we are redirected home
  componentDidMount() {
    if (!this.props.buildingBurger && this.props.authRedirectPath !== "/") {
      this.props.onSetAuthRedirectPath();
    }
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    const email = rememberMe ? localStorage.getItem('email') : '';
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

  switchAuthModeHandler = () => {
    this.setState(prevState => {
      return {
        isSignUp: !prevState.isSignUp
      };
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
      />
    ));

    // const emailValue = this.state.controls.email.value;
    // console.log(emailValue);

    const emailValue = formElementsArray.id

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
      <div className={classes.Auth}>
        {isLoggedIn}
        {errorMessage}
        <p>
          <b>Sign up to create a burger</b>
        </p>
        <form onSubmit={this.handleSubmit}>
          {form}
          <Button btnType="Success">SUBMIT</Button>
        </form>
        <p className={classes.subText}>
          Already have an account? Switch to sign in below:
        </p>
        <Button clicked={this.switchAuthModeHandler} btnType="Danger">
          {this.state.isSignUp ? "SIGN IN" : "SIGN UP"}
        </Button>
      </div>
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

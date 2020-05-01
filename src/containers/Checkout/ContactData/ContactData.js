import React, { Component } from "react";
import { connect } from "react-redux";

import { checkValidity } from "../../../shared/validation";

import Button from "../../../components/UI/Button/Button";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Input from "../../../components/UI/Input/Input";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";

import Aux from "../../../hoc/Aux";

import * as actions from "../../../store/actions/index";

import axios from "../../../../src/axios-orders";

import classes from "./ContactData.css";

class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Your Name"
        },
        value: "",
        validation: {
          required: true // must not be empty
        },
        valid: false,
        touched: false
      },
      street: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Street"
        },
        value: "",
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      postCode: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "PostCode"
        },
        value: "",
        validation: {
          required: true,
          minLength: 5,
          maxLength: 8
        },
        valid: false,
        touched: false
      },
      country: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Country"
        },
        value: "England, UK",
        validation: {
          required: true
        },
        valid: true,
        touched: false
      },
      email: {
        elementType: "input",
        elementConfig: {
          type: "email",
          placeholder: "Your E-Mail"
        },
        value: this.props.email || localStorage.getItem('email') || "",
        validation: {
          required: true
        },
        valid: this.props.email ? true : false,
        touched: false
      },
      deliveryMethod: {
        elementType: "select",
        elementConfig: {
          options: [
            { value: "fastest", label: "Fastest" },
            { value: "cheapest", label: "Cheapest" }
          ]
        },
        value: "fastest",
        validation: {},
        valid: true
      }
    },
    formIsValid: false,
    showBackDrop: false,
    orderComplete: false,
  };

  orderHandler = event => {
    event.preventDefault(); // stops default behaviour which is to reload the form in this case

    const formData = {};
    // formElementIdentifier is one of email name zipCode etc from the state above
    // loops through the state object. and for each object sets value to the value the user entered?
    for (let formElementIdentifier in this.state.orderForm) {
      formData[formElementIdentifier] = this.state.orderForm[
        formElementIdentifier
      ].value;
    }
    const order = {
      ingredients: this.props.ings,
      price: this.props.price,
      orderData: formData,
      userId: this.props.userId,
      email: this.props.email
    };
    this.props.onOrderBurger(order, this.props.token);
    // keep email there for user
  };

  // ('Angela , name")
  inputChangedHandler = (event, inputIdentifier) => {
    const updatedOrderForm = {
      ...this.state.orderForm
    };
    const updatedFormElement = {
      ...updatedOrderForm[inputIdentifier] // updatedOrderForm[country]   returns value which is an object
    };
    updatedFormElement.value = event.target.value; // whatever the user types in

    updatedFormElement.valid = checkValidity(
      //  pass in what user types "angela" and validation "true"
      updatedFormElement.value,
      updatedFormElement.validation
    );
    updatedFormElement.touched = true; // ensures that the user types something in the input field for the styles
    updatedOrderForm[inputIdentifier] = updatedFormElement; // takes all order form looks at specific field "name" and updates value for that field "angela"
    // checking if whole form is valid, for each input field in the order form check if
    // set form is valid to the "valid" value for each given input.
    let formIsValid = true;
    for (let inputIdentifier in updatedOrderForm) {
      formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
    }
    this.setState({ orderForm: updatedOrderForm, formIsValid: formIsValid });
  };

  render() {
    // turning object into an array
    const formElementsArray = [];
    for (let key in this.state.orderForm) {
      formElementsArray.push({
        id: key,
        config: this.state.orderForm[key]
      });
      // shape passed in {id: name , config: angela},{id: country , config: England},
    }
    let form = (
      <form>
        {formElementsArray.map(formElement => {
          return (
            <Input
              inputtype={formElement.config.elementType}
              key={formElement.id}
              elementType={formElement.config.elementType}
              elementConfig={formElement.config.elementConfig}
              value={formElement.config.value}
              invalid={!formElement.config.valid}
              shouldValidate={formElement.config.validation}
              touched={formElement.config.touched}
              changed={event => this.inputChangedHandler(event, formElement.id)}
            />
          );
        })}

        <Button
          clicked={this.orderHandler}
          btnType="Success"
          disabled={!this.state.formIsValid}
        >
          PLACE ORDER HERE
        </Button>
      </form>
    );
    if (this.props.loading) {
      form = <Spinner />;
    }
    return (
      <Aux>
        <div className={classes.ContactData}>
          <h4>Enter Contact Information </h4>
          {form}
        </div>
      </Aux>
    );
  }
}

const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    loading: state.order.loading,
    token: state.auth.token,
    userId: state.auth.userId,
    email: state.auth.email,
    isLoggedIn: state.auth.token !== null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onOrderBurger: (orderData, token) =>
      dispatch(actions.purchaseBurger(orderData, token))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(ContactData, axios));

//if remember me is true put the email key in local storage using

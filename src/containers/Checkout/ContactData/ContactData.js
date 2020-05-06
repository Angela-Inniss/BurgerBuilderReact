import React, { useState } from "react";
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

const contactData = props => {
  const [orderForm, setOrderForm] = useState({
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
      value: props.email || localStorage.getItem("email") || "",
      validation: {
        required: true
      },
      valid: props.email || localStorage.getItem("email") ? true : false,
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
  });

  const [formIsValid, setFormIsValid] = useState(false);

  const orderHandler = event => {
    event.preventDefault(); // stops default behaviour which is to reload the form in this case

    const formData = {};
    // formElementIdentifier is one of email name zipCode etc from the state above
    // loops through the state object. and for each object sets value to the value the user entered?
    for (let formElementIdentifier in orderForm) {
      formData[formElementIdentifier] = orderForm[formElementIdentifier].value;
    }
    const order = {
      ingredients: props.ings,
      price: props.price,
      orderData: formData,
      userId: props.userId,
      email: props.email
    };
    props.onOrderBurger(order, props.token);
    // keep email there for user
  };

  // ('Angela , name")
  const inputChangedHandler = (event, inputIdentifier) => {
    const updatedOrderForm = {
      ...orderForm
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
    setOrderForm(updatedOrderForm);
    setFormIsValid(formIsValid);
    // this.setState({ orderForm: updatedOrderForm, formIsValid: formIsValid });
  };

  // turning object into an array
  const formElementsArray = [];
  for (let key in orderForm) {
    formElementsArray.push({
      id: key,
      config: orderForm[key]
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
            changed={event => inputChangedHandler(event, formElement.id)}
          />
        );
      })}

      <Button clicked={orderHandler} btnType="Success" disabled={!formIsValid}>
        PLACE ORDER HERE
      </Button>
    </form>
  );
  if (props.loading) {
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
};

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
)(withErrorHandler(contactData, axios));

//if remember me is true put the email key in local storage using

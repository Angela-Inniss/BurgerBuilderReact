import React, { useState,useEffect } from "react";
import { connect } from "react-redux";

import Aux from "../../hoc/Aux";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import axios from "../../../src/axios-orders";
import * as actions from "../../store/actions/index";

const burgerBuilder = (props) =>  {
  // state = {
  //   orderInProgress: false,
  //   showBackDrop: false
  // };

  const [orderInProgress, setOrderInProgress] = useState(false);
  const [showBackDrop, setBackDrop] = useState(false);

  // componentDidMount() {
  //   console.log("hi");
  //   this.props.onInitIngredients();
  // }

  useEffect(() => {
    console.log("hi");
    props.onInitIngredients();
  }, []); // only do this when component mounts

  const orderInProgressHandler = () => {
    if (props.isLoggedIn) {
      setOrderInProgress(true);
      setBackDrop(true);
    } else {
     props.onSetAuthRedirectPath("/checkout");
      props.history.push("/auth"); // history comes from react router dom
    }
  };

  const orderCancelHandler = () => {
    setOrderInProgress(false);
  };
  const orderContinueHandler = () => {
    props.onInitPurchase();
    props.history.push("/checkout");
  };


    const disabledInfo = {
      ...props.ings // comes from redux state below
    };
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
      // if ingredient value is less than or equal to 0 make disabled info true
      // and pass down to disabled prop in buildControls.
    }

    let orderSummary = null;
    let burger = props.error ? (
      <p>Ingredients can't be loaded </p>
    ) : (
      <Spinner />
    );

    if (props.ings) {
      orderSummary = (
        <OrderSummary
          orderCancelled={orderCancelHandler}
          orderContinue={orderContinueHandler}
          ingredients={props.ings}
          price={props.price}
        />
      );
      burger = (
        <Aux>
          <Burger ingredients={props.ings} />
          <BuildControls
            ingredientAdded={props.onIngredientAdded}
            ingredientRemoved={props.onIngredientRemoved}
            disabled={disabledInfo}
            canPurchase={props.canPurchase}
            price={props.price}
            ordered={orderInProgressHandler}
            userLoggedIn={props.isLoggedIn}
          />
        </Aux>
      );
    }

    return (
      <Aux>
        <Modal
          showBackdrop={showBackDrop}
          show={orderInProgress}
          modalClosed={orderCancelHandler}
        >
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
};
// defines which props should hold which slice of the state from the reducer
const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    canPurchase: state.burgerBuilder.canPurchase,
    error: state.burgerBuilder.error,
    isLoggedIn: state.auth.token !== null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: ingNamePayload =>
      // dispatching action (type)  and payload (payload)
      dispatch(actions.addIngredient(ingNamePayload)),

    onIngredientRemoved: ingNamePayload =>
      dispatch(actions.removeIngredient(ingNamePayload)),

    onInitIngredients: () => dispatch(actions.initIngredients()),

    onInitPurchase: () => dispatch(actions.purchaseInit()),

    onSetAuthRedirectPath: path => dispatch(actions.setAuthRedirectPath(path))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(burgerBuilder, axios));

import React, { Component } from "react";
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

export class BurgerBuilder extends Component {
  state = {
    orderInProgress: false,
    showBackDrop: false
  };

  componentDidMount() {
    console.log("hi");
    this.props.onInitIngredients();
  }
  orderInProgressHandler = () => {
    if (this.props.isLoggedIn) {
      this.setState({ orderInProgress: true });
      this.setState({ showBackDrop: true });
    } else {
      this.props.onSetAuthRedirectPath("/checkout");
      this.props.history.push("/auth"); // history comes from react router dom
    }
  };

  orderCancelHandler = () => {
    this.setState({ orderInProgress: false });
  };
  orderContinueHandler = () => {
    this.props.onInitPurchase();
    this.props.history.push("/checkout");
  };

  render() {
    const disabledInfo = {
      ...this.props.ings // comes from redux state below
    };
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
      // if ingredient value is less than or equal to 0 make disabled info true
      // and pass down to disabled prop in buildControls.
    }

    let orderSummary = null;
    let burger = this.props.error ? (
      <p>Ingredients can't be loaded </p>
    ) : (
      <Spinner />
    );

    if (this.props.ings) {
      orderSummary = (
        <OrderSummary
          orderCancelled={this.orderCancelHandler}
          orderContinue={this.orderContinueHandler}
          ingredients={this.props.ings}
          price={this.props.price}
        />
      );
      burger = (
        <Aux>
          <Burger ingredients={this.props.ings} />
          <BuildControls
            ingredientAdded={this.props.onIngredientAdded}
            ingredientRemoved={this.props.onIngredientRemoved}
            disabled={disabledInfo}
            canPurchase={this.props.canPurchase}
            price={this.props.price}
            ordered={this.orderInProgressHandler}
            userLoggedIn={this.props.isLoggedIn}
          />
        </Aux>
      );
    }

    return (
      <Aux>
        <Modal
          showBackdrop={this.state.showBackDrop}
          show={this.state.orderInProgress}
          modalClosed={this.orderCancelHandler}
        >
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}
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
)(withErrorHandler(BurgerBuilder, axios));

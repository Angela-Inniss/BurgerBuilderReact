import React, { Component } from "react";
import { connect } from "react-redux";

import Burger from "../../components/Burger/Burger";
import Button from "../../components/UI/Button/Button";

import classes from "../../components/Order/CheckoutSummary.css";


class CheckoutThankYou extends Component {
  handleBackHome = () => {
    this.props.history.replace("/");
  };

  render() {
    return (
      <div className={classes.CheckoutSummary}>
        <h1>Thank you for your order! </h1>
        <h3>your burger should be with you shortly...</h3>
        <div style={{ width: "100%", margin: "auto" }}>
          <Burger ingredients={this.props.ings} />
        </div>
        <Button btnType="Success" clicked={this.handleBackHome}> ORDER AGAIN</Button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients
  };
};
export default connect(mapStateToProps)(CheckoutThankYou);

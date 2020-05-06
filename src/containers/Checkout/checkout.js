import React, { useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import ContactData from "./ContactData/ContactData";
import CheckoutSummary from "../../components/Order/CheckoutSummary";

const checkout =  (props) => {
  const [showCheckoutMessage, setShowCheckoutMessage] = useState(true);

  const checkoutCancelledHandler = () => {
    props.history.goBack();
  };
  const checkoutContinuedHandler = () => {
    props.history.replace("/checkout/contact-data");
    setShowCheckoutMessage(false)
  };

  let summary = <Redirect to="/" />;

  if (props.ings) {
    const purchasedRedirect = props.purchased ? (
      <Redirect to="/checkoutThankYou" />
    ) : null;

    summary = (
      <div>
        {purchasedRedirect}
        <CheckoutSummary
          ingredients={props.ings}
          checkoutCancelled={checkoutCancelledHandler}
          checkoutContinued={checkoutContinuedHandler}
          showCheckoutMessage={showCheckoutMessage}
        />
        <Route
          path={props.match.url + "/contact-data"} // load page from the page we are currently on this.props.match.url
          component={ContactData}
        />
      </div>
    );
  }

  return summary;
};

const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    purchased: state.order.purchased
  };
};

export default connect(mapStateToProps)(checkout);

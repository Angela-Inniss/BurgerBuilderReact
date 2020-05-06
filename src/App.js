import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";

import Layout from "./hoc/Layout/Layout";
import BurgerBuilder from "./containers/BurgerBuilder/BurgerBuilder";
import Checkout from "./containers/Checkout/checkout";
import Orders from "./containers/Orders/Orders";
import Auth from "./containers/Auth/Auth";
import Logout from "./containers/Auth/Logout/Logout";
import CheckoutThankYou from "./containers/CheckoutThankYou/checkoutThankYou";

import * as actions from "./store/actions/index";

const app = props => {
  // componentDidMount() {
  //   this.props.onTryAutoSignup();
  // } // this is the same as useEffect in a class based comp

  useEffect(() => {
    props.onTryAutoSignup();
  }, []); // only runs once when comp is mounted

  // logged OUT user can access following routes
  let routes = (
    <Switch>
      <Route path="/auth" exact component={Auth} />
      <Route path="/" exact component={BurgerBuilder} />
      <Redirect to="/" />
    </Switch>
  );

  if (props.isLoggedIn) {
    // if user is logged in can access following routes
    routes = (
      <Switch>
        <Route path="/checkout" component={Checkout} />
        <Route path="/orders" component={Orders} />
        <Route path="/logout" exact component={Logout} />
        <Route path="/auth" exact component={Auth} />
        <Route path="/checkoutThankYou" exact component={CheckoutThankYou} />
        <Route path="/" exact component={BurgerBuilder} />
        <Redirect to="/" />
      </Switch>
    );
  }
  return (
    <div>
      <Layout>{routes}</Layout>
    </div>
  );
};
const mapStateToProps = state => {
  return {
    isLoggedIn: state.auth.token !== null
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(app));
// Layout is a component contains the Nav bar and takes children which will be the burger app content.
// we have wrapped the Layout component around our content.
// "exact the order doesn't matter as it is not treated as a prefix
// Switch makes app load the first matched path

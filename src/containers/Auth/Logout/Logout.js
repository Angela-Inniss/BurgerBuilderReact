import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

import * as actions from "../../../store/actions/index";

const logout = props => {
  // componentDid mount will be executed as soon as we enter page/render this component
  // componentDidMount() {
  //   this.props.onLogout();
  // }
  useEffect(() => {
    props.onLogout();
  }, []); // runs on first mount only []

  return <Redirect to="/" />;
};

const mapDispatchToProps = dispatch => {
  return {
    onLogout: () => dispatch(actions.logout())
  };
};
export default connect(null, mapDispatchToProps)(logout);

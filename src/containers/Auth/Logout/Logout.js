import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

import * as actions from "../../../store/actions/index";

const logout = props => {
  // componentDid mount will be executed as soon as we enter page/render this component
  // componentDidMount() {
  //   this.props.onLogout();
  // }
  const { onLogout } = props; // destructuring taking onLogout function from props.
  useEffect(() => {
    onLogout();
  }, [onLogout]); // if function was redefined/changed it would trigger teh useEffect again

  return <Redirect to="/" />;
};

const mapDispatchToProps = dispatch => {
  return {
    onLogout: () => dispatch(actions.logout())
  };
};
export default connect(null, mapDispatchToProps)(logout);

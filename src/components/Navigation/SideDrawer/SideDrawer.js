import React from "react";
import Logo from "../../Logo/Logo";
import NavigationItems from "../NavigationItems/NavigationItems";
import Backdrop from "../../UI/Backdrop/Backdrop";
import Aux from "../../../hoc/Aux";

import classes from "./SideDrawer.css";

const SideDrawer = props => {
  return (
    <Aux>
      <Backdrop
        showBackdrop={props.showSideDrawer}
        clicked={props.toggleSideDrawer}
      />
      {props.showSideDrawer && (
        <div onClick={props.toggleSideDrawer} className={classes.SideDrawer}>
          <div className={classes.Logo}>
            <Logo />
          </div>

          <nav>
            <NavigationItems />
          </nav>
        </div>
      )}
    </Aux>
  );
};

export default SideDrawer;
//if this sideDrawer prop is true - boolean true show the side drawer
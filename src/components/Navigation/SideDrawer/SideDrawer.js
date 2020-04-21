import React, { Component } from "react";
import Logo from "../../Logo/Logo";
import NavigationItems from "../NavigationItems/NavigationItems";
import Backdrop from "../../UI/Backdrop/Backdrop";
import Aux from "../../../hoc/Aux";

import classes from "./SideDrawer.css";

class SideDrawer extends Component {
  render() {
    let sideDrawerClass = [classes.SideDrawer];
    // SideDrawer will now be an array  with the side drawer classes and the open class
    if (this.props.showSideDrawer) {
      sideDrawerClass.push(classes.Open);
    }
    return (
      <Aux classname={classes.SideDrawer}>
        <Backdrop
          showBackdrop={this.props.showSideDrawer}
          clicked={this.props.toggleSideDrawer}
        />
        <div
          className={sideDrawerClass.join(" ")}
          onClick={this.props.toggleSideDrawer}
        >
          <div className={classes.Logo}>
            <Logo />
          </div>

          <nav>
            <NavigationItems />
          </nav>
        </div>
      </Aux>
    );
  }
}

export default SideDrawer;

//if this sideDrawer prop is true - boolean true show the side drawer
// if i click on the side drawer

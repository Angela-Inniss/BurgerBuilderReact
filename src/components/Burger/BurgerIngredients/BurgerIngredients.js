import React, { Component } from "react";
import PropTypes from "prop-types";
import classes from "./BurgerIngredients.css";

class BurgerIngredient extends Component {
  render() {
    let ingredient = null;
    // type is the prop we expect to receive
    switch (this.props.type) {
      case "bread-bottom":
        ingredient = <div className={classes.BreadBottom}></div>;
        break;
      case "bread-top":
        ingredient = (
          <div className={classes.BreadTop}>
            <div className={classes.Seeds1}></div>

            <div className={classes.Seeds2}></div>
          </div>
        );
        break;
      case "goatsCheese":
        ingredient = (
          <div className={classes.GoatsContainer}>
            <div className={classes.Goats1}></div>

            <div className={classes.Goats2}></div>
          </div>
        );
        break;
      case "meat":
        ingredient = <div className={classes.Meat}></div>;
        break;
      case "cheese":
        ingredient = <div className={classes.Cheese}></div>;
        break;
      case "salad":
        ingredient = <div className={classes.Salad}></div>;
        break;
      case "bacon":
        ingredient = <div className={classes.Bacon}></div>;
        break;
      default:
        ingredient = null;
    }
    return ingredient;
  }
}

BurgerIngredient.propTypes = {
  type: PropTypes.string // i guess this is similar to default props.
};
export default BurgerIngredient;

import React from "react";
import BuildControl from "./BuildControl";
import classes from "./BuildControls.css";

const controls = [
  { label: "Salad", type: "salad" },
  { label: "Meat", type: "meat" },
  { label: "Cheese", type: "cheese" },
  { label: "Bacon", type: "bacon" },
  { label: "Goats Cheese", type: "goatsCheese" }
];
const BuildControls = props => {
  return (
    <div className={classes.BuildControls}>
      <p>
        Price: <b>{props.price.toFixed(2)}</b>
      </p>
      {controls.map(ctrl => (
        <BuildControl
          added={() => props.ingredientAdded(ctrl.type)}
          removed={() => props.ingredientRemoved(ctrl.type)}
          key={ctrl.label}
          label={ctrl.label}
          disabled={props.disabled[ctrl.type]}
        />
      ))}
      <button
        onClick={props.ordered}
        className={classes.OrderButton}
        disabled={!props.canPurchase}
      >
        {props.userLoggedIn ? "ORDER NOW" : "SIGN UP TO ORDER"}
      </button>
    </div>
  );
};

export default BuildControls;

// loop through all controls and render a build control for each of them.

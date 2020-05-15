import React, { useState, useEffect } from "react";
import Aux from "../../../hoc/Aux";
import Button from "../../UI/Button/Button";

const OrderSummary = props => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600); // isMobile equates to screen being less than 600px

  const changeButton = () => {
    // console.log(window.innerWidth);
    setIsMobile(window.innerWidth < 600);
  };

  // So when the user re-sizes it checks the innerWidth of the window, asks whether it's less than 600 and passes the result of that question to setIsMobile.
  useEffect(() => {
    window.addEventListener("resize", changeButton);
    return () => window.removeEventListener("resize", changeButton);
  });

  // turning object into an array of strings with keys so we can map over it into an array of jsx elements <li> etc
  // so use return ( ) syntax
  const ingredientSummary = Object.keys(props.ingredients).map(igKey => {
    return (
      <li key={igKey}>
        <span style={{ textTransform: "capitalize"}}>
          {`${igKey}:`} {""}
          {props.ingredients[igKey]}
        </span>
      </li>
    );
  });
  return (
    <Aux>
      <h3>Order Summary:</h3>
      <p> A delicious burger with the following ingredients:</p>
      <ul>{ingredientSummary}</ul>
      <p>
        <strong>Total Price: {props.price.toFixed(2)}</strong>
      </p>
      <Button btnType="Danger" clicked={props.orderCancelled}>
        CANCEL
      </Button>
      {isMobile ? (
        <Button btnType="Success" clicked={props.orderContinue}>
          CONTINUE
        </Button>
      ) : (
        <Button btnType="Success" clicked={props.orderContinue}>
          CONTINUE TO CHECKOUT
        </Button>
      )}
    </Aux>
  );
};
export default OrderSummary;

// normal function body as we'll have to execute some code de
// return ( ) as we want to return some JSX
// going to add some logic in front of the return statement so it makes sense to have a real function body {} and not just the return () - interesting

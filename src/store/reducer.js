import * as actionTypes from "./actions";

const initialState = {
  ingredients: {
    salad: 0,
    bacon: 0,
    cheese: 0,
    meat: 0
  },
  totalPrice: 0,
  canPurchase: false
};

// a global constant
const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7
};

export const updatePurchaseState = ingredients => {
  const sum = Object.keys(ingredients)
    .map(igKey => {
      return ingredients[igKey];
    })
    .reduce((sum, el) => {
      return sum + el;
    }, 0);
  console.log(sum);
  return sum > 0; // true/false
};

const reducer = (state = initialState, action) => {
  console.log(actionTypes.ADD_INGREDIENT, action);
  switch (action.type) {
    case actionTypes.ADD_INGREDIENT:
      const newIngredientsAdd = {
        ...state.ingredients,
        [action.payload]: state.ingredients[action.payload] + 1 // salad: ingredients[salad] + 1
      };
      console.log(newIngredientsAdd);
      return {
        ...state,
        ingredients: newIngredientsAdd,
        totalPrice: state.totalPrice + INGREDIENT_PRICES[action.payload],
        canPurchase: updatePurchaseState(newIngredientsAdd)
      };

    case actionTypes.REMOVE_INGREDIENT:
      console.log(actionTypes.REMOVE_INGREDIENT, action);
      const newIngredientsRemove = {
        ...state.ingredients,
        [action.payload]: state.ingredients[action.payload] - 1
      }; // newIngredientsRemove constant is making sure we  grab  most up to date/latest ingredients in the burger
      console.log(newIngredientsRemove);
      return {
        ...state,
        ingredients: newIngredientsRemove,
        totalPrice: state.totalPrice - INGREDIENT_PRICES[action.payload],
        canPurchase: updatePurchaseState(newIngredientsRemove)
      };
    default:
      return state;
  }
};

export default reducer;
// ...state does not copy objects within objects you have to also always spread the state of
// the inner objects too (see ADD_INGREDIENTS action

//new ingredients copies the state as it is and removes the ingredients desired

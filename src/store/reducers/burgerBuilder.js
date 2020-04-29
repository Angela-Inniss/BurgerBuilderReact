import * as actionTypes from "../actions/actionTypes";

const initialState = {
  ingredients: null,
  totalPrice: 0,
  canPurchase: false,
  error: false,
  building: false
};

// a global constant
const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7,
  goatsCheese: 1.0
};

export const updatePurchaseState = ingredients => {
  const sum = Object.keys(ingredients)
    .map(igKey => {
      return ingredients[igKey];
    })
    .reduce((sum, el) => {
      return sum + el;
    }, 0);
  // console.log(sum);
  return sum > 0; // true/false
};

const reducer = (state = initialState, action) => {
  // console.log(actionTypes.ADD_INGREDIENT, action);
  switch (action.type) {
    case actionTypes.ADD_INGREDIENT:
      const newIngredientsAdd = {
        ...state.ingredients,
        [action.ingredientName]: state.ingredients[action.ingredientName] + 1 // salad: ingredients[salad] + 1 "action" here is referring to the ADD_ingredient action that is passed into the reducer with the state line 30
      };
      // console.log(newIngredientsAdd);
      return {
        ...state,
        ingredients: newIngredientsAdd,
        totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName],
        canPurchase: updatePurchaseState(newIngredientsAdd),
        building: true
      };

    case actionTypes.REMOVE_INGREDIENT:
      // console.log(actionTypes.REMOVE_INGREDIENT, action);
      const newIngredientsRemove = {
        ...state.ingredients,
        [action.ingredientName]: state.ingredients[action.ingredientName] - 1
      }; // newIngredientsRemove constant is making sure we  grab  most up to date/latest ingredients in the burger
      // console.log(newIngredientsRemove);
      return {
        ...state,
        ingredients: newIngredientsRemove,
        totalPrice: state.totalPrice - INGREDIENT_PRICES[action.ingredientName],
        canPurchase: updatePurchaseState(newIngredientsRemove),
        building: true
      };
    case actionTypes.LOAD_INGREDIENTS:
      return {
        ...state,
        ingredients: {
          salad: action.startingIngredients.salad,
          goatsCheese: action.startingIngredients.goatsCheese,
          bacon: action.startingIngredients.bacon,
          cheese: action.startingIngredients.cheese,
          meat: action.startingIngredients.meat
        },
        totalPrice: 0,
        error: false,
        building: false
      };
    case actionTypes.FETCH_INGREDIENTS_FAILED:
      return {
        ...state,
        error: true
      };
    default:
      return state;
  }
};

export default reducer;

// ...state does not copy objects within objects you have to also always spread the state of
// the inner objects too (see ADD_INGREDIENTS action
//new ingredients copies the state as it is and removes the ingredients desired
// we can always adapt or run some code before returning in the reducer

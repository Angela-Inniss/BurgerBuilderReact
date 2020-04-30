import React from "react";
import classes from "./input.css";
import Aux from "../../../hoc/Aux";

const Input = props => {
  let inputElement = null;
  const inputClasses = [classes.InputElement];
  //
  if (props.invalid && props.shouldValidate && props.touched) {
    inputClasses.push(classes.Invalid);
  }
  if (props.inputtype) {
    inputClasses.push(classes.BorderBottom);
  }

  switch (props.inputtype) {
    case "input":
      inputElement = (
        <input
          className={inputClasses.join(" ")}
          {...props.elementConfig}
          value={props.value}
          onChange={props.changed}
        />
      );
      break;

    case "textarea":
      inputElement = (
        <textarea
          className={inputClasses.join(" ")}
          {...props.elementConfig}
          value={props.value}
          onChange={props.changed}
        />
      );
      break;
    case "select":
      inputElement = (
        <select
          className={inputClasses.join(" ")}
          value={props.value}
          onChange={props.changed}
        >
          {props.elementConfig.options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
      break;
    case "input-email":
      inputElement = (
        <Aux>
          <input
            className={inputClasses.join(" ")}
            {...props.elementConfig}
            value={props.value}
            onChange={props.changed}
          />
          <input
            className={classes.Checkbox}
            name="rememberMe"
            checked={props.rememberMe}
            onChange={props.checkboxChanged}
            type="checkbox"
          />
          <span className={classes.Remember}>{props.rememberEmail}</span>
        </Aux>
      );
      break;
    default:
      inputElement = (
        <input
          className={inputClasses.join(" ")}
          {...props.elementConfig}
          value={props.value}
        />
      );
  }

  return (
    <div className={classes.Input}>
      <label className={classes.Label}>{props.label}</label>
      {inputElement}
    </div>
  );
};

export default Input;

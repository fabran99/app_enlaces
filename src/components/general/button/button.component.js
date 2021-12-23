import React from "react";
import "./button.styles.scss";

const Button = ({ text, onClick, iconClass, extraClass }) => {
  let buttonClass = "button";
  if (extraClass) {
    buttonClass += ` button--${extraClass}`;
  }
  return (
    <button className={buttonClass} onClick={onClick}>
      {iconClass && <i className={iconClass} />}
      <span>{text}</span>
    </button>
  );
};

export default Button;

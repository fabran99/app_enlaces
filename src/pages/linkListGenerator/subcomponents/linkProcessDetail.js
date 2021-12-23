import React from "react";
import classNames from "classnames";

const LinkProcessDetail = ({
  linkList,
  extraClass,
  text,
  visible,
  onClick,
}) => {
  if (!linkList) {
    return null;
  }

  const handleClick = () => {
    if (linkList.length == 0) {
      return;
    }
    if (visible == extraClass) {
      onClick("");
    } else {
      onClick(extraClass);
    }
  };

  const isVisible = visible == extraClass;

  return (
    <div className="link-process-detail">
      <div className="link-process-detail__title" onClick={handleClick}>
        <p className={extraClass}>
          {linkList.length} {text}
        </p>
        {linkList.length > 0 && (
          <i className={`fas fa-chevron-${isVisible ? "up" : "down"}`}></i>
        )}
      </div>
      {linkList.length > 0 && (
        <div
          className={classNames("link-process-detail__links", {
            "link-process-detail__links--visible": isVisible,
          })}
        >
          {linkList.map((link, i) => {
            return (
              <div className="link-process-detail__link" key={i}>
                <a href={link} target="_blank">
                  {link}
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LinkProcessDetail;

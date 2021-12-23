import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import classnames from "classnames";
import { electron } from "../../nodeObjects/electron";
import "./navigation.styles.scss";

const LINK_DATA = [
  {
    to: "/",
    content: "Buscar links",
  },
  {
    to: "/historical_links",
    content: "Historial de links",
  },
];

const Navigation = (props) => {
  const { pathname } = props.history.location;

  const handleClick = (event) => {
    console.log(event);
    electron.ipcRenderer.send(event);
  };
  return (
    <nav>
      <div className="nav-links">
        {LINK_DATA.map((link, index) => {
          return (
            <Link
              key={index}
              to={link.to}
              className={classnames("nav-link", {
                "nav-link--active": pathname == link.to,
              })}
            >
              {link.content}
            </Link>
          );
        })}
      </div>
      <div className="nav-buttons">
        <div
          className="nav-button"
          onClick={handleClick.bind(this, "MINIMIZE_WINDOW")}
          name="MINIMIZE_WINDOW"
        >
          <i className="fa fa-window-minimize"></i>
        </div>
        <Link to="/settings" className="nav-button">
          <i className="fa fa-cog"></i>
        </Link>
        <div
          className="nav-button"
          onClick={handleClick.bind(this, "CLOSE_WINDOW")}
          name="CLOSE_WINDOW"
        >
          <i className="fas fa-times"></i>
        </div>
      </div>
    </nav>
  );
};

export default withRouter(Navigation);

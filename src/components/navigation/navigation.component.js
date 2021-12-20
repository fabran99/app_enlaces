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
    to: "/uploaad",
    content: "Subir contenido",
  },
];

const Navigation = (props) => {
  const { pathname } = props.history.location;

  const handleClick = (e) => {
    electron.ipcRenderer.send(e.target.name);
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
          onClick={handleClick}
          name="MINIMIZE_WINDOW"
        >
          <i className="fa fa-window-minimize"></i>
        </div>
        <Link to="/settings" className="nav-button">
          <i className="fa fa-cog"></i>
        </Link>
        <div className="nav-button" onClick={handleClick} name="CLOSE_WINDOW">
          <i className="fas fa-times"></i>
        </div>
      </div>
    </nav>
  );
};

export default withRouter(Navigation);

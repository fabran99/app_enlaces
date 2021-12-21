import { connect } from "react-redux";
import React, { Component } from "react";
import { electron } from "../../nodeObjects/electron";
import { onLinkListChange } from "../../redux/linkListGenerator/linkListGenerator.actions";
import classnames from "classnames";
import ResultsList from "./subcomponents/resultsList";
import "./linkListGenerator.styles.scss";

const LinkListGenerator = (props) => {
  const { linkListGenerator } = props;
  const onChange = (e) => {
    const { value } = e.target;
    props.onChange(value);
  };

  const getLinks = () => {
    let linkList = linkListGenerator.linkListText;
    // Get all links in linkList by checking with a regex
    let links = linkList.match(
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
    );
    if (!links) {
      return null;
    }

    let valid_links = links.filter((link) => {
      // Check if link is from a known page
      if (
        !link.includes("www3.animeflv.net") &&
        !link.includes("peliculasmegadrive.com")
      ) {
        return false;
      }

      //   Check the url is valid
      try {
        let url = new URL(link);
        return true;
      } catch (_) {
        return false;
      }
    });
    if (!valid_links.length) {
      return null;
    }

    // Remove duplicates
    valid_links = valid_links.filter((item, pos) => {
      return valid_links.indexOf(item) == pos;
    });

    return valid_links;
  };

  let validLinks = getLinks();

  const onSubmit = () => {
    if (linkListGenerator.generating || !linkListGenerator.linkListText) {
      return null;
    }
    electron.ipcRenderer.send("GET_DOWNLOAD_LINKS", validLinks);
  };

  const onOpenMipony = () => {
    electron.ipcRenderer.send("EXECUTE_MIPONY");
  };

  return (
    <div className="link-list-generator">
      <div className="link-list">
        <div className="row">
          <div className="col-6">
            <h1>Buscar enlaces de descarga</h1>
            <textarea
              value={linkListGenerator.linkListText}
              onChange={onChange}
              placeholder="Escribe aquí tu lista de links"
            ></textarea>
            <small>Compatible con AnimeFLV y PeliculasMegaDrive</small>
          </div>
          <div className="col-6">
            <div className="valid-link-list">
              <h1>Enlaces válidos</h1>
              <ul>
                {validLinks && validLinks.length ? (
                  validLinks.map((link, index) => {
                    return (
                      <li key={index}>
                        <span>-</span>
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {link}
                        </a>
                      </li>
                    );
                  })
                ) : (
                  <li>No hay enlaces válidos</li>
                )}
              </ul>
              <div className="link-list--info">
                <button
                  className={classnames("button", {
                    "button--disabled":
                      linkListGenerator.generating ||
                      !linkListGenerator.linkListText.length ||
                      !validLinks,
                  })}
                  onClick={onSubmit}
                >
                  {/* Search icon */}
                  <i className="fas fa-search"></i>
                  <span>Buscar</span>
                </button>
                <button className="button button--red" onClick={onOpenMipony}>
                  <i className="fas fa-download"></i>
                  <span>Abrir MiPony</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <ResultsList />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  linkListGenerator: state.linkListGenerator,
});

const mapdispatchToProps = {
  onChange: onLinkListChange,
};

export default connect(mapStateToProps, mapdispatchToProps)(LinkListGenerator);

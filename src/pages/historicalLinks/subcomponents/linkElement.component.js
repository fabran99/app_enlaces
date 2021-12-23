import React, { useState } from "react";
import Button from "../../../components/general/button/button.component";
import Moment from "moment";
import { toast } from "react-toastify";
import classNames from "classnames";

const LinkElement = (props) => {
  const { linkData, onDelete } = props;
  const isAnime = !!linkData.episode_links;
  const [visible, setVisible] = useState(false);

  const onCopyElement = () => {
    let links = [];
    let link = linkData;
    if (!!link.movie_link) {
      links = [`${link.title}`, ...link.movie_link];
    } else {
      links = [`${link.title}`, ...link.episode_links.map((e) => e.zs_link)];
    }
    // Notify with a toast
    toast.info(`Links de: "${link.title}" copiados al portapapeles`, {
      closeOnClick: true,
      autoClose: 4000,
      position: "bottom-right",
    });
    navigator.clipboard.writeText(links.join("\n"));
  };
  // get the date and use moment to convert to year/month/day hour:minute:second
  const text_date = Moment(linkData.date).format("YYYY-MM-DD HH:mm:ss");
  console.log(`fas fa-chevron-${visible ? "up" : "down"}`);
  return (
    <div className="link-element">
      <div className="link-element__title" onClick={() => setVisible(!visible)}>
        <a href={linkData.link} target="_blank">
          {linkData.title}
        </a>
        <small className="date">{text_date}</small>
        <i className={`fas fa-chevron-${visible ? "up" : "down"}`}></i>
      </div>
      <div
        className={classNames("link-element__links", {
          "link-element__links--visible": visible,
        })}
      >
        {isAnime &&
          linkData.episode_links.map((episode, i) => {
            return (
              <div className="link-element__link">
                <a href={episode.zs_link} target="_blank" key={i}>
                  {episode.episode} - {episode.zs_link}
                </a>
              </div>
            );
          })}
        {!isAnime &&
          linkData.movie_link.map((link, i) => {
            return (
              <div className="link-element__link">
                <a href={link} target="_blank" key={i}>
                  {link}
                </a>
              </div>
            );
          })}
      </div>
      <div className="link-element__buttons">
        <Button
          onClick={onCopyElement}
          text="Copiar enlaces"
          iconClass="fas fa-copy"
        />
        <Button
          onClick={() => onDelete(linkData.link)}
          text="Eliminar"
          iconClass="fas fa-trash"
          extraClass="red"
        />
      </div>
    </div>
  );
};

export default LinkElement;

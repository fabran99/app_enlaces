import React, { useState } from "react";
import { connect } from "react-redux";
import classNames from "classnames";
import { toast } from "react-toastify";
import {
  historicalLinkRemove,
  historicalLinkClean,
} from "../../redux/historicalData/historicalData.actions";
import LinkElement from "./subcomponents/linkElement.component";
import Button from "../../components/general/button/button.component";
import "./historicalLinks.styles.scss";

const HistoricalLinks = (props) => {
  const { historicalData, historicalLinkRemove, historicalLinkClean } = props;
  var historicalLinks = historicalData.historicalLinkList;
  const [search, setSearch] = useState("");

  var filteredData = historicalLinks.filter((item) => {
    if (!!item.movie_link) {
      return item.link.includes(search) || item.title.includes(search);
    }
    return item.title.includes(search) || item.link.includes(search);
  });
  filteredData.reverse();

  const onCopy = () => {
    let all_links = [];
    filteredData.forEach((link) => {
      if (!!link.movie_link) {
        all_links = [...all_links, `${link.title}`, ...link.movie_link];
      } else {
        all_links = [
          ...all_links,
          `${link.title}`,
          ...link.episode_links.map((e) => e.zs_link),
        ];
      }
    });
    // Notify with a toast
    toast.info("Todos los links copiados al portapapeles", {
      closeOnClick: true,
      autoClose: 4000,
      position: "bottom-right",
    });

    navigator.clipboard.writeText(all_links.join("\n"));
  };

  return (
    <div className="historical-link-list">
      <h1>Historial de links</h1>
      <div className="historical-link-list__search">
        <input
          type="text"
          placeholder="Buscar"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="historical-link-list__list">
        {filteredData.length > 0 ? (
          filteredData.map((item) => {
            return (
              <LinkElement
                key={item.link}
                linkData={item}
                onDelete={historicalLinkRemove}
              />
            );
          })
        ) : (
          <div className="empty_result">
            <h1>No hay resultados</h1>
          </div>
        )}
      </div>
      <div className="historical-link-list__actions">
        <Button
          text="Copiar filtrados"
          onClick={onCopy}
          iconClass="fas fa-copy"
        />
        <Button
          text="Limpiar historial"
          onClick={historicalLinkClean}
          iconClass="fas fa-trash-alt"
          extraClass="red"
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  historicalData: state.historicalData,
});

const mapDispatchToProps = {
  historicalLinkRemove,
  historicalLinkClean,
};

export default connect(mapStateToProps, mapDispatchToProps)(HistoricalLinks);

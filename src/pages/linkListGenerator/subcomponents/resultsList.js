import { connect } from "react-redux";
import React, { Component } from "react";
import classnames from "classnames";
import { toast } from "react-toastify";
import {
  selectGenerating,
  selectGenerationCompletedData,
} from "../../../redux/linkListGenerator/linkListGenerator.selectors";
import Button from "../../../components/general/button/button.component";
import LinkGenerationProcess from "./linkGenerationProcess";

const ResultsList = (props) => {
  const { generating, generationCompletedData } = props;
  console.log(generating, generationCompletedData);

  const onCopy = () => {
    let all_links = [];
    generationCompletedData.forEach((link) => {
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

  const onCopyElement = (index) => {
    let links = [];
    let link = generationCompletedData[index];
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
  console.log(generating, generationCompletedData);

  return (
    <div className="results-list">
      {generating ? <LinkGenerationProcess /> : <h1>Resultados</h1>}

      {!generating && generationCompletedData && (
        <div className="results-list__results">
          {generationCompletedData.map((result, i) => {
            let isMovie = !!result.movie_link;
            return (
              <div className="results-list__result" key={result.link}>
                <p className="link">
                  <a href={result.link} target="_blank">
                    {result.title}
                  </a>
                </p>
                <div className="sublinks">
                  {isMovie
                    ? result.movie_link.map((movieLink, index) => {
                        console.log(movieLink);
                        return (
                          <p key={index}>
                            <a href={movieLink} target="_blank">
                              {movieLink}
                            </a>
                          </p>
                        );
                      })
                    : result.episode_links.map((episodeLink, index) => {
                        return (
                          <p key={index}>
                            <a href={episodeLink.zs_link} target="_blank">
                              {episodeLink.episode} - {episodeLink.zs_link}
                            </a>
                          </p>
                        );
                      })}

                  <Button
                    onClick={() => onCopyElement(i)}
                    text="Copiar enlaces"
                    iconClass="fas fa-copy"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {generationCompletedData && !generating && (
        <Button onClick={onCopy} text="Copiar todo" iconClass="fas fa-copy" />
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  generating: selectGenerating(state),
  generationCompletedData: selectGenerationCompletedData(state),
});

export default connect(mapStateToProps, null)(ResultsList);

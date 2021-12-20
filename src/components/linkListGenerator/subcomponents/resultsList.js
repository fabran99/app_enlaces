import { connect } from "react-redux";
import React, { Component } from "react";
import classnames from "classnames";

const ResultsList = (props) => {
  const { linkListGenerator } = props;
  const { generating, generationCompletedData } = linkListGenerator;
  console.log(linkListGenerator);

  const onCopy = () => {
    let all_links = [];
    generationCompletedData.forEach((link) => {
      if (!!link.movie_link) {
        all_links = [...all_links, ...link.movie_link];
      } else {
        all_links = [...all_links, ...link.episode_links.map((e) => e.zs_link)];
      }
    });
    console.log(all_links);

    navigator.clipboard.writeText(all_links.join("\n"));
  };

  return (
    <div className="results-list">
      {generating ? <h1>Buscando enlaces...</h1> : <h1>Resultados</h1>}

      {!generating && generationCompletedData && (
        <div className="results-list__results">
          {generationCompletedData.map((result) => {
            let isMovie = !!result.movie_link;
            return (
              <div className="results-list__result" key={result.link}>
                <p className="link">{result.link}</p>
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
                        console.log(episodeLink);
                        return (
                          <p key={index}>
                            <a href={episodeLink.zs_link}>
                              {episodeLink.zs_link}
                            </a>
                          </p>
                        );
                      })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {generationCompletedData && !generating && (
        <button onClick={onCopy} className="button">
          <i className="fas fa-copy"></i>
          <span>Copiar todo</span>
        </button>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  linkListGenerator: state.linkListGenerator,
});

export default connect(mapStateToProps, null)(ResultsList);

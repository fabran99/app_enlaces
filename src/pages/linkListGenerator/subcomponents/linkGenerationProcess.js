import React, { useState } from "react";
import { connect } from "react-redux";
import {
  selectRemaining,
  selectFailed,
  selectFinished,
  selectLinkGenerating,
} from "../../../redux/linkListGenerator/linkListGenerator.selectors";
import LinkProcessDetail from "./linkProcessDetail";

const LinkGenerationProcess = (props) => {
  const { remaining, failed, finished, generating } = props;
  const [visibleDetail, setVisibleDetail] = useState("");

  if (!remaining || !failed || !finished || !generating) {
    console.log([remaining, failed, finished, generating]);
    return null;
  }

  console.log(remaining, failed, finished, generating);
  return (
    <div className="link-generation-process">
      <h1>
        Revisando link:{" "}
        <a href={generating} target="_blank">
          {generating}
        </a>
      </h1>
      <div className="link-generation-process__current"></div>
      <div className="link-generation-process__data">
        <LinkProcessDetail
          linkList={remaining}
          text="links restantes"
          extraClass="remaining"
          onClick={setVisibleDetail}
          visible={visibleDetail}
        />

        <LinkProcessDetail
          linkList={failed}
          text="links fallidos"
          extraClass="failed"
          onClick={setVisibleDetail}
          visible={visibleDetail}
        />
        <LinkProcessDetail
          linkList={finished}
          text="links obtenidos"
          extraClass="obtained"
          onClick={setVisibleDetail}
          visible={visibleDetail}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  remaining: selectRemaining(state),
  failed: selectFailed(state),
  finished: selectFinished(state),
  generating: selectLinkGenerating(state),
});

export default connect(mapStateToProps, null)(LinkGenerationProcess);

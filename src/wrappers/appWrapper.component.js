import React, { Component } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";

//actions
import { initializeLinkListCommunication } from "../redux/linkListGenerator/linkListGenerator.actions";
import { initializeUploadCommunication } from "../redux/uploadHandler/uploadHandler.actions";

import { electron } from "../nodeObjects/electron";

export class AppWrapper extends Component {
  componentDidMount() {
    this.initListeners();
  }

  initListeners() {
    this.props.initializeLinkListCommunication();
    this.props.initializeUploadCommunication();

    // Handle updates
    this.updateListener = electron.ipcRenderer.on(
      "UPDATE_READY",
      (event, data) => {
        this.showUpdateIsReady(data);
      }
    );
  }

  showUpdateIsReady(data) {
    const { version } = data;
    const UpdateComponent = () => {
      return (
        <div className="update_notification">
          <div className="update_notification__text">
            Version {version} disponible
          </div>
          <div className="update_notification__button">
            <button onClick={this.quitAndInstall.bind(this)}>Actualizar</button>
          </div>
        </div>
      );
    };
    this.toastUpdate = toast(UpdateComponent, {
      position: "bottom-left",
      autoClose: false,
      closeOnClick: false,
    });
  }

  quitAndInstall() {
    toast.dismiss(this.toastUpdate);
    electron.ipcRenderer.send("QUIT_AND_INSTALL");
  }

  render() {
    return <React.Fragment>{this.props.children}</React.Fragment>;
  }
}

const mapdispatchToProps = {
  initializeLinkListCommunication,
  initializeUploadCommunication,
};

export default connect(null, mapdispatchToProps)(AppWrapper);

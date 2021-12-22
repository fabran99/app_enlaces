import React, { Component } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";

//actions
import { initializeLinkListCommunication } from "../redux/linkListGenerator/linkListGenerator.actions";
import { initializeUploadCommunication } from "../redux/uploadHandler/uploadHandler.actions";
import { updateSettings } from "../redux/settings/settings.actions";
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
        this.props.updateSettings({
          appUpdateAvailable: true,
        });
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
            Nueva version disponible
          </div>
          <div className="update_notification__button">
            <button className="button" onClick={this.quitAndInstall.bind(this)}>
              {/*font awesome icon for update button */}
              <i className="fas fa-download" />
              <span>Actualizar</span>
            </button>
            <button
              className="button button--red"
              onClick={() => toast.dismiss(this.toastUpdate)}
            >
              <i className="fas fa-times" />
              <span>Ahora no</span>
            </button>
          </div>
        </div>
      );
    };
    this.toastUpdate = toast(UpdateComponent, {
      position: "bottom-right",
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
  updateSettings,
};

export default connect(null, mapdispatchToProps)(AppWrapper);

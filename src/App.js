import React, { Component } from "react";
import { electron } from "./electron/nativeActions";

export class App extends Component {
  state = {
    pages_list: "",
    download_link_list: "",
    searching_links: false,
  };

  onClick = () => {
    let pages_list = this.state.pages_list;
    if (this.state.searching_links) {
      return null;
    }
    // get all links from the string using a regex

    let pages_list_array = pages_list.split("\n");
    this.setState({
      searching_links: true,
    });

    electron.ipcRenderer
      .invoke("GET_DOWNLOAD_LINKS", pages_list_array)
      .then((result) => {
        this.setState({
          download_link_list: result,
          searching_links: false,
        });
      });
  };

  onChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  render() {
    return (
      <div>
        <h1>Hello Electron</h1>
        <textarea
          id="pages_list"
          value={this.state.pages_list}
          onChange={this.onChange}
          placeholder="Lista de links de animes"
        ></textarea>
        <textarea
          id="download_link_list"
          value={this.state.download_link_list}
        ></textarea>
        <button onClick={this.onClick}>Click</button>
      </div>
    );
  }
}

export default App;

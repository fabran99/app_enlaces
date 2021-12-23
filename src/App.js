import React, { Component } from "react";
import { Provider } from "react-redux";
import storeObject from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";

// React router
import { HashRouter as Router, Route, Switch } from "react-router-dom";

// Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import LinkListGenerator from "./pages/linkListGenerator/linkListGenerator.component";
import HistoricalLinks from "./pages/historicalLinks/historicalLinks.component";
// Components
import Navigation from "./components/navigation/navigation.component";
import AppWrapper from "./wrappers/appWrapper.component";

// Sass
import "./sass/bootstrap-grid.min.css";
import "./sass/main.scss";
const App = () => {
  return (
    <Provider store={storeObject.store}>
      <Router>
        <PersistGate persistor={storeObject.persistor}>
          <div className="App">
            <ToastContainer />
            {/* Navigation */}
            <Navigation />
            <AppWrapper>
              <div className="app_container">
                <Switch>
                  {/* linkListGenerator page */}
                  <Route
                    exact
                    path="/"
                    render={(props) => <LinkListGenerator {...props} />}
                  />
                  <Route
                    exact
                    path="/historical_links"
                    render={(props) => <HistoricalLinks {...props} />}
                  />

                  {/* UploadPage */}
                </Switch>
              </div>
            </AppWrapper>
          </div>
        </PersistGate>
      </Router>
    </Provider>
  );
};

export default App;

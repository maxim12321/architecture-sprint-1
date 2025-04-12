import React from "react";
import ReactDOM from "react-dom";

import InfoTooltip from "./components/InfoTooltip";

import "./index.css";
import 'libs/index.js'

const App = () => (
  <div>
    <InfoTooltip></InfoTooltip>
  </div>
);
ReactDOM.render(<App />, document.getElementById("app"));

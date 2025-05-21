import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import Workflow from "./components/commercial/Workflow";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Workflow />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
); 
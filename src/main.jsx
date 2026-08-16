import React from "react";
import ReactDOM from "react-dom/client";
import Root from "./Root.jsx";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/forms.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);

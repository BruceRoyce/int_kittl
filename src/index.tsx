import React from "react";
import ReactDOM from "react-dom/client";
import Rendering from "./rendering";
import Transform from "./transform";
import Main from "./components/Main";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    {window.location.pathname === "/rendering" ? (
      <Rendering />
    ) : window.location.pathname === "/transform" ? (
      <Transform />
    ) : (
      <Main />
    )}
  </React.StrictMode>
);

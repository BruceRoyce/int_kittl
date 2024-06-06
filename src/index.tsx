import React from "react";
import ReactDOM from "react-dom/client";
import Rendering from "./rendering";
import Transform from "./transform";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    {window.location.pathname === "/rendering" ? (
      <Rendering />
    ) : window.location.pathname === "/transform" ? (
      <Transform />
    ) : <>
      <a href="/rendering">Rendering</a><br />
      <a href="/transform">Transform</a>
    </>}
  </React.StrictMode>
);

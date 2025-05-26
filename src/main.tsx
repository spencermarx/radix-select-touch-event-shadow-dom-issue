import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ShadowWrapper } from "./shadowDom/ShadowDomWrapper.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ShadowWrapper>
      <App />
    </ShadowWrapper>
  </React.StrictMode>
);

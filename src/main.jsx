import { AppErrorBoundary } from "./components/AppErrorBoundary.jsx";
import { installOperationalMonitoring } from "./utils/operations.js";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./styles.css";
import "./styles/campus.css";
import "./styles/platform.css";
import "./styles/journey.css";
import "./styles/experience.css";
import "./styles/contrast.css";

installOperationalMonitoring();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppErrorBoundary>
  </React.StrictMode>,
);

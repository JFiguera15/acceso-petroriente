import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

const rootElement = document.getElementById("second");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <h1>Probando</h1>
  </StrictMode>
);

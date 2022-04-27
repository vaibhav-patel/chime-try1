 import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components";
import {
  MeetingProvider,
  lightTheme
} from "amazon-chime-sdk-component-library-react";

import App from "./App";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <ThemeProvider theme={lightTheme}>
      <MeetingProvider>
        <App />
      </MeetingProvider>
    </ThemeProvider>
  </StrictMode>,
  rootElement
);

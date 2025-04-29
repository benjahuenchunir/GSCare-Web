import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Routing from "./Routing.tsx";
import "./styles/index.css";
import "./styles/fonts.css"
import { Auth0Provider } from "@auth0/auth0-react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: import.meta.env.VITE_AUTH0_CALLBACK_URL
      }}
    >
      <Routing />
    </Auth0Provider>
  </StrictMode>
);
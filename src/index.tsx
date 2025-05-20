import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Routing from "./Routing.tsx";
import { Auth0Provider } from "@auth0/auth0-react";
import { UserProvider } from "./context/UserContext.tsx";
import { FontSizeProvider } from "./context/FontSizeContext"; // 👈 nuevo import

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      <UserProvider>
        <FontSizeProvider>
          <Routing />
        </FontSizeProvider>
      </UserProvider>
    </Auth0Provider>
  </StrictMode>
);

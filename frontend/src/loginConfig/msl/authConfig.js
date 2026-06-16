/* eslint-disable default-case */
import { LogLevel } from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    clientId: "4b259fc3-8b28-4abf-becc-ceb30bb8f870", // Replace with your client ID
    authority: "https://login.microsoftonline.com/1b20657f-0ef8-4b71-befd-86770efa7aff", // Replace with your tenant ID
    redirectUri: "http://43.205.24.208:3000",
  },
  cache: {
    cacheLocation: "localStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
        }
      },
    },
  },
};

export const loginRequest = {
  scopes: ["openid", "profile", "User.Read"],
};

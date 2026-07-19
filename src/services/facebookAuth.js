export function initFacebookSDK() {
  if (typeof window === "undefined") return;

  window.fbAsyncInit = function () {
    window.FB.init({
      appId: process.env.REACT_APP_FACEBOOK_APP_ID,
      cookie: true,
      xfbml: false,
      version: "v19.0",
    });
  };
}

export function loginWithFacebook() {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.FB) {
      reject(new Error("Facebook SDK non chargé."));
      return;
    }

    window.FB.login(
      (response) => {
        if (response.authResponse) {
          window.FB.api("/me", { fields: "name,email,picture" }, (userInfo) => {
            if (userInfo && !userInfo.error) {
              resolve(userInfo);
            } else {
              reject(new Error(userInfo.error?.message || "Impossible de récupérer les informations Facebook."));
            }
          });
        } else {
          reject(new Error("Connexion Facebook annulée."));
        }
      },
      { scope: "public_profile,email" }
    );
  });
}

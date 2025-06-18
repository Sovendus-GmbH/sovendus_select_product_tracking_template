const log = require("logToConsole");
log("Sovendus Checkout Products Postback started");
const sendPixel = require("sendPixel");
const queryPermission = require("queryPermission");
const getCookieValues = require("getCookieValues");
const setCookie = require("setCookie");
const getUrl = require("getUrl");
const parseUrl = require("parseUrl");

const sovReqTokenCookieName = "sovReqToken";
const cookieRemoveOptions = {
  path: "/",
  "max-age": 0,
  secure: true,
};
const cookieAddOptions = {
  path: "/",
  "max-age": 60 * 60 * 24 * 31,
  secure: true,
};

if (checkPermissions()) {
  const urlObject = getUrlObject();
  const sovReqToken = urlObject.searchParams.sovReqToken;
  if (
    sovReqToken &&
    // just in case
    sovReqToken !== undefined &&
    sovReqToken !== "undefined"
  ) {
    setCookieFromUrlParameter(sovReqToken);
  } else {
    log("Sovendus Checkout Products Postback - no sovReqToken in url");

    const sovReqTokenCookie = getCookieValues(sovReqTokenCookieName);
    if (sovReqTokenCookie) {
      const sovReqToken = sovReqTokenCookie[0];
      if (sovReqToken) {
        logSovendusOrder(sovReqToken);
      }
    } else {
      log("sovReqCookie not found", "sovReqTokenCookie:", sovReqTokenCookie);
    }
  }
} else {
  log("No permission to get/set sovReqCookie or read url path");
}

function logSovendusOrder(sovReqToken) {
  log("Sovendus Checkout Products Postback - order logging started");

  log("sovReqToken: ", sovReqToken);

  const pixelUrl =
    "https://press-order-api.sovendus.com/ext/image?sovReqToken=" + sovReqToken;

  if (queryPermission("send_pixel", pixelUrl)) {
    removeCookie();
    log("Pixel URL: " + pixelUrl);
    sendPixel(pixelUrl, data.gtmOnSuccess, data.gtmOnFailure);
    log("Sovendus Checkout Products Postback - order logging successful");
    return;
  } else {
    log(
      "Sovendus Checkout Products Postback - order logging failed due to missing permission"
    );
  }
}

function getUrlObject() {
  const urlObject = parseUrl(getUrl());
  return urlObject;
}

function setCookieFromUrlParameter(sovReqToken) {
  log("Sovendus Checkout Products Postback - start to set cookie");
  setCookie("sovReqToken", sovReqToken, cookieAddOptions);
  log("Sovendus Checkout Products Postback - sovReqToken =", sovReqToken);
  log("Sovendus Checkout Products Postback - setting cookie done");
}

function removeCookie() {
  setCookie(sovReqTokenCookieName, "", cookieRemoveOptions);
}

function checkPermissions() {
  return (
    queryPermission("get_cookies", sovReqTokenCookieName) &&
    queryPermission(
      "set_cookies",
      sovReqTokenCookieName,
      cookieRemoveOptions
    ) &&
    queryPermission("set_cookies", sovReqTokenCookieName, cookieAddOptions) &&
    queryPermission("get_url", "query", sovReqTokenCookieName) &&
    queryPermission("get_url", "path")
  );
}

log("Sovendus Checkout Products Postback - done");

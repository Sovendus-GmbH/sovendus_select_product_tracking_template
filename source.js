const log = require("logToConsole");
log("Sovendus external products order logging started");
const sendPixel = require("sendPixel");
const queryPermission = require("queryPermission");
const getCookieValues = require("getCookieValues");
const setCookie = require("setCookie");
const getUrl = require("getUrl");
const parseUrl = require("parseUrl");

const sovReqTokenCookieName = "sovReqToken";
const sovReqPathCookieName = "sovReqPath";
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
  const pathname = urlObject.pathname;
  if (sovReqToken) {
    setCookieFromUrlParameter(sovReqToken, pathname);
  } else {
    log("Sovendus Checkout Products Postback - no sovReqToken in url");

    const sovReqTokenCookie = getCookieValues(sovReqTokenCookieName);
    const sovReqPathCookie = getCookieValues(sovReqPathCookieName);
    if (sovReqTokenCookie && sovReqPathCookie) {
      logSovendusOrder(sovReqTokenCookie, sovReqPathCookie);
    } else {
      log(
        "sovReqCookie not found",
        "sovReqTokenCookie:",
        sovReqTokenCookie,
        "sovReqPathCookie:",
        sovReqPathCookie
      );
    }
  }
} else {
  log("No permission to get/set sovReqCookie or read url path");
}

function logSovendusOrder(sovReqTokenCookie, sovReqPathCookie) {
  const sovReqToken = sovReqTokenCookie[0];
  const sovReqPath = sovReqPathCookie[0];
  log("sovReqToken:", sovReqToken, "sovReqPath:", sovReqPath);
  const productIdsByUrl = data.productIdsByPath;
  log("productIdsByPath: ", productIdsByUrl);
  if (productIdsByUrl) {
    const thisProductIdArr = productIdsByUrl.filter(
      (productIdObj) => productIdObj.path === sovReqPath
    );
    const thisProductIdObj =
      thisProductIdArr.length === 1 ? thisProductIdArr[0] : undefined;
    log("thisProductIdObj: ", thisProductIdObj);
    if (thisProductIdObj) {
      const product_id = thisProductIdObj.productId;
      const pixelUrl =
        "https://press-order-api.sovendus.com/ext/" +
        product_id +
        "/image?sovReqToken=" +
        sovReqToken;

      if (queryPermission("send_pixel", pixelUrl)) {
        removeCookie();

        log("Pixel URL: " + pixelUrl);
        sendPixel(pixelUrl, data.gtmOnSuccess, data.gtmOnFailure);
      }
    }
  }
}

function getUrlObject() {
  const urlObject = parseUrl(getUrl());
  return urlObject;
}

function setCookieFromUrlParameter(sovReqToken, pathname) {
  setCookie("sovReqToken", sovReqToken, cookieAddOptions);
  log("Sovendus Checkout Products Postback - sovReqToken =", sovReqToken);
  const sovReqPath = pathname;
  setCookie("sovReqPath", sovReqPath, cookieAddOptions, false);
  log("Sovendus Checkout Products Postback - sovReqPath =", sovReqPath);
}

function removeCookie() {
  setCookie(sovReqTokenCookieName, "", cookieRemoveOptions);
  setCookie(sovReqPathCookieName, "", cookieRemoveOptions);
}

function checkPermissions() {
  return (
    queryPermission("get_cookies", sovReqTokenCookieName) &&
    queryPermission("get_cookies", sovReqPathCookieName) &&
    queryPermission(
      "set_cookies",
      sovReqTokenCookieName,
      cookieRemoveOptions
    ) &&
    queryPermission("set_cookies", sovReqPathCookieName, cookieRemoveOptions) &&
    queryPermission("set_cookies", sovReqTokenCookieName, cookieAddOptions) &&
    queryPermission("set_cookies", sovReqPathCookieName, cookieAddOptions) &&
    queryPermission("get_url", "query", sovReqTokenCookieName) &&
    queryPermission("get_url", "path")
  );
}

log("Sovendus external products order logging done");

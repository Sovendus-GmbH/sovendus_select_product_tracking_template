function loadSovReqTokenFromCookie() {
  var sovReqToken = null;

  var cookie = document.cookie.split("; ").find(function(entry) {
      return entry.startsWith("sovReqToken=");
  }) || null;

  if (cookie !== null) {
      sovReqToken = cookie.split("=")[1];
  }

  return sovReqToken;
}
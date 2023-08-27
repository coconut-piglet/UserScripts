// ==UserScript==
// @name         Coconut Imgclick
// @author       Coconut Piglet
// @version      0.1
// @description  Fix Imgclick URLs loading in third party websites.
// @icon         http://imgclick.net/images/favicon.ico
// @namespace    http://imgclick.net/
// @run-at       document-idle
// @connect      imgclick.net
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
  "use strict";

  for (const image of document.images) {
    const originalURL = image.src;
    if (originalURL.startsWith("http://main.imgclick.net/")) {
      GM_xmlhttpRequest({
        method: "GET",
        url: originalURL,
        responseType: "blob",
        headers: {
          Referer: "http://imgclick.net/",
        },
        onload: function (response) {
          const blob = response?.response;
          if (blob && blob.type === "image/jpeg") {
            const updatedURL = URL.createObjectURL(blob);
            image.src = updatedURL;
          }
        },
      });
    }
  }
})();

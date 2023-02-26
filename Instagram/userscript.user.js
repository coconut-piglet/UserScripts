// ==UserScript==
// @name         Coconut Instagram
// @author       Coconut Piglet
// @version      0.1
// @description  Make Instagram great again.
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instagram.com
// @namespace    https://instagram.com/
// @match        https://instagram.com/*
// @match        https://www.instagram.com/*
// @run-at       document-start
// @grant        GM_download
// ==/UserScript==

(function () {
  "use strict";

  const STORIES_REEL_SEEN =
    "https://www.instagram.com/api/v1/stories/reel/seen";

  const actualOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function () {
    if (arguments[1] === STORIES_REEL_SEEN) {
      this.send = this.abort;
    }
    return actualOpen.apply(this, arguments);
  };
})();

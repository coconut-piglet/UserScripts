// ==UserScript==
// @name         Coconut Instagram
// @author       Coconut Piglet
// @version      0.1.1
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
  const TIMELINE_REGEX =
    /^https:\/\/www.instagram.com\/api\/v1\/feed\/timeline\/$/g;
  const USER_POSTS_REGEX =
    /^https:\/\/www.instagram.com\/api\/v1\/feed\/user\/.*\/username\/.*/g;
  const POST_DETAILS_REGEX =
    /^https:\/\/www.instagram.com\/api\/v1\/.*\/info\/$/g;

  function isStoriesReelSeenURL(url) {
    return url === STORIES_REEL_SEEN;
  }
  function isTimelineURL(url) {
    return url.match(TIMELINE_REGEX) !== null;
  }

  function isUserPostsURL(url) {
    return url.match(USER_POSTS_REGEX) !== null;
  }

  function isPostDetailsURL(url) {
    return url.match(POST_DETAILS_REGEX) !== null;
  }

  const actualOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function () {
    const requestURL = arguments[1];
    if (isStoriesReelSeenURL(requestURL)) {
      this.send = this.abort;
    }
    if (isTimelineURL(requestURL)) {
      this.addEventListener("load", onTimelineLoaded.bind(this));
    }
    if (isUserPostsURL(requestURL)) {
      this.addEventListener("load", onUserPostsLoaded.bind(this));
    }
    if (isPostDetailsURL(requestURL)) {
      this.addEventListener("load", onPostDetailsLoaded.bind(this));
    }
    return actualOpen.apply(this, arguments);
  };

  function onTimelineLoaded(payload) {
    // TODO: Implement timeline payload handling.
  }

  function onUserPostsLoaded(payload) {
    // TODO: Implement user posts payload handling.
  }

  function onPostDetailsLoaded(payload) {
    // TODO: Implement post details payload handling.
  }
})();

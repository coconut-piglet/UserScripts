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

  const STORY_SEEN_REGEX =
    /^https:\/\/www\.instagram\.com\/api\/v1\/stories\/reel\/seen$/g;
  const TIMELINE_REGEX =
    /^https:\/\/www\.instagram\.com\/api\/v1\/feed\/timeline\/$/g;
  const USER_POSTS_REGEX =
    /^https:\/\/www\.instagram\.com\/api\/v1\/feed\/user\/.*\/username\/.*/g;
  // TODO: Exclude https://www.instagram.com/api/v1/users/xxx/info/ from `POST_DETAILS_REGEX`.
  const POST_DETAILS_REGEX =
    /^https:\/\/www\.instagram\.com\/api\/v1\/.*\/info\/$/g;

  const MEDIA_TYPE_IMAGE = 1;
  const MEDIA_TYPE_VIDEO = 2;
  const MEDIA_TYPE_CAROUSEL = 8;

  const originalURLs = [];

  function log(message) {
    console.log(`[UserScript] ${message}`);
  }

  function isStoriesReelSeenURL(url) {
    return url.match(STORY_SEEN_REGEX) !== null;
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
    if (requestURL) {
      if (isStoriesReelSeenURL(requestURL)) {
        this.send = this.abort;
      }
      if (isTimelineURL(requestURL)) {
        const request = this;
        this.addEventListener("load", function () {
          onTimelineLoaded(request.responseText);
        });
      }
      if (isUserPostsURL(requestURL)) {
        const request = this;
        this.addEventListener("load", function () {
          onUserPostsLoaded(request.responseText);
        });
      }
      if (isPostDetailsURL(requestURL)) {
        const request = this;
        this.addEventListener("load", function () {
          onPostDetailsLoaded(request.responseText);
        });
      }
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
    let data = null;
    try {
      data = JSON.parse(payload);
    } catch (_) {}
    if (!data) {
      log(`Failed to parse payload of post details: ${payload}`);
      return;
    }
    const items = data["items"];
    if (!Array.isArray(items)) {
      log(`Failed to find items in post details payload: ${payload}`);
      return;
    }
    for (const item of items) {
      parseItem(item);
    }
  }

  function parseItem(item) {
    const mediaType = item["media_type"];
    switch (mediaType) {
      case MEDIA_TYPE_IMAGE:
        parseImageItem(item);
        break;
      case MEDIA_TYPE_VIDEO:
        parseVideoItem(item);
        break;
      case MEDIA_TYPE_CAROUSEL:
        parseCarouselItem(item);
        break;
      default:
        log(`Unrecognized item: ${item}`);
        break;
    }
  }

  function parseCarouselItem(carouselItem) {
    const mediaItems = carouselItem["carousel_media"];
    if (!Array.isArray(mediaItems)) {
      log(`Failed to find media items in carousel item: ${carouselItem}`);
      return;
    }
    for (const mediaItem of mediaItems) {
      parseItem(mediaItem);
    }
  }

  function parseImageItem(imageItem) {
    const originalWidth = imageItem["original_width"];
    const originalHeight = imageItem["original_height"];
    const candidates = imageItem["image_versions2"]?.["candidates"];
    if (!originalWidth || !originalHeight) {
      log(`Failed to find original size in image item: ${imageItem}`);
      return;
    }
    if (!Array.isArray(candidates)) {
      log(`Failed to find candidates in image item: ${imageItem}`);
      return;
    }
    let originalURL = null;
    for (const candidate of candidates) {
      if (
        candidate["width"] === originalWidth &&
        candidate["height"] === originalHeight
      ) {
        originalURL = candidate["url"];
        break;
      }
    }
    if (!originalURL) {
      log(`Failed to find original URL in image item: ${imageItem}`);
      return;
    }
    log(`Found original image URL: ${originalURL}`);
    originalURLs.push(originalURL);
  }

  function parseVideoItem(videoItem) {
    const originalWidth = videoItem["original_width"];
    const originalHeight = videoItem["original_height"];
    const versions = videoItem["video_versions"];
    if (!originalWidth || !originalHeight) {
      log(`Failed to find original size in video item: ${videoItem}`);
      return;
    }
    if (!Array.isArray(versions)) {
      log(`Failed to find versions in video item: ${videoItem}`);
      return;
    }
    let originalURL = null;
    for (const version of versions) {
      if (
        version["width"] === originalWidth &&
        version["height"] === originalHeight
      ) {
        originalURL = version["url"];
        break;
      }
    }
    if (!originalURL) {
      log(`Failed to find original URL in video item: ${videoItem}`);
      return;
    }
    log(`Found original video URL: ${originalURL}`);
    originalURLs.push(originalURL);
  }
})();

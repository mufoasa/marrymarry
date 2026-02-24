self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", () => self.clients.claim());

importScripts(
  "https://3nbf4.com/act/files/service-worker.min.js?r=sw"
);

self.options = {
  domain: "3nbf4.com",
  zoneId: 10646758
};

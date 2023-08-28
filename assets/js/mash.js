window.MashSettings = {
  id: "65ab4ecc-2ee0-4a88-bee6-1bfa9741bb02"
};
var loader = function () {
  window.Mash.init();
};
var script = document.createElement("script");
script.type = "text/javascript";
script.defer = true;
script.onload = loader;
script.src = "https://app.mash.com/sdk/sdk.js";
var head = document.getElementsByTagName("head")[0];
head.appendChild(script);

function interceptData() {
  var xhrOverrideScript = document.createElement('script');
  xhrOverrideScript.type = 'text/javascript';
  xhrOverrideScript.innerHTML = `
  (function() {
    var XHR = XMLHttpRequest.prototype;
    var send = XHR.send;
    var open = XHR.open;
    XHR.open = function(method, url) {
        this.url = url; // the request url
        return open.apply(this, arguments);
    }
    XHR.send = function() { 
        this.addEventListener('load', function() {
           console.log(this.url);
            if (this.url.includes('GetMarketChartData')) {
                var evt = new CustomEvent("chartDataLoaded", {detail: JSON.parse(this.response)});
                document.dispatchEvent(evt);
            }               
        });
        return send.apply(this, arguments);
    };
  })();
  `
  document.head.prepend(xhrOverrideScript);
}
function checkForDOM() {
  if (document.body && document.head) {
    interceptData();
  } else {
    requestIdleCallback(checkForDOM);
  }
}
requestIdleCallback(checkForDOM);


//in content script include:
  //document.addEventListener("chartDataLoaded",(e) => {
  //  console.log(e.detail);
  //});
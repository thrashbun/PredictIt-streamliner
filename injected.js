    function scrapeData() {
      var responseContainingEle = document.getElementById('__interceptedData');
      var response = JSON.parse(responseContainingEle.innerHTML.replace(/<br>/g,""));
    }
    var XHR = XMLHttpRequest.prototype;
    var send = XHR.send;
    var open = XHR.open;
    var extensionId="mpjmoagdgejcedgfgkiibinkajcpinli";
    XHR.open = function(method, url) {
        this.url = url; // the request url
        return open.apply(this, arguments);
    }
    XHR.send = function() { 
        this.addEventListener('load', function() {
           console.log(this.url);
            if (this.url.includes('GetMarketChartData')) {
                chrome.runtime.sendMessage(extensionId, {a: "b"});
                var dataDOMElement = document.createElement('div');
                dataDOMElement.id = '__interceptedData';
                dataDOMElement.innerText = this.response;
                dataDOMElement.style.height = 0;
                dataDOMElement.style.overflow = 'hidden';
                document.body.appendChild(dataDOMElement);
                scrapeData();
            }               
        });
        return send.apply(this, arguments);
    };
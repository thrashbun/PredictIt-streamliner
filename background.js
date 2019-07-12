var last_timeStamp=0;
chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
    
    if (Math.abs(details['timeStamp']-last_timeStamp) < 100) {
      console.log("double fire");
      return;
    }
    last_timeStamp=details['timeStamp'];
    
    if(details['url']&&details['url'].match(/dashboard/)) {
      chrome.tabs.executeScript(null,{file:"dashboard.js"});
      chrome.tabs.insertCSS(null,{file:"dashboard.css"});
    }
    
    if(details['url']&&details['url'].match(/markets\/detail/)) {
      chrome.tabs.executeScript(null,{file:"market.js"});
      chrome.tabs.insertCSS(null,{file:"market.css"});
    }
}); 
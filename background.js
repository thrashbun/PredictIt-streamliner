chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
    
    if(details['url']&&details['url'].match(/dashboard/)) {
      chrome.tabs.executeScript(null,{file:"dashboard.js"});
      chrome.tabs.insertCSS(null,{file:"dashboard.css"});
    }
    
    if(details['url']&&details['url'].match(/markets/)) {
      chrome.tabs.executeScript(null,{file:"market.js"});
      chrome.tabs.insertCSS(null,{file:"market.css"});
    }
}); 
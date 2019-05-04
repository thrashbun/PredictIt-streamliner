chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
    if(details['url']&&details['url'].match(/dashboard/)) {
      chrome.tabs.executeScript(null,{file:"inject.js"});
      chrome.tabs.insertCSS(null,{file:"inject.css"});
    }
}); 
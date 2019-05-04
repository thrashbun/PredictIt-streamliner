  var tc={};
  
  chrome.storage.sync.get({"hiddenMarketIds":[],"hidden":true}, (storage) => {
    tc.hiddenMarketIds=storage.hiddenMarketIds;
    tc.hidden=storage.hidden;
    checkElement('.market-payout__price');
  });
  
  function initializeNow(document) {
    var markets = document.querySelectorAll(".portfolio-my-markets__item");
    tc.markets=markets;
    tc.hiddenMarkets=[];
    markets.forEach( (market) => {
      var icon=addIcon(market);
      div=market.querySelector('.market-payout__col-1');
      var link=market.querySelector('.market-payout__payout-link-market');
      var id=link.href.match(/(?<=detail\/).*(?=\/)/g)[0];
      icon.dataset['marketId']=id;
      market.dataset['marketId']=id;
      if (tc.hiddenMarketIds.includes(id)) {
        tc.hiddenMarkets.push(market);
        market.classList.add('PIe-hidden');
      }
      else {
        icon.classList.add('PIe-gray');
      }
      icon.onclick = (e) => {
        e.stopPropagation();
        toggleMarketHidden(e.target.parentNode.parentNode.parentNode.parentNode.parentNode);
      }
    });
    addButton();
  }
  
  checkElement = async selector => {

    while ( document.querySelector(selector) === null) {
      await new Promise( resolve =>  requestAnimationFrame(resolve) )
    }
    initializeNow(document);
    return document.querySelector(selector);
  };
  

  
  function toggleMarketHidden(market) {
    var index=tc.hiddenMarkets.indexOf(market);
    var icon=market.querySelector(`.PIe-icon`);
    if (index > -1) {
      tc.hiddenMarkets.splice(index, 1);
      if(tc.hidden){
        market.classList.remove('PIe-hidden');
      }
    } else {
      tc.hiddenMarkets.push(market);
      if(tc.hidden){
        market.classList.add('PIe-hidden');
      }
    }
    tc.hiddenMarketIds = [];
    tc.hiddenMarkets.forEach( (market) => {
      console.log(market);
      tc.hiddenMarketIds.push(market.dataset['marketId']);
    });
    chrome.storage.sync.set({"hiddenMarketIds":tc.hiddenMarketIds},function(){
      console.log("value is set to : "+tc.hiddenMarketIds);
    });
    icon.classList.toggle('PIe-gray');
  }
      
  
  function toggleButtonStatus(button){
    if(button.textContent=="Hide"){
      button.textContent="Unhide";
      hideHidden();
      tc.hidden=true;
    } else if(button.textContent=="Unhide"){
      button.textContent="Hide";
      showHidden();
      tc.hidden=false;
    }
  }
  
  function showHidden(){
    tc.hiddenMarkets.forEach( (market) => {
      market.classList.remove('PIe-hidden');
    });
  }
  
  function hideHidden(){
    tc.hiddenMarkets.forEach( (market) => {
      market.classList.add('PIe-hidden');
    });
  }
  
  function addButton(){
    if(document.querySelector('.PIe-button')){
      return;
    }
    var openDiv=document.querySelector('.dashboard-markets-toggle').parentNode;
    openDiv.classList.add("small-2");
    openDiv.classList.remove("small-3");
    var filtersDiv=document.querySelector('.market-filters-dashboard').parentNode;
    filtersDiv.classList.add("small-8");
    filtersDiv.classList.remove("small-9");
    var hideDiv = document.createElement("div");
    hideDiv.innerHTML = openDiv.innerHTML;
    hideDiv.classList.add("column");
    hideDiv.classList.add("small-2");
    hideDiv.classList.add("PIe-button");
    var b = hideDiv.childNodes[0].childNodes[0];
    b.textContent="Unhide";
    b.onclick = (e) => {
      toggleButtonStatus(e.target);
    }
    openDiv.parentElement.insertBefore(hideDiv,openDiv);
  }
  
  function addIcon(market){
    if(market.querySelector('.PIe-icon')){
      return market.querySelector('.PIe-icon');
    }
    var icon=document.createElement("img");
    icon.src=chrome.runtime.getURL("hide.png");
    icon.width="40";
    icon.classList.add("PIe-icon");
    var row=market.querySelector('.market-payout--dashboard');
    row.insertBefore(icon,row.firstChild);
    return icon;
  }
  
  
  
  
  
  //document.addEventListener("chartDataLoaded",(e) => {
  //  console.log(e.detail);
  //});
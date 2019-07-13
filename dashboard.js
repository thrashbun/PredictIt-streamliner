  var tc={};
  
  chrome.storage.sync.get({"hiddenMarketIds":[],"marketsHidden":true}, (storage) => {
    tc.hiddenMarketIds=storage.hiddenMarketIds;
    tc.hidden=storage.marketsHidden;
    checkElement('.market-payout__price').then((div) => {
      hideMarkets(document);
    }).catch( error =>  console.log(error) );
    checkElement('.dashboard-desktop__header--plus,.dashboard-desktop__header--minus').then((gainEl) => {
      setGainObserver(gainEl.parentNode);
    }).catch( error =>  console.log(error) );
  });
  
  function hideMarkets(document) {
    var markets = document.querySelectorAll(".portfolio-my-markets__item");
    tc.markets=markets;
    tc.hiddenMarkets=[];
    tc.gain=0;
    markets.forEach( (market) => {
      var icon=addIcon(market);
      div=market.querySelector('.market-payout__col-1');
      if (!div){
         return;
      }
      var link=market.querySelector('.market-payout__payout-link-market');
      var id=link.href.match(/(?<=detail\/).*(?=\/)/g)[0];
      icon.dataset['marketId']=id;
      market.dataset['marketId']=id;
      if (tc.hiddenMarketIds.includes(id)) {
        tc.hiddenMarkets.push(market);
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
  
  function calcAndSetGain() {
    tc.gain=0;
    tc.markets.forEach( (market) => {
      if (!market.classList.contains("PIe-hidden")) {
        let change = market.querySelector('.market-change-price');
        if (!change) {
          return;
        }
        let sign = 1;
        if (change.classList.contains('market-change-price--down')) {
          sign = -1;
        }
        tc.gain += sign*Number(change.textContent.substring(1));
      }
    });
    setGain();
  }
  
  function setGainObserver(gainEl) {
    tc.observer = new MutationObserver((mutations) => {
      setGain();
      mutations.forEach((mutation) => {
      });
    });
    tc.observer.observe(gainEl,{childList: true, subtree: true});
    setGain();
  }    
      
    
  
  function setGain() {
    var gainEl = document.querySelector('.dashboard-desktop__header--plus,.dashboard-desktop__header--minus');
    if (!gainEl || (gainEl.textContent === formatGain(tc.gain))) {
      return;
    }
    if (tc.gain > 0) {
      gainEl.classList.add('dashboard-desktop__header--plus');
      gainEl.classList.remove('dashboard-desktop__header--minus');
    } else {
      gainEl.classList.remove('dashboard-desktop__header--plus');
      gainEl.classList.add('dashboard-desktop__header--minus');
    }
    gainEl.textContent = formatGain(tc.gain);//"$"+Math.abs(Math.round(tc.gain*100)/100);
  }
  
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
      tc.hiddenMarketIds.push(market.dataset['marketId']);
    });
    chrome.storage.sync.set({"hiddenMarketIds":tc.hiddenMarketIds},function(){ });
    icon.classList.toggle('PIe-gray');
    calcAndSetGain();
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
    chrome.storage.sync.set({"marketsHidden":tc.hidden},function() {});
  }
  
  function showHidden(){
    tc.hiddenMarkets.forEach( (market) => {
      market.classList.remove('PIe-hidden');
    });
      calcAndSetGain();
  }
  
  function hideHidden(){
    tc.hiddenMarkets.forEach( (market) => {
      market.classList.add('PIe-hidden');
    });
    calcAndSetGain()
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
    if (tc.hidden) {
      b.textContent="Unhide";
      hideHidden();
    } else {
      b.textContent="Hide";
    }
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
    icon.src=chrome.runtime.getURL("icons/hide.png");
    icon.width="40";
    icon.classList.add("PIe-icon");
    var row=market.querySelector('.market-payout--dashboard');
    if (row) {
      row.insertBefore(icon,row.firstChild);
    }
    return icon;
  }
  
  checkElement = async selector => {
    var timeout = 5000;
    var initTime = performance.now();
    var time = 0;
    while ( document.querySelector(selector) === null && time < initTime + timeout) {
      time = await new Promise( resolve =>  requestAnimationFrame(resolve) );
      if (time > initTime + timeout) {
        return Promise.reject(400);
      }
    }
    return document.querySelector(selector);
  }
  
  function formatGain(amount, decimalCount = 2, decimal = ".", thousands = ",") {
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
    let j = (i.length > 3) ? i.length % 3 : 0;

    return (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
  } catch (e) {
    console.log(e)
  }
};
  

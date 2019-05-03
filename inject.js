  var tc={};
  
  function initializeNow(document) {
    console.log(tc.initialized);
    if(tc.initialized){
      console.log("initalized");
      return;
    }
    tc.initialized=true;
    var items = document.querySelectorAll(".portfolio-my-markets__item");
    tc.items=items;
    tc.hiddenItems=[];
    items.forEach( (item) => {
      div=item.querySelector('.market-payout__col-1');
      var investment=parseFloat(div.firstElementChild.innerText.substring(1));
      if (investment < 1) {
        tc.hiddenItems.push(item);
        item.classList.add('PIe-hidden');
      }
    });
    addButton();
    addIcon();
  }
  
  checkElement = async selector => {

    while ( document.querySelector(selector) === null) {
      await new Promise( resolve =>  requestAnimationFrame(resolve) )
    }
    initializeNow(document);
    return document.querySelector(selector);
  };
  
  checkElement('.market-payout__price')
  
  function toggleHidden(button){
    if(button.textContent=="Hide"){
      button.textContent="Unhide";
    } else if(button.textContent=="Unhide"){
      button.textContent="Hide";
    }
    tc.hiddenItems.forEach( (item) => {
      item.classList.toggle('PIe-hidden');
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
    filtersDiv.classList.add("small-6");
    filtersDiv.classList.remove("small-9");
    var hideDiv = document.createElement("div");
    hideDiv.innerHTML = openDiv.innerHTML;
    hideDiv.classList.add("column");
    hideDiv.classList.add("small-2");
    hideDiv.classList.add("PIe-button");
    var b = hideDiv.childNodes[0].childNodes[0];
    b.textContent="Unhide";
    b.onclick = (e) => {
      toggleHidden(e.target);
    }
    openDiv.parentElement.insertBefore(hideDiv,openDiv);
  }
  
  function addIcon(){
    if(document.querySelector('.PIe-hide-icon')){
      return;
    }
    var icon=document.createElement("img");
    icon.src=chrome.runtime.getURL("hide.png");
    icon.width="40";
    icon.classList.add("PIe-hide-icon");
    var rows=document.querySelectorAll('.market-payout--dashboard');
    var row=rows[0]
    row.insertBefore(icon,row.firstChild);
  }
  
  
  
  
  
  document.addEventListener("chartDataLoaded",(e) => {
    console.log(e.detail);
  });
  
  
 // chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {
 //   console.log("hlkj");
 //   console.log(request);
 // });
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
      div=item.querySelector('.market-payout--dashboard');
      var investment=parseFloat(div.firstElementChild.firstElementChild.innerText.substring(1));
      if (investment < 1) {
        tc.hiddenItems.push(item);
        item.classList.add('PIe-hidden');
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
      console.log("click");
      toggleHidden(e.target);
    }
    openDiv.parentElement.insertBefore(hideDiv,openDiv);
  }
  
  document.addEventListener("chartDataLoaded",(e) => {
    console.log(e.detail);
  });
  
  
 // chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {
 //   console.log("hlkj");
 //   console.log(request);
 // });
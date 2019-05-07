  var tc={};
  
  tc.id=location.href.match(/(?<=detail\/).*(?=\/)/g)[0];
  var id=tc.id;
  var storageDict={"relatedHidden":false,"chartHidden":false,"notesHeight":"150px"};
  storageDict[tc.id] = "";
  chrome.storage.sync.get(storageDict, (storage) => {
    if (document.body.classList.contains('PIe-init')) {
      //return;
    }
    document.body.classList.add('PIe-init');
    console.log("going");
    tc.chartHidden=storage.chartHidden;
    tc.relatedHidden=storage.relatedHidden;
    tc.notes=storage[tc.id];
    tc.notesHeight=storage.notesHeight;
    checkElement('.market-header-title-large__watch').then((div) => {
      addNotesButton(div);
      createNotesPanel();
    });
    checkElement('.market-related').then((panel) => {
      panel.querySelector('.collapsible-panel__content').classList.add('PIe-init');
      addRelatedPanelListener(panel);
      if (tc.relatedHidden){
        toggleRelatedPanel(panel);
        tc.relatedHidden=true;
        chrome.storage.sync.set({"relatedHidden":tc.relatedHidden},function(){
          console.log("relatedHidden is set to : "+tc.relatedHidden);
        });
      }
    });
    checkElement('.market-history__title').then((div) => {
      div.onclick = (e) => {
        div.onclick=null;
        checkElement('.market-history__content').then((panel) => {
          panel.parentNode.classList.add('PIe-init');
          addHistoryPanelListener(panel.parentNode.parentNode.parentNode);
        });
      }
    });
    var panel=document.createElement("div");
    panel.classList.add('PIe-chart');
    checkElement('.charts-timeline').then((tabs) => {
      chart=tabs.parentElement;
      if (chart.classList.contains('PIe-init')) {
        return;
      }
      chart.classList.add('PIe-init');
      createPanel(panel,chart);
      console.log(panel);
      console.log(chart);
      chart.appendChild(panel);
      addButton(chart);
      if (tc.chartHidden) {
        toggleButton(chart.querySelector('.PIe-chart-button').firstChild);
        toggleChart(panel);
        tc.chartHidden=true;
        chrome.storage.sync.set({"chartHidden":tc.chartHidden},function(){
          console.log("chartHidden is set to : "+tc.chartHidden);
        });
      }
    });
    checkElement('.charts-table').then((table) => {
      chart=table.parentElement;
      createPanel(panel,chart);
    });
  });
  
  function createPanel(panel,chart) {
    [...chart.children].forEach((child) => {
      if (child.classList && (child.classList.contains('charts-timeline') || child.classList.contains('PIe-chart'))) {
        return;
      }
      chart.removeChild(child);
      panel.appendChild(child);
    });
  }
  
  function addButton(chart) {
    var div = document.createElement("li");
    var arrow = document.createElement("img");
    arrow.src = chrome.runtime.getURL("expanded.svg");
    div.appendChild(arrow);
    div.classList.add("PIe-chart-button");
    chart.querySelector('.charts-timeline__tabs-type').firstChild.appendChild(div);
    div.onclick = (event) => {
      toggleButton(arrow);
      var chart = document.querySelector('.PIe-chart');
      toggleChart(chart);
    }
  }
  
  function toggleButton(arrow) {
    if (arrow.classList && arrow.classList.contains("PIe-collapsed")){
      arrow.src = chrome.runtime.getURL("expanded.svg");
      arrow.classList.remove("PIe-collapsed");
      tc.chartHidden = false;
    } else {
      arrow.src = chrome.runtime.getURL("collapsed.svg");
      arrow.classList.add("PIe-collapsed");
      tc.chartHidden = true;
    }
    chrome.storage.sync.set({"chartHidden":tc.chartHidden},function(){
      console.log("chartHidden is set to : "+tc.chartHidden);
    });
  }
  
  function toggleChart(chart) {
    if (chart.classList.contains("PIe-hidden")){
      chart.classList.remove("PIe-hidden");
    } else {
      chart.classList.add("PIe-hidden");
    }
  }
  
  function addRelatedPanelListener(panel) {
    panel.onclick = (e) => {
      toggleRelatedPanel(panel)
    } 
  }
  
  function toggleRelatedPanel(panel) {
    contentPanel=panel.querySelector('.collapsible-panel__content');
    console.log(contentPanel);
    if (contentPanel.classList.contains('PIe-init') && !contentPanel.classList.contains('PIe-hidden')) {
      panel.firstChild.classList.remove('collapsible-panel--is-open');
      contentPanel.classList.add('PIe-hidden');
      tc.relatedHidden=true;
    } else {
      panel.firstChild.classList.add('collapsible-panel--is-open');
      contentPanel.classList.remove('PIe-hidden');
      tc.relatedHidden=false;
    }
    contentPanel.classList.add('PIe-init');
    chrome.storage.sync.set({"relatedHidden":tc.relatedHidden},function(){
      console.log("relatedHidden is set to : "+tc.relatedHidden);
    });
  }
  
  function addHistoryPanelListener(panel) {
    panel.onclick = (e) => {
      toggleHistoryPanel(panel)
    } 
  }
  
  function toggleHistoryPanel(panel) {
    contentPanel=panel.querySelector('.collapsible-panel__content');
    console.log(contentPanel);
    if (contentPanel.classList.contains('PIe-init') && !contentPanel.classList.contains('PIe-hidden')) {
      panel.firstChild.classList.remove('collapsible-panel--is-open');
      contentPanel.classList.add('PIe-hidden');
    } else {
      panel.firstChild.classList.add('collapsible-panel--is-open');
      contentPanel.classList.remove('PIe-hidden');
    }
    contentPanel.classList.add('PIe-init');
  }
  
  function createNotesPanel(){
    var container=document.createElement("div");
    container.classList.add("PIe-notes-container");
    container.classList.add("PIe-hidden");
    container.innerHTML = `<div class="PIe-notes-header market-detail__payout-header">
                           <div class="market-detail__payout-header-col-1">Notes</div>
                         </div>
                         <div class="PIe-notes-content">
                            <textarea class="PIe-notes" style="height: `+tc.notesHeight+`;">`+tc.notes+`</textarea>
                         </div>
                         <div class="PIe-notes-button-row">
                          <button class="PIe-notes-discard button button--primary">Discard Changes</button><button class="PIe-notes-save button button--primary">Save</button>
                         </div>`;
    var marketHeader=document.querySelector('.market-header-title-large');
    marketHeader.parentElement.insertBefore(container,marketHeader.nextSibling);
    container.querySelector('.PIe-notes-save').onclick = (event) => {
      var notes=container.querySelector('.PIe-notes');
      var map = {};
      map["notesHeight"] = notes.offsetHeight + "px";
      map[tc.id] = notes.value;
      chrome.storage.sync.set(map,function() { console.log("Text saved: "+map[tc.id]) });
      tc.notes = map[tc.id];
      if (map[tc.id] !== "") {
        document.querySelector(".PIe-notes-icon").classList.remove("PIe-gray");
      } else {
        document.querySelector(".PIe-notes-icon").classList.add("PIe-gray");
      }
    };
    container.querySelector('.PIe-notes-discard').onclick = (event) => {
      container.querySelector('.PIe-notes').value = tc.notes;
    };
  }
  
  function addNotesButton(div){
    var button=document.createElement("img");
    button.src=chrome.runtime.getURL("notes.svg");
    button.classList.add("PIe-notes-icon");
    if (tc.notes === "") {
      button.classList.add("PIe-gray");
    }
    div.appendChild(button);
    button.onclick = (event) => {
      document.querySelector(".PIe-notes-container").classList.toggle("PIe-hidden");
    }
  }
  
  
  checkElement = async selector => {

    while ( document.querySelector(selector) === null) {
      await new Promise( resolve =>  requestAnimationFrame(resolve) );
    }
    return document.querySelector(selector);
  };
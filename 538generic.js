document.addEventListener("genericData",(e) => {
  var generic=e.detail[e.detail.length-1]['revised'];
  console.log(generic);
  var dem = generic['dem_estimate'];
  var rep = generic['rep_estimate'];
  var net = (Math.round(10*dem) - Math.round(10*rep))/10;
  
  var subtitle = document.querySelector(".article-subtitle");
  
  var netTag = document.createElement("h1");
  netTag.className = "desktop";
  netTag.textContent = "D+"+net;
  document.getElementById("intro").insertBefore(netTag,subtitle);
  var netSize = parseInt(window.getComputedStyle(netTag)["fontSize"],10);
  var partySize = .8*netSize + "px";
  
  var demTag = document.createElement("h2");
  demTag.className = "desktop";
  demTag.textContent = dem;
  demTag.style.color = "#008fd5";
  demTag.style.fontSize = partySize;
  document.getElementById("intro").insertBefore(demTag,subtitle);
  
  var repTag = document.createElement("h2");
  repTag.className = "desktop";
  repTag.textContent = rep;
  repTag.style.color="#ff2700";
  repTag.style.fontSize = partySize;
  document.getElementById("intro").insertBefore(repTag,subtitle);
});

var script = document.createElement('script');
script.type = 'text/javascript';
script.innerHTML = `
  var evt = new CustomEvent("genericData", {detail: generic});
  document.dispatchEvent(evt);
`;
(document.head||document.documentElement).appendChild(script);
script.remove();


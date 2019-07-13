document.addEventListener("approvalData",(e) => {
  var index = 0;
  var approvals = e.detail
  approvals.find( (e,i) => {index=i;return e['future']});
  var approval = approvals[index-1];
  approval = approval['approve_estimate'];
  var approveTag = document.createElement("h1");
  approveTag.className = "desktop";
  approveTag.textContent = approval;
  var subtitle = document.querySelector(".article-subtitle");
  document.getElementById("intro").insertBefore(approveTag,subtitle)
});

var script = document.createElement('script');
script.type = 'text/javascript';
script.innerHTML = `
  var evt = new CustomEvent("approvalData", {detail: approval});
  document.dispatchEvent(evt);
`;
(document.head||document.documentElement).appendChild(script);
script.remove();


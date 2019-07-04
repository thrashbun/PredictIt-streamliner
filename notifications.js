function getNotifications() {
  var token = JSON.parse(localStorage['token'])['value'];
  var headers={
    "Host": "www.predictit.org",
    "Connection": "keep-alive",
    "Accept": "application/json, text/plain, */*",
    "Authorization": "Bearer "+token,
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36",
    "Referer": "https://www.predictit.org/dashboard/",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "en-US,en;q=0.9",
    "Cookie": document.cookie
  }
  var Http = new XMLHttpRequest();
  var url='https://www.predictit.org/api/Profile/Notifications?itemsPerPage=10&page=1';
  Http.open("GET", url);
  for (const [key, value] of Object.entries(headers)) {
    Http.setRequestHeader(key, value);
  }

  Http.send();

  Http.onreadystatechange = (e) => {
    console.log(Http.responseText)
  }
}
  
function fromNow(timestamp) {
  threshold = {
    "ss":45,
    "m":45,
    "h":22,
    "d":26,
    "M":11
  }
  seconds = Math.round(new Date().getTime()/1000 - timestamp);
  if (seconds < threshold['ss']) {
    return "a few seconds ago";
  }
  minutes = Math.round(seconds/60);
  if (minutes <= 1) {
    return "a minute ago";
  }
  if (minutes < threshold['m']) {
    return minutes + " minutes ago";
  }
  hours = Math.round(minutes/60);
  if (hours <= 1) {
    return "an hour ago";
  }
  if (hours < threshold['h']) {
    return hours + " hours ago";
  }
  days = Math.round(hours/24);
  if (days == 1) {
    return "a day ago";
  }
  if (days < threshold['d']) {
    return days + " days ago";
  }
  months = Math.round(days/30.42);
  if (months == 1) {
    return "a month ago";
  }
  if (months < threshold["M"]) {
    return months + " months ago";
  }
  years = Math.round(months/12);
  if (years <= 1) {
    return "a year ago";
  }
  return years + " years ago";
}
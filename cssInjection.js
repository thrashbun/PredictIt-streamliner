function addStyleTag() {
  var notificationsStyle = document.createElement('style');
  notificationsStyle.type = 'text/css';
  notificationsStyle.class = "PIs";
  notificationsStyle.id = "PIs-notifications";
  notificationsStyle.innerHTML = `
  .notification-items {
    left: 0 !important;
  }
  .side-notification {
    left: 0 !important;
  }

  .slide-notification-items-enter,.slide-notification-items-leave-to {
    transform: translateX(-100%)
  }

  .app-layout-side-notification-enter,.app-layout-side-notifications-leave-to {
    transform: translateX(-100%)
  }
  `
  document.getElementsByTagName( 'html' )[0].appendChild(notificationsStyle);
}

function checkForDOM() {
  if (document.body && document.head) {
    if (!document.getElementById("PIs-notifications")) {
      addStyleTag();
    }
  } else {
    requestIdleCallback(checkForDOM);
  }
}

requestIdleCallback(checkForDOM);
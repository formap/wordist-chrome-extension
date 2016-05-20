function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;
    console.assert(typeof url == 'string', 'tab.url should be a string');
    callback(url);
  });
}

function validateData(email, password) {
  if (!email || !password) return false;
  var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
}

function addSigninListener() {
  document.getElementById('sign-in-button').addEventListener('click', function (e) {
    var email = document.getElementById('sign-in-email').value;
    var password = document.getElementById('sign-in-password').value;
    var valid = validateData(email, password);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url) {
    addSigninListener();
  });
});

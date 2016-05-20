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

function loginUser(userData) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      var response = JSON.parse(xhr.responseText);
      localStorage.setItem('id', response.user._id);
      localStorage.setItem('token', response.token);
    }
  }
  var url = 'https://wordist-backend.herokuapp.com/auth/login';
  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(userData);
}

function validateData(userData) {
  if (!userData.email || !userData.password) return false;
  var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(userData.email);
}

function addSigninListener() {
  document.getElementById('sign-in-button').addEventListener('click', function (e) {
    var userData = {
      email: document.getElementById('sign-in-email').value,
      password: document.getElementById('sign-in-password').value
    }
    var valid = validateData(userData);
    if (valid) loginUser(JSON.stringify(userData));
  });
}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url) {
    addSigninListener();
  });
});

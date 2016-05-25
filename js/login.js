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

function renderError(errorText) {
  document.getElementById('error').textContent = errorText;
}

function loginUser(userData) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      if (xhr.status != 200) renderError('Incorrect email or password');
      var response = JSON.parse(xhr.responseText);
      localStorage.setItem('wordistId', response.user._id);
      localStorage.setItem('wordistEmail', response.user.email);
      localStorage.setItem('wordistToken', response.token);
      addUserTemplate();
    }
  }
  var url = 'https://wordist-backend.herokuapp.com/auth/login';
  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(userData));
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
    if (valid) loginUser(userData);
    else renderError('Invalid email or password');
  });
}

function addSignedInListeners() {
  document.getElementById('view-history-button').addEventListener('click', function (e) {
    var wind = window.open('http://localhost:8080/#/home', '_blank');
    if (wind) wind.focus();
  });

  document.getElementById('sign-out-button').addEventListener('click', function (e) {
    localStorage.removeItem('wordistToken');
    window.close();
  });
}

function addLoginTemplate() {
  document.getElementById('popup-template').innerHTML =
    "<div class='login-popup'> \
      <span>Sign-in to Wordist:</span> \
      <div id='error'></div> \
      <input type='email' placeholder='Email' id='sign-in-email'> \
      <input type='password' placeholder='Password' id='sign-in-password'> \
      <button id='sign-in-button'>Sign-in</button> \
      <span id='register-popup'>Don't have an account?<a href='https://localhost:8080/'>Sign-up</a> \
    </div>";
}

function addUserTemplate() {
  var email = localStorage.getItem('wordistEmail');
  document.getElementById('popup-template').innerHTML =
    "<div class='logged-popup'> \
      <span>Welcome to wordist <span id='userName'>" + email + "</span>!</span> \
      <button id='view-history-button'>View history</button> \
      <button id='sign-out-button'>Sign-out</button> \
    </div>";
}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url) {
    var token = localStorage.getItem('wordistToken');
    if (!token) {
      addLoginTemplate();
      addSigninListener();
    } else {
      addUserTemplate(token);
      addSignedInListeners();
    }
  });
});

var isLoaded = {}

/* Keyboard Shortcuts */

var actions = {
  'search-word': 'js/definition.js'
};

function getActiveTab (callback) {
  chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  }, function (tabArray) {
    callback(tabArray[0]);
  });
}

function performCommand (tab, command, callback) {
  if (isLoaded[tab.id]) {
    callback();
    return;
  }
  isLoaded[tab.id] = true;
  chrome.tabs.executeScript(tab.id, {
    file: actions[command]
  }, callback);
}

chrome.commands.onCommand.addListener(function (command) {
  getActiveTab(function (tab) {
    performCommand(tab, command, function() {
      chrome.tabs.sendMessage(tab.id, {function: 'searchDefinition'});
    });
  });
});

/* Context Menu */

function saveToUser (selection, definition, token) {
  var data = {
    word: selection,
    definition: definition
  }
  var userId = localStorage.getItem('wordistId');
  token = 'Bearer ' + token;
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      if (xhr.status != 200) console.log('Error while saving word to user');
      console.log('Successfully saved word to user');
    }
  }
  var url = 'https://wordist-backend.herokuapp.com/users/' + userId + '/words';
  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.setRequestHeader('Authorization', token);
  xhr.send(JSON.stringify(data));
}

function searchDefinition (port, selection) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      var response = xhr.responseText;
      console.log(response);
      var definitionRe = /<plaintext>([\s\S]*)<\/plaintext>/g;
      var definition = definitionRe.exec(response);
      if (definition == null) {
        definition = "Whoops!<br><br>It seems like we couldn't find a definition \
          for that word. You can try clicking on the Wikipedia link below to get more \
          information.";
      } else {
        definition = definition[1];
        var parentheses = definition.match(/\([^()]*\)/g);
        if (parentheses != null) {
          var lastParentheses = parentheses.pop();
          definition = definition.replace(lastParentheses, '');
        }
        var sentences = definition.match(/(\d\D+)/g);
        if (sentences != null) {
          definition = sentences.join(' <br><br> ');
        }
      }
      var token = localStorage.getItem('wordistToken');
      if (token) saveToUser(selection, definition, token);
      port.postMessage(definition);
    }
  }
  var url = 'http://api.wolframalpha.com/v2/query?appid=LJ95GY-EH7LLL579U&input='
    + selection + '&format=plaintext&includepodid=Definition:WordData';
  xhr.open('GET', url, true);
  xhr.send();
}

chrome.contextMenus.create({"id": "parent", "title": "Look up word", "contexts": ["selection"]});
chrome.contextMenus.create({"id": "first-child", "title": "Definition", "contexts": ["selection"], "parentId": "parent"});
chrome.contextMenus.create({"id": "second-child", "title": "Word history", "contexts": ["selection"], "parentId": "parent"});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  switch(info.menuItemId) {
    case 'first-child':
      getActiveTab( function(tab) {
        performCommand(tab, 'search-word', function () {
          chrome.tabs.sendMessage(tab.id, {function: 'searchDefinition'});
        });
      });
      break;
    case 'second-child':
      getActiveTab( function(tab) {
        performCommand(tab, 'search-word', function () {
          chrome.tabs.sendMessage(tab.id, {function: 'showHistory'}, function (selection) {
            console.log(selection);
          });
        });
      });
      break;
    default:
      console.log('Invalid option');
  }
});

chrome.runtime.onConnect.addListener(function(port) {
  searchDefinition(port, port.name);
});

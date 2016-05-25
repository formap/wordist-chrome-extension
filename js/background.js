var isLoaded = {};
var wordData = {};
var responses = 0;

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

function searchExample(port, selection) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      var response = JSON.parse(xhr.responseText);
      wordData.example = '';
      if (response != null && response.text != null && response.text != undefined) {
        wordData.example = response.text;
      }
      responses += 1;
      if (responses == 3) sendResponse(port, selection);
    }
  }
  var url = 'http://api.wordnik.com:80/v4/word.json/' + selection +
    '/topExample?useCanonical=false&api_key=2cb81415758e37f066b0d0454ff0ff31d6867179a2d64b633'
  xhr.open('GET', url, true);
  xhr.send();
}

function searchPronunciation(port, selection) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      var response = JSON.parse(xhr.responseText);
      wordData.pronunciation = '';
      if (response.length > 0) {
        wordData.pronunciation = response[0].raw;
      }
      responses += 1;
      if (responses == 3) sendResponse(port, selection);
    }
  }
  var url = 'http://api.wordnik.com:80/v4/word.json/' + selection +
    '/pronunciations?useCanonical=false&limit=1&api_key=2cb81415758e37f066b0d0454ff0ff31d6867179a2d64b633';
  xhr.open('GET', url, true);
  xhr.send();
}

function searchInWordnik(port, selection) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      var response = JSON.parse(xhr.responseText);
      if (response.length > 0) {
        wordData.definition = response[0].text;
        wordData.partOfSpeech = response[0].partOfSpeech;
        wordData.error = false;
      } else {
        wordData.definition = "Whoops!<br><br>It seems like we couldn't find a definition \
          for that word. You can try clicking on the Wikipedia link below to get more \
          information.";
        wordData.error = true;
      }
      responses += 1;
      if (responses == 3) sendResponse(port, selection);
    }
  }
  var url = 'http://api.wordnik.com:80/v4/word.json/' + selection +
    '/definitions?limit=1&includeRelated=false&useCanonical=true&includeTags=false \
    &api_key=2cb81415758e37f066b0d0454ff0ff31d6867179a2d64b633';
  xhr.open('GET', url, true);
  xhr.send();
}

function sendResponse(port, selection) {
  var token = localStorage.getItem('wordistToken');
  if (token && !wordData.error) saveToUser(selection, wordData.definition, token);
  port.postMessage(wordData);
  wordData = {};
  responses = 0;
}

function searchDefinition(port, selection) {
  searchInWordnik(port, selection);
  searchPronunciation(port, selection);
  searchExample(port, selection);
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

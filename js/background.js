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
      chrome.tabs.sendMessage(tab.id, {function: 'showPopup'});
    });
  });
});

/* Context Menu */

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
          chrome.tabs.sendMessage(tab.id, {function: 'showHistory'});
        });
      });
      break;
    default:
      console.log('Invalid option');
  }
});

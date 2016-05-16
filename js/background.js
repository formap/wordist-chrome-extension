var isLoaded = {}

/* Keyboard Shortcuts */

var actions = {
  'search-word': 'js/definition.js'
};

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
  chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  }, function (tabArray) {
    var activeTab = tabArray[0];
    if (!activeTab) throw new Error("Couldn't find an active tab");
    performCommand(activeTab, command);
  });
});

/* Context Menu */

chrome.contextMenus.create({"id": "parent", "title": "Look up word", "contexts": ["selection"]});
chrome.contextMenus.create({"id": "first-child", "title": "Definition", "contexts": ["selection"], "parentId": "parent"});
chrome.contextMenus.create({"id": "second-child", "title": "Word history", "contexts": ["selection"], "parentId": "parent"});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  switch(info.menuItemId) {
    case 'first-child':
      chrome.tabs.query({
        active: true,
        currentWindow: true
      }, function(tabArray) {
        performCommand(tabArray[0], 'search-word', function () {
          chrome.tabs.sendMessage(tabArray[0].id, {function: 'searchDefinition'})
        });
      });
      break;
    case 'second-child':
      chrome.tabs.query({
        active: true,
        currentWindow: true
      }, function(tabArray) {
        chrome.tabs.sendMessage(tabArray[0].id, {function: 'showHistory'});
      });
      break;
    default:
      console.log('Invalid option');
  }
});

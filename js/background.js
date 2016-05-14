/* Keyboard Shortcuts */

var actions = {
  'search-word': 'js/definition.js'
};

function performCommand (tab, command) {
  chrome.tabs.executeScript(tab.id, {
    file: actions[command]
  });
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
      searchDefinition();
      break;
    case 'second-child':
      showHistory();
      break;
    default:
      console.log('Invalid option');
  }
});

function searchDefinition () {
  chrome.tabs.executeScript( {
      code: "window.getSelection().toString();"
    }, function(selection) {
      var word = selection[0];
      //llamar a la api para que devuelva la definicion

  });
}

function showHistory () {

}

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

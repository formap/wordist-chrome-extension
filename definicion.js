// Create a parent item and two children.
var parent = chrome.contextMenus.create({"title": "Buscar definición"});

var child1 = chrome.contextMenus.create(
  {"title": "Definition", "parentId": parent, "onclick": searchDefinition});

var child2 = chrome.contextMenus.create(
  {"title": "History", "parentId": parent, "onclick": showHistory});

function searchDefinition() {
  chrome.tabs.executeScript( {
      code: "window.getSelection().toString();"
    }, function(selection) {
      var word = selection[0];
      //llamar a la api para que devuelva la definicion

  });
}

function showHistory() {}


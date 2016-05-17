function showPopup (selection, definition) {
  var container = document.createElement('div');
  if (definition == '') definition = 'No definition was found for this word.';
  container.innerHTML = "<p class='searchedWord'>" + selection +
    "</p><hr/><p class='wordDefinition'>" + definition + "</p>";
  container.className = 'wordist-popup';
  document.body.appendChild(container);
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.function == 'searchDefinition') {
      var selection = document.getSelection().toString();
      var port = chrome.runtime.connect({name: selection});
      port.onMessage.addListener(function(definition) {
        console.log("entro igualmente");
        showPopup(selection, definition)
      });
    } else if (request.function == 'showHistory') {
      console.log('show history at some point');
    }
  }
);

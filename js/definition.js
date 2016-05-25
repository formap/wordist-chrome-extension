function showPopup (selection, wordData) {
  var container = document.createElement('div');
  container.innerHTML = "<span class='searchedWord'>" + selection +
    "</span><span id='wordPronunciation'>" + wordData.pronunciation + "</span><hr/> \
    <p class='wordDefinition'>" + wordData.definition + "<br><br>  \
    <span id='wordExample'>" + wordData.example + "</span><br><br> \
    <a target='_blank' href=https://en.wikipedia.org/wiki/" + selection +
    ">Search " + selection + " on Wikipedia</a>";
  container.className = 'wordist-popup';
  document.body.appendChild(container);
}

document.addEventListener('keydown', function (e) {
  if (e.keyCode == 27) {
    var element = document.getElementsByClassName('wordist-popup')[0];
    if (element == null)  return;
    element.parentNode.removeChild(element);
  }
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.function == 'searchDefinition') {
      var selection = document.getSelection().toString();
      var port = chrome.runtime.connect({name: selection});
      port.onMessage.addListener(function(definition) {
        showPopup(selection, definition)
      });
    } else if (request.function == 'showHistory') {
      console.log('show history at some point');
    }
  }
);

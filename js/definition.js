function searchDefinition () {
  var selection = document.getSelection().toString();
  /*
  chrome.runtime.sendMessage({function: 'searchDefinition', parameter: selection});
  */
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      var response = JSON.parse(xhr.responseText);
      console.log(response);
      var definition = response.AbstractText;
      showPopup(selection, definition);
    }
  }
  var url = 'https://duckduckgo-duckduckgo-zero-click-info.p.mashape.com/?format=json&no_html=1&no_redirect=1&q='
    + selection + '&skip_disambig=1';
  xhr.open('GET', url, true);
  xhr.setRequestHeader("X-Mashape-Key", "qY2Ooeo8CMmshqxlfaYYgBqx3J9lp1Ckq1YjsnzlAw67ALypVE");
  xhr.setRequestHeader("Accept", "text/plain");
  xhr.send();
}


function showHistory () {

}

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
      searchDefinition();
    } else if (request.function == 'showHistory') {
      showHistory();
    }
  }
);

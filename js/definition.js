function searchDefinition () {
  var word = document.getSelection();
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      var parsedData = JSON.parse(xhr.responseText);
      var definitions = parsedData.list;
      var definitionsList = [];
      for (var i = 0; i < definitions.length; ++i) {
        definitionsList.push(definitions[i].definition);
      }
      //definitionsList have all the definitions
      alert(definitionsList);
    }
  }
  var url = 'https://mashape-community-urban-dictionary.p.mashape.com/define?term=' + word;
  xhr.open('GET', url, true);
  xhr.setRequestHeader("X-Mashape-Key", "bOzAISqPsTmshNicTnIY3HxICaFkp16bplzjsn6qOVxYlKqLCO");
  xhr.setRequestHeader("Accept", "text/plain");
  xhr.send(null);
}

function showHistory () {

}

function showPopup () {
  var container = document.createElement('div');
  container.innerHTML = "<p class='searchedWord'> \
    </p><hr/><p class='wordDefinition'>Loading...</p>";
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

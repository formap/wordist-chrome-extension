// Copyright (c) 2010 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// A generic onclick callback function.
function genericOnClick(info, tab) {
  console.log("item " + info.menuItemId + " was clicked");
  console.log("info: " + JSON.stringify(info));
  console.log("tab: " + JSON.stringify(tab));
}

/*
// Create one test item for each context type.
var contexts = ["page","selection","link","editable","image","video",
                "audio"];
for (var i = 0; i < contexts.length; i++) {
  var context = contexts[i];
  var title = "Test '" + context + "' menu item";
  if (context=="selection") {
    var id = chrome.contextMenus.create({
                                          "title": title, 
                                          "contexts":[context], 
                                          "onclick": genericOnClick
                                        });
      console.log("'" + context + "' item:" + id);
  }
}
*/


// Create a parent item and two children.
var parent = chrome.contextMenus.create({"title": "Buscar definición"});
var child1 = chrome.contextMenus.create(
  {"title": "Definition", "parentId": parent, "onclick": searchDefinition});
var child2 = chrome.contextMenus.create(
  {"title": "History", "parentId": parent, "onclick": genericOnClick});
console.log("parent:" + parent + " child1:" + child1 + " child2:" + child2);
var emoji = {};

var xmlHttpRequest = function (url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {callback(xhr.response)};
  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.send();
};

var background = (function () {
  var _tmp = {};
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    for (var id in _tmp) {
      if (_tmp[id] && (typeof _tmp[id] === "function")) {
        if (request.path == 'background-to-popup') {
          if (request.method === id) _tmp[id](request.data);
        }
      }
    }
  });
  /*  */
  return {
    "receive": function (id, callback) {_tmp[id] = callback},
    "send": function (id, data) {chrome.runtime.sendMessage({"path": 'popup-to-background', "method": id, "data": data})}
  }
})();

var fill = function (keyword) {
  var select = document.getElementById("emoji-select");
  chrome.storage.local.set({"keyword": keyword}, function () {
    keyword ? select.value = keyword : select.selectedIndex = 1;
  });
  /*  */
  var arr = keyword ? emoji.base[keyword] || [] : emoji.list;
  if (arr.length) {
    var count = 0;
    var table = document.getElementById("emoji");
    table.textContent = '';
    while (count < arr.length) {
      var tr = document.createElement("tr");
      for (var i = 0; i < 10; i++) {
        if (count < arr.length) {
          var td = document.createElement("td");
          var str = arr[count].split(',');
          td.setAttribute("code", arr[count]);
          td.setAttribute("name", (emoji.name[arr[count]] || "N/A")); 
          switch (str.length) {
            case 1: td.textContent = String.fromCodePoint(str[0]); break;
            case 2: td.textContent = String.fromCodePoint(str[0], str[1]); break;
            case 3: td.textContent = String.fromCodePoint(str[0], str[1], str[2]); break;
            case 4: td.textContent = String.fromCodePoint(str[0], str[1], str[2], str[3]); break;
            case 5: td.textContent = String.fromCodePoint(str[0], str[1], str[2], str[3], str[4]); break;
          }
          td.addEventListener("click", function (e) {
            var str = ", Code: " + e.target.getAttribute("code") + ", Name: " + e.target.getAttribute("name");
            var icon = document.getElementById("emoji-icon");
            var detail = document.getElementById("emoji-detail");
            icon.value = e.target.textContent;
            detail.value = 'Copied to clipboard' + str;
            document.execCommand('copy');
          });
          tr.appendChild(td);
          count++;
        }
      }
      table.appendChild(tr);
    }
  }
};

var init = function () {
  xmlHttpRequest(chrome.extension.getURL("data/popup/map.json"), function (e) {
    if (e) {
      emoji = e;
      var add = function (txt, val) {
        var option = document.createElement("option");
        option.setAttribute("value", val);
        option.textContent = txt;
        select.appendChild(option);
      };
      /*  */
      window.removeEventListener("load", init, false);
      var category = document.getElementById("category");
      var buttons = Array.prototype.slice.call(category.querySelectorAll("td"), 0);
      for (var i = 0; i < buttons.length; i++) buttons[i].addEventListener("click", function (e) {fill(e.target.getAttribute("id"))});
      /*  */
      var search = document.getElementById("emoji-search");
      search.addEventListener("change", function (e) {fill(e.target.value)});
      /*  */
      var all = document.getElementById("all");
      var select = document.createElement("select");
      select.setAttribute("id", 'emoji-select');
      select.addEventListener("change", function (e) {fill(e.target.value)});
      add("Select", '');
      add("All Emoji", '');
      for (var id in emoji.base) add(id, id);
      all.appendChild(select);
      /*  */
      var find = document.getElementById("find");
      find.addEventListener("click", function (e) {fill(search.value)});  
      /*  */
      var support = document.getElementById("support");
      support.addEventListener("click", function () {background.send("support")});
      /*  */
      chrome.storage.local.get(null, function (storage) {fill(("keyword" in storage) ? storage["keyword"] : "smiley")});
      document.addEventListener('copy', function(e) {
        var tmp = document.getElementById("emoji-icon").value;
        if (tmp) e.clipboardData.setData('text/plain', tmp);
        e.preventDefault();
      });
    }
  });
};

window.addEventListener("load", init, false);
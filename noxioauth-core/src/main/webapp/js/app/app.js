
var content = document.getElementById("content");
var messages = [];
var displayMessages = function() {
  $.get("messages", function(data, status){

  });
  $.ajax({
    url: 'messages',
    type: 'GET',
    success: function(data, status) {
      messages = data;
      content.innerHTML = "";
      for(var i=0;i<data.length;i++) {
        content.innerHTML += "<div><span><button onclick='deleteMessage("+data[i].id+")' style='font: normal 10px arial, sans-serif'>Delete</button> </span><span style='font: bold 14px arial, sans-serif'>"+data[i].author+": </span><span style='font: italic 10px arial, sans-serif'>"+data[i].message+" </span></div>";
      }
    },
    error: function(textStatus) {
      content.innerHTML = "<span style='font: bold italic 14px arial, sans-serif'>Failed to load messages.</span>";
    }
  });
};

var putMessage = function(id) {
  var message = {id: -1, author: document.getElementById("author").value, message: document.getElementById("message").value};
  $.ajax({
    url: 'messages',
    type: 'PUT',
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify(message),
    success: function(status) {
      displayMessages();
    },
    error: function(textStatus) {
      displayMessages();
    }
  });
};

var deleteMessage = function(id) {
  for(var i=0;i<messages.length;i++) {
    if(messages[i].id === id) {
      $.ajax({
         url: 'messages',
         type: 'DELETE',
         dataType: "json",
         contentType: "application/json; charset=utf-8",
         data: JSON.stringify(messages[i]),
         success: function(status) {
           displayMessages();
         },
         error: function(textStatus) {
           displayMessages();
         }
      });
      return;
    }
  }
};

displayMessages();
setInterval(displayMessages, 10000);
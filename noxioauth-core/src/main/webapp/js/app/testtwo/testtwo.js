var webSocket;
var messages = document.getElementById("messages");

function openSocket(){

    if(webSocket !== undefined && webSocket.readyState !== WebSocket.CLOSED){
       writeResponse("WebSocket is already opened.");
        return;
    }

    webSocket = new WebSocket("ws://"+ document.getElementById("messageinput").value +":7001/noxioauth/livemessages");
    document.getElementById("messageinput").value = "";

    webSocket.onopen = function(event){

        if(event.data === undefined)
            return;

        writeResponse(event.data);
    };

    webSocket.onmessage = function(event){
        writeResponse(event.data);
    };

    webSocket.onclose = function(event){
        writeResponse("Connection closed");
    };
}

function send(){
    var text = document.getElementById("messageinput").value;
    webSocket.send(text);
}

function closeSocket(){
    webSocket.close();
}

function writeResponse(text){
    messages.innerHTML += "<br/>" + text;
}


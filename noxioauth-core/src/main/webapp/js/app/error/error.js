var error = {};

error.modal = document.getElementById('errorModal');
error.close = document.getElementById("errorModalClose");
error.title = document.getElementById("errorModalTitle");
error.message = document.getElementById("errorModalMessage");
error.footer = document.getElementById("errorModalFooter");

error.showError = function(title, message) {
  error.modal.style.display = "block";
  error.title.innerHTML = title;
  error.message.innerHTML = "<p>" + message + "</p>";
  error.footer.innerHTML = "If you don't know what happened please report this error to help@help.help...";
};

error.showErrorException = function(title, message, trace) {
  error.modal.style.display = "block";
  error.title.innerHTML = title;
  error.message.innerHTML = "<p>" + message + "</p><div style='margin-bottom:12px;height:120px;width:100%;font-size:80%;border:1px solid #ccc;background-color:#DDDDDD;overflow:auto;'>" + trace + "</div>";
  error.footer.innerHTML = "If you don't know what happened please report this error to help@help.help...";
};


error.close.onclick = function() {
  error.modal.style.display = "none";
};


window.onclick = function(event) {
    if (event.target === error.modal) {
        error.modal.style.display = "none";
    }
};
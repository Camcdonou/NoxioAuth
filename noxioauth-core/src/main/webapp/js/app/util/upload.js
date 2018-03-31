/* Copy pasted from stack overflow. :^) */
var FileUpload = function (url, file, user, sid) {
  this.url = url;
  this.file = file;
  this.user = user;
  this.sid = sid;
};

FileUpload.prototype.getType = function() {
    return this.file.type;
};
FileUpload.prototype.getSize = function() {
    return this.file.size;
};
FileUpload.prototype.getName = function() {
    return this.file.name;
};
FileUpload.prototype.doUpload = function (onSuccess, onError) {
    var that = this;
    var formData = new FormData();

    // add assoc key values, this will be posts values
    formData.append("file", this.file, this.getName());
    formData.append("upload_file", true);
    formData.append('creds', new Blob([JSON.stringify({
                    "user": that.user,
                    "sid": that.sid
                })], {
                    type: "application/json"
                }));

    $.ajax({
        type: "POST",
        url: that.url,
        xhr: function () {
            var myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload) {
                myXhr.upload.addEventListener('progress', that.progressHandling, false);
            }
            return myXhr;
        },
        success: onSuccess,
        error: onError,
        async: true,
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        timeout: 60000
    });
};

FileUpload.prototype.progressHandling = function (event) {
    var percent = 0;
    var position = event.loaded || event.position;
    var total = event.total;
    var progress_bar_id = "#progress-wrp";
    if (event.lengthComputable) {
        percent = Math.ceil(position / total * 100);
    }
    // update progressbars classes so it fits your code
    $(progress_bar_id + " .progress-bar").css("width", +percent + "%");
    $(progress_bar_id + " .status").text(percent + "%");
};
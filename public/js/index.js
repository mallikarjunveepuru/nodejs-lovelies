var http = new XMLHttpRequest();
var anchors = document.getElementsByClassName('DEL');

for(var i = 0; i < anchors.length; i++) {
  anchors[i].addEventListener("click", function(e) {
    e.preventDefault();
    http.open("DELETE", e.currentTarget.href, true);
    http.send();
    window.location.reload();
  });
}

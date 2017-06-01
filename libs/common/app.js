//app
//ios
//主要解决ios下无法修改title的问题
function changeTitle(title){
  var body = document.getElementsByTagName('body')[0];
  document.title = title;
  var iframe = document.createElement("iframe");
  iframe.style.display="none";
  iframe.setAttribute("src", "/images/blank.gif");
  var d = function() {
    setTimeout(function() {
      iframe.removeEventListener('load', d);
      document.body.removeChild(iframe);
    }, 0);
  };
  iframe.addEventListener('load', d);
  document.body.appendChild(iframe);
}

module.exports = {
  changeTitle
}

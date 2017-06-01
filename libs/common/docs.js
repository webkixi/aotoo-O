var currentStyle = function(element){
  return element.currentStyle || document.defaultView.getComputedStyle(element, null);
}

//获取元素的实际absolute位置
//上下左右
function getOffset(el){
  if (!el) return
  if(el===window||el===document) return DocmentView()
  var parent
  , pbox
	, box = el.getBoundingClientRect()
  , doc = el.ownerDocument
  , body = doc.body
  , docElement = doc.documentElement
  // for ie
  , clientTop = docElement.clientTop || body.clientTop || 0
  , clientLeft = docElement.clientLeft || body.clientLeft || 0
  // In Internet Explorer 7 getBoundingClientRect property is treated as physical,
  // while others are logical. Make all logical, like in IE8.
  , zoom = 1;

  if (body.getBoundingClientRect) {
    var bound = body.getBoundingClientRect();
    zoom = (bound.right - bound.left)/body.clientWidth;
  }

  if (zoom > 1){
    clientTop = 0;
    clientLeft = 0;
  }

  var node = el.parentNode;
  while(currentStyle(node).position != 'relative' && node.nodeName != 'BODY'){
    node = node.parentNode;
  }

  parent = node;
  pbox = parent.getBoundingClientRect();
  var ptop = pbox.top/zoom + (window.pageYOffset || docElement && docElement.scrollTop/zoom || body.scrollTop/zoom) - clientTop,
      pleft = pbox.left/zoom + (window.pageXOffset|| docElement && docElement.scrollLeft/zoom || body.scrollLeft/zoom) - clientLeft;

  var top = box.top/zoom + (window.pageYOffset || docElement && docElement.scrollTop/zoom || body.scrollTop/zoom) - clientTop,
      left = box.left/zoom + (window.pageXOffset|| docElement && docElement.scrollLeft/zoom || body.scrollLeft/zoom) - clientLeft;

  top  = parent ? (top-ptop) : top;
  left = parent ? (left-pleft) : left;
  top  = top - parseInt(currentStyle(el).paddingTop)

  var diff_height = box.bottom-box.top,
      diff_width = box.right - box.left,
      bottom = top + diff_height,
      right = left + diff_width;

  return {
    top: top,
    left: left,
    bottom: bottom,
    right: right,
    width: diff_width,
    height: diff_height
  }
}

function scrollView(ele){
  if (!ele) ele = window;
  if (ele===window){
    var top  = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0,
      left = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0,
      height = document.documentElement.scrollHeight || document.body.scrollHeight || 0,
      width = document.documentElement.scrollWidth || document.body.scrollWidth || 0;
    return {
      top: top,
      left: left,
      width: width,
      height: height
    }
  }
  else{
    var _ele = typeof ele==='string'
    ? document.getElementById(ele)
    : ele.nodeType
      ? ele
      : false
    if (_ele){
      return {
        top: _ele.scrollTop,
        left: _ele.scrollleft,
        width: _ele.scrollWidth,
        height: _ele.scrollHeight
      }
    }
  }
}

//获取当前窗口的宽高及scrollheight及scrollleft
//兼容写法
function DocmentView(){
  var doch = window.innerHeight||document.documentElement.offsetHeight||document.body.clientHieght,
    docw = window.innerWidth||document.documentElement.offsetWidth||document.body.clientWidth,
    docST = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0,
    docSL = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0

  return {top:docST,left:docSL,width:docw,height:doch,scrollTop:docST,scrollLeft:docSL};
};

var _IE = (function(){
  var v = 3, div = document.createElement('div'), all = div.getElementsByTagName('i');
  while (
    div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
    all[0]
  )
  return v > 4 ? v : false ;
}())


//获取clipboard数据
function getClipboardText(event) {
  event = event||window.event
  var clipboardData = (event.clipboardData || window.clipboardData);
  return clipboardData.getData("text");
}

function setClipboardText(event, value) {
  event = event||window.event
  if (event.clipboardData) {
    return event.clipboardData.setData("text/plain", value);
  }
  else
  if (window.clipboardData) {
    return window.clipboardData.setData("text", value);
  }
}

/**
 * 插入文本到光标出
 * @win {window} 页面的window对象，或者iframe.contentWindow对象
 * @html {String} 插入的文本
 */
function insertHtmlAtCaret(win,html) {
  var sel, range;
  var doc = win.document

  if (win.getSelection) {
    // IE9 and non-IE
    sel = win.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
      range = sel.getRangeAt(0);
      range.deleteContents();
      // Range.createContextualFragment() would be useful here but is
      // non-standard and not supported in all browsers (IE9, for one)
      var el = doc.createElement("div");
      el.innerHTML = html;
      var frag = doc.createDocumentFragment(), node, lastNode;
      while ( (node = el.firstChild) ) {
        lastNode = frag.appendChild(node);
      }
      range.insertNode(frag);
      // Preserve the selection
      if (lastNode) {
        range = range.cloneRange();
        range.setStartAfter(lastNode);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  } else if (document.selection && document.selection.type != "Control") {
    // IE < 9
    document.selection.createRange().pasteHTML(html);
  }
}


// mq-mobile = "screen and (max-width: 479px)"
// mq-tablet = "screen and (min-width: 480px) and (max-width: 767px)"
// mq-iPhones4 = "only screen and (min-device-width: 320px) and (max-device-width: 480px) and (-webkit-min-device-pixel-ratio: 2)"
// mq-normal = "screen and (min-width: 768px)"
function mediaQuery(opts){
  var view = DocmentView()
  if (view.width<=480) {
    return typeof opts.mobile == 'function' ? opts.mobile() : ''
  }
  if (view.width>480 && view.width<=1024) {
    return typeof opts.tablet == 'function'
    ? opts.tablet()
    : typeof opts.pc == 'function'
      ? opts.pc()
      : ''
  }
  if (view.width>1024) {
    return typeof opts.pc == 'function' ? opts.pc() : ''
  }
}

/**
 * @description  操作系统检查结果。
 *
 * * `android`  如果在android浏览器环境下，此值为对应的android版本号，否则为`undefined`。
 * * `ios` 如果在ios浏览器环境下，此值为对应的ios版本号，否则为`undefined`。
 * @property {Object} [os]
 */
var os = (function( ua ) {
  var ret = {},
  // osx = !!ua.match( /\(Macintosh\; Intel / ),
  android = ua.match( /(?:Android);?[\s\/]+([\d.]+)?/ ),
  ios = ua.match( /(?:iPad|iPod|iPhone).*OS\s([\d_]+)/ );

  // osx && (ret.osx = true);
  android && (ret.android = parseFloat( android[ 1 ] ));
  ios && (ret.ios = parseFloat( ios[ 1 ].replace( /_/g, '.' ) ));

  ret.mobile = (() => !!(android||ios))()
  return ret;
})( navigator.userAgent )

module.exports = {
  currentStyle,
  docmentView: DocmentView,
  scrollView: scrollView,
  getOffset: getOffset,
  mediaQuery: mediaQuery,
  ie: _IE,
  os: os,
  getClipboardText: getClipboardText,
  setClipboardText: setClipboardText,
  insertCaret: insertHtmlAtCaret,
}

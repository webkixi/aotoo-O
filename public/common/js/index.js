isClient = ( function(){ return typeof window !== 'undefined' })()
function noop(){}
var React    = require('react')
var ReactDom = require('react-dom')
var SAX      = require('fkp-sax')
var _        = require('lodash')
var $        = isClient ? require('jquery') : noop


React.render = ReactDOM.render;
React.unmountComponentAtNode = ReactDOM.unmountComponentAtNode;
React.findDOMNode = ReactDOM.findDOMNode;

var fkp = {
  react: React,
  reactDom: ReactDom,
  sax: SAX,
  _: _,
  $: $
}
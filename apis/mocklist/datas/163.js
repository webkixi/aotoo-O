// mock数据模板

let content = [{
  aaa: "{{=string}}",
  bbb: "{{=string20}}",
  ccc: "{{=string10}}",
  ddd: "{{=string10}}",
  eee: "{{=string30}}",
  fff: [
    "{{=string}}",
    "{{=string}}",
    "{{=string}}"
  ]
}]

module.exports = function(){
  return JSON.stringify(content)
}

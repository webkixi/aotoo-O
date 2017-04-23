import React from 'react'
import ReactDom from 'react-dom'
import list from 'component/list'
console.log('==== hello/index');
const List = list()
console.log($aot);
ReactDom.render(List, document.getElementById('test'))

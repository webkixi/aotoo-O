import React from 'react'

const listStyle = require('./css/index.styl')

export default function list(){
  return <div className={'list '+listStyle.xyz+' '+listStyle.xxx}>1234</div>
}

export function pure(){
  return list()
}

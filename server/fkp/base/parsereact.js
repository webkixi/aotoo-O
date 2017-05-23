let path = require('path')

function index(fkp, reacturl, opt){
  try {
		let Component;
		let props = opt || {};
		if (typeof reacturl==='string'){
			let _rct = require(reacturl);
			if (_rct.pure) Component = _rct.pure(props)
		}
		let reactHtml = ReactDomServer.renderToString(Component)
		return [reactHtml]
	} catch (e) {
		console.log(e);
	}
}

export default function(fkp){
  return index
}

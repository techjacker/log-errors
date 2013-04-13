/*jslint nomen: true, plusplus: false, sloppy: true, white:true*/
/*jshint nomen: false, curly: true, plusplus: false, expr:true, undef:true, newcap:true, latedef:true, camelcase:true  */
/*global module: false, iScroll:false, setTimeout: false, document:false, WebKitCSSMatrix:false, _: false, Backbone: false, backbone: false, $: false, define: false, require: false, console: false, window:false */

var _ = require('underscore');
var util = require('util');

var colors = {
	red   : '\033[31m',
	blue  : '\033[34m',
	reset : '\033[0m'
};

var unescapeStr = function (data) {
	console.log.apply(this, data.map(function (d) {
		return "\n" + d.replace(/\\n/ig, '\\\n').replace(/\\/ig, '') + "\n";
	}));
	return data;
};
var title = function (data, color) {
	return (this.env === 'development') ? ((colors[color] || '') + data + colors.reset) : data;
	// return (this.env === 'production') ? data : (colors[color] || '') + data + colors.reset;
};

// to do: make titles blue color
var printError = function (err, req) {

	var reqInfo = '',
		devEnv = !!(this.env === 'development'),
		data = (!devEnv) ? [title('Error name: ' + (err.name || err.message), 'red')] : [] ;
		// data = (devEnv) ? [title('Error name: ' + (err.name || err.message), 'red')] : [] ;

	// inspect the request
	if (_.isObject(req)) {
		if (req && req.url) 	{ reqInfo += 'url: ' + req.url; }
		if (reqInfo) 			{ reqInfo += '\n'; }
		if (req && req.query) 	{ reqInfo += 'query: ' + util.inspect(req.query, true, 2, devEnv); }
		if (reqInfo) 			{
			data.push(title('Request:', 'blue'));
			data.push(reqInfo);
		}
	}

	// inspect the error
	data.push(title('Error object:', 'blue'));
	data.push(util.inspect(err, true, 2, devEnv));

	// stack trace
	data.push(title('Stack trace:', 'blue'));
	data.push(util.inspect(err.stack, true, 2, devEnv));

	return unescapeStr(data);
};

module.exports = printError;
/*jslint nomen: true, plusplus: false, sloppy: true, white:true*/
/*jshint nomen: false, curly: true, plusplus: false, expr:true, undef:true, newcap:true, latedef:true, camelcase:true  */
/*global module: false, iScroll:false, setTimeout: false, document:false, WebKitCSSMatrix:false, _: false, Backbone: false, backbone: false, $: false, define: false, require: false, console: false, window:false */

var	_    = require('underscore');

var errResponse = function (err, res) {
	// if passed response object then return the appropriate response
	if (err && res && _.isFunction(res.send)) {
		res.send(err && err.resCode || 500, {
			error: err && err.name || "Error"
		});
	}
};

module.exports = errResponse;
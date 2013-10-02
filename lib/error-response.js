/*jslint nomen: true, plusplus: false, sloppy: true, white:true*/
/*jshint nomen: false, curly: true, plusplus: false, expr:true, undef:true, newcap:true, latedef:true, camelcase:true  */
/*global module: false, iScroll:false, setTimeout: false, document:false, WebKitCSSMatrix:false, _: false, Backbone: false, backbone: false, $: false, define: false, require: false, console: false, window:false */

var	_    = require('underscore');

var errResponse = function (err, res) {

	var payload = {error: err && err.name || "Error"},
		errResCode = err && err.resCode || 500,
		resCode = (this.jsonP === true) ? 200 : err && err.resCode || 500;

	if (err && res) {
		(this.jsonP === true) && (payload.resCode = errResCode);
		(this.jsonP === true) ? _.isFunction(res.jsonp) && res.jsonp(resCode, payload) : _.isFunction(res.send) && res.send(resCode, payload);
	}
};

module.exports = errResponse;
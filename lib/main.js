/*jslint nomen: true, plusplus: false, sloppy: true, white:true*/
/*jshint nomen: false, curly: true, plusplus: false, expr:true, undef:true, newcap:true, latedef:true, camelcase:true  */
/*global module: false, iScroll:false, setTimeout: false, document:false, WebKitCSSMatrix:false, _: false, Backbone: false, backbone: false, $: false, define: false, require: false, console: false, window:false */

var productionLogging   = require('./production'),
	devLogging			= require('./development'),
	printError			= require('./print-error'),
	errResponse			= require('./error-response'),
    _                   = require('underscore');

var LogClass = function (env) {
    this.env = env;
	_(this).bindAll('errResponse', 'printError', 'productionLogging', 'devLogging', 'log');
};

LogClass.prototype.errResponse       = errResponse;
LogClass.prototype.printError        = printError;
LogClass.prototype.productionLogging = productionLogging;
LogClass.prototype.devLogging        = devLogging;

LogClass.prototype.log = function (err, req, res, next) {

	if (err) {

		// log the error
		if (this.env === 'production') {
			this.productionLogging(err, req, res, next);
		} else {
			this.devLogging(err, req, res, next);
		}

		// send response to browser
		if (res) {
			this.errResponse(err, res);
		}

	} else {
		_.isFunction(next) && next();
	}

	// always return the error
	return err;
};

module.exports = {
	LogClass: LogClass,
	production: (new LogClass('production')).log,
	development: (new LogClass('development')).log
	// production: new LogClass('production'),
	// development: new LogClass('development')
};
/*jslint nomen: true, plusplus: false, sloppy: true, white:true*/
/*jshint nomen: false, curly: true, plusplus: false, expr:true, undef:true, newcap:true, latedef:true, camelcase:true  */
/*global module: false, iScroll:false, setTimeout: false, document:false, WebKitCSSMatrix:false, _: false, Backbone: false, backbone: false, $: false, define: false, require: false, console: false, window:false */

var Log             = require('log'), // visionmedia logger
	util            = require('util'),
	_               = require('underscore'),
	printError		= require('./print-error');

// use visionmedia's logger to write to main app logfile
var productionLogging = function (err, req) {

	var appErrorHandler	= this.app && _.isFunction(this.app.emit),
    	allowedLevels 	= ['emergency', 'alert', 'critical', 'error', 'warning', 'notice', 'info', 'debug'],
		seriousErrors	= ['emergency', 'alert', 'critical', 'error'],
		// default to 'error' log level: native Error Class errors
		// (as these will be uncaught exceptions which are definitely serious errors)
		allowed			= (allowedLevels.indexOf(err.logLevel) !== -1),
		// default to 'error' log level: native Error Class errors
		// (as these will be uncaught exceptions which are definitely serious errors)
		logLevel		= (allowed) ? err.logLevel : 'error', // default to 'debug' log level
		serious			= (seriousErrors.indexOf(logLevel) !== -1),
		printErr		= (_.isFunction(this.printError) && this.printError) || printError,
		errMsgArray;

	// only log serious errors to reduce noise in logfiles
	if (serious) {

		// use visionmedia logger to create heading
		// then use own logger to print extra error + request info
		(new Log(logLevel))[logLevel](err.name + ': ' + err.message)
		errMsgArray = printErr(err, req);

		// trigger app exit routine unless error instructs NOT to
		if (!err.doNotKill) {
			appErrorHandler && this.app.emit('seriousError');
		}
		return errMsgArray;
	}
};

module.exports = productionLogging;
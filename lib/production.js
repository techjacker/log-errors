/*jslint nomen: true, plusplus: false, sloppy: true, white:true*/
/*jshint nomen: false, curly: true, plusplus: false, expr:true, undef:true, newcap:true, latedef:true, camelcase:true  */
/*global module: false, iScroll:false, setTimeout: false, document:false, WebKitCSSMatrix:false, _: false, Backbone: false, backbone: false, $: false, define: false, require: false, console: false, window:false */

var Log             = require('log'), // visionmedia logger
	util            = require('util'),
	_               = require('underscore'),
	printError		= require('./print-error');

// use visionmedia's logger to write to main app logfile
var productionLogging = function (err, req) {

    var allowedLevels 	= ['emergency', 'alert', 'critical', 'error', 'warning', 'notice', 'info', 'debug'],
		seriousErrors	= ['emergency', 'alert', 'critical', 'error'],
		allowed			= (allowedLevels.indexOf(err.logLevel) !== -1),
		serious			= (seriousErrors.indexOf(err.logLevel) !== -1),
		logLevel		= (allowed) ? err.logLevel : 'debug', // default to 'debug' log level
		printErr		= (_.isFunction(this.printError) && this.printError) || printError,
		log;

	// only log serious errors to reduce noise in logfiles
	if (serious) {

		// use visionmedia logger to create heading
		log = new Log(logLevel);
		log[logLevel](err.name + ': ' + err.message)

		// then use own logger to print extra error + request info
		return printErr(err, req);
	}
};

// productionLogging(new Error('errr'));


module.exports = productionLogging;
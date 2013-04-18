/*jslint nomen: true, plusplus: false, sloppy: true, white:true*/
/*jshint nomen: false, curly: true, plusplus: false, expr:true, undef:true, newcap:true, latedef:true, camelcase:true  */
/*global module: false, iScroll:false, setTimeout: false, document:false, WebKitCSSMatrix:false, _: false, Backbone: false, backbone: false, $: false, define: false, require: false, console: false, window:false */

var test		 = require('tap').test,
	eventEmitter = require('events').EventEmitter,
	_			 = require('underscore'),
	production	 = require('./../lib/production');

test('production logger only logs error levels of 3 (error) and above', function(t) {

	t.plan(8);

	var baseError = new Error('msg');

	this.app = new eventEmitter();
	this.app.on('seriousError', function() {
		t.ok(this.app._events.seriousError, 'app event being emitted');
	}.bind(this));

	// minor errors are NOT logged
	// t.ok(production(baseError), 'prod logger default log level is "error" > DOES not log errors');
	t.ok(production.call(this, baseError), 'prod logger default log level is "error" > DOES not log errors');

	// serious errors are logged
	baseError.logLevel = 'emergency';
	t.ok(_.isArray(production.call(this, baseError)), 'prod logger does log "emergency" log level errors');

	baseError.logLevel = 'error';
	t.ok(_.isArray(production.call(this, baseError)), 'prod logger does log "error" log level errors');

	// errors with doNotKill flag do not trigger 'seriousError' evt
	// but ARE logged
	baseError.doNotKill = true;
	t.ok(_.isArray(production.call(this, baseError)), 'prod logger does log "error" log level errors');

	// minor errors are NOT logged
	baseError.doNotKill = undefined;
	baseError.logLevel = 'info';
	t.notOk(production.call(this, baseError), 'prod logger does not log "info" log level errors');
});

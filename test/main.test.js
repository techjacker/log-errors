/*jslint nomen: true, plusplus: false, sloppy: true, white:true*/
/*jshint nomen: false, curly: true, plusplus: false, expr:true, undef:true, newcap:true, latedef:true, camelcase:true  */
/*global module: false, iScroll:false, setTimeout: false, document:false, WebKitCSSMatrix:false, _: false, Backbone: false, backbone: false, $: false, define: false, require: false, console: false, window:false */

var test = require('tap').test,
	main = require('./../lib/main'),
	LogClass = main.LogClass,
	prodLogger = main.production,
	devLogger = main.development;


test('logger shd always return the error', function(t) {

	var randomError = {random: "randomness"};

	t.equal(prodLogger(randomError), randomError, 'prod logger shd always return the error');
	t.equal(devLogger(randomError), randomError, 'dev logger shd always return the error');

	t.end();
});

test('next shd be called if it is a function and there is no error', function(t) {

	t.plan(2);

	var	next = function () {
		t.ok(true, 'next is called if err is null');
	};

	prodLogger(null, null, null, next);
	devLogger(null, null, null, next);
});


test('environments are set correctly', function(t) {
	t.equal((new LogClass('production')).env, 'production', 'prod logger environment set correctly');
	t.equal((new LogClass('development')).env, 'development', 'dev logger environment set correctly');
	t.end();
});

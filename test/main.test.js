/*jslint nomen: true, plusplus: false, sloppy: true, white:true*/
/*jshint nomen: false, curly: true, plusplus: false, expr:true, undef:true, newcap:true, latedef:true, camelcase:true  */
/*global module: false, iScroll:false, setTimeout: false, document:false, WebKitCSSMatrix:false, _: false, Backbone: false, backbone: false, $: false, define: false, require: false, console: false, window:false */

var test = require('tap').test,
	main = require('./../lib/main'),
	LogClass = main.LogClass,
	prodLogger = main.production,
	devLogger = main.development;


test('logger shd always return the error', function(t) {

    var randomError = new Error("randomness"),
        prodErr     = prodLogger(randomError),
        devErr      = devLogger(randomError);

	t.ok(prodErr instanceof Error, 'prod logger shd always return the error');
	t.ok(devErr instanceof Error, 'dev logger shd always return the error');
	t.ok(devErr.logged, 'dev error shd have logged attribute added to it after it has been logged');
	t.ok(prodErr.logged, 'prod error shd have logged attribute added to it after it has been logged');

	t.end();
});

test('next shd be called if it is a function and there is no error', function(t) {

	t.plan(4);

	var	nextNoErr = function () {
			t.ok(true, 'next is called if it is a fn and err is null');
		},
		nextErrLogged = function () {
			t.ok(true, 'next is called if it is a fn and err has already been logged');
		};

	// no error
	prodLogger(null, null, null, nextNoErr);
	devLogger(null, null, null, nextNoErr);

	// error already logged
	prodLogger({logged:true}, null, null, nextErrLogged);
	devLogger({logged:true}, null, null, nextErrLogged);
});


test('environments are set correctly', function(t) {
	t.equal((new LogClass('production')).env, 'production', 'prod logger environment set correctly');
	t.equal((new LogClass('development')).env, 'development', 'dev logger environment set correctly');
	t.end();
});

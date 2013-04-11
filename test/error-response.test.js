/*jslint nomen: true, plusplus: false, sloppy: true, white:true*/
/*jshint nomen: false, curly: true, plusplus: false, expr:true, undef:true, newcap:true, latedef:true, camelcase:true  */
/*global module: false, iScroll:false, setTimeout: false, document:false, WebKitCSSMatrix:false, _: false, Backbone: false, backbone: false, $: false, define: false, require: false, console: false, window:false */

var test = require('tap').test,
	errorResponse = require('./../lib/error-response');


test('errorResponse bad input test', function (t) {

	t.doesNotThrow(function () { errorResponse(null, 'rubbish'); }, 'errorResponse shd handle bad input gracefully');
	t.end();
});

test('errorResponse sends correct response', function (t) {

	t.plan(4);

	var defaultResponse = {
			send: function (resCode, body) {
				t.equal(resCode, 500, 'default response code is correct');
				t.equal(body.error, "Error", 'default body is correct');
			}
		},
		myError = {
			resCode: 402,
			name: 'weirdError'
		},
		customResponse = {
			send: function (resCode, body) {
				t.equal(resCode, myError.resCode, 'custom response code is correct');
				t.equal(body.error, myError.name, 'custom body is correct');
			}
		};

	errorResponse(new Error('not what i was hoping for'), defaultResponse);
	// errorResponse({something: 'not what i was hoping for'}, defaultResponse);
	errorResponse(myError, customResponse);
});

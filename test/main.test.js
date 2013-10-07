var test = require('tap').test,
	main = require('./../lib/main'),
	LogClass = main.LogClass,
	prodLogger = main.production,
	prodLoggerJsonP = main.productionJsonP,
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
		response = {
			send: function () {
				t.ok(true, 'next is called if it is a fn and err has already been logged');
			},
			jsonP: function () {
				t.ok(true, 'next is called if it is a fn and err has already been logged');
			}
		};

	// no error
	prodLogger(null, null, null, nextNoErr);
	devLogger(null, null, null, nextNoErr);

	// error already logged
	prodLogger({logged:true}, null, response, null);
	devLogger({logged:true}, null, response, null);
});


test('constructor sets class attrs', function(t) {
	var app = {something: "else"};
	t.equal((new LogClass({"env": 'production'})).env, 'production', 'prod logger environment set correctly');
	t.equal((new LogClass({"env": 'development'})).env, 'development', 'dev logger environment set correctly');
	t.equal((new LogClass({"env": 'development', "app": app})).app, app, 'app attr set correctly in dev');
	t.equal((new LogClass({"env": 'production', "app": app})).app, app, 'app attr set correctly in prod');
	t.end();
});



/*--------------------------------------
jsonP tests
---------------------------------------*/
test('handle jsonP', function(t) {

	t.plan(2);
	var errInput = {
		resCode: 402,
		name: 'weirdError'
	},
	payloadExpected = {
		resCode: errInput.resCode,
		error: errInput.name
	},
	responseObj = {
		jsonp: function (resCode, payload) {
			t.deepEqual(payload, payloadExpected, 'error object returned');
			t.equal(resCode, 200, 'returns 200 response code');
			t.end();
		}
	};

	prodLoggerJsonP(errInput, {}, responseObj);

});
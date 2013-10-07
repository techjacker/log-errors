var productionLogging   = require('./production'),
	devLogging			= require('./development'),
	printError			= require('./print-error'),
	errResponse			= require('./error-response'),
	_                   = require('underscore');

// var LogClass = function (env, app) {
var LogClass = function (opts) {
	this.env = opts.env;
	this.app = opts.app;
	this.jsonP = opts.jsonP;
	_(this).bindAll('errResponse', 'printError', 'productionLogging', 'devLogging', 'log');
};

LogClass.prototype.errResponse       = errResponse;
LogClass.prototype.printError        = printError;
LogClass.prototype.productionLogging = productionLogging;
LogClass.prototype.devLogging        = devLogging;

LogClass.prototype.log = function (err, req, res, next) {

	if (err) {

		if (err.logged !== true) {

			// update logged attribute so don't log same error twice
			err.logged = true;

			// log the error
			if (this.env === 'production') {
				this.productionLogging(err, req, res, next);
			} else {
				this.devLogging(err, req, res, next);
			}
		}

		// send response to browser
		if (res) {
			this.errResponse(err, res);
		}

	} else {
		_.isFunction(next) && next();
	}

	return err;
};

module.exports = {
	LogClass: LogClass,
	production: (new LogClass({env: 'production'})).log,
	development: (new LogClass({env: 'development'})).log,
	productionJsonP: (new LogClass({env: 'production', jsonP: true})).log,
	developmentJsonP: (new LogClass({env: 'development', jsonP: true})).log
};
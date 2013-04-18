# Log Errors

[![Build Status](https://secure.travis-ci.org/techjacker/log-errors.png)](http://travis-ci.org/techjacker/log-errors)

- logs errors based on environment
    - development gets full color-coded errors
    - production error logs use syslog error headings so they will be picked up by logwatch et al
    - production only logs serious errors (level 3 and below) to reduce noise
- request attrs logged if passed request object
- response returned if passed response object

## Quickstart

```JavaScript
var	logErrors 	= require('log-errors'),
	logProd 	= logErrors.production,
	logDev 		= logErrors.development;

try {
	throw new error("funky");
} catch (e) {
	logDev(e);
}
```

This will output in colored text:

```Shell
Error name: Error

Error object:

{  	Error: 		funky,
   	message: 	'funky',
   	type: 		undefined,
   	stack:  	Getter/Setter,
   	arguments: 	undefined }

Stack trace:

'Error: funky
    at Object.<anonymous> (/home/andy/lib/modules/npm/log-errors/lib/development.js:16:12)
    at Module._compile (module.js:449:26)
    at Object.Module._extensions..js (module.js:467:10)
    at Module.load (module.js:356:32)
    at Function.Module._load (module.js:312:12)
    at Module.runMain (module.js:492:10)
    at process.startup.processNextTick.process._tickCallback (node.js:244:9)'
```

### Using in Express.js

It will also log request url + query info.

```JavaScript
var	logErrors 	= require('log-errors'),
	logProd 	= logErrors.production,
	logDev 		= logErrors.development;


// add this at very bottom (below all route handlers)
// it is designed to catch the errors passed by next(err) calls

app.configure('production', function() {
	app.use(logProd);
});

app.configure('development', function() {
	app.use(logDev);
	// equates to:
	// app.use(function(err, req, res, next) {
		// logDev(err, req, res, next);
	// });
});
```

Example Output:

```Shell
Error name: Error

Request:

url: someurl
query: ?some=random&query=params

Error object:

{  	Error: 		funky,
   	message: 	'funky',
   	type: 		undefined,
   	stack:  	Getter/Setter,
   	arguments: 	undefined }

Stack trace:

'Error: funky
    at Object.<anonymous> (/home/andy/lib/modules/npm/log-errors/lib/development.js:16:12)
    at Module._compile (module.js:449:26)
    at Object.Module._extensions..js (module.js:467:10)
    at Module.load (module.js:356:32)
    at Function.Module._load (module.js:312:12)
    at Module.runMain (module.js:492:10)
    at process.startup.processNextTick.process._tickCallback (node.js:244:9)'
```

## Docs

#### Info printed to STDOUT
1. error name: (err.name)
2. error message (err.message)
3. error logLevel (err.logLevel)
4. error responseCode (err.resCode)
5. request url (req.url)
6. request query (req.query)


#### HTTP Response

If passed a response object then the logger will return this with the response code specified in the error (err.resCode). It defaults to sending a 500 server error with the body {error: 'Error'}.

```JavaScript
var logErrors   = require('log-errors'),
    logDev      = logErrors.development;

  // will call res.send(403, {"error":"random"})
  logDev({resCode:403, name:"random"}, req, res);
```


#### Log Levels
- Must be one of the 8 unix log levels used in the [Visionmedia Logging Module](https://github.com/visionmedia/log.js).
- Defaults to 'info' level if not passed one of the 8 listed.


### Base Log Class
- Production and development loggers inherit from this.
- If app is an eventEmitter then the 'seriousError' evt will be prodcast when using the productionLogger.

```JavaScript
var LogClass = function (env, app) {
    this.env = env;
    this.app = app;
};
```


### Development Logger
- Always prints full error in colored text.

```JavaScript
var logDev 	= require('log-errors').development;
logDev(new Error('development error msg'));
```

### Production Logger
- Will only print error info if error.LogLevel is 3 or below, ie ['error', 'critical', 'alert', 'emergency']

```JavaScript
var logProd = require('log-errors').production,
    err     = newError('some message about the error');

err.logLevel = 'critical'
logProd(err);
```


#### 'seriousError' Evt
- If error.LogLevel is 3 or below and this.app is an eventEmitter then the 'seriousError' evt will be prodcast when using the productionLogger.
- It will NOT be broadcast if the error.doNotKill is truthy

```JavaScript
    if (!err.doNotKill) {
      appErrorHandler && this.app.emit('seriousError');
    }
```


## Using in Conjunction with [Custom Errors npm Module](https://github.com/techjacker/custom-errors)

- If your errors inherit from the custom [errors class](https://github.com/techjacker/custom-errors) then the extra error attrs (logLevel, name, message etc) are already added.
- However, the logger should work fine with the built in base error class too.

```JavaScript
var valErr 		= require('custom-errors').general.ValidationError,
	logErrors 	= require('log-errors'),
	logProd 	= logErrors.production,
	logDev 		= logErrors.development;

try {
	throw new valErr("funky");
} catch (e) {
	logDev(e);
}
```

Outputs:

```Shell
Error name: Validation

Error object:

{ logLevel: 'warn',
  message: 'funky',
  name: 'Validation',
  resCode: 400,
  [stack]: [Getter/Setter] }

Stack trace:

'Validation: funky
    at Object.<anonymous> (/home/andy/lib/modules/npm/log-errors/lib/development.js:18:12)
    at Module._compile (module.js:449:26)
    at Object.Module._extensions..js (module.js:467:10)
    at Module.load (module.js:356:32)
    at Function.Module._load (module.js:312:12)
    at Module.runMain (module.js:492:10)
    at process.startup.processNextTick.process._tickCallback (node.js:244:9)'
```
var path = require('path');
var express = require('express');

var server = express()
	.use(express.static(__dirname + '/www'))
	.use(express.static(__dirname + '/bower_components'))

var port = process.env.PORT || 3000;
server.listen(port);
console.log(__filename + ' is now listening on port ' + port);


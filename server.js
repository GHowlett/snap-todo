var path = require('path');
var express = require('express');

var server = express()
	.use(express.static(__dirname + '/www'))

var port = process.env.PORT || 3000;
server.listen(port);
console.log(__filename + ' is now listening on port ' + port);


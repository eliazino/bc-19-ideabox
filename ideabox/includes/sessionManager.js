var express = require('express');
var cookieParser = require('cookie-parser');

var app = express();
app.use(cookieParser());
class userManager{
	function setCookie(){
     	res.cookie(name , 'eliazino', value: '15877jhjh', {expire : new Date() + 9999});
     	return true;
	}
}

module.exports = setCookie;
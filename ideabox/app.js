// load the things we need
var express = require('express');
var session = require('express-session');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var querystring = require('querystring');
var conConfig = require('./includes/config');
var app = express();
var messenger = require('./includes/messenger');
var sha1 = require('sha1');
//var userManager = require('./includes/userManager');
app.use(express.static(__dirname + '/public'));
// set the view engine to ejs
app.set('view engine', 'ejs');
app.set("views","./views");
// use res.render to load up an ejs view file
app.use(session({secret: 'falppyBirdaCarionEater', saveUninitialized: true,
                 resave: true}));
app.use(bodyParser.urlencoded({ extended: true }));
var connection = mysql.createPool(conConfig);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
function checkuser(user){
	var counter = connection.getConnection(function(err, rows) {
			var sql = 'SELECT * FROM user where username = '+connection.escape(user);
  			connection.query( sql, function(err, rows) {
  				if(err){
  					console.log(err);
  				}
  				else{
  					//console.log(rows.length);
  					connection.release();
  					return rows.length;
  				}
  			});
		});
	return counter;
}


// index page 
app.get('/', function(req, res) {
	ses = req.session;
	username = ses.user;
	sessionID = ses.sessionID;
	console.log(username);
	if(username != 'undefined' && sessionID != 'undefined'){
		connection.getConnection(function(err, connection) {
			var sql = 'select*FROM user where username = '+ connection.escape(username);
  			connection.query( sql, function(err, rows) {
  				if(err){
  					console.log(err);
  				}
  				else{
  					if(rows.length > 0){
  						res.render('main/index', {un : username});

  					}
  					else{
  						res.redirect('/login');
  					}
  				}
    		connection.release();
  			});
		});
	}
	else{
		res.redirect('/login');
	}
});


app.get('/index', function(req, res) {
	res.render('main/index', {kai : 'jailer'});
});

app.get('/destroy', function(req, res) {
	req.session.destroy();
	res.render('main/login', {message: messenger.succesM('session has been ended')});
});

app.get('/dashboard', function(req, res) {
	ses = req.session;
	username = ses.user;
	res.render('main/dashboard', {user : username});
	console.log(username);
});


// about page 
app.get('/register', function(req, res) {
	res.render('main/register');
});
app.get('/login', function(req, res) {
	res.render('main/login');
});
app.post('/signum', function(req, res) {
	var username = req.body.username;
	var key = req.body.passkey;
	connection.getConnection(function(err, connection) {
			var pass = sha1(key);
			var m = '';
			var sql = 'select*FROM user where username = '+ connection.escape(username) +' and password ='+ connection.escape(pass);
  			connection.query( sql, function(err, rows) {
  				if(err){
  					console.log(err);
  					m = err;
  				}
  				else{
  					if(rows.length > 0){
  						var sessionID = sha1(Math.floor(Math.random() * 20000000000 - 999999 + 1) + 999999);
  						//res.send(messenger.succesM(username+' is logged in'));
  						var m = "Okay";
  						ses = req.session;
				  		ses.user = username;
				  		console.log(ses.user);
				  		ses.sessionID = sessionID;

  					}
  					else{
  						m = messenger.errorM('Username password combination does not match any valid user')
  					}
  				}
  			res.sendStatus(m);
    		connection.release();
  			});
		});
});



app.post('/register',function(req,res){
	surname = req.body.surname;
	othernames = req.body.othernames;
	address = req.body.address;
	email = req.body.email;
	gender = req.body.gender;
	username = req.body.username;
	pass1 = req.body.pass1;
	pass2 = req.body.pass2;
	agree = req.body.agree;
	//console.log(checkuser(username));
	if(pass2 !== pass1 || pass1.length < 6){
		res.render('main/register',{error_message: messenger.errorM('Password field is incorrect. at least 6 characters expected and passwords must match') });
		
	}
	else if(surname.length < 3 || othernames.length < 3 || address.length < 5 || username.length < 5){
		res.render('main/register',{error_message: messenger.errorM('Please verify that all fields are entered correctly') });
	}
	else if(agree !== "agree"){
		res.render('main/register',{error_message: messenger.errorM('You must agree to our terms and condition') });
	}
	else{
		connection.getConnection(function(err, rows) {
			var sql = 'SELECT * FROM user where username = '+connection.escape(username);
  			connection.query( sql, function(err, rows) {
  				if(err){
  					console.log(err);
  				}
  				else{
  					//console.log(r
  					if (rows.length > 0 ){
  						//connection.release();
  						res.render('main/register',{error_message: messenger.errorM('The username exists') });
  					}
  					else{
  						connection.getConnection(function(err, connection) {
							var pass = sha1(pass1);
							var sessionID = sha1(Math.floor(Math.random() * 20000000000 - 999999 + 1) + 999999);
							var sql = 'insert into user (surname, firstname,username,password,email,gender, session_id) values (' + connection.escape(surname)
								+','+ connection.escape(othernames) +','+ connection.escape(username)
								+','+ connection.escape(pass) +','+ connection.escape(email) +','+ connection.escape(gender)
								+','+ connection.escape(sessionID) +')';
				  			connection.query( sql, function(err, rows) {
				  				if(err){
				  					console.log(err);
				  				}
				  				else{
				  					ses = req.session;
				  					ses.user = username;
				  					console.log(ses.user);
				  					ses.sessionID = sessionID;
				  					res.redirect('/dashboard');
				  				}
				    		connection.release();
				  			});
					});
  					}
  				}
  			});
		});
		/*connection.getConnection(function(err, connection) {
			var pass = sha1(pass1);
			var sql = 'insert into user (surname, firstname,username,password,email,gender) values (' + connection.escape(surname)
				+','+ connection.escape(othernames) +','+ connection.escape(username)
				+','+ connection.escape(pass) +','+ connection.escape(email) +','+ connection.escape(gender) +')';
  			connection.query( sql, function(err, rows) {
  				if(err){
  					console.log(err);
  				}
  				else{
  				}
    		connection.release();
  			});
		});*/
	}         
})




app.listen(3000);
console.log('3000 is the magic port');
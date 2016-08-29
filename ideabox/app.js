// load the things we need
var express = require('express');
var session = require('express-session');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var marked = require('marked');
var conConfig = require('./includes/config');
var app = express();
var messenger = require('./includes/messenger');
var sha1 = require('sha1');
app.use(express.static(__dirname + '/public'));
// set the view engine to ejs
app.set('view engine', 'ejs');
app.set("views","./views");

/*
*
*Initializing session parameter
*
*/
app.use(session({secret: 'falppyBirdaCarionEater', saveUninitialized: true,
                 resave: true}));
/*
*
*bodyParser helps us retrieve parameters
*
*/
app.use(bodyParser.urlencoded({ extended: true }));

/*
*
*Connection to MySQL initialized here
*
*/
var connection = mysql.createPool(conConfig);

/*
*
*This function helps form a MySQL query (Used later)
*
*/                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
function stringQ(cards){
	if(cards === ''){
		return '';
	}
	else{
		fcard = cards.split(',');
		start = 0;
		gstr = '';
		while (start < fcard.length){
			if(start !== fcard.length - 1){
				gstr = gstr+ 'cards = '+fcard[start]+' or ';
			}
			else{
				gstr = gstr+ 'cards = '+fcard[start];
			}
			start++;
		}
		return gstr;
	}
}

/*
*
*Route every 404 error to error page
*
*/


app.use(function(req, res, next){
  // the status option, or res.statusCode = 404
  // are equivalent, however with the option we
  // get the "status" local available as well
  res.render('main/error', { status: 404, url: req.url });
});

/*
*
*This is the first instance of Index page
*user is able to view, create an idea, it also holds a first hand info about idea cards
*Index page requires that user is signed in, if user isnt signed in, it redirects to login
*
*/
app.get('/', function(req, res) {
	ses = req.session;
	username = ses.user;
	sessionID = ses.sessionID;
	//var dataBundle = [];
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
  						//console.log(rows[0].surname);
  						cardCond = stringQ(rows[0].cards)
  						console.log(cardCond);
  						//dataBundle.push(rows[0]);
  						var sql = '';
  						if (cardCond === ''){
  							var sql1 = 'SELECT surname, firstname,avatar, vote_ups,vote_downs, owner, cominId, details, title, date_posted, up_date, privacy, card, vote_up, vote_down';
  							var sql2 = 'FROM (SELECT surname, vote_ups,vote_downs,avatar, firstname, owner, outId as cominId, details, title, date_posted, up_date, privacy, card';
  							var sql3 = 'FROM (SELECT ideas.id AS outId, details, title, owner, date_posted, up_date, privacy, card, vote_ups,vote_downs';
  							var sql4 = 'FROM ideas LEFT JOIN ideacats ON ideas.cards = ideacats.id WHERE owner =  '+connection.escape(username);
  							var sql5 = 'OR (privacy =1)) AS crap LEFT JOIN user ON crap.owner = user.username)';
							var sql6 = 'AS anoda LEFT JOIN ideavote ON anoda.cominId = ideavote.idea_id and ideavote.voter =  '+connection.escape(username)+' order by up_date desc';
  							sql = sql1+' '+sql2+' '+sql3+' '+sql4+' '+sql5+' '+sql6;
  						}
  						else{
							var sql1 = 'SELECT surname, firstname,avatar, vote_ups,vote_downs, owner, cominId, details, title, date_posted, up_date, privacy, card, vote_up, vote_down';
  							var sql2 = 'FROM (SELECT surname, vote_ups,vote_downs, firstname,avatar, owner, outId AS cominId, details, title, date_posted, up_date, privacy, card';
  							var sql3 = 'FROM (SELECT ideas.id AS outId, details, title, owner, date_posted, up_date, privacy, card, vote_ups,vote_downs';
  							var sql4 = 'FROM ideas LEFT JOIN ideacats ON ideas.cards = ideacats.id WHERE owner =  '+connection.escape(username);
  							var sql5 = 'OR (privacy =1 AND '+cardCond+')) AS crap LEFT JOIN user ON crap.owner = user.username)';
							var sql6 = 'AS anoda LEFT JOIN ideavote ON anoda.cominId = ideavote.idea_id and ideavote.voter =  '+connection.escape(username)+' order by up_date desc';
  							sql = sql1+' '+sql2+' '+sql3+' '+sql4+' '+sql5+' '+sql6;
  						}
  						connection.query( sql, function(err, rows) {
  							if(err) console.log(err);
  							//console.log(rows);
  							for(var i=0; i < rows.length; i++){
  								rows[i].details = marked(rows[i].details);
  							}
  							var nsql = 'select*from ideacats order by id limit 20';
  							connection.query( nsql, function(err, cats) {
  								var categ = cats;
  								//console.log(rows);
  								res.render('main/index', {un : username, rows: rows, categ:categ});
  							});
  							//console.log(rows);
  						});
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

/*
*
*This allows Comment to be added to an idea.
*This is a priviledged action and it requires that user is signed in
*
*/
app.post('/addcomment', function(req, res){
	user = req.session.user;
	ideaId = req.body.idea_id;
	comment = req.body.comment;
	var dpost = Math.floor(new Date() / 1000);
	connection.getConnection(function(err, pool){
		query = "insert into comments (idea_id, comment, user, comment_date) values("+pool.escape(ideaId)+","+pool.escape(comment)+","+pool.escape(user)+","+pool.escape(dpost)+")";
		pool.query(query, function(err, rows){
			if(err) console.log(err);
			res.send("Okay");
		});
	});
});


/*
*
*This is the second routing instance of index page
*This is a priviledged action and it requires that user is signed in
*
*/
app.get('/index', function(req, res) {
	ses = req.session;
	username = ses.user;
	sessionID = ses.sessionID;
	//var dataBundle = [];
	console.log(username);
	if(username !== undefined && sessionID != undefined){
		connection.getConnection(function(err, connection) {
			var sql = 'select*FROM user where username = '+ connection.escape(username);
  			connection.query( sql, function(err, rows) {
  				if(err){
  					console.log(err);
  				}
  				else{
  					if(rows.length > 0){
  						//console.log(rows[0].surname);
  						cardCond = stringQ(rows[0].cards)
  						console.log(cardCond);
  						//dataBundle.push(rows[0]);
  						var sql = '';
  						if (cardCond === ''){
  							var sql1 = 'SELECT surname, firstname,avatar, vote_ups,vote_downs, owner, cominId, details, title, date_posted, up_date, privacy, card, vote_up, vote_down';
  							var sql2 = 'FROM (SELECT surname, vote_ups,vote_downs,avatar, firstname, owner, outId as cominId, details, title, date_posted, up_date, privacy, card';
  							var sql3 = 'FROM (SELECT ideas.id AS outId, details, title, owner, date_posted, up_date, privacy, card, vote_ups,vote_downs';
  							var sql4 = 'FROM ideas LEFT JOIN ideacats ON ideas.cards = ideacats.id WHERE owner =  '+connection.escape(username);
  							var sql5 = 'OR (privacy =1)) AS crap LEFT JOIN user ON crap.owner = user.username)';
							var sql6 = 'AS anoda LEFT JOIN ideavote ON anoda.cominId = ideavote.idea_id and ideavote.voter =  '+connection.escape(username)+' order by up_date desc';
  							sql = sql1+' '+sql2+' '+sql3+' '+sql4+' '+sql5+' '+sql6;
  						}
  						else{
							var sql1 = 'SELECT surname, firstname,avatar, vote_ups,vote_downs, owner, cominId, details, title, date_posted, up_date, privacy, card, vote_up, vote_down';
  							var sql2 = 'FROM (SELECT surname, vote_ups,vote_downs, firstname,avatar, owner, outId AS cominId, details, title, date_posted, up_date, privacy, card';
  							var sql3 = 'FROM (SELECT ideas.id AS outId, details, title, owner, date_posted, up_date, privacy, card, vote_ups,vote_downs';
  							var sql4 = 'FROM ideas LEFT JOIN ideacats ON ideas.cards = ideacats.id WHERE owner =  '+connection.escape(username);
  							var sql5 = 'OR (privacy =1 AND '+cardCond+')) AS crap LEFT JOIN user ON crap.owner = user.username)';
							var sql6 = 'AS anoda LEFT JOIN ideavote ON anoda.cominId = ideavote.idea_id and ideavote.voter =  '+connection.escape(username)+' order by up_date desc';
  							sql = sql1+' '+sql2+' '+sql3+' '+sql4+' '+sql5+' '+sql6;
  						}
  						connection.query( sql, function(err, rows) {
  							if(err) console.log(err);
  							//console.log(rows);
  							for(var i=0; i < rows.length; i++){
  								rows[i].details = marked(rows[i].details);
  							}
  							var nsql = 'select*from ideacats order by id limit 20';
  							connection.query( nsql, function(err, cats) {
  								var categ = cats;
  								//console.log(rows);
  								res.render('main/index', {un : username, rows: rows, categ:categ});
  							});
  							//console.log(rows);
  						});
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


/*
*
*Destroy destroys the active session and redirect user to login again.
*This is to basically log out an active user
*
*/
app.get('/destroy', function(req, res) {
	req.session.destroy();
	res.render('main/login', {message: messenger.succesM('session has been ended')});
});


/*
*
*Dashboard displays all available idea posted by a user, user would be 
*able to delete, edit, and update privacy of his/her idea
*This is a priviledged action and it requires that user is signed in
*
*/
app.get('/dashboard', function(req, res) {
	ses = req.session;
	username = ses.user;
	sessionID = ses.sessionID;
	if(username !== undefined && sessionID !== undefined){
		connection.getConnection(function(err, connection) {
			var sql = 'select*FROM user where username = '+ connection.escape(username);
  			connection.query( sql, function(err, rows) {
  				if(err){
  					console.log(err);
  				}
  				else{
  					if(rows.length > 0){
  						//console.log(rows[0].surname);
  						//cardCond = stringQ(rows[0].cards)
  						//console.log(cardCond);
  						//dataBundle.push(rows[0]);
  						var sql = '';
  						//if (cardCond === ''){
  							var sql1 = 'SELECT surname, firstname,avatar, vote_ups,vote_downs, owner, cominId, details, title, date_posted, up_date, privacy, card, vote_up, vote_down';
  							var sql2 = 'FROM (SELECT surname, vote_ups,vote_downs,avatar, firstname, owner, outId as cominId, details, title, date_posted, up_date, privacy, card';
  							var sql3 = 'FROM (SELECT ideas.id AS outId, details, title, owner, date_posted, up_date, privacy, card, vote_ups,vote_downs';
  							var sql4 = 'FROM ideas LEFT JOIN ideacats ON ideas.cards = ideacats.id WHERE owner =  '+connection.escape(username);
  							var sql5 = ') AS crap LEFT JOIN user ON crap.owner = user.username)';
							var sql6 = 'AS anoda LEFT JOIN ideavote ON anoda.cominId = ideavote.idea_id and ideavote.voter =  '+connection.escape(username)+' order by up_date desc';
  							sql = sql1+' '+sql2+' '+sql3+' '+sql4+' '+sql5+' '+sql6;
  						/*}
  						else{
							var sql1 = 'SELECT surname, firstname,avatar, vote_ups,vote_downs, owner, cominId, details, title, date_posted, up_date, privacy, card, vote_up, vote_down';
  							var sql2 = 'FROM (SELECT surname, vote_ups,vote_downs, firstname,avatar, owner, outId AS cominId, details, title, date_posted, up_date, privacy, card';
  							var sql3 = 'FROM (SELECT ideas.id AS outId, details, title, owner, date_posted, up_date, privacy, card, vote_ups,vote_downs';
  							var sql4 = 'FROM ideas LEFT JOIN ideacats ON ideas.cards = ideacats.id WHERE owner =  '+connection.escape(username);
  							var sql5 = 'OR (privacy =1 AND '+cardCond+')) AS crap LEFT JOIN user ON crap.owner = user.username)';
							var sql6 = 'AS anoda LEFT JOIN ideavote ON anoda.cominId = ideavote.idea_id and ideavote.voter =  '+connection.escape(username)+' order by up_date';
  							sql = sql1+' '+sql2+' '+sql3+' '+sql4+' '+sql5+' '+sql6;
  						}*/
  						connection.query( sql, function(err, rows) {
  							if(err) console.log(err);
  							//console.log(rows);
  							res.render('main/dashboard', {key:sessionID, un : username, rows: rows});
  						});
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



/*
*
*This allows user to search for an idea, using search query.
*This is a priviledged action and it requires that user is signed in
*
*/

app.post('/search', function(req, res) {
	ses = req.session;
	username = ses.user;
	sessionID = ses.sessionID;
	searchQ = req.body.q;
	if(username !== undefined && sessionID !== undefined){
		connection.getConnection(function(err, connection) {
			var sql = 'select*FROM user where username = '+ connection.escape(username);
  			connection.query( sql, function(err, rows) {
  				if(err){
  					console.log(err);
  				}
  				else{
  					if(rows.length > 0){
  						//console.log(rows[0].surname);
  						//cardCond = stringQ(rows[0].cards)
  						//console.log(cardCond);
  						//dataBundle.push(rows[0]);
  						var sql = '';
  						//if (cardCond === ''){
  							var sql1 = 'SELECT surname, firstname,avatar, vote_ups,vote_downs, owner, cominId, details, title, date_posted, up_date, privacy, card, vote_up, vote_down';
  							var sql2 = 'FROM (SELECT surname, vote_ups,vote_downs,avatar, firstname, owner, outId as cominId, details, title, date_posted, up_date, privacy, card';
  							var sql3 = 'FROM (SELECT ideas.id AS outId, details, title, owner, date_posted, up_date, privacy, card, vote_ups,vote_downs';
  							var sql4 = 'FROM ideas LEFT JOIN ideacats ON ideas.cards = ideacats.id WHERE title like  '+connection.escape('%'+searchQ+'%')+' or details like '+connection.escape('%'+searchQ+'%');
  							var sql5 = ') AS crap LEFT JOIN user ON crap.owner = user.username)';
							var sql6 = 'AS anoda LEFT JOIN ideavote ON anoda.cominId = ideavote.idea_id and ideavote.voter =  '+connection.escape(username)+' order by up_date desc';
  							sql = sql1+' '+sql2+' '+sql3+' '+sql4+' '+sql5+' '+sql6;
  						/*}
  						else{
							var sql1 = 'SELECT surname, firstname,avatar, vote_ups,vote_downs, owner, cominId, details, title, date_posted, up_date, privacy, card, vote_up, vote_down';
  							var sql2 = 'FROM (SELECT surname, vote_ups,vote_downs, firstname,avatar, owner, outId AS cominId, details, title, date_posted, up_date, privacy, card';
  							var sql3 = 'FROM (SELECT ideas.id AS outId, details, title, owner, date_posted, up_date, privacy, card, vote_ups,vote_downs';
  							var sql4 = 'FROM ideas LEFT JOIN ideacats ON ideas.cards = ideacats.id WHERE owner =  '+connection.escape(username);
  							var sql5 = 'OR (privacy =1 AND '+cardCond+')) AS crap LEFT JOIN user ON crap.owner = user.username)';
							var sql6 = 'AS anoda LEFT JOIN ideavote ON anoda.cominId = ideavote.idea_id and ideavote.voter =  '+connection.escape(username)+' order by up_date';
  							sql = sql1+' '+sql2+' '+sql3+' '+sql4+' '+sql5+' '+sql6;
  						}*/
  						connection.query( sql, function(err, rows) {
  							if(err) console.log(err);
  							//console.log(rows);
  							var nsql = 'select*from ideacats order by id limit 20';
  							connection.query( nsql, function(err, cats) {
  								var categ = cats;
  								//console.log(rows);
  								res.render('main/search', {sq: searchQ, un : username, rows: rows, categ:categ});
  							});
  							//res.render('main/search', {sq : searchQ, un : username, rows: rows});
  						});
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

/*
*
*This allows user to remove thier idea, this requires a second degree priviledge
* i.e (you must be signed in, and you can only perform this action on your idea)
*This is a priviledged action and it requires that user is signed in
*
*/

app.post('/delete',function(req,res){
	if(req.session.sessionID === req.body.key){
		connection.getConnection(function(err,pool){
			pool.query('delete from ideas where id ='+pool.escape(req.body.delId), function(err, resp){
				if(err) console.log(err);
				res.send('Okay');
				pool.release();
			});
		});
	}
	else{
		res.redirect('/login');
	}
});

/*
*
*User can use settings change thier cards and avatar
*This is a priviledged action and it requires that user is signed in
*
*/
app.get('/settings',function(req,res){
	ses = req.session;
	username = ses.user;
	sessionID = ses.sessionID;
	searchQ = req.body.q;
	if(username !== undefined && sessionID !== undefined){
		connection.getConnection(function(err,pool){
			pool.query("select*from user where username ="+pool.escape(username), function(err, row){
				if(err) console.log(err);
				pool.query("select*from ideacats", function(err, cats){
					if(err) console.log(err);
					res.render('main/settings', {user:row, key:sessionID, categ:cats});
					pool.release();
				});
			});
		});
	}
	else{
		res.redirect('/login');
	}
});


/*
*
*This From settings, this allows user to cupdate thier cards
*This is a priviledged action and it requires that user is signed in
*
*/
app.post('/updatecards',function(req,res){
	if(req.session.sessionID === req.body.key){
		connection.getConnection(function(err,pool){
			//editing = req.body.ty;
			sql = "update user set cards="+pool.escape(req.body.ncards)+" where username = "+pool.escape(req.body.user);
			pool.query(sql, function(err, resp){
				if(err) console.log(err);
				res.send('Okay');
				pool.release();
			});
		});
	}
	else{

	}
});


/*
*
*This From settings, this allows user to cupdate thier avatar
*This is a priviledged action and it requires that user is signed in
*
*/
app.post('/updateavatar',function(req,res){
	if(req.session.sessionID === req.body.key){
		connection.getConnection(function(err,pool){
			//editing = req.body.ty;
			sql = "update user set avatar="+pool.escape(req.body.avatar)+" where username = "+pool.escape(req.body.user);
			pool.query(sql, function(err, resp){
				if(err) console.log(err);
				res.send('Okay');
				pool.release();
			});
		});
	}
	else{
		console.log('err in '+req.body.key);
	}
});



/*
*
*Allows user to edit thier idea fields
*This is a priviledged action and it requires that user is signed in
*
*/
app.post('/updateIdea',function(req,res){
	if(req.session.sessionID === req.body.key){
		connection.getConnection(function(err,pool){
			editing = req.body.ty;
			if(editing == '0'){
				sql = "update ideas set title="+pool.escape(req.body.newData)+" where id = "+pool.escape(req.body.pid);
			}
			else{
				sql = "update ideas set details="+pool.escape(req.body.newData)+" where id = "+pool.escape(req.body.pid);
			}
			pool.query(sql, function(err, resp){
				if(err) console.log(err);
				res.send('Okay');
				pool.release();
			});
		});
	}
	else{

	}
});


/*
*
*This dashboard settings allow user to update thier post's privacy
*This is a priviledged action and it requires that user is signed in
*
*/
app.post('/updatepriv', function(req,res){
	if(req.session.sessionID === req.body.key){
		connection.getConnection(function(err,pool){
			editing = req.body.ty;
			console.log(editing);
			if(editing == 'true'){
				sql = "update ideas set privacy =0 where id = "+pool.escape(req.body.pid);
			}
			else{
				sql = "update ideas set privacy=1 where id = "+pool.escape(req.body.pid);
			}
			pool.query(sql, function(err, resp){
				if(err) console.log(err);
				res.send('Okay');
				pool.release();
			});
		});
	}
	else{

	}
});


/*
*
*This routes the registration page
*
*/
app.get('/register', function(req, res) {
	res.render('main/register');
});


/*
*
*This rotes the login page
*
*/
app.get('/login', function(req, res) {
	res.render('main/login');
});


/*
*
*This handles the sign in request from /signin
*
*/
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


/*
*
*This allow user to add an idea
*This is a priviledged action and it requires that user is signed in
*
*/
app.post('/addidea', function(req, res) {
	//var ses = session.user;
	var username = req.body.user;
	var title = req.body.tit;
	var details = req.body.det;
	var privaty = req.body.privaty;
	var cat = req.body.cat;
	console.log(username)
	var dpost = Math.floor(new Date() / 1000);
	connection.getConnection(function(err, connection) {
			var sql = 'insert into ideas (details, title,date_posted, owner, privacy, cards, up_date) values ('+ connection.escape(details) +','+
			connection.escape(title)+','+connection.escape(dpost)+','+connection.escape(username)+','+
			connection.escape(privaty)+','+connection.escape(cat)+','+connection.escape(dpost)+')';
  			connection.query( sql, function(err, rows) {
  				if(err){
  					console.log(err);
  					m = err;
  				}
  				else{
  					sql = 'update ideacats set posts = posts + 1 where id ='+connection.escape(cat);
  					connection.query( sql, function(err, rows){});
  					m = "Okay";
  				}
  			res.sendStatus(m);
    		connection.release();
  			});
		});
});


/*
*
*This handle request to vote for an idea
*This is a priviledged action and it requires that user is signed in
*
*/
app.post('/voteidea', function(req, res){
	user = req.session.user;
	ideaId = req.body.idea_id;
	vote_for = req.body.isGreat;
	var dpost = Math.floor(new Date() / 1000);
	var sql = "select id from user where username= "+connection.escape(user);
	var vcrit = '';
		connection.getConnection(function(err, pool){
			pool.query(sql, function(err,rows){
				id = rows.id;
				if(vote_for === "true"){
					sql2 = "select*from ideavote where idea_id="+pool.escape(ideaId)+" and voter="+pool.escape(user);
					pool.query(sql2, function(err, rows){
						if(rows.length < 1){
							sql = "update ideas set up_date = dpost, vote_ups = vote_ups + 1 where id ="+pool.escape(ideaId);
							pool.query(sql, function(err, rows){
								usql = "insert into ideavote (voter, idea_id, vote_up, vote_down) values("+pool.escape(user)+","+pool.escape(ideaId)+",1,0)";
								pool.query(usql, function(err,rows){
									pool.release();
								});
								//connection.release();
							})
						}
						else{
							if(rows[0].vote_up === 1){
							}
							else{
								sql = "update ideas set up_date = dpost, vote_ups = vote_ups + 1, vote_downs = vote_downs -1 where id ="+pool.escape(ideaId);
								pool.query(sql, function(err, rows){
								usql = "update ideavote set vote_up = vote_up + 1, vote_down = vote_down -1 where idea_id ="+pool.escape(ideaId);
								pool.query(usql, function(err,rows){	
								pool.release();								
								});
							});	
							}
						}
					});
				}
				else{
					sql2 = "select*from ideavote where idea_id="+pool.escape(ideaId)+" and voter="+pool.escape(user);
					pool.query(sql2, function(err, rows){
						if(rows.length < 1){
							sql = "update ideas set up_date = dpost, vote_downs = vote_downs + 1 where id ="+pool.escape(ideaId);
							pool.query(sql, function(err, rows){
								usql = "insert into ideavote (voter, idea_id, vote_up, vote_down) values("+pool.escape(user)+","+pool.escape(ideaId)+",0,1)";
								pool.query(usql, function(err,rows){
									pool.release();
								});
								//connection.release();
							});
						}
						else{
							if(rows[0].vote_down === 1){

							}
							else{
								sql = "update ideas set up_date = dpost, vote_ups = vote_ups - 1, vote_downs = vote_downs +1 where id ="+pool.escape(ideaId);
							pool.query(sql, function(err, rows){
								usql = "update ideavote set vote_up = vote_up -1, vote_down = vote_down + 1 where idea_id ="+pool.escape(ideaId);
								pool.query(usql, function(err,rows){
									pool.release();
								});
								//
							})
							}
						}
					})
				}

			})
pool.query("select vote_ups, vote_downs from ideas where id ="+pool.escape(ideaId), function(err, rows){
vcrit = rows[0].vote_ups+","+rows[0].vote_downs;
//console.log(vcrit);
res.send(vcrit);
//connection.release();
});

		})
});




/*
*
*This handle the request to vote comment
*This is a priviledged action and it requires that user is signed in
*
*/
app.post('/voteComment', function(req, res){
	user = req.session.user;
	ideaId = req.body.comment_id;
	vote_for = req.body.isGreat;
	var dpost = Math.floor(new Date() / 1000);
	var sql = "select id from user where username= "+connection.escape(user);
	var vcrit = '';
		connection.getConnection(function(err, pool){
			pool.query(sql, function(err,rows){
				id = rows.id;
				if(vote_for === "true"){
					sql2 = "select*from commentvote where comment_id="+pool.escape(ideaId)+" and voter="+pool.escape(user);
					pool.query(sql2, function(err, rows){
						if(rows.length < 1){
							sql = "update comments set helpful = helpful + 1 where id ="+pool.escape(ideaId);
							pool.query(sql, function(err, rows){
								usql = "insert into commentvote (voter, comment_id, helpful, unhelpful) values("+pool.escape(user)+","+pool.escape(ideaId)+",1,0)";
								pool.query(usql, function(err,rows){
									pool.release();
								});
								//connection.release();
							})
						}
						else{
							if(rows[0].helpful === 1){
							}
							else{
								sql = "update comments set helpful = helpful + 1, unhelpful = unhelpful -1 where id ="+pool.escape(ideaId);
								pool.query(sql, function(err, rows){
								usql = "update commentvote set helpful = helpful + 1, unhelpful = unhelpful -1 where comment_id ="+pool.escape(ideaId);
								pool.query(usql, function(err,rows){	
								pool.release();								
								});
							});	
							}
						}
					});
				}
				else{
					sql2 = "select*from commentvote where comment_id="+pool.escape(ideaId)+" and voter="+pool.escape(user);
					pool.query(sql2, function(err, rows){
						if(rows.length < 1){
							sql = "update comments set unhelpful = unhelpful + 1 where id ="+pool.escape(ideaId);
							pool.query(sql, function(err, rows){
								usql = "insert into commentvote (voter, comment_id, helpful, unhelpful) values("+pool.escape(user)+","+pool.escape(ideaId)+",0,1)";
								pool.query(usql, function(err,rows){
									pool.release();
								});
								//connection.release();
							});
						}
						else{
							if(rows[0].unhelpful === 1){

							}
							else{
								sql = "update comments set helpful = helpful - 1, unhelpful = unhelpful +1 where id ="+pool.escape(ideaId);
							pool.query(sql, function(err, rows){
								usql = "update commentvote set helpful = helpful -1, unhelpful = unhelpful + 1 where comment_id ="+pool.escape(ideaId);
								pool.query(usql, function(err,rows){
									pool.release();
								});
								//
							})
							}
						}
					})
				}

			})
pool.query("select helpful, unhelpful from comments where id ="+pool.escape(ideaId), function(err, rows){
vcrit = rows[0].helpful+","+rows[0].unhelpful;
//console.log(vcrit);
res.send(vcrit);
//connection.release();
});

		})
});



/*
*
*This handle the request to get comments for a idea
*This is a priviledged action and it requires that user is signed in
*
*/
app.post('/getComment', function(req, res){
	var ideaId = req.body.ide;
	connection.getConnection(function(err,pool){
		sql = "select comment, comments.id as cid, idea_id, comment_date, helpful, unhelpful,avatar, surname, firstname from comments left join user on user.username = comments.user where comments.idea_id ="+pool.escape(ideaId);
		pool.query(sql, function(err,rows){
			//console.log(ideaId);
			if(rows.length < 1){
				res.send("<h4>No comment to show</h4>");
			}
			else{
				//console.log(rows.length);
				pool.release();
				dat = messenger.commentBlueprint(rows);
				res.send(dat);
			}
		});
	})
});


/*
*
*This handle all registration request
*
*/
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
				  					//console.log(ses.user);
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
	}         
})




app.listen(3000);
console.log('3000 is the magic port');
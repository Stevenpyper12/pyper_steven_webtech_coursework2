var express = require('express');
var router = express.Router();
var path = require('path');
var dbPath = path.resolve(__dirname,'../testing.db')
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(dbPath);
var cookieParser = require('cookie-parser');
var cookieSignature = require('cookie-signature');
var cookie= require('cookie');
var ServerStartDate = new Date;
var DateKey = cookieSignature.sign('server',String(ServerStartDate));

/* GET home page. */

router.get('/:anything',function(req,res,next){
	var cookieparsing = req.cookies.UserInfo;
	console.log(cookieparsing);
	if(cookieparsing)
	{
		var testing = req.cookies.UserInfo.split("-")
		if (testing[1] != DateKey)
		{
			res.clearCookie('UserInfo',{path:'/'});
			res.render('loggedout',{title:'you have been logged out!'});
		}else
		{
			next();
		}
	}else
	{
		next();
	}
	
});

router.get('/user/:test',function(req,res,next){
	var cookieparsing = req.cookies.UserInfo;
	console.log(cookieparsing);
	if(cookieparsing)
	{
		var testing = req.cookies.UserInfo.split("-")
		if (testing[1] != DateKey)
		{
			res.clearCookie('UserInfo',{path:'/'});
			res.render('loggedout',{title:'you have been logged out!'});
		}else
		{
			next();
		}
	}else
	{
		res.render('loginorregister',{title:'log in or register'});
	}
	
});


router.get('/user/messages/:test',function(req,res,next){
	var cookieparsing = req.cookies.UserInfo;
	console.log(cookieparsing);
	if(cookieparsing)
	{
		var testing = req.cookies.UserInfo.split("-")
		if (testing[1] != DateKey)
		{
			res.clearCookie('UserInfo',{path:'/'});
			res.render('loggedout',{title:'you have been logged out!'});
		}else
		{
			next();
		}
	}else
	{
		res.render('loginorregister',{title:'log in or register'});
	}
	
});

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/register', function(req,res)
{
	res.render('signOptions', { title: 'Register' ,extra:""});
});

router.get('/login', function(req,res)
{
	
	 res.render('signOptions', { title: 'Login', extra:""});
});

router.post('/register', function(req,res)
{
	var usernames=req.body.userName;
	var userpassword=req.body.userPassword;
	var usercookie=cookieSignature.sign('username',usernames)+'-'+DateKey;
	db.serialize(function(){
		//'${usernames}'
		db.get(`select distinct * from user where username = '${usernames}'`, function(err,result,row)
			{
				if(err)
				{
					throw err;
					console.log(result);
				}
				else if(result){
					console.log("user tried to enter name twice")
					//res.send("<meta http-equiv=\"refresh\" content= \"2;http://127.0.0.1:5000/register\">error creating account, username taken");
					 res.render('signOptions', { title: 'Signup Failed',extra:"username already in use"});
				}
				else
				{
					db.run(`insert into user(username,password,cookie) values ('${usernames}','${userpassword}','${usercookie}')`);
					//set cookie here
					res.setHeader('Set-Cookie',cookie.serialize('UserInfo',usercookie,{
						maxAge:60*60*24
					}));
					res.render('successful', { title: 'register Sucessful'});
					//should then display a sucessful page rather than messages
				}
			})
			
	})
});

router.post('/login', function(req,res)
{
	var usernames=req.body.userName;
	var userpassword=req.body.userPassword;
	var usercookie=cookieSignature.sign('username',usernames)+'-'+DateKey;
	
	db.serialize(function(){
		db.get(`select distinct * from user where username = '${usernames}'`, function(err,result,row)
			{
				if(err)
				{
					throw err;
					console.log(result);
				}
				if(result)
				{
					if(result.password == userpassword)
					{
					db.run(`update user set cookie ='${usercookie}' where username = '${usernames}'`);
					//set cookie here
					res.setHeader('Set-Cookie',cookie.serialize('UserInfo',usercookie,{
							maxAge:60*60*24
						}));
					res.render('successful', { title: 'login Sucessful'});	
					}else
					{
						 res.render('signOptions', { title: 'Login Failed',extra:"wrong username and/or password"});
					}
				}else
				{
						 res.render('signOptions', { title: 'Login Failed',extra:"wrong username and/or password"});
				}
			})
			
	})
	
	
});


router.get('/user/messages', function(req,res)
{
	var userscookie = req.cookies.UserInfo;
	var allmessages = [];
	db.get(`select distinct * from user where cookie = '${userscookie}'`, function(err,result,row)
	{
		if(err)
		{
			throw err;
			console.log(result);
		}
		if(result)
		{			
			if(result.messages != "")
			{
				console.log(result.messages)
				var testing = result.messages.split(",")
				testing.forEach(function(value){
					console.log(value);
					allmessages.push(value)
				});
			}
		}
	});
	console.log(allmessages);
	res.render('message', { title: 'Your Messages', userMessages:allmessages});
	//render a message page , first validate user allowing them to only see there own messages(check both the userid and the server date key)
	 //res.render('signOptions', { title: 'Login', extra:""});
});

router.get('/user/messages/send', function(req,res)
{
						
	res.render('sendmessage', { title: 'Send A Messages'});
	//render a message page , first validate user allowing them to only see there own messages(check both the userid and the server date key)
	 //res.render('signOptions', { title: 'Login', extra:""});
});

router.post('/user/messages/send', function(req,res)
{
	var userscookie = req.cookies.UserInfo;
	var userrecipent = req.body.recipient;
	var usercontent = [];
	usercontent = req.body.messagecontent;
	var previousmessages;
	var allmessages = []
/*
	var usernamesigned = userscookie[0];
	var usernames = cookieSignature.unsign(userscookie[0],"username");
	console.log(usernames);

	*/
	
	console.log(userscookie);
	db.serialize(function(){
		db.get(`select distinct * from user where cookie = '${userscookie}'`, function(err,result,row)
			{
				if(err)
				{
					throw err;
					console.log(result);
				}
				if(result)
				{	
					db.get(`select distinct * from user where username = '${userrecipent}'`, function(err,result,row)
						{
							if(result.messages != "")
							{
								
								allmessages = [result.messages,usercontent]
								console.log(result.messages);
								console.log(usercontent);
								db.run(`update user set messages ='${allmessages}' where username = '${userrecipent}'`);
							
							}else
							{
								db.run(`update user set messages ='${usercontent}' where username = '${userrecipent}'`);
							}
						});
					
				}else
				{
					res.clearCookie('UserInfo',{path:'/'});
				}
			})
			
	})
	
});





/*router.post('/messages/send', function(req,res)
{
	var usernames=req.body.userName;
	var userpassword=req.body.userPassword;
	
	
	db.serialize(function(){
		db.get(`select distinct * from user where username = '${usernames}'`, function(err,result,row)
			
	//render a message page , first validate user allowing them to only see there own messages(check both the userid and the server date key)
	 //res.render('signOptions', { title: 'Login', extra:""});
});
*/
module.exports = router;

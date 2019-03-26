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
	if(cookieparsing)
	{
		var testing = req.cookies.UserInfo.split("-")
		if (testing[1] != DateKey)
		{
			res.setHeader('Set-Cookie',cookie.serialize('UserInfo',{
				maxAge:Date.now()
			}));
			res.render('loggedout',{title:'you have been logged out!'});
		//delete cookie as the cookie is no longer in sync with the server
		}else
		{
			next();
		}
	}
	else{
		next();
	}
});


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  console.log('Cookies: ', req.cookie);
  console.log('Signed Cookies: ', req.signedCookies);
});


router.get('/register', function(req,res)
{
	 res.render('signOptions', { title: 'Register' ,extra:""});
	//res.sendFile(path.resolve( __dirname+'/../public/html/register.html'));
});

router.get('/login', function(req,res)
{
	
	 res.render('signOptions', { title: 'Login', extra:""});
});

router.post('/register', function(req,res)
{
	var usernames=req.body.userName;
	var userpassword=req.body.userPassword;
	var usercookie=usernames+'-'+DateKey;
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
	var usercookie=usernames+'-'+DateKey;
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


router.get('/message', function(req,res)
{
	//render a message page , first validate user allowing them to only see there own messages(check both the userid and the server date key)
	 //res.render('signOptions', { title: 'Login', extra:""});
});

module.exports = router;

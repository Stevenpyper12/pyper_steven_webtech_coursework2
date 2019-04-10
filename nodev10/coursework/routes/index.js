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

//NEXT WEEK WORK ON REDOING THE POST STUFF SINCCE IT WILL NO LONGER WORK, REDO IT!
/* GET home page. */
//i wish to have it noted that most of this was done before you allowed us to use any node packages and as such i dont(at time of writing) use any external modules which leads to some things being implemented in an nonoptiomial way, however as i have already restarted multiple times i will just be continuing while trying to use almost no modules(except maybe for user security)
router.get('/:anything',function(req,res,next){
	var cookieparsing = req.cookies.UserInfo;
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
		db.get(`select distinct * from User where UserName = '${usernames}'`, function(err,result,row)
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
					db.run(`insert into user(UserName,Password,cookie) values ('${usernames}','${userpassword}','${usercookie}')`);
					res.setHeader('Set-Cookie',cookie.serialize('UserInfo',usercookie,{
						maxAge:60*60*24
					}));
					res.render('successful', { title: 'register Sucessful'});
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
		db.get(`select distinct * from User where UserName = '${usernames}'`, function(err,result,row)
			{
				if(err)
				{
					throw err;
					console.log(result);
				}
				if(result)
				{
					console.log(result.Password)
					console.log(userpassword)
					if(result.Password == userpassword)
					{
					db.run(`update User set cookie ='${usercookie}' where UserName = '${usernames}'`);
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
	db.serialize(function(){
		db.get(`select distinct * from User where cookie = '${userscookie}'`, function(err,result,row)
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
					console.log(result.messages);
					var testing = result.messages.split(",Sender:")
					var first = 1;
					testing.forEach(function(value){
						if(first == 1)
						{
							allmessages.push(value)
							first = 0;
						}else
						{
							allmessages.push("Sender:" + value)
						}
					});
				}
			}
			res.render('message', { title: 'Your Messages', userMessages:allmessages});
		});
	})
});

router.get('/user/messages/send', function(req,res)
{
	res.render('sendmessage', { title: 'Send A Messages'});
});

router.post('/user/messages/send', function(req,res)
{
	var userscookie = req.cookies.UserInfo;
	var userrecipent = req.body.recipient;
	var usercontent = req.body.messagecontent;
	var usercipher = req.body.cipher;
	var usermethod = req.body.MethodSelector;
	var userkey = req.body.InputKey;
	var cipherused = usercipher+","+usermethod;
	console.log(req.body)
/*
	var usernamesigned = userscookie[0];
	var usernames = cookieSignature.unsign(userscookie[0],"username");
	console.log(usernames);

	*/
	
	db.serialize(function(){
		db.get(`select distinct * from User where cookie = '${userscookie}'`, function(err,result,row)
			{
				if(err)
				{
					throw err;
					console.log(result);
				}
				if(result)
				{	
					sender = result.username
					db.get(`select distinct * from user where Username = '${userrecipent}'`, function(err,result,row)
						{
							if(result)
							{
								if(result.messages)
								{
								db.run(`insert into Message (Sender, Recipient, MessageContent,CipherUsed,Key) VALUES (${sender},${userrecipent},${usercontent},${cipherused},${userkey}`);
									res.render('successful', { title: 'Message sucessfully sent!'});
								}
							}else
							{
								res.render('successful', { title: 'Message Failed To Send!'});
							}
						});
					
				}else
				{
					res.clearCookie('UserInfo',{path:'/'});
				}
			})
			
	})
	
});


//SPLITING ROUTING AND CIPHERS
	charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	numchars= charset.length;
//probably should have a routing function that chooses between caesar and stuff.

//Caesar Stuff
function Caesar(type,key,content){
	//defines how many shifts there should be to the chararcter set
	if(key == 0)
	{
		if(type == '3')
		{
			//rot13 encrypt
			ciphertext = Caesar_encrypt(13,content);
			return ciphertext;
		}else
		if(type == '4'){
			//rot13 decrypt
			plaintext=Caesar_decrypt(13,content);
			return plaintext;
		}
	}else
	{
		if(type == '0')
		{
			//caesar encrypt with a key(set to 0 so it can search for the proper key when it is running
			ciphertext = Caesar_encrypt(key,content);
			return ciphertext;
		}else
		if(type == '1'){
			//caesar decrypt with a key(set to 0 so it can search for the proper key when it is running
			plaintext=Caesar_decrypt(key,content);
			return plaintext;
		}
	}
}

function Caesar_encrypt(key,content){
	//gets the text and converts it to uppercase
	plaintext = content
	plaintext = plaintext.toUpperCase();
	var ciphertext = "";
	var newletter = "";
	//checks if the key is outside of the range -25 to 25, if it is it will do maths to find the remainder and then use that as a key(stops issues that were discovered during testing)
	if(key > 25 || key < -26)
	{
		key = key % 26;
	}
	
	//goes through each character in the plaintext, checks if it is in the characterset,if it is it then gets the new position of the character and then has to deal with if it is going to go the character amount or go below 0(meaning that it has to flip around how it is dealing with it to allow for this
	//if the character isnt in the characterset it will simplely add it to the text, it will then add each character to the cipher text.
	for(ch in plaintext)
	{
		if(charset.includes(plaintext[ch]))
		{
			var newcharposition = +charset.indexOf(plaintext[ch]) + +key;
			if(newcharposition >= numchars)
			{
				newletter=charset.charAt(newcharposition-numchars);
			}else
			if(newcharposition < 0)
			{
				newletter=charset.charAt(numchars + newcharposition);
			}				
			else
			{
				newletter=charset.charAt(newcharposition);
			}
		}else
		{
			newletter=plaintext[ch];
		}
		ciphertext = ciphertext+newletter;	
	}
	//gets outpuot to the user
	return ciphertext;
}

function Caesar_decrypt(key,content){
	ciphertext = content;
	ciphertext = ciphertext.toUpperCase();
	var plaintext = "";
	var newletter = "";
	if(key > 25 || key < -26)
	{
		key = key % 26;
	}
	//very similar to the encryption setup however done someone in reverse with the key being tookken away rather than added, foolows the same idea behind everything
	for(ch in ciphertext)
	{
		if(charset.includes(ciphertext[ch]))
		{
			
			var newcharposition = +charset.indexOf(ciphertext[ch]) - +key;
			if(newcharposition < 0)
			{
				newletter=charset.charAt(newcharposition+numchars);
			}else
			{
				newletter=charset.charAt(newcharposition);
			}
		}else{
			newletter= ciphertext[ch];
		}
		plaintext = plaintext+newletter;	
	}
	return plaintext;
}

//Substitution
function Subsitition(type,key1,key2,content){
	var alphamap = new Map();
	if(type == '0')
	{
		alphamap = setupalpha(key1,key2);
		cipheredtext = Subsitition_ciphering(alphamap,content);
		return cipheredtext;
	}
	else
	if(type == '1'){
		alphamap = setupalpha(key2,key1);
		decipheredtext= Subsitition_ciphering(alphamap,content);
		return decipheredtext;
	}
	
}

function setupalpha(newalpha,orginalalpha){
	var newalpha = newalpha.toUpperCase();
	var orginalalpha =orginalalpha.toUpperCase();
	var alphamap = new Map();
	
	//checks if the two alphabets are the same length as if they are not the script may not function properly(depending on which letters are used)
	if(newalpha.length==orginalalpha.length)
	{
		for(i = 0; i < orginalalpha.length;i++)
		{
			//adds to the map allowing it to be used later
			alphamap.set(orginalalpha[i],newalpha[i]);
		}
		return alphamap
	}else
	{
		//alerts the user to the fact that the alphabets are not the same length
		alert("Be aware your two alphabets are not the same length which might lead to some unexpected behaviour, however the program will still run");
		for(i = 0; i < orginalalpha.length;i++)
		{
			alphamap.set(orginalalpha[i],newalpha[i]);
		}
		return alphamap
	}
}

function Subsitition_ciphering(alphamap,content){
	var inputtext = content.toUpperCase();
	var outputtext = "";
	//goes through each character checking for spaces, if there is one it just gets added, if there isnt it will search the tree for the key of that character and the value thats returned will be added to the encrypted text
	for(ch in inputtext)
	{
		if(inputtext[ch] == " ")
		{
			outputtext=outputtext+ " ";
		}else
		{
			if(alphamap.get(inputtext[ch]) == undefined)
			{
				outputtext=outputtext+alphamap.get(inputtext[ch]);
			}else
			{
				outputtext=outputtext+alphamap.get(inputtext[ch]);
			}
		}
	}
	//outputs and alerts the user

	return outputtext;
}

//Morse
var morsealphamap = new Map().set("A",".-").set("B","-...").set("C","-.-.").set("D","-..")
.set("E",".").set("F","..-.").set("G","--.").set("H","....").set("I","..")
.set("J",".---").set("K","-.-").set("L",".-..").set("M","--").set("N","-.")
.set("O","---").set("P",".--.").set("Q","--.-").set("R",".-.").set("S","...")
.set("T","-").set("U","..-").set("V","...-").set("W",".--").set("X","-..-")
.set("Y","-.--").set("Z","--..");

var morsemorsemap = new Map().set(".-","A").set("-...","B").set("-.-.","C").set("-..","D")
.set(".","E").set("..-.","F").set("--.","G").set("....","H").set("..","I")
.set(".---","J").set("-.-","K").set(".-..","L").set("--","M").set("-.","N")
.set("---","O").set(".--.","P").set("--.-","Q").set(".-.","R").set("...","S")
.set("-","T").set("..-","U").set("...-","V").set(".--","W").set("-..-","X")
.set("-.--","Y").set("--..","Z");


function morse(type,content)
{
	//allows the user to make the choices from teh buttons
	if(type == '0')
	{
		morsetext = texttomorse(content);
		return morsetext;
	}else
	{
		plaintext = morsetotext(content);
		return plaintext
	}
}

function texttomorse(content)
{
	var plaintext = content.toUpperCase();
	var morsetext = "";
	//goes through every character in plaintext and will convert it into morse code and add spaces so that if it played as sound it is deblt with properly
	for(ch in plaintext)
	{
		if(plaintext[ch] == " ")
		{
			//as browsers tend to shrink double spaces this method was used to get aorund it
			morsetext = morsetext + "&nbsp;&nbsp;";
		}else
		{
			//checks if a character is not in the alphabet mapped tree meaning it would be undefined and not have a associated value
			if(morsealphamap.get(plaintext[ch]) == undefined)
			{
				morsetext=morsetext+morsealphamap.get(plaintext[ch]);
				morsetext=morsetext+ " ";
			}else
			{
				morsetext=morsetext+morsealphamap.get(plaintext[ch]);
				morsetext=morsetext+ " ";
			}
		}
	}
	 //prints ot the output and alerts the user if there was any issues
	return morsetext;

}

function morsetotext(content)
{
	var plaintext = "";
	var morsetext = content.toUpperCase();
	var singlemorse = "";
	
	//has to go through every character and sort them into letters and words and also if a space is actually a space or should be double space
	for(ch in morsetext)
	{
		if(morsetext[ch] == " " && morsetext[+ch - +1] == " ")
		{
			//if it was a double space it will add a actual space 
			plaintext=plaintext+" ";
		}
		else
		if(morsetext[ch] == " ")
		{
			//if it was a single space it  means that it was seperating a letter rather than a word and as such has to go through find the full morse letter and convert it to the actual letter
			if(morsemorsemap.get(singlemorse) == undefined)
			{
				plaintext=plaintext+morsemorsemap.get(singlemorse);
				singlemorse="";
			}else
			{
				plaintext=plaintext+morsemorsemap.get(singlemorse);
				singlemorse="";
			}
		}else
		{
			singlemorse = singlemorse+morsetext[ch];
		}

	}
	//deals with thje very last character which does not ahve a space after it and as such will not have been added to the plain text
	plaintext=plaintext+morsemorsemap.get(singlemorse);
	return plaintext;
}





module.exports = router;

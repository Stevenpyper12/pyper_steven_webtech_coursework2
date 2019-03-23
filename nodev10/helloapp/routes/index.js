var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'About the Ciphers'});
});
router.get('/ciphers', function(req, res, next) {
  res.render('index', { title: 'About the Ciphers' });
});

router.get('/ciphers/caesar', function(req, res, next) {
	let CipherInfo = 'A Caesar Cipher might also be refered to as "A Shift Cipher,Caesars Code or a Caesar Shift". It works taking each letter and replacing it with another letter that is a fixed number of places around the alphabet. you were to shift it by 3 characters A would become D, as it is 3 characters to the right of a in the  English alphabet.'
	let CipherHelp = 'There are many Different Cipher Methods for the Caesar Cipher. If you want to take some text and encrypt it by shifting the alphabet by a certain amount then choose encrypt, then enter the text and key(this is the number of times it will be shifted, can also be positive or negative) you would like to use then click the Encrypt Button.<br>If you have some text that is already converted you can decipher it by choosing decrypt, all you then need to do is enter the cipher text and the sasme key that was used to cipher it to begin with, then click the decrypt button. If you do not know the key that was used to convert the text but would like to try and decrypt it anyway use the Crack option, then input it into the text box and then click the crack button. If you would like to convert the text into ROT13 then click on that option and enter the text and click the encrypt button If you would like to decrypt the ROT13 Text select that option then enter the text and click the decrypt button'
	let MethodSelector = "";
	let InputArea = "When you select a Cipher Method This is where you will be able to enter text and click the buttons to do the work";
	let OutputArea = "Any outputs will appear here!";
	res.render('ciphers', 
	{ 	title: 'Caesar Cipher Rot13',
		CipherInfo: CipherInfo,
		CipherHelp: CipherHelp,
		MethodSelector: MethodSelector,
		InputArea: InputArea,
		OutputArea: OutputArea,
	});
});



router.get('/ciphers/substitution', function(req, res, next) {
  res.render('ciphers', { title: 'Subsituation Cipher' });
});



router.get('/ciphers/morse', function(req, res, next) {
  res.render('ciphers', { title: 'Morse Code' });
});



module.exports = router;

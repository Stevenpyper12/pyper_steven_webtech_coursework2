charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
numchars= charset.length;

//the key is passed in depending on which method will be being used allowing with a key
function Caesar(type,key){
	//document.getElementById("output").innerHTML = "<p>this is a different test</p>"
	//defines how many shifts there should be to the chararcter set
	if(key == 0)
	{
		if(type == '3')
		{
			//rot13 encrypt
			Caesar_encrypt(13);
		}else
		if(type == '4'){
			//rot13 decrypt
			Caesar_decrypt(13);
		}
	}else
	{
		if(type == '0')
		{
			//caesar encrypt with a key(set to 0 so it can search for the proper key when it is running
			Caesar_encrypt(0);
		}else
		if(type == '1'){
			//caesar decrypt with a key(set to 0 so it can search for the proper key when it is running
			Caesar_decrypt(0);
		}
		else{
			//cracks a text by running through every possible iterration of the caesar cipher
			Caesar_crack();
		}
	}
}

function Caesar_encrypt(key){
	//gets the key if it is not a rot13
	if(key == 0)
	{
		key = document.getElementById("inputkey").value;
	}
	
	//gets the text and converts it to uppercase
	plaintext = document.getElementById("inputtext").value;
	plaintext = plaintext.toUpperCase();
	
	var message = "encrypting the text - " + plaintext + "with a key of -" + key;
	document.getElementById("OutputArea").innerHTML = message;
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
	document.getElementById("OutputArea").innerHTML = "encrypted message is :" +ciphertext;
}

//very similar to the encryption function however must have some small differences to allow it to be delbt with differently
function Caesar_decrypt(key){
	if(key == 0)
	{
		key = document.getElementById("inputkey").value;
	}
	ciphertext = document.getElementById("inputtext").value;
	ciphertext = ciphertext.toUpperCase();
	var message = "decrypting the text - " + ciphertext + "with a key of -" + key;
	document.getElementById("OutputArea").innerHTML = message;
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
	document.getElementById("OutputArea").innerHTML = "decrypted message is :" +plaintext;

}

function Caesar_crack(){
	ciphertext = document.getElementById("inputtext").value;
	ciphertext = ciphertext.toUpperCase();
	var message = "attempting to crack the text - " + ciphertext + "with all keys";
	document.getElementById("OutputArea").innerHTML = message;
	
	var plaintext = "<br>";
	var newletter = "";
	
	//follows the same decryption method as the decrypt funtion however it loops through every possible key in the characterset
	for(key in charset)
	{
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
		plaintext =plaintext + "<br>";
		document.getElementById("OutputArea").innerHTML = "decrypted message is :" +plaintext;
	}
}
var undefinedfound = 0;
//deals with the users choice of encyrption or decryption
function Subsitition(type){
	var alphamap = new Map();
	if(type == '0')
	{
		alphamap = setupalphaencrypt();
		Subsitition_encrypt(alphamap);
	}
	else
	if(type == '1'){
		alphamap = setupalphadecrypt();
		Subsitition_decrypt(alphamap);
	}
	
}
//sets up the map that will be used when encrypting text, this will mean that hte orgional alphabet will be the key and the new alphabet will be the value
function setupalphaencrypt(){
	var newalpha = document.getElementById("newalpha").value.toUpperCase();
	var orginalalpha = document.getElementById("orginalalpha").value.toUpperCase();
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
//sets up the map that will be used when decrypoting text, this will mean that the new alphabet will be the key and the orgional alphabet will be the value

function setupalphadecrypt(){
	
	var newalpha = document.getElementById("newalpha").value.toUpperCase();
	var orginalalpha = document.getElementById("orginalalpha").value.toUpperCase();
	var alphamap = new Map();
	if(newalpha.length==orginalalpha.length)
	{
		for(i = 0; i < orginalalpha.length;i++)
		{
			//adds to the map allowing it to be used later
			alphamap.set(newalpha[i],orginalalpha[i]);
		}
		return alphamap;
		
	}else
	{
		alert("Be aware your two alphabets are not the same length which might lead to some unexpected behaviour, however the program will still run");
		for(i = 0; i < orginalalpha.length;i++)
		{
			alphamap.set(newalpha[i],orginalalpha[i]);
		}
		return alphamap;
	}
}

//take in the alphamap that was returned and uses it to go through each character and find its new version from the tree
function Subsitition_encrypt(alphamap){
	undefinedfound = 0
	var plaintext = document.getElementById("inputtext").value.toUpperCase();
	var encryptedtext = "";
	//goes through each character checking for spaces, if there is one it just gets added, if there isnt it will search the tree for the key of that character and the value thats returned will be added to the encrypted text
	for(ch in plaintext)
	{
		if(plaintext[ch] == " ")
		{
			encryptedtext=encryptedtext+ " ";
		}else
		{
			if(alphamap.get(plaintext[ch]) == undefined)
			{
				undefinedfound =1;
				encryptedtext=encryptedtext+alphamap.get(plaintext[ch]);
			}else
			{
				encryptedtext=encryptedtext+alphamap.get(plaintext[ch]);
			}
		}
	}
	//outputs and alerts the user
	document.getElementById("Output_Area").innerHTML = "the encrypted text is " + encryptedtext ;
	if(undefinedfound == 1)
	{
		alert("one of the characters you enter is invalid,this will be displayed as undefined in your output!");
	}
}

//take in the alphamap that was returned and uses it to go through each character and find its new version from the tree, almost exactaly the same, in theory could have been implemented to be the exact same but spliting it up felt easier to look at
function Subsitition_decrypt(alphamap){	
	undefinedfound = 0
	var encryptedtext = document.getElementById("inputtext").value.toUpperCase();
	var plaintext = "";
	//same as the other one but goes through the encrypted text and adds it back in plain text then outputs and alerts the user
	for(ch in encryptedtext)
	{
		if(encryptedtext[ch] == " ")
		{
			plaintext=plaintext+ " ";
		}else
		{
			if(alphamap.get(encryptedtext[ch]) == undefined)
			{
				undefinedfound =1;
				plaintext=plaintext+alphamap.get(encryptedtext[ch]);
			}else
			{
				plaintext=plaintext+alphamap.get(encryptedtext[ch]);
			}
		}
		
	}
	document.getElementById("Output_Area").innerHTML = "the decrypted text is " + plaintext; 
	if(undefinedfound == 1)
	{
		alert("one of the characters you enter is invalid,this will be displayed as undefined in your output!");
	}
}
	
	
	
	
	
	
	
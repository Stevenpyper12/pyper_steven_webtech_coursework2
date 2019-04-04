//two maps defined globally as they are basically used for everything
var morsemap = new Map()
.set(".-","A")
.set("-...","B")
.set("-.-.","C")
.set("-..","D")
.set(".","E")
.set("..-.","F")
.set("--.","G")
.set("....","H")
.set("..","I")
.set(".---","J")
.set("-.-","K")
.set(".-..","L")
.set("--","M")
.set("-.","N")
.set("---","O")
.set(".--.","P")
.set("--.-","Q")
.set(".-.","R")
.set("...","S")
.set("-","T")
.set("..-","U")
.set("...-","V")
.set(".--","W")
.set("-..-","X")
.set("-.--","Y")
.set("--..","Z");

var alphamap = new Map()
.set("A",".-")
.set("B","-...")
.set("C","-.-.")
.set("D","-..")
.set("E",".")
.set("F","..-.")
.set("G","--.")
.set("H","....")
.set("I","..")
.set("J",".---")
.set("K","-.-")
.set("L",".-..")
.set("M","--")
.set("N","-.")
.set("O","---")
.set("P",".--.")
.set("Q","--.-")
.set("R",".-.")
.set("S","...")
.set("T","-")
.set("U","..-")
.set("V","...-")
.set("W",".--")
.set("X","-..-")
.set("Y","-.--")
.set("Z","--..");

//var context = new (window.AudioContext || window.webkitAudioContext)();
//var oscillator = context.createOscillator();
//context and oscillator also declared globally as they are useful throughout the entire of the morseconverter
var context;
var oscillator;
var undefinedfound = 0;
function morse(type)
{
	//allows the user to make the choices from teh buttons
	if(type == '0')
	{
		texttomorse();
	}else
	if(type == '1')
	{
		morsetotext();
	}else
	if(type == '2'){
		playmorse();
	}else
	{
		oscillator.stop();
	}
}
//converts users input text into morsecode
function texttomorse()
{
	undefinedfound = 0
	var plaintext = document.getElementById("inputtext").value.toUpperCase();
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
			if(alphamap.get(plaintext[ch]) == undefined)
			{
				undefinedfound = 1;
				morsetext=morsetext+alphamap.get(plaintext[ch]);
				morsetext=morsetext+ " ";
			}else
			{
				morsetext=morsetext+alphamap.get(plaintext[ch]);
				morsetext=morsetext+ " ";
			}
		}
	}
	 //prints ot the output and alerts the user if there was any issues
	document.getElementById("Output_Area").innerHTML = "the morse text is :" + morsetext;
	if(undefinedfound == 1)
	{
		alert("one of the characters you entered is invalid,this will be displayed as undefined in your output!");
	}
	return morsetext;

}
//somewhat similar to the text to morse this converts morse into text
function morsetotext()
{
	undefinedfound = 0
	var plaintext = "";
	var morsetext = document.getElementById("inputmorse").value.toUpperCase();
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
			if(morsemap.get(singlemorse) == undefined)
			{
				undefinedfound =1;
				plaintext=plaintext+morsemap.get(singlemorse);
				singlemorse="";
			}else
			{
				plaintext=plaintext+morsemap.get(singlemorse);
				singlemorse="";
			}
		}else
		{
			singlemorse = singlemorse+morsetext[ch];
		}

	}
	//deals with thje very last character which does not ahve a space after it and as such will not have been added to the plain text
	plaintext=plaintext+morsemap.get(singlemorse);
	document.getElementById("Output_Area").innerHTML = "the plaintext is :" + plaintext;
	if(undefinedfound == 1)
	{
		alert("one of the morse codes you enter is invalid,this will be displayed as undefined in your output!");
	}
}

function playmorse()
{
	context = new (window.AudioContext || window.webkitAudioContext)();
	oscillator = context.createOscillator();
	var gainNode = context.createGain();
	oscillator.connect(gainNode);
	gainNode.connect(context.destination);
	oscillator.frequency.value = 0;
	gainNode.gain.value = 0.05;
	oscillator.start(0);
	var morsetext = "";
	try{
		var morsetext = document.getElementById("inputmorse").value.toUpperCase();
	}
	catch{
		if(morsetext == "")
		{
			morsetext = texttomorse();
		}
	}
	var i = 0;
	var soundjustplayed = 0;
	
	var dashjustplayed = 0;
	
	var isfinished = setInterval(function()
	{
		if(soundjustplayed == 1)
		{
			if(morsetext[i-1] == "-" && dashjustplayed == 0)
			{
				dashjustplayed = 1;
			}else
			{
			oscillator.frequency.value = 0;
			soundjustplayed = 0;
			dashjustplayed = 0;
			}
		}else
		{
			if(i >= morsetext.length)
			{
				oscillator.frequency.value = 0;
				oscillator.stop();
				clearInterval(isfinished);
			}else
			{
			
				if(morsetext[i] == ".")
				{
					oscillator.frequency.value = 500;
					
					
				}else
				if(morsetext[i] == "-"){
					oscillator.frequency.value = 500;
					
					
				}else
				{
					oscillator.frequency.value = 0;
					
					
				}
			}
			i++;
			soundjustplayed = 1;
		}
	},500);
}	


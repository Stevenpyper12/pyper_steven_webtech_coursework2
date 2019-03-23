//allows the user to select how they would lik the script to behave, with the choices depending on which cipher is being used


function changemethod()
{
	//the method will be on every page with a cipher therefor it does not need  to be inside the try
	var selectedmethod = document.getElementById("selectmethodbox").value;
	try{
	var selectedCypher = document.getElementById("selectbox").selectedIndex;
	}catch{
	}finally
	{
		
	//GOOD IDEA FOR SPLITING THIS PER PAGE WOULD BE TO USE A || TITLE = " CIPHER NAME"
		
		//implemented the idea above allowing for this to deal with either having the changecipher module or deal with not having it.
		//all of this section looks for wihch cipher will be used, then which method the user has selected, and then will output everything that is required for ther user to properly enter information
		
		//gives the oiptions for the caesar and rot cipher
		if(selectedCypher == 1||document.title == "Caesar Cipher Rot13"){
		
			if(selectedmethod == 1)
			{
				document.getElementById("InputArea").innerHTML = "<p>enter text you want encrypted<br><input type='text' id='inputtext' value=''></p>";
				document.getElementById("InputArea").innerHTML += "<p>enter how many times you want the alphabet offset(key)<br><input type='text' id='inputkey' value=''></p>";
				document.getElementById("InputArea").innerHTML += "<p><button onclick='Caesar(\"0\",1)'>Encrypt</button></p>";

			}else
			if(selectedmethod == 2){
				document.getElementById("InputArea").innerHTML = "<p>enter text you want decrypted<br><input type='text' id='inputtext' value=''></p>";
				document.getElementById("InputArea").innerHTML += "<p>enter the key used to encrypt the text<br><input type='text' id='inputkey' value=''></p>";
				document.getElementById("InputArea").innerHTML += "<p><button onclick='Caesar(\"1\",1)'>Decrypt</button></p>";
	
			}else
			if(selectedmethod == 3){
				document.getElementById("InputArea").innerHTML = "<p>enter text you want to try and decrypt<br><input type='text' id='inputtext' value=''></p>";
				document.getElementById("InputArea").innerHTML += "<p><button onclick='Caesar(\"2\",1)'>Crack</button></p>";
			}else
			if(selectedmethod == 4){
				document.getElementById("InputArea").innerHTML = "<p>enter text you want encrypted<br><input type='text' id='inputtext' value=''></p>";
				document.getElementById("InputArea").innerHTML += "<p><button onclick='Caesar(\"3\",0)'>Encrypt</button></p>";

			}
			else
			{
				document.getElementById("InputArea").innerHTML = "<p>enter text you want decrypted<br><input type='text' id='inputtext' value=''></p>";
				document.getElementById("InputArea").innerHTML += "<p><button onclick='Caesar(\"4\",0)'>Decrypt</button></p>";
			}
		}else
		//gives the options for the subsitution cipher	
		if(selectedCypher == 2||document.title == "Subsituation Cipher")	
		{
			if(selectedmethod == 1)
			{
				document.getElementById("InputArea").innerHTML = "<p>Enter the proper version of the alphabet(no duplicates)<br><input type='text' id='orginalalpha' value=''></p>";
				document.getElementById("InputArea").innerHTML += "<p>Enter Your version of the Alphabet(key)(no duplicates)<br><input type='text' id='newalpha' value=''></p>";
				document.getElementById("InputArea").innerHTML += "<p>enter the text you want converted<br><input type='text' id='inputtext' value=''></p>";
				document.getElementById("InputArea").innerHTML += "<p><button onclick='Subsitition(\"0\")'>Setup New Alphabet and encrypt</button></p>"	;
			}else
			{
				document.getElementById("InputArea").innerHTML = "<p>Enter the original version of the alphabet(no duplicates)<br><input type='text' id='orginalalpha' value=''></p>";
				document.getElementById("InputArea").innerHTML += "<p>Enter Your modified version of the Alphabet(key)(no duplicates)<br><input type='text' id='newalpha' value=''></p>";
				document.getElementById("InputArea").innerHTML += "<p>Enter the text you want converted<br><input type='text' id='inputtext' value=''></p>";
				document.getElementById("InputArea").innerHTML += "<p><button onclick='Subsitition(\"1\")'>setup old alphabet and decrypt</button></p>"	;

			}
		}else
			//gives the options for the morse code stuff
		{
			if(selectedmethod == 1)
			{
				document.getElementById("InputArea").innerHTML = "<p>enter the text you want converted into morse<br><input type='text' id='inputtext' value=''></p>";
				document.getElementById("InputArea").innerHTML += "<button onclick='morse(\"0\")'>convert text to morse</button>";
				document.getElementById("InputArea").innerHTML += "<button onclick='morse(\"2\")'>play converted morse as sound</button>";
				document.getElementById("InputArea").innerHTML += "<button onclick='morse(\"3\")'>Stop Sound</button>"	
			}else
			{
				document.getElementById("InputArea").innerHTML = "<p>enter the morse you want converted into text<br>between each letter leave one space, between words leave 3 spaces! for example .- .-&nbsp;&nbsp;&nbsp.- will translate to AA A<br><input type='text' id='inputmorse' value=''></p>";
				document.getElementById("InputArea").innerHTML += "<button onclick='morse(\"1\")'>convert morse to text</button>";	
				document.getElementById("InputArea").innerHTML += "<button onclick='morse(\"2\")'>play morse as sound</button>";	
				document.getElementById("InputArea").innerHTML += "<button onclick='morse(\"3\")'>Stop Sound</button>";
			}			
		
		}
	}
}
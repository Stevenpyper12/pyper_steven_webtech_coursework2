//This Module deals with the users choice of modules, this is mostly unused for the website however was used for testing it when it was on one page, could still be used on a new page if required

//used to choose between all of the ciphers that have been implemented, look for the select box
function changecipher(){
	//used to stop it freaking out if there isnt a selectbox(which is now the case with most of the webpages)
	try{
		var selectedCypher = document.getElementById("selectbox").selectedIndex;
	}catch
	{

	}finally
	{
		if(selectedCypher == 1 || document.title == "Caesar Cipher Rot13"){
			Caesarselected();
		}else
		if(selectedCypher == 2||document.title == "Subsituation Cipher")	
		{
			Subsititionselected();
		}else
		{
			Morseselected();
		}
	}
}
//adds selection box depending on which one is selected(or based on the page that is selected)

function Caesarselected(){

	document.getElementById("MethodSelector").innerHTML = "<select id = 'selectmethodbox' onchange='changemethod();'><option value='0' selected disabled>Please Chose Your Cipher Method</option><option value='1'>Encrypt</option><option value='4'>ROT13 Encrypt</option></select>";
	
}

function Subsititionselected(){
	document.getElementById("MethodSelector").innerHTML = "<select id = 'selectmethodbox' onchange='changemethod();'><option value='0' selected disabled>Please Chose Your Cipher Method</option><option value='1'>Encrypt</option></select>";

}

function Morseselected(){
	document.getElementById("MethodSelector").innerHTML = "<select id = 'selectmethodbox' onchange='changemethod();'><option value='0' selected disabled>Please Chose Your Cipher Method</option><option value='1'>Convert To Morse</option></select>";
}
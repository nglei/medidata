var inputUsername = document.getElementById("username");
var inputPassword = document.getElementById("inputPass");

function validation() {
	
	validUsername();
	validPassword();
	
	if(validUsername()){
		if(validPassword()){
			return true;
		}
	}
	return false;
	
	function validUsername() {
		if(inputUsername.value == ""){
			document.getElementById("errorUser").innerHTML ="Username not found";
			inputUsername.style.borderColor="red";
			return false;
		}else{
			return true;
		}
	}
	
	function validPassword() {
		if(inputPassword.value == "") {
			document.getElementById("errorPass").innerHTML = "Invalid Password";
			inputPassword.style.borderColor="red";
			return false;
		}else {
			return true;
		}
	}
	
}
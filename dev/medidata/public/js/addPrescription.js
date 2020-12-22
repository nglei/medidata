var description = document.getElementById("description");
var title = document.getElementById("pTitle");

function validation() {
	
	validTitle();
	validDescription();
	
	if(validTitle()){
		if(validDescription()){
			return true;
		}}
	return false;
	
	function validDescription() {
		if(description.value == ""){
			document.getElementById("errorDescription").innerHTML ="Description cannot be empty";
			description.style.borderColor="red";
			return false;
		}else{
			return true;
		}
	}
	
	function validTitle() {
		if(title.value == "") {
			document.getElementById("errorpTitle").innerHTML = "Title cannot be empty";
			title.style.borderColor="red";
			return false;
		}else {
			return true;
		}
	}
	
}
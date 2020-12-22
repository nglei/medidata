var username = document.getElementById("username");
var email = document.getElementById("email");
var inPassword = document.getElementById("password");
var confirmPass = document.getElementById("cpassword");
var fullName = document.getElementById("name");
var idNo = document.getElementById("idno");
var date = document.getElementById("date");
var gender = document.getElementById("gender");
var nationality = document.getElementById("nationality");
var occupation = document.getElementById("occupation");
var bloodType = document.getElementById("bloodType");
var mobileNo = document.getElementById("contact");
var address = document.getElementById("address");
var eContact = document.getElementById("eContact");
var eContactName = document.getElementById("eContactName");

var drop = document.getElementById("dropdown");
var drop1 = document.getElementById("dropdown-1");

function validation(){

	var selectGender = gender[gender.selectedIndex].value;
	var selectBloodType = bloodType[bloodType.selectedIndex].value;

	validUser();
	validEmail();
	validPassword();
	validConfirmPass();
	validName();
	validIDNo();
	validDate();
	validGender();
	validNationality();
	validOccupation();
	validBloodType();
	validContact();
	validAddress();
	validEContact();
	validEmerContactName();

	if(validUser()){
		if(validEmail()){
			if(validPassword()){
				if(validConfirmPass()){
					if(validName()){
						if(validIDNo()){
							if(validDate()){
								if(validGender()){
									if(validNationality()){
										if(validOccupation()){
											if(validBloodType()){
												if(validContact()){
													if(validAddress()){
														if(validEContact()){
															if(validEmerContactName()){
		return true;
	}}}}}}}}}}}}}}}
	return false;

	function validUser(){
		if(username.value == ""){
			document.getElementById("errorUsername").innerHTML="Please enter a username";
			username.style.borderColor="red";
			username.focus();
			return false;
		}else if(username.value.length < 5){
			document.getElementById("errorUsername").innerHTML="Username should be between 5-15 characters";
			username.style.borderColor="red";
			username.focus();
			return false;
		}
		return true;
	}

	function validEmail(){
	if(email.value == ""){
		document.getElementById("errorEmail").innerHTML="Please enter your email";
        email.style.borderColor="red";
		email.focus();
		return false;
	}else{
		return true;
	}}

	function validPassword(){

	if(inPassword.value == ""){
		document.getElementById("errorPass").innerHTML="Please enter a password";
        inPassword.style.borderColor="red";
		inPassword.focus();
		return false;
	}else if(inPassword.value.length < 8){
		document.getElementById("errorPass").innerHTML="Must have at least 8 characters";
        inPassword.style.borderColor="red";
		inPassword.focus();
		return false;
	}
	else{
		return true;
	}}

	//validate Confirm Password
	function validConfirmPass(){
	if(confirmPass.value == ""){
		document.getElementById("errorCPass").innerHTML="Please enter a password";
        confirmPass.style.borderColor="red";
		confirmPass.focus();
		return false;
	}else if(confirmPass.value != inPassword.value){
		document.getElementById("errorCPass").innerHTML="Password not match";
        confirmPass.style.borderColor="red";
		confirmPass.focus();
		return false;
	}
	else{
		return true;
	}}

	function validName(){
	if(fullName.value == ""){
		document.getElementById("errorName").innerHTML="Please enter your name";
        fullName.style.borderColor="red";
		fullName.focus();
		return false;
	}else{
		return true;
	}}

	function validIDNo(){

		var idnoFormat = /^\(?([0-9]{6})\)?[-]?([0-9]{2})[-]?([0-9]{4})$/;

	if(idNo.value == ""){
		document.getElementById("errorIDNo").innerHTML="Please enter your NRIC No";
        idNo.style.borderColor="red";
		idNo.focus();
		return false;
	}/*else if(!(idNo.value.match(idnoFormat))) {
		document.getElementById("errorIDNo").innerHTML="Invalid NRIC NO. format";
		idNo.style.borderColor="red";
		idNo.focus();
		return false;
	}*/
	else{
		return true;
	}}

	function validDate(){
			if(date.value == ""){
				document.getElementById("errorDate").innerHTML="Please fill up the date";
				date.style.borderColor="red";
				date.focus();
				return false;
			}
			else{
				return true;
			}
		}

	function validGender(){
		if(selectGender == "default"){
			document.getElementById("errorGender").innerHTML="Please choose your gender";
			drop.style.borderColor="red";
			drop.focus();
			return false;
		}
		else{
			return true;
		}}

	function validNationality(){
	if(nationality.value == ""){
		document.getElementById("errorNationality").innerHTML="Please enter your Nationality";
        nationality.style.borderColor="red";
		nationality.focus();
		return false;
	}else{
		return true;
	}}

	function validOccupation(){
	if(occupation.value == ""){
		document.getElementById("errorOccupation").innerHTML="Please enter your Occupation";
        occupation.style.borderColor="red";
		occupation.focus();
		return false;
	}else{
		return true;
	}}

	function validBloodType(){
		if(selectBloodType == "default"){
			document.getElementById("errorBlood").innerHTML="Please choose your blood type";
			drop1.style.borderColor="red";
			drop1.focus();
			return false;
		}
		else{
			return true;
		}}

	function validContact(){
		var phoneno = /^\(?([0-9]{3})\)?[-]?([0-9]{7})$/;
		var phoneno2 = /^\(?([0-9]{3})\)?[-]?([0-9]{8})$/;
	if(mobileNo.value == ""){
		document.getElementById("errorContact").innerHTML="Please enter your contact number";
        mobileNo.style.borderColor="red";
		mobileNo.focus();
		return false;
	}else if(!(mobileNo.value.match(phoneno) || mobileNo.value.match(phoneno2))) {
		document.getElementById("errorContact").innerHTML="Invalid mobile number format";
		mobileNo.style.borderColor="red";
		mobileNo.focus();
		return false;
	}
	else{
		return true;
	}}

	function validAddress(){
	if(address.value == ""){
		document.getElementById("errorAddress").innerHTML="Please enter your address";
        address.style.borderColor="red";
		address.focus();
		return false;
	}else{
		return true;
	}}

	function validEContact(){
		var phoneno = /^\(?([0-9]{3})\)?[-]?([0-9]{7})$/;
		var phoneno2 = /^\(?([0-9]{3})\)?[-]?([0-9]{8})$/;
	if(eContact.value == ""){
		document.getElementById("errorEContact").innerHTML="Please enter your emergency contact number";
        eContact.style.borderColor="red";
		eContact.focus();
		return false;
	}else if(!(eContact.value.match(phoneno) || eContact.value.match(phoneno2))) {
		document.getElementById("errorEContact").innerHTML="Invalid mobile number format";
		eContact.style.borderColor="red";
		eContact.focus();
		return false;
	}
	else{
		return true;
	}}

	function validEmerContactName(){
	if(eContactName.value == ""){
		document.getElementById("errorEmerContactName").innerHTML="Please enter your emergency contact number's name";
        eContactName.style.borderColor="red";
		eContactName.focus();
		return false;
	}else{
		return true;
	}}
}

username.onkeyup = function(){
	if(username.value.length >= 5 && username.value.length <=15){
		username.style.borderColor="#ccc";
		document.getElementById("errorUsername").innerHTML="";

	}
	else if(username.value == ""){
		document.getElementById("errorUsername").innerHTML="Please enter a username";
        username.style.borderColor="red";
	}
	else if(username.value.length < 5 || username.value.length > 15){
		document.getElementById("errorUsername").innerHTML="Username should be between 5-15 characters";
        username.style.borderColor="red";
	}
}

email.onkeyup = function(){
	if(email.value != ""){
		document.getElementById("errorEmail").innerHTML="";
        email.style.borderColor="#ccc";
	}
	else if(email.value == ""){
		document.getElementById("errorEmail").innerHTML="Please enter your email";
        email.style.borderColor="red";
	}
}

inPassword.onkeyup = function(){
	if(inPassword.value.length >=8){
		document.getElementById("errorPass").innerHTML="";
        inPassword.style.borderColor="#ccc";
	}
	else if(inPassword.value == ""){
		document.getElementById("errorPass").innerHTML="Please enter a password";
        inPassword.style.borderColor="red";
	}else if(inPassword.value.length < 8){
		document.getElementById("errorPass").innerHTML="Must have at least 8 characters";
        inPassword.style.borderColor="red";
	}
}

confirmPass.onkeyup = function(){
	if(confirmPass.value == inPassword.value){
		document.getElementById("errorCPass").innerHTML="";
        confirmPass.style.borderColor="#ccc";
	}
	else if(confirmPass.value == ""){
		document.getElementById("errorCPass").innerHTML="Please enter a password";
        confirmPass.style.borderColor="red";
	}else if(confirmPass.value != inPassword.value){
		document.getElementById("errorCPass").innerHTML="Password not match";
        confirmPass.style.borderColor="red";
	}
}

fullName.onkeyup = function(){
	if(fullName.value != ""){
		document.getElementById("errorName").innerHTML="";
		fullName.style.borderColor="#ccc";
	}
	else if(fullName.value == ""){
		document.getElementById("errorName").innerHTML="Please enter your name";
        fullName.style.borderColor="red";
	}
}

idNo.onkeyup = function(){
	var phoneno = /^\(?([0-9]{6})\)?[-]?([0-9]{2})[-]?([0-9]{4})$/;
	/*if(idNo.value != ""){
		document.getElementById("errorIDNo").innerHTML="";
        idNo.style.borderColor="#ccc";
	}
	else if(idNo.value == ""){
		document.getElementById("errorIDNo").innerHTML="Please enter your NRIC NO.";
        idNo.style.borderColor="red";
	}*/
	if(idNo.value.match(phoneno)){
		document.getElementById("errorIDNo").innerHTML="";
        idNo.style.borderColor="#ccc";
	}
	else if(idNo.value == ""){
		document.getElementById("errorIDNo").innerHTML="Please enter your NRIC NO.";
        idNo.style.borderColor="red";
	}else if(!(idNo.value.match(phoneno))) {
		document.getElementById("errorIDNo").innerHTML="Invalid NRIC NO. format";
		idNo.style.borderColor="red";
		return false;
	}
}

date.onkeyup = function(){
	if(date.value!=""){
		document.getElementById("errorDate").innerHTML="";
		date.style.borderColor="#ccc";
	}
}

gender.onchange = function(){
	var selectGender = gender[gender.selectedIndex].value;
	if(selectGender != "default"){
		document.getElementById("errorGender").innerHTML="";
		drop.style.borderColor="#ccc";
	}
}

bloodType.onchange = function(){
	var selectBlood = bloodType[bloodType.selectedIndex].value;
	if(selectBlood != "default"){
		document.getElementById("errorBlood").innerHTML="";
		drop1.style.borderColor="#ccc";
	}
}

nationality.onkeyup = function(){
	if(nationality.value != ""){
		document.getElementById("errorNationality").innerHTML="";
		nationality.style.borderColor="#ccc";
	}
	else if(nationality.value == ""){
		document.getElementById("errorNationality").innerHTML="Please enter your nationality";
        nationality.style.borderColor="red";
	}
}

occupation.onkeyup = function(){
	if(occupation.value != ""){
		document.getElementById("errorOccupation").innerHTML="";
		occupation.style.borderColor="#ccc";
	}
	else if(occupation.value == ""){
		document.getElementById("errorOccupation").innerHTML="Please enter your occupation";
        occupation.style.borderColor="red";
	}
}

mobileNo.onkeyup = function(){
	var phoneno = /^\(?([0-9]{3})\)?[-]?([0-9]{7})$/;
	var phoneno2 = /^\(?([0-9]{3})\)?[-]?([0-9]{8})$/;
	if(mobileNo.value.match(phoneno) || mobileNo.value.match(phoneno2)){
		document.getElementById("errorContact").innerHTML="";
        mobileNo.style.borderColor="#ccc";
	}
	else if(mobileNo.value == ""){
		document.getElementById("errorContact").innerHTML="Please enter your contact number";
        mobileNo.style.borderColor="red";
	}else if(!(mobileNo.value.match(phoneno) || mobileNo.value.match(phoneno2))) {
		document.getElementById("errorContact").innerHTML="Invalid mobile number format";
				mobileNo.style.borderColor="red";
		return false;
	}
}

address.onkeyup = function(){
	if(address.value != ""){
		document.getElementById("errorAddress").innerHTML="";
		address.style.borderColor="#ccc";
	}
	else if(address.value == ""){
		document.getElementById("errorAddress").innerHTML="Please enter your address";
        address.style.borderColor="red";
	}
}

eContact.onkeyup = function(){
	var phoneno = /^\(?([0-9]{3})\)?[-]?([0-9]{7})$/;
	var phoneno2 = /^\(?([0-9]{3})\)?[-]?([0-9]{8})$/;
	if(eContact.value.match(phoneno) || eContact.value.match(phoneno2)){
		document.getElementById("errorEContact").innerHTML="";
        eContact.style.borderColor="#ccc";
	}
	else if(eContact.value == ""){
		document.getElementById("errorEContact").innerHTML="Please enter your emergency contact number";
        eContact.style.borderColor="red";
	}else if(!(eContact.value.match(phoneno) || eContact.value.match(phoneno2))) {
		document.getElementById("errorEContact").innerHTML="Invalid mobile number format";
		eContact.style.borderColor="red";
		return false;
	}
}

eContactName.onkeyup = function(){
	if(eContactName.value != ""){
		document.getElementById("errorEmerContactName").innerHTML="";
		eContactName.style.borderColor="#ccc";
	}
	else if(eContactName.value == ""){
		document.getElementById("errorEmerContactName").innerHTML="Please enter your emergency contact number's name";
        eContactName.style.borderColor="red";
	}
}

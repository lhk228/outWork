function checkPassword(){
	if(pas1.value.length ==0 || pas2.value.length == 0 ) {result.innerText = ''}else{
	result.innerText = pas1.value == pas2.value ? 'Matching' : 'Not Matching';
	if(result.innerText == "Matching"){
	document.getElementById("result").style.color = "var(--mint)"
}else{
	document.getElementById("result").style.color = "var(--red)"
}}}

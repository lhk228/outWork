// my_info.js : 내 정보 스크립트
//-- 내정보 채우기
function writeUserData()
{
	console.log("USER_INFO :",USER_INFO)
	$("#P_NICKNAME").val(`${USER_INFO.UserNickname}`);
	$("#P_ID").text(`(${USER_INFO.Account})`);
	$("#INPUT_CON_EMAIL").val(`${USER_INFO.Email}`);
	$("#INPUT_CON_PHONE").val(`${USER_INFO.Phone}`);
  $("#MY_MEVER_ACCOUNT").text(`${USER_INFO.UserNickname} (${USER_INFO.Account})`);
	$("#MY_MEVER_POINT").text(`${numberWithCommas(USER_INFO.Coin)}`);

	if(USER_INFO.Profile != "0"){$("#MY_PROFILE_IMG").attr("src",USER_INFO.Profile);}
}
// my_info.js : 내 정보 스크립트 END

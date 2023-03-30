let LOGIN_STATE = false; //로그인 유저정보 가져와서 담기

$(function(){
	//-- 로그인메뉴버튼 클릭시 : 로그인 팝업 오픈
	$("#BTN_POP_LOGIN").click(()=>{loginPopup();});

	//-- 내 지갑 버튼 클릭
	$("#BTN_POP_WALLET").click(()=>{profilePopup()});

	//-- 하단 프로필팝업 바깥 클릭시 닫기
	$("#FOOTER_VIEW").not("#PROFILE_MENU").click(function(){
		profilePopup();
	});
});

//-- 프로필메뉴 팝업
function profilePopup()
{
	
	let display = $("#FOOTER_VIEW").css("display");
	let profile = $("#PROFILE_MENU").css("display");

	//프로필메뉴 없고 모달창도 없으면 > 보여준다
	if(display == "none" && profile == "none")
	{
		console.log("profile메뉴 보여주기")
		$("#FOOTER_VIEW").fadeIn(300);
		$("#FOOTER_VIEW").removeClass().addClass("flex-column-end"); 
		$("#PROFILE_MENU").slideToggle();
	}

	else
	{
		console.log("profile메뉴 없애기")
		$("#FOOTER_VIEW").fadeOut(300);
		$("#FOOTER_VIEW").removeClass().addClass("flex-column-end"); //프로필 보여줘야해서 하단정렬함
		$("#PROFILE_MENU").hide(0);
	}
}

//--로그인 팝업
function loginPopup()
{
	popupLoader(`popup_login`)

	let display = $("#FOOTER_VIEW").css("display");
	let login	  = $("#LOGIN_POPUP").css("display");

	//둘 다 안보이면 > 보여준다
	if(display == "none" && login == "none")
	{
		console.log("로그인팝업 보여주기")
		$("#FOOTER_VIEW").fadeIn(300);
		$("#FOOTER_VIEW").removeClass().addClass("flex-column-center"); 
		$("#LOGIN_POPUP").show(0);
	}

	else

	{
		console.log("로그인팝업 안보여주기");
		$("#FOOTER_VIEW").fadeOut(300);
		$("#FOOTER_VIEW").removeClass().addClass("flex-column-center");
		$("#LOGIN_POPUP").hide(0);
	}
}

//-- 로그인 확인
function loginConfirm()
{
	let Account = $("#INPUT_ID").val();
	let Passcode = $("#INPUT_PW").val();
	let data	 = { Account:Account, Passcode:Passcode };

	api_post('loginuser',data);
}

//-- 회원가입
function memberJoin()
{
	let Account				= $("#INPUT_JOIN_ID").val();
	let Passcode 			= $("#INPUT_JOIN_PW").val();
	let UserNickname 	= $("#INPUT_JOIN_NICK").val();
	let Phone					= $("#INPUT_JOIN_PHONE").val();
	let Recommend 		= $("#INPUT_JOIN_RECOMMEND").val();
	let Email 				= $("#INPUT_JOIN_EMAIL").val();

  let data	 = { UserNickname, Account, Passcode, Email, Phone, Recommend };
  if(Account && Passcode && UserNickname && Phone )
  {
    api_post('joinuser',data);
  }
  else
  {
    customAlert("회원가입","입력되지 않은 항목이 있습니다","notice");
  }

}
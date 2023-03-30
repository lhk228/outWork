//서버 URL
axios.defaults.baseURL = 'https://api.mever.me/api/v1/';
// axios.defaults.baseURL = 'https://99bar.shop/api/v1/';
axios.defaults.withCredentials = false; // withCredentials 전역 설정

//전역 데이터 저장
let TOTAL_LIST  = null;			//전체 매물 목록
let BIND_LIST	  = null;			//전체 > 하위매물목록
let USER_INFO   = null;			//로그인 정보
let TOKEN 		  = null;			//토큰 정보
let MY_TRANSFER = null;			//환전신청내역
let MY_ASSET 	  = null;			//내 자산 정보
let MY_PRESELL  = null;			//내 분양신청목록
let NOTICE_DATA = null;			//공지사항
let SELECT_ASSET= null;			//선택 매물번호
let TRADE_LIST	= null;			//거래기록
let CART_LIST		= null;			//장바구니 목록
let SELECT_MY_ASSET = null; //선택한 내 매물
let SELECT_CART_LIST = new Array(); //선택한 카트 리스트
let POPUP = null;	//현재 팝업 정보
let PAGE = null;	//현재 페이지 정보



//-- 서버 get 요청 통합
function api_get(url)
{
	let loading = setInterval(()=>{loadingScreen("on");},100);

	axios.get(url).then((res) => {
		
	let result = res.data;
		
	switch(url)
	{
		case "allspace":TOTAL_LIST = result.Items; makeTotalList(TOTAL_LIST);makeStreetItemList(); break;
		default:break;
	}

	})
	.catch((err) => {console.log("get err :",err);})
	.finally(() => {clearInterval(loading); loadingScreen("off");});
}

//파일 업로드
function fildUpload(formData)
{
	console.log("fildUpload formData :",formData);

	$.ajax({
		url: "http://market.mever.me/uploads", // 파일 업로드 요청 URL
		data : formData,
		type:'POST',
		contentType:false,
		cache:false,
		processData:false,
		success:function(data){console.log("suc :",data)},
		error:function(e){console.log("eeee :",e)}
	})

};

//-- 서버 post 요청 통합
function api_post(url, data)
{
	let loading = setInterval(()=>{loadingScreen("on");},100);

	console.log("post url/data :",url, data);
	
	if(url == "mailauthend"){data.KeyCode = Number(data.KeyCode)}
	axios.post(url, data)
	.then((res) => {
		let result = res.data;
		let Items  = result.Items;
		let Err 	 = result.ErrorCode;
		console.log("post url/result :",url, result);
    

		// if(url != 'assetpresellmaxprice')$("#POPUP_VIEW").hide(); //팝업닫기
		// if(url != 'mailauthstart')$("#POPUP_VIEW").hide(); //팝업닫기
    if(Err == 0)
    {
      switch(url)
      {
        case "loginuser"	  				 : USER_INFO = result.Info; loginManager(result); popupControl("HIDE"); break;			//로그인
        case "joinuser"	  					 : joinManager(result); popupControl("HIDE"); break;																//회원가입
        case "spaceasset" 					 : BIND_LIST = Items; console.log("BIND_LIST :",BIND_LIST); makeItemBindList(BIND_LIST); popupControl("HIDE"); break;		//건물 하위목록 가져오기
        case "userasset"	  				 : MY_ASSET = Items; console.log("MY_ASSET :",MY_ASSET); makeMyAssetListTable(MY_ASSET); break;		//자산목록
        case "mytransfer"	  				 : MY_TRANSFER = Items; makeChargeListTable(Items); popupControl("HIDE");break;			//포인트 전환 내역
        case "deposit"	  					 : api_post('mytransfer',{ Token:TOKEN }); popupControl("HIDE"); break;							//충전신청
        case "withdraw"							 : api_post('mytransfer',{ Token:TOKEN }); popupControl("HIDE"); break;							//환전신청
        case "assetbuy"							 : api_post('userasset', { Token:TOKEN }); popupControl("HIDE"); break;			  			//매수
        case "assetsell"						 : api_post('userasset', { Token:TOKEN }); popupControl("HIDE"); break;							//매도
        case "assetpresell"					 : popupControl("HIDE"); break;				//분양신청
        case "mypreselllist"				 : MY_PRESELL = Items; makePresellListTable(Items); popupControl("HIDE");break;	//내 분양신청목록
        case "assetpresellmaxprice"	 : if(result.MaxPrice == 0){ result.MaxPrice = 50000 } PARENT.find("#INPUT_MAX_PRICE").val(numberWithCommas(result.MaxPrice));break;	//분양신청최고가 조회
		case "phoneauthstart/notoken": PARENT.find("#BTN_PHONE_ACCESS").removeClass("disable"); customAlert("핸드폰 문자메세지를 확인해주세요");break; //문자 인증요청(첫회원가입)
		case "phoneauthend/notoken"  : PARENT.find("#INPUT_PHONE_ACCESS").val("인증완료").attr("readonly",true); $("#BTN_PHONE_ACCESS").addClass('disable'); customAlert("문자인증 완료"); break; //문자 인증확인(첫회원가입)
		case "phoneauthstart" 			 : customAlert("핸드폰 문자메세지를 확인해주세요");break; //문자 인증요청(회원정보 변경)
		case "phoneauthend" 				 : customAlert("인증완료","핸드폰 번호가 변경되었습니다","ok",1000);  api_post("userinfo",{Token:TOKEN}); popupControl("HIDE");break; //문자 인증확인(회원정보변경)
        case "mailauthstart"				 : customAlert("인증코드가 발송되었습니다. <br>미수신시 스팸메일함을 확인해주세요");break; //이메일 인증요청
        case "mailauthend"					 : customAlert("이메일 변경완료"); api_post("userinfo",{Token:TOKEN});break; //이메일 인증확인(인증번호 입력 > 인증된 이메일로 갱신)
        case "editusernickname"			 : api_post("userinfo",{Token:TOKEN}); popupControl("HIDE"); break; 				 //닉네임 변경
        case "edituserphone"				 : api_post("userinfo",{Token:TOKEN}); popupControl("HIDE"); break; 				 //연락처 변경
        case "edituserpaycode"			 : api_post("userinfo",{Token:TOKEN}); popupControl("HIDE"); break; 				 //결제비밀번호 변경
        case "edituserpasscode"			 : api_post("userinfo",{Token:TOKEN}); popupControl("HIDE"); break; 				 //비밀번호 변경
        case "edituser"							 : if(LOGIN_STATE){ pageLoader("my_page"); } popupControl("HIDE");break;		 //회원정보수정모드로 진입시 확인
        case "userinfo"							 : USER_INFO = result.Info; writeUserData(); popupControl("HIDE");break; //내정보 갱신
        case "edituserprofile"			 : api_post("userinfo",{Token:TOKEN}); popupControl("HIDE");break; //프로필 이미지 설정
        case "editusericon"					 : api_post("userinfo",{Token:TOKEN}); popupControl("HIDE");break; //아이콘 설정
        case "assetrecord"					 : TRADE_LIST = Items; popupLoader('popup_detail_info'); break; //거래기록 가져오기 (admin)
        case "asseticonurl"					 : api_post('userasset', { Token:TOKEN }); customAlert("매물정보가 변경되었습니다");break; 							//매물정보 업데이트(URL,아이콘);
        case "":break; //회원목록 가져오기 (admin)
        case "":break; //환전신청 승인, 거절 (admin)
        case "":break; //추천인 유효여부 확인 (가입시사용)
      }
    }
		else { 
			if(Err != 0){ 
				let msg = '';
				switch(Err)
				{
					case 1 :  msg = '회원정보를 찾을 수 없습니다';break;
					case 2 :  msg = '비밀번호가 틀렸습니다';break;
					case 3 :  msg = '토큰이 유효하지 않습니다';break;
					case 4 :  msg = '조회된 내역이 없습니다';break;
					case 5 :  msg = '매물정보가 없습니다';break;
					case 6 :  msg = '매물정보가 일치하지 않습니다';break;
					case 7 :  msg = '매물정보가 없습니다';break;
					case 8 :  msg = '이미 거래완료된 매물입니다';break;
					case 9 :  msg = '거래중인 매물이 아닙니다';break;
					case 10 : msg = '보유금액이 부족합니다. 금액을 확인해주세요';break;
					case 11 : msg = '가격오류';break;
					case 12 : msg = '데이터(매개변수)가 잘못되었습니다';break;
					case 13 : msg = '분양중인 매물이 아닙니다';break;
					case 14 : msg = '키가 만료되었습니다';break;
					case 15 : msg = '키값이 유효하지 않습니다';break;
					case 16 : msg = '2차 비밀번호가 틀렸습니다';break;
					case 17 : msg = '회원정보수정권한 오류';break;
					case 18 : msg = '회원정보수정권한 만료';break;
					case 19 : msg = '닉네임을 확인해주세요';break;
					case 20 : msg = '전화번호가 잘못되었습니다';break;
					case 21 : msg = '2차비밀번호가 잘못되었습니다';break;
					case 22 : msg = '비밀번호가 잘못되었습니다';break;
					case 23 : msg = '유효하지 않은 프로필';break;
					case 24 : msg = '유효하지 않은 아이콘';break;
					case 25 : msg = '본인을 추천할 수 없습니다';break;
					case 26 : msg = '계정정보가 유효하지 않습니다';break;
					case 27 : msg = '인증번호가 잘못되었습니다';break;
					case 28 : msg = '전화번호 인증이 필요합니다';break;
					case 29 : msg = '전화번호는 숫자만 입력해야합니다';break;
					case 30 : msg = '인증문자 발송 실패';break;					
					case 97 : msg = '중복된 이메일입니다';break;
					case 98 : msg = '중복된 전화번호입니다';break;
					case 99 : msg = '중복된 아이디입니다';break;
				}
				customAlert(`에러코드 ${Err}`, `${msg} <br>관리자에게 문의해주세요`,'alert');}
			
		}
	})
	.catch((err) => {console.log("post err :",url,err);})
	.finally(() => {clearInterval(loading); loadingScreen("off");});

  $('#PAGE_VIEW').getNiceScroll().resize();
	return;
}

//로그인 상태관리
function loginManager(result)
{

	console.log("loginResult :",result);
	let errCode = result.ErrorCode;

	//로그인 성공
	if(errCode == 0)
	{
		LOGIN_STATE = true;
		
		$("#POPUP_VIEW").fadeOut(); //팝업들 없애기
		customAlert("로그인 성공");
		$("#BTN_POP_LOGIN").hide();
		$("#BTN_POP_WALLET").show();

		$("#LOGIN_ID").text(USER_INFO.UserNickname);
		$("#LOGIN_COIN").text(numberWithCommas(USER_INFO.Coin));
		
		TOKEN = USER_INFO.Token;

		LOGIN_STATE == false ? $("#SIDEBAR li.login_menu").hide() : $("#SIDEBAR li.login_menu").show();

		api_post("userasset",{token:TOKEN});
		
		return;
	}

	//로그인 실패
	if(errCode != 0)
	{
		LOGIN_STATE = false;
		switch(errCode)
		{
			case 1 : customAlert("로그인 오류", "회원정보가 없습니다", "alert"); break;
			case 2 : customAlert("로그인 오류", "비밀번호가 일치하지 않습니다", "alert"); break;
		}
		$("#POPUP_LOGIN input").val(""); //값 초기화
	}
}

//회원가입 요청 관리
function joinManager(result)
{
	let errCode = result.ErrorCode;

	if(errCode == 0)
	{
		customAlert("회원가입", '회원가입이 완료되었습니다. 이메일 인증 후 포인트가 지급됩니다', "ok");
		$("#POPUP_VIEW").stop().hide(0); //회원가입 팝업은 일단 감춘다
		
		return;
	}

	//회원가입 실패
	if(errCode != 0)
	{
		switch(errCode)
		{
			case 1 : customAlert("회원가입","아이디가 너무 짧습니다","notice"); break;
			case 99 : customAlert("회원가입","중복된 계정이 있습니다","notice"); break;
		}
		$("#POPUP_JOIN input").val("")//값 초기화
	}
}

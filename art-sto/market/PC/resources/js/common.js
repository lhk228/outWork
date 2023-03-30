//*공통 스크립트 및 index페이지의 요소는 여기서 작업한다
const PARENT 				= $("body"); //전역 최상단 문서위치
const INCLUDE_PATH 	= 'PC/resources/includes/';
const POPUP_PATH    = 'PC/resources/popup/'
const JS_PATH 			= 'PC/resources/js/';

$(document).ready(function(){

	//!시작화면설정
	// api_post('loginuser',{ Account:'a', Passcode:'b' });
	// pageLoader("my_wallet");
	// pageLoader("my_page");
	// popupLoader("popup_cart");
	pageLoader("main_page");
	// popupLoader("popup_join");
	// popupLoader("popup_detail_info");

	// setTimeout(()=>{pageLoader("my_wallet");},2000);
	//전체화면으로 변경
	$(document).one("click",function(){
		// document.documentElement.webkitRequestFullscreen();
	});

	//-- 나이스스크롤 적용 : 가로스크롤은 막는다(모바일 공용)
	$('#PAGE_VIEW').niceScroll({horizrailenabled:false});

	//-- 닫기버튼 클릭 : 팝업닫기
	$(document).on("click","button.btn_close",function(){ popupControl('HIDE', $(this)); });

	// //--상단 로고클릭 > 메인화면으로
	$("#NAV_LOGO").click(function(){ pageLoader("main_page");});

	//-- redLine 온오프
	$(window).on('keyup', function(e){ if(e.keyCode == 115) redLine == false ? devLine("on") : devLine("off"); });

	//--사이드메뉴 클릭시 : 페이지 이동 및 다른 메뉴 비활성화
	$("#SIDEBAR li").click(function()
	{
		//클래스 토글
		$('#SIDEBAR li').removeClass("selected");
		$(this).addClass("selected");

		//url 동작
		let url = $(this).attr("url");

		switch(url)
		{
			case "mever":location.href="https://www.mever.me"; break;
			case "merisa":location.href="https://www.youtube.com/@user-jy4fj9ip9p"; break;
			// case "future":location.href="https://www.mever.me"; break;
			case "my_page":popupLoader("popup_edit_user"); break;
			case "logout":location.href='http://market.mever.me';break;
			default : $("#PAGE_VIEW").empty(); pageLoader(url);
		}

		//window width < 1000 이면 메뉴네비를 가려준다
		let pageWidth = $(window).width();
		if(pageWidth < 1001)$("#MENU_ICON").click();
	});
	
	//-- 닫기버튼 클릭하면 : 무조건 닫는다
	$(".popup_close").click(function(){ let target = $(this).parents("div"); target.stop().fadeOut(); });

	//-- ENTER EVENT 모음
	$(document).on('keyup', "#INPUT_PW", (e)=>{ if(e.keyCode == 13) $("#BTN_LOGIN").click(); });
	$(document).on('keyup', "#INPUT_CHARGE_VALUE", (e)=>{ if(e.keyCode == 13) $("#BTN_CHARGE_APPLY").click(); });
	$(document).on('keyup', "#POPUP_WITHDRAW input", (e)=>{if(e.keyCode == 13)$("#BTN_WITHDRAW_APPLY").click();});
	$(document).on('keyup', "#POPUP_PW_CONTAINER input",(e)=>{if(e.keyCode == 13)$("#BTN_INFO_CHANGE").click();});

	//--공지사항 클릭
	$("#BTN_POP_NOTICE").click(()=>{
		pageLoader("notice_page");
	});

	//-- 팝업바깥 클릭시 닫기
	$(document).on("click","div.popup_container",function(e){
		if(e.target.className == "popup_container"){$(this).fadeOut(); $("#POPUP_VIEW").fadeOut();}
	});
});
//== READY END

//-- 개발용 redLine뷰
let redLine = false;
function devLine(v){
	if(v == "on")
	{
		$("*").css({outline:"1px solid red"});
		redLine = true;
		console.log(redLine);
		
		$("*").each(function(){
			let name = $(this).attr("id");
			if(name) 
			{
				$(this).append(`<span class="redline_span" style="position:absolute; top:0; left:0; font-size:1rem; color:red; opacity:0.8;">${name}</span>`);
				$(this).val(name);
			}
		});
		
	}
	else
	{
		$("*").css({outline:"none"});
		redLine = false;
		console.log(redLine);
		$("*").each(function(){
			let name = $(this).attr("id");
			if(name != "undifined") $(this).find(`.redline_span`).remove();
			$(this).val("");
		});
	}
}

//-- 페이지 로더 : 뷰 페이지에 새로운 페이지를 불러온다
function pageLoader(url, callback=false, data=false)
{
	loadingScreen('on');

	if(!url){return;}
	let URL = INCLUDE_PATH + url+".html"; //페이지 경로

	
	$('#PAGE_VIEW').load(URL, function(){

		loadingScreen('off');

    $("body, html").height(window.innerHeight+'px');
		$('#PAGE_VIEW').getNiceScroll().resize();
		PAGE = url;
		if(callback) callback(data, PARENT);

	});

}
//-- 팝업 불러오기 : 현재 페이지에 팝업을 불러온다
function popupLoader(url, callback=false, data=false) {
	console.log("url :",url);
	console.log("callback :",callback);
	let filePath = POPUP_PATH + url +'.html';
	let popup = $("#POPUP_VIEW");
	popup.load(filePath,()=>{ popup.fadeIn(200); POPUP=url; });
	if(callback) callback;

}

//-- 로딩스크린 : 로딩화면 필요할때 콜백으로 사용합니다
function loadingScreen(v){
	if(v == "on")
	{ 
		$("#LOADING_SCREEN").stop().fadeIn();
	}
	else
	{
		setTimeout(()=>{$("#LOADING_SCREEN").stop().fadeOut()},1000);
	}
}

//--팝업 만들기
function popupControl(view, target='undefined')
{
	let pView = $("#POPUP_VIEW");

	switch(view)
	{
		case "SHOW":pView.fadeIn(300);	break;
		case "HIDE":pView.fadeOut(300,()=>
		{
			pView.empty();
			//지정된 타겟이 있을경우 타겟의 팝업컨테이너를 감춘다
			if(target != "undefined"){ target.closest(".popup_container").hide(); }
		}); break;
	}
}

//-- REPLACE ALL
function replaceAll(str, searchStr, replaceStr) {
	return str.split(searchStr).join(replaceStr);
}

//--핸드폰번호 설정
function setPhoneNo(phone_no) {
	if(phone_no.length<10) return "정보가 없습니다";
	var pl = phone_no.length;
	if (pl == 11) {
		//11자리 폰번호
		var p1 = phone_no.substr(0, 3);
		var p2 = phone_no.substr(3, 4);
		var p3 = phone_no.substr(7, 4);
		return p1 + '-' + p2 + '-' + p3;
	} else if (pl == 10) {
		//10자리 폰번호
		var p1 = phone_no.substr(0, 3);
		var p2 = phone_no.substr(4, 3);
		var p3 = phone_no.substr(6, 4);
		return p1 + '-' + p2 + '-' + p3;
	} else {
		//12자리 번호
		var p1 = phone_no.substr(0, 4);
		var p2 = phone_no.substr(4, 4);
		var p3 = phone_no.substr(8, 4);
		return p1 + '-' + p2 + '-' + p3;
	}
}

//--주민등록번호 설정
function setJumin(jumin) {
	if(jumin.length<6) return '정보가 없습니다';
	var ju1 = jumin.substr(0, 6);
	var ju2 = jumin.substr(7, 1) + '******';
	jumin = ju1 + '-' + ju2;
	return jumin;
}

//--활성창 바깥을 클릭하면 창을 닫는다. element로 query선택자를 받음
function OutsideClose(element) {
	$(document).mousedown(function (e) {
		var container = $(element);
		if (container.has(e.target).length === 0) {
			container.stop().fadeOut(200);
		}
	});
}

//-- 숫자 3자리 단위마다 콤마(comma) 찍기
function numberWithCommas(x) {
	x = Number(x);
	if (x || x == 0) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	} else {
		return '';
	}
}

//-- 숫자만 입력
function inputNumber(target)
{
	target.value = target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
}

//-- 커스텀 알림박스
function customAlert(title='',content='',type="ok", time=2000)
{
	$(".ca_container").css({display:"flex"});
	$(".ca_box").stop().fadeIn(500).css({bottom:"5rem"});
	$(".ca_box").attr("type",`${type}`);
	if(content){$(".ca_box").html(`<div class="ca_title">${title}</div><div class="ca_content">${content}</div>`); }
  else {$(".ca_box").html(`<div class="ca_title">${title}</div>`);}
  console.log("alert title",title);
	
	setTimeout(()=>{ $(".ca_container, .ca_box").stop().fadeOut(500,function(){$(".ca_box").css({bottom:0}).html("");});},time);
}
//--커스텀 셀렉트박스 : 클릭이벤트로 동작 event(클릭이벤트), name(임의로 설정한 셀렉트박스 이름 : [custom_select='name']). name으로 서로 호환한다. top: 셀렉트박스 위치
function Custom_SelectBox(event, name, offset, top) 
{
	switch(event.target.tagName){
		case "INPUT":
			var targetHeight = $("ul.custom_select[custom_select='"+name+"']").height(); //목록박스 크기
			var x 					 = offset.left									 //클릭한 input의 좌표
			var y 					 = offset.top										 //클릭한 input의 좌표
			var winY 				 = window.innerHeight;					 //윈도우 크기
			var inputWidth 	 = event.target.offsetWidth; 		 //클릭한 input의 width

			//목록박스 위치 및 크기설정
			$(`ul.custom_select[custom_select='${name}']`).show().css({left:x, top:y+top-5, minWidth:inputWidth});
			$(`ul.custom_select[custom_select='${name}']`).niceScroll();
			$(`ul.custom_select[custom_select='${name}']`).getNiceScroll().resize();
			
			//화면에 목록박스가 다 표시되지 못할경우 윗방향으로 박스를 생성한다
			if(winY - y < targetHeight){$(`ul.custom_select[custom_select='${name}']`).css({left:x, top:y-(targetHeight+5), minWidth:inputWidth});}

			break;
		case "LI":
			const value = event.target.innerText;
			$("input.custom_select_value[custom_select='"+name+"']").val(value);
			$("ul.custom_select[custom_select='"+name+"']").hide();
			$("#UL_APPLY_ITEM_LIST").getNiceScroll().show();//나이스 스크롤 적용
			if($("input.custom_select_value[custom_select='"+name+"']").val().length>0) $("input.custom_select_value[custom_select='"+name+"']").addClass("set")
			break;
	}
	$("#UL_APPLY_ITEM_LIST").getNiceScroll().hide();//나이스 스크롤 해제
	OutsideClose("ul.custom_select[custom_select='"+name+"']");
}

//--커스텀셀렉트 jQuery로 동작. $().customSelect({name:원하는이름, top:박스위치});
(function($) {
	$.fn.customSelect = function(options) {
		var settings = $.extend({ name: "custom_select", top:40}, options );
			$(this).children(".custom_select_value").attr("custom_select",settings.name);
			$(this).children(".custom_select").attr("custom_select",settings.name);
			$(this).on("click", ".custom_select_value", function(e){Custom_SelectBox(e,settings.name, $(this).offset(), settings.top);});
			$(this).on("click", ".custom_select li", function(e){Custom_SelectBox(e,settings.name);});
	}; 
}(jQuery));

//--멀티플 체크박스 : 클릭이벤트로 동작 event(클릭이벤트), name(임의로 설정한 박스 이름 : [multiple-check='name']). name으로 서로 호환한다.
function Multiple_CheckBox(event, name, offset) 
{		
	const ul 				= $("ul.multiple_check[multiple-check='"+name+"']");
	const input 		= $("input.multiple_check_value[multiple-check='"+name+"']");
	const checkList = new Array();
	
	//전체 체크용 체크박스 생성
	if($(`input[id="${name}_전체"]`).length==0){
		var totalCheck = ``;	
		totalCheck += `<li itemName='전체' class="multiple_check_total">`;
		totalCheck += ` <input type="checkbox" id="${name}_전체" class="input_checkbox_03 multiple_checkbox"></input>`;
		totalCheck += ` <label for="${name}_전체"><span></span>전체</label>`;
		totalCheck += `</li>`;
		ul.prepend(totalCheck);
	}

	//체크된 항목 확인해서 결과배열에 추가 : 체크된 갯수 input에 표시하기 위해
	ul.children("li").each(function(){
		var input 		= $(this).find("input:checkbox");
		var label 		= $(this).find("label").text();
		var isChecked = input.prop("checked");
		isChecked ? checkList.push(label) : "";
	});

	//input박스 클릭시
	if(event.target.tagName=="INPUT"){
		switch(event.target.type){
			case "text": //input 창 클릭한 경우 : 체크목록 표시
				var targetHeight = $("ul.multiple_check[multiple-check='"+name+"']").height(); //목록박스 크기
				var x 					 = offset.left									 //클릭한 input의 좌표
				var y 					 = offset.top										 //클릭한 input의 좌표
				var winY 				 = window.innerHeight;					 //윈도우 크기
				var inputWidth 	 = event.target.offsetWidth; 		 //클릭한 input의 width

				//목록박스 위치 및 크기설정
				$("ul.multiple_check[multiple-check='"+name+"']").css({left:x, top:y+40, minWidth:inputWidth});

				//화면에 목록박스가 다 표시되지 못할경우 윗방향으로 박스를 생성한다
				if(winY - y < targetHeight){$("ul.multiple_check[multiple-check='"+name+"']").css({left:x, top:y-(targetHeight+5), minWidth:inputWidth});}
				ul.show();
				break;
			case "checkbox":	//checkbox 클릭한 경우 : 체크된 갯수에따라 다르게 표시
				//체크한 항목이 [전체] 일 경우
				if(event.target.labels[0].innerText=="전체"){
					switch(event.target.checked)
					{
						case true : //전체 체크시 체크리스트에 모든 값 추가
							ul.find("input").prop('checked',true); checkList.splice(0); 
							ul.children("li").each(function(){
								var input 		= $(this).find("input:checkbox");
								var label 		= $(this).find("label").text();
								var isChecked = input.prop("checked");
								isChecked ? checkList.push(label) : "";
							});
							break;
						case false : //전체 체크 해제시 체크리스트 초기화
							ul.find("input").prop('checked',false); checkList.splice(0); 
							break;
					}
				} else {
					ul.find(".multiple_check_total input:checkbox").prop("checked",false); //'전체' 체크 해제
					checkList.splice(0); 
					ul.children("li").each(function(){
						var input 		= $(this).find("input:checkbox");
						var label 		= $(this).find("label").text();
						var isChecked = input.prop("checked");
						isChecked ? checkList.push(label) : "";
					});
				}

				//체크시 체크한 항목 상단으로 이동 *요일/연령대선택의 경우에는 해당기능 제외
				if(event.target.checked==true && event.target.labels[0].innerText!="전체" && (name!="요일선택" && name!="연령선택")){
					var standard = ul.find('.multiple_check_total');
					var itemName = event.target.parentElement.attributes['itemname'].value;
					var target = ul.find(`li[itemname='${itemName}']`);
					target.insertAfter(standard);
				}

				//1개면 단일표시, 여러개면 ...으로 축약
				checkList.length==1 ? input.val(checkList[0]) : input.val(checkList[0]+" … +"+(checkList.length-1));	
				//0개면 input value 초기화
				checkList.length==0 ? input.val("") : "";
				//1개 이상이면 selected, 아니면 removeClass
				checkList.length>0 ? input.addClass("selected") : input.removeClass("selected");
				break;
		}
	}
	//팝업 외곽클릭시 닫음
	$("#UL_APPLY_ITEM_LIST").getNiceScroll().hide();
	OutsideClose("ul.multiple_check[multiple-check='"+name+"']");
}

//--멀티플 체크박스 jQuery로 동작. $().multipleCheck({name:원하는이름}); Multiple_CheckBox 실행
(function($) {
	$.fn.multipleCheck = function(options) {
		var settings = $.extend({ name: "multiple-check"}, options );
			$(this).children(".multiple_check_value").attr("multiple-check",settings.name);
			$(this).children(".multiple_check").attr("multiple-check",settings.name);
			$(this).on("click", ".multiple_check_value", function(e){Multiple_CheckBox(e,settings.name, $(this).offset());});
			$(this).on("click", ".multiple_check li input", function(e){Multiple_CheckBox(e,settings.name);});
	}; 
}(jQuery));

//-- json Object 문자열로 변환
function jsonToStr(json){
	let istr = strJSON.stringify(json);
	return str;
}

//-- 문자열 json으로 변환
function strToJson(str){
	let json = JSON.parse(str);
	return json;
}

//-- 시리얼번호 이름으로 변경
function convertSerial(Serial)
{
	//층, 블럭위치 표시
	let vSerial 	= String(Serial).substr(8);
	let locationF = Number(vSerial.substr(0,3));
	let locationB = Number(vSerial.substr(3));

	return `${locationF}층 ${locationB}블럭`;
}

//-- 시리얼번호 이름으로 변경(전체)
function convertSerialAll(Serial)
{
	//층, 블럭위치 표시
	let vSerial 	= String(Serial).substr(3);
	// 01 002 001 001
	let 출구 = Number(vSerial.substr(0,2));
	let 건물 = Number(vSerial.substr(2,3));
	let 층 = Number(vSerial.substr(5,3));
	let 블럭 = Number(vSerial.substr(8,3));

	return `${출구}출구 ${건물}빌딩 ${층}층 ${블럭}블럭`;
}

//-- 스크립트파일 불러오기
function importScript(path)
{
	$(`script[src='${JS_PATH}${path}.js']`).remove();
	$('body').append(`<script src='${JS_PATH}${path}.js'><\/script>`);
	
}
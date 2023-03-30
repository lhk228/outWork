var SELECT_BIND_ASSET;
//main_page.js 메인페이지에 쓰이는 스크립트

//-- 카카오맵 init
function kakaoItemMap(address='경수대로 401', itemName='상품명')
{
//카카오맵
var container = document.getElementById('MAP_VIEW'); //지도를 담을 영역의 DOM 레퍼런스
var options = { //지도를 생성할 때 필요한 기본 옵션
	center: new kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
	level: 3 //지도의 레벨(확대, 축소 정도)
};

var map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
var geocoder = new kakao.maps.services.Geocoder();
var content = `<div class="kakao-map-marker text-xs p-2">${itemName}</div>`;
geocoder.addressSearch(address, function(result, status) {

	// 정상적으로 검색이 완료됐으면 
	if (status === kakao.maps.services.Status.OK) {

			var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

			// 결과값으로 받은 위치를 마커로 표시합니다
			var marker = new kakao.maps.Marker({
					map: map,
					position: coords
			});

			marker.setMap(map);

			// 커스텀 오버레이가 표시될 위치입니다 
			var position = new kakao.maps.LatLng(result[0].y, result[0].x);

			console.log(position)

			// 커스텀 오버레이를 생성합니다
			var customOverlay = new kakao.maps.CustomOverlay({
					position: position,
					content: content,
					xAnchor: 0.3,
					yAnchor: 0.91
			});

			customOverlay.setMap(map);

			// 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
			map.setCenter(coords);
	}
});

setTimeout(function(){$(`.kakao-map-marker`).addClass("moved");},100);
}

//-- 전체 건물 목록 만들기
function makeTotalList()
{
	let table = $("#TOTAL_ITEM_LIST");
	let html = '';
	html+=
	`
	<div class="item-box"><p class="item-subtitle">MEVER STO</p><p class="item-pirce">10,400,380 P</p><p class='item-title'>메버</p></div>
	<div class="item-box"><p class="item-subtitle">MEVER STO</p><p class="item-pirce">10,400,380 P</p><p class='item-title'>부동산</p></div>
	<div class="item-box"><p class="item-subtitle">MEVER STO</p><p class="item-pirce">10,400,380 P</p><p class='item-title'>유형자산</p></div>
	<div class="item-box"><p class="item-subtitle">MEVER STO</p><p class="item-pirce">10,400,380 P</p><p class='item-title'>무형자산</p></div>
	<div class="item-box"><p class="item-subtitle">MEVER STO</p><p class="item-pirce">10,400,380 P</p><p class='item-title'>주류</p></div>
	<div class="item-box"><p class="item-subtitle">MEVER STO</p><p class="item-pirce">10,400,380 P</p><p class='item-title'>아바타</p></div>
	<div class="item-box"><p class="item-subtitle">MEVER STO</p><p class="item-pirce">10,400,380 P</p><p class='item-title'>미술품</p></div>
	<div class="item-box"><p class="item-subtitle">MEVER STO</p><p class="item-pirce">10,400,380 P</p><p class='item-title'>슈퍼카</p></div>
	<div class="item-box"><p class="item-subtitle">MEVER STO</p><p class="item-pirce">10,400,380 P</p><p class='item-title'>생필품</p></div>
	<div class="item-box"><p class="item-subtitle">MEVER STO</p><p class="item-pirce">10,400,380 P</p><p class='item-title'>한우</p></div>
	<div class="item-box"><p class="item-subtitle">MEVER STO</p><p class="item-pirce">10,400,380 P</p><p class='item-title'>지식재산권</p></div>
	<div class="item-box"><p class="item-subtitle">MEVER STO</p><p class="item-pirce">10,400,380 P</p><p class='item-title'>명품</p></div>
	<div class="item-box"><p class="item-subtitle">MEVER STO</p><p class="item-pirce">10,400,380 P</p><p class='item-title'>컴퓨터</p></div>
	<div class="item-box"><p class="item-subtitle">MEVER STO</p><p class="item-pirce">10,400,380 P</p><p class='item-title'>의류</p></div>
	<div class="item-box"><p class="item-subtitle">MEVER STO</p><p class="item-pirce">10,400,380 P</p><p class='item-title'>가전</p></div>
	<div class="item-box"><p class="item-subtitle">MEVER STO</p><p class="item-pirce">10,400,380 P</p><p class='item-title'>보석</p></div>
	<div class="item-box"><p class="item-subtitle">MEVER STO</p><p class="item-pirce">10,400,380 P</p><p class='item-title'>생활물품</p></div>
	<div class="item-box"><p class="item-subtitle">MEVER STO</p><p class="item-pirce">10,400,380 P</p><p class='item-title'>유튜버</p></div>
	<div class="item-box"><p class="item-subtitle">MEVER STO</p><p class="item-pirce">10,400,380 P</p><p class='item-title'>자동차</p></div>
	<div class="item-box"><p class="item-subtitle">MEVER STO</p><p class="item-pirce">10,400,380 P</p><p class='item-title'>식품</p></div>
	<div class="item-box"><p class="item-subtitle">MEVER STO</p><p class="item-pirce">10,400,380 P</p><p class='item-title'>도서</p></div>
	`
	table.html(html).niceScroll();
	table.getNiceScroll().resize();
}

//--건물보기, 블럭보기 변경
function changeBlockView()
{
	let img 	= $("#THUMNAIL_IMG");
	let block = $("#BLOCK_TABLE");
	let btn 	= $("#BTN_CHANGE_VIEW");
	let mode = btn.text();

	if(mode == "조각 보기"){ { btn.text('상품 보기'); block.show(0); } }
	else { btn.text('조각 보기'); block.hide(0);  }
	// if(img.css("display") == "none")
	// else { block.show(0); btn.text("상품 보기"); }
}

//-- 선택한 매물 정보 보여주기
function viewDetailInfo(target)
{
	$("#POPUP_BIND_CONTAINER").fadeIn();
	makeBlockList();
}

//-- 블럭목록 만들기
function makeBlockList()
{
	let blockT 	= $("#BLOCK_TABLE");
	let bHtml 	= '';
	for(var i=0; i<100; i++)
	{
		bHtml+=
		`
			<li class='default' item-serial='${i+1}'></li>
		`
	}
	blockT.html(bHtml);
}

//-- 선택 건물의 하위목록 만들기
function makeItemBindList(list)
{
	let table  	= $("#TRADER_LIST_TBODY");
	let imgView = $("#ITEM_IMAGE");
	let html 	 	= '';

	list = _.chain(list).sortBy("Serial").value(); //정렬

	list.forEach((v, num)=>
	{
		//시리얼, 갱신일, 분양유저, 임차유저, 별명, 계약상태, 가격
		let { Serial, UpdateDate, UserSerial, RentUserSerial, Nickname, Contract, Price } = v;

		//층, 블럭위치, 버튼 표시
		let blockType = '';
		let applyBtn  = '';
		let buyBtn 	  = '';
		let sellBtn   = '';
		
		Nickname ? Nickname = `<span style="color:#ffae00; padding-right:0.5rem;">${Nickname}</span>님 소유`: Nickname = `<span style="color:#888; padding-right:0.5rem;">소유자 없음</span>`
	
		//상태표시
		switch(Contract)
		{
			case 100 : 
			applyBtn	= `<button class="btn_default btn_blue_g apply disable">분양신청</button>`;
			buyBtn		= `<button class="btn_default btn_pink buy disable">즉시매수</button>`;
			sellBtn 	= `<button class="btn_default btn_blue sell disable">매도예약</button>`;
			blockType = `complete`;
			//로그인중일때 본인자산이면 표시해준다
			if(LOGIN_STATE)
			{
				var target = MY_ASSET.find((x)=>{ return x.Serial == Serial});
			
				if(target){ sellBtn 	= `<button class="btn_default btn_blue sell">매도예약</button>`; blockType = `myblock`; }
			
				else { sellBtn 	= `<button class="btn_default btn_blue sell disable">매도예약</button>`; }
			}
				break;
			case 200 : 
				blockType = `sales`; 
				applyBtn 	= `<button class="btn_default btn_blue_g apply disable">분양신청</button>`;
				buyBtn	 	= `<button class="btn_default btn_pink buy">즉시매수</button>`;
				sellBtn  	= `<button class="btn_default btn_blue sell disable">매도예약</button>`;
				break;
			default  : 
				blockType = `default`; 
				applyBtn 	= `<button class="btn_default btn_blue_g apply">분양신청</button>`;
				buyBtn	 	= `<button class="btn_default btn_pink buy disable">즉시매수</button>`;
				sellBtn  	= `<button class="btn_default btn_blue sell disable">매도예약</button>`;
				break;
		}

		html+=
		`
		<div class="table_row" data-serial=${Serial}>
			<div class="table_td" style="justify-content:flex-start; padding-left:1rem;">${convertSerial(Serial)} ${UpdateDate} 등록됨</div>
			<div class="table_td" style="justify-content:flex-end; padding-right:1rem;">${Nickname}</div>
			<div class="table_td">${applyBtn}</div>
			<div class="table_td">${buyBtn}</div>
			<div class="table_td">${sellBtn}</div>
		</div>
		`


	})

	table.html(html);
	table.niceScroll();
	table.getNiceScroll().resize();
}

//-- 증권사 목록 만들기
function makeTraderList()
{
	let table = $(`#TRADER_LIST`);
	let html  = '';
	
	for(var i=0; i<27; i++)
	{
		html +=
		`
			<div class="item-trader" item-serial='${i+1}'>
				<img src='/sto/market/PC/resources/images/trader/${i+1}.png'>
			</div>
		`;
	}

	table.append(html);
}

//--장바구니 목록 만들기
function makeCartList()
{
	//초기화
	CART_LIST				 = new Array();

	//카트리스트 만들기
	$("#BLOCK_TABLE li.selected").not("li.complete").each(function(x){
		let serial = $(this).attr("item-serial");
		CART_LIST.push(serial);
	});

	if(CART_LIST.length > 0){ popupLoader("popup_cart"); }
	else { customAlert("먼저 거래할 조각을 선택해주세요","","ok","1500")}
}


///////////////DOCUMENT READY FUNCTION

//지도에 있는 박스 클릭 : 목록 클릭과 상호작용
$(document).on('click','#MAP_VIEW ul li',function(){
	$("#MAP_VIEW ul li").unbind("click");
	let itemSerial = $(this).attr('item-serial');
	let target = $(`#TOTAL_ITEM_LIST_TBODY div.table_row[data-serial ='${itemSerial}']`);
	let top		 = target.position().top;
	let scroll = $("#TOTAL_ITEM_LIST_TBODY").scrollTop();
	
	if(target.hasClass("selected") == true){target.click(); $("#MAP").getNiceScroll().resize(); }	//선택되있는 상태면 팝업오픈
	
	$(`#TOTAL_ITEM_LIST_TBODY div.table_row`).removeClass('selected');
	$("#MAP_VIEW ul li").removeClass("selected");
	
	$(this).addClass("selected");
	target.addClass("selected");
	
	$("#TOTAL_ITEM_LIST_TBODY").stop().animate({scrollTop:top+scroll},500);
});

//하위매물목록 ROW 클릭 > 건물이미지 변경
$(document).on("click", "#TOTAL_ITEM_LIST_TBODY div.table_row", function(){
	let serial = String($(this).data('serial'));
	let num    = Number(serial.substr(6,2));
	let src    = 'PC/resources/images/buliding/'
	
	$("#THUMNAIL_IMG").attr("src",`${src}${num}.png`);
});

//전체 목록 ROW 클릭 : 지도와 상호작용
$(document).on("click", "#TOTAL_ITEM_LIST_TBODY div.table_row", function()
{
	let serial 		 = Number($(this).data('serial'));
	let linkTarget = $(`#MAP_VIEW li[item-serial ='${serial}']`);
	let obj 			 = { SpaceID : (serial + 1000) };//1층을 기본으로 한다
	let target 		 = TOTAL_LIST.find(x => (x.Serial == serial));

	
	if($(this).hasClass("selected") == true){
		setTimeout(()=>{ viewDetailInfo(target); api_post('spaceasset',obj);},10);
	}	//선택되있는 상태면 팝업오픈


	$(`#TOTAL_ITEM_LIST_TBODY div.table_row`).removeClass('selected');
	$("#MAP_VIEW ul li").removeClass("selected");

	//1층 기본이므로 클래스부여
	$("#FLOOR_TABLE li").removeClass("selected");
	$("#FLOOR_TABLE li[floor='1']").addClass("selected");
	$(this).addClass("selected");
	linkTarget.addClass("selected");
});

//층 변경시
$(document).on("click", "#FLOOR_TABLE li", function()
{
	let serial = Number($("#ITEM_NAME").attr('serial'));
	let floor  = Number($(this).attr("floor"));
	let obj    = { SpaceID : serial+(floor*1000) };

	$("#FLOOR_TABLE li").removeClass("selected");
	$(this).addClass("selected");
	api_post('spaceasset',obj);
	
	if($("#THUMNAIL_IMG").css("display") != "none"){ $("#BLOCK_TABLE").show(); $("#THUMNAIL_IMG").hide(); $("#BTN_CHANGE_VIEW").text("이미지보기"); }
	
	customAlert(`${floor} SECTION`, '', 'ok', 1000)
});

//지도에 마우스 올리면 목록에도 표시
$(document).on("mouseenter","#MAP_VIEW ul li",function(){let itemSerial = $(this).attr('item-serial');});

//목록에 마우스 올리면 지도상에도 표시
$(document).on("mouseenter","#TOTAL_ITEM_LIST_TBODY div.table_row",function(){
	let itemSerial = $(this).data("serial");
	let target		 = $(`#MAP_VIEW li[item-serial ='${itemSerial}']`);
});

//목록에서 마우스 떠나면 지도상에도 표시
$(document).on("mouseleave","#TOTAL_ITEM_LIST_TBODY div.table_row",()=>{/*$(`#MAP_VIEW li`).removeClass('selected');*/});

//!--2DEPTH BIND LIST
//!--2DEPTH BIND LIST
//!--2DEPTH BIND LIST
//!--2DEPTH BIND LIST
//!--2DEPTH BIND LIST
//!--2DEPTH BIND LIST

//블럭, 이미지보기 클릭
$(document).on("click","#BTN_CHANGE_VIEW",()=>{changeBlockView(); customAlert("조각을 선택한 후 거래증권사를 선택해주세요",'','ok',1000)});

//하위매물목록 ROW > 즉시매수 버튼 클릭
$(document).on("click", "#TRADER_LIST_TBODY div.table_row button.buy", function(){

	popupLoader('popup_buy_asset');

	let row = $(this).closest("div.table_row");
	let serial = row.data("serial");

	SELECT_BIND_ASSET = BIND_LIST.find(x => x.Serial == serial);
});

//하위매물목록 ROW > 분양신청버튼 클릭
$(document).on("click", "#TRADER_LIST_TBODY div.table_row button.apply", function(){

	popupLoader('popup_sdv_asset');

	let row 	 = $(this).closest("div.table_row");
	let serial = row.data("serial");
	let price  = row.data("price");
	let user 	 = "(주)MEVER"; //초기분양매물이므로 메버로 표시한다

	api_post('assetpresellmaxprice', {item:serial});

	setTimeout(()=>{
		PARENT.find("#INPUT_SDV_ASSET_NAME").val(convertSerial(serial)).attr("item-serial",serial);
		PARENT.find("#INPUT_SELLER_NAME").val(user)
		PARENT.find("#INPUT_SDV_PRICE").val(numberWithCommas(price)).attr("origin-price",price);
	},150);

});

//하위매물목록 ROW > 매도예약 버튼 클릭
$(document).on("click", "#TRADER_LIST_TBODY div.table_row button.sell", function(){
	
	let row = $(this).closest("div.table_row");
	let serial = row.data("serial");
		
	//선택한 내 자산매물 전역선언
	SELECT_MY_ASSET = MY_ASSET.find((x)=>{return x.Serial == serial }); 
		
	popupLoader(`popup_sell_asset`);

});

//블록 박스 클릭 : 목록 클릭과 상호작용
let SELECT_BLOCK_TYPE = "";
$(document).on("click","#BLOCK_TABLE li",function(){
	$(this).addClass("selected")
	// let itemSerial = $(this).attr('item-serial');
	// let target 		 = $(`#TRADER_LIST_TBODY div.table_row[data-serial ='${itemSerial}']`);
	// let top		 		 = target.position().top;
	// let scroll 		 = $("#TRADER_LIST_TBODY").scrollTop();
	// let posY 	 		 = top+scroll;
	
	// SELECT_ASSET = itemSerial;

	// if(target.hasClass("selected") == true){ api_post("assetrecord",{AssetSerial:Number(itemSerial)});}	//선택되있는 상태면 팝업오픈
	
	// $(this).addClass("selected");
	// target.addClass("selected");

	// //기본블럭을 클릭하면 상태블럭들 초기화
	// if($(this).hasClass("default") == true)
	// {
	// 	SELECT_BLOCK_TYPE = "default";
	// 	$("#BLOCK_TABLE li.myblock").removeClass("selected");
	// 	$("#BLOCK_TABLE li.complete").removeClass("selected");
	// 	$("#BLOCK_TABLE li.sales").removeClass("selected");
	// 	// $(`#TRADER_LIST_TBODY div.table_row`).removeClass('selected');
	// }
	// //분양완료상태인 블럭을 클릭하면 클릭 초기화(할거없고 1개정보만 본다)
	// if($(this).hasClass("complete") == true)
	// {
	// 	SELECT_BLOCK_TYPE = "complete";
	// 	$(`#TRADER_LIST_TBODY div.table_row`).removeClass('selected');
	// 	$("#BLOCK_TABLE li").removeClass("selected");
	// 	$(this).addClass("selected");
	// 	target.addClass("selected");
	// }

	// //판매상태인 블럭을 클릭하면 다른상태 블럭 초기화
	// if($(this).hasClass("sales") == true)
	// {
	// 	SELECT_BLOCK_TYPE = "sales";
	// 	$("#BLOCK_TABLE li.myblock").removeClass("selected");
	// 	$("#BLOCK_TABLE li.complete").removeClass("selected");
	// 	// $(`#TRADER_LIST_TBODY div.table_row`).removeClass('selected');
	// }

	// //내 매물블럭을 클릭하면 다른블럭 초기화
	// if($(this).hasClass("myblock") == true)
	// {
	// 	SELECT_BLOCK_TYPE = "myblock";
	// 	$("#BLOCK_TABLE li.default").removeClass("selected");
	// 	$("#BLOCK_TABLE li.sales").removeClass("selected");
	// 	$("#BLOCK_TABLE li.complete").removeClass("selected");
	// 	// $(`#TRADER_LIST_TBODY div.table_row`).removeClass('selected');
	// }

	// $("#TRADER_LIST_TBODY").stop().animate({scrollTop:posY},500);
});

//목록 클릭하면 블록에도 표시
$(document).on("click","#TRADER_LIST_TBODY div.table_row",function(e){

	if(e.target.nodeName != "BUTTON")
	{

		let itemSerial = $(this).data("serial");
		let target     = $(`#TRADER_LIST_TBODY div.table_row[data-serial ='${itemSerial}']`);
		
		SELECT_ASSET = itemSerial;
		
		if(target.hasClass("selected") == true){ api_post("assetrecord",{AssetSerial:Number(itemSerial)});}
		
		$(this).addClass("selected");
		$(`#BLOCK_TABLE li[item-serial ='${itemSerial}']`).addClass("selected");
	}
});

//카트버튼 클릭
$(document).on("click","#BTN_CART_POPUP",function(){
	if(LOGIN_STATE == true){makeCartList();}
	else { customAlert("제한된 접근","로그인이 필요한 기능입니다","alert");}
	
});

//증권사 클릭 : 장바구니
$(document).on("click","#TRADER_LIST .item-trader",function(){
	makeCartList();
	traderNumber = $(this).attr("item-serial");
});

let traderNumber = '';
//main_page.js 메인페이지에 쓰이는 스크립트 END
$(function(){
	var url = 'pop_rank'; 

  //메뉴버튼
	$(`#BTN_NAV, #BTN_NAV_CLOSE, #MODAL`).click(function (){ 
		$(`#BTN_NAV, #BTN_NAV_CLOSE`).toggleClass("hidden");
		$("#MODAL").fadeToggle();
		$(`#MENU`).slideToggle();
	})

	//메뉴클릭 => 모달클릭(닫기)
	$("#MENU li").click(function(){ $("#MODAL").click(); });

	//네비게이션 버튼 : 팝업or페이지 불러오기
	$(`.btn_nav`).click(function(){
		let pro 		= window.location.protocol;
		let host 		=  window.location.host;
		let path 		= window.location.pathname;
		let pageUrl = $(this).attr("page");
		let popUrl  = $(this).attr("popup");
		let urlFull = `${pro}//${host+path}#/${pageUrl}`;

		console.log("pro :",pro);
		console.log("host :",host);
		console.log("path :",path);
		console.log('urlFull : ',urlFull);
		
		if( popUrl ) popupControl('show',`${POPUP_PATH+popUrl}.html`);
		if( pageUrl ) location.href = urlFull;
		
	});

	//북마크 클릭 : 북마크된것만 남긴다
	$(document).on(`click`,`#BTN_BOOKMARK`,function(){
		$("#TABLE_SEARCH_TBODY .item-bookmark.fa-regular").parents('.table_row').hide();
	});

	//리스트 클릭 : 모든 리스트 보여준다
	$(document).on(`click`,`#BTN_ALLIST`,function(){
		$("#TABLE_SEARCH_TBODY .table_row").show();
	});
	
	//거래소로
	$("#GO_MARKET").click(function(){
		location.href = 'https://mever.me/sto/market';
	});

	//상품명 검색
	$(`#BTN_SEARCH_ITEM`).click(function (){
		location.href='#/search';
		searchText = $(`#SEARCH_ITEM_NAME`).val();
		kakaoItemMap(searchText);
	});
	
});
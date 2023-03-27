$(function(){
	var url = 'pop_rank'; 
	// setTimeout(function(){ popupControl('show',`${POPUP_PATH+url}.html`); },1300);

	//메뉴버튼
	$(`#BTN_NAV, #BTN_NAV_CLOSE, #MODAL`).click(function (){ 
		$(`#BTN_NAV, #BTN_NAV_CLOSE`).toggleClass("hidden");
		$("#MODAL").fadeToggle();
		$(`#MENU`).slideToggle();
	})

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
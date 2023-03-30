// detail_page.js : 상세정보 스크립트
//-- 매물상세 테이블 만들기
function showDetailPopup(target, list)
{

	console.log("target :",target);
	let Nickname   = target.Nickname;
	let Serial     = target.Serial;
	let table = $("#POPUP_TRADE_LIST_TBODY");
	let html 	= '';
	let url = target.URL;

	list = _.chain(list).sortBy("UpdateDate").reverse().value(); //정렬

	list.forEach((v, num)=>
	{
		let { AssetSerial, UpdateDate, BuyNickname, SellNickname, Price, URL} = v;

		html+=
		`
		<div class="table_row" data-serial=${AssetSerial}>
			<div class="table_td">${UpdateDate}</div>
			<div class="table_td blue">판매</div>
			<div class="table_td">${SellNickname}</div>
			<div class="table_td">${numberWithCommas(Price)}</div>
		</div>
		<div class="table_row" data-serial=${AssetSerial}>
			<div class="table_td">${UpdateDate}</div>
			<div class="table_td red">구매</div>
			<div class="table_td">${BuyNickname}</div>
			<div class="table_td">${numberWithCommas(Price)}</div>
		</div>
		`
	})

	// let target = BIND_LIST.find((x)=>{return x.Serial == SELECT_ASSET});

	// if(target.Nickname != "")
	// {
	// 	html+=
	// 	`
	// 	<div class="table_row" data-serial=${target.Serial}>
	// 		<div class="table_td">${target.UpdateDate}</div>
	// 		<div class="table_td red">분양</div>
	// 		<div class="table_td">${target.Nickname}</div>
	// 		<div class="table_td">${numberWithCommas(target.Price)}</div>
	// 	</div>
	// 	`
	// }

	table.html(html);
	table.niceScroll();
	table.getNiceScroll().resize();

	let Title = convertSerialAll(Serial);
	Title = replaceAll(Title,"1출구","11출구");
	Title = replaceAll(Title,"2출구","12출구");
	Title = replaceAll(Title,"3출구","1출구");
	Title = replaceAll(Title,"4출구","2출구");
	Title = replaceAll(Title,"5출구","10출구");
	Title = replaceAll(Title,"6출구","9출구");
	//정보세팅
	$("#DETAIL_ASSET_NAME").text(Title);
	$("#P_ASSET_DETAIL").text(target.URL);
	$("#INPUT_ASSET_DETAIL").val(url);

	Nickname ? Nickname : Nickname ="소유자가 없습니다"

	$("#ASSET_OWNER").text(Nickname);

	//버튼컨트롤
	if(PAGE == 'my_wallet')
	{
		$("#BTN_DETAIL_APPLY").removeClass('disable');
		$("#BTN_SELL_RESERVE").removeClass('disable');
	}
	else
	{
		// $("#BTN_DETAIL_APPLY").hide();
	}

	//로그인중에 내 매물정보를 연경우
	if(LOGIN_STATE)
	{
		var target = MY_ASSET.find((x)=>{ return x.Serial == Serial});
	
		if(target){ 
			$("#BTN_DETAIL_APPLY").removeClass('disable');
			$("#BTN_SELL_RESERVE").removeClass('disable');
			$("#INPUT_ASSET_DETAIL").attr("readonly",false);
		}
	}
}

$(document).on("click","#BTN_DETAIL_APPLY",function(){
	let Items = [SELECT_MY_ASSET.Serial];
	let ICON = 0;
	let URL = $("#INPUT_ASSET_DETAIL").val();
	let data = { Token:TOKEN, ICON, URL, Items }
	api_post("asseticonurl",data);
});

//매도예약 클릭시
$(document).on("click","#BTN_SELL_RESERVE",function(){
	popupLoader("popup_sell_asset");
});
// detail_page.js : 상세정보 스크립트 END

// my_wallet.js : 내 지갑 스크립트
//--충전버튼 클릭
$(document).on("click",'#BTN_CHARGE_POINT',function(){ $("#POPUP_CHARGE_CONTAINER").fadeIn() });

//--충전 신청하기 버튼 클릭
$(document).on("click",'#BTN_CHARGE_APPLY',function(){
	let money = $("#INPUT_CHARGE_VALUE").val(); //신청금액
	let bank	 = $("#INPUT_BANK_NAME").val();	 //신청 은행
	let no	 = $("#INPUT_BANK_NO").val();	 		//신청 계좌번호
	let str = `
	신청금액 : ${numberWithCommas(money)}원
	은행명 : ${bank}
	계좌번호 : ${no};
	충전 신청이 완료되었습니다`;
	customAlert(str);

	//api 양식 토큰, 충전액, 화폐단위, 메모
	let obj = { Token:TOKEN, Capacity:Number(money), Currency:1, Memo:bank + '/' + no }

	api_post('deposit',obj);

	$("#POPUP_CHARGE input").val(''); //초기화
	$("#POPUP_CHARGE_CONTAINER").fadeOut();
});

//--환전신청버튼 클릭
$(document).on("click",'#BTN_WITHDRAW_POINT',function(){ customAlert("환전신청알림", "환전신청기능은 2023년 하반기 제공예정입니다", "notice"); });

//--환전 신청하기 버튼 클릭
$(document).on("click",'#BTN_WITHDRAW_APPLY',function(){
	let money  = $("#INPUT_WITHDRAW_VALUE").val();        //신청금액
	let msg		 = $("#INPUT_WITHDRAW_MSG").val();					//신청메모
	let name 	 = $("#INPUT_WITHDRAW_MASTER_NAME").val();	//예금주
	let bank 	 = $("#INPUT_WITHDRAW_BANK_NAME").val();		//은행
	let code 	 = $("#INPUT_WITHDRAW_BANK_NUMBER").val();	//계좌번호
	let memo	 = `${name} / ${bank} / ${code} / ${msg}`;

	//api 양식 토큰, 충전액, 화폐단위, 메모
	let obj = { Token:TOKEN, Capacity:Number(money), Currency:1, Memo:memo }

	api_post('withdraw',obj);

	let str 	 = `
	신청금액 : ${numberWithCommas(money)}원
	신청 메세지 : ${msg}
	환전 신청이 완료되었습니다`;
	customAlert('환전신청',str,'ok');

	$("#POPUP_WITHDRAW input").val('');
	$("#POPUP_WITHDRAW_CONTAINER").fadeOut();
});

//--내 자산목록 클릭
$(document).on("click","#MY_ASSET_LIST_TBODY div.table_row",function(){

	let serial = $(this).attr("item-serial");
	
	//선택한 내 자산매물 전역선언
	SELECT_MY_ASSET = MY_ASSET.find((x)=>{return x.Serial == serial }); 

	api_post("assetrecord",{AssetSerial:Number(serial)});
});

//-- 충전 신청 목록 테이블 만들기
function makeChargeListTable(list)
{
	let table = $("#POINT_LIST_TBODY"); //현재매물목록 테이블
	let html  = '';
	let type  = '';
	let price = '';
	let copy 	= [...list]; //복사
	
	copy = _.chain(list).sortBy("RegDate").reverse().value(); //정렬

	copy.forEach((v, num)=>{
		//action : 1충전, 2환전, 3적립, 4구매로 쓴돈, 5판매해서 번돈
		let { Balance, Capacity, Action, Memo, Progress, RegDate } = v;

		Progress = String(Progress);

		//진행결과 문자열로 변경
		switch(Progress)
		{
			case "-1" : Progress = `<p class="td_text red">취소</p>`; break;
			case "1"  : Progress = `<p class="td_text blue">승인</p>`; break;
			default   : Progress = `<p class="td_text green">신청중</p>`; break;
		}


		switch(Action)
		{
			case 1 : type = `<p class="td_title red">충전</p>`;  price = `<p class="td_title red">+ ${numberWithCommas(Capacity)}</p>`; break;
			case 2 : type = `<p class="td_title blue">환전</p>`; price = `<p class="td_title blue">- ${numberWithCommas(Capacity)}</p>`; break;
			case 3 : type = `<p class="td_title red">적립</p>`;  price = `<p class="td_title red">+ ${numberWithCommas(Capacity)}</p>`; break;
			case 4 : type = `<p class="td_title blue">매수</p>`; price = `<p class="td_title blue">- ${numberWithCommas(Capacity)}</p>`; break;
			case 5 : type = `<p class="td_title red">매도</p>`;  price = `<p class="td_title red">+ ${numberWithCommas(Capacity)}</p>`; break;
			case 6 : type = `<p class="td_title blue">분양</p>`;  price = `<p class="td_title blue">- ${numberWithCommas(Capacity)}</p>`; break;
			default : type = `<p class="td_title red">확인되지않은 액션</p>`;	 break;
		}

		RegDate = RegDate.substr(5)
		RegDate = RegDate.substr(0,11);

		html+=
		`
		<div class="table_row">
				<div class="table_td">
					${type}
					<p class="td_text">${RegDate}</p>
					<p class="td_text">${Memo}</p>
				</div>
				<div class="table_td">
					${price}
					<p class="td_text">잔금 ${numberWithCommas(Balance)}</p>
					${Progress}
					</p>
				</div>
			</div>
		`
	})

	table.html(html);
	table.niceScroll();
	table.getNiceScroll().resize();
}

//-- 내 보유 자산 목록 테이블 만들기
function makeMyAssetListTable(list)
{
	let table = $("#MY_ASSET_LIST_TBODY"); //현재매물목록 테이블
	let html = '';
	let totalPrice = 0;
	let contStr = '';

	if(!list){ return; }
	list.forEach((v, num)=>{

		let { Serial, UpdateDate, Nickname, Price, Contract, AVG } = v;

		switch(Contract)
		{
			case 100 : contStr = `<p class="td_text green">보유중</p>`; break;
			case 200 : contStr = `<p class="td_text blue">매도중</p>`; break;
			default :  contStr = `<p class="td_text blue">확인되지않은 액션</p>`; break;
		}

		let Title = convertSerialAll(Serial);
		Title = replaceAll(Title,"1출구","11출구");
		Title = replaceAll(Title,"2출구","12출구");
		Title = replaceAll(Title,"3출구","1출구");
		Title = replaceAll(Title,"4출구","2출구");
		Title = replaceAll(Title,"5출구","10출구");
		Title = replaceAll(Title,"6출구","9출구");

		html+=
		`
		<div class="table_row" item-serial='${Serial}' contract='${Contract}' price='${Price}'>
			<div class="table_td">
				<p class="td_title">${Title}</p>
				<p class="td_text">${UpdateDate}</p>
				<p class="td_text">${Nickname}</p>
			</div>
			<div class="table_td">
				<p class="td_title"> ${numberWithCommas(Price)}</p>
				${contStr}
			</div>
		</div>
		`
		totalPrice += Price;
	});

	table.html(html);
	table.niceScroll();
	table.getNiceScroll().resize();
	$("#MY_EXPECT_POINT").html(`${numberWithCommas(totalPrice)} <span style="color:#df3f5c">(0%)</span>`);
}

//-- 내 분양신청 목록 테이블 만들기
function makePresellListTable(list)
{

	let table = $("#MY_PRESELL_LIST_TBODY"); //현재매물목록 테이블
	let html = '';
	let contStr = '';
	let nickStr = '';

	if(!list){ return; }

	list.forEach((v, num)=>{

		let { AssetSerial, Phone, UpdateDate, Nickname, Price, Contract } = v;

		switch(Contract)
		{
			case -100 : contStr = `<p class="td_text red">거절됨</p>`;nickStr=`<p class="td_text red">${Nickname} 님 거절됨</p>`; break; 
			case 100 : contStr = `<p class="td_text red">분양완료</p>`;nickStr=`<p class="td_text red">${Nickname} 님 소유중</p>`; break;
			case 200 : contStr = `<p class="td_text blue">매도중</p>`; nickStr=`<p class="td_text blue">${Nickname} 님 매도중</p>`;break;
			default :  contStr = `<p class="td_text green">신청중</p>`; nickStr=`<p class="td_text green">${Nickname} 님 신청중</p>`;break;
		}

		let Title = convertSerialAll(AssetSerial);
		
		Title = replaceAll(Title,"1출구","11출구");
		Title = replaceAll(Title,"2출구","12출구");
		Title = replaceAll(Title,"3출구","1출구");
		Title = replaceAll(Title,"4출구","2출구");
		Title = replaceAll(Title,"5출구","10출구");
		Title = replaceAll(Title,"6출구","9출구");

		html+=
		`
		<div class="table_row" item-serial='${AssetSerial}' contract='${Contract}' price='${Price}'>
			<div class="table_td">
				<p class="td_title">${Title}</p>
				<p class="td_text">${UpdateDate}</p>
				${nickStr}
			</div>
			<div class="table_td">
				<p class="td_title"> ${numberWithCommas(Price)}</p>
				${contStr}
			</div>
		</div>
		`
	});

	table.html(html);
	table.niceScroll();
	table.getNiceScroll().resize();
}
// my_wallet.js : 내 지갑 스크립트 END
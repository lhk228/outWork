let g_save_flow_obj; //save flow object
let g_recentImgSrc = new Array(); //save image src
let g_recentFileSrc = new Array(); //save image src

let g_imgArray = [];
let g_fileArray = [];
let g_videoArray = [];

$(document).on("click","#BTN_COLLAPSE",function(){
	var target = $("#DIV_COLL_LOCATION");
	target.slideToggle();
	var mapContainer = document.getElementById('MAP_COLL'), // 지도를 표시할 div 
    mapOption = { 
        center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };

	// 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
	var map = new kakao.maps.Map(mapContainer, mapOption); 
	
});

//채팅 전송버튼 클릭 : 채팅방에 채팅입력
$(document).on('click','#BTN_CHAT_SUBMIT',function(){
	let text 	 = $(`#INPUT_USER_CHAT`).val();
	let target = $(`.chat-room`);
	let time = moment().format('HH:mm');

	console.log(time);
	let chatBox= 
	`
	<div class="chat-box p-4">
		<div class="user-thumb">
			<div class="square-box" style="background-image:url('resource/images/test_thumb.jpg')"></div>
		</div>
		<div class="chat-content">
			<div class="user-id">USER_001</div>
			<div class="user-chat myChat">${text}</div>
			<div class="chat-timelog text-sm">${time}</div>
		</div>
	</div>
	`;
	target.append(chatBox);
	$(`#INPUT_USER_CHAT`).val('');
})

//플로우바 클릭 : 해당하는 페이지 오픈, 선택클래스 부여 
$(document).on('click','.flow-bar',function(){

	if($('#TITLE_INPUT').val().length !==0 && $('#CONTEXT_INPUT').text().length !==0)
	{

		console.log("show flow Chart!")
		viewFlowPost();
	}
	else
	{
		initFlowChartWrite();
		$(".flow-bar").removeClass("selected");
		$(this).toggleClass('selected');
		$(`#POST_PAGE`).fadeIn().removeClass("hidden");
		$(`.post-list-container`).hide(0);
		
		console.log("show edit or add chart!")
	}

})

//플로우리스트 클릭 : 해당하는 페이지 오픈, 선택클래스 부여
$(document).on('click','.post-list',function(e){
	let nodeName = e.target.nodeName;

	switch(nodeName)
	{
		case "LI":
			break;
		case "BUTTON":
			break;
		default:break;
	}

	let listNum = $(this).index();
	console.log("list click :",listNum);
	listNum = 0;
	$(".flow-bar").eq(listNum).click();
});


//click ADD LIST BUTTON
$(document).on('click','#BTN_ADD_FLOW',function(){initFlowChartWrite()});


//click FLOW SAVE BUTTON
$(document).on('click','#BTN_SAVE_FLOWCHART',function(){
	let obj = makeFlowObejct();
	let url = "/saveFlowPost";
	if($('#TITLE_INPUT').val().length !== 0 && $('#CONTEXT_INPUT').text().length !== 0){
	flowChartClose();
	g_save_flow_obj = obj;
	makeFlowChartList(obj);
	// console.log(`makeFlowObejct:`,obj);
	console.log(`makeFlowObejct:`,g_save_flow_obj);
	return;
	api_post(url,obj);
	}else{
		customAlert('Please, fill the both input')

	}
	
});

// -- BTN_EDIT_FLOWCHART
$(document).on('click','#BTN_EDIT_FLOWCHART',function(){
	$('#NEW_READY_PAGE').removeClass('imgNone')
	var titleFlow =$("#TITLE").text();
	var contextFlow = $("#CONTEXT").text();
	$("#EDIT_TITLE_INPUT").val(titleFlow);
	$("#EDIT_CONTEXT_INPUT").html(contextFlow);
	$("#TITLE, #CONTEXT").hide();
	$("#EDIT_TITLE_INPUT, #EDIT_CONTEXT_INPUT, #BTN_NEWSAVE_FLOWCHART").show();
	$(this).hide();
});

//! GLOBAL VARIABLE 사용해주세요
$(document).on('click','#BTN_NEWSAVE_FLOWCHART',function(){
	var editedTitle =$("#EDIT_TITLE_INPUT").val();
	var editedContext =$("#EDIT_CONTEXT_INPUT").html()

	$("#TITLE").text(editedTitle);
	$("#CONTEXT").text(editedContext);
	$("#EDIT_TITLE_INPUT, #EDIT_CONTEXT_INPUT, #BTN_NEWSAVE_FLOWCHART").hide();
	$("#TITLE, #CONTEXT").show();
	$("#BTN_EDIT_FLOWCHART").show();
});

//뒤로가기 클릭 기능 분배
$(document).on('click','#BTN_FLOW_LEFT',function(){
	let detailBox	 	= $(`.detail-box`);					//상세정보 박스
	let flowBox		 	= $(`.flow-box`);						//상세정보 > 진행보고 박스
	let postBox 		= $(`.post-view-box`);			//진행보고 > 포스팅박스
  let postList 		= $(".post-list-container");//포스트 목록 컨테이너
	let artistBox		= $(`.seller-detail-box`);
	let newsBox			= $(`.news-popup`);
	if(artistBox.css("display") != "none")
	{
		artistBox.fadeOut();
		return;
	}
	if(newsBox.css("display") != "none")
	{
		newsBox.fadeOut();
		return;
	}
	//상품상세정봉에서 뒤로가기면 닫기
	if(detailBox.css("display") != 'none')
	{
		$(".btn_popup_close").click();
	}
	//포스팅박스에서 뒤로가면 리스트로
	if(postBox.css("display") == "block")
  {
    postBox.hide(0);
    postList.fadeIn();
    return;
  }

	//진행보고 에서 뒤로가면 상세정보로
	if(flowBox.css("display") == "flex")
	{
		flowBox.hide(0);
		detailBox.fadeIn();
    return;
	}
})

//작가정보 클릭 : 작가정보 표시
$(document).on('click','#BTN_ARTIST_INFO',function(){
	console.log("SELECTED_ITEM :",SELECTED_ITEM);
	$(`.seller-detail-box`).fadeIn();
	let { artist, explan, url } = SELECTED_ITEM;
	$(`.seller-name`).text(artist);
	$(`.seller-explan`).text(explan);	$(`.seller-url a`).attr("href",url);

})

//뉴스클릭 : 뉴스링크 iframe으로 열어준다..
$(document).on('click','.news-box',function(){
	$(`.news-popup`).fadeIn();
	let link = $(this).attr("link");
	$(`.news-popup`).attr("src", link);
	
})
//-- make flow list
function makeFlowChartList(obj)
{
	let { title, context } = obj;
	let li = 
		`
		<li class="post-list">
			<p class="title">${title}</p>
			<p class="context">클릭하여 글 확인하기</p>
		</li>
		`;
	$(".post-list-container").prepend(li);
}

//initFlowChartWrite
function initFlowChartWrite()
{
	$('#TITLE_INPUT').val('');
	$('#CONTEXT_INPUT').html('');
	$('#UPLOAD_FILE_NAME').empty();
	$('#UPLOAD_IMG_NAME').empty();
	$('#IMAGE_PREVIEW').attr("src","");
	$("#IMAGE_PREVIEW").removeClass("imgPreview")
	$("#IMAGE_PREVIEW").addClass("imgNone")

	console.log('add new item');
}

function flowChartClose(){
	console.log('close');
	$(`.post-view-box`).hide(0);
	$(`.post-list-container`).fadeIn();
	$(".flow-bar").removeClass("selected");
}

//-- makeFlowChart input Object
function makeFlowObejct()
{
	let title = $(`#TITLE_INPUT`).val();
	let context = $(`#CONTEXT_INPUT`).html();
	context = replaceAll(context,'\n','');
	context = replaceAll(context,'\t','');
	
	let obj = { title, context, g_imgArray, g_videoArray, g_fileArray};

	return obj;
}

//flowChart의 Post 보여주기
function viewFlowPost()
{
	let memberType = checkMemberType();

	console.log(memberType);
	switch(memberType)
	{
		case "viewer":
			$("#TITLE_INPUT").css({pointerEvents:"none"});
			$("#CONTEXT_INPUT").removeAttr('contenteditable');
		case "manager":
			$("#TITLE_INPUT").css({pointerEvents:"auto"});
			$("#CONTEXT_INPUT").attr('contenteditable',true);
	}

	$("#POST_PAGE").show()

	console.log("viewFlowPost > g_save_flow_obj :",g_save_flow_obj);
	console.log("viewFlowPost > g_recentImgSrc :",g_recentImgSrc);

	let  { title, context, videoCollect, upload, imgCollect } = g_save_flow_obj;
	$(".flow-bar").removeClass("selected");
	$(this).toggleClass('selected');
	$(`#READY_PAGE`).fadeIn().removeClass("hidden");
	$(`.post-list-container`).hide(0);

	
	$(`#TITLE`).text(title);
	$(`#CONTEXT`).text(context);
	$(`#UPLOAD_READY`).text(upload);

	if(g_recentImgSrc .length > 0)
	{
		$("#CONTEXT").append(`<img src='${g_recentImgSrc[0]}'>`)
	}
	// if(videoCollect.length > 0)
	// {
	// 	$("#CONTEXT").append(`${videoCollect[0]}`)
	// }

}
$(document).on('','',function(){})
function showArtistInfo()
{
	$(`.detail_box`).hide();

}

//회원 타입 확인
function checkMemberType()
{
	//1 step api check

	//2 return member type

	// ex) type : manager, member, seller.. 
	// let type = "manager";
	let type = "viewer"
	return type;

}

//투자모집 달성률 표시 + 애니메이션
function goalRateBarControl(cnt = 12458, totalCnt = 50000)
{
	let rate = Math.round((cnt/totalCnt)*100);

	$('.goal-rate-bar').delay(1000).animate({width:`${rate}%`},1000,'easeOutExpo');

	$({ val : 0 }).delay(1000).animate({ val : cnt }, {
		duration: 1000,
	step: function() {
		var num = numComma(Math.floor(this.val));
		$(".goal-rate-text").text(`${num}/${numComma(totalCnt)}`);
	},
	complete: function() {
		var num = numComma(Math.floor(this.val));
		$(".goal-rate-text").text(`${num}/${numComma(totalCnt)}`);
	}
});

}

//선택한 매물 정보 보여주기
function viewItemDetail()
{
	let { key, price, artist, name } = SELECTED_ITEM;
	let header = $(".detail-header");

	console.log(sampleData);
	header.find(`.item-title`).text(name);
	header.find(`.item-price`).text(numComma(price));
	header.find(`.item-context`).text(artist);
	header.find(`.item-thumb`).css({backgroundImage:`url('resource/images/${key}.jpg')`});
}
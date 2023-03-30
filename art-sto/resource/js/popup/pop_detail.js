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
		$(`.flow-list-container`).hide(0);
		
		console.log("show edit or add chart!")
	}

})

//플로우리스트 클릭 : 해당하는 페이지 오픈, 선택클래스 부여
$(document).on('click','.flow-list',function(e){
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


//닫기버튼 클릭 : 페이지 닫고 초기상태로
// $(document).on('click','.btn_close',function(){ flowChartClose()});

//뒤로가기 클릭 : 플로우차트 닫고 상세설명페이지로
$(document).on('click','#BTN_FLOW_LEFT',function(){
	let flowBox		 	= $(`.flow-box`);
	let detailBox	 	= $(`.detail-box`);
	let flowDetail 	= $(`.flow-view-box`);
	let flowDisplay = flowBox.css("display");
	let detailDisplay = flowDetail.css("display");
  let flowList = $(".flow-list-container");
  let readyDisplay = $("#READY_PAGE").css("display");
  
  if(readyDisplay != "none")
  {
    flowDetail.hide(0);
    flowList.fadeIn();
    return;
  }

  if(detailDisplay == "block")
  {
    flowDetail.hide(0);
    flowList.fadeIn();
    return;
  }


	if(flowDisplay == "flex")
	{
		flowBox.hide(0);
		detailBox.fadeIn();
    return;
	}


})

$(document).on('click','#BTN_WRITE_FLOW',function(){
	console.log('작성모드')
})


//-- make flow list
function makeFlowChartList(obj)
{
	let { title, context } = obj;
	let li = 
		`
		<li class="flow-list">
			<p class="title">${title}</p>
			<p class="context">클릭하여 글 확인하기</p>
		</li>
		`;
	$(".flow-list-container").prepend(li);
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

$(document).on('click', '#CLOSE_POST', function(){flowChartClose
console.log('close flow');
})

$(document).on('click','#BTN_CLOSE_READY #CLOSE_POST',function(){flowChartClose()});


function flowPageClose(){
	console.log('close');
	$(`.flow-view-box`).hide(0);
	$(`.flow-list-container`).fadeIn();
	$(".flow-bar").removeClass("selected");
}

function flowChartClose(){
	console.log('close');
	$(`.flow-view-box`).hide(0);
	$(`.flow-list-container`).fadeIn();
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
	$(`.flow-list-container`).hide(0);

	
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


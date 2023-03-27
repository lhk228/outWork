


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
	var fileNameSplit = $('#FILE_UPLOAD').val().split('\\').pop();
	if($('#TITLE_INPUT').val().length !==0 && $('#CONTEXT_INPUT').val().length !==0){
		$(".flow-bar").removeClass("selected");
		$(this).toggleClass('selected');
		$(`#READY_PAGE`).fadeIn().removeClass("hidden");
		$(`.flow-list-container`).hide(0);
		$(`#TITLE`).text($('#TITLE_INPUT').val());
		$(`#CONTEXT`).text($('#CONTEXT_INPUT').val());
		$(`#UPLOAD_READY`).text(fileNameSplit);
		console.log("hi ready")
	}else{
		$(".flow-bar").removeClass("selected");
		$(this).toggleClass('selected');
		$(`#INPUT_PAGE`).fadeIn().removeClass("hidden");
		$(`.flow-list-container`).hide(0);
		console.log("hi input")
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

let g_save_flow_obj;
//click ADD LIST BUTTON
$(document).on('click','#ADD_FLOW_LIST_BUTTON',function(){ initFlowChartWrite() });

//click FLOW SAVE BUTTON
$(document).on('click','#BTN_SAVE_FLOWCHART',function(){
	
	let obj = makeFlowObejct();
	let url = "/saveFlowPost";
	if($('#TITLE_INPUT').val().length !== 0 && $('#CONTEXT_INPUT').val().length !== 0){
	flowChartClose();
	// g_save_flow_obj = obj;
	makeFlowChartList(obj);
	console.log(`makeFlowObejct :`,obj);
	return;
	api_post(url,obj);
	}else{
		customAlert('Please, fill the both input')

	}
	
});
// -- BTN_EDIT_FLOWCHART
$(document).on('click','#BTN_EDIT_FLOWCHART',function(){
	var titleFlow =$("#TITLE").text();
	var contextFlow = $("#CONTEXT").text();
	$("#EDIT_TITLE_INPUT").val(titleFlow);
	$("#EDIT_CONTEXT_INPUT").val(contextFlow);
	$("#TITLE, #CONTEXT").hide();
	$("#EDIT_TITLE_INPUT, #EDIT_CONTEXT_INPUT, #BTN_NEWSAVE_FLOWCHART").show();
	$(this).hide();
});

$(document).on('click','#BTN_NEWSAVE_FLOWCHART',function(){
	var editedTitle =$("#EDIT_TITLE_INPUT").val();
	var editedContext =$("#EDIT_CONTEXT_INPUT").val()
	$("#TITLE").text(editedTitle);
	$("#CONTEXT").text(editedContext);
	$("#EDIT_TITLE_INPUT, #EDIT_CONTEXT_INPUT, #BTN_NEWSAVE_FLOWCHART").hide();
	$("#TITLE, #CONTEXT").show();
	$("#BTN_EDIT_FLOWCHART").show();
	console.log();
});


//닫기버튼 클릭 : 페이지 닫고 초기상태로
$(document).on('click','.btn_close',function(){flowChartClose()});

//뒤로가기 클릭 : 플로우차트 닫고 상세설명페이지로
$(document).on('click','#BTN_FLOW_LEFT',function(){
	let flowBox		 	= $(`.flow-box`);
	let detailBox	 	= $(`.detail-box`);
	let flowDetail 	= $(`.flow-view-box`);
	let flowDisplay = flowBox.css("display");
	let detailDisplay = flowDetail.css("display");

	
	if(flowDisplay == "flex")
	{
		flowBox.hide(0);
		detailBox.fadeIn();
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
			<p class="context">${context}</p>
		</li>
		`;
	$(".flow-list-container").prepend(li);
}

//initFlowChartWrite
function initFlowChartWrite()
{
	$('#TITLE_INPUT').val('');
	$('#CONTEXT_INPUT').val('');
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
	let context = $(`#CONTEXT_INPUT`).val();
	let upload = $(`#FILE_UPLOAD`).val();
	let obj = { title, context, upload };

	return obj;
}
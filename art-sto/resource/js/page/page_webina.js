let WEBINA_STEP = 1;

//공통 : 다음단계로
$(document).on(`click`,`#BTN_NEXT_STEP`,function(){
	
	WEBINA_STEP += 1;

	console.log('WEBINA_STEP :',WEBINA_STEP);

	$("#PROJECT_WEBINA .step-div").hide(0);
	$(`#PROJECT_WEBINA .step-div[step='${WEBINA_STEP}']`).fadeIn();

	if(WEBINA_STEP == 3){ $(this).hide(); return; }

});

//-- STEP01
//비디오추가 : 팝업보여주기
$(document).on(`click`,`#UPLOAD_VIDEO_BOX`,function(){
	$("#POPUP_MARKETING").show();
	$(".video-popup").show().css({top:0});
});

//비디오추가 : 팝업입력 적용
$(document).on(`click`,`#BTN_VIDEO_CONFIRM`,function(){
	let video = $(`#INPUT_VIDEO_LINK`).val();
	$("#UPLOAD_VIDEO_BOX").html(video);
});

//팝업닫기
$(document).on(`click`,`.btn_popup_close`,function(){ $(".popup-container").fadeOut(); });

//컨텐츠 입력시 미리보기 텍스트 없애기
$(document).on(`click`,`#CONTENT_INPUT`,function(){$("#INIT_SPAN").text(''); });

//입력 적용
$(document).on(`click`,`#STEP_01_CONVERT`,function(){
	let headerInput = $("#HEADER_INPUT").val();
	let videoInput = $(`#INPUT_VIDEO_LINK`).val();
	let contentInput =$("#CONTENT_INPUT").html();
	let pageObject = { headerInput, videoInput, contentInput };

	$("#HEADER_RESULT").text(headerInput);
	$("#VIDEO_RESULT").html(videoInput);
	$("#CONTENT_RESULT").html(contentInput);
});

//입력 초기화
$(document).on(`click`,`#INIT_WRITE_THINGS`,function(){
	$("#HEADER_INPUT").val("");
	$("#INPUT_VIDEO_LINK").val("");
	$("#UPLOAD_VIDEO_BOX").html("동영상 링크를 넣어주세요")
	$("#CONTENT_INPUT").html(`<span id="INIT_SPAN" style="color:#999">컨텐츠 입력</span>`);
});


//-- STEP-2
//비디오추가 : 팝업보여주기
$(document).on(`click`,`.step2-video-box`,function(){
	let popnum = $(this).attr("pop");

	console.log('popnum :',popnum);
	$("#POPUP_STEP2_VIDEO").show();
	$(`.video-popup[step2-pop]`).hide()
	$(`.video-popup[step2-pop='${popnum}']`).show().css({top:0});
});

//비디오추가 1 : 팝업입력 적용
$(document).on(`click`,`#BTN_STEP2_VIDEO_01_CONFIRM`,function(){
	let video = $(`#INPUT_STEP2_VIDEO_LINK_01`).val();
	$("#STEP_02_VIDEO_01").html(video);
});

//비디오추가 2: 팝업입력 적용
$(document).on(`click`,`#BTN_STEP2_VIDEO_02_CONFIRM`,function(){
	let video = $(`#INPUT_STEP2_VIDEO_LINK_02`).val();
	$("#STEP_02_VIDEO_02").html(video);
});

//입력 적용
$(document).on(`click`,`#STEP_02_CONVERT`,function(){
	let headerInput = $("#STEP_02_HEADER_INPUT").val();
	let videoInput1 = $(`#STEP_02_VIDEO_01`).html();
	let videoInput2 = $(`#STEP_02_VIDEO_02`).html();
	let videoText1	= $("#STEP_02_VTEXT_01").html();
	let videoText2	= $("#STEP_02_VTEXT_02").html();
	let contentInput =$("#STEP_02_CONTENTS_INPUT").html();

	$("#STEP_02_HEADER_RESULT").text(headerInput);
	$("#STEP_02_VIDEO_01_RESULT").html(videoInput1);
	$("#STEP_02_VIDEO_02_RESULT").html(videoInput2);
	$("#STEP_02_VTEXT_01_RESULT").html(videoText1);
	$("#STEP_02_VTEXT_02_RESULT").html(videoText2);
	$("#STEP_02_CONTENTS_RESULT").html(contentInput);
});

//입력 초기화
$(document).on(`click`,`#INIT_STEP_02`,function(){
	$("#STEP_02_HEADER_INPUT").val('');
	$(`#STEP_02_VIDEO_01`).html('');
	$(`#STEP_02_VIDEO_02`).html('');
	$("#STEP_02_VTEXT_01").html('');
	$("#STEP_02_VTEXT_02").html('');
	$("#STEP_02_CONTENTS_INPUT").html('');
});

//-- STEP-3
//비디오추가 : 팝업보여주기
$(document).on(`click`,`.step3-video-box`,function(){
	let popnum = $(this).attr("pop");
	$("#POPUP_STEP3_VIDEO").show();
	$(`.video-popup[step3-pop]`).hide()
	$(`.video-popup[step3-pop='${popnum}']`).show().css({top:0});
});

//비디오추가 1 : 팝업입력 적용
$(document).on(`click`,`#BTN_STEP3_VIDEO_01_CONFIRM`,function(){
	let video = $(`#INPUT_STEP3_VIDEO_LINK_01`).val();
	$("#STEP_03_VIDEO_01").html(video);
});

//이미지 버튼 클릭 : 이미지 INPUT 클릭 > 탐색기
$(document).on(`click`,`#BTN_IMG_UPLOAD`,function(){
	$(`#IMG_UPLOAD`).click();
});

//이미지 추가
$(document).on(`change`,`#IMG_UPLOAD`,function(){
	var file = this.files[0];	
	var reader = new FileReader();
	
	reader.readAsDataURL(file);

	console.log('file :',file);
	reader.onload = function(e){
		$('#STEP_03_CONTENTS_INPUT').prepend(`<img class="contextImg" style="width:100%" src='${e.target.result}' alt=''>`);
	}
});

//비디오추가2 : 팝업 보여주기
$(document).on(`click`,`#BTN_VIDEO_UPLOAD`,function(){
	$("#POPUP_STEP3_VIDEO").show();
	$(`.video-popup[step3-pop]`).hide()
	$(`.video-popup[step3-pop='2']`).show().css({top:0});
});

//비디오추가2 : 팝업입력 적용
$(document).on(`click`,`#BTN_STEP3_VIDEO_02_CONFIRM`,function(){
	let video = $(`#INPUT_STEP3_VIDEO_LINK_02`).val();
	$('#STEP_03_CONTENTS_INPUT').append(video);
	$('#STEP_03_CONTENTS_INPUT iframe').removeAttr("width");
	$('#STEP_03_CONTENTS_INPUT iframe').removeAttr("height");

});


//입력 적용
$(document).on(`click`,`#STEP_03_CONVERT`,function(){
	let headerInput = $("#STEP_03_HEADER_INPUT").val();
	let videoInput1 = $(`#STEP_03_VIDEO_01`).html();
	let videoText1	= $("#STEP_03_VTEXT_01").html();
	let contentInput =$("#STEP_03_CONTENTS_INPUT").html();

	$("#STEP_03_HEADER_RESULT").text(headerInput);
	$("#STEP_03_VIDEO_01_RESULT").html(videoInput1);
	$("#STEP_03_VTEXT_01_RESULT").html(videoText1);
	$("#STEP_03_CONTENTS_RESULT").html(contentInput);
});

//입력 초기화
$(document).on(`click`,`#INIT_STEP_03`,function(){
	$("#STEP_03_HEADER_INPUT").val('');
	$(`#STEP_03_VIDEO_01`).html('');
	$("#STEP_03_VTEXT_01").html('');
	$("#STEP_03_CONTENTS_INPUT").html('');
});

//주문하기 버튼클릭
$(document).on(`click`,`#BTN_STEP3_SUBMIT`,function(){
	location.href="#/payment";
});
//창 닫기버튼
$(document).on('click','.btn-box-close',function(){
  $(this).parents(".box").hide();
});

//검색옵션버튼
$(document).on('click','#BTN_SET_SEARCH_OPTION',function(){
  $('.search-option-box').show();
});

//레이아웃 저장 OK
$(document).on(`click`,`#BTN_SAVE_LAYOUT_OK`,function(){
  customAlert('현재 설정이 저장되었습니다');
  popupControl("hide",'popup_layout_save');
})

//레이아웃 저장팝업
$(document).on('click','#BTN_SAVE_LAYOUT',function(){ popupControl("show",'popup_layout_save'); });

//좌측메뉴버튼 클릭
$(document).on('click','.sidemenu li',function(){
  let popName     = $(this).find("i").attr("name"); //팝업명
  let headerTitle = ''; //헤더타이틀명

  //팝업 보여주기
  $(".page-container").find(`#${popName}`).fadeIn();

  //헤더 보여주기
  $(`.header-box div`).not("#HEADER_TITLE").hide();
  $(`.header-box div[name='${popName}']`).fadeIn();

  switch(popName)
  {
    case "MEMBER_ADMIN": headerTitle = '회원관리'; break;
    case "TRANS_ADMIN": headerTitle = '번역관리'; break;
    case "CAL_ADMIN": headerTitle = '정산관리'; break;
    case "BENEFIT_ADMIN": headerTitle = '수익관리'; break;
    case "PAY_ADMIN": headerTitle = '결제관리'; break;
    case "BLOG_ADMIN": headerTitle = '블로그관리'; break;
    case "OPERATION_ADMIN": headerTitle = '운영관리'; break;
  }
  $("#HEADER_TITLE").text(headerTitle);
});

//클릭한 팝업 상단배치
$(document).on('click','.box-title', function(){
  $(".page-container .box").css({zIndex:1});
  $(this).parents(".box").css({zIndex:2});

  let name = $(this).parents(".box").attr("id");
  $(`.sidemenu li i[name='${name}']`).click();
});

//바깥클릭하면 검색옵션팝업닫기



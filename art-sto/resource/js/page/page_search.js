var searchText = '';
var sampleData =
[
	{ key:'a1', name:'바람', artist:'이우환', price:3100000000, explan:'이우환(李禹煥, 1936년 6월 24일 ~ )은 대한민국의 조각가, 화가이다. 일본의 획기적 미술 운동인 모노파의 창시자이며, 동양사상으로 미니멀리즘의 한계를 극복하여 국제적으로 명성이 높다. 주요 작품으로는 〈선으로부터〉(1974), 〈동풍〉(1974), 〈조응〉(1988), 〈점에서〉(1975), 〈상응〉(1998) <관계항(Relatum> (2010)등이 있다.', url:'https://ko.wikipedia.org/wiki/%EC%9D%B4%EC%9A%B0%ED%99%98'},
	{ key:'a2', name:'바람과 함께', artist:'이우환', price:400000000, explan:'이우환(李禹煥, 1936년 6월 24일 ~ )은 대한민국의 조각가, 화가이다. 일본의 획기적 미술 운동인 모노파의 창시자이며, 동양사상으로 미니멀리즘의 한계를 극복하여 국제적으로 명성이 높다. 주요 작품으로는 〈선으로부터〉(1974), 〈동풍〉(1974), 〈조응〉(1988), 〈점에서〉(1975), 〈상응〉(1998) <관계항(Relatum> (2010)등이 있다.', url:'https://ko.wikipedia.org/wiki/%EC%9D%B4%EC%9A%B0%ED%99%98'},
	{ key:'b1', name:'우주', artist:'김환기', price:13200000000, explan:'김환기(金煥基, 1913년 4월 3일 (1913년 음력 2월 27일)[1] ~ 1974년 7월 25일)는 대한민국의 서양화가이다. 그의 작품은 한국의 미술품 경매의 신기록을 쓰고있다.[2]',url:'https://ko.wikipedia.org/wiki/%EA%B9%80%ED%99%98%EA%B8%B0' },
	{ key:'b2', name:'붉은점화', artist:'김환기', price:3100000000, explan:'김환기(金煥基, 1913년 4월 3일 (1913년 음력 2월 27일)[1] ~ 1974년 7월 25일)는 대한민국의 서양화가이다. 그의 작품은 한국의 미술품 경매의 신기록을 쓰고있다.[2]',url:'https://ko.wikipedia.org/wiki/%EA%B9%80%ED%99%98%EA%B8%B0' },
	{ key:'c1', name:'호박', artist:'쿠사마야요이', price:4500000000, explan:'쿠사마 야요이(1929년 3월 22일 ~ )는 일본의 조각가 겸 설치미술가이다. 쿄토시립 미술 공예학교(현 교토예대) 졸업. 1929년 일본 나가노현에서 출생, 1957년부터 1972년까지 뉴욕에서 작품 활동을 전개하였다. ',url:'https://ko.wikipedia.org/wiki/%EA%B5%AC%EC%82%AC%EB%A7%88_%EC%95%BC%EC%9A%94%EC%9D%B4'},
	{ key:'c2', name:'붉은호박', artist:'쿠사마야요이', price:200000000, explan:'쿠사마 야요이(1929년 3월 22일 ~ )는 일본의 조각가 겸 설치미술가이다. 쿄토시립 미술 공예학교(현 교토예대) 졸업. 1929년 일본 나가노현에서 출생, 1957년부터 1972년까지 뉴욕에서 작품 활동을 전개하였다. ',url:'https://ko.wikipedia.org/wiki/%EA%B5%AC%EC%82%AC%EB%A7%88_%EC%95%BC%EC%9A%94%EC%9D%B4' },
];

var SELECTED_ITEM;

//맵뷰변경버튼 클릭 : 랭킹 <=> 카카오맵 전환
$(document).on('click','.btn-change-mapview',function(){
	let mapView		 = $(`.topmap-view`);
	let rankView	 = $(`.toprank-view`);
	let mapDisplay = mapView.css("display");

	if(mapDisplay == "none"){
		mapView.show(); rankView.hide();
		$("#BTN_MAPVIEW").hide();
		$("#BTN_SEARCHVIEW").show();
		kakaoItemMap(searchText);
		
	} else {
		mapView.hide(); rankView.show();
		$("#BTN_MAPVIEW").show();
		$("#BTN_SEARCHVIEW").hide();
	}
})

//카테고리 클릭 : 카테고리 해당하는 물품 보여주기 TODO
$(document).on('click','.category-list button',function(){});

//순위박스 클릭 : 강조 및 리스트에서도 강조
$(document).on('click','.rank-box',function(){
	$(`.rank-box`).removeClass("selected");
	$(this).addClass("selected");
	let key = $(this).attr('key');
	$(`#TABLE_SEARCH_TBODY .table_row`).removeClass("selected");
	$(`#TABLE_SEARCH_TBODY .table_row[key='${key}']`).addClass("selected");
})

//북마크 ON/OFF
$(document).on('click','.item-bookmark',function(){
	$(this).toggleClass("selected")
})

//검색결과목록 클릭 : 상세정보 오픈
$(document).on('click','#TABLE_SEARCH_TBODY .table_row',function(e){
	if(e.target.nodeName != "I") popupControl('show',`${POPUP_PATH}pop_detail.html`);
	let key = $(this).attr("key");
	SELECTED_ITEM = sampleData.find(x => x.key == key);
})

//진행보고서 클릭 : 진행보고 보여주기(플로우)
$(document).on('click','#BTN_FLOWCHART',function(){
	showFlowChart();
})

//플로우차트 보여주기
function showFlowChart()
{
	let flowBox		 = $(`.flow-box`);
	let detailBox	 = $(`.detail-box`);

	if(flowBox.css("display") == "none")
	{
		detailBox.hide(0);
		flowBox.fadeIn();
	}
}

//카카오맵
function kakaoItemMap(address='강남대로 94길 34', itemName='상품명')
{
	//카카오맵
	let containerH = $(".topmap-view").height();

	$("#searchMap").height(containerH + 'px');
	var container = document.getElementById('searchMap'); //지도를 담을 영역의 DOM 레퍼런스
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




var searchText = '';

//READY FUNCTION

//맵뷰변경버튼
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

//북마크
$(document).on('click','.item-bookmark',function(){
	$(this).toggleClass("fa-regular")
	$(this).toggleClass("fa-solid");
})

//검색결과목록
$(document).on('click','#TABLE_SEARCH_TBODY .table_row',function(e){
	if(e.target.nodeName != "I") popupControl('show',`${POPUP_PATH}/pop_detail.html`);
})

//진행보고서 클릭 : 플로우차트 보여준다
$(document).on('click','#BTN_FLOWCHART',function(){
	let flowBox		 = $(`.flow-box`);
	let detailBox	 = $(`.detail-box`);
	let flowDisplay = flowBox.css("display");

	if(flowDisplay == "none")
	{
		detailBox.hide(0);
		flowBox.fadeIn();
	}
})

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




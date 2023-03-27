// 라우트 어플리케이션 생성
var app = Sammy(function () {
	
	//------------------페이지
	
	//메인페이지
	this.get("/", function () { pageTransition(`${PAGE_PATH}main.html`); });

	

	//404
	this.notFound = function (verb, path) { $("#PAGE_VIEW").html("404, 페이지 못찾음"); };
});

//어플리케이션 시작
$(function () {
	app.run();
}); 
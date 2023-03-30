// 라우트 어플리케이션 생성
var app = Sammy(function () {
		
	//메인페이지
	this.get("/", function () { pageTransition(`${PAGE_PATH}main.html`); });

	//------------------페이지
	//로그인
	this.get("#/login", function () { pageTransition(`${PAGE_PATH}login.html`); });

	//회원가입
	this.get("#/join", function () { pageTransition(`${PAGE_PATH}join.html`); });

	//검색
	this.get("#/search", function () { pageTransition(`${PAGE_PATH}search.html`); });

	//랭킹
	this.get("#/rank", function () { pageTransition(`${PAGE_PATH}rank.html`); });

	//원페이지 발행서비스
	this.get("#/marketing", function () { pageTransition(`${PAGE_PATH}marketing.html`);});
	
	//원페이지 발행서비스2
	this.get("#/project", function () { pageTransition(`${PAGE_PATH}project.html`); });

	//원페이지 - 웨비나
	this.get("#/webina", function () { pageTransition(`${PAGE_PATH}webina.html`); });
	
	//원페이지 - 컨설트
	this.get("#/consult", function () { pageTransition(`${PAGE_PATH}consult.html`); });
	
	//원페이지 - 챌린지
	this.get("#/challenge", function () { pageTransition(`${PAGE_PATH}challenge.html`); });
	
	//원페이지 - 결제
	this.get("#/payment", function () { pageTransition(`${PAGE_PATH}payment.html`); });
	
	//404
	this.notFound = function (verb, path) { $("#PAGE_VIEW").html("404, 페이지 못찾음"); };
});

//어플리케이션 시작
$(function () {
	app.run();
}); 
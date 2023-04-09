// 라우트 어플리케이션 생성
var app = Sammy(function () {
  console.log('sammy working');
  //------------------페이지
  
  //기본
  this.get("/", function () { pageTransition(`${PAGE_PATH}admin.html`); });
  
  //메인
  this.get("#/admin", function () { pageTransition(`${PAGE_PATH}admin.html`); });
  
  //404
  this.notFound = function (verb, path) { $("#PAGE_VIEW").html("404, 페이지 못찾음"); };
});

//어플리케이션 시작
$(function () {
  app.run();
}); 

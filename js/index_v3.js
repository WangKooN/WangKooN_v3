// add Google Analytics - ID : UA-58698723-1
// 
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-58698723-1', 'auto');
  ga('send', 'pageview');


//"use strict";

var isView = 0; // 현재 내가 보고 있는 인덱스

$(document).ready(function(){pageResizing();});
$(window).resize(function(){pageResizing();});

$(window).load(function(){	

	$(".extMenuList li").eq(2).hover(
		function(){
			$(this).stop(true,true).animate({"height":"75px"},300);
			$(this).find("div").stop(true,true).fadeIn(300);
		},function(){
			$(this).animate({"height":"28px"},300);
			$(this).find("div").fadeOut(300);
		}
	);

	addSideMenu(); // 우측메뉴 생성, 포지셔닝
	showSideMenu(); // 우측 메뉴 버튼 활성화
	mainVisual(); // 인트로 에니메이션 실행
	pfScrollCtrl(); // 포트폴리오 좌우 스크롤 실행
	skillPageCtrl(); // 스킬페이지 실행

});

$(window).scroll(function(){
	

	// 이력서 좌우 이동 스크롤	
	var nowPos = $(window).scrollTop() - $(".conBox").eq(1).offset().top - 50 ;
	if ( nowPos > 0 ) nowPos = -nowPos;
	var resumeOpacity = (nowPos + $(window).height() / 2) / ($(window).height() / 2);

	if ( $(window).scrollTop() < $(".conBox").eq(2).offset().top ){

		$(".resume_data").css({"marginLeft": $(window).scrollTop() - $(".conBox").eq(1).offset().top -290 , "opacity":resumeOpacity});

	}

	var nowPos2 = $(window).scrollTop() - $(".conBox").eq(4).offset().top ;
	if ( nowPos2 > 0 ) nowPos2 = -nowPos2;
	var resumeOpacity2 = (nowPos2 + $(window).height() / 2) / ($(window).height() / 2) - 0.2;

	if ( $(window).scrollTop() > $(".conBox").eq(3).offset().top && $(window).scrollTop() < $(".conBox").eq(5).offset().top ){	

		$(".skills_con ul li").each(
			function(e){

				if ( $(this).hasClass("t1") ) {
					$(this).css({"marginLeft": parseInt(skillsPos[e],10) - ( $(window).scrollTop() - $(".conBox").eq(4).offset().top ) , "opacity":resumeOpacity2});
				}else{
					$(this).css({"marginLeft": parseInt(skillsPos[e],10) + ( $(window).scrollTop() - $(".conBox").eq(4).offset().top ) , "opacity":resumeOpacity2});
				}
			}
		);

	}

	// 세로 좌표별 사이드 메뉴 활성화
	showSideMenu();
	
});

// 인트로 애니메이션
function mainVisual(){
	
	$(".main_con .visual").animate({"backgroundPositionY":"50%","opacity":1},300,"linear",textAnimation);

	function textAnimation(){
		var txtPos = 0; // 현재 위치
		var mvSkip = false; // 인트로 스킵 여부
		
		// 인트로 스킵
		$(".main_con .visual").click(function(){
			mvSkip = true;
			// $(".main_con .visual").find("img").remove();
			$(".main_con .visual").find("span").remove();
		});

		// ["왕","군","웹","공","방","세","번","째","작","업","실"]
		var textLen = [4,3,4,3,3,2,3,2,3,3,3]; // 글자 획수
		var nowText = [0,0,0,0,0,0,0,0,0,0,0]; // 현재 위치

		var textAniTime = setTimeout(function(){textWrite(txtPos);},500); // 최초실행

		function textWrite(num){
			if(!mvSkip){ // SKIP MODE OFF
				if ( num < $(".title .tit").length ){
					$(".title .tit").eq(num).css("display","inline-block");
					if( textLen[num] > nowText[num] ){
						$(".title .tit").eq(num).css("backgroundPositionY",-nowText[num]*130);
						nowText[num]++;
						textAniTime = setTimeout(function(){textWrite(txtPos);},80);
					}else{
						txtPos++;
						if ( num === 2 || num === 1 || num === 4 || num === 5){
							if ( num === 1 ){
								$(".title .titleLine1 .cursor").remove();
								$(".title .titleLine2 .cursor").css("display","inline-block");
							}
							if ( num === 4 ){
								$(".title .titleLine2 .cursor").remove();
								$(".title .titleLine3 .cursor").css("display","inline-block");
							}
							textAniTime = setTimeout(function(){textWrite(txtPos);},300);
						}
						else textAniTime = setTimeout(function(){textWrite(txtPos);},80);
					}
				}else{
					$(".titleLine4").css("display","inline-block");
					$(".titleLine4").animate({"opacity":1},500);
					$(".main_con .visual").find("img").remove();
				}
			}else{ // SKIP MODE ON
				$(".title .tit").css("display","inline-block");
				$(".title .tit").each(
					function(e){
						$(this).css("backgroundPositionY",-(textLen[e]-1)*130);
						$(".title .titleLine1 .cursor,.title .titleLine2 .cursor").remove();
						$(".title .titleLine3 .cursor, .titleLine4").css("display","inline-block");						
						$(".titleLine4").animate({"opacity":1},500);
					}
				);

			}

		}
	}

}

// 사이드 메뉴 
var sideBgColor = ["#dd1c52","#39aed9","#6239d9","#e8681a","#89b416","#696969"];
var sideTit = ["INTRO","RESUME","PUBLISHING","DESIGN","SKILLS","BOARD"];
function addSideMenu(){

	$("#wrapper .conBox").each(
		function(e){			
			$(".sideMenu ul").append('<li class="btnSideMenu"><div class="flipMenu">'+sideTit[e]+'</div></li>');
			$(".sideMenu ul").find(".btnSideMenu").eq(e).css("background-color",sideBgColor[e]);
			$(".sideMenu ul").find(".btnSideMenu").eq(e).click(function(){scrollMove(e);});
			$(".sideMenu ul li").eq(e).hover(function(){
				if ( isView !== e ) $(this).find(".flipMenu").fadeIn(300);
			},function(){
				$(this).find(".flipMenu").fadeOut(100);
			});
		}
	);
}

// 스크롤 이동 함수
function scrollMove(num){
	$("body,html").stop().animate({scrollTop: $("#wrapper .conBox").eq(num).offset().top},700);
	showLayer(".extMenuReal","hide");
}

// 우측 버튼 활성화 함수
function showSideMenu(){
	
	isView = parseInt($(window).scrollTop() / $(window).height(),10);

	$(".sideMenu ul li").not(isView).removeClass("on");
	$(".sideMenu ul li").eq(isView).addClass("on");

}

// Responsive Page Reload
function pageResizing(){
	
	// .conBox Resizing
	$(".conBox").css("height",$(window).height());

	// 사이즈 메뉴 세로 중앙 정렬
	$(".sideMenuList").css( "margin-top",-($("#wrapper .conBox").length * 35 - 10) / 2 );

	// 가로 사이즈에 따른 포트폴리오 박스크기 변화
	if ( parseInt($(window).width(),10) < 1400 ) $(".portfolioWrap").css("width","760px");
	else if ( parseInt($(window).width(),10) < 1800 ){ $(".portfolioWrap").css("width","1015px");}
	else $(".portfolioWrap").css("width","1270px");

	// 포트폴리오 박스 내 페이지 새로고침
	makePageList(0);
	makePageList(1);

}


// 포트폴리오 데이터 불러오기
var xmlPath = ["xml/portfolioData.xml","xml/portfolioData2.xml"];
var xmlData = []; // new Array()

showSubData(xmlPath[0],0); // 포트폴리오 - 퍼블리싱 로드
showSubData(xmlPath[1],1); // 포트폴리오 - 디자인 로드

function showSubData(path,con){

	xmlData[con] = new Array(6);

	for ( var i = 0 ; i < xmlData[con].length ; i++){
		xmlData[con][i] = [];
	}

	$.ajax({
		url: path,
		dataType: "xml",
		success: function(data){

			$("item", data).each(function(e){
				xmlData[con][0].push($(this).find("title").text()); // 타이틀
				xmlData[con][1].push($(this).find("imgData1").text()); // 작은 이미지
				xmlData[con][2].push($(this).find("imgData2").text()); // 큰 이미지
				xmlData[con][3].push($(this).find("link").text()); // 페이지 링크
				xmlData[con][4].push($(this).find("description").text()); // 페이지 정보

				// 포트폴리오 설명 XML데이터 유무 판단
				if( $(this).find("description2").text() === "" || $(this).find("description2").text() === null ){
					xmlData[con][5].push($(this).find("description").text()); // 페이지 정보
				}else{
					xmlData[con][5].push($(this).find("description2").text()); // 페이지 정보
				}

				// 한줄 데이터의 줄바꿈을 위한 치환
				desTemp = xmlData[con][4][e].replace(/::/g,"<br/>");

				// 포트폴리오 메인 데이터 뿌리기
				$(".portfolio_con").eq(con).find(".portfolioList").append('<li>'
					+ '<div class="conArea">'
					+ '	<span class="portImg"><img src="'+xmlData[con][1][e]+'" alt="" /></span>'
					+ '	<a class="btnExtMenu"><img src="images/btnPortfolioExt.png" alt="" /></a>'
					+ '</div>'
					+ '<p class="conTit">'+xmlData[con][0][e]+'</p>'
					// + '<p class="conTools">'+xmlData[con][4][e]+'</p>'
					+ '<p class="conTools">'+desTemp+'</p>'
					+ '<a href="'+xmlData[con][3][e]+'" class="btnGoSite" target="_blank"><img src="images/btnPortfolio'+(con+1)+'.gif" alt="" /></a>'
					+ '</li>');

				$(".portfolio_con").eq(con).find(".portfolioList").find(".btnExtMenu").eq(e).click(function(){showLayer(".portfolioExt:eq("+con+")","show",e);});

			});

			makePageList(con);

		},
		complete:function(){
		//console.log(xmlData)
		}
	});
}

// 포트폴리오 자세히 보기
function showLayer(con,sta,num){
	var nowIdx = con.substr(17,1);

	if ( sta === "show" ){
		$(con).stop(true,true).fadeIn(500);
		$(con).find(".conArea").find(".conAreaFullImg").attr("src",xmlData[nowIdx][2][num]);
		$(con).find(".totPage").html(xmlData[nowIdx][0].length);
		$(con).find(".nowPage").html(num+1);		
		$(con).find(".conTit").html("<a href='"+xmlData[nowIdx][3][num]+"' target='_blank'>"+xmlData[nowIdx][0][num]+"</a>");
		$(con).find(".conTools").html(xmlData[nowIdx][5][num]);

		removeEvent();

		if ( num === 0 ){			
			$(con).find(".btnLeft").bind("click",function(){showLayer(".portfolioExt:eq("+nowIdx+")","show",xmlData[nowIdx][0].length-1);});
			$(con).find(".btnRight").bind("click",function(){showLayer(".portfolioExt:eq("+nowIdx+")","show",num+1);});
		}else if ( num < xmlData[nowIdx][0].length-1 ){
			$(con).find(".btnLeft").bind("click",function(){showLayer(".portfolioExt:eq("+nowIdx+")","show",num-1);});
			$(con).find(".btnRight").bind("click",function(){showLayer(".portfolioExt:eq("+nowIdx+")","show",num+1);});
		}else{
			$(con).find(".btnLeft").bind("click",function(){showLayer(".portfolioExt:eq("+nowIdx+")","show",num-1);});
			$(con).find(".btnRight").bind("click",function(){showLayer(".portfolioExt:eq("+nowIdx+")","show",0);});
		}

	}

	function removeEvent(){
		$(con).find(".btnLeft").unbind("click");
		$(con).find(".btnRight").unbind("click");
	}	

	if ( sta === "hide" ) $(con).stop(true,true).fadeOut(300);

}

// 포트폴리오 하단 페이지 넘버를 뿌려주는 함수
function makePageList(con){

	var onePageView = parseInt($(".portfolio_con").eq(con).find(".portfolioWrap").width() / 250,10);
	var totPageNum = Math.ceil( xmlData[con][0].length / onePageView );

	$(".portfolio_con").eq(con).find(".pageCon").html("");

	for ( var i = 0 ; i < totPageNum ; i++ ){		
		$(".portfolio_con").eq(con).find(".pageCon").append("<a href='javascript:movPageList("+con+","+i+")'>"+(i+1)+"</a>");
		if( i !== totPageNum-1 ) $(".portfolio_con").eq(con).find(".pageCon").append(" | ");
	}
	
}
// 포트폴리오 하단 페이지 넘버로 페이지를 이동시켜주는 함수
function movPageList(con,num){

	$(".portfolio_con").eq(con).find(".portfolioList").stop(true,true).animate({"margin-left": - $(".portfolio_con").eq(con).find(".portfolioWrap").width() * num - (5*num)},"fast");

}

function pfScrollCtrl(){
	// 해당 영역에서는 브라우저 스크롤을 하지 않음
	var pfRollSta = false;

	$("ul.portfolioList").on("mousewheel.disableScroll DOMMouseScroll.disableScroll touchmove.disableScroll", function(e) {
		e.preventDefault();
		return;
	}).on("mousewheel",function(e){
		if( e.originalEvent.wheelDelta / 120 > 0 ){ // Scroll Up Event

			if ( parseInt($(this).css("marginLeft"),10) < 0 &&  !pfRollSta ){
				pfRollSta = true;
				$(this).animate({"marginLeft" : parseInt($(this).css("marginLeft"),10) + 255},300,function(){pfRollSta = false;});
			}

		}else{ // Scroll Down Event
			
			var onePageView = 4;
			if ( parseInt($(window).width(),10) < 1280 ) onePageView = 3;
			
			if ( !pfRollSta && parseInt($(this).css("marginLeft"),10) > -xmlData[$("ul.portfolioList").index(this)][0].length * 255 + ( 255 * onePageView )  ){
				pfRollSta = true;
				$(this).animate({"marginLeft" : parseInt($(this).css("marginLeft"),10) - 255},300,function(){pfRollSta = false;});
			}

		}
	});

	// 
	$(".board_con").on("mousewheel.disableScroll DOMMouseScroll.disableScroll touchmove.disableScroll", function(e) {
		e.preventDefault();
		return;
	});
}

var skillsPos = []; //new Array();
function skillPageCtrl(){

	$(".skills_con").find("li").each(
		function(e){
			skillsPos.push($(this).css("marginLeft"));
			$(this).hover(function(){
				$(".skills_con").find("li").not(":eq("+e+")").addClass("off");
				$(this).addClass("on");				
			},function(){
				$(this).removeClass("on");
				$(".skills_con").find("li").removeClass("off");
			})
		}
	);
}

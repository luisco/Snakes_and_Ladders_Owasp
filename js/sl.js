/*
* All Rights Reserved
* Author: Ashok Kumar Shah
* https://shahnashok.com
*/


if(window.location.hash)
{
	var hash = window.location.hash.substring(1);
	if(hash == "debug")
		document.getElementById('debug').style.display = "block";
}

var shah = new Object();
shah.log = function(msg) {
	if(shah.debug)
	{
		console.log(msg);
		document.getElementById('loganswer').textContent = msg;
	}
		
}

shah.table = function(msg) {
	if(shah.debug)
		console.table(msg);
}
	
var sl = TAFFY(config);
var packageMCQ = {};
shah.debug = true;
shah.prompt = [4,7,13,20,27,29,35,36,37,40,42,52,63,64,75,82,84,88,92,96];
shah.struct = [ {point: 4, snake: 0, ladder: 46},
				{point: 7, snake: 0, ladder: 26}, 
				{point: 13, snake: 0, ladder: 33}, 
				{point: 20, snake: 0, ladder: 39}, 
				{point: 27, snake: 6, ladder: 0}, 
				{point: 29, snake: 0, ladder: 70}, 
				{point: 35, snake: 0, ladder: 53}, 
				{point: 36, snake: 18, ladder: 0}, 
				{point: 37, snake: 0, ladder: 58},
				{point: 40, snake: 19, ladder: 0},				
				{point: 42, snake: 0, ladder: 62}, 
				{point: 52, snake: 0, ladder: 94},
				{point: 63, snake: 19, ladder: 0},
				{point: 64, snake: 0, ladder: 83},
				{point: 75, snake: 54, ladder: 0}, 
				{point: 82, snake: 41, ladder: 0}, 
				{point: 84, snake: 45, ladder: 0}, 
				{point: 88, snake: 67, ladder: 0}, 
				{point: 92, snake: 51, ladder: 0}, 
				{point: 96, snake: 3, ladder: 0}];

shah.questionAttempt = 0;
shah.currentpos;
shah.filtered = [];
shah.lastrolled = 0;
shah.filteredIndex = 0;
shah.setpos = function(curpos) {
	
	shah.currentpos = curpos;
	console.log(curpos);
	
	var cellProp = $('td').filter(function(i,e){ return this.textContent.trim() == curpos }).get(0);
	
	var paddingX = 20;
	var paddingY = 20;
	
	var pX = ((54 * parseInt(cellProp.cellIndex)) );
	var pY = ((53.5 * parseInt(cellProp.parentNode.rowIndex)));
	
	$('#player').animate({top: pY + 'px', left: pX + 'px'});
	
	//document.getElementsByClassName('dice')[0].className = "dice";
	if(curpos == "Stop")
	{
		shah.gameover();
	} else if(shah.lastrolled == 6)
	{
		setTimeout(function()
		{
			$('.overlay, .sixDigitMsg').show();
			setTimeout (function(){
				$('.overlay, .sixDigitMsg').hide();
				document.getElementById('rolldicebtn').onclick = rolldice;
				document.getElementById('reddice').onclick = rolldice;
			}, 1500);
		}, 1000);
		
	} else if(shah.prompt.indexOf(shah.currentpos) == -1)
	{
		document.getElementById('rolldicebtn').onclick = rolldice;
		document.getElementById('reddice').onclick = rolldice;
	} else {
		setTimeout(setQuestion(curpos), 1000);
	}
}

shah.gameover = function()
{
	//alert('game over');
	$('#replay').show();
	$('#msgComplete').show();
	setTimeout(function()
	{
		//playSound('well done');
		$('#msgComplete').addClass('open');
		setTimeout(function()
		{
			$('#msgComplete span img').each(function(i, e)
			{
				 $(this).show().addClass('textEffect' + (i+1));
			});
		}, 300);
	}, 10);
}

var slLevels = new Array();	
sl().each(function (r) {
	if(slLevels.indexOf(r.level) == -1)
		slLevels.push(r.level);
});

var nextscreen = function(oldscreen, newscreen) {
	document.getElementById(oldscreen).style.display = "none";
	document.getElementById(newscreen).style.display = "block";
}

var selectlevel = function(level) {
	nextscreen('screen3', 'screen4');
	packageMCQ.level = level;
	
	var slThemes = [];
	sl({level: level}).each(function (r) {
		if(slThemes.indexOf(r.theme) == -1)
			slThemes.push(r.theme);
	});

	shah.log(slThemes);
	var themeHTML = "";
	for(var i=0; i<slThemes.length; i++)
		themeHTML += '<li onclick="selecttheme(\'' + slThemes[i] + '\')">' + slThemes[i] + '</li>';
	document.getElementById('selectTheme').innerHTML = themeHTML;
}

var selecttheme = function(theme) {
	nextscreen("screen4", "screen5");
	packageMCQ.theme = theme;
	
	shah.filtered = new Array();
	sl({level: packageMCQ.level, theme: packageMCQ.theme}).each(function(r)
	{
		shah.filtered.push(r);
	});
	
	shah.table(shah.filtered);
	
	//shuffle(shah.filtered);
	shah.setpos("Start");
}

function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}


var rolldice = function()
{
	document.getElementById('rolldicebtn').onclick = "";	//remove click from the roll btn
	document.getElementById('reddice').onclick = "";	//remove click from the roll btn
	
	var randomNum;
	
	randomNum = Math.floor(Math.random() * 6) + 1;
	if(shah.questionAttempt < 10)
	{
		parentloop: for(var i=0; i<shah.prompt.length; i++)
		{
			for(var j=1; j<6; j++)
			{
				//console.log('current pos: ' + (shah.currentpos+j) + '; prompt: ' + shah.prompt[i]);
				if((shah.currentpos+j) == shah.prompt[i])
				{
					console.log('captured at ' + j);
					randomNum = j;
					break parentloop;
				}
			}
		}
	}
		
	if(window.toroll)
	{
		randomNum = parseInt(window.toroll);
	}
	shah.log('dice rolled: ' + randomNum);
	document.getElementsByClassName('dice')[0].className = "dice digit" + randomNum;
	setTimeout(function()
	{
		document.getElementsByClassName('dice')[0].className += "static";
		if(shah.currentpos == "Start") shah.currentpos = 1;
		if(shah.currentpos == "Stop") shah.currentpos = 100;
		shah.currentpos += randomNum;
		shah.lastrolled = randomNum;
		var tempholder;
		
		if(shah.currentpos == 0)		tempholder = "Start";
		else if(shah.currentpos >= 100)	tempholder = "Stop";
		else 							tempholder = shah.currentpos;

		
		shah.setpos(tempholder);	
		
	}, 1200);
}


var levelHTML = "";
for(var i=0; i<slLevels.length; i++)
	levelHTML += '<li onclick="selectlevel(\'' + (i+1) + '\')">Level ' + slLevels[i] + '</li>';
document.getElementById('selectLevel').innerHTML = levelHTML;


var setQuestion = function(curpos)
{
	pos_img = curpos;
	curpos = curpos - 1;
	//shah.questionAttempt++;
	
	//reshuffle filtered questions before the question repeats
	//if(shah.filteredIndex >= shah.filtered.length)
	//{
	//	shuffle(shah.filtered);
	//	shah.filteredIndex = 0;
	//	shah.table(shah.filtered);
	//}
	
	//insert information for q/a
	document.getElementById('questionImg').style.backgroundImage = "url('img/"+ pos_img +".png')";
	document.getElementById('questionTitleTxt').textContent = shah.filtered[curpos].question;

	
	for(var i=0; i<4; i++)
	{
		document.querySelectorAll('#userAnswer ul li')[i].textContent = shah.filtered[curpos].answers[i];
		if(i  == (parseInt(shah.filtered[curpos].correct) - 1))
		{
			document.querySelectorAll('#userAnswer ul li')[i].id = "correctans";
			shah.log('Ans: ' + shah.filtered[curpos].answers[i]);
		}
	}
	
	//show question viewer
	document.getElementById('questionViewer').style.bottom = "0px";
	//shah.filteredIndex++;
}

var submitAnswer = function()
{
	//need to update a popup here -- validation for not selecting an answer
	if(document.getElementsByClassName('active').length < 1)
	{
		$('.overlay, .errorMsg').show();
		setTimeout (function(){
			$('.overlay, .errorMsg').hide();
		}, 3500);
		//alert("Please select an answer.");
		return false;
	}

	var newpos;
	for(var i=0; i<shah.struct.length; i++)
	{
		if(shah.currentpos == shah.struct[i].point)
		{
			newpos = shah.struct[i];
			break;
		}
	}
	
	var attempt = (document.getElementsByClassName('active')[0].id == "correctans") ? true : false;
	
	//hide question viewer
	document.getElementById('questionViewer').style.bottom = "";
	
	setTimeout(function()
	{
		if (newpos.ladder != 0 && attempt == true){//is a lader
			shah.setpos(newpos.ladder);
			document.getElementById((attempt == true) ? "correctsound" : "incorrectsound").play();
			document.getElementsByClassName('active')[0].className = "";
		}else{
			document.getElementById('rolldicebtn').onclick = rolldice;
			document.getElementById('reddice').onclick = rolldice;
		}

		if (newpos.snake != 0 && attempt == false){//is a snake
			shah.setpos(newpos.snake);
			document.getElementById((attempt == true) ? "correctsound" : "incorrectsound").play();
			document.getElementsByClassName('active')[0].className = "";
		}else{
			document.getElementById('rolldicebtn').onclick = rolldice;
			document.getElementById('reddice').onclick = rolldice;
		}
		
	}, 1000);
	
	
}

var setactiveans = function(ele)
{
	if(document.querySelector('.active'))
		document.querySelector('.active').className = "";
	ele.className = "active";
}

function playagain() {
    location.href = document.URL;
}


var setfixroll = function(toroll)
{
	window.toroll = toroll;
}

var clearfixroll = function()
{
	window.toroll = "";
}

var preload = ["img/digit1.png",
    "img/digit2.png",
    "img/digit3.png",
    "img/digit4.png",
    "img/digit5.png",
    "img/digit6.png",
    "img/grass.png",
    "img/snake1.png",
    "img/snake2.png",
    "img/snakes/ludoSnake1.png",
    "img/snakes/ludoSnake2.png",
    "img/snakes/ludoSnake3.png",
    "img/snakes/ludoSnake4.png",
    "img/snakes/ludoSnake5.png",
    "img/snakes/ludoSnake6.png",
    "img/snakes/ludoSnake7.png",
    "img/snakes/ludoSnake8.png",
    "img/snakes/ludoSnake8.png",
    "img/snakes/ludoSnake9.png",
    "img/snakes/ludoSnake10.png",
    "img/snakes/ludoSnake11.png",
    "img/snakes/ludoSnake12.png",
    "img/snakes/ludoSnake13.png",
    "img/snakes/ludoSnake14.png",
    "img/snakes/ludoSnake15.png",
    "img/snakes/ludoSnake16.png"];

	
var promises = [];
for (var i = 0; i < preload.length; i++) {
    (function(url, promise) {
        var img = new Image();
        img.onload = function() {
          promise.resolve();
        };
        img.src = url;
    })(preload[i], promises[i] = $.Deferred());
}

$(document).ready(function() {

	$.when.apply($, promises).done(function() {
		$('body').addClass('done');
	});



});
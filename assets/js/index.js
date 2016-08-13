$(document).ready(function(){
	"use strict"

	var moves = {
		user : [],
		comp : [],
		moveCount : 1		
	},
	gameState = {
		speedIncreaseLevel : [5,9,13],
		compMove : true,
		strict : false,
		start : false,
		power : false,
		speed : 1200,
		animationSpeed : 500,
		finalRound : 20
	},
	$gameScreen = $("#screen div:first-child"),
	clickTimeout;
	
	$("input").on('click', function(e){
		gameState.power = !gameState.power;
		if(gameState.power){
			gameOnAnimation();
		}else{
			reset();
			$("#startLight, #strictLight").removeClass("lightOn");
			gameState.strict = false;
			gameState.start = false;
			$gameScreen.html("");
			$(".tile").fadeOut();
		}
	}); // /$("input").on()

	$("#startLight").on('click', function(e){				
		if(gameState.power){
			gameState.start = !gameState.start;
			$(this).toggleClass("lightOn");
			if(gameState.start){
				setTimeout(play,1000);
			}else{
				reset();
			}			
		}// /if(gameState.power)
	});// /$("#startLight").on()

	$("#strictLight").on('click', function(e){
		if(gameState.power && !gameState.start){
			$(this).toggleClass("lightOn");
			gameState.strict = !gameState.strict;
		}		
	}); // /$("#strictLight").on()	

	$(".tile").on('click',function(event){
		if(gameState.compMove)
			return;

		var tid = event.target.id;
		tileClick(tid);

		if(tid === moves.comp[moves.user.length]){
			moves.user.push(tid);			
			console.log("correct");			
		}
		else{
			errorNotification();
			if(!gameState.strict){				
				moves.user = [];
				
				setTimeout(playSequence, 2250);
				console.log("wrong");
			}else{
				//strict wrong option
				reset();
				setTimeout(play, 2250);
			}
		}

		if(moves.user.length === moves.moveCount){
			if(moves.moveCount === gameState.finalRound){
				winAnimation();
				reset();
				setTimeout(play, 3700);
			}
			else{			
				moves.user = [];				
				moves.moveCount++;
				console.log("Round : " + moves.moveCount);
				setTimeout(play,1000);
			}

		}
	});// /$(".tile").on()
	

	function tileClick(tid){
		var audioUrl = {
		greenTile : "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3",
		redTile : "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3",
		yellowTile : "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3",
		blueTile : "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"
		},
		tileId = tid,
		/*tileAudio = new Audio(audioUrl[tileId]);		*/
		tileAudio = document.createElement("audio");
		tileAudio.type = "audio/mpeg";
		tileAudio.src = audioUrl[tileId];
		tileAudio.play();
		$("#" + tileId).css("opacity",1);
		setTimeout(function(){
			$("#" + tileId).css("opacity",0.5);
			tileAudio.stop();
		},gameState.animationSpeed);
	}// /tileClick()

	function compMove(){		
		var tileIndex = ["greenTile", "redTile", "yellowTile", "blueTile"];	
		var nextMove = tileIndex[Math.floor((Math.random()*16)/4)];
		tileClick(nextMove);
		moves.comp.push(nextMove);
		gameState.compMove = false;
		console.log(moves);
	}// /compMove()

	function play(){
		gameState.compMove = true;
		$gameScreen.html(moves.moveCount);

			if((gameState.speedIncreaseLevel.indexOf(moves.moveCount) !== -1) && (gameState.speed > 300)){
			gameState.speed -= 300;	
			console.log("Game speed increased");		
			if(gameState.speed <= 300)
				gameState.animationSpeed = 250;
		}// /if for round check for speed increase

		var	i = playSequence();
		clickTimeout = setTimeout(compMove,i*gameState.speed);
	}// /play()

	function playSequence(){
		for(var i=0; i<moves.comp.length; i++){
				(function(i){
					setTimeout(function(){
						tileClick(moves.comp[i]);
					},gameState.speed*i); // /setTimeout()
				})(i); // /iife to ensure timeouts are set with correct i value
			}// /for
			return i;
	}// /playSequence()

	function errorNotification(){
		var wrongAudio = new Audio("assets/sounds/wrongbuzzer.mp3");
		wrongAudio.play();
		setTimeout(function(){$gameScreen.html("! !");},500);
		setTimeout(function(){$gameScreen.html(moves.moveCount);},1500);
	}// /errorNotification()

	function reset(){
		moves.user = [];
		moves.comp = [];
		moves.moveCount = 1;
		gameState.compMove = false;
		gameState.speed = 1200;
		gameState.animationSpeed = 500;
		clearTimeout(clickTimeout);
	} // /reset()

	function gameOnAnimation(){
		var $green = $("#greenTile"),
			$red = $("#redTile"),
			$yellow = $("#yellowTile"),
			$blue = $("#blueTile");

			$(".tile").fadeIn();
			$gameScreen.html("--");

			$("#gameBoard").css("background", "rgba(0,0,0,1)");
			
			setTimeout(function(){
				tileClick($green.attr("id"));
			}, 200);

			setTimeout(function(){
				tileClick($blue.attr("id"));
			}, 500);

			setTimeout(function(){
				tileClick($yellow.attr("id"));
			}, 700);

			setTimeout(function(){
				tileClick($red.attr("id"));
			}, 1000);
	}// /gameOnAnimation()

	function winAnimation(){
		console.log("we have a WINNER!!!");
		var winAudio = new Audio("assets/sounds/allidoiswin.mp3");
		winAudio.play();
		$("#winHeading h1").css("visibility","visible");
		setTimeout(function(){
			$("#winHeading h1").css("visibility","hidden");
		}, 3000);		
	}// /winAnimation()
});// /document.ready()

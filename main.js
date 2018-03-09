//var dropbox_token = 'Etur5ZuhSLAAAAAAAAAAPDY75Suj065SkcZXP31nGbv7m_yAAb6ZyY-euh7ER3vg';
//var dropbox_key = 't5f5wsjwxvz6vni';
// Used to upload data to Dropbox at the end. This no longer works because of changes to Dropbox

var normalpause = 500;
// Used to add a delay between trials

var audioSprite = $("#sound_player")[0];
// Used to play the MP3

var video = document.getElementById('video');
video.volume = 0.5;
// I guess this is used to play the video

var timeafterClick = 1000;
// Used to set the delay after a click, before screen changes.

var handler;
// Used by the audio player.

var trials = [];
// this will hold the trial data; below we set it to trialsA or trialsB depending on the value of version imputted in the beginning screen

var trials_ret = [];
// this will hold the trial data for the retention task


// we are not going to record most of these variables, so they should be dropped.
// the subject ID should be taken from TURK rather than generated on the screen.
// also, the list must be assigned rather than selected on the screen
// check the agent-passive experiment for how you did this.

// I need to change this once I have finalised the keys in the trials A and trials B JSON files
var results = ["subject_id",
	"trial_number",
	"trial_id",
	"target_sentence",
	"question",
	"target_side",
	"other_side",
	"trial_type",
	"verb_type",
	"target_name",
	"date_stamp",
	"time_stamp",
	"side_chosen",
	"accuracy",
	'rt',
	'play_counter',
	"date_of_birth",
	"native_lang",
	"other_langs",
	"gender",
	"initials",
	"version\n"].join(seperator = [","]);
	// This is used to create the header of the CSV file. Final item must have a linebreak \n on the end,
	// as it is an array joined into a string. Did it this way as it makes it easier to see what is in the
	// header.

var results_ret = ["subject_id",
	"trial_number",
	"trial_id",
	"retention_question",
	"target_side",
	"named_distractor_side",
	"trial_type",
	"verb_type",
	"target_name",
	"date_stamp",
	"time_stamp",
	"side_chosen",
	"accuracy",
	'rt',
	'play_counter',
	"answer1",
	"answer2",
	"answer3",
	"answer4",
	"date_of_birth",
	"native_lang",
	"other_langs",
	"gender",
	"initials",
	"version\n"].join(seperator = [","]);
	// This is used to create the header of the CSV file. Final item must have a linebreak \n on the end,
	// as it is an array joined into a string. Did it this way as it makes it easier to see what is in the
	// header.

var data = {

	rt: 0,
		//
	subject_id: "",
		//given at beginning of experiment
	trial_number: 0,
		// Number of trial in terms of presentation
	trial_id: 0,
		// ID of trial in the JSON file
	target_sentence: "",
		// this is the sentence fragment played
	question: "",
		//question played
	target_side: "",
		// L or R
	other_side: "",
		// L or R
	trial_type: "",
		// Training, critical, or filler
	verb_type: "",
		// pred or nonpred
	target_name: "",
		// name used for target object
	date_stamp: getCurrentDate(),
		//the date of the experiment
	time_stamp: getCurrentTime(),
		//the time that the trial was completed at 
	accuracy: 0,
		// 0 = choice did not match target
		// 1 = choice matched target
	side_chosen: "",
		// which side the participant selected
	play_counter: 0,
		//number of times the sentence was played
	native_lang: "",
	other_langs: "",
	date_of_birth: "",
	gender: "",
	initials: "",
	version: ""
	// list version selected
}

var data_ret = {

	rt: 0,
		//
	subject_id: "",
		//given at beginning of experiment
	trial_number: 0,
		// Number of trial in terms of presentation
	trial_id: 0,
		// ID of trial in the JSON file
	retention_question: "",
		//question played
	target_side: "",
		// L or R
	named_distractor_side: "",
		// L or R
	trial_type: "",
		// Training, critical, or filler
	verb_type: "",
		// pred or nonpred
	target_name: "",
		// name used for target object
	date_stamp: getCurrentDate(),
		//the date of the experiment
	time_stamp: getCurrentTime(),
		//the time that the trial was completed at 
	accuracy: 0,
		// 0 = choice did not match target
		// 1 = choice matched target
	side_chosen: "",
		// which side the participant selected
	play_counter: 0,
		//number of times the sentence was played
	answer1: "",
	answer2: "",
	answer3: "",
	answer4: "",
	native_lang: "",
	other_langs: "",
	date_of_birth: "",
	gender: "",
	initials: "",
	version: ""
	// list version selected
}

// This will hold the data for the trial. This is updated for each trial and then appended to the results variable
// at the end of that trial.

// int randomWithRange(int min, int max)
// {
//    int range = (max - min) + 1;     
//    return (int)(Math.random() * range) + min;
// }

function randomString() {
	length = 25;
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}
// Function to create a random string. Used to make unique IDs for participants.

function fill_field() { 
    var txt=document.getElementById("subject_id").value; 
    document.getElementById("subject_id").value = randomString();; 
    }

// Function called when clicking on "Generate" button on data input screen at start. Auto-fills the subject ID field with random ID.


function randomList() {
        var j = Math.floor(Math.random() * 2) + 1;
    return j;
}
// function to select list version randomly (1 or 2)

function fill_field_list() { 
    var txt=document.getElementById("version").value; 
    document.getElementById("version").value = randomList();; 
    }
 // Function called when clicking on "Assign Version" button on data input screen at start.   

function preload_images(trials) {

	image_uris = new Array();

	for (var i of trials) {
		image_uris.push(i['speaker_pic']);
		image_uris.push(i['target_pic']);
		image_uris.push(i['other_pic'])
	}

	image_uris = $.uniqueSort(image_uris);

	preload_images = new Array();

	for (uri in image_uris) {
		preload_images.push(new Image());
	}

	for (i = 0; i<image_uris.length; i++) {
		preload_images[i].src = image_uris[i];
	}
}

function preload_images_ret(trials) {

	image_uris_ret = new Array();

	for (var i of trials) {
		image_uris_ret.push(i['speaker_pic']);
		image_uris_ret.push(i['target_pic']);
		image_uris_ret.push(i['named_distractor_pic']);
		image_uris_ret.push(i['unnamed_distractor_pic'])
	}

	image_uris_ret = $.uniqueSort(image_uris_ret);

	preload_images_ret = new Array();

	for (uri in image_uris_ret) {
		preload_images_ret.push(new Image());
	}

	for (i = 0; i<image_uris_ret.length; i++) {
		preload_images_ret[i].src = image_uris_ret[i];
	}
}

function getCurrentDate() {
	var currentDate = new Date();
	var day = currentDate.getDate();
	var month = currentDate.getMonth() + 1;
	var year = currentDate.getFullYear();
	return (month + "/" + day + "/" + year);
}

function getCurrentTime() {
	var currentTime = new Date();
	var hours = currentTime.getHours();
	var minutes = currentTime.getMinutes();

	if (minutes < 10) minutes = "0" + minutes;
	return (hours + ":" + minutes);
}

function showSlide(id) {
  $(".slide").hide(); //jquery - all elements with class of slide - hide
  $("#"+id).show(); //jquery - element with given id - show
}
// Used to show a particular HTML slide. First it hides ALL slides (i.e. all HTML elements with the slide
// class) and then it shows the particular slide which has the given ID.

function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
// Used to shuffle trial order, in place. So no idea why it returns the array...

function playPrompt(start, length) {
	audioSprite.removeEventListener('timeupdate', handler);
	audioSprite.currentTime = start;
	//console.log('audio currentTime:', audioSprite.currentTime);
	audioSprite.play();

	handler = function() {
		//console.log('this.currentTime:', this.currentTime);
		//console.log('start+length+0.2:', start+length+0.2);
	    if (this.currentTime >= start + length + 0.2) {
	        this.pause();
	    }
	};
	audioSprite.addEventListener('timeupdate', handler, false);
}
// This plays the sound for a word. Args are start point of the sound in the MP3 and how long the sound is.
// Adds 0.2 padding for iPad being weird.

function processOneRow() {
	var dataforRound = data.subject_id + ","
	+ data.trial_number + ","
	+ data.trial_id + ","
	+ data.target_sentence + ","
	+ data.question + ","
	+ data.target_side + ","
	+ data.other_side + ","
	+ data.trial_type + ","
	+ data.verb_type + ","
	+ data.target_name + ","
	+ data.date_stamp + ","
	+ data.time_stamp + ","
	+ data.side_chosen + ","
	+ data.accuracy + ","
	+ data.rt + ","
	+ data.play_counter + ","
	+ data.date_of_birth + ","
 	+ data.native_lang + ","
 	+ data.other_langs + ","
 	+ data.gender + ","
 	+ data.initials + ","
 	+ data.version + "\n";

	results += dataforRound;
}

function processOneRow_ret() {
	var dataforRound_ret = data_ret.subject_id + ","
	+ data_ret.trial_number + ","
	+ data_ret.trial_id + ","
	+ data_ret.retention_question + ","
	+ data_ret.target_side + ","
	+ data_ret.named_distractor_side + ","
	+ data_ret.trial_type + ","
	+ data_ret.verb_type + ","
	+ data_ret.target_name + ","
	+ data_ret.date_stamp + ","
	+ data_ret.time_stamp + ","
	+ data_ret.side_chosen + ","
	+ data_ret.accuracy + ","
	+ data_ret.rt + ","
	+ data_ret.play_counter + ","
	+ data_ret.answer1 + ","
	+ data_ret.answer2 + ","
	+ data_ret.answer3 + ","
	+ data_ret.answer4 + ","
	+ data.date_of_birth + ","
 	+ data.native_lang + ","
 	+ data.other_langs + ","
 	+ data.gender + ","
 	+ data.initials + ","
 	+ data_ret.version + "\n";

	results_ret += dataforRound_ret;
}


// This adds a row to the results var, which is eventually pushed to Dropbox as a CSV.
// Done over several lines just to make it a little easier to read and edit.
// Order needs to match the order of the "results" var above, otherwise the columns won't
// match the header in the CSV.


function showNewSubj(){
	showSlide("new_subject");
}

function terminate(){
	window.location="https://universityofedinburgh-ppls.sona-systems.com/Default.aspx?ReturnUrl=%252f";
}


// function createDot(dotx, doty, i) {

// 	var dot = document.createElement("img");

// 	dot.setAttribute("class", "dot");

// 	dot.id = "dot_" + i;

// 	dot.src = "images/dots/dot_" + i + ".png";
	

// 	var x = Math.floor(Math.random()*750);
// 	var y = Math.floor(Math.random()*540);

// 	var invalid = "true";

// 	//make sure dots do not overlap
// 	while (true) {
// 		invalid = "true";
// 		for (j = 0; j < dotx.length ; j++) {
// 			if (Math.abs(dotx[j] - x) + Math.abs(doty[j] - y) < 250) {
// 				var invalid = "false";
// 				break; 
// 			}
// 		}
// 		if (invalid === "true") {
// 			dotx.push(x);
// 			doty.push(y);
// 			break;	
// 		}
// 		x = Math.floor(Math.random()*400);
// 		y = Math.floor(Math.random()*400);
// 	}

// 	dot.setAttribute("style","position:absolute;left:"+x+"px;top:"+y+"px;");
// 	training.appendChild(dot);
// }
// // This adds a dot to the screen. Called during training.

// function do_training(dotgame) {
// 	var allDots = ["dot_1", "dot_2", "dot_3", "dot_4", "dot_5", 
// 					"dot_6", "dot_7", "dot_8", 
// 					"dot_9", "dot_10"];
	
// 	xcounter = 0;
// 	var dotCount = 5;

// 	//preload sound
// 	if (dotgame === 0) {
// 		audioSprite.play();
// 		audioSprite.pause();
// 		audioSprite.currentTime = 0;
// 	}
// 	// I don't think I need to do that because I used HTML5 to do it...

// 	var dotx = [];
// 	var doty = [];

// 	if (dotgame === 0) {
// 		for (i = 0; i < 5; i++) {
// 			createDot(dotx, doty, i+1);
// 		}
// 	} else {
// 		for (i = 5; i < 10; i++) {
// 			createDot(dotx, doty, i+1);
// 		}
// 	}
// 	showSlide("training");

// 	$('.dot').bind('click touchstart', function(event) {
// 		var dotID = $(event.currentTarget).attr('id');

// 		//only count towards completion clicks on dots that have not yet been clicked
// 		if (allDots.indexOf(dotID) === -1) {
// 			return;
// 		}
// 		allDots.splice(allDots.indexOf(dotID), 1);
// 		document.getElementById(dotID).src = "images/dots/x.png";
		
// 		xcounter++
		
// 		if (xcounter === dotCount) {
// 			setTimeout(function () {
// 				$("#training").hide();
// 				if (dotgame === 0) {		
// 					//hide old x marks before game begins again
// 					var dotID;
// 					for (i = 1; i <= dotCount; i++) {
// 						dotID = "dot_" + i;
// 						training.removeChild(document.getElementById(dotID));
// 					}
// 					do_training();
// 				} else {
// 					var dotID;
// 					for (i = 6; i <= 10; i++) {
// 						dotID = "dot_" + i;
// 						training.removeChild(document.getElementById(dotID));
// 					}
// 					//document.body.style.background = "black";
// 					setTimeout(function() {
// 						showSlide("confirm");
// 						//data.next();
// 					}, normalpause*2);
// 				}
// 			}, normalpause*2);
// 		}
// 	});	   
// }
// Does several things:
// Update data variable with subject data from welcome screen.
// Display the dots and plays the dot game.
// When done, shows the "confirm" slide that has a "Begin!" button
// to start running the trials.

// function createDot_inter(dotx, doty, i) {

// 	var dot = document.createElement("img");

// 	dot.setAttribute("class", "dot");

// 	dot.id = "dot_" + i;

// 	dot.src = "images/dots_inter/dot_" + i + ".png";
	

// 	var x = Math.floor(Math.random()*750);
// 	var y = Math.floor(Math.random()*540);

// 	var invalid = "true";

// 	//make sure dots do not overlap
// 	while (true) {
// 		invalid = "true";
// 		for (j = 0; j < dotx.length ; j++) {
// 			if (Math.abs(dotx[j] - x) + Math.abs(doty[j] - y) < 250) {
// 				var invalid = "false";
// 				break; 
// 			}
// 		}
// 		if (invalid === "true") {
// 			dotx.push(x);
// 			doty.push(y);
// 			break;	
// 		}
// 		x = Math.floor(Math.random()*400);
// 		y = Math.floor(Math.random()*400);
// 	}

// 	dot.setAttribute("style","position:absolute;left:"+x+"px;top:"+y+"px;");
// 	interlude.appendChild(dot);
// }
// // This adds a dot to the screen. Called during interlude.


function do_training() {
	showSlide("training");
      }
    
function complete_training(){
	showSlide("confirm");
}




function checkform()
    {
        var f = document.forms["theform"].elements;
        var cansubmit = true;

        for (var i = 0; i < f.length; i++) {
            if (f[i].value.length == 0) cansubmit = false;
        }

        document.getElementById('question_button').disabled = !cansubmit;
    }


// function close_fullscreen() {
// 	$('#video')[0].webkitExitFullscreen();
// }
// to close the video when it is done playing

//change the following to run the interlude game

function show_interlude_instructions(){
	showSlide("interlude_instructions");
}

function updateCountdown(){
	var timeLeft = Math.round(video.duration) - Math.round(video.currentTime);
	var timeSpan = document.querySelector("#countdown span");
	timeSpan.innerText = timeLeft;
}

function do_interlude() {

showSlide("interlude"); 

$('#video_container').on('click touchstart', function(event){
		//video.webkitEnterFullscreen();
		start_time = (new Date()).getTime();
		video.play();
		video.addEventListener('timeupdate',updateCountdown);
	
        //console.log(video.duration);
        //console.log(video.currentTime);
        //while (parseFloat(video.currentTime) < 500){//(current_trial['question_length'])){
        
        //}
  //   	video.addEventListener("timeupdate", function() {
  //    	 	$('#video').on('click touchstart', function(event){	
		// 		video.pause();
		// 		video.currentTime = 0;
		// 		//Avoid the Promise Error
		// 		setTimeout(function () {      
		// 		start_time = (new Date()).getTime();
		// 		video.play();
		// 		}, 150);

		// 	})
  // 		  }, false);
		// console.log(video.currentTime > 0);
		// This paused the video for a while and then restarted it on click. Disable this. We want them to watch it only once.
		setTimeout(function(){
			//close_fullscreen();

           document.getElementById('questions_container').style.display = 'block'
           // see if there is a way of hding question until this is called
           // when all questions have been answered, allow submit button
           // on clicking this button, the function start?_ret() is called (define it) that trigger presentation of the "let's play again screen"

		}, video.duration*1000);
	})
}

// at the moment, pressing the submit button causes the thing to restart. I think this is because I defined the button as a type submit in the html, will have to change that

	// var allDots = ["dot_1", "dot_2", "dot_3", "dot_4", "dot_5", 
	// 				"dot_6", "dot_7", "dot_8", 
	// 				"dot_9", "dot_10", "dot_11","dot_12","dot_13","dot_14","dot_15"];
	
	// xcounter = 0;
	// var dotCount = 5;
 //    console.log("This is"+dotgame);
 //    console.log("this is"+xcounter);
 //    console.log("this is"+dotCount);
	// //preload sound
	// // if (dotgame === 0) {
	// // 	audioSprite.play();
	// // 	audioSprite.pause();
	// // 	audioSprite.currentTime = 0;
	// // }
	// // I don't think I need to do that because I used HTML5 to do it...

	// var dotx = [];
	// var doty = [];

	// if (dotgame === 0) {
	// 	for (i = 0; i < 5; i++) {
	// 		createDot_inter(dotx, doty, i+1);
	// 	}
	// } else {
	// 	if (dotgame === 1){
	// 		for (i = 5; i < 10; i++) {
	// 			createDot_inter(dotx, doty, i+1);
	// 		}
	// 	} else {
	// 		for (i = 10; i < 15; i++) {
	// 			createDot_inter(dotx, doty, i+1);
	// 		}
	// 	}
	// }
	// showSlide("interlude"); // change to interlude

	// $('.dot').bind('click touchstart', function(event) {
	// 	var dotID = $(event.currentTarget).attr('id');
 //        console.log(dotID);
	// 	//only count towards completion clicks on dots that have not yet been clicked
	// 	if (allDots.indexOf(dotID) === -1) {
	// 		return;
	// 	}
	// 	allDots.splice(allDots.indexOf(dotID), 1);
	// 	console.log(allDots);
	// 	console.log(document.getElementById(dotID).src);
	// 	document.getElementById(dotID).src = "images/dots_inter/x.png";
		
	// 	xcounter++
		
	// 	if (xcounter === dotCount) {
	// 		setTimeout(function () {
	// 			$("#interlude").hide();
	// 			if (dotgame === 0) {		
	// 				//hide old x marks before game begins again 
	// 				var dotID;
	// 				for (i = 1; i <= dotCount; i++) {
	// 					dotID = "dot_" + i;
	// 					interlude.removeChild(document.getElementById(dotID));
	// 				}
	// 				do_interlude(1);
	// 			} else {
	// 				if (dotgame === 1){
	// 					//hide old x marks before game begins again
	// 					var dotID;
	// 					for (i = 6; i <= 10; i++) {
	// 						dotID = "dot_" + i;
	// 						interlude.removeChild(document.getElementById(dotID));
	// 				}
	// 				do_interlude(2);

	// 				} else {
	// 					//document.body.style.background = "black";
	// 				setTimeout(function() {
	// 					showSlide("confirm_ret"); // change to confirm_ret
	// 					//data.next();
	// 				}, normalpause*2);

	// 				}
	// 			}
	// 		}, normalpause*2);
	// 	}
	// });	   
//}
// the function do_interlude is called when "have a break is clicked"
// within it we need to show the slide interlude and play the video contained in it. Then when the video is over, it should close full screen and show comprehension questions underneath it.
// there should be a submit button that adds the answer to the data being saved (like the participant info at the start) and then displays the "Let's play again button".


function start_ret() {

	var answer1 = document.getElementById("input1").value;
	data_ret.answer1 = answer1;
	var answer2 = document.getElementById("input2").value;
	data_ret.answer2 = answer2;
	var answer3 = document.getElementById("input3").value;
	data_ret.answer3 = answer3;
	var answer4 = document.getElementById("input4").value;
	data_ret.answer4 = answer4;
	//console.log(answer1);
	//console.log(answer2);

	// it does record these answers but it does not show the 

	setTimeout(function () {
	$("#interlude").fadeOut();
	}, normalpause);

	showSlide("instructions_ret");
	document.body.style.background = "white";

	// there must be an issue with this function because after logging, it shows a white screen but no confirm button

	//$('#finished').append($('<p style="font-size:35px">' + data.subject_id + '</p>'));

	//showSlide("interlude"); // this will have to change to showing the interlide slide
	// change the following to create the interlude dots

	// showSlide("confirm_ret");
	// document.body.style.background = "white";
	// upload_to_dropbox();
}

function showButton_ret(){
	showSlide("confirm_ret");
}

function confirm() {

	//data.birth_order = document.getElementById("birth_order").value;
	//data.num_siblings = document.getElementById("num_siblings").value;

	//data.ethnicity = document.getElementById("ethnicity").value.replace(/,/g, " ");
	data.native_lang = document.getElementById("native_lang").value.replace(/,/g, " ");
	data_ret.native_lang = document.getElementById("native_lang").value.replace(/,/g, " ");
	data.other_langs = document.getElementById("other_langs").value.replace(/,/g, " ");
	data_ret.other_langs = document.getElementById("other_langs").value.replace(/,/g, " ");
	//data.parental_occ = document.getElementById("parental_occ").value.replace(/,/g, " ");
	//data.dev_info = document.getElementById("dev_info").value.replace(/,/g, " ");

	data.subject_id = document.getElementById("subject_id").value;
	data.initials = document.getElementById("initials").value;
	data_ret.subject_id = document.getElementById("subject_id").value;
	data_ret.initials = document.getElementById("initials").value;

	data.date_of_birth = document.getElementById("date_of_birth").value;
	data_ret.date_of_birth = document.getElementById("date_of_birth").value;

	if (document.getElementById("gender").checked === true) {
		data.gender = 'male';
		data_ret.gender = 'male';
	}
	if (document.getElementById("gender").checked === false) {
		data.gender = 'female';
		data_ret.gender = 'female';
	}
	if (document.getElementById("version").value === "1") {
		data.version = 'ListA';
		data_ret.version = "ListA";
	}
	if (document.getElementById("version").value === "2") {
		data.version = 'ListB';
		data_ret.version = 'ListB';
	}
	if (data.version === 'ListA'){
	trials = trialsA;
	}
	if (data.version === 'ListB'){
	trials = trialsB;
	}
    preload_images(trials);
// Preloads all the images
	document.body.style.background = "white";
	$("#confirm").hide();
	setTimeout(function () {
		run_all_trials();
	}, normalpause);
}
// Called when clicking on "Begin!" after the dot game

// function end() {
// 	setTimeout(function () {
// 		$("#stage").fadeOut();
// 	}, normalpause);

// 	$('#finished').append($('<p style="font-size:35px">' + data.subject_id + '</p>'));

// 	showSlide("finished");
// 	document.body.style.background = "black";
// 	// upload_to_dropbox();
// }
// Called when all trials are done. Shows subject ID again


function end() {

	setTimeout(function () {
		$("#stage").fadeOut();
	}, normalpause);

	//$('#finished').append($('<p style="font-size:35px">' + data.subject_id + '</p>'));

	//showSlide("interlude"); // this will have to change to showing the interlide slide
	// change the following to create the interlude dots

	showSlide("interlude_button");
	document.body.style.background = "white";
	// upload_to_dropbox();
}

function end_ret() {
	setTimeout(function () {
		$("#stage_ret").fadeOut();
	}, normalpause);

	//$('#finished').append($('<p style="font-size:35px">' + data_ret.subject_id + '</p>'));

	showSlide("finished");
	document.body.style.background = "black";
	// upload_to_dropbox();
}


function saveData(){
   $.ajax({
      type:'post',
      cache: false,
      url: 'http://blake2.ppls.ed.ac.uk/~s1555917/chiara/savedata.php', // this is the path to the above PHP script
      data: {filename: data.subject_id + '_data.csv', filedata: results},
      success: function(){
            console.log("data saved");
          },
      error: function(xhr,response){
            console.log("Error code is "+xhr.status+" and the error is "+response);
          }
   });
}

function saveData_ret(){
   $.ajax({
      type:'post',
      cache: false,
      url: 'http://blake2.ppls.ed.ac.uk/~s1555917/chiara/savedata.php', // this is the path to the above PHP script
      data: {filename: data_ret.subject_id + '_dataret.csv', filedata: results_ret}
   });
}
// this new function should upload to heroku using PHP

// function upload_to_dropbox() {
// 	var client = new Dropbox.Client({ key: dropbox_key, token: dropbox_token});

// 	client.authenticate();

// 	client.writeFile(data.subject_id + '_data.csv', results, function(error) {
// 		if (error) {
// 			console.log('dropbox error:', error);
// 		} else {
// 			console.log('File written to dropbox')
// 		}
// 	});
// }

// function upload_to_dropbox_ret() {
// 	var client = new Dropbox.Client({ key: dropbox_key, token: dropbox_token});

// 	client.authenticate();

// 	client.writeFile(data_ret.subject_id + '_dataret.csv', results_ret, function(error) {
// 		if (error) {
// 			console.log('dropbox error:', error);
// 		} else {
// 			console.log('File written to dropbox')
// 		}
// 	});
// }
// Uploads CSV to Dropbox -- no longer used

// Is it sufficient to have a version of this in which playPrompt is called twice?
// Or do I need to have a different version of playPrompt that "jumps" to a different part of the sound?

function play_one_item(img_id, sound_start, sound_length) {
		playPrompt(sound_start, sound_length);
		//$(img_id).effect("shake", {'direction':'left', 'distance':20, 'times':5}, 2000);		
}

function set_up_pseudo_counterbalance() {
	var num_training = training_trials.length;
	var num_trials = trials.length;

	novel_names = [
  {
    "name": "cheem",
    "name_start": 162.28111055743315,
    "name_length": 0.953552861,
    "name_start_det": 205.84558173178317,
    "name_length_det": 0.920289386
  },
  {
	"name": "dite",
    "name_start": 165.8292142247397,
    "name_length": 1.020079804,
     "name_start_det": 207.93009263069814,
    "name_length_det": 0.942465034
  },
  {
    "name": "doop",
    "name_start": 169.79287076539745,
    "name_length": 0.953552858,
     "name_start_det": 209.99242788175235,
    "name_length_det": 1.142045865
  },
  {
    "name": "fode",
    "name_start": 173.03051535307392,
    "name_length": 1.064431097,
     "name_start_det": 212.43972087471232,
    "name_length_det": 1.031167626
  },
  {
    "name": "foo",
    "name_start": 175.40330967417927,
    "name_length": 0.997904154,
     "name_start_det": 214.86795431546966,
    "name_length_det": 0.853762443
  },
  {
    "name": "pabe",
    "name_start": 178.64095426185577,
    "name_length": 0.93137721,
     "name_start_det": 216.98019413030343,
    "name_length_det": 0.964640682
  },
  {
    "name": "roke",
    "name_start": 181.67901801878506,
    "name_length": 1.153133689,
     "name_start_det": 219.53437961604308,
    "name_length_det": 0.975728506
  },
  {
    "name": "yok",
    "name_start": 184.94291965868007,
    "name_length": 1.064431097,
     "name_start_det": 222.24678385849273,
    "name_length_det": 0.93137721
  },

];
	
	//order_to_play = new Array();

	// They will be global vars.

	// Hope that number of real trials is even...
	sides_to_use = new Array();

	for (var i = 0; i<num_trials/2; i++) {
		sides_to_use.push("left");
		sides_to_use.push("right");
		//order_to_play.push(0);
		//order_to_play.push(1);
	}
	// Adds 50% R, 50% L.

	shuffle(sides_to_use);
	shuffle(novel_names);
	//shuffle(order_to_play);

	for (var i=0; i<num_training/2; i++) {
		sides_to_use.splice(0,0,"left");
		sides_to_use.splice(0,0,"right");
		//order_to_play.splice(0,0, 0);
		//order_to_play.splice(0,0, 1);
	}
	// Insert L/R for training at the beginning.
}

function set_up_trial_list() {

	for (var i = 0; i<8; i++){
  		trials[i].target_name = novel_names[i].name;
  		trials[i].target_name_start = novel_names[i].name_start;
  		trials[i].target_name_length = novel_names[i].name_length;
  		trials[i].target_name_start_det = novel_names[i].name_start_det;
  		trials[i].target_name_length_det = novel_names[i].name_length_det;
  	}

	// before shuffling I need to add the novel name info only to the first 8 trials
	// Fillers always use the saem audio


	shuffle(trials);
	// Shuffles the array of critical trials
	
	for (var item of training_trials) {
		trials.splice(0,0,item);
	}
	// Add the training trials to main list of trials 
	// Makes sure that the training trials always happen first. They won't be shuffled in with the
	// others but they will be in backwards order to what they are in the .json file,
	// though that should not matter.

	// We later iterate through the trials array and apply a function to using forEach()
	// This function will deal with the trial.
	console.log(trials);

	function isExp(x){
 	return x.trial_type == "critical"
 	};

 	trials_ret = trials.filter(isExp);
 	console.log(trials_ret);

}

function run_all_trials() {

	set_up_pseudo_counterbalance();
	set_up_trial_list();

	counter = 1;
	play_counter = 0;
	number_of_trials = trials.length;

	current_trial = trials[0];

	var sound_played = false;

	$("#speaker_img").attr("src", current_trial["speaker_pic"]);
	// this is the picture of Peppa or George

	target_side = sides_to_use[0];
	// Determine which side the target will be on for this trial
		
		if (target_side === 'left') {
			$("#left").attr("src", current_trial["target_pic"]);
			$("#right").attr("src", current_trial["other_pic"]);
		} 

		if (target_side === 'right') {
			$("#left").attr("src", current_trial["other_pic"]);
			$("#right").attr("src", current_trial["target_pic"]);
		} 
	// $("#sound_player").attr("src", current_trial["sound_file_name"]);

	// var sound_file = $("#sound_player")[0];
	//$("#left").attr("src", current_trial["a_speaker_pic"]);
	//$("#right").attr("src", current_trial["b_speaker_pic"]);
	
	// First trial will be a training one so can have fixed position for stims. Randomised later.	(???)
	// I don't think the position of the images is randomized, just the order in which they vibrate
	// instead I will have to randomize the position (if statement?)

	var pause_between = 1000;
	var pause_between_noun = 750;
	var pause_between_noun_short = 250;
	// pause between each sound being played

   // this needs to be equal to duration of sentence + duration of target word (+ duration of question)
	var total_sound_length = (current_trial['sentence_length'] + current_trial['target_name_length']+current_trial['question_length']+current_trial['target_name_length_det'])*1000; 
	// length of the entire sounds clips being played, used to determine when to turn back on clicking
	total_sound_length += pause_between * 1 + pause_between_noun + pause_between_noun_short;
	// Increase it by the pauses otherwise clicking is turned back on too early. There is a pause between end of sentence and beginning of question but not between sentence fragment and target word

	var clickDisabled = false;

	//presentation_order = order_to_play[0];
	// Used for the first training trial then changed at random again
	// for each new trial
	// 0 = L to R
	// 1 = R to L

	$("#stage").fadeIn();

	start_time = -1;

	// Click speaker to start...
	$('#speaker_img').on('click touchstart', function(event) {
		if (clickDisabled) return ;

		clickDisabled = true;

		sound_played = true;

		play_counter++;

		setTimeout(function()
			{clickDisabled = false},
			total_sound_length);

		//play_one_item('#clear_speaker_img', current_trial['clear_sound_start'], current_trial['clear_sound_length']);
		
		// this will play the sentence fragment (probbaly best to use a fragment + target structure for fillers too)
		play_one_item('#speaker_img', current_trial['sentence_start'], current_trial['sentence_length']);

		// this will play the target name
			setTimeout(function()
				{play_one_item('#speaker_img', current_trial['target_name_start'], current_trial['target_name_length']);},
				current_trial['sentence_length']*1000 + pause_between_noun // this is used to make sure that the target sound is played only after the fragment is over plus 750 silence
				);
		// this will be used to play the question	
			setTimeout(function()
				{play_one_item('#speaker_img', current_trial['question_start'], current_trial['question_length']);},
				current_trial['sentence_length']*1000 + pause_between_noun + current_trial['target_name_length']*1000 + pause_between // this is used to make sure question plays only 1000 after end of target name
				);
		// this will be used to play the word preceded by the at the ends of the question
			setTimeout(function()
				{play_one_item('#speaker_img', current_trial['target_name_start_det'], current_trial['target_name_length_det']);},
				current_trial['sentence_length']*1000 + pause_between_noun + current_trial['target_name_length']*1000 + pause_between + current_trial['question_length']*1000 + pause_between_noun_short // this is used to make sure question plays only 1000 after end of target name
				);

//// THIS IS NOT RELEVANT
		// if (presentation_order === 1 & target_side === 'left') {
		// 	setTimeout(function()
		// 		{play_one_item('#right', current_trial['foil_sound_start'], current_trial['foil_sound_length']);},
		// 		current_trial['clear_sound_length']*1000 + pause_between
		// 		);
		// 	setTimeout(function()
		// 		{play_one_item('#left', current_trial['target_sound_start'], current_trial['target_sound_length']);},
		// 		current_trial['clear_sound_length']*1000 + pause_between + current_trial['foil_sound_length']*1000 + pause_between
		// 		);
		// }

		// if (presentation_order === 0 & target_side === 'right') {
		// 	setTimeout(function()
		// 		{play_one_item('#left', current_trial['foil_sound_start'], current_trial['foil_sound_length']);},
		// 		current_trial['clear_sound_length']*1000 + pause_between
		// 		);
		// 	setTimeout(function()
		// 		{play_one_item('#right', current_trial['target_sound_start'], current_trial['target_sound_length']);},
		// 		current_trial['clear_sound_length']*1000 + pause_between + current_trial['foil_sound_length']*1000 + pause_between
		// 		);
		// } 

		// if (presentation_order === 1 & target_side === 'right') {
		// 	setTimeout(function()
		// 		{play_one_item('#right', current_trial['target_sound_start'], current_trial['target_sound_length']);},
		// 		current_trial['clear_sound_length']*1000 + pause_between
		// 		);
		// 	setTimeout(function()
		// 		{play_one_item('#left', current_trial['foil_sound_start'], current_trial['foil_sound_length']);},
		// 		current_trial['clear_sound_length']*1000 + pause_between + current_trial['target_sound_length']*1000 + pause_between
		// 		);
		// }
// END OF NON-RELEVANT STUFF

	start_time = (new Date()).getTime();
	// console.log("start time is:", start_time);

	});



	//If a student/robot is clicked, then record data and move on.
	$('.choice').on('click touchstart', function(event){
		if (sound_played === false) {
			console.log('sound not played yet');
			return;
		}
		if (clickDisabled === false) {
			clickDisabled = true;
			sound_played = false;
			
			var response = $(this).attr('id');

			$(this).effect('bounce', {'times':6, 'distance':200}, 1000);
			
			if (response === target_side) {
				data.accuracy = 1;
			} else {
				data.accuracy = 0;
			}

			data.rt = (new Date()).getTime() - start_time - total_sound_length;

			if (start_time === -1) {
				data.rt = -1;
			}

			// console.log('rt:', data.rt)
			data.trial_number = counter;
			data.trial_id = current_trial['trial_id'];
			data.target_side = target_side;
			data.trial_type = current_trial['trial_type'];
			data.verb_type = current_trial['verb_type'];
			data.target_name = current_trial['target_name'];
			data.play_counter = play_counter;
			data.target_sentence = current_trial['target_sentence'];
			data.question = current_trial['question'];
			
			if (target_side === 'left') {
				data.other_side = 'right'
			} else {
				data.other_side = 'left'
			}
			//data.novel_name = novel_name;
			//data.presentation_order = presentation_order;
			data.side_chosen = response;

			processOneRow();
			saveData();

			data.rt = -1;
			start_time = -1;

			//put all the data saving stuff here...


			trials.splice(0, 1);
			//order_to_play.splice(0, 1);
			sides_to_use.splice(0, 1);
			counter++;
			play_counter = 0;
			//pop off the trial we just did and update trial counter.
			//same for the order/side

			// not sure what the rest is for but will have to change it!

			setTimeout(function() {
				$("#stage").fadeOut();

				if (counter === number_of_trials + 1) {
					end();
					return;
				}
				
				setTimeout(function(){
						current_trial = trials[0];
						// Get new trial
						//presentation_order = order_to_play[0];
						target_side = sides_to_use[0];
						// console.log('play order', presentation_order);
						// console.log('target side', target_side);
						// Update randomisation vars

						$("#speaker_img").attr("src", current_trial["speaker_pic"]);
						if (target_side === 'left') {
							$("#left").attr("src", current_trial["target_pic"]);
							$("#right").attr("src", current_trial["other_pic"]);
						} 

						if (target_side === 'right') {
							$("#left").attr("src", current_trial["other_pic"]);
							$("#right").attr("src", current_trial["target_pic"]);
						} 

						$("#stage").fadeIn();
						clickDisabled = false
				},
					normalpause);
			},
				timeafterClick);
		} else {
			console.log('clicking disabled on choice images');
		}
	});
}




function confirm_ret() {

 // select only experimental items

	// data_ret.birth_order = document.getElementById("birth_order").value;
	// data_ret.num_siblings = document.getElementById("num_siblings").value;

	// data.ethnicity = document.getElementById("ethnicity").value.replace(/,/g, " ");
	// data.native_lang = document.getElementById("native_lang").value.replace(/,/g, " ");
	// data.other_langs = document.getElementById("other_langs").value.replace(/,/g, " ");
	// data.parental_occ = document.getElementById("parental_occ").value.replace(/,/g, " ");
	// data.dev_info = document.getElementById("dev_info").value.replace(/,/g, " ");

	// data.subject_id = document.getElementById("subject_id").value;

	// data.date_of_birth = document.getElementById("date_of_birth").value;
	// if (document.getElementById("gender").checked === true) {
	// 	data.gender = 'male';
	// }
	// if (document.getElementById("gender").checked === false) {
	// 	data.gender = 'female';
	// }
	// if (document.getElementById("version").checked === true) {
	// 	data.version = 'ListA';
	// }
	// if (document.getElementById("version").checked === false) {
	// 	data.version = 'ListB';
	// }
	// if (data.version === 'ListA'){
	// trials = trialsA;
	// }
	// if (data.version === 'ListB'){
	// trials = trialsB;
	// }
//     preload_images(trials);
// // Preloads all the images

	document.body.style.background = "white";
	$("#confirm_ret").hide();
	setTimeout(function () {
		run_all_trials_counterbalance_ret();
	}, normalpause);
}
// Called when clicking on "Le's look again" after the end of learning


function set_up_trial_list_counterbalance_ret() {

 function compare(a,b) {
  if (a.trial_id < b.trial_id)
    return -1;
  if (a.trial_id > b.trial_id)
    return 1;
  return 0;
 };

 trials_ret.sort(compare);
 // sort by trial id
 
//  // I think I do not need anymore because I have added this info to the trialsA/B files
//  distractor_ret = [
// {
//     "retention_question_start": 0,
//     "retention_question_length": 1
//  	},
// {
//     "retention_question_start": 0,
//     "retention_question_length": 1
//  	},
//  {
//     "retention_question_start": 0,
//     "retention_question_length": 1
//  	},
//  {
//     "retention_question_start": 0,
//     "retention_question_length": 1
//  	},
//  {
//     "retention_question_start": 0,
//     "retention_question_length": 1
//  	},
// {
//     "retention_question_start": 0,
//     "retention_question_length": 1
//  	},
//  {
//     "named_distractor_id": 8,
//     "named_distractor_pic": "images/stims/robot8.png",
//     "unnamed_distractor_id": 11,
//     "unnamed_distractor_pic": "images/stims/robot11.png",
//     "retention_question_start": 0,
//     "retention_question_length": 1
//  	},
//  {
//     "named_distractor_id": 5,
//     "named_distractor_pic": "images/stims/robot5.png",
//     "unnamed_distractor_id": 12,
//     "unnamed_distractor_pic": "images/stims/robot12.png",
//     "retention_question_start": 0,
//     "retention_question_length": 1
//  	}
//  ];
//  // add this info (fixed); for now put placeholder for question start and length; will have to record a number of carrier phrases
//  for (var i = 0; i<8; i++){
//   		trials_ret[i].named_distractor_id = distractor_ret[i].named_distractor_id;
//   		trials_ret[i].named_distractor_pic = distractor_ret[i].named_distractor_pic;
//   		trials_ret[i].unnamed_distractor_id = distractor_ret[i].unnamed_distractor_id;
//   		trials_ret[i].unnamed_distractor_pic = distractor_ret[i].unnamed_distractor_pic;
//   		trials_ret[i].retention_question_start = distractor_ret[i].retention_question_start;
//   		trials_ret[i].retention_question_length = distractor_ret[i].retention_question_length
  	
//   	}

preload_images_ret(trials_ret);
// Set-up retention trials list
	var num_trials_ret = trials_ret.length;

	// Hope that number of real trials is even...
	sides_to_use_ret = new Array();
function getRandomFromBucket() {
	 var bucket = ["left_ret","center_ret","right_ret"];
   var randomIndex = Math.floor(Math.random()*bucket.length);
   var target_pos = bucket.splice(randomIndex, 1)[0];
   var randomIndex = Math.floor(Math.random()*bucket.length);
   var named_distractor_pos = bucket.splice(randomIndex, 1)[0];
   bucket = ["left_ret","center_ret","right_ret"];
   return {"target_position": target_pos, "named_distractor_position": named_distractor_pos }
}



	for (var i = 0; i<num_trials_ret; i++) {

		sides_to_use_ret.push(getRandomFromBucket());

	}


	shuffle(sides_to_use_ret);

// counterbalance picture position

	shuffle(trials_ret);
// Shuffles the array of retention trials
	
	// do not need training trials (?)
	// for (var item of training_trials) {
	// 	trials.splice(0,0,item);
	// }
	// Add the training trials to main list of trials 
	// Makes sure that the training trials always happen first. They won't be shuffled in with the
	// others but they will be in backwards order to what they are in the .json file,
	// though that should not matter.

	// We later iterate through the trials array and apply a function to using forEach()
	// This function will deal with the trial.
}


function run_all_trials_counterbalance_ret() {

	set_up_trial_list_counterbalance_ret();
	console.log("this are the trials in retention after fixing");
    console.log(trials_ret);
	counter_ret = 1;
	play_counter_ret = 0;
	number_of_trials_ret = trials_ret.length;

	current_trial_ret = trials_ret[0];

	var sound_played_ret = false;

	$("#speaker_img_ret").attr("src", current_trial_ret["speaker_pic"]);
	// this is the picture of Peppa or George

	target_side_ret = sides_to_use_ret[0].target_position;
	// Determine which side the target will be on for this trial
	named_distractor_side_ret = sides_to_use_ret[0].named_distractor_position;
		
		if (target_side_ret === 'left_ret') {
			$("#left_ret").attr("src", current_trial_ret["target_pic"]);
			if (named_distractor_side_ret=== 'right_ret'){
				$("#right_ret").attr("src", current_trial_ret["named_distractor_pic"]);
				$("#center_ret").attr("src", current_trial_ret["unnamed_distractor_pic"]);
			}
			if (named_distractor_side_ret=== 'center_ret'){
				$("#center_ret").attr("src", current_trial_ret["named_distractor_pic"]);
				$("#right_ret").attr("src", current_trial_ret["unnamed_distractor_pic"]);
			}
		} 

		if (target_side_ret === 'center_ret') {
			$("#center_ret").attr("src", current_trial_ret["target_pic"]);
			if (named_distractor_side_ret=== 'right_ret'){
				$("#right_ret").attr("src", current_trial_ret["named_distractor_pic"]);
				$("#left_ret").attr("src", current_trial_ret["unnamed_distractor_pic"]);
			}
			if (named_distractor_side_ret=== 'left_ret'){
				$("#left_ret").attr("src", current_trial_ret["named_distractor_pic"]);
				$("#right_ret").attr("src", current_trial_ret["unnamed_distractor_pic"]);
			}
		} 

		if (target_side_ret === 'right_ret') {
			$("#right_ret").attr("src", current_trial_ret["target_pic"]);
			if (named_distractor_side_ret=== 'left_ret'){
				$("#left_ret").attr("src", current_trial_ret["named_distractor_pic"]);
				$("#center_ret").attr("src", current_trial_ret["unnamed_distractor_pic"]);
			}
			if (named_distractor_side_ret=== 'center_ret'){
				$("#center_ret").attr("src", current_trial_ret["named_distractor_pic"]);
				$("#left_ret").attr("src", current_trial_ret["unnamed_distractor_pic"]);
			}
		} 
	// $("#sound_player").attr("src", current_trial["sound_file_name"]);

	// var sound_file = $("#sound_player")[0];
	//$("#left").attr("src", current_trial["a_speaker_pic"]);
	//$("#right").attr("src", current_trial["b_speaker_pic"]);
	
	// First trial will be a training one so can have fixed position for stims. Randomised later.	(???)
	// I don't think the position of the images is randomized, just the order in which they vibrate
	// instead I will have to randomize the position (if statement?)

	//var pause_between = 1000;
	// pause between each sound being played
	var pause_between_noun_short_ret = 250;

   // this needs to be equal to duration of sentence + duration of target word (+ duration of question)
	var total_sound_length_ret = (current_trial_ret['retention_question_length'] + current_trial_ret['target_name_length_det'])*1000 + pause_between_noun_short_ret; 
	// length of the entire sounds clips being played, used to determine when to turn back on clicking
	//total_sound_length += pause_between * 1;
	// Increase it by the pauses otherwise clicking is turned back on too early. There is a pause between end of sentence and beginning of question but not between sentence fragment and target word

	var clickDisabled_ret = false;

	//presentation_order = order_to_play[0];
	// Used for the first training trial then changed at random again
	// for each new trial
	// 0 = L to R
	// 1 = R to L

	$("#stage_ret").fadeIn();

	start_time_ret = -1;

	// Click speaker to start...
	$('#speaker_img_ret').on('click touchstart', function(event) {
		if (clickDisabled_ret) return ;

		clickDisabled_ret = true;

		sound_played_ret = true;

		play_counter_ret++;

		setTimeout(function()
			{clickDisabled_ret = false},
			total_sound_length_ret);

		//play_one_item('#clear_speaker_img', current_trial['clear_sound_start'], current_trial['clear_sound_length']);
		
		// this will play the sentence fragment (probbaly best to use a fragment + target structure for fillers too)
		play_one_item('#speaker_img_ret', current_trial_ret['retention_question_start'], current_trial_ret['retention_question_length']);

		// this will play the target name
			setTimeout(function()
				{play_one_item('#speaker_img_ret', current_trial_ret['target_name_start_det'], current_trial_ret['target_name_length_det']);},
				current_trial_ret['retention_question_length']*1000  + pause_between_noun_short_ret//+ pause_between // this is used to make sure that the target sound is played only after the fragment is over (probably remove pause)
				);
		// // this will be used to play the question	
		// 	setTimeout(function()
		// 		{play_one_item('#speaker_img', current_trial['question_sound_start'], current_trial['question_sound_length']);},
		// 		current_trial['sentence_length']*1000 + current_trial['target_name_length']*1000 + pause_between // this is used to make sure question plays only 1000 after end of target name
		// 		);

//// THIS IS NOT RELEVANT
		// if (presentation_order === 1 & target_side === 'left') {
		// 	setTimeout(function()
		// 		{play_one_item('#right', current_trial['foil_sound_start'], current_trial['foil_sound_length']);},
		// 		current_trial['clear_sound_length']*1000 + pause_between
		// 		);
		// 	setTimeout(function()
		// 		{play_one_item('#left', current_trial['target_sound_start'], current_trial['target_sound_length']);},
		// 		current_trial['clear_sound_length']*1000 + pause_between + current_trial['foil_sound_length']*1000 + pause_between
		// 		);
		// }

		// if (presentation_order === 0 & target_side === 'right') {
		// 	setTimeout(function()
		// 		{play_one_item('#left', current_trial['foil_sound_start'], current_trial['foil_sound_length']);},
		// 		current_trial['clear_sound_length']*1000 + pause_between
		// 		);
		// 	setTimeout(function()
		// 		{play_one_item('#right', current_trial['target_sound_start'], current_trial['target_sound_length']);},
		// 		current_trial['clear_sound_length']*1000 + pause_between + current_trial['foil_sound_length']*1000 + pause_between
		// 		);
		// } 

		// if (presentation_order === 1 & target_side === 'right') {
		// 	setTimeout(function()
		// 		{play_one_item('#right', current_trial['target_sound_start'], current_trial['target_sound_length']);},
		// 		current_trial['clear_sound_length']*1000 + pause_between
		// 		);
		// 	setTimeout(function()
		// 		{play_one_item('#left', current_trial['foil_sound_start'], current_trial['foil_sound_length']);},
		// 		current_trial['clear_sound_length']*1000 + pause_between + current_trial['target_sound_length']*1000 + pause_between
		// 		);
		// }
// END OF NON-RELEVANT STUFF

	start_time_ret = (new Date()).getTime();
	// console.log("start time is:", start_time);

});



	//If a student/robot is clicked, then record data and move on.
	$('.choice_ret').on('click touchstart', function(event){
		if (sound_played_ret === false) {
			console.log('sound not played yet');
			return;
		}
		if (clickDisabled_ret === false) {
			clickDisabled_ret = true;
			sound_played_ret = false;
			
			var response_ret = $(this).attr('id');

			$(this).effect('bounce', {'times':6, 'distance':200}, 1000);
			
			if (response_ret === target_side_ret) {
				data_ret.accuracy = 1;
			} else {
				data_ret.accuracy = 0;
			}

			data_ret.rt = (new Date()).getTime() - start_time_ret - total_sound_length_ret;

			if (start_time_ret === -1) {
				data_ret.rt = -1;
			}

			// console.log('rt:', data.rt)
			data_ret.trial_number = counter_ret;
			data_ret.trial_id = current_trial_ret['trial_id'];
			data_ret.target_side = target_side_ret;
			data_ret.trial_type = current_trial_ret['trial_type'];
			data_ret.verb_type = current_trial_ret['verb_type'];
			data_ret.target_name = current_trial_ret['target_name'];
			data_ret.play_counter= play_counter_ret;
			data_ret.retention_question = current_trial_ret['retention_question'];
			data_ret.named_distractor_side = named_distractor_side_ret;
			//data.novel_name = novel_name;
			//data.presentation_order = presentation_order;
			data_ret.side_chosen = response_ret;

			processOneRow_ret();
			saveData_ret();

			data_ret.rt = -1;
			start_time_ret = -1;

			//put all the data saving stuff here...


			trials_ret.splice(0, 1);
			//order_to_play.splice(0, 1);
			sides_to_use_ret.splice(0, 1);
			counter_ret++;
			play_counter_ret = 0;
			//pop off the trial we just did and update trial counter.
			//same for the order/side

			// not sure what the rest is for but will have to change it!

			setTimeout(function() {
				$("#stage_ret").fadeOut();

				if (counter_ret === number_of_trials_ret + 1) {
					end_ret();
					return;
				}
				
				setTimeout(function(){
						current_trial_ret = trials_ret[0];
						// Get new trial
						//presentation_order = order_to_play[0];
						target_side_ret = sides_to_use_ret[0].target_position;
						// Determine which side the target will be on for this trial
						named_distractor_side_ret = sides_to_use_ret[0].named_distractor_position;
						// console.log('play order', presentation_order);
						// console.log('target side', target_side);
						// Update randomisation vars

						if (target_side_ret === 'left_ret') {
							$("#left_ret").attr("src", current_trial_ret["target_pic"]);
							if (named_distractor_side_ret=== 'right_ret'){
								$("#right_ret").attr("src", current_trial_ret["named_distractor_pic"]);
								$("#center_ret").attr("src", current_trial_ret["unnamed_distractor_pic"]);
							}
							if (named_distractor_side_ret=== 'center_ret'){
								$("#center_ret").attr("src", current_trial_ret["named_distractor_pic"]);
								$("#right_ret").attr("src", current_trial_ret["unnamed_distractor_pic"]);
							}
						} 

						if (target_side_ret === 'center_ret') {
							$("#center_ret").attr("src", current_trial_ret["target_pic"]);
							if (named_distractor_side_ret=== 'right_ret'){
								$("#right_ret").attr("src", current_trial_ret["named_distractor_pic"]);
								$("#left_ret").attr("src", current_trial_ret["unnamed_distractor_pic"]);
							}
							if (named_distractor_side_ret=== 'left_ret'){
								$("#left_ret").attr("src", current_trial_ret["named_distractor_pic"]);
								$("#right_ret").attr("src", current_trial_ret["unnamed_distractor_pic"]);
							}
						} 

						if (target_side_ret === 'right_ret') {
							$("#right_ret").attr("src", current_trial_ret["target_pic"]);
							if (named_distractor_side_ret=== 'left_ret'){
								$("#left_ret").attr("src", current_trial_ret["named_distractor_pic"]);
								$("#center_ret").attr("src", current_trial_ret["unnamed_distractor_pic"]);
							}
							if (named_distractor_side_ret=== 'center_ret'){
								$("#center_ret").attr("src", current_trial_ret["named_distractor_pic"]);
								$("#left_ret").attr("src", current_trial_ret["unnamed_distractor_pic"]);
							}
						} 

						$("#stage_ret").fadeIn();
						clickDisabled_ret = false
				},
					normalpause);
			},
				timeafterClick);
		} else {
			console.log('clicking disabled on choice images');
		}
	});
}

showSlide("consent");

// Called upon page load to start the whole thing off by showing the intro screen to add a new subject.

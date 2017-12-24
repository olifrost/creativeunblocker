;(function($) {
	$.timer = function(func, time, autostart) {	
	 	this.set = function(func, time, autostart) {
	 		this.init = true;
	 	 	if(typeof func == 'object') {
		 	 	var paramList = ['autostart', 'time'];
	 	 	 	for(var arg in paramList) {if(func[paramList[arg]] != undefined) {eval(paramList[arg] + " = func[paramList[arg]]");}};
 	 			func = func.action;
	 	 	}
	 	 	if(typeof func == 'function') {this.action = func;}
		 	if(!isNaN(time)) {this.intervalTime = time;}
		 	if(autostart && !this.isActive) {
			 	this.isActive = false;
			 	this.setTimer();
		 	}
		 	return this;
	 	};
	 	this.once = function(time) {
			var timer = this;
	 	 	if(isNaN(time)) {time = 0;}
			window.setTimeout(function() {timer.action();}, time);
	 		return this;
	 	};
		this.play = function(reset) {
			if(!this.isActive) {
				if(reset) {this.setTimer();}
				else {this.setTimer(this.remaining);}
				this.isActive = true;
			}
			return this;
		};
		this.pause = function() {
			if(this.isActive) {
				this.isActive = false;
				this.remaining -= new Date() - this.last;
				this.clearTimer();
			}
			return this;
		};
		this.stop = function() {
			this.isActive = false;
			this.remaining = this.intervalTime;
			this.clearTimer();
			return this;
		};
		this.toggle = function(reset) {
			if(this.isActive) {this.pause();}
			else if(reset) {this.play(true);}
			else {this.play();}
			return this;
		};
		this.reset = function() {
			this.isActive = false;
			this.play(true);
			return this;
		};
		this.clearTimer = function() {
			window.clearTimeout(this.timeoutObject);
		};
	 	this.setTimer = function(time) {
			var timer = this;
	 	 	if(typeof this.action != 'function') {return;}
	 	 	if(isNaN(time)) {time = this.intervalTime;}
		 	this.remaining = time;
	 	 	this.last = new Date();
			this.clearTimer();
			this.timeoutObject = window.setTimeout(function() {timer.go();}, time);
		};
	 	this.go = function() {
	 		if(this.isActive) {
	 			this.action();
	 			this.setTimer();
	 		}
	 	};
	 	
	 	if(this.init) {
	 		return new $.timer(func, time, autostart);
	 	} else {
			this.set(func, time, autostart);
	 		return this;
	 	}
	};
})(jQuery);


var Clock = new (function() {
    var $countdown,
        $form, // Form used to change the countdown time
        incrementTime = 70,
        currentTime = 6000,
        updateTimer = function() {
            $countdown.html(formatTime(currentTime));
            $('#progress').attr('style', function(){
                return 'width:' + (progressBar(currentTime)) + '%';
                }); 
            if (currentTime == 0) {
                Clock.Timer.stop();
                timerComplete();
                Clock.resetCountdown();
                return;
            }
            currentTime -= incrementTime / 10;
            if (currentTime < 0) currentTime = 0;
        },
        timerComplete = function() {
        //CHANGE BRIEF TEXT
        $('#brief').fadeOut(function() {
        theBrief =  encodeURI(randomBrief);
        theTweet = 'http://twitter.com/share?text=' + encodeURI(randomBrief) + '&url=http://unblocker.oliandjosie.com/' + encodeURI('&hashtags=unblocker'); 
        $('#brief').html('<a id="twitterpost">Tweet your answer</a>');
        $('#twitterpost').attr('href',theTweet);
        }).fadeIn();
        //CHANGE COUNTDOWN TEXT
        $('#countdown').fadeOut(function() {
        $('#countdown').text('TIME IS UP')
        }).fadeIn();
        //MAKE BAR SOLID
        $('.progress').attr('class','progress');
        },
        init = function() {
            $countdown = $('#countdown');
            Clock.Timer = $.timer(updateTimer, incrementTime, true);
            $form = $('#clockform');
            $form.bind('submit', function() {
                Clock.resetCountdown();
                return false;
            });
        };        
	    this.resetPlay = function() {
		    var newTime = 6000;
		    if (newTime > 0) {currentTime = newTime;}
		  	$('.progress').attr('class','progress progress-striped active'); 
		    this.Timer.play();
		};
    $(init);
});

function pad(number, length) {
    var str = '' + number;
    while (str.length < length) {str = '0' + str;}
    return str;
}
function formatTime(time) {
    var min = parseInt(time / 6000),
        sec = parseInt(time / 100),
        hundredths = pad(time - (sec * 100) - (min * 6000), 2);
    return pad(sec, 2) + " SECONDS";
}
function progressBar(time) {
    var sec = parseInt(time / 100) * 1.66;
    return pad(sec, 2);
}

//function twitter(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
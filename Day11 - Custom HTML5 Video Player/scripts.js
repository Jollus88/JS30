const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
const fullscreenButton = player.querySelector('.player__fullscreen');

var mousedown = false;

/* Build out functions */
const togglePlay = function(){
	const method = video.paused ? 'play' : 'pause';
	// will conflict with native play/pause if video is fullscreen and cause bugs, hence the IF statement
	var fullscreenMode = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
	if(!fullscreenMode){
		video[method]();
	}
}

const updateButton = function(){
	const icon = this.paused ? '►' : '❚ ❚';
	toggle.textContent = icon;
}

const skip = function(){
	// console.log(this.dataset);
	console.log(this.dataset.skip);
	video.currentTime += parseFloat(this.dataset.skip);
}

const handleRangeUpdate = function(){
	// console.log(this.value);
	// console.log(this.name);
	video[this.name] = this.value;
}

const handleProgress = function(){
	const percent = (video.currentTime / video.duration) * 100;
	progressBar.style.flexBasis = `${percent}%`;
}

// THE BIG ONE!
const scrub = function(e){
	// console.log(e);
	// offsetWidth gets width of bar
	const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
	video.currentTime = scrubTime;
}

// extra credit
const fullscreen = function(){
	if(video.requestFullscreen){
		video.requestFullscreen();
	}
}

/* Hook up event listeners */
video.addEventListener('click', togglePlay);
toggle.addEventListener('click', togglePlay);

skipButtons.forEach(button => button.addEventListener('click', skip));
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));

progress.addEventListener('click', scrub);
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);
progress.addEventListener('mousemove', (e) => mousedown==true && scrub(e));

// Other events may cause videos to pause... MUST ACCOUNT FOR THAT
// Hook into the play/pause EVENT instead
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton)

fullscreenButton.addEventListener('click', fullscreen);
video.addEventListener('dblclick', fullscreen);


video.addEventListener('timeupdate', handleProgress);
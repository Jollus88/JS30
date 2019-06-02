const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

const getVideo = function() {
	// returns a promise
	navigator.mediaDevices.getUserMedia({ video: true, audio: false})
		.then(localMediaStream => {
			console.log(localMediaStream);
			video.srcObject = localMediaStream;
			// video.src = window.URL.createObjectURL(new Blob(binaryData, {ty[e: ]}))
			video.play();
		})
		.catch(err => {
			console.error('No webcam access', err);
		});
}

const paintToCanvas = function() {
	const width = video.videoWidth;
	const height = video.videoHeight;
	console.log(width, height);
	canvas.width = width;
	canvas.height = height;

	// take an Image, put in canvas
	// put in return statement so can use clearInterval() on it!
	return setInterval(() => {
		ctx.drawImage(video, 0, 0, width, height);
		// take pixels out
		let pixels = ctx.getImageData(0, 0, width, height);
		
		// mess with pixels
		// pixels = redEffect(pixels);
		pixels = rgbSplit(pixels);

		// trippy ghost effect!
		// ctx.globalAlpha = 0.1;

		// console.log(pixels);
		// debugger;
		// put pixels back
		ctx.putImageData(pixels, 0, 0);
	}, 100);
}

const redEffect = function(pixels) {
	// iterate by 4! This way can access all four channels at once in each iteration group
	for(let i = 0; i < pixels.data.length; i+=4) {
		pixels.data[i] = pixels.data[i] + 100; // red
		pixels.data[i + 1] = pixels.data[i + 1] - 50; // green
		pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // blue
	}
	return pixels;
}

const rgbSplit = function(pixels) {
	for(let i = 0; i < pixels.data.length; i+=4) {
		pixels.data[i - 150] = pixels.data[i]; // red
		pixels.data[i + 100] = pixels.data[i + 1]; // green
		pixels.data[i - 150] = pixels.data[i + 2]; // blue
	}
	return pixels;
}

const takePhoto = function() {
	snap.currentTime = 0;
	snap.play();

	// take the data out of the canvas
	const data = canvas.toDataURL('image/jpeg');
	const link = document.createElement('a');
	link.href = data;
	console.log(data);
	link.setAttribute('download', 'handsome');
	link.textContent = 'Download the Image';
	link.innerHTML = `<img src="${data}" alt="Handsome Man" />`;
	strip.insertBefore(link, strip.firstChild);
}

// haha nope
// const greenScreen(pixels) {

// }

getVideo();

video.addEventListener('canplay', paintToCanvas);
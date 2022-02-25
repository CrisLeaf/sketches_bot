const canvas = document.getElementById("canvas");

function resizeCanvas () {
	if (1800 < window.screen.width && window.screen.width <= 2100) {
		canvas.width = 640;
		canvas.height = 640;
	} else if (1500 < window.screen.width && window.screen.width <= 1800) {
		canvas.width = 512;
		canvas.height = 512;
	} else if (1200 < window.screen.width && window.screen.width <= 1500) {
		canvas.width = 384;
		canvas.height = 384;
	} else if (1000 < window.screen.width && window.screen.width <= 1200) {
		canvas.width = 320;
		canvas.height = 320;
	} else if (780 < window.screen.width && window.screen.width <= 1000) {
        canvas.width = 704;
        canvas.height = 704;
    } else if (700 < window.screen.width && window.screen.width <= 780) {
        canvas.width = 640;
        canvas.height = 640;
    } else if (580 < window.screen.width && window.screen.width <= 700) {
        canvas.width = 512;
        canvas.height = 512;
    } else if (500 < window.screen.width && window.screen.width <= 580) {
        canvas.width = 448;
        canvas.height = 448;
    } else if (400 < window.screen.width && window.screen.width <= 500) {
        canvas.width = 384;
        canvas.height = 384;
    } else if (350 < window.screen.width && window.screen.width <= 400) {
        canvas.width = 320;
        canvas.height = 320;
    } else if (window.screen.width && window.screen.width <= 350) {
        canvas.width = 256;
        canvas.height = 256;
	} else {
		canvas.width = 768;
		canvas.height = 768;
	}

	let context = canvas.getContext("2d");
    let start_background_color = "white";
    context.fillStyle = start_background_color;
    context.fillRect(0, 0, canvas.width, canvas.height);

    let draw_color = "black";
    let draw_width = canvas.width / 32;
    let is_drawing = false;

    let restore_array = [];
    let index = -1;
}

resizeCanvas();

window.onresize = function () {
	resizeCanvas();
}
let context = canvas.getContext("2d");
let start_background_color = "white";
context.fillStyle = start_background_color;
context.fillRect(0, 0, canvas.width, canvas.height);

let draw_color = "black";
let draw_width = canvas.width / 32;
let is_drawing = false;

let restore_array = [];
let index = -1;

canvas.addEventListener("touchstart", start, false);
canvas.addEventListener("touchmove", draw, false);
canvas.addEventListener("mousedown", start, false);
canvas.addEventListener("mousemove", draw, false);

canvas.addEventListener("touchend", stop, false);
canvas.addEventListener("mouseup", stop, false);
canvas.addEventListener("mouseout", stop, false);

// Re-load image on submit
const canvasdata = document.querySelector("#canvasdata").value;
if (canvasdata) {
	const image = new Image();
	image.onload = () => {
		context.drawImage(image, 0, 0);
	};
	image.src = canvasdata;

} else {
	context.fillStyle = start_background_color;
	context.fillRect(0, 0, canvas.width, canvas.height)
}

// Drawing Fucntions
function start (event) {
	is_drawing = true;
    context.beginPath();
	if (event.type == "touchstart") {
		context.moveTo(event.touches[0].clientX - canvas.offsetLeft,
					   event.touches[0].clientY - canvas.offsetTop);

		context.lineTo(event.touches[0].clientX - canvas.offsetLeft,
        	           event.touches[0].clientY - canvas.offsetTop);
	} else {
		context.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);

		context.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
	}
	context.strokeStyle = draw_color;
    context.lineWidth = draw_width;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.stroke();

	event.preventDefault();
}

function draw (event) {
	if (is_drawing) {
		if (event.type == "touchmove") {
	        context.lineTo(event.touches[0].clientX - canvas.offsetLeft,
	                       event.touches[0].clientY - canvas.offsetTop);
	    } else {
	        context.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
	    }
		context.strokeStyle = draw_color;
		context.lineWidth = draw_width;
		context.lineCap = "round";
		context.lineJoin = "round";
		context.stroke();
	}
	event.preventDefault();
}

function stop (event) {
	if (is_drawing) {
		context.stroke();
		context.closePath();
		is_drawing = false;
	}
	event.preventDefault();

	if (event.type != "mouseout") {
		restore_array.push(context.getImageData(0, 0, canvas.width, canvas.height));
		index += 1;
	}
}

function clear_canvas () {
	context.fillStyle = start_background_color;
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillRect(0, 0, canvas.width, canvas.height);

	restore_array = [];
	index = -1;
}

function undo_last () {
	if (index <= 0) {
		clear_canvas();
	} else {
		index -= 1;
		restore_array.pop();
		context.putImageData(restore_array[index], 0, 0);
	}
}

function submit_canvas () {
	const dataURL = canvas.toDataURL();
	document.getElementById("canvasimg").value = dataURL;
	document.getElementById("restore_array").value = restore_array;
}


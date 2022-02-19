const canvas = document.getElementById("canvas");
canvas.width = 550;
canvas.height = 550;

let context = canvas.getContext("2d");
let start_background_color = "white";
context.fillStyle = start_background_color;
context.fillRect(0, 0, canvas.width, canvas.height);

let draw_color = "black";
let draw_width = "15";
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
	context.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
	event.preventDefault();

}

function draw (event) {
	if (is_drawing) {
		context.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
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
	console.log(restore_array);
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
//	imgConverted.src = dataURL;
	document.getElementById("canvasimg").value = dataURL;
	document.getElementById("restore_array").value = restore_array;
}


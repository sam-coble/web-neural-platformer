let data = {};
function setup() {
	createCanvas(600,400);
	console.clear();
}
async function draw() {
	await play();
}

async function play() {
	try {
		const res = JSON.parse(await ajax('/update').post(buttons));
		data = res;
		drawLevel(res.level.solids);
		drawPlayer(res.player);
		drawNetwork(res.brain, 10, 10, 100, 100);
		// console.log(res);
	} catch(e) {

	}
}
function drawPlayer({pos, scale}) {
	stroke(0);
	strokeWeight(1);
	fill(0);
	rect(pos.x, pos.y, scale.x, scale.y);
}
function drawLevel(level) {
	background(200);
	fill(0);
	stroke(0);
	strokeWeight(1);

	Object.values(level).forEach(val => {
		rect(val.x, val.y, val.w, val.h)
	});
}
function drawNetwork(brain, x, y, w, h) {
	brain.weights.forEach(weight => {
		stroke(weight.weight > 0 ? 255 : 0);
		strokeWeight(Math.pow(Math.abs(weight.weight), .5)/2);
		line(brain.nodes[weight.i1].x * w + x, brain.nodes[weight.i1].y * h + y, brain.nodes[weight.i2].x * w + x, brain.nodes[weight.i2].y * h + y);
	});
	brain.nodes.forEach(node => {
		stroke(0);
		strokeWeight(1);
		fill(node.val > 0 ? 255 : 0);
		ellipse(node.x * w + x, node.y * h + y, 18);
	});
}


function addWeight(i1, i2, weight) {
	ajax('/addweight').post({i1:i1, i2:i2, weight:weight});
}


const buttons = {
	left: false,
	right: false,
	jump: false,
}
function keyPressed() {
	if(key == ' ') buttons.jump = true;
	if(key == 'a') buttons.left = true;
	if(key == 'd') buttons.right = true;
	if(key == 'e') draw = function(){};
	if(key == 'r') play();
}
function keyReleased() {
	if(key == ' ') buttons.jump = false;
	if(key == 'a') buttons.left = false;
	if(key == 'd') buttons.right = false;
}
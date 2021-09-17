const {readFileSync, writeFileSync, readFile, writeFile} = require('fs');
const {Brain} = require('./brain.js');

const Game = class {
	constructor(params) {
		this.params = params;
		this.levelPath = params.levelPath;
		this.level = this.loadLevel();

		this.player = this.level.player;
		
		this.outputs;
		this.constants = {
			xVel: params.constants.xVel ?? 5,
			grav: params.constants.grav ?? .3,
			jumpVel: params.constants.jumpVel ?? 10,
		}
		this.onGround = false;

		this.brain = new Brain({
			inputs: [
				'xpos',
				'ypos',
				'bias',
			],
			outputs: [
				'left',
				'right',
				'jump',
			],
		});
		this.brain.addHiddenNode({x:0.5, y:0});


		params.brainWeightIds.forEach(weight => {
			this.brain.addWeightFromIds(...weight)
		})

	}
	loadLevel() {
		return JSON.parse(readFileSync(this.levelPath + '.json'));
	}
	collision(rect1, rect2) {
		return rect1.x < rect2.x + rect2.w && 
			rect1.x + rect1.w > rect2.x && 
			rect1.y < rect2.y + rect2.h && 
			rect1.y + rect1.h > rect2.y;
	}
	update() {

		this.outputs = this.brain.getOutputs({
			xpos: this.player.pos.x,
			ypos: this.player.pos.y,
			bias: 1,
		});

		// apply horizontal vel
		if(this.onGround) {
			if(this.outputs.right && !this.outputs.left) {
				this.player.vel.x = this.constants.xVel;
			} else if(this.outputs.left && !this.outputs.right) {
				this.player.vel.x = -1 * this.constants.xVel;
			} else {
				this.player.vel.x = 0;
			}
		}

		// apply horizontal pos
		this.player.pos.x += this.player.vel.x;

		// fix horizontal pos
		const solids = Object.values(this.level.solids).filter(val => val.type == 'solid');
		for(let i = 0; i < solids.length; i++) {
			if(this.collision(
				{
					x: this.player.pos.x,
					y: this.player.pos.y,
					w: this.player.scale.x,
					h: this.player.scale.y,
				},
				solids[i])
			) {
				if(this.player.vel.x > 0) {
					this.player.pos.x = solids[i].x - this.player.scale.x;
				} else {
					this.player.pos.x = solids[i].x + solids[i].w;
				}
			}
		}

		// apply vertical vel from grav
		this.player.vel.y += this.constants.grav;

		// apply vertical pos
		this.player.pos.y += this.player.vel.y;

		// fix vertical pos
		this.onGround = false;
		for(let i = 0; i < solids.length; i++) {
			if(this.collision(
				{
					x: this.player.pos.x,
					y: this.player.pos.y,
					w: this.player.scale.x,
					h: this.player.scale.y,
				},
				solids[i])
			) {
				if(this.player.vel.y >= 0) {
					this.onGround = true;
					this.player.pos.y = solids[i].y - this.player.scale.y;
					this.player.vel.y = 0;
				} else {
					this.player.pos.y = solids[i].y + solids[i].h;
					this.player.vel.y = 0;
				}
			}
		}

		// apply vertical vel from jump if on ground
		if(this.outputs.jump && this.onGround) {
			this.player.vel.y = -1 * this.constants.jumpVel;
		}
	}
}

module.exports.Game = Game;
const Brain = class {
	constructor({inputs, outputs}) {
		this.nodes = [];
		this.inputIndeces = []
		let i = 0;
		this.aCount = 0;
		inputs.forEach(val => {
			this.inputIndeces.push(this.nodes.length);
			this.nodes.push({
				label: val,
				x: 0,
				y: i / inputs.length,
				val: 0,
				id: 'a' + this.aCount,
			});
			i++;
			this.aCount++;
		});
		this.outputIndeces = []
		i = 0;
		this.cCount = 0;
		outputs.forEach(val => {
			this.outputIndeces.push(this.nodes.length);
			this.nodes.push({
				label: val,
				x: 1,
				y: i / outputs.length,
				val: 0,
				id: 'c' + this.cCount,
			});
			i++;
			this.cCount++;
		});

		this.weights = [];
		this.bCount = 0;
	}
	addInputNode({y, label}) {
		return this.nodes.push({x:0,y:y,val:0,id:'a'+this.aCount++,label:label}) - 1;
	}
	addOutputNode({y, label}) {
		return this.nodes.push({x:1,y:y,val:0,id:'c'+this.cCount++,label:label}) - 1;
	}
	addHiddenNode({x, y}) {
		if(x <= 0 || x >= 1 || y < 0) {
			throw "invalid pos";
		}
		// returns index of pushed element
		return this.nodes.push({x:x,y:y,val:0,id:'b'+this.bCount++}) - 1;
	}
	addWeightFromIndeces(i, j, weight) {
		if( this.nodes[j].x <= this.nodes[i].x ) {
			throw "invalid indeces: backwards";
		}
		if( i >= this.nodes.length || j >= this.nodes.length ) {
			throw "index out of bounds";
		}
		if( typeof(weight) !== 'number' || isNaN(weight) ) {
			throw "weight NaN";
		}
		this.weights.push({
			i1: i,
			i2: j,
			weight: weight,
		});
	}
	addWeightFromIds(id1, id2, weight) {
		const i = this.nodes.findIndex(node => node.id == id1);
		const j = this.nodes.findIndex(node => node.id == id2);
		if(i >= 0 || j >= 0) {
			this.addWeightFromIndeces(i, j, weight);
		} else {
			throw "invalid ids";
		}
	}
	removeWeightFromIndeces(i,j) {
		const index = this.weights.findIndex(weight => weight.i1 == i || weight.i2 == j);
		if(index >= 0) {
			return this.weights.splice(index, 1);
		} else {
			throw "invalid weight";
		}
	}
	removeWeightFromIds(id1, id2) {
		const i = this.nodes.findIndex(node => node.id == id1);
		const j = this.nodes.findIndex(node => node.id == id2);
		if(i >= 0 || j >= 0) {
			this.removeWeightFromIndeces(i, j);
		} else {
			throw "invalid ids";
		}
	}
	getOutputs(inputs) {
		this.nodes.forEach(node => {node.val = 0});
		this.inputIndeces.forEach(i => {this.nodes[i].val = inputs[this.nodes[i].label]})
		this.weights.sort((a, b) => this.nodes[a.i1].x - this.nodes[b.i1].x);
		this.weights.forEach(weight => {this.nodes[weight.i2].val += weight.weight * this.nodes[weight.i1].val;});
		let out = {};
		this.outputIndeces.forEach(i => {out[this.nodes[i].label] = this.nodes[i].val > 0});
		return out;
	}
}
module.exports.Brain = Brain;
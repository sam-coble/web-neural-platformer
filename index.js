
// imports
const express = require('express');
const path = require('path')
const {readFileSync, writeFileSync, readFile, writeFile} = require('fs');

const app = express();
const bodyParser = require('body-parser')

const urlencodedParser = bodyParser.urlencoded({ extended: false })
const {Game} = require('./scripts/classes/game.js');
const {getContentType} = require('./scripts/getContentType.js')



// init
let game = new Game({
	levelPath: './assets/levels/test',
	constants: {},
	brainWeightIds: [
		['a0', 'b0', 1],
		['a2', 'b0', -250],
		['b0', 'c0', 1],
		['b0', 'c1', -1],
		['a2', 'c2', 1]
	],
});


// http stuff
app.use( express.static( __dirname + '/BrainGame' ));

app.get('/*', async (req, res) => {
	try{
		switch(req.url){
			case '/':
				res.header('Content-Type', 'text/html');
				res.send( readFileSync('./index.html') );
				break;
			default: 
				try{
					res.header('Content-Type', getContentType( path.extname(req.url) ) );
					res.send( readFileSync(`.${req.url}`) );
				}
				catch(err){
					res.header('Content-Type', 'text/html');
					res.send('404 Fie Not Found');
					throw `404: ${req.url}`;
				}
		}
	}
	catch(err){
		console.log(err);
	}
});

app.post('/update', urlencodedParser, (req, res) => {
	game.outputs = {
		left: JSON.parse(req.body.left),
		right: JSON.parse(req.body.right),
		jump: JSON.parse(req.body.jump),
	}
	game.update();
	res.status(200).header('Content-Type', 'application/json').send(JSON.stringify({
		player: game.player,
		level: game.level,
		brain: game.brain,
	}));

});

app.post('/addweight', urlencodedParser, (req, res) => {
	game.brain.addWeight(JSON.parse(req.body.i1), JSON.parse(req.body.i2), JSON.parse(req.body.weight));
	res.status(200).end();
});

app.post('/reset', urlencodedParser, (req, res) => {
	game = new Game(game.params);
	res.status(200).end();
})


app.listen(3000, () => {console.log("App ready")});




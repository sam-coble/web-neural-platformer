module.exports.getContentType = extension => {
	switch(extension){
		case '.map':
		case '.js':
			return 'application/javascript';
		case '.css':
			return 'text/css';
		case '.jpg':
			return 'image/jpg';
		case '.png':
			return 'image/png';
		case '.mp3':
			return 'audio/mpeg';
		case '.ico':
			return 'image/vnd';
		case '':
			return 'text/html';
		default:
			throw `bad file extension: ${extension}`;
	}
}
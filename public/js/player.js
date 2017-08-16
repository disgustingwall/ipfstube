(function() {
	//Get the GET variables out of the URL
	var $_GET = {};
	if(document.location.toString().indexOf('?') !== -1) {
		var query = document.location
					.toString()
					// get the query string
					.replace(/^.*?\?/, '')
					// and remove any existing hash string (thanks, @vrijdenker)
					.replace(/#.*$/, '')
					.split('&');
		
		for(var i=0, l=query.length; i<l; i++) {
		   var aux = decodeURIComponent(query[i]).split('=');
		   $_GET[aux[0]] = aux[1];
		}
	}
	
	//Set the hash of the video to "v" in the GET variables
	var videoHash = $_GET['videoHash'];
	// videoHash = 'QmU1GSqu4w29Pt7EEM57Lhte8Lce6e7kuhRHo6rSNb2UaC';
	var playerHolder = $('#player__holder');
	var player = $('#player');
	var path = hashToPath(videoHash);
	var sources = [
		'ipfs:', // Browser handler
		'http://127.0.0.1:8080', // User's own IPFS daemon
		'', // Us
		'https://gateway.ipfs.io', // Official gateway
		'https://ipfs.pics' // Is this rude?
	];
	var urls = sources.map(function(prefix) {
		return prefix + path;
	});

	player.on('error', function(e) {
		console.log('video error', e);
		tryNextUrl();
	});

	tryNextUrl();

	function tryNextUrl() {
		var url = urls.shift();
		if(url) {
			console.log('Trying url', url);
			player.get(0).src = url;
		} else {
			playerHolder.empty().append($('<p>Unable to load video</p>'));
		}
	}

	function hashToPath(videoHash) {
		if(
			videoHash.indexOf('/ipfs/') === -1 &&
			videoHash.indexOf('/ipns/') === -1
		) {
			return '/ipfs/' + videoHash;
		} else {
			return videoHash;
		}
	}
})();

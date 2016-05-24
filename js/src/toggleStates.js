(function() {
	var switches = document.querySelectorAll('[data-js="switch"]');
	var mold = document.querySelector('[data-js="contentMold"]');
	var body = document.getElementsByTagName('body')[0];

	for(var i = 0; i < Object.keys(switches).length; i++){
		switches[i].addEventListener('click',triggerMold);
	};

	function triggerMold() {
		body.className += ' device';
		mold.className = '';
		mold.classList.add(this.dataset.class);

		if(this.dataset.class === 'alpha') {
			mold.className = "";
			body.classList.remove('device');
		}
	};
})();
(function() {
	var $switches = $('[data-js="switch"]');
	var $mold = $('[data-js="contentMold"]');
	var $body = $('body');

	$switches.on('click',triggerMold);

	function triggerMold() {
		$body.addClass('device');
		$mold.removeClass().addClass($(this).data('class'));

		if($(this).data('class') === 'alpha') {
			$mold.removeClass();
			$body.removeClass('device');
		}
	};

})();
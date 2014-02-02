var portfolio = {};
portfolio.startUp = function() {
	$('.post-images a').click(function(e) {
		alert('ddd');
		var imagePlaceholder = $('#image-placeholder');
		var imageUrl = $(this).attr('href');
		imagePlaceholder.find('a').attr('href', imageUrl);
		imagePlaceholder.find('img').attr('src', imageUrl);
		return false;
	});
	$('.portfolio #image-placeholder a').fancybox({
		openEffect	: 'elastic',
    	closeEffect	: 'elastic',
    	helpers : {
    		title : {
    			type : 'inside'
    		}
    	}
	});
}
$(document).ready(function() {
    portfolio.startUp();
});

var app = {};
var numMovies = "";
app.url = 'http://bechdeltest.com/api/v1/getMoviesByTitle';

app.init = function(){
	$( '.search' ).on( 'submit', function(e){
		e.preventDefault();
		var Title = $('.q').val();
		$('').focus();
		app.getMovie(Title);
		//app.getMovie(Title);
	}); // end function(e);
};// end app.init();

// ajax call to retrieve information from bechdel api
app.getMovie = function(Title) {
	
	$.ajax({
		url : './api.php',
		type : 'GET',
		dataType : 'jsonp',
		data : {
				format : 'json',
				title : encodeURI(Title), 
			},
		success : function(results){
			numMovies = encodeURI(results).length;

			if (numMovies === 0) {

				var shrug = '<p class="shrug">¯\\_(ツ)_/¯ </p><p>Looks like nothing matches. Try again.</p>';

				$('#displayResults').append('shrug');
			}
 			app.displayTitle(results);
		}
	}); // end ajax call
}; // end app.movie

// loop to display movies that match search query
app.displayTitle = function(results) {
	// clear old results and form info so new information can be searched as results are displayed
	$( '#displayResults' ).empty();
	$('#film-input').val('');

	var numMovies = results.length;

	// loop through all movies that match search result
	for (i = 0; i < numMovies; i++) {
		console.log( 'ready to display ' + results[i].title + ' and rating ' + results[i].rating );

		//make variable for title and rating
		var movies = results[i].title;
		var rating = results[i].rating;
 
		// store information in html elements to add into page
		var div = $( '<div>' ).addClass( 'particularFilm', 'clearfix' );
		var p = $( '<p class="movTitle">' ).html( movies );

		// set variable to return in different instances
		app.imgYes = '<div class="img-l"><img src="assets/images/noun_40214_cc.svg"></div>' + '<div class="text-r"><p class="yesGO">PASS</p></div>';

		app.imgNo = '<div class="img-l"><img src="assets/images/noun_43299_cc.svg"></div> <div class="text-r"><p class="noStop">FAIL</p></div>';

		// if/else for if movie passes or not
		if ( rating == 3 ) {
			//display affirmation
			console.log( 'it passes!' );
			div.append(app.imgYes);
		} else {
			console.log( 'this movie may not have and strong female characters. Why don\'t you try something else.' );
			//display negative reading
			div.append(app.imgNo);
		}; // end if/else

		//add title of film to div that will be appended to main page
		div.append(p);
		// add div with all results to main page
		$( '#displayResults' ).append(div);

	}; // end for loop
}; //end app.dispayTitle():



//*//*//*///////////
// T H E  M E N U //
//*//*//*///////////


// hide and reveal menu
$.fn.menu = function(){
	$(this).click(function(e) {
		e.preventDefault();

		// html for the menu
		var menuHTML =
		'<div id="theMenu">' +
			'<div class="menuWrapper">' +
			'<p>Does it pass the Bechdel test was made using the Bechdel Test API.</p>' +
			'<p>If your film wasn\'t returned, go to go to their website to add a film and pass/fail, or browse a complete list of the movies that users have rated.</p>' +
			'<p class="linkOut"><a href="http://bechdeltest.com/">bechdeltest.com</a></p>'
		'</div></div>';

		// add html to body but hide it
		$(menuHTML).hide().appendTo('body').fadeIn(300);


		var menuShow = $('#theMenu');

		// and fadeout menu on click and escape
		menuShow.on('click', function() {
			console.log('click');
			$(this).fadeOut(300, function() {
				this.remove();
			});
		});

		$(document).keyup(function(e) {
			if (e.keyCode == 27 ) {
				console.log('esc');
				menuShow.fadeOut(300, function() {
					this.remove();
				});
			}
		});

	}); // 
};



$(function(){
	app.init();
	$( '.clickMe' ).menu();
});//end doc ready
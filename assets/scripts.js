var app = {};
var numMovies = "";
app.url = 'http://bechdeltest.com/api/v1/getMoviesByTitle';

app.init = function(){
	$( '.search' ).on( 'submit', function(e){
		e.preventDefault();
		var Title = $('.q').val();
		$('').focus();
		console.log(Title);
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
			numMovies = results.length;

			if (numMovies === 0) {
				console.log("nothing");
				$('#displayResults').after('<p>¯\\_(ツ)_/¯ Looks like nothing matches. Try again.</p>');
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

	for (i = 0; i < numMovies; i++) {
		console.log( 'ready to display ' + results[i].title + ' and rating ' + results[i].rating );

		//make variable for title and rating
		var movies = results[i].title;
		var rating = results[i].rating;
 
		// store information in html elements to add into page
		var div = $( '<div>' ).addClass( 'particularFilm', 'clearfix' );
		var p = $( '<p class="moTitle">' ).text( results[i].title );

		// set variable to return in different instances
		app.imgYes = '<div class="imf-l"><img src="assets/images/noun_40214_cc.svg"></div>' + '<div class="text-r"><p class="yesGO">PASS</p></div>';
		app.imgNo = '<div class="imf-l"<img src="assets/images/noun_43299_cc.svg"></div>' + '<div class="text-r"><p class="noStop">FAIL</p></div>';
		app.imgNone = '<p>¯\_(ツ)_/¯ Looks like nothing matches. Try again.</p>';

		// if/else for if movie passes or not
		if ( rating == 3 ) {
			//display affirmation
			console.log( 'it passes!' );
			div.append(app.imgYes);
		} else if ( results == undefined || results == null || results.length === 0) {
			// no results, try again
			console.log( 'there are no results' );
			div.append(app.imgNone);	
		} else {
			console.log( 'this movie may not have and strong female characters. Why don\'t you try something else.' );
			//display negative reading
			div.append(app.imgNo);
		}; // end if/else

		//add title of film to div that will be appended to main page
		div.append(p);
		// add div with all results to main page
		$( '#displayResults' ).append(div);

		// make an array of different movie screen caps to cylce through as backgrounds  and be suggestions for movies to watch that pass the bechdel test

	}; // end for loop
}; //end app.dispayTitle():


$(function(){
	app.init();
});//end doc ready
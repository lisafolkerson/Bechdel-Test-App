var app = {};

app.url = 'http://bechdeltest.com/api/v1/getMoviesByTitle';

app.init = function(){
	$( '.search' ).on( 'submit', function(e){
		e.preventDefault();
		var Title = $('.q').val();

		// remove 'the', 'a', 'and', 'an', and/or 'or' from search query:

		// if it is at the beginning of the title, completely remove
		// var regEx = /(^)(the|a|and|an|or)(\s|$)/i;
		// Title = Title.replace(regEx, '');

		// if it is between two words, replace with a space
		// var regEx = /(\s)(the|a|and|an|or)(\s)/i;
		// Title = Title.replace(regEx, ' ');

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
 			console.log('the result is ', results);

 			app.displayTitle(results);
		}
	}); // end ajax call
}; // end app.movie

// loop to display movies that match search query
app.displayTitle = function(results) {
	var numMovies = results.length;
	for (i = 0; i < numMovies; i++) {
		console.log( 'ready to display ' + results[i].title + ' and rating ' + results[i].rating );

		//make variable for title and rating
		var movies = results[i].title;
		var rating = results[i].rating;
 
		// store information in html elements to add into page
		var div = $( '<div>' ).addClass( 'particularFilm' );
		var p = $( '<p>' ).text( results[i].title );

		app.imgYes = '<img src="assets/images/noun_40214_cc.png">' + '<p>PASS</p>';
		app.imgNo = '<img src="assets/images/noun_43299_cc.png">' + '<p>FAIL</p>';

		// if/else for if movie passes or not
		if ( rating == 3 ) {
			//display affirmation
			console.log( 'it passes!' );
			div.append(app.imgYes);
		} else {
			console.log( 'this movie may not have and strong female characters. Why don\'t you try something else.' );
			//display negative reading
			//&
			//suggest another movie that has positive rating
			div.append(app.imgNo);

		}; // end if/else


		div.append(p);
		// add div with all results to main page
		$( '#displayResults' ).append(div);

		// clear old results when a new query is submitted

		// when text is added to search form stay visible

		// make an array of different movie screen caps to cylce through as backgrounds  and be suggestions for movies to watch that pass the bechdel test



	};
}; //end app.dispayTitle():


$(function(){
	app.init();
	// app.movie();
});//end doc ready
// empty namespace for app to live on
var artApp = {};
artApp.searchFieldQuery = "";
artApp.pages = 1;
artApp.pageItems = [10, 25, 40, 60, 75, 100];
artApp.pageItemsChoice = "";
artApp.RMkey = "lnJ7Bd6c"; // rijksmuseum
artApp.sort = ["relevance", "objecttype", "chronologic", "achronologic", "artist", "artistdesc"];
artApp.sortChoice = "";

/*===================================
=            Artapp.init            =
===================================*/

artApp.init = function() { // init = everything for starting up the app

	/**
	*
	* Hides Footer Links on Page Load
	*
	**/

		$("a.backToTop").hide(); // hides back to top link in footer
		$("button.moreArt").hide();

	/**
	*
	* Appends sort Options to Select Menu
	*
	**/

		$("#sortOptions").append(
			"<option value='"+ artApp.sort[0] +"'>Relevance</option>" + 
			"<option value='"+ artApp.sort[1] + "'>Object Type</option>" +
			"<option value='"+ artApp.sort[2] + "'>Old to New</option>" +
			"<option value='"+ artApp.sort[3] + "'>New to Old</option>" +
			"<option value='"+ artApp.sort[4] + "'>Artist A - Z</option>" +
			"<option value='"+ artApp.sort[5] + "'>Artist Z - A</option>"
		);


	/**
	*
	* Sets Items per Page based on user's input
	*
	**/

	$("#itemsPerPage").append(
		"<option value='"+ artApp.pageItems[0] +"'>10</option>" + 
		"<option value='"+ artApp.pageItems[1] + "'>25</option>" +
		"<option value='"+ artApp.pageItems[2] + "'>40</option>" +
		"<option value='"+ artApp.pageItems[3] + "'>60</option>" +
		"<option value='"+ artApp.pageItems[4] + "'>75</option>" +
		"<option value='"+ artApp.pageItems[5] + "'>100</option>"
	);

	/**
	*
	* Passes user's search field input as query + hides artwork if a new search occurs
	*
	**/

	$("fieldset.artSearch").on("submit",function(event){
		event.preventDefault(); // prevents form from refreshing
		artApp.searchFieldQuery = $("fieldset.artSearch input[name='searchField']").val();
		artApp.getPieces(artApp.searchFieldQuery); // calls art piece function and passes content in search field
		$("#artwork").empty(); // clears artwork before adding new pieces

	}); // end of artSearch event function


	/**
	*
	* Updates search sorting based on user's input
	*
	**/
		
		$('#sortOptions').on("change", function(){
		  artApp.sortChoice = $(this).find(':selected').val();
		  artApp.sort = artApp.sortChoice;
		});

	/**
	*
	* Updates number of items per page based on user's input
	*
	**/
		
		$('#itemsPerPage').on("change", function(){
		  artApp.pageItemsChoice = $(this).find(':selected').val();
		  artApp.pageItems = artApp.pageItemsChoice;
		});

}; // end of artApp.init

/*========================================
=            ArtApp init More            =
========================================*/

/**
*
* Loads more art when user hits "Load More"
*
**/

	artApp.initMore = function() {
		$("button.moreArt").on("click",function(event){
			event.preventDefault(); // prevents form from refreshing
			artApp.pages++; // adds 1 to number of page results
			artApp.getPieces(artApp.searchFieldQuery); // calls art piece function and passes content in search field
		}); // end of artSearch event function
	};

/*-----  End of ArtApp init More  ------*/


/*==================================
=            Get Pieces            =
==================================*/

/**
*
* This function gets the initial data from the Rijksmuseum API
*
**/

	artApp.getPieces = function(query) { // create a method to go and grab the artworks API docs: http://rijksmuseum.github.io/
		// console.log("going to fetch the art");
		$.ajax({
			url : "https://www.rijksmuseum.nl/api/en/collection",
			type: 'GET',
			data: {		
				key: artApp.RMkey,
				format: "jsonp",
				p: artApp.pages,
				ps: artApp.pageItems, // sets number of pieces displayed
				imgonly: true,
				culture: "en",
				q: query,
				s: artApp.sort,  // default: [0] = relevance
			},
			dataType : "jsonp",
			success: function(result) { // another word for success = callback
				console.log(artApp.pages);
				// $("#artwork").empty(); // clears artwork before adding new pieces
				artApp.displayPieces(result.artObjects); // when the ajax request comes back - run this code! - displayPieces function is below
				console.log(result.artObjects);
			}
		});
	};

/*-----  End of Get Pieces  ------*/

/*======================================
=            Display Pieces            =
======================================*/

/**
*
* This function uses the initial data (object number to be specific) and does a second ajax call to get more details on the artwork
*
**/

artApp.displayPieces = function(pieces) {

	var artModuleTmpl = $("<section class='artworkModule'><ul class='artFields'></ul></section>");
	
	for (var i = 0; i < pieces.length; i++) { // loop over each piece
	if(!pieces[i].webImage) {
	    continue; // skip this one there is no image
	  }

	var artItem = pieces[i]; // variable for easier calling of items in for loop
	
	$.ajax({
		url : "https://www.rijksmuseum.nl/api/en/collection/" + artItem.objectNumber,
		type: 'GET',
		data: {
			key: artApp.RMkey,
			format: "jsonp",
			imgonly: true,
			culture: "en",
		},
		dataType : "jsonp",
		success: function(result) {  // when the ajax request comes back - run this code! (another word for success = callback)
		console.log(result); // console logs full object data of artwork

			/*========================================================
			=            Variables for template / objects            =
			========================================================*/

			var artModuleSection = artModuleTmpl.clone();
			var artModuleUl = artModuleSection.find('ul');
			var artPiece = result.artObject; // variable to use data from success function
			var artOpenLiSpan = "<li class='artMetaData'><span class='fieldType'>";
			var artCloseLiSpan = "</span></li>";
			
			/*-----  End of Variables for template / objects  ------*/
			
			/*=================================================
			=            Variables: Image Metadata            =
			=================================================*/
			
			var img = "<img class='artImage lazy artImageLink' data-original='" + artPiece.webImage.url + "'" + "src='" + artPiece.webImage.url + "'>";
			var artLink = "https://www.rijksmuseum.nl/en/collection/" + artPiece.objectNumber;
			var artLocation = artPiece.productionPlaces[0];
			var artTitle = artPiece.title;
			var artMedium = artPiece.physicalMedium;
			var artType = artPiece.objectTypes;
			var artMaterials = artPiece.materials.join(", ");
			var artTechnique = artPiece.techniques;
			var artMuseum = "Rijksmuseum";

			var artMakers = ""; // empty string

			// loops over "makers" in artPiece object - gets unFixedName (last, firtst)
			for (var art = 0; art < artPiece.makers.length; art++) {
    			artMakers = artPiece.makers[art].unFixedName;
				}

			// replaces comma with ASCII code for comma (otherwise the commas mess up the data attributes)
			artMakersData = artMakers.replace(", ","&#44; "); 

			var artDate = artPiece.dating.year;

			/*==================================
			=            Art Period            =
			==================================*/

			/**
			*
			* Gets period of artwork, then evaluates it and updates the variable to read "12th century" etc 
			* Updated variable content is used in data attributes
			**/
					
			// artPeriod as an integer (useful in if statement)
			var artPeriod = artPiece.dating.period;

			// gets art period and converts it to a string
			var artPeriodString = artPiece.dating.period.toString();

			// gets the last digit of the string 
			var artPeriodLastDigit = artPeriodString.charAt(1);

			if (artPeriodLastDigit === "4" || artPeriodLastDigit === "5" || artPeriodLastDigit === "6" || artPeriodLastDigit === "7" || artPeriodLastDigit === "8" || artPeriodLastDigit === "9") {
				artPeriod = artPeriodString + "th Century";
			} else if (artPeriod >= 4 && artPeriod <= 9) {
				artPeriod = artPeriodString + "th Century";
			} else if (artPeriodLastDigit === "3" && artPeriod != 13 ) {
				artPeriod = artPeriodString + "rd Century"; // for the 3rd centrury or 23rd
			} else if (artPeriodLastDigit === "3" && artPeriod === 13){ // for 13th century
				artPeriod = artPeriodString + "th Century";
			} else if (artPeriodLastDigit === "2" && artPeriod != 12 ) {
				artPeriod = artPeriodString + "nd Century"; // for the 2nd centrury or 22nd
			} else if (artPeriodLastDigit === "2" && artPeriod === 12){ // for 13th century
				artPeriod = artPeriodString + "th Century";
			} else if (artPeriodLastDigit === "1" && artPeriod != 11 || artPeriodLastDigit === "1" && artPeriod === 21 ) {
				artPeriod = artPeriodString + "st Century"; // for the 1st centrury or 21st
			} else if (artPeriodLastDigit === "1" && artPeriod === 11){ // for 11th century
				artPeriod = artPeriodString + "th Century";
			} else if (artPeriodLastDigit === "0") {
				artPeriod = artPeriodString + "th Century"; // accounts for 10, 20, 30, etc
			}
					
			/*-----  End of Art Period  ------*/

			/*================================================================
			=            Variables: Image Metadata + HTML content            =
			================================================================*/

			/**
			*
			* art...Content variables are used to append data below each artwork - each one uses data from the art... variables created above
			*
			**/

			var artLinkTitleContent = "<h3><a target='_blank' title='View item in the Rijksmuseum collection' href=" + artLink + ">" + "<span class='title' data-title='" + artTitle + "'>" + artTitle + " " + "</span><span class='fa fa-external-link'></span></a></h3>";
			var artDateContent = artOpenLiSpan + "Date: </span><span data-date='" + artDate + "'>" + artDate + artCloseLiSpan;
			var artLocationContent = artOpenLiSpan + "Original Location: </span><span data-location='" + artLocation + "'>" + artLocation + artCloseLiSpan;
			var artMakerContent = artOpenLiSpan + "Maker: </span><span data-makers='" + artMakersData + "'>" + artMakersData + artCloseLiSpan;
			var artMediumContent = artOpenLiSpan + "Physical Medium: </span><span data-medium='" + artMedium + "'>" + artMedium + artCloseLiSpan;
			var artTypeContent = artOpenLiSpan + "Object Type: </span><span data-type='" + artType + "'>" + artType + artCloseLiSpan;
			var artMaterialsContent = artOpenLiSpan + "Materials: </span><span data-materials='" + artMaterials + "'>" + artMaterials + artCloseLiSpan;
			var artTechniqueContent = artOpenLiSpan + "Technique: </span><span data-technique='" + artTechnique + "'>" + artTechnique + artCloseLiSpan;
			var artMuseumContent = artOpenLiSpan + "Museum: </span><span data-museum='" + artMuseum + "'>" + artMuseum + artCloseLiSpan;
			var artMaterialsMediumContent = artOpenLiSpan + "Physical Medium, Material: </span><span data-medium='" + artMedium + "'" + "data-materials='" + artMaterials + "'>" + artMedium + artCloseLiSpan;
			var artMediumTechniqueContent = artOpenLiSpan + "Physical Medium, Technique: </span><span data-medium='" + artMedium + "' data-technique='" + artTechnique + "'>" + artMedium + artCloseLiSpan; 
			var artPeriodContent = artOpenLiSpan + "Period: </span><span data-period='" + artPeriod + "'>" + artPeriod + artCloseLiSpan;
			

			/*=============================================================
			=            Appends Data Attributes to Artwork ID            =
			=============================================================*/		
			artModuleSection.attr('data-date',artDate);	 
			artModuleSection.attr('data-location',artLocation);	
			artModuleSection.attr('data-makers',artMakersData);		
			artModuleSection.attr('data-materials',artMaterials);		
			artModuleSection.attr('data-medium',artMedium);		
			artModuleSection.attr('data-museum',artMuseum);
			artModuleSection.attr('data-technique',artTechnique);
			artModuleSection.attr('data-period',artPeriod);
			artModuleSection.attr('data-type',artType);

			/*==========================================================
			=            Injecting Image Data Into the Page            =
			==========================================================*/

			// title (with link) + image						
			artModuleUl.before(artLinkTitleContent + img);

			// credit to museum
			artModuleUl.append(artMuseumContent); 

			// date artwork created
			artModuleUl.append(artDateContent); 

			// artwork creator info
			artModuleUl.append(artMakerContent); 		
			
			// injects the location only if it exists
			if (artLocation !== undefined){
				artModuleUl.append(artLocationContent); // original location
			}

			// below checks for duplicate data and changes appended content accordingly
			if (artMedium == artTechnique && artMedium !== artMaterials && artMaterials.length > 0){
				artModuleUl.append(artMaterialsContent);
			}

			// injects the type only if it exists
			if (artType.length > 0){	
				artModuleUl.append(artTypeContent); // type info
			}
			
			// period of artwork creation
			artModuleUl.append(artPeriodContent); 

			if (artMedium == artTechnique && artMedium !== artMaterials){
				artModuleUl.append(artMediumTechniqueContent);

			} else if (artTechnique.length > 0 && artMedium.length > 0 && artTechnique !== artMedium && artMedium !== artMaterials){ // injects the technique only if it exists
				artModuleUl.append(artMaterialsContent + artMediumContent + artTechniqueContent); // Technique info
				
			} else if (artTechnique.length > 0 && artMedium !== artTechnique && artMedium == artMaterials){
				artModuleUl.append(artMaterialsMediumContent + artTechniqueContent);
			}

			$("#artwork").append(artModuleSection);


			// filtrify appends the data about each artwork so users can filter by artist, location, etc
			$.filtrify("artwork", "filtrifyPlaceHolder", {
		    	block : ["data-title", "data-museum"],
		    	close:true
		    });

		    $("ul.ft-menu").attr("data-row-span", 16);
		    $("ul.ft-menu").before('<h3 class="filtrifyInfo">Filter Results:</h3>');

		    $("ul.ft-menu li.ft-field").attr("data-field-span", 1);
		    $("ul.ft-menu li.ft-field").addClass("filtrifyFields");
		    

			/* Inserts buttons at bottom of page after images load */
			setTimeout(function(){
			    $("a.backToTop").show();
			    $("button.moreArt").show();
			},3500); // waits 2.5 seconds before loading

			} // end success function
		}); // end ajax function
		

		$("img.lazy").lazyload();

} // end for loop

};

/*-----  End of Display Pieces  ------*/


$(document).ready(function(){
	artApp.init(); // runs init function on document is ready

	// artApp.init:

	// calls ALL of the code above! 

	artApp.initMore(); // gets more pieces for load more button 

});
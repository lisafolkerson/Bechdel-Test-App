<?php 
	header('Content-Type: application/json');

	$data = file_get_contents('http://bechdeltest.com/api/v1/getMoviesByTitle?title=' . $_GET['title']);

	echo $_GET['callback'] . "(" . $data . ")";

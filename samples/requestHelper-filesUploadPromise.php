<?php

// charset
header("Content-Type: application/json; charset=utf-8");

// no cache
header("Expires: Sat, 1 Jan 2005 00:00:00 GMT");
header("Last-Modified: ".gmdate( "D, d M Y H:i:s")." GMT");
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");	


$r = [];
if ( count($_FILES) )
	foreach ( $_FILES as $f )
	{
		$r[] = "file " . $f['name'] . " : upload size " . $f['size'];
		unlink ($f['tmp_name']);
	}


echo json_encode(array('status'=>true, 'message'=>implode("\n", $r)));

?>
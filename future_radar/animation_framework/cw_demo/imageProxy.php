<?PHP 
/* CUSTOM WEATHER XML DATA HANDLER */
header("content-type: image/png");
$args = $_SERVER['QUERY_STRING'];
$url = "http://maps.customweather.com/image?".$args;
$xml = file_get_contents($url);
echo $xml;
?>

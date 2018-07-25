<?PHP 
echo "loading...";
/* CUSTOM WEATHER XML DATA HANDLER */
$args = $_SERVER['QUERY_STRING'];
$url = "http://maps.customweather.com/image?".$args;
$xml = file_get_contents($url);
echo $xml;
?>
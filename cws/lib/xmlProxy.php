<?PHP /* CUSTOM WEATHER XML DATA HANDLER */
$args = $_SERVER['QUERY_STRING'];
$url = "http://live.customweather.com/xml?".$args;
$xml = file_get_contents($url);
echo $xml;
?>
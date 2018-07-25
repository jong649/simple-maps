<?php
#ORG: 2017-06-01
#VER: 2018-04-11

header('Content-type: text/html; charset=utf-8');
header("Cache-Control: no-cache, must-revalidate");
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
header("Pragma: no-cache");

extract($_REQUEST, EXTR_PREFIX_ALL|EXTR_REFS, 'rvar');

global $rvar_trial_ID;

$trial_ID = $rvar_trial_ID;

if(isset($_SESSION['type']))
	unset($_SESSION['type']);

$trial_ID=$rvar_trial_ID;

$year = date("Y");



//echo "<font color=white size=3>";

// Check ID status

$filename="/prod/custom/Output/client_sites/CW/Interactive_Maps_trial_status.txt";
$file = fopen( $filename, "r");
$filesize = filesize( $filename );
$text = fread ($file, $filesize);
fclose ( $file );

#echo ("<pre>$text</pre>");

$n=0;
   if($fh = fopen( $filename, "r")){
      while (!feof($fh)){
         $n++;
         $F1[$n] = fgets($fh,9999);

      }
      fclose($fh);
    }

$b=0;

for($a=1;$a<$n;$a++){
list($temp_ID[$a], $trial_status[$a], $trial_client[$a]) = explode("|",$F1[$a]);
$b++;


#echo "[$a] temp_ID[$a] = $temp_ID[$a] | trial_ID = $trial_ID | trial_status = $trial_status[$a]<br>";

//if($temp_ID == $trial_ID && $trial_status == "expired"){

//      ob_start();
//      header("Location: trial_expired.php");
//      ob_flush();
//}

}

# Check for expiration
for($a=1;$a<$n;$a++){
if($temp_ID[$a] == $trial_ID && $trial_status[$a] == "expired"){

      ob_start();
      header("Location: ../trial_expired.php");
      ob_flush();
}

if($trial_ID ==""){

      ob_start();
      header("Location: ../trial_unauthorized.php");
      ob_flush();
}
}


for($a=1;$a<$n;$a++){
if($temp_ID[$a] == $trial_ID && $trial_status[$a] == "current"){ 
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta name="viewport" content="width=device-width, initial-scale=0.85, maximum-scale=5.0, minimum-scale=0.25, user-scalable=yes" />
<!--<meta name="viewport" content="width=device-width;" />-->
<title>CustomWeather, Inc.</title>
<meta name="keywords" content="weather, syndication, meteorology, weather forecasts, weather forecasting, weatherman, meteorologist, internet, news, technology, forecasts, custom, customized, xml, wireless, web, content, travel, ship routing, weather vertical, weather  maps, Doppler radar, satellite, weather provider">
<meta name="description" content="CustomWeather is a full-service provider of syndicated weather content for global internet and wireless markets in multiple formats including XML, ASCII, and WAP. CustomWeather provides numerous weather-related products including 2-day detailed and 7-day extended forecasts for over 30,000 cities around the globe.">

<META HTTP-EQUIV="Refresh" CONTENT="300; URL="_SELF"">
<META HTTP-EQUIV="PRAGMA" CONTENT="NO-CACHE">

<body>
<style>
#quakescss {
    font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
    border-collapse: collapse;
    width: 100%;
}

#quakescss td, #customers th {
    border: 1px solid #ddd;
    padding: 8px;
}

#quakescss tr:nth-child(even){background-color: #f2f2f2;}

#quakescss tr:hover {background-color: #46A3CB;}

</style>
<script type='text/javascript' src='https://www.bing.com/api/maps/mapcontrol?callback=quickquakeXMLLoad' async defer></script>
<script type="text/javascript" src="js/quakeWidgetBeta.js"></script>
      <script type="text/javascript" src="js/quakes.js"></script>
    


 </body>
 </html>     
      

 <?php } }
 
for($a=1;$a<$n;$a++){
if($temp_ID[$a] == $trial_ID && $trial_status[$a] != "current"){ 
 
      ob_start();
      header("Location: ../trial_demo.php");
      ob_flush();
} } ?>
      
      

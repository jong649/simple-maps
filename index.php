<?php 
#error_reporting(0);

#ORG: 2018-04-02
#VER: 2018-04-11

header('Content-type: text/html; charset=utf-8');

extract($_REQUEST, EXTR_PREFIX_ALL|EXTR_REFS, 'rvar');

if(isset($_SESSION['type']))
	unset($_SESSION['type']);

$page="marine";

$year = date("Y");
global $fx_length, $precip_flag, $tide_data, $title, $snow, $id, $type;
global $debug, $snow, $rain, $colspan1, $colspan2a, $colspan2b, $colspan3;

$fx_length=7;
$precip_flag=0;
$tide_data="false";

include("header.php");
$title = "Interactive Maps";

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
      header("Location: trial_expired.php");
      ob_flush();
}

if($trial_ID ==""){

      ob_start();
      header("Location: trial_unauthorized.php");
      ob_flush();
}
}


for($a=1;$a<$n;$a++){
if($temp_ID[$a] == $trial_ID && $trial_status[$a] == "current"){ 


// Start content

if($language!="") { $lang=$language;} else { $lang="en-US";}
if($metric==""){$metric="true";}
if($fn!=""){$page=$fn; } else {$page="marine";}

$product="expanded_forecast";

if($wid!="" && $zipcode=="") {
	$id_name="id";
	$name=$wid;
} else if($zipcode!=""){
		$id_name="zip_code";
		$name=$zipcode;
	} else {
	$id_name="name";
	$name="SanFrancisco";
}
if($type==""){$type="detailed";}

// Parse XMLQuery product
// #1]   Parse 7-day forecast
$xml = simplexml_load_file("http://xml.customweather.com/xml?client=$username&client_password=$password&product=$product&$id_name=$name&metric=$metric");
//echo ("http://xml.customweather.com/xml?client=$username&client_password=$password&product=$product&$id_name=$name&metric=$metric");

$forecasts= $xml->location->forecast;
$i=0;
$city_name=$xml['city_name'];
$country=$xml['country_name'];
$country_short=$xml['country_short'];
$state=$xml['state'];
$local_time=$xml['localtime'];
$localupdatetime= $xml['localupdatetime'];

#echo "<BR>local_time: $local_time";
#echo "<BR>localupdatetime: $localupdatetime";
#echo "http://xml.customweather.com/xml?client=$username&client_password=$password&product=$product&$id_name=$name&metric=$metric&language=$language";

$format = 'D, j M Y H:i:s T';
$currentdate = DateTime::createFromFormat($format, $local_time);
$local_updatetime = DateTime::createFromFormat($format, $localupdatetime);
$local_update_dow = $local_updatetime->format('D');
$local_update_day = $local_updatetime->format('j');
$local_update_month = $local_updatetime->format('M');
$local_update_daypart = $local_updatetime->format('A');
$local_update_time= $local_updatetime->format('h:i');
$local_update_year=$local_updatetime->format('Y');
$local_update_TZ=$local_updatetime->format('T');
$local_update_daypart=$local_updatetime->format('A');

$fx_update_date = $local_update_dow.", ".$local_update_day." ".$local_update_month." ".$local_update_year;
$fx_update_time = $local_update_time.$local_update_daypart." ".$local_update_TZ;

$current_dow = $currentdate->format('D');
$current_day = $currentdate->format('j');
$current_month = $currentdate->format('M');
$current_daypart = $currentdate->format('A');
$current_time = $currentdate->format('h:i');
$current_year = $currentdate->format('Y');
$current_TZ = $currentdate->format('T');

//echo "</font>";

?>


<body>

<!-- CONTENT -->
 <div class="contentpane">
 
<!-- TABS -->

<div id="tabs" style="font-family: Verdana, Arial; font-size: 70%; color: #FFFFFF; font-weight: normal;">
	<ul>
		<li><a href="#tabs-1" style="font-family: Verdana, Arial; font-size: 150%; color: #FFFFFF; font-weight: bold;">Earthquakes</a></li>
		<li><a href="#tabs-2" style="font-family: Verdana, Arial; font-size: 150%; color: #FFFFFF; font-weight: bold;">Hurricane Tracks</a></li>
		<li><a href="#tabs-3" onclick="return nwsAdd();this.onclick=null;" style="font-family: Verdana, Arial; font-size: 150%; color: #FFFFFF; font-weight: bold;">NWS Alerts</a></li>
		<li><a href="#tabs-4" onclick="return futAdd();this.onclick=null;"  style="font-family: Verdana, Arial; font-size: 150%; color: #FFFFFF; font-weight: bold;">Radar Map</a></li>
		<li><a href="#tabs-5" onclick="return stormAdd();this.onclick=null;" style="font-family: Verdana, Arial; font-size: 150%; color: #FFFFFF; font-weight: bold;">Storm Cells</a></li>
		<li><a href="#tabs-6" onclick="return postYourAdd();this.onclick=null;" style="font-family: Verdana, Arial; font-size: 150%; color: #FFFFFF; font-weight: bold;">Weather Maps</a></li>
		</ul>

	<div id="tabs-1"><IFRAME SRC="earthquakes/earthquakes.php?trial_ID=<?php echo $trial_ID; ?>&wid=<?php echo $wid; ?>&zip_code=<?php echo $zipcode; ?>&metric=<?php echo $metric; ?>" title="Earthquakes" scrolling="auto" height="800" width="100%" FRAMEBORDER=NO FRAMESPACING=0 BORDER=0></IFRAME></div>
	<div id="tabs-2"><IFRAME SRC="hurricane/index.php?trial_ID=<?php echo $trial_ID; ?>&wid=<?php echo $wid; ?>&zip_code=<?php echo $zipcode; ?>&metric=<?php echo $metric; ?>" title="Hurricane tracks" scrolling="auto" height="800" width="100%" FRAMEBORDER=NO FRAMESPACING=0 BORDER=0></IFRAME></div>
<div id="tabs-3"><IFRAME id="nwsreload" data-src="nws_alerts/nws_alerts.php?trial_ID=<?php echo $trial_ID; ?>&wid=<?php echo $wid; ?>&zip_code=<?php echo $zipcode; ?>&metric=<?php echo $metric; ?>" src="about:blank" title="Tides" scrolling="auto" height="800" width="100%" FRAMEBORDER=NO FRAMESPACING=0 BORDER=0></IFRAME></div>

	<div id="tabs-4"><IFRAME id="futurereload"  data-src="future_radar/animation_framework/latest.php?trial_ID=<?php echo $trial_ID; ?>&wid=<?php echo $wid; ?>&zip_code=<?php echo $zipcode; ?>&metric=<?php echo $metric; ?>" src="about:blank" title="Radar" scrolling="auto" height="800" width="100%" FRAMEBORDER=NO FRAMESPACING=0 BORDER=0></IFRAME></div>

	<div id="tabs-5"><IFRAME id="stormreload" data-src="stormtracks/storm_tracks.php?trial_ID=<?php echo $trial_ID; ?>&wid=<?php echo $wid; ?>&zip_code=<?php echo $zipcode; ?>&metric=<?php echo $metric; ?>" src="about:blank" title="Storm Cells" scrolling="auto" height="800" width="100%" FRAMEBORDER=NO FRAMESPACING=0 BORDER=0></IFRAME></div>
<div id="tabs-6"><IFRAME id="forPostyouradd" data-src="weather/maps_weather.php?trial_ID=<?php echo $trial_ID; ?>&wid=<?php echo $wid; ?>&zip_code=<?php echo $zipcode; ?>&metric=<?php echo $metric; ?>" src="about:blank" title="Weather Maps" scrolling="auto" height="800" width="100%" FRAMEBORDER=NO FRAMESPACING=0 BORDER=0></IFRAME></div>

</div>

   </td>
  </tr>
 </table>

</div>
</div>
</div>
<!-- END CONTENT -->
<script>
function postYourAdd() {
    var iframe = $("#forPostyouradd");
    iframe.attr("src", iframe.data("src")); 
}
function nwsAdd() {
    var iframe = $("#nwsreload");
    iframe.attr("src", iframe.data("src")); 
}

function stormAdd() {
    var iframe = $("#stormreload");
    iframe.attr("src", iframe.data("src")); 
}
function futAdd() {
    var iframe = $("#futurereload");
    iframe.attr("src", iframe.data("src")); 
}
</script>

<script type="text/javascript">

/* Since we specified manualStartup=true, tabber will not run after
   the onload event. Instead let's run it now, to prevent any delay
   while images load.
*/

tabberAutomatic(tabberOptions);

</script>

<!-- START FOOTER-->
<div id="footer_wrap">
 <div id="footer_left">
	<div class="moduletable">
<!--		<a href="JavaScript:window.close()" style="font-family: Verdana, Arial; font-size: 120%; color: #FFFFFF; font-weight: normal;">Close Window and return to main site</a> -->
		<div>Copyright &#169; <?php echo $year ?> CustomWeather. All Rights Reserved.</div>
	<div>		
 </div>
 <div id="footer_right">
 <!--
 <div class="moduletable">
 <div class="bannergroup">
 <div class="banneritem">
 <a href="http:///www.customweather.com/index.php?option=com_banners&amp;task=click&amp;bid=9" target="_blank">
 <img src="https://www.customweather.com/images/banners/myforecast_ad.gif" alt="Banner" /></a><div class="clr"></div>
 </div>
 </div>
 </div>

-->
 </div>
</div>
<!-- End Footer -->

</div>	
</div>

</div>
</div>	

  <!-- START: GOOGLE ANALYTICS -->

  <script src="https://www.google-analytics.com/urchin.js" type="text/javascript">
  </script>
  <script type="text/javascript">
  _uacct = "UA-1196941-3";
  urchinTracker();
  </script>

<!-- END: GOOGLE ANALYTICS -->
</body>
</html>

  <?php } }
 
for($a=1;$a<$n;$a++){
if($temp_ID[$a] == $trial_ID && $trial_status[$a] != "current"){ 
 
      ob_start();
      header("Location: trial_demo.php");
      ob_flush();
} } ?>
       	

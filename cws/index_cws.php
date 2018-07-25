<?php 
error_reporting(0);

#ORG: 2018-04-30
#VER: 2018-04-30

header('Cache-Control: no-cache, no-store, must-revalidate'); // HTTP 1.1.
header('Pragma: no-cache'); // HTTP 1.0.
header('Expires: 0'); // Proxies.

extract($_REQUEST, EXTR_PREFIX_ALL|EXTR_REFS, 'rvar');
global $rvar_wid;
global $rvar_tideLocationID;
global $rvar_product;
global $rvar_language;
global $rvar_metric;
global $rvar_page;
global $rvar_fn;
global $rvar_search;
global $rvar_color;
global $rvar_bgcolor;
global $rvar_link_color;
global $rvar_barcolor;
global $rvar_bar_text_color;
global $rvar_zip_code;
global $rvar_debug;
global $languages, $language, $translate, $debug;
global $rvar_trial_ID;
global $rvar_rtype;
global $rvar_profile;
global $username;
global $password;

include("../config.php");

$trial_ID = $rvar_trial_ID;

$rtype=$rvar_rtype;
$profile=$rvar_profile;
$tideLocationID=$rvar_tideLocationID;
$search=$rvar_search;
$wid=$rvar_wid;
$product=$rvar_product;
$metric=$rvar_metric;
$language=$rvar_language;
$page=$rvar_page;
$fn=$rvar_fn;
$color=$rvar_color;
$bgcolor=$rvar_bgcolor;
$link_color=$rvar_link_color;
$barcolor=$rvar_barcolor;
$bar_text_color=$rvar_bar_text_color;
$zipcode=$rvar_zip_code;

include("../lib/lang.php");
$translate=new translate("en-US",$browser_lan);
//$translate->getfile($browser_lan);
// echo $translate->create_filename($browser_lan);
$locale=$translate->locales($browser_lan);
setlocale(LC_TIME, $locale);


// DEFAULT for TESTING

$profile="all";

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

// Start content

?>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>Weather for your world</title>
<meta http-equiv="Content-Type" content="text/html; charset=us-ascii" />
<meta http-equiv='imagetoolbar' content='no' />
<link rel="stylesheet" href="lib/cw_demo.css" type="text/css">
<link rel="stylesheet" href="http://openlayers.org/en/v3.7.0/css/ol.css" type="text/css">
<link type="text/css" href="/CSS/demos/maptiles/jquery.ui.all.css" rel="stylesheet" />
<link type="text/css" href="/CSS/demos/maptiles/demos.css" rel="stylesheet" />

<script type="text/javascript" src="lib/QueryData.js"></script>
<script type="text/javascript" src="lib/moment.js"></script>
<script type="text/javascript" src="http://openlayers.org/en/v3.7.0/build/ol.js"></script>
<script type="text/javascript" src="lib/cw_demo.js" ></script>
<script type="text/javascript" src="/javascript/demos/jquery-1.4.2.js"></script>
<script type="text/javascript" src="/javascript/demos/jquery.ui.core.js"></script>
<script type="text/javascript" src="/javascript/demos/jquery.ui.widget.js"></script>
<script type="text/javascript" src="/javascript/demos/jquery.ui.accordion.js"/></script>
<script type="text/javascript" src="lib/raphael.js" charset="utf-8"></script>

  <script type="text/javascript">
	var levelLookup = {
	};
      model_update = function(data){
        meta=data.model_update;
      }

      cwslayers = function(data){
        cwsspec=data;
        for (var key in cwsspec) {
          if (cwsspec.hasOwnProperty(key)) {
            //   console.log(key + " -> " + cwsspec[key]);
          }
        }
      }
    </script>
 
    <script src="http://cws.customweather.com/xml?product=cwsmodel&callback=cwslayers&client=<?php echo $username; ?>&client_password=<?php echo $password; ?>&profile=<?php echo $profile; ?>" type="text/javascript"></script>
    <!--script src="cwslayers.js" type="text/javascript"></script-->
    <script src="lib/cwsLevelLookup.js" type="text/javascript"></script>
    <script src="http://live.customweather.com/xml?product=model_update&callback=model_update&model_update.full=true&client=bradburn&client_password=woll0BScre" type="text/javascript"></script>

<script src="lib/select.js" type="text/javascript"></script>

<script type="text/javascript">
$(function() {
$("#accordion").accordion({
autoHeight: false,
collapsible: true
});
});
</script>
</head>




<body onload="GetMap();">
<div id="header" hidden="true">
          <h2 id="cw_title_h2">CustomWeather CWS Model Demo</h2>
          <h3 id="cw_title_h3">Model Data</h3>
</div>
<div id="debug" style="position:absolute; bottom:0px; z-index: 24"></div>
  <div id="legendButtons">
    <button id="show" style="display:none;" onclick="toggleLegend(true);">&gt;&gt;</button>
    <button id="hide" onclick="toggleLegend(false);">&lt;&lt; Hide Menu</button>
	<!--
       <a onClick="document.cookie='cwUnit=metric;';window.location.reload()"><? echo $Settings->cwUnit . " units (<span class='button'>change</span>)"; ?></a>
       <a onClick="document.cookie='cwUnit=standard;';window.location.reload();"><? echo $Settings->cwUnit . " units (<span class='button'>change</span>)"; ?></a>
      -->
  </div> <!-- end legendButtons -->

  <!-- legend -->
  <div style="z-index: 200; position: fixed; top: 0px; right: 0px">
    <div id="palette"> </div>
  </div> <!-- close legend -->



  <!-- map-->
  <div id='myMap' style="width:auto; height:100%; min-width:340px; min-height:200px;">
        <div style="clear: both;"></div>

        <div id="controls" hidden="false" style="position:absolute; bottom:0px; z-index: 240">
          <input id="left" type="button" value="&lt;&lt;" onClick="left()"/>
          <input id="stop" type="button" value="&#61;" onClick="toggle()"/>
          <input id="right" type="button" value="&gt;&gt;" onClick="right()"/>
          <input id="slider" type="range" value="0" min="0" max="61" step="1"  onchange="sliderChange()" oninput="sliderInput()">
          <strong id="isodate"></strong>
        </div>
  </div> <!--end of map -->
	
  <div id="legend">
  <div id="demo-frame">
  <div class="demo">
  <div id="accordion">

	<h3><a href="#">CWS Animation Layers</a></h3>
	<div>
	   <div id=source_div" >
	  <label>Model:<select id="source_select">
	    <!--option value="select">select</option-->
	  </select></label><br>
	   </div>

	 
	   <div id=layer_div"   >
	  <label>Layer:<select id="layer_select">
	  </select></label><br>
           </div>

	   <div id=level_div"   >
	  <label>Level:<select id="level_select">
	  </select></label><br>
	   </div>

		<hr/>
          Opacity:<input id="opacity" type="range" value="75" min="0" max="100" step="1"  onchange="opacityChange()" oninput="opacityChange()"><br>
          Speed: <input id="speed" type="range" value="50" min="0" max="100" step="1"  onchange="speedChange()"><br>
		<hr/>
     		<label><input type="checkbox" checked="true" onclick="toggleMetric(this)" />Metric</label><br>

	   <div id=model_run_div">
	  <label>Model Run:
		<select id="model_run_select">
	  	</select></label><br>
         </div>
	</div>
	


</div><!-- end accordion -->
<font face ="verdana,arial" size="1"><br>You can choose multi-layers from each individual section or from multiple sections if you like.</font>
</div><!-- End demo -->
</div><!-- End dmeo_wrapper -->
</div><!-- End div legend -->


</body>
</html>

<?php include("../footer.php"); ?>

 <?php } }
 
for($a=1;$a<$n;$a++){
if($temp_ID[$a] == $trial_ID && $trial_status[$a] != "current"){ 
 
      ob_start();
      header("Location: ../trial_demo.php");
      ob_flush();
} } ?>



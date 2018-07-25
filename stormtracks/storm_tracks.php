<?php
#error_reporting(0);

# ORG: 2017-04-20
# VER: 2018-04-11

header('Cache-Control: no-cache, no-store, must-revalidate'); // HTTP 1.1.
header('Pragma: no-cache'); // HTTP 1.0.
header('Expires: 0'); // Proxies.
header("Refresh: 300;");

global $metric,$units;

extract($_REQUEST, EXTR_PREFIX_ALL|EXTR_REFS, 'rvar');

$trial_ID =$rvar_trial_ID;

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
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
    <title>Weather for your world</title>
    <meta http-equiv='imagetoolbar' content='no' />
    <style type="text/css">

    #map_canvas {
position: absolute;
top:0;
right:0;
left:340px;


width:auto;
height:640px;
}



.info-popup{
color:black;
}

.button {
    text-decoaration: underline;
    color: blue;
    cursor:pointer;
}

#palette {
    height: 500px;
    width:  700px;
    left:400px;
    top:  660px;
    z-index:5000;
    position: absolute;
}
#copy {
    bottom: 0;
    font: 300 .7em "Helvetica Neue", Helvetica, "Arial Unicode MS", Arial, sans-serif;
    position: absolute;
    right: 1em;
    text-align: right;
}
#copy a {
    color: #fff;
}
#storm-frame {
    float: left;
    width: 330px;
    height: 110px;
    border: 1px solid #ddd;
    overflow: auto;
    position: relative;
}
</style>


<meta http-equiv="Content-Type" content="text/html; charset=us-ascii" />

    <script type="text/javascript" src="http://maps.googleapis.com/maps/api/js"></script>
    <script type="text/javascript" src="nws_colors.js"></script>
    <script type="text/javascript" src="lib/raphael-full.js"></script>
    <script type="text/javascript" src="population.js"></script>
    <script type="text/javascript" src="zones.js"></script>
    <script type="text/javascript" src="isalert.js"></script>
  
    <?php echo "<script>var metric = '".$metric."';</script>"; ?>
    <link type="text/css" href="/CSS/demos/maptiles/jquery.ui.all.css" rel="stylesheet" />
    <link type="text/css" href="/CSS/demos/maptiles/demos.css" rel="stylesheet" />
    <script type="text/javascript" src="/javascript/demos/jquery-1.4.2.js"></script>
    <script type="text/javascript" src="/javascript/demos/jquery.ui.core.js"></script>
    <script type="text/javascript" src="/javascript/demos/jquery.ui.widget.js"></script>
    <script type="text/javascript" src="/javascript/demos/jquery.ui.accordion.js"></script>
    <script type="text/javascript">
    $(function() {
	    $("#accordion").accordion({
		autoHeight: false,
			collapsible: true
			});
	});
</script>
</head>
	      
<body onload="initialize();">
<div id='map_canvas' ></div>
<div id="palette"> </div>				    

<div id='legend'>
<div id="storm-frame">
<div class="demo">
<div id="accordion">
									    
<h3><a href="#">Storm Tracks</a></h3>
    <div>
    <p>
    <label><input type="checkbox" onclick="toggleLayer(this,'severe_warnings')" checked />Nexrad Storm Tracks<sup></sup></label><br>
    </p>
    <p>
    </p>
    </div>
    

</div><!-- end accordion -->
</div><!-- End demo -->
</div><!-- End dmeo-frame -->
</div><!-- End div legend -->

    <script type="text/javascript" src="storm_track.js"></script>

</body>
</html>


  <?php } }
 
for($a=1;$a<$n;$a++){
if($temp_ID[$a] == $trial_ID && $trial_status[$a] != "current"){ 
 
      ob_start();
      header("Location: ../trial_demo.php");
      ob_flush();
} } ?>
    

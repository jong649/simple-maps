<?php
#ORG: 2017-06-01
#VER: 2018-04-11

header('Content-type: text/html; charset=utf-8');
extract($_REQUEST, EXTR_PREFIX_ALL|EXTR_REFS, 'rvar');

$trial_ID=$rvar_trial_ID;

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
      header("Location: ../../../trial_expired.php");
      ob_flush();
}

if($trial_ID ==""){

      ob_start();
      header("Location: ../../../trial_unauthorized.php");
      ob_flush();
}
}


for($a=1;$a<$n;$a++){
if($temp_ID[$a] == $trial_ID && $trial_status[$a] == "current"){ 

// Start content

?>
<head>
<meta http-equiv="content-type" content="text/html; charset=UTF-8">
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="chrome=1">
<meta name="viewport" content="initial-scale=1.0, user-scalable=no, width="device-width">
<link rel="stylesheet" href="lib/bootstrap.css" type="text/css">
<link rel="stylesheet" href="lib/newlayout.css" type="text/css">
<link rel="stylesheet" href="lib/bootstrap-responsive.css" type="text/css">
<title>Radar Animation</title>
</head>
<body>

<div id="mainflow">

  <script src="lib/QueryData.js" type="text/javascript"></script>
  <script src="lib/jquery.js" type="text/javascript"></script>
  <script src="lib/model_update.js" type="text/javascript"></script>
  <script src="http://maps-beta.customweather.com/xml?product=model_update&source=hrrrsub3km&callback=model_update&client=templates&client_password=1nf0Wx!" type="text/javascript"></script>
  <script src="lib/futureradarnew.js" type="text/javascript"></script>
    <script type='text/javascript' src='https://www.bing.com/api/maps/mapcontrol?callback=GetMap&key=An_V-zl5WqQH2Sgd2OSaLDdHHN5zLsvB-diJvPXy6Btuh2OK1iTp9cmGaw882tWX' async defer></script>
<div id="myMap" style="position:relative;width:100%;height:600px;"></div>
    <br/>
<div id="controls">    <input type="button" value="Pause" onclick="animatedLayer.pause();"/>
    <input type="button" value="Play" onclick="animatedLayer.play();" />
    <input type="button" value="Stop" onclick="animatedLayer.stop();" /></div>
<div id="key">
	<div><strong>Rain</strong></div>
	<div><strong>Snow</strong></div>
	<div><strong>Mixed</strong></div>
</div>
<div id="palette" class="palette"/>
	<div id="legend" class="legend"/>
	<strong>Light<strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	<strong>Moderate<strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	<strong>Heavy<strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	<strong>Severe<strong>
	</div>
	<div id="palette0" class="palette0"/><img src="lib/legend.png"></img></div>
</div> <!-- end of palette -->
</div> <!-- end of mainflow-->
</body>
</html>

 <?php } }
 
for($a=1;$a<$n;$a++){
if($temp_ID[$a] == $trial_ID && $trial_status[$a] != "current"){ 
 
      ob_start();
      header("Location: ../../../trial_demo.php");
      ob_flush();
} } ?>


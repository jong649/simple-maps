<?php
#error_reporting(0);

#VER: 2017-05-24
#VER: 2018-04-16

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

$trial_ID = $rvar_trial_ID;

$rtype=$rvar_rtype;
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

// Check ID status

$filename="/prod/custom/Output/client_sites/CW/Templates_trial_status.txt";
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

session_start();

if(!empty($_GET['metric'])){
if($_GET['metric']=='true'){ //metric
$_SESSION['unit'] = 'metric';
}else{ //nonmetric
$_SESSION['unit'] = 'nonmetric';
}
}
else{
$_SESSION['unit'] = 'nonmetric';
}

?>
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
    <meta charset="utf-8">
    <title>CustomWeather Hurricane Tracks</title>
    <style>
      html, body, #map-canvas {
        height: 100%;
        margin: 0;
        padding: 0;
      }

    </style>
    <script src="lib/QueryData.js" type="text/javascript"></script>
    <script src="https://maps.googleapis.com/maps/api/js?v=3.exp&signed_in=true"></script>
   
  <script type="text/javascript">
      var meta;
      spaghetti_meta = function(data){
        meta=data;
        for (var key in meta) {
          if (meta.hasOwnProperty(key)) {
               //console.log(key + " -> " + meta[key]);
          }
        }
      }
    </script>
    <script>
var infos = [];
var ensemble = true;
function initialize() {
  var queryString = new QueryData();
  if('ensemble' in queryString){
        ensemble = queryString.ensemble=='true'; // force hrrr
  }

  var myLatlng = new google.maps.LatLng(39.6843428, -101.80808878);
  var mapOptions = {
    zoom: 4,
    center: myLatlng
  }

  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	//url: 'http://derecho.math.uwm.edu/models/archive/2015/ep09201l952015_2015080406_ens.kml5/al942015_2015073118.kml',
	//url: 'http://derecho.math.uwm.edu/models/archive/2015/ep092015/al942015_2015073118.kml',
 	//suppressInfoWindows: true,
 	//suppressInfoWindows: true,

  var activeVar = ensemble ? "ensemble" : "models";
  var al = meta[ensemble?"ensemble" : "models"];
  
  var indx=0;
  for(indx=0; indx<al.length; indx++){
	
	if(al[indx].startsWith('al')){

  	var georssLayer = new google.maps.KmlLayer({
		url: 'http://clients.customweather.com/demos/geoloc/spaghetti/data/' + al[indx] ,
       	 map: map,
       	 preserveViewport: true
  	});
  	georssLayer.setMap(map);
	}
}

/**
var marker = new google.maps.Marker({
      position: new google.maps.LatLng(29.732, -95.103),
      map: map,
      title: 'Deer Park - Dow Chemical'
});
*/

setMarkers(map);
}

google.maps.event.addDomListener(window, 'load', initialize);


function setMarkers(map){


	var locations = 
    [
        {
            "facabbr": "Corpus Christi",
            "city": "Corpus Christi",
            "isalert": false,
            "state_code": "TX",
            "longitude": -97.29,
            "latitude": 27.7,
			"id" : "30312",
			"trialid": "<?php echo $trial_ID; ?>"
        },
        {
            "facabbr": "Houston / Galviston",
            "city": "Houston / Galviston",
            "isalert": false,
            "state_code": "TX",
            "longitude": -95.08,
            "latitude": 29.46,
			"id" : "KHGX",
			"trialid": "<?php echo $trial_ID; ?>"
        },
        {
            "facabbr": "Brownsville - Brownsville / South Padre Island International Airport",
            "city": "Brownsville - Brownsville / South Padre Island International Airport",
            "isalert": false,
            "state_code": "TX",
            "longitude": -97.4231,
            "latitude": 25.9146,
			"id" : "KBRO",
			"trialid": "<?php echo $trial_ID; ?>"
        },
        {
            "facabbr": "New Orleans - New Orleans International Airport",
            "city": "New Orleans - New Orleans International Airport",
            "isalert": false,
            "state_code": "LA",
            "longitude": -90.258,
            "latitude": 29.9934,
			"id" : "KMSY",
			"trialid": "<?php echo $trial_ID; ?>"
        },
        {
            "facabbr": "Pensacola",
            "city": "Pensacola",
            "isalert": false,
            "state_code": "FL",
            "longitude": -87.18,
            "latitude": 30.44,
			"id" : "13383",
			"trialid": "<?php echo $trial_ID; ?>"
        },
        {
            "facabbr": "Tampa - Tampa International Airport",
            "city": "Tampa - Tampa International Airport",
            "isalert": false,
            "state_code": "FL",
            "longitude": -82.5332,
            "latitude": 27.9755,
			"id" : "KTPA",
			"trialid": "<?php echo $trial_ID; ?>"
        },
        {
            "facabbr": "Miami - Miami International Airport",
            "city": "Miami - Miami International Airporti",
            "isalert": false,
            "state_code": "FL",
            "longitude": -80.3169,
            "latitude": 25.788,
	    	"id": "KMIA",
			"trialid": "<?php echo $trial_ID; ?>"
        },
        {
            "facabbr": "Savannah - Savannah International Airport",
            "city": "Savannah - Savannah International Airport",
            "isalert": false,
            "state_code": "GA",
            "longitude": -81.2021,
            "latitude": 32.1276,
			"id" : "KSAV",
			"trialid": "<?php echo $trial_ID; ?>"
        },
          {
            "facabbr": "Charleston",
            "city": "Charleston",
            "isalert": false,
            "state_code": "SC",
            "longitude": -79.95,
            "latitude": 32.7556,
			"id" : "KCLX",
			"trialid": "<?php echo $trial_ID; ?>"
        },      
          {
            "facabbr": "Wilmington - New Hanover International Airport",
            "city": "Wilmington - New Hanover International Airport",
            "isalert": false,
            "state_code": "NC",
            "longitude": -77.9026,
            "latitude": 34.2706,
			"id" : "KILM",
			"trialid": "<?php echo $trial_ID; ?>"
        },                 
          {
            "facabbr": "Norfolk/Hampton",
            "city": "Norfolk/Hampton",
            "isalert": false,
            "state_code": "VA",
            "longitude": -76.45,
            "latitude": 36.78,
			"id" : "KPVG",
			"trialid": "<?php echo $trial_ID; ?>"
        }, 
          {
            "facabbr": "New York - Kennedy International Airport",
            "city": "New York - Kennedy International Airport",
            "isalert": false,
            "state_code": "NY",
            "longitude": -73.7789,
            "latitude": 40.6398,
			"id" : "KJFK",
			"trialid": "<?php echo $trial_ID; ?>"
        }, 
          {
            "facabbr": "Boston - Logan International Airport",
            "city": "Boston - Logan International Airport",
            "isalert": false,
            "state_code": "MA",
            "longitude": -71.0101,
            "latitude": 42.3611,
			"id" : "KBOS",
			"trialid": "<?php echo $trial_ID; ?>"
        } 
	];

    var marker, i

   var warnColor = "FF0000";
   //var clearColor = "3539FE";
	var clearColor = "";
	
    var warnImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + warnColor,
        new google.maps.Size(21, 34),
        new google.maps.Point(0,0),
        new google.maps.Point(10, 34));
  
  	var pinShadow = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_shadow",
		new google.maps.Size(40, 37),
		new google.maps.Point(0, 0),
		new google.maps.Point(12, 35));      
        
    var clearImage = new google.maps.MarkerImage("http://ecn.dev.virtualearth.net/mapcontrol/v7.0/7.0.20160525132934.57/i/poi_search.png" + clearColor,
        new google.maps.Size(21, 34),
        new google.maps.Point(0,0),
        new google.maps.Point(12, 35));

  for (i = 0; i < locations.length; i++)
    {

        var name = locations[i].facabbr;
        var _lat = locations[i].latitude;
        var _lon = locations[i].longitude;
        var _id = locations[i].id;
        var _trialid = locations[i].trialid;
        var alert =  locations[i].isalert;
        latlngset = new google.maps.LatLng(_lat, _lon);
        var marker = alert ?
        new google.maps.Marker({
                map: map,
                title: name ,
                position: latlngset,
                icon: warnImage,
                shadow: pinShadow               
        }) :
                new google.maps.Marker({
                map: map,
                title: name ,
                position: latlngset,
                icon: warnImage,
                shadow: pinShadow
        });
        map.setCenter(marker.getPosition())
	
        var content = '<div><p><b>Location: ' + name +  '</b></p></div>' +
            '<div><p>' + locations[i].city + ', '  + locations[i].state_code  + '</p></div>' +
	    '<div><a href="http://clients.customweather.com/templates/demo/current.php?trial_ID='+_trialid+'&wid='+_id+'&metric=false&language=en" target="_blank">'+
            'Weather Details</a></div>';
        var infowindow = new google.maps.InfoWindow()


        google.maps.event.addListener(marker,'click', (function(marker,content,infowindow){
            return function() {
                /* close the previous info-window */
                closeInfos();
                infowindow.setContent(content);
                infowindow.open(map,marker);
                /* keep the handle, in order to close it on next click event */
                infos[0]=infowindow;
            };
        })(marker,content,infowindow));

    }
}
function closeInfos(){
    if(infos.length > 0){
        /* detach the info-window from the marker ... undocumented in the API docs */
        infos[0].set("marker", null);
        /* and close it */
        infos[0].close();
        /* blank the array */
        infos.length = 0;
    }
}
</script>
</head>
<body>
<br/>
<input id="mapChange" type="button" value="View Official Track"onclick="window.location.href = 'spaghetti/spaghetti_tracks.php?trial_ID=<?php echo $trial_ID; ?>&metric=<?php echo $_SESSION['unit'];?>'"/>	
<br/>
<div id="map-canvas" ></div>
<div id="map-canvas1" style="display:none;">
<IFRAME SRC="spaghetti/spaghetti_tracks.php?trial_ID=<?php echo $trial_ID; ?>" title="Hurricane tracks" scrolling="auto" height="1000" width="100%" FRAMEBORDER=NO FRAMESPACING=0 BORDER=0></IFRAME>
</div>	
  <script src="http://live.customweather.com/xml?client=alex&client_password=trust_me&product=uwmkml&callback=spaghetti_meta" type="text/javascript"></script>
 <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>	
 <script>
function myfunction(){


var elem = document.getElementById("map-canvas");
if(elem.currentStyle) {
var displayStyle = elem.currentStyle.display;
}else if (window.getComputedStyle) {
var displayStyle = window.getComputedStyle(elem, null).getPropertyValue("display");
}

if(displayStyle === 'block'){
$('#map-canvas').hide();
$('#mapChange').html('View Spaghetti Track');
$('#map-canvas1').show();
}else{
$('#map-canvas').show();
$('#mapChange').html('View Official Track');
$('#map-canvas1').hide();
}


}
</script>
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

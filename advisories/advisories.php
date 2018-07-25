<?php 
error_reporting(0);

# ORG: 2017-05-24
# VER: 2018-04-11

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

include("../../lib/lang.php");
$translate=new translate("en-US",$browser_lan);
//$translate->getfile($browser_lan);
// echo $translate->create_filename($browser_lan);
$locale=$translate->locales($browser_lan);
setlocale(LC_TIME, $locale);

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
  
  <meta http-equiv='imagetoolbar' content='no' />
  <style type="text/css">
/*<![CDATA[*/
  v\:* {behavior:url(#default#VML);}
    #myMap { 
      position: absolute;
      top:0;
      right:0;
      left:340px;
    }
    #legendButtons {
      top: 0;
      left: 0;
      min-width:45px;
    }
    #legend { 
      position: absolute;
      top: 30px;
      left:0;
      min-height: 500px;
    }
    label {
      cursor: pointer;
    }
    li img {
      vertical-align: middle;
    }
    ul {
      list-style: none;
      border: 1px dashed #888;
    }
    img.legend {
      width: 267px;
      height: 32px;
      border: 1px solid #888;
    }
    .button {
    text-decoaration: underline;
    color: blue;
    cursor:pointer;
    }

/*]]>*/
  </style>
  <meta http-equiv="Content-Type" content="text/html; charset=us-ascii" />
  
<script src="https://www.bing.com/api/maps/mapcontrol"></script> 

  <script type="text/javascript">
//<![CDATA[
var map = null;
var tileLayer = new Array();
var shapeLayer = new Array();
var newlat= 37.77;
var newlon=-102.42;
function parseCW_Advisories (xmlDoc) {
	 var html = new Array();

		  for(var i=0; i<xmlDoc.getElementsByTagName('item').length;i++) {
		    try { var lat = xmlDoc.getElementsByTagName('item')[i].getElementsByTagName('geo:lat')[0].childNodes[0].nodeValue; } catch (e) { var lat = xmlDoc.getElementsByTagName('item')[i].getElementsByTagName('lat')[0].childNodes[0].nodeValue; }
		    try { var long = xmlDoc.getElementsByTagName('item')[i].getElementsByTagName('geo:long')[0].childNodes[0].nodeValue; } catch (e) { var long = xmlDoc.getElementsByTagName('item')[i].getElementsByTagName('long')[0].childNodes[0].nodeValue; }
		    var iconUrl = xmlDoc.getElementsByTagName('item')[i].getElementsByTagName('icon')[0].childNodes[0].nodeValue;
		    var title = xmlDoc.getElementsByTagName('item')[i].getElementsByTagName('title')[0].childNodes[0].nodeValue;
		    try {var desc = xmlDoc.getElementsByTagName('item')[i].getElementsByTagName('description')[0].getElementsByTagName('cw:note')[0].childNodes[0].nodeValue;} catch (e) { var desc = xmlDoc.getElementsByTagName('item')[i].getElementsByTagName('description')[0].getElementsByTagName('note')[0].childNodes[0].nodeValue;}

		    var data = new Object();
		       data.html  = "<span style='font-size: 14px; font-weight: bold'>" + title + "</span>";
		       data.html += "<br />" + "Latitude: " + lat + "<br />Longitude: " + long + "<br />" + desc + ".";

		       data.lat = lat;
		       data.long = long;
		       data.icon = iconUrl;
		       data.title = title;

		       html[i]=data;
		   }
		  return html;
}

function parseCW_Hurricane (xmlDoc) {
	 	  var points = new Array();
		  var cone_shapes = new Array();
		  var line_shapes  = new Array();

	          var x = 0; var y = 0; var z = 0;
		  for(var i=0; i<xmlDoc.getElementsByTagName('item').length;i++) {
		       var item = xmlDoc.getElementsByTagName('item')[i];

		       // POINT ARRAY
		       if(item.getElementsByTagName('georss:point')[0] || item.getElementsByTagName('point')[0]) {
		       		try { var point = item.getElementsByTagName('point')[0].childNodes[0].nodeValue; } catch (e) { var point = item.getElementsByTagName('georss:point')[0].childNodes[0].nodeValue; }

				var iconUrl = item.getElementsByTagName('icon')[0].childNodes[0].nodeValue;
		       		var desc = item.getElementsByTagName('description')[0].childNodes[0].nodeValue;
		       		var title = item.getElementsByTagName('title')[0].childNodes[0].nodeValue;

		       		var peg = point.split(" ");
		       		var lat = peg[0];
		       		var long = peg[1];

		       		var data = new Object();
		       		data.html = title + "<br />" +  desc;

		       		data.lat = lat;
		       		data.long = long;
		       		data.icon = iconUrl;
		       		data.title = title;

		       		points[x]=data;
		       		x++;
		       }

			// POLYGON - CONE
		       if(item.getElementsByTagName('georss:polygon')[0] || item.getElementsByTagName('polygon')[0] ) {			 
		               if (item.getElementsByTagName('polygon')[0]) { var plots = item.getElementsByTagName('polygon')[0]}
			       else { var plots = item.getElementsByTagName('georss:polygon')[0];}

			       var pnts = "";
			       for(var j=0;j<plots.childNodes.length;j++) {
			       	       pnts += plots.childNodes[j].nodeValue;
			       }

			       var cones = new Array();
			       var xx = 0;
			       var pnt = pnts.split("\n");
			       var length = pnt.length;			       
			       for(var zz=0;zz<length;zz++){			       	       
			       	       if(pnt[zz]) {
			     	       		    var pt = pnt[zz].split(" ");
		             			    var lat = pt[0];
		             			    var long = pt[1];
			     			    cones[xx] = new Microsoft.Maps.Location(lat,long);						    
						    xx = xx+1;
					}
			  	}
			     	var pt = pnt[1].split(" ");
		             	var lat = pt[0];
		             	var long = pt[1];
			     	cones[xx] = new Microsoft.Maps.Location(lat,long);						    
				cone_shapes[y] = cones;
				y++;
			 }

		       // LINE ARRAY
		       if(item.getElementsByTagName('georss:line')[0] || item.getElementsByTagName('line')[0] ) {

		         if (item.getElementsByTagName('line')[0]) { var plots = item.getElementsByTagName('line')[0]}
			 else { var plots = item.getElementsByTagName('georss:line')[0];}

		         var line = new Array();
			 var plot = plots.childNodes[0].nodeValue;

			 var point = plot.split(" ");
			 var length = point.length;
			 var zz = 0;
			 var xx= 0;
			 var lines = new Array();
			     while((xx+2)<length){
			        if(point[xx]) {
				var lat = point[xx];
		         	var long = point[xx+1];
				lines[zz] = new Object();				
			     	lines[zz] = new Microsoft.Maps.Location(lat,long);
				xx = xx+2;
				zz = zz+1;
				}
			     }
			     line_shapes[z] = lines;
			     z++
			 }
			 //item loop	
		   }		

		   var data = new Object();
		   data.point = points;
		   data.cone = cone_shapes;
		   data.line = line_shapes;
		   return data;
}

function parserXML (xml) {
	 if(window.DOMParser) {
	      var parser = new DOMParser();
	      xmlDoc = parser.parseFromString(xml,"text/xml");
	      return xmlDoc;
 	 } else {
	      var doc=new ActiveXObject("Microsoft.XMLDOM");
	      doc.async="false";
	      doc.loadXML(xml); 
	      return doc;
         }
}

function getGEORSS(url, callback) {
    if (window.XMLHttpRequest) { var xttp=new XMLHttpRequest();}
    else {var xttp=new ActiveXObject("Microsoft.XMLHTTP"); }

    xttp.onreadystatechange=function() {
        if (xttp.readyState==4) {	    
	    if(xttp.responseText) {	    	      
		  xmlDoc=parserXML(xttp.responseText);
		  callback(xmlDoc);
	    }
	}
    }
    xttp.open("GET", "/demos/maptiles/layer_info/xmlFEED.php"+url);
    xttp.send();
}

var pins = new Array();
function DisplayLoc(e){
    if (e.targetType == 'pushpin'){
        var id = e.target.getZIndex();
	    pins[id].box.setOptions({ visible:true });

	    pins[id].box.setHtmlContent("<div style='z-index: 3000; position: relative; left: 24px; top: -55px; background-color: #FFF; padding: 10px; border: 3px solid #EEEEEE; width: 220px; min-height: 100px'>" +
	    "<div style='position:absolute; left: -20px; width:0px; height:0px; border-bottom:15px solid transparent; border-top:15px solid transparent; border-right:20px solid #FFF; font-size:0px; line-height:0px;'></div>"+
	    "<div style='position: relative; width: 200px; min-height: 100px;'>	           "+pins[id].html+"</div></div>");

    }
}

function HideLoc(e){
    if (e.targetType == 'pushpin'){
        var id = e.target.getZIndex();
            pins[id].box.setOptions({ visible:false });
	    pins[id].box.setHtmlContent("");
    }
}

function GetMap(newlat,newlon) {
  map = new Microsoft.Maps.Map('#myMap', {credentials: 'An_V-zl5WqQH2Sgd2OSaLDdHHN5zLsvB-diJvPXy6Btuh2OK1iTp9cmGaw882tWX',mapTypeId: Microsoft.Maps.MapTypeId.road,maxZoom: 15,center: new Microsoft.Maps.Location(newlat,newlon),zoom: 4,showDashboard: false});

 mapinfobox  = new Microsoft.Maps.Infobox( map.getCenter(), {
            maxHeight:300,
            visible: false
        });  
mapinfobox.setMap(map); 
  shapeLayer['global_obs_ext'] = new Object();
  shapeLayer['global_obs_ext'].Show = function () {		
            var callback = function (vertices) {
		  html = parseCW_Advisories(vertices);
                  for(var i=0;i<html.length;i++) {
  		   var h=html[i];
		   var location = new Microsoft.Maps.Location(h.lat,h.long);
		   var point = new Microsoft.Maps.Point(4,34);

		   var pin = new Microsoft.Maps.Pushpin(location, {icon:h.icon, width:20, height:20, zIndex: i, anchor: point});
		   var options = {width: 300, height: 200, visible: true, zIndex: 3000, offset:new Microsoft.Maps.Point(10,0), showPointer: true, showCloseButton:true};		   
 pin.metadata = {
                description: h.html
            };
		   //pins[i] = new Object();
		   //pins[i].html = h.html;
		   //pins[i].box = new Microsoft.Maps.Infobox(location,options);
 		   Microsoft.Maps.Events.addHandler(pin, 'mouseout', mouseoutmapEvent);
                   Microsoft.Maps.Events.addHandler(pin, 'mouseover',mouseovermapEvent);

  		   map.entities.push(pin);	  
		   //map.entities.push(pins[i].box);	  	
		   //pins[i].box.setOptions({ visible:false });
                   //pins[i].box.setHtmlContent("");    		      
		  }
	    }
            getGEORSS("?client=tile_demo2&apikey=zr_FX9XukUgZetYI9JIINzkhlcktJjS3yqEV3rKXuGFiNCDT1gtcCGKuFkc1jQzl&product=global_obs_ext&xml.return_all_records=true&format=georss&category=fmglobal", callback);
  }


  shapeLayer['hurricane'] = new Object();
  shapeLayer['hurricane'].Show = function () {
            var callback = function (vertices) {
		  var data = parseCW_Hurricane(vertices);
		  var points = data.point;
		  var cones = data.cone;		  
		  var lines = data.line;		  

		  shapeLayer['hurricane'].cone = new Array();
		  for(var i=0;i<cones.length;i++) { 		  		  	  
              	  	 var polygoncolor = new Microsoft.Maps.Color(100,100,0,100);
              		 var cone_shape = new Microsoft.Maps.Polygon(cones[i],{fillColor: polygoncolor, strokeColor: polygoncolor});			 
			 shapeLayer['hurricane'].cone[i] = cone_shape;
			 map.entities.push(cone_shape);
		  }
	 	  
		  shapeLayer['hurricane'].line = new Array();
		  for(var x=0;x<lines.length;x++) {
		  	  var polygoncolor = new Microsoft.Maps.Color(100,100,0,100);
              		  var poly = new Microsoft.Maps.Polyline(lines[x],{fillColor: polygoncolor, strokeColor: polygoncolor});
	      	  	  shapeLayer['hurricane'].line[i] = poly;
                  	  map.entities.push(poly);
	          }

	 	  var polygons = new Array();
                  for(var i=0;i<points.length;i++) {
  		  	  var h=points[i];
		  	  var location = new Microsoft.Maps.Location(h.lat,h.long);
		  	  polygons.push(location);

		  	  var pin = new Microsoft.Maps.Pushpin(location, {icon:h.icon, zIndex: i, width: 25, height:25, anchor: new Microsoft.Maps.Point(12,12) });
			  var options = {width: 300, height: 200, visible: true, zIndex: (points.length+1000), offset:new Microsoft.Maps.Point(0,-24), showPointer: true, showCloseButton:true};

		  	  pins[i] = new Object();
		  	  pins[i].html = h.html;
		  	  pins[i].box = new Microsoft.Maps.Infobox(location,options);
		 	  Microsoft.Maps.Events.addHandler(pin, 'mouseover', DisplayLoc);
		  	  Microsoft.Maps.Events.addHandler(pin, 'mouseout', HideLoc);
  	
			map.entities.push(pin);
  		  	map.entities.push(pins[i].box);
		  	pins[i].box.setOptions({ visible:false });
                  	pins[i].box.setHtmlContent("");  		      	
		  }		  	      

	      //center map on cone
	      var h=points[i-1];
	      var location = new Microsoft.Maps.Location(h.lat,h.long);
	      map.setView({zoom:5, center: location});
	    }
	    var url = "?product=hurricane&client=tile_demo2&apikey=zr_FX9XukUgZetYI9JIINzkhlcktJjS3yqEV3rKXuGFiNCDT1gtcCGKuFkc1jQzl&format=georss&metric=false";
            getGEORSS(url, callback);
  }

  shapeLayer['cw_advisories'] = new Object();
  shapeLayer['cw_advisories'].Show = function () {
            var callback = function (vertices) {
		  html = parseCW_Advisories(vertices);
                  for(var i=0;i<html.length;i++) {
  		  var h=html[i];
		  var location = new Microsoft.Maps.Location(h.lat,h.long);
		  var point = new Microsoft.Maps.Point(4,34);

		  var cwpin = new Microsoft.Maps.Pushpin(location, {icon:h.icon, width:20, height:20, zIndex: i, anchor: point});
		  var options = {width: 300, height: 200, visible: true, zIndex: 3000, offset:new Microsoft.Maps.Point(10,0), showPointer: true, showCloseButton:true};
 cwpin.metadata = {
                description: h.html
            };

		  //pins[i] = new Object();
		  //pins[i].html = h.html;
		  //pins[i].box = new Microsoft.Maps.Infobox(location,options);
 		   Microsoft.Maps.Events.addHandler(cwpin, 'mouseout', mouseoutmapEvent);
                   Microsoft.Maps.Events.addHandler(cwpin, 'mouseover',mouseovermapEvent);

  		  map.entities.push(cwpin);	  
		 // map.entities.push(pins[i].box);	  	
		  //pins[i].box.setOptions({ visible:false });
                  //pins[i].box.setHtmlContent("");    		      		  
		  }
	    }
	      getGEORSS("?client=tile_demo2&apikey=zr_FX9XukUgZetYI9JIINzkhlcktJjS3yqEV3rKXuGFiNCDT1gtcCGKuFkc1jQzl&product=cw_advisories&xml.return_all_records=true&format=georss&category=fmglobal", callback);
  }
  return map;
}

function mouseovermapEvent(e) {
        //Make sure the infobox has metadata to display.
        if (e.target.metadata) {
            //Set the infobox options with the metadata of the pushpin.
            mapinfobox.setOptions({
                location: e.target.getLocation(),
                description: e.target.metadata.description,
                visible: true
            });
        }
    } 

function mouseoutmapEvent(e) {
        mapinfobox.setOptions({ visible: false });
    }

function AddLayer(product) {
   if (product == "global_obs_ext") {
    map.entities.clear();
    shapeLayer[product].Show();
  } else if (product == "cw_advisories") {
    map.entities.clear();
    shapeLayer[product].Show();    
  } else if (product == "hurricane") {
    map.entities.clear();
    shapeLayer[product].Show();    
  } else {

  var tileSourceUrl = new Microsoft.Maps.TileSource({uriConstructor:"http://maps-beta.customweather.com/cw_tiles/zr_FX9XukUgZetYI9JIINzkhlcktJjS3yqEV3rKXuGFiNCDT1gtcCGKuFkc1jQzl/"+product+"/{quadkey}.png"});
  var tileLayer= new Microsoft.Maps.TileLayer({ mercator:tileSourceUrl, opacity:0.65 });
  map.layers.insert(tileLayer);
  return false;
  }
}

function RemoveLayer(product) {
  if (product == "global_obs_ext") {
    map.entities.clear();
  } else if (product == "cw_advisories") {
    map.entities.clear();
  } else if (product == "hurricane") {
    map.entities.clear();
  } else {
    GetMap(newlat,newlon);
  }
}

function toggleLayer(checkbox, product) {
  if (checkbox.checked) {
    AddLayer(product);
  } else {
    RemoveLayer(product);
    hideLegend();
  }
}

function toggleLegend(isHidden) {
  var legend = document.getElementById('legend');
  var myMap = document.getElementById('myMap');
  var show = document.getElementById('show');
  var hide = document.getElementById('hide');
  if (isHidden) {
    legend.style.display = 'inline';
    legend.style.minWidth = '300';
    myMap.style.left = '360px';
    show.style.display = 'none';
    hide.style.display = 'inline';
  } else {
    legend.style.display = 'none';
    legend.style.minWidth = '0';
    myMap.style.left = '45px';
    show.style.display = 'inline';
    hide.style.display = 'none';
  }
}

//]]>
  </script>
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
	<script type="text/javascript">

	  function drawList () {
	  var arrayL = new Array();
	  arrayL[0] = new Array();
	  arrayL[0]['lang'] = "Cooling Degree Days";
	  arrayL[0]['layer'] = "cdd_day_e_0";
	  arrayL[0]['scaleType'] = "";
	  arrayL[1] = new Array();
	  arrayL[1]['lang'] = "Cloud Cover (Total)";
	  arrayL[1]['layer'] = "cloudtotal_day_e_0";
	  arrayL[1]['scaleType'] = "";
	  arrayL[2] = new Array();
	  arrayL[2]['lang'] = "Growing Degree Days";
	  arrayL[2]['layer'] = "gdd_day_e_0";
	  arrayL[2]['scaleType'] = "";	  
	  arrayL[3] = new Array();
	  arrayL[3]['lang'] = "Heating Degree Days";
	  arrayL[3]['layer'] = "hdd_day_e_0";
	  arrayL[3]['scaleType'] = "";
	  arrayL[4] = new Array();
	  arrayL[4]['lang'] = "Ice Accumulation (Daily)";
	  arrayL[4]['layer'] = "icefall_day_e_0";
	  arrayL[4]['scaleType'] = "";
	  arrayL[5] = new Array();
	  arrayL[5]['lang'] = "Rainfall (7-Day Accumulated  Total)";
	  arrayL[5]['layer'] = "rainfall_cum_day_e_6";
	  arrayL[5]['scaleType'] = "";
	  arrayL[6] = new Array();
	  arrayL[6]['lang'] = "Rainfall (Daily Totals)";
	  arrayL[6]['layer'] = "rainfall_day_e_0";
	  arrayL[6]['scaleType'] = "";	
	  arrayL[7] = new Array();
	  arrayL[7]['lang'] = "Relative Humidity";
	  arrayL[7]['layer'] = "2m_relative_humidity_day_e_0";
	  arrayL[7]['scaleType'] = "";
	  arrayL[8] = new Array();
	  arrayL[8]['lang'] = "Snowfall (7-Day Accumulated Total)";
	  arrayL[8]['layer'] = "snowfall_cum_day_e_6";
	  arrayL[8]['scaleType'] = "";
	  arrayL[9] = new Array();
	  arrayL[9]['lang'] = "Snowfall (Daily Totals)";
	  arrayL[9]['layer'] = "snowfall_day_e_0";
	  arrayL[9]['scaleType'] = "";
	  arrayL[10] = new Array();	  
	  arrayL[10]['lang'] = "Soil Moisture (0-10cm)";
	  arrayL[10]['layer'] = "soil_moisture_0_10_day_e_0";
	  arrayL[10]['scaleType'] = "";
	  arrayL[11] = new Array();
	  arrayL[11]['lang'] = "Soil Moisture (10-40cm)";
	  arrayL[11]['layer'] = "soil_moisture_10_40_day_e_0";
	  arrayL[11]['scaleType'] = "";
	  arrayL[12] = new Array();
	  arrayL[12]['lang'] = "Storm Potential (Surface CAPE)";
	  arrayL[12]['layer'] = "capesfc_day_e_0";
	  arrayL[12]['scaleType'] = "";
	  arrayL[13] = new Array();
	  arrayL[13]['lang'] = "Temperature (Dewpoint)";
	  arrayL[13]['layer'] = "2m_dewpoint_day_e_0";
	  arrayL[13]['scaleType'] = "";
	  arrayL[14] = new Array();
	  arrayL[14]['lang'] = "Temperature (Maximum)";
	  arrayL[14]['layer'] = "maxtemp_day_e_0";
	  arrayL[14]['scaleType'] = "";
	  arrayL[15] = new Array();	
	  arrayL[15]['lang'] = "Temperature (Mean)";
	  arrayL[15]['layer'] = "meantemp_day_e_0";
	  arrayL[15]['scaleType'] = "";
	  arrayL[16] = new Array();	      
	  arrayL[16]['lang'] = "Temperature (Minimum)";
	  arrayL[16]['layer'] = "mintemp_day_e_0";
	  arrayL[16]['scaleType'] = "";
	  arrayL[17] = new Array();
	  arrayL[17]['lang'] = "Temperature (Mean Departure +)";
	  arrayL[17]['layer'] = "meantemp_dep_e_0";
	  arrayL[17]['scaleType'] = "";
	  arrayL[18] = new Array();
	  arrayL[18]['lang'] = "Windspeed (Average Daily @ 10m)";
	  arrayL[18]['layer'] = "wind_day_e_0";
	  arrayL[18]['scaleType'] = "";
	  arrayL[19] = new Array();
	  arrayL[19]['lang'] = "Windspeed (Maximum Daily @ 10m)";
	  arrayL[19]['layer'] = "max_wind_day_e_0";
	  arrayL[19]['scaleType'] = "";

     var html = "";
	  for (var z=0;z<arrayL.length;z++) {
					    var lang = arrayL[z]['lang'];
					    html += "<label><input type='checkbox' onclick='"+ ("toggleLayer(this,\"" + (arrayL[z]['layer']) + "\"); if(this.checked){loadLegend(\"" + (arrayL[z]['layer']) + "\",\"\",\"\",metric);") +"} else { hideLegend(); }' />"+(lang)+"</label><br>";
					    }
					    return html;
					    }
					  
	</script>
</head>

<body onload="GetMap(newlat,newlon);">
<div id="debug" style="position:absolute; bottom:0px; z-index: 24"></div>
  <div id="legendButtons">
    <button id="show" style="display:none;" onclick="toggleLegend(true);">&gt;&gt;</button>
    <button id="hide" onclick="toggleLegend(false);">&lt;&lt; Hide Menu</button>

  </div>
  
  <div style="z-index: 200; position: fixed; top: 0px; right: 0px">
    <div style='position:absolute; right: 0px'>
      <script type="text/javascript" src="../layer_info/js/cwLegend.js"></script>
    </div>
  </div>
  
  <div id='myMap' style="width:auto; height:100%; min-width:340px; min-height:200px;"></div>

  <div id='legend'>

<div id="demo-frame">

<div class="demo">

<div id="accordion">
	<h3><a href="#">Satellite & Lightning</a></h3>
	<div>
		<p>
	      	<label><input type="checkbox" onclick="toggleLayer(this,'global_ir_satellite_10km')" />IR satellite</label><br>
    	  	<label><input type="checkbox" onclick="toggleLayer(this,'smooth_satellite')" />Visible satellite</label><br>      
      		<!--<label><input type="checkbox" onclick="toggleLayer(this,'radar_ex')" />United States Radar </label><br>-->
      		<label><input type="checkbox" onclick="toggleLayer(this,'lightning')" />Lightning Strikes</label><br>
  		</p>
			<p>
				Layers are current.<br>Lightning strikes are for North America only.</font><BR>
		</p>
<P>
<img src="legend_lightning.gif">	
	</div>
	<h3><a href="#">Observations and Advisories</a></h3>
	<div>
		<p>
       		<label><input type="checkbox" onclick="toggleLayer(this,'global_obs_ext')" />Global Weather Observations</label><br>
   		    <label><input type="checkbox" onclick="toggleLayer(this,'cw_advisories')" />CustomWeather Advisories</label><br>
 <!--
      		<label><input type="checkbox" onclick="toggleLayer(this,'hurricane')" />Active Hurricanes </label><br>
      		<label><input type="checkbox" onclick="toggleLayer(this,'lightning')" />Lightning Strikes</label><br>
      		<label><input type="checkbox" onclick="toggleLayer(this,'nws_alerts')" />NWS Alerts<sup>*</sup></label><br>

      		<label><input type="checkbox" onclick="toggleLayer(this,'severe_warnings')" />NWS Severe Warnings<sup>*</sup></label><br>
      		<label><input type="checkbox" onclick="toggleLayer(this,'severe_watches')" />NWS Severe Watches<sup>*</sup></label><br>  	
		</p>
		<p>
		<font color="red">* NWS Alerts (watches and warnings) are for the United States only.<br>Lightning strikes are for North America only.</font><BR>
		Layers are current.
--!>
			<p>
				Please be patient as the CW advisories load. 
		</p>
		</p>
	</div>

	<h3><a href="#">Current Conditions</a></h3>
	<div>
	      <label><input type="checkbox" onclick="toggleLayer(this,'synoptic_dewpoint'); if(this.checked){loadLegend('2m_dewpoint_day_e_0', 'Current Dewpoint Temperatures','synoptic_dewpoint', metric);}" />Dewpoint Tempatures</label><br>
          <label><input type="checkbox" onclick="toggleLayer(this,'synoptic_humidity'); if(this.checked){loadLegend('2m_relative_humidity_day_e_0', 'Current Humidity','synoptic_humidity', metric);}" />Relative Humidity</label><br>
		  <label><input type="checkbox" onclick="toggleLayer(this,'synoptic_temp'); if(this.checked){loadGradientLegend('mean', 'Current Temperatures', 'synoptic_temp', metric);}" />Temperatures</label><br>
          <label><input type="checkbox" onclick="toggleLayer(this,'synoptic_wind'); if(this.checked){loadLegend('wind_day_e_0', 'Current Windspeed','synoptic_wind', metric);}" />Windspeed</label><br>
		<!--  <label><input type="checkbox" onclick="toggleLayer(this,'synoptic_synoptic_percip6hr'); if(this.checked){loadLegend('rainfall_day_e_0', 'Past 6-Hour Perciptitation', '', metric);}" />Past 6-Hour Preciptiation</label><br> -->


		<p>
		Layers are based on the most currently available data.
		</p>
	</div>

<!--

	<h3><a href="#">Global Forecast System (GFS)</a></h3>
	<div>	  	  
	  <script>
	    var list = drawList();
	    document.write(list);
	  </script>
		<p>
		Data resolution: 0.5 x 0.5 degrees, based on UTC.<BR>
		Layers are current.<BR>
		CAPE = Convective Available Potential Energy<BR>
		<sup>+</sup> Climate mean: 1981-2009
		</p>
	</div>

	<h3><a href="#">Global Data Assimilation System (GDAS)</a></h3>
	<div>
		<p>
        	<label><input type="checkbox" onclick="toggleLayer(this,'global_sst_day_m_0')" />Sea Surface Temperature</label><br>
		</p>
		<p>
		Data resolution: 1x1 degrees, based on UTC.<BR>
		Layers are not current.
		</p>
	</div>

	<h3><a href="#">National Digital Forecast Database (NDFD)*</a></h3>
	<div>
		<p>
        	<label><input type="checkbox" onclick="toggleLayer(this,'ndfd_maxtemp_day1')" />Maximum Temperature</label><br>
      		<label><input type="checkbox" onclick="toggleLayer(this,'ndfd_mintemp_day1')" />Minimum Temperature</label><br>
      		<label><input type="checkbox" onclick="toggleLayer(this,'ndfd_maxwindspeed_day1')" />Maximum Windspeed</label><br>
     		<label><input type="checkbox" onclick="toggleLayer(this,'ndfd_rainfall_day1')" />Rainfall</label><br>
		</p>
		<p>
		<font color="red">*NDFD layers are for the United States only.</font><BR>
		Data resolution: 5km x 5km.<BR>
		Layers are not current.
		</p>
	</div>

	<h3><a href="#">Miscellaneous</a></h3>
	<div>
		<p>
      		<label><input type="checkbox" onclick="toggleLayer(this,'base')" />Global High Resolution Basemap</label><br>
      		<label><input type="checkbox" onclick="toggleLayer(this,'counties')" />USA County borders</label><br>
		</p>
	</div>
-->


</div><!-- end accordion -->
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

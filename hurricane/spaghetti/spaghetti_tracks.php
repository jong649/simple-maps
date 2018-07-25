<?php
error_reporting(0);

# VER: 2017-05-24
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
      max-width:350px;
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

#controls{
width: 400px;
background-color: #FFF8DC;
width: 416px;
margin-left: auto;
margin-right: auto;
position: relative;
top: -42px;
border: 3px solid #FFF8DC;
z-index: 9999;

	}	
/*]]>*/
  </style>
  <meta http-equiv="Content-Type" content="text/html; charset=us-ascii" />
  
<script src="https://www.bing.com/api/maps/mapcontrol"></script> 
  <script type="text/javascript">






//<![CDATA[
var map = null;
var satmap = null;
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
		    data.html += "</br>" + "Latitude: " + lat + "</br>Longitude: " + long + "</br>" + desc + ".";

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

				var arr 	= 	desc;
				var sparr 	= 	arr.split("<br>");
				var type 	= 	sparr[0].split(":");
				var datesec 	= 	sparr[1].split(":");
				var categorysec	=	sparr[2].split(":");
				var ws 		= 	sparr[3].split(":");
				var a 		= 	parseFloat(ws[1]);
				var windspeed 	=	Math.round(a);	
				var wg 		= 	sparr[4].split(":");
				var b 		= 	parseFloat(wg[1]);
				var windgust 	=	Math.round(b);
				var latsec 	= 	sparr[5].split(":");
				var longsec 	= 	sparr[6].split(":");
				var bp 		= 	sparr[7].split(":");
				var c 		= 	parseFloat(bp[1]);
				var bpr 	=	(c).toFixed(2);

 var sessionval = '<?php echo $_SESSION['unit'];  ?>';	
		
	   
	    if(sessionval == ''){  // nonmetric

var newarr = " "+type[0]+": "+type[1]+"<br> "+datesec[0]+" : "+datesec[1]+":"+datesec[2]+" <br> "+ categorysec[0] +": "+ categorysec[1] +" <br> "+ws[0]+" : "+windspeed+" mph<br> "+wg[0]+" : "+windgust+" mph<br> "+latsec[0]+": "+latsec[1]+" <br> "+longsec[0]+": "+longsec[1]+"<br> "+bp[0]+": "+bpr+" in";

}else if(sessionval ==  'nonmetric'){ //nonmetric

var newarr = " "+type[0]+": "+type[1]+"<br> "+datesec[0]+" : "+datesec[1]+":"+datesec[2]+" <br> "+ categorysec[0] +": "+ categorysec[1] +" <br> "+ws[0]+" : "+windspeed+" mph<br> "+wg[0]+" : "+windgust+" mph<br> "+latsec[0]+": "+latsec[1]+" <br> "+longsec[0]+": "+longsec[1]+"<br> "+bp[0]+": "+bpr+" in";

}else{ //metric

var newarr = " "+type[0]+": "+type[1]+"<br> "+datesec[0]+" : "+datesec[1]+":"+datesec[2]+" <br> "+ categorysec[0] +": "+ categorysec[1] +" <br> "+ws[0]+" : "+windspeed+" km/h<br> "+wg[0]+" : "+windgust+" km/h<br> "+latsec[0]+": "+latsec[1]+" <br> "+longsec[0]+": "+longsec[1]+"<br> "+bp[0]+": "+bpr+" mb";

}
				var desc = newarr;
		
		       		var peg = point.split(" ");
		       		var lat = peg[0];
		       		var long = peg[1];
		       		var data = new Object();
		       		data.html = title + "</br>" +  desc;
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

	    pins[id].box.setHtmlContent("<div style='z-index: 3000; position: relative; left: 24px; top: -55px; background-color: #FFF; padding: 10px; border: 3px solid #EEEEEE; width: 320px; min-height: 100px;font-size:13px;'>" +
	    "<div style='position:absolute; left: -20px; width:0px; height:0px; border-bottom:15px solid transparent; border-top:15px solid transparent; border-right:20px solid #FFF; font-size:0px; line-height:0px;'></div>"+
	    "<div style='position: relative; width: 300px; min-height: 100px;'>	           "+pins[id].html+"</div></div>");

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
  
		var mlocations = 
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



pinInfoBox  = new Microsoft.Maps.Infobox(map.getCenter(), {
            maxHeight:300,
            visible: false
        });
pinInfoBox.setMap(map);

var j;

for(j=0;j<mlocations.length;j++){
    var name = mlocations[j].facabbr;   
    var _lat = mlocations[j].latitude;
    var _lon = mlocations[j].longitude;
    var _id =  mlocations[j].id;
    var _trialid =  mlocations[j].trialid;
  var pinColor =  mlocations[j].region_color;
// Add a pin to the map
  	    var latLon 		= 	new Microsoft.Maps.Location(_lat,_lon);		
    	           var pin 		= 	new Microsoft.Maps.Pushpin(latLon, { icon: "image/" + pinColor + "_icon.png", height:35, width:23 });
           //pin.Title 		= 	'';//usually title of the infobox

	     var content = '<div><p><b>' + mlocations[j].city + ', '  + mlocations[j].state_code  +  '</b></p></div>' +
 	    '<div><a href="http://clients.customweather.com/templates/demo/current.php?trial_ID='+_trialid+'&wid='+_id+'&metric=false&language=en" target="_blank">'+
            'Weather Details</a></div>';			
          pin.metadata = {
                title: 'Pin ' + j,
                description: content
            };
	    
		
            //pinLayer.push(pin); 		 //add pushpin to pinLayer
           // Microsoft.Maps.Events.addHandler(pin, 'click', displayInfobox);
 	Microsoft.Maps.Events.addHandler(pin, 'click', mouseovermapEvent);
     
        map.entities.push(pin);


}





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
              	  	 var polygoncolor = new Microsoft.Maps.Color(100,50,205,50);
              		 var cone_shape = new Microsoft.Maps.Polygon(cones[i],{fillColor: polygoncolor, strokeColor: polygoncolor});			 
			 shapeLayer['hurricane'].cone[i] = cone_shape;
			 map.entities.push(cone_shape);
		  }
	 	  
		  shapeLayer['hurricane'].line = new Array();
		  for(var x=0;x<lines.length;x++) {
		  	  var polygoncolor = new Microsoft.Maps.Color(100,50,205,50);
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
	      
	      //var location = new Microsoft.Maps.Location(h.lat,h.long);	
	      var location = new Microsoft.Maps.Location(37.77,-102.42);

	      map.setView({zoom:4, center: location});
	    }
	    var sessionval = '<?php echo $_SESSION['unit'];  ?>';	
	 
	    if(sessionval == ''){ //nonmetric
		 var url = "?product=hurricane&client=tile_demo2&apikey=zr_FX9XukUgZetYI9JIINzkhlcktJjS3yqEV3rKXuGFiNCDT1gtcCGKuFkc1jQzl&format=georss&metric=false";
            getGEORSS(url, callback);	
		}else if(sessionval == 'nonmetric'){
		 var url = "?product=hurricane&client=tile_demo2&apikey=zr_FX9XukUgZetYI9JIINzkhlcktJjS3yqEV3rKXuGFiNCDT1gtcCGKuFkc1jQzl&format=georss&metric=false";
            getGEORSS(url, callback);
		}else{
		 var url = "?product=hurricane&client=tile_demo2&apikey=zr_FX9XukUgZetYI9JIINzkhlcktJjS3yqEV3rKXuGFiNCDT1gtcCGKuFkc1jQzl&format=georss&metric=true";
            getGEORSS(url, callback);
		} 
	   
  }

  shapeLayer['cw_advisories'] = new Object();
  shapeLayer['cw_advisories'].Show = function () {
            var callback = function (vertices) {
		  html = parseCW_Advisories(vertices);
                  for(var i=0;i<html.length;i++) {
  		  var h=html[i];
		  var location = new Microsoft.Maps.Location(h.lat,h.long);
		  var point = new Microsoft.Maps.Point(4,34);

		  var pin = new Microsoft.Maps.Pushpin(location, {icon:h.icon, width:20, height:20, zIndex: i, anchor: point});
		  var options = {width: 300, height: 200, visible: true, zIndex: 3000, offset:new Microsoft.Maps.Point(10,0), showPointer: true, showCloseButton:true};

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
	    }
	      getGEORSS("?client=tile_demo2&apikey=zr_FX9XukUgZetYI9JIINzkhlcktJjS3yqEV3rKXuGFiNCDT1gtcCGKuFkc1jQzl&product=cw_advisories&xml.return_all_records=true&format=georss&category=fmglobal", callback);
  }
  return map;
}
 
function mouseovermapEvent(e) {
        //Make sure the infobox has metadata to display.
        if (e.target.metadata) {
            //Set the infobox options with the metadata of the pushpin.
            pinInfoBox.setOptions({
                location: e.target.getLocation(),
                description: e.target.metadata.description,
                visible: true
            });
        }
    } 

function mouseoutmapEvent(e) {
        pinInfoBox.setOptions({ visible: false });
    }

function AddLayer(product){
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
  var tileLayer= new Microsoft.Maps.TileLayer({ mercator:tileSourceUrl, opacity:1 });
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
    removeSateliteRadar();	
    AddLayer(product);
    if(product == 'hurricane_wind_swaths' || product == 'hurricane_error_cones'){	    
    RemovesstLegend();	
    $('#windpalette').show();	
    }else{
    $('#windpalette').hide();	
    }	
    }else{  	
    RemoveLayer(product);
    $('#windpalette').hide();		
    //hideLegend();
    RemovesstLegend();
  }
}

function removeSateliteRadar(){
$('#myMap').show();
$('#myMap1').hide();
}
function togglesstLegend(checkbox){
 if (checkbox.checked) {
    RemovesstLegend();
    var sessionunit = '<?php echo $_SESSION['unit']; ?>';
    if(sessionunit == ''){
	 getPage();
	}else if(sessionunit == 'nonmetric'){
	getPage1();
	}else{
	getPage();
	}		 	 	
  }else{
    RemovesstLegend();
  }
}

/*
function toggleNonMetricLegend(checkbox){
 if (checkbox.checked) {
   RemovesstLegend();
   getPage1();
   
  } else {
    RemovesstLegend();
   
  }
}
*/

function toggleSatelite(checkbox){
if(checkbox.checked){
showanimation();
RemovesstLegend();
 $('#windpalette').hide();	
}else{
$('#myMap').show();
$('#myMap1').hide();
}

}

function RemovesstLegend(){
$('#palette').html('');
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



function radaranimate(checkbox){

if(checkbox.checked){
var newradmap = GetMap(newlat,newlon);
var radframes = animationModuleLoaded(newradmap);
 var displayradMessages = [];
  var radtileSources = [];

        //Create a tile source for each time stamp.
        for (var i = 0; i < radframes.length; i++) {
            var radtileSource = new Microsoft.Maps.TileSource({
                uriConstructor: radframes[i]
            });
            radtileSources.push(radtileSource);
             var radmsg = updateFrameCounter(i);
             displayradMessages.push(radmsg);
        }
        //Create the animated tile layer and add it to the map.
        radanimatedTileLayer = new Microsoft.Maps.AnimatedTileLayer({
            mercator: radtileSources,
            frameRate: 500
        });
 //Add an event handler that fires for each frame of the animation.
       Microsoft.Maps.Events.addHandler(radanimatedTileLayer, 'onFrameLoaded', function (e) {
            var radmsg = displayradMessages[e.index];
            document.getElementById('satframeTimeStamp').value = radmsg;
        });
        newradmap.layers.insert(radanimatedTileLayer);
$('#satanictrl').show();
$('#palette').hide();	
}
else{
GetMap(newlat,newlon);
shapeLayer['hurricane'].Show();
$('#satanictrl').hide();
$('#anictrl').hide();
}
}


function satanimate(checkbox){
if(checkbox.checked){
var newsatmap = GetMap(newlat,newlon);
var satframes = satanimationModuleLoaded(newsatmap);
console.log(satframes);
 var displaysatMessages = [];

  var sattileSources = [];

        //Create a tile source for each time stamp.
        for (var i = 0; i < satframes.length; i++) {
            var sattileSource = new Microsoft.Maps.TileSource({
                uriConstructor: satframes[i]
            });
            sattileSources.push(sattileSource);
             var satmsg = satupdateFrameCounter(i);
             displaysatMessages.push(satmsg);
        }

        //Create the animated tile layer and add it to the map.
        satanimatedTileLayer = new Microsoft.Maps.AnimatedTileLayer({
            mercator: sattileSources,
            frameRate: 500
        });

 //Add an event handler that fires for each frame of the animation.
       Microsoft.Maps.Events.addHandler(satanimatedTileLayer, 'onFrameLoaded', function (e) {
            var satmsg = displaysatMessages[e.index];
            document.getElementById('satframeTimeStamp').value = satmsg;
        });
        newsatmap.layers.insert(satanimatedTileLayer);
$('#satanictrl').show();
$('#palette').hide();	
}
else{
GetMap(newlat,newlon);
shapeLayer['hurricane'].Show();
$('#satanictrl').hide();
$('#anictrl').hide();
}

}

//]]>
  </script>


<script>var metric = '';</script>
	<link type="text/css" href="/CSS/demos/maptiles/jquery.ui.all.css" rel="stylesheet" />
	<link type="text/css" href="/CSS/demos/maptiles/demos.css" rel="stylesheet" />
	<!--<link rel="stylesheet" href="lib/layout.css" type="text/css" />-->	
	<link rel="stylesheet" href="http://openlayers.org/en/v3.1.1/css/ol.css" type="text/css"/>
	
	<!--<script type="text/javascript" src="/javascript/demos/jquery-1.4.2.js"></script> -->
	<!--<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>-->

	<script src="lib/jquery.js" type="text/javascript"></script>	
	<script type="text/javascript" src="/javascript/demos/jquery.ui.core.js"></script>
	<script type="text/javascript" src="/javascript/demos/jquery.ui.widget.js"></script>
	<script type="text/javascript" src="/javascript/demos/jquery.ui.accordion.js"></script>

	

	<script type="text/javascript">

	

function changeMetricUnit(){
var val = 'metric';
$.ajax({
method:'get',
data:{val:val},
url:'cw_demo.php',
}).done(function(data){
if(data == 1){
window.location="cw_demo.php";
}
});
}

function changeNonmetricUnit(){
var val = 'nonmetric';
$.ajax({
method:'get',
data:{val:val},
url:'cw_demo.php',
}).done(function(data){
if(data == 1){
window.location="cw_demo.php";
}
});
}



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

<body onload="GetMap(newlat,newlon); shapeLayer['hurricane'].Show()">
<div id="debug" style="position:absolute; bottom:0px; z-index: 24"></div>
  <div id="legendButtons" style="margin-top:4px;position: relative;z-index: 9999;">
    <button id="show" style="display:none;" onclick="toggleLegend(true);">&gt;&gt;</button>
    <button id="hide" onclick="toggleLegend(false);" style="float:left;">&lt;&lt; Hide Menu</button>
<input id="mapChange" type="button" value="View Spaghetti Track" onclick="window.location.href = '../index.php?trial_ID=<?php echo $trial_ID; ?>'"/>
        
      <!--<a onClick="document.cookie='cwUnit=metric;';window.location.reload()"> units (<span class='button'>change</span>)</a>-->
	<!--<div class="unitBtn" style="height:200px;">
	<form action="" method="post">
	 &nbsp;&nbsp;<span style="font-size:15px;"> units </span> <input type="submit" name="submitbtn" value="Change" />
	</form>
	</div>-->	
	<br/>
	<br/>
	<br/>
	<br/>
     	

</div>
  
<div style="z-index: 200; position: fixed; top: 0px; right: 50px">
<div style='position:absolute; right: 0px'>
<!--<script type="text/javascript" src="cwLegend.js"></script> -->
<script src="lib/raphael.js" type="text/javascript" charset="utf-8"></script>
<script type="text/javascript" src="lib/sstpalette.js"></script>
<div style="display:block;" id="palette"></div>	
<div id="windpalette" style="display:none;"><img src="image/color-plate.png" alt="color-plate.png" /></div>

</div>
</div>  
<div id='myMap' style="width:auto; height:100%; min-width:340px; min-height:200px;"></div>


  <script src="lib/QueryData.js" type="text/javascript"></script>
  <script src="lib/jquery.js" type="text/javascript"></script>  
  <script src="lib/model_update.js" type="text/javascript"></script>
  <script src="http://maps-beta.customweather.com/xml?product=model_update&source=hrrrsub3km&callback=model_update&client=bradburn&client_password=woll0BScre" type="text/javascript"></script>
 <script src="lib/future_radar_lots.js" type="text/javascript"></script>
  <script src="lib/satelite.js" type="text/javascript"></script>

<div id="anictrl"  style="z-index: 300; position: fixed; bottom: 30px; left:350px; display:none;">
<fieldset id="animationControls"> 
    <legend>Animation Controls</legend>
   <label for="frameIndex" style="display:none;">Current Frame <input id="frameIndex" size="4" value="0" /></label> 
    <button onclick="animatedTileLayer.stop();">Stop</button>
    <button onclick="animatedTileLayer.play();">Play</button>
    <button onclick="animatedTileLayer.reset();">Reset</button>
     <label for="frameTimeStamp"> <input id="frameTimeStamp"  value="" readonly/></label>
  </fieldset>
</div>
<div id="satanictrl"  style="z-index: 300; position: fixed; bottom: 30px; left:350px; display:none;">
<fieldset id="satanimationControls"> 
    <legend>Animation Controls</legend>
   <label for="satframeIndex" style="display:none;">Current Frame <input id="satframeIndex" size="4" value="0" /></label> 
    <button onclick="satanimatedTileLayer.stop();">Stop</button>
    <button onclick="satanimatedTileLayer.play();">Play</button>
    <button onclick="satanimatedTileLayer.reset();">Reset</button>
     <label for="satframeTimeStamp"> <input id="satframeTimeStamp" style="width:150px;" value="" readonly/></label>
  </fieldset>
</div>

<!--
<div id='myMap1' style="width:auto; height:100%; min-width:320px; min-height:200px;display:none;"> 
<script src="lib/QueryData.js" type="text/javascript"></script>
<script src="lib/model_update.js" type="text/javascript"></script>
<script src="http://openlayers.org/en/v3.1.1/build/ol.js" type="text/javascript"></script>
<script src="http://maps-beta.customweather.com/xml?product=model_update&source=hrrrsub3km&callback=model_update&client=bradburn&client_password=woll0BScre" type="text/javascript"></script>
<script src="lib/future_radar_lots.js" type="text/javascript"></script>

<div id="controls">
  <input id="left" type="button" value="&lt;&lt;" onClick="left()"/>
  <input id="stop" type="button" value="&#61;" onClick="toggle()"/>
  <input id="right" type="button" value="&gt;&gt;" onClick="right()"/>
  <input id="slider" type="range" value="0" min="0" max="15" step="1"  onchange="sliderChange()" oninput="sliderInput()">
  <strong id="isodate"></strong>
</div>
</div>
-->

<div id='legend' style="background: #fff;">
<div id="demo-frame">
<div class="demo">
<div id="accordion" style="margin-top:29px;">
	<h3><a href="#"> Additional Layers </a></h3>
	<div>
	<p>	 
	<!--toggleLayer(this,'nws_radar_sfa_10min'); toggleLayer(this,'global_ir_satellite_10km'); -->

<label><input type="checkbox" onclick="satanimate(this);" /> Satellite </label><br>

<label><input type="checkbox" onclick="radaranimate(this);" /> Radar </label><br>

<label><input type="checkbox" onclick="toggleLayer(this,'hurricane_wind_swaths'); toggleLayer(this,'hurricane_error_cones');" /> Wind Radii and Error Cones </label><br>

<label><input type="checkbox" onclick="toggleLayer(this,'global_sst_day_m_0'); togglesstLegend(this);" />Sea Surface Temperature
</label><br>

	</p>
	<p>
	Layers are current.
	</p>


<input type="radio" name="unitchange" value="metric"  onclick="window.location.href = 'spaghetti_tracks.php?trial_ID=<?php echo $trial_ID; ?>&metric=true'" <?php if($_SESSION['unit']=='metric' ){ ?>checked="true" <?php } ?>/>Metric
<input type="radio" name="unitchange" value="nonmetric" onclick="window.location.href = 'spaghetti_tracks.php?trial_ID=<?php echo $trial_ID; ?>&metric=false'" <?php if($_SESSION['unit']=='nonmetric' ){ ?>checked="true" <?php }?>/>Non Metric 
<!-- <input type="radio" name="unitchange" value="metric"  onclick="getPage();" <?php if($_SESSION['unit']=='metric' ){ ?>checked="true" <?php } ?>/>Metric
<input type="radio" name="unitchange" value="nonmetric" onclick="getPage1();" <?php if($_SESSION['unit']=='nonmetric' ){ ?>checked="true" <?php }?>/>Non Metric --->
</div>



</div><!-- end accordion -->
<font face ="verdana,arial" size="1"><br>You can choose multi-layers from each individual section or from multiple sections if you like.</font>
</div><!-- End demo -->
</div><!-- End dmeo_wrapper -->
</div><!-- End div legend -->


</body>
</html>
  <?php include("../../footer.php"); ?>

  <?php } }
 
for($a=1;$a<$n;$a++){
if($temp_ID[$a] == $trial_ID && $trial_status[$a] != "current"){ 
 
      ob_start();
      header("Location: trial_demo.php");
      ob_flush();
} } ?>
       	



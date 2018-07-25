
 var circle ={
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: 'red',
    fillOpacity: 1,
    opacity: 1,
    scale: 4,
    strokeColor: 'red',
    strokeWeight: 1
};
Array.prototype.contains = function(v) {
    for(var i = 0; i < this.length; i++) {
        if(this[i] === v) return true;
    }
    return false;
};

Array.prototype.unique = function() {
    var arr = [];
    for(var i = 0; i < this.length; i++) {
        if(!arr.contains(this[i])) {
            arr.push(this[i]);
        }
    }
    return arr; 
}

var gMap = null;
var infoWindow = new google.maps.InfoWindow();
var warnings;
var watches;
var tileLayer = new Array();

var facInfo = new google.maps.InfoWindow()
var facArray= [];

var warningKeys=[];
var watchKeys=[];

function initialize() {
    var mapOptions = {
	zoom: 4,
	center: new google.maps.LatLng(39.6843428, -101.80808878),
	mapTypeId:  google.maps.MapTypeId.TERRAIN,
	
    };
    gMap = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
    warnings = new google.maps.Data();
    warnings.loadGeoJson('http://clients.customweather.com/templates/CONTACTRELIEF/maptiles/stormtracks/storm_tracks.json', {}, function (features){
	features.forEach(function (f) {
		drawArrow(f);
        }
    );


	});
    warnings.setMap(gMap);
    warnings.setStyle(warningStyle);
    warnings.addListener('click',  function (event) {
	handleMouseOver(event);
    });

        gMap.overlayMapTypes.push(
	new google.maps.ImageMapType(
{
        getTileUrl: function(c, z) {
	return "http://maps.customweather.com/cw_tiles/tGbb42Ilnh5DSpMmTJSWLGjaC7ZqsOod3C6ruavJRUtgs_aEjPvTWw-TK70Az7Za86CeRKSrgv2QMaxUO2Rvpg==/nws_radar_sfa_10min/"+t2q(c.x, c.y, z)+".png?storm_track.tiles=true";

   },
   tileSize: new google.maps.Size(256, 256),
   name: "CustomWeather",
   maxZoom: 18
}));

}

function drawArrow(f){
		var ll = f.getGeometry().get();
  mapCenter = new google.maps.LatLng(ll.lat(), ll.lng());
 var distance_in_meter = f.getProperty("fcst_speed")*1852;
  var bearing = f.getProperty("fcst_azimuth");

  var start = new LatLon(mapCenter.lat(), mapCenter.lng());
  var destination = start.rhumbDestinationPoint(distance_in_meter, bearing);
  var lineSymbol = {
    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
  };
  var impactP = new google.maps.Polyline({
    map: gMap,
    path: [mapCenter,
      new google.maps.LatLng(destination.lat, destination.lon)
    ],
    icons: [{
        icon: lineSymbol,
        offset: '100%'
      }]
      //    strokeColor: "#FF0000",
      //  strokeOpacity: 1.0,
      //strokeWeight: 2
  });
}


function warningStyle(feature) {
	console.log(feature.getProperty("nexrad_id"));
	if(feature.getProperty("nexrad_id")==='khgx'){
		console.log(feature);
	}
	if(feature.getProperty("fcst_speed")==-1) return {visible: false};
	return {
  		icon: circle
	};
}

function  handleMouseOver(event){
    var f = event.feature;
    var latLng = event.latLng;

    var alertType  = "Nexrad Storm Track" ;
    var meso = f.getProperty("meso");
    var tvs = f.getProperty("tvs");
    var hail = f.getProperty("hail");
    var hailParts =  null;
	
	if("0/  0/ 0.00".localeCompare(hail)==0 || 'UNKNOWN'.localeCompare(hail)==0){
		hail=false;
	}else{	
		hailParts = hail.split("/");
		hail=true;
	}
    var html = [
	'<div id="InfoPopup" class="info-popup">',
	'<div class="row title">',
	'<div class="col-sm-10 text-center"><h3>Radar Storm Track ('+ f.getProperty("stm_id")+')</h3></div>',
	'</div>',
	'<div class="row content-top">',
	'<div class="col-sm-12 text-center"><strong>Station ID:</strong> ' + f.getProperty("nexrad_id").toUpperCase()  +  '</div>',
	'</div>',
	'<div class="row"><div class="col-sm-4 text-right"><strong>Speed:</strong> '+f.getProperty("fcst_speed") +' Knots</div></div>',
	'<div class="row"><div class="col-sm-4 text-right"><strong>Direction:</strong> '+getWindDir(f.getProperty("fcst_azimuth"), false, false) +' Degrees </div></div>',
	'<div class="row"><div class="col-sm-4 text-right"><strong>Max dBZ:</strong> '+f.getProperty("max_dbz") +' dBZ</div></div>',
	'<div class="row"><div class="col-sm-4 text-right"><strong>Max Echo Height:</strong> '+Math.ceil(f.getProperty("max_height")*1000) +' ft </div></div>',
	'<div class="row"><div class="col-sm-4 text-right"><strong>Storm Top:</strong> '+Math.ceil(f.getProperty("stm_top")*1000)+' ft</div></div>',
	hail ? '<div class="row"><div class="col-sm-4 text-right"><strong>Prob of Hail</strong> '+ hailParts[1]  + '%  </div></div>' : '',
	hail ? '<div class="row"><div class="col-sm-4 text-right"><strong>Prob of Severe Hail:</strong> '+ hailParts[0]  + '%  </div></div>' : '',
	hail ? '<div class="row"><div class="col-sm-4 text-right"><strong>Max Hail Diameter:</strong> '+ hailParts[2]  + 'in  </div></div>' : '',
	'<div class="row"><div class="col-sm-4 text-right"><strong>Vertically Integrated Liquids:</strong> '+f.getProperty("vil") +' kg/m^2</div></div>',
	//'<div class="row"><div class="col-sm-4 text-right"><strong>Azimuth:</strong> '+f.getProperty("azimuth") +' </div></div>',
	//'<div class="row"><div class="col-sm-4 text-right"><strong>Range:</strong> '+f.getProperty("range") +' </div></div>',
	tvs=="NONE" ? '' : '<div class="row"><div class="col-sm-4 text-right"><strong>Tornado:</strong> '+f.getProperty("tvs") +' </div></div>',
	meso=="NONE" ? '':'<div class="row"><div class="col-sm-4 text-right"><strong>Meso:</strong> '+f.getProperty("meso") +' </div></div>',
	//'<div class="row"><div class="col-sm-4 text-right"><strong>latlng:</strong> '+latLng +' </div></div>',
	'<div class="row"><div class="col-sm-4 text-right"><strong><br></strong></div></div>',
	'<div class="row"><div class="col-sm-4 text-right"><strong>Length of arrow equal to 1 hour storm travel</strong></div></div>',
	'</div>'
    ];
    googleMarker = new google.maps.Marker({
	position: event.latLng,
	title: f.getProperty("cap:event"),
	map: gMap
    });
    infoWindow.setContent(html.join(""));
    infoWindow.open(gMap, googleMarker);
    googleMarker.setVisible(false);
}


function AddLayer(product) {
    if(product=='severe_watches'){
	watches.setMap(gMap);
    }else if(product=='severe_warnings'){
	warnings.setMap(gMap);
	return false;
    }
}
function RemoveLayer(product) {
    if(product=='severe_watches'){
	watches.setMap(null);
    }else if(product=='severe_warnings'){
	warnings.setMap(null);
    }
}
function toggleLayer(checkbox, product) {
    console.log(checkbox + ":" + product);
    if (checkbox.checked) {
	AddLayer(product);
    } else {
	RemoveLayer(product);
    }
    var war = warnings.getMap()!=null;
    var wat = watches.getMap()!=null;
    if(!war && !wat) drawCells([]);
    else if(war&&!wat) drawCells(warningKeys);
    else if(!war&&wat) drawCells(watchKeys);
    else drawCells(warningKeys.concat(watchKeys));
}


function t2q ( tx,  ty,  zl){
  var quad = "";
  for (var i = zl; i > 0; i--){
    var mask = 1 << (i - 1);
    var cell = 0;
    if ((tx & mask) != 0)
     cell++;
    if ((ty & mask) != 0)
     cell += 2;
    quad += cell;
  }
  return quad;
}


function getWindDir(wd, abbr, flip) {
	if(flip){
		wd-=180;
		if(wd<0) wd+=360;
	}
    if (wd <= 11 || wd >= 349)
        return abbr ? "N" : "North";
    else if (wd < 34)
        return abbr ? "NNE" : "North-Northeast";
    else if (wd < 56)
        return abbr ? "NE" : "Northeast";
    else if (wd < 79)
        return abbr ? "ENE" : "East-Northeast";
    else if (wd < 101)
        return abbr ? "E" : "East";
    else if (wd < 124)
        return abbr ? "ESE" : "East-Southeast";
    else if (wd < 146)
        return abbr ? "SE" : "Southeast";
    else if (wd < 169)
        return abbr ? "SSE" : "South-Southeast";
    else if (wd < 191)
        return abbr ? "S" : "South";
    else if (wd < 214)
        return abbr ? "SSW" : "South-Southwest";
    else if (wd < 236)
        return abbr ? "SW" : "Southwest";
    else if (wd < 259)
        return abbr ? "WSW" : "West-Southwest";
    else if (wd < 281)
        return abbr ? "W" : "West";
    else if (wd < 304)
        return abbr ? "WNW" : "West-Northwest";
    else if (wd < 326)
        return abbr ? "NW" : "Northwest";
    else if (wd < 349)
        return abbr ? "NNW" : "North-Northwest";
    return abbr ? "N" : "North";
}
///////////

if (typeof module != 'undefined' && module.exports) var Dms = require('./dms'); // ≡ import Dms from 'dms.js'

function LatLon(lat, lon) {
  // allow instantiation without 'new'
  if (!(this instanceof LatLon)) return new LatLon(lat, lon);
  this.lat = Number(lat);
  this.lon = Number(lon);
}

LatLon.prototype.rhumbDestinationPoint = function(distance, bearing, radius) {
  radius = (radius === undefined) ? 6371e3 : Number(radius);
  var δ = Number(distance) / radius; // angular distance in radians
  var φ1 = this.lat.toRadians(),
    λ1 = this.lon.toRadians();
  var θ = Number(bearing).toRadians();
  var Δφ = δ * Math.cos(θ);
  var φ2 = φ1 + Δφ;
  // check for some daft bugger going past the pole, normalise latitude if so
  if (Math.abs(φ2) > Math.PI / 2) φ2 = φ2 > 0 ? Math.PI - φ2 : -Math.PI - φ2;
  var Δψ = Math.log(Math.tan(φ2 / 2 + Math.PI / 4) / Math.tan(φ1 / 2 + Math.PI / 4));
  var q = Math.abs(Δψ) > 10e-12 ? Δφ / Δψ : Math.cos(φ1); // E-W course becomes ill-conditioned with 0/0
  var Δλ = δ * Math.sin(θ) / q;
  var λ2 = λ1 + Δλ;
  return new LatLon(φ2.toDegrees(), (λ2.toDegrees() + 540) % 360 - 180); // normalise to −180..+180°
};

LatLon.prototype.equals = function(point) {
  if (!(point instanceof LatLon)) throw new TypeError('point is not LatLon object');
  if (this.lat != point.lat) return false;
  if (this.lon != point.lon) return false;
  return true;
};

LatLon.prototype.toString = function(format, dp) {
  return Dms.toLat(this.lat, format, dp) + ', ' + Dms.toLon(this.lon, format, dp);
};

if (Number.prototype.toRadians === undefined) {
  Number.prototype.toRadians = function() {
    return this * Math.PI / 180;
  };
}

if (Number.prototype.toDegrees === undefined) {
  Number.prototype.toDegrees = function() {
    return this * 180 / Math.PI;
  };
}

if (typeof module != 'undefined' && module.exports) module.exports = LatLon; // ≡ export default LatLon    </script>



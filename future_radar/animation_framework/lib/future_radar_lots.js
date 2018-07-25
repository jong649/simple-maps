
/**
 * =========================================================================== 
 *                                                                             
 *  future_radar.sh                                                            
 *                                                                             
 *  Author:  Bradburn Young                                                    
 *  Email:   bradburny@customweather.com                                       
 *  style guide: https://google-styleguide.googlecode.com/svn/trunk/javascript.xml 
 *  notes: http://jsfiddle.net/tschaub/Lkgx0qaa/                                                                             
 * =========================================================================== 
 */


var map;
var queryString = new QueryData();

var tileCollection = [];
var frameDates = [];
var intervalTimerId = null;

var cwApiKey = 'tx77ySpkpTu4y0Q_1QLgE82net5EykLQT8L5KCjCpjwKCMjaOnqB8kjDR-5csooY86CeRKSrgv2QMaxUO2Rvpg==';

var fast = 300;
var slow = 2000;
var loading = false;

var iter=0;
var counter=0;
var animating=false;

var now = new Date();
console.log("fucking latest:" + latest_init_time);
var cwsLatest = new Date(latest_init_time + "Z");

var hrrr = false;
console.log("hrrr 00:" + hrrr );
var ageHrrrMinutes = Math.abs(now.getTime()-cwsLatest.getTime())/ (60*1000);
if(ageHrrrMinutes>180){
	hrrr = false;
	console.log("hrrr 0:" + hrrr );
}

if('hrrr' in queryString){
	hrrr = queryString.hrrr=='true'; // force hrrr
	console.log("hrrr 1:" + hrrr );
}
if('future_radar' in queryString){ // force future_radar
	hrrr = queryString.future_radar=='false';
	console.log("hrrr 2:" + hrrr );
}
console.log("hrrr:" + hrrr + " age:" + ageHrrrMinutes);
console.log("hrrr:" + cwsLatest.toISOString().substring(0, 19));

var futureNumFrames = 8;
var futureLayerName = hrrr ? 'bbz_test' : 'future_radar';
var futureAnimTimestep = (hrrr?15:10)*60*1000;
var futureInitialOffset = 0;
var futureInitialModulus = (hrrr?15:10)*60*1000;
var futureStartTimeMs = now.getTime() - now.getTime() % futureInitialModulus + futureInitialOffset;
var initTime = hrrr ? cwsLatest : new Date(futureStartTimeMs);
var initTimeStr = initTime.toISOString().substring(0, 19);
var futureLayerQueryString = "";
if(hrrr){
	futureLayerName = "cws/hrrrsub3km/reflectivity_comp/totalatm/" + initTimeStr;
	futureLayerName = "bbz_test/" + initTimeStr;
	futureLayerQueryString = "palette.name=beta_radar_sfa_reduced.cpt&rsm_palette=true&constrain=true";
}else{
        futureLayerName = "future_radar/" + initTimeStr;
}

var pastNumFrames = 8;
var pastLayerName = 'radar_all';
pastLayerName = 'radar_ex';
pastLayerName = 'radar_all';
pastLayerName = 'nws_radar_sfa_10min';
var pastAnimTimestep = (hrrr?15:10)*60*1000;
var pastInitialModulus = (hrrr?15:10)*60*1000;
var pastInitialOffset = -(hrrr?15:10)*60*1000*pastNumFrames;
var pastStartTimeMs = now.getTime() - now.getTime() % pastInitialModulus + pastInitialOffset;

var numFrames = pastNumFrames + futureNumFrames;

for(ii=0;ii<pastNumFrames;ii++){
    frameDates.push(new Date(pastStartTimeMs + ii*pastAnimTimestep));
}

for(ii=0;ii<futureNumFrames;ii++){
    frameDates.push(new Date(futureStartTimeMs + ii*futureAnimTimestep));
}

var bing = new ol.layer.Tile({
    source: new ol.source.BingMaps({
        //imagerySet: 'Aerial',
        //imagerySet: 'Road',
        imagerySet: 'AerialWithLabels',
	//key: 'Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3'
	key: 'An_V-zl5WqQH2Sgd2OSaLDdHHN5zLsvB-diJvPXy6Btuh2OK1iTp9cmGaw882tWX'
        //key: 'Aq63PdcG0ddlLSi7wf0mYGOEp6l2fVZqDjlpBEIMjicZ38F6t9jlRdb1B0Y2tKgE'
    })
});

var mapbox = new ol.layer.Tile({
    source: new ol.source.XYZ({
       	//url: 'https://a.tiles.mapbox.com/v3/mapbox.blue-marble-topo-jul/{z}/{x}/{y}.png'
	url: 'https://a.tiles.mapbox.com/v3/mapbox.natural-earth-2/{z}/{x}/{y}.png'
       	//url: 'https://a.tiles.mapbox.com/v3/mapbox.blue-marble-topo-jan/{z}/{x}/{y}.png'
       	//url: 'https://a.tiles.mapbox.com/v3/mapbox.geography-class/{z}/{x}/{y}.png'
       	//url: 'https://a.tiles.mapbox.com/v3/mapbox.blue-marble-topo-bathy-jul/{z}/{x}/{y}.png'
	//url: 'https://a.tiles.mapbox.com/v3/mapbox.natural-earth-hypso-bathy/{z}/{x}/{y}.png'
	//url: 'https://a.tiles.mapbox.com/v3/mapbox.world-print/{z}/{x}/{y}.png'
	//url: 'https://a.tiles.mapbox.com/v3/mapbox.world-light/{z}/{x}/{y}.png'
    })
});
var base = null;
base = mapbox;
base = bing;

tileCollection.push(base);

for(ii=0;ii<numFrames;ii++){
    var iterDate = frameDates[ii];
    var ts = iterDate.toISOString().substring(0, 19);
    var isPast = iterDate.getTime()<now.getTime();
    var layerName = isPast ? pastLayerName : futureLayerName;
    
    var attribution = new ol.Attribution({
  	html: 'CWTiles &copy; <a href="http://www.customweather.com/'+ii+'"</a>'
    });

    var tileSource = new ol.source.XYZ({
        attributions: [attribution],
        url: 'http://maps-beta.customweather.com/smt/'+cwApiKey+'/'+layerName+'/' + ts + '/{z}/{x}/{y}.png' + (isPast ? "" : "?" + futureLayerQueryString )
    });
console.log('http://maps-beta.customweather.com/smt/'+cwApiKey+'/'+layerName+'/' + ts + '/{z}/{x}/{y}.png' + (isPast ? "" : "?" + futureLayerQueryString ));

    var tile = new ol.layer.Tile({
      	source: tileSource 
    });
    tile.setVisible(true);
    tile.setOpacity(0.0);
    tileCollection.push(tile);

    
    var totalCount=0;
    tileSource.setTileLoadFunction((function() {
	var numLoadingTiles = 0;
	var tileLoadFn = tileSource.getTileLoadFunction();

	var _url = 'beast'; //atileSource.getURL();
	var _attra = tileSource.getAttributions();
	var _attr = _attra[0];
	var _html = _attr.getHTML();
	//console.log(_html + " started");

	return function(tile, src) {
            if (numLoadingTiles === 0) {
		//console.log('loading from:' + _html + ' started::' + numLoadingTiles  + ' layerCount ' + totalCount);
		if(totalCount==0 && map){
		    var target = document.getElementById(map.getTarget());
		    target.style.cursor='wait';
		    this.loading = true;
		}
		totalCount++;
            }
            ++numLoadingTiles;

            // console.log('loading from:' + _html + ' ' + numLoadingTiles);
            var image = tile.getImage();
            image.onload = image.onerror = function() {
		--numLoadingTiles;
		//console.log('done from:' + _html + ' notcomplete::' + numLoadingTiles);
		if (numLoadingTiles === 0) {
		    totalCount--;
		    //console.log('done from:' + _html + ' complete::' + numLoadingTiles + ' layerCount ' + totalCount);
		    if(totalCount==0 && map){
			var target = document.getElementById(map.getTarget());
			target.style.cursor='';
			this.loading = false;
		    }
		    
		}
            };
            tileLoadFn(tile, src);
	};
    })());
}

var map = new ol.Map({
    target: 'map',
    layers: tileCollection,
    view: new ol.View({
	center: ol.proj.transform([-95, 39], 'EPSG:4326', 'EPSG:3857'),
	zoom:4 
    })
});


function getGMTOffset() {
    off = 0;
    if(map){
  	off = Math.round((ol.proj.transform(map.getView().getCenter(),  'EPSG:3857', 'EPSG:4326')[0])/15);
	//console.log(off);
    }
    return off;
}

//map.on('moveend', onMoveEnd);

startAnimate();

function formatDate(date){
    var igmtOff = getGMTOffset()%24;
    while(igmtOff<-12) igmtOff+=24;
    while(igmtOff>12) igmtOff-=24;
    var hour = 60*60*1000;
    var gmtOff = igmtOff * hour; 
    var z = "";
    var daylight = true;
    var pad = true;
    switch(igmtOff){
	case 0:
	  z = "GMT";
	  break;
	case -8:
	  z = daylight ? "PDT" : "PST";
	  if(daylight) gmtOff += hour;
	  break;
	case -7:
	  z = daylight ? "MDT" : "MST";
	  if(daylight) gmtOff += hour;
	  break;
	case -6:
	  z = daylight ? "CDT" : "CST";
	  if(daylight) gmtOff += hour;
	  break;
	case -5:
	  z = daylight ? "EDT" : "EST";
	  if(daylight) gmtOff += hour;
	  break;	
	default:
          z0 = Math.abs(igmtOff);
	  if(z0<10){
		z = "0" + z0 + ":00";
	  }else{
		z = z0 + ":00";
	  }
	  if(igmtOff<0) z = "-" + z;
	  if(igmtOff>0) z = "+" + z;
	  pad = false;
	  break;

    }
    var _tz = new Date(date.getTime() + gmtOff );
    var _stz = _tz.toUTCString();
    return (pad ? "&nbsp;&nbsp;" : "&nbsp;") + _stz.substring(8, 11)  + " " + _tz.getUTCDate() + " " + _stz.substring(17, 22) + " " + z;
}

function sliderChange(){ // mouse up event
    var iter_ = parseInt(document.getElementById("slider").value);
    this.iter = iter_;
    startAnimate();
}


function sliderInput(){ // down and mouse movement event
    var iter_ = parseInt(document.getElementById("slider").value);
    if(this.iter!=iter_){
    	this.iter = iter_;
    	stopAnimate();
    	updateAnimationExplicit(true);
    }
}
function right(){
    stopAnimate();
    this.iter++;
    updateAnimationExplicit(false);
}
function left(){
    stopAnimate();
    this.iter--;
    updateAnimationExplicit(false);
}
function toggle(){
    if(this.animating){
	document.getElementById("stop").value = ">";  // >
	stopAnimate();
    }else{
	document.getElementById("stop").value = "=";  // "="
	startAnimate();
    }
}
function stopAnimate(){
    if(this.animating){
	this.animating = false;
	if(this.intervalTimerId){
	    clearInterval(this.intervalTimerId);
  	    this.intervalTimerId = null;
	}
    }
}
function startAnimate(){
    if(!this.animating){
	this.animating = true;

	if(this.intervalTimerId){
	    clearInterval(this.intervalTimerId);
  	    this.intervalTimerId = null;
	}
	if(this.counter>this.numFrames){
	    this.intervalTimerId = setInterval('updateAnimation()', fast);
	}else{
	    this.intervalTimerId = setInterval('updateAnimation()', slow);
	}
    }
}

function updateAnimation(){
    updateAnimationExplicit(false);
}

function updateAnimationExplicit(explicitCall){
    var currentFrame = this.iter%(tileCollection.length-1);
   // console.log("updateAnimationExplicit("+explicitCall +"):" + new Date().getTime() + ": iter :" + this.iter + ":current frame:" + currentFrame);
    
    // If this was called from Interval Timer than set slider
    if(!explicitCall){
    	var iter_ = parseInt(document.getElementById("slider").value);
    	if(iter_!=currentFrame){
	    document.getElementById("slider").value = currentFrame;
    	}
    }

    // Update the timestamp
    var ts = formatDate(frameDates[currentFrame]); 

    //$('#isodate').html(ts + " ["+ currentFrame + "]");
    //document.getElementById("isodate").value = ts;  
    $('#isodate').html("<strong>"+ts+"</strong>");

    
    // turn on current frame and off all others
    for(i=1; i<tileCollection.length; i++){
	if(i==(currentFrame+1)){ // +1 because base is in frame
	    tileCollection[i].setOpacity(.75);
	    tileCollection[i].setVisible(true);	
	    continue;
	}
	tileCollection[i].setVisible(false);	
    }


    // iterate if animating
    if(this.animating){
	this.iter++; 
    }
    
    // if we are just loading and have gone through one iteration then pick up speed
    if(counter++==numFrames){
	clearInterval(this.intervalTimerId);
	this.intervalTimerId = setInterval('updateAnimation()', fast);
    }
}





/**
 //opacity.bindTo('value', base, 'opacity').transform(parseFloat, String);

 var base = new ol.layer.Tile({
 source: new ol.source.XYZ({ 
 attributions: [attribution],
 url: 'http://maps-beta/smt/tx77ySpkpTu4y0Q_1QLgE82net5EykLQT8L5KCjCpjwKCMjaOnqB8kjDR-5csooY86CeRKSrgv2QMaxUO2Rvpg==/base/{z}/{x}/{y}.png'
 })
 });
 var base = new ol.layer.Tile({
 title: "Global Imagery",
 source: new ol.source.TileWMS({
 url: 'http://maps.opengeo.org/geowebcache/service/wms',
 params: {LAYERS: 'bluemarble', VERSION: '1.1.1'}
 })
 });
 var base = new ol.layer.Tile({
 source: new ol.source.OSM()
 });
*/
//(function(message) {
//   alert(message);
//}('foo'));
/**
   function sayHello2(name) {
   var text = 'Hello ' + name; // local variable
   var sayAlert = function() { alert(text); }
   return sayAlert;
   }
   var say2 = sayHello2('Jane');
*/

//http://stackoverflow.com/questions/500431/what-is-the-scope-of-variables-in-javascript
//http://christopherjennison.com/openlayers3-quickstart-tutorial/
//http://en.wikibooks.org/wiki/JavaScript/Anonymous_Functions
//http://www.amazon.com/OpenLayers-Cookbook-Perez-Antonio-Santiago/dp/1849517843
//http://code.tutsplus.com/tutorials/javascript-and-the-dom-series-lesson-1--net-3134
//http://docs.openlayers.org/library/syntax.html
//http://acanimal.github.io/OpenLayers-Presentation/#slide-111
//http://www.jpri.org/publications/workingpapers/wp83.html
//http://docs.openlayers.org/library/request.html
//http://openlayers.org/en/v3.1.1/examples/d3.html
//http://www.gfdl.noaa.gov/lucas-harris-nestingo
//http://www.weathercentral.ca/spraycastResults.cfm?prov=ON&height=a&Lat=45.38302&Long=-77.73754
//http://www.hokstad.com/how-to-implement-closures
//http://stackoverflow.com/questions/2806666/js-variable-inheritance-in-anonymous-functions-scope
//http://linguistlist.org/ask-ling/message-details1.cfm?asklingid=200338150
//http://clients.customweather.com/client_sites/RiskPulse/nws_radar_conus.png
//http://jsfiddle.net/Lkgx0qaa/4/
//https://gate.ac.uk/sale/thakker-jape-tutorial/GATE%20JAPE%20manual.pdf
//https://metrics.librato.com/metrics/calories_burned?duration=259200
// preloaded
// http://openlayers.org/en/v3.1.1/examples/mouse-position.js mouse lon/lat
// http://openlayers.org/en/v3.1.1/examples/min-max-resolution.js different layers at different res
//http://openlayers.org/en/v3.1.1/examples/vector-osm.js
//http://openlayers.org/en/v3.0.0/examples/icon.html change pointer
//http://openlayers.org/en/v3.1.1/examples/dynamic-data.js draw shit
// save http://openlayers.org/en/v3.1.1/examples/export-map.js
// also save link to place
// http://openlayers.org/en/v3.1.1/examples/heatmap-earthquakes.html
// http://openlayers.org/en/v3.1.1/examples/lazy-source.html no source
// http://openlayers.org/en/v3.1.1/examples/scale-line.html scales
// http://openlayers.org/en/v3.1.1/examples/vector-layer.html hover
// http://openlayers.org/en/v3.1.1/examples/popup.html popup
// http://openlayers.org/en/v3.1.1/examples/mobile-full-screen.html zoom to current location
// http://openlayers.org/en/v3.1.1/examples/synthetic-points.js
// http://openlayers.org/en/v3.1.1/examples/layer-spy.html spy
// http://openlayers.org/en/v3.1.1/examples/layer-extent.js landsea
// http://openlayers.org/en/v3.1.1/examples/kml-earthquakes.html shapes
// http://openlayers.org/en/v3.1.1/examples/graticule.html
// http://openlayers.org/en/v3.1.1/examples/full-screen.html full screen
// http://openlayers.org/en/v3.1.1/examples/bind-input.html bind to html
// http://openlayers.org/en/v3.1.1/examples/button-title.html tool tips
//http://www.w3schools.com/cssref/pr_class_cursor.asp
/**
   If the worst comes to the worst, you can solve concurrency problems by indirecting all event responses. When an event comes in, drop it in a queue and deal with the queue in order later, in a setInterval function. If you are writing a framework that you intend to be used by complex applications, doing this could be a good move. postMessage will also hopefully soothe the pain of cross-document scripting in the future.
   ihttp://stackoverflow.com/questions/2734025/is-javascript-guaranteed-to-be-single-threaded
   try adding one layer at a time. map.addLayer(newLayer);
*/

//url: 'http://maps-beta/tms/Y1ryKBJ-ClRwEfZR_rIo3PZNv-7JSHKmbqm13dt7srQgTZ5tZdPk2d-9Eggu_UiX/base/{z}/{x}/{-y}.png'
//url: 'http://maps-beta/smt/Y1ryKBJ-ClRwEfZR_rIo3PZNv-7JSHKmbqm13dt7srQgTZ5tZdPk2d-9Eggu_UiX/nws_radar_sfa_10min/{z}/{x}/{y}.png'
//url: 'http://server.arcgisonline.com/ArcGIS/rest/services/' + 'World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
// http://openlayrs.org/en/master/apidoc/ol.source.XYZ.html

//http://jsfiddle.net/tschaub/Lkgx0qaa/

//$(".opacity").on("change", function(){console.log(this.value)});

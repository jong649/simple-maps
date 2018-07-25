
/**
 * =========================================================================== 
 *                                                                             
 *  future_radar.sh                                                            
 *                                                                             
 *  Author:  Bradburn Young                                                    
 *  Email:   bradburny@customweather.com                                       
 *  style guide: https://google-styleguide.googlecode.com/svn/trunk/javascript.xml 
 * =========================================================================== 
 */

var map;
var queryString = new QueryData();

var tileCollection = [];
var frameDates = [];
var intervalTimerId = null;

var cwApiKey = 'tx77ySpkpTu4y0Q_1QLgE82net5EykLQT8L5KCjCpjwKCMjaOnqB8kjDR-5csooY86CeRKSrgv2QMaxUO2Rvpg==';
var bingApiKey = 'Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3';

var fast = 300;
var slow = 2000;
var loading = false;

var iter=0;
var counter=0;
var animating=false;

var now = new Date();


var futureAnimTimestep = 15*60*1000;
var futureInitialOffset = 0;
var futureInitialModulus = 15*60*1000;
var futureStartTimeMs = now.getTime() - now.getTime() % futureInitialModulus + futureInitialOffset;
var initTime = new Date(futureStartTimeMs);
var initTimeStr = initTime.toISOString().substring(0, 19);
var layerQueryString = "";
var layerName = "future_radar/" + initTimeStr;

var numFrames = 8;

for(ii=0;ii<numFrames;ii++){
    frameDates.push(new Date(futureStartTimeMs + ii*futureAnimTimestep));
}

var bing = new ol.layer.Tile({
    source: new ol.source.BingMaps({
        imagerySet: 'AerialWithLabels',
	key: bingApiKey
    })
});

var base = bing;
tileCollection.push(base);

for(ii=0;ii<numFrames;ii++){
    var iterDate = frameDates[ii];
    var ts = iterDate.toISOString().substring(0, 19);
    
    var attribution = new ol.Attribution({
  	html: 'CWTiles &copy; <a href="http://www.customweather.com/'+ii+'"</a>'
    });

    var tileSource = new ol.source.XYZ({
        attributions: [attribution],
        url: 'http://maps-beta.customweather.com/smt/'+cwApiKey+'/'+layerName+'/' + ts + '/{z}/{x}/{y}.png' + ("?" + layerQueryString )
    });

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

	return function(tile, src) {
            if (numLoadingTiles === 0) {
		if(totalCount==0 && map){
		    var target = document.getElementById(map.getTarget());
		    target.style.cursor='wait';
		    this.loading = true;
		}
		totalCount++;
            }
            ++numLoadingTiles;

            var image = tile.getImage();
            image.onload = image.onerror = function() {
		--numLoadingTiles;
		if (numLoadingTiles === 0) {
		    totalCount--;
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
    
    // If this was called from Interval Timer than set slider
    if(!explicitCall){
    	var iter_ = parseInt(document.getElementById("slider").value);
    	if(iter_!=currentFrame){
	    document.getElementById("slider").value = currentFrame;
    	}
    }

    // Update the timestamp
    var ts = formatDate(frameDates[currentFrame]); 

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





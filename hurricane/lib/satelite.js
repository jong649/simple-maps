
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
var satanimatedTileLayer = null;
var queryString = null;
var tileCollection = [];
var frameDates = [];
var intervalTimerId = null;
var CW_API_KEY = 'tx77ySpkpTu4y0Q_1QLgE82net5EykLQT8L5KCjCpjwKCMjaOnqB8kjDR-5csooY86CeRKSrgv2QMaxUO2Rvpg=='; 
var BING_API_KEY = null; 
var k = [];
var fast = 300;
var slow = 2000;
var loading = false;
var iter=0;
var counter=0;
var animating=false;
var numFrames = 8;
var now = new Date();

var futureAnimTimestep = 60*60*1000;
var futureInitialOffset = -8*60*60*1000;
var futureInitialModulus = 60*60*1000;
var futureStartTimeMs = now.getTime() - now.getTime() % futureInitialModulus + futureInitialOffset;
var initTime = new Date(futureStartTimeMs);
var initTimeStr = initTime.toISOString().substring(0, 19);
var layerQueryString = "";
var layerName = "global_ir_satellite_10km/" + initTimeStr;

for(ii=0;ii<numFrames;ii++){
frameDates.push(new Date(futureStartTimeMs + ii*futureAnimTimestep));
}

function satanimationModuleLoaded() {
var satframes =[];

for(ii=0;ii<numFrames;ii++){

var radarTilelayer = [];
   var iterDate = frameDates[ii];
    var ts = iterDate.toISOString().substring(0, 19);
 
  satframes.push("http://maps-beta.customweather.com/cw_tiles/tx77ySpkpTu4y0Q_1QLgE82net5EykLQT8L5KCjCpjwKCMjaOnqB8kjDR-5csooY86CeRKSrgv2QMaxUO2Rvpg==/"+layerName+"/"+ ts + "/{quadkey}.png" + 
("?" + layerQueryString ));
 }
console.log(map); 
   satanimatedTileLayer = new SatAnimatedTileLayer(
          map,
          satframes,
          {
            framerate: 1000,
            loopbehaviour: 'loop',
            opacity: 0.75,
            mode: 'safe',
            frameChangeCallback: satupdateFrameCounter
          }
        );

map.entities.insert(satanimatedTileLayer);
satanimatedTileLayer.play();
  
}

 function satupdateFrameCounter(n){
        // Display the frame counter
        document.getElementById('satframeIndex').value = n;        
        // Show the timestamp corresponding to this frame
	
       // var t = String(timeStamps[n]);
	
	
	 var t =  formatDate(frameDates[n]);

	var newt = t.replace(/\&nbsp;/g, '');	
	
	
	document.getElementById('satframeTimeStamp').value = newt;
	
        //document.getElementById('frameTimeStamp').value = t.substr(0, 4) + '-' + t.substr(4, 2) + '-' + t.substr(6, 2) + ' ' + t.substr(8, 2) + ':' + t.substr(10,2);
      }


function getGMTOffset(){
off = 0; 
if(map){	
}
return off;
}



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


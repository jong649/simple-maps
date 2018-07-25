
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
var animatedTileLayer = null;
var queryString = new QueryData();
var tileCollection = [];
var frameDates = [];
var intervalTimerId = null;
var cwApiKey = 'tx77ySpkpTu4y0Q_1QLgE82net5EykLQT8L5KCjCpjwKCMjaOnqB8kjDR-5csooY86CeRKSrgv2QMaxUO2Rvpg==';
//var cwApiKey   = 'zr_FX9XukUgZetYI9JIINzkhlcktJjS3yqEV3rKXuGFiNCDT1gtcCGKuFkc1jQzl';
var fast = 500;
var slow = 2000;
var loading = false;

var iter=0;
var counter=0;
var animating=false;

var now = new Date();
//console.log("fucking latest:" + latest_init_time);
var cwsLatest = new Date(latest_init_time + "Z");

var hrrr = false;
//console.log("hrrr 00:" + hrrr );
var ageHrrrMinutes = Math.abs(now.getTime()-cwsLatest.getTime())/ (60*1000);
if(ageHrrrMinutes>180){
	hrrr = false;
	//console.log("hrrr 0:" + hrrr );
}

if('hrrr' in queryString){
	hrrr = queryString.hrrr=='true'; // force hrrr
	//console.log("hrrr 1:" + hrrr );
}
if('future_radar' in queryString){ // force future_radar
	hrrr = queryString.future_radar=='false';
	console.log("hrrr 2:" + hrrr );
}
//console.log("hrrr:" + hrrr + " age:" + ageHrrrMinutes);
//console.log("hrrr:" + cwsLatest.toISOString().substring(0, 19));

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

var pastNumFrames 	= 	8;
var pastLayerName 	= 	'radar_all';
pastLayerName 		= 	'radar_ex';
pastLayerName 		= 	'radar_all';
pastLayerName 		= 	'radar';
var pastAnimTimestep 	= 	(hrrr?15:10)*60*1000;
var pastInitialModulus 	= 	(hrrr?15:10)*60*1000;
var pastInitialOffset 	= 	-(hrrr?15:10)*60*1000*pastNumFrames;
var pastStartTimeMs 	= 	now.getTime() - now.getTime() % pastInitialModulus + pastInitialOffset;
var numFrames 		= 	pastNumFrames + futureNumFrames;



for(ii=0;ii<pastNumFrames;ii++){
    frameDates.push(new Date(pastStartTimeMs + ii*pastAnimTimestep));
}

for(ii=0;ii<futureNumFrames;ii++){
    frameDates.push(new Date(futureStartTimeMs + ii*futureAnimTimestep));
}



//var options 	= 	{credentials:"An_V-zl5WqQH2Sgd2OSaLDdHHN5zLsvB-diJvPXy6Btuh2OK1iTp9cmGaw882tWX", zoom:2, mapTypeId:"r"};
//map		= 	new Microsoft.Maps.Map(document.getElementById("myMap"),options);


var timeStamps = [];

/*for(j=0;j<numFrames;j++){
    var iterDate = frameDates[j];   	
    timeStamps[j] = iterDate.toISOString().substring(0, 19);
}
*/

function animationModuleLoaded(val) {
var frames =[];
for(ii=0;ii<numFrames;ii++){
    var iterDate = frameDates[ii];   	
    var ts = iterDate.toISOString().substring(0, 19);
    timeStamps.push(ts);

    var isPast = iterDate.getTime()<now.getTime();
    
    var layerName = isPast ? pastLayerName : futureLayerName;


    

if(ii < 10){
  frames.push("http://maps-beta.customweather.com/cw_tiles/tx77ySpkpTu4y0Q_1QLgE82net5EykLQT8L5KCjCpjwKCMjaOnqB8kjDR-5csooY86CeRKSrgv2QMaxUO2Rvpg==/"+layerName+"/"+ ts + "/{quadkey}.png" + (isPast ? "" : "?" + futureLayerQueryString ));
}

  

}


animatedTileLayer = new AnimatedTileLayer(
          map,
          frames,
          {
            framerate: 1000,
            loopbehaviour: 'loop',
            opacity: 1,
            mode: 'safe',
	   frameChangeCallback: updateFrameCounter,
          }
        );


map.entities.push(animatedTileLayer);
animatedTileLayer.play();
}


 function updateFrameCounter(n){
        // Display the frame counter
        document.getElementById('frameIndex').value = n;        
        // Show the timestamp corresponding to this frame
	
       // var t = String(timeStamps[n]);
	
	
	 var t =  formatDate(frameDates[n]);

	var newt = t.replace(/\&nbsp;/g, '');	
	
	
	document.getElementById('frameTimeStamp').value = newt;
	
        //document.getElementById('frameTimeStamp').value = t.substr(0, 4) + '-' + t.substr(4, 2) + '-' + t.substr(6, 2) + ' ' + t.substr(8, 2) + ':' + t.substr(10,2);
      }


function getGMTOffset(){
    off = 0;   	
    //if(map){	
	//console.log('hello');
	//console.log(map.getView().getCenter());
 	//ol.proj.transform(map.getView().getCenter();
  	//off = Math.round((ol.proj.transform([-10575351.62536099, 4721671.572580107],  'EPSG:3857', 'EPSG:4326')[0])/15);	
	//console.log(off);
	//return false;
    //}
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


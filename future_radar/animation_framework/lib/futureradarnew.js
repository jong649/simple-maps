var queryString = new QueryData();
var now = new Date();
var cwApiKey = 'tx77ySpkpTu4y0Q_1QLgE82net5EykLQT8L5KCjCpjwKCMjaOnqB8kjDR-5csooY86CeRKSrgv2QMaxUO2Rvpg==';
var frameDates = [];
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

    var map, animatedLayer;
    //Weather tile url from Iowa Environmental Mesonet (IEM): http://mesonet.agron.iastate.edu/ogc/


    function GetMap()
    {
        map = new Microsoft.Maps.Map('#myMap', {
            center: new Microsoft.Maps.Location(39, -92),
            zoom: 4
        });
        var tileSources = [];
        //Create a tile source for each time stamp.
        for (var i = 0; i < numFrames; i++) {
            var iterDate = frameDates[i];
            var ts = iterDate.toISOString().substring(0, 19);
            var isPast = iterDate.getTime()<now.getTime();
            var layerName = isPast ? pastLayerName : futureLayerName;
            var tileSource = new Microsoft.Maps.TileSource({
                uriConstructor: 'http://maps-beta.customweather.com/smt/'+cwApiKey+'/'+layerName+'/' + ts + '/{zoom}/{x}/{y}.png' + (isPast ? "" : "?" + futureLayerQueryString )
            });
console.log(tileSource);
            tileSources.push(tileSource);
        }
        //Create the animated tile layer and add it to the map.
        animatedLayer = new Microsoft.Maps.AnimatedTileLayer({
            mercator: tileSources,
            frameRate: 500
        });
        map.layers.insert(animatedLayer);
    }

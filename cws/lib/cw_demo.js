var map = null;
var tileLayer = new Array();
var shapeLayer = new Array();
var cwApiKey = 'tx77ySpkpTu4y0Q_1QLgE82net5EykLQT8L5KCjCpjwKCMjaOnqB8kjDR-5csooY86CeRKSrgv2QMaxUO2Rvpg==';
var tileLayerMap = [];
var metric = false;
var descMap = new Object();
var tileCollection = [];
var activeModel = null;
var loading = false;
var _incr = 1;
var forecastDates;
var iter=0;
var counter;
var animating=false;
var numFrames;
var activeCWSVariable;

var currentOpacity = 0.75;

var animationDelay = 1000;

descMap["cdd_day_e_0"]="Cooling Degree Days";
descMap["cloudtotal_day_e_0"]="Cloud Cover Total";
descMap["gdd_day_e_0"]="Growing Degree Days";
descMap["hdd_day_e_0"]="Heating Degree Days";
descMap["icefall_day_e_0"]="Ice Accumulation Daily";
descMap["rainfall_cum_day_e_6"]="Rainfall 7-Day Accumulated Total";
descMap["rainfall_day_e_0"]="Rainfall Daily Totals";
descMap["2m_relative_humidity_day_e_0"]="Relative Humidity";
descMap["snowfall_cum_day_e_6"]="Snowfall 7-Day Accumulated Total";
descMap["snowfall_day_e_0"]="Snowfall Daily Totals";
	
descMap["soil_moisture_0_10_day_e_0"]="Soil Moisture 0-10cm";
descMap["soil_moisture_10_40_day_e_0"]="Soil Moisture 10-40cm";
descMap["capesfc_day_e_0"]="Storm Potential Surface CAPE";
descMap["2m_dewpoint_day_e_0"]="Temperature Dewpoint";
descMap["maxtemp_day_e_0"]="Temperature Maximum";
descMap["meantemp_day_e_0"]="Temperature Mean";
descMap["mintemp_day_e_0"]="Temperature Minimum";
descMap["meantemp_dep_e_0"]="Temperature Mean Departure";
descMap["wind_day_e_0"]="Windspeed Average Daily @ 10m";
descMap["max_wind_day_e_0"]="Windspeed Maximum Daily @ 10m";

var queryString = new QueryData();
var WX=800;
var HX=50;
var R = null;


function GetMap() {
     var bing = new ol.layer.Tile({
        source: new ol.source.BingMaps({
            //imagerySet: 'Aerial',
            imagerySet: 'Road',
            //imagerySet: 'AerialWithLabels',
            //key: 'Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3'
            //key: 'Aq63PdcG0ddlLSi7wf0mYGOEp6l2fVZqDjlpBEIMjicZ38F6t9jlRdb1B0Y2tKgE'
	    key: 'An_V-zl5WqQH2Sgd2OSaLDdHHN5zLsvB-diJvPXy6Btuh2OK1iTp9cmGaw882tWX'

        })
    });
    map = new ol.Map({
        target: 'myMap',
        layers: [bing],
        view: new ol.View({
            center: ol.proj.transform([-95, 39], 'EPSG:4326', 'EPSG:3857'),
            zoom: 4
        })
    });
  
    initDrawRoutine();
}

function endPoint(x, y, N, side, angle) {
        
    var path = "",
        c, temp_x, temp_y, theta;
    
   /** for (c = 0; c <= N; c += 1) {
        theta = (c + 0.5) / N * 2 * Math.PI;
        temp_x = x + Math.cos(theta) * side;
        temp_y = y + Math.sin(theta) * side;
        path += (c === 0 ? "M" : "L") + temp_x + "," + temp_y;
    }*/
    return path;
}


function initDrawRoutine(){
    	$("#palette").hide();
	Raphael.fn.endpoint = function (x, y, w, h, stroke, back, fore) {
		var active = back!=null ? back : fore;
                var color = "rgb(" + active.red + ", " + active.green + ", " + active.blue + ")";
		
		var p = "M " + x + "," + y  + " L "  + x + ", " + (y+h) + " L " + (x + (back!=null ? -w : w)) + "," + (y+h/2.0) + " Z";
		if(active.alpha==0){
		return this.path(p); //.attr({fill: color, opacity: active.alpha/255.0});
		}else{
		return this.path(p).attr({fill: color, opacity: active.alpha/255.0});
		}
        };
	Raphael.fn.cell = function (x, y, w, h, hue, stroke, red, green, blue, alpha) {
                hue = hue || 0;
                 var color = "rgb(" + red + ", " + green + ", " + blue + ")";
                if(!stroke){ // do not draw outline
                        return this.rect(x, y, w, h, 0).attr({fill : color, stroke: color, opacity: 1});
                }else{
                        return this.rect(x, y, w, h, 0).attr({fill : color, opacity: 1 });
                }
        };
 	R = Raphael("palette");
}

function drawCells(colors, levels, size, red, green, blue, alpha, cpt){
  var radius=10.0;
  var x = radius, y = radius, r =radius
  var shim = 100.0;
  var componentWidth = $("#palette").width(); //css('width');
  var componentHeight = $("#palette").height(); //css('height');
	//console.log("cwidth:" + componentWidth);
	//console.log("cwidth:" + shim + " " + size);
  var wper = (componentWidth-shim)/size;   // width per item
	

  var posx = shim/2.0;

  //console.log("length" + size);
  //console.log("wper" + wper);
  R.endpoint(posx, 75-40, wper, r*2, (wper>10 ? true : false), cpt["background"].upper, null);

  for(i=0; i<size; i++){
    var incr = parseInt(30/wper)+1;
    if(i%incr==0) R.text(posx, 75-10, Number(levels[i]).toString()).attr({ "font-size": 12 });
    R.cell(posx, 75-40, wper, r*2, colors[i], (wper>10 ? true : false), red[i], green[i], blue[i], alpha[i]);
    posx+=wper;
  }
  R.text(posx, 75-10, Number(cpt["foreground"].lower.level).toString()).attr({ "font-size": 12 });
  R.endpoint(posx, 75-40, wper, r*2, (wper>10 ? true : false), null, cpt["foreground"].lower);
}

function drawTitle(meta, spec, paletteName, description, variableDesc, layer, metric, displayUnits, modelUpdate){
  //var R = Raphael("palette");
  	var componentWidth = $("#palette").width(); //css('width');
	console.log("cw:" + componentWidth);
        var t = R.text(componentWidth/2.0, 9, description).attr({ "font-size": 18 });
        var t = R.text(componentWidth/2.0, 25, variableDesc + " "  + modelUpdate + " -- [" + spec.display_units + "]").attr({ "font-size": 14 });
	/**
                console.log(paletteName);
                console.log(description);
                console.log(layer);
                console.log(metric);
                console.log(displayUnits);
                console.log(modelUpdate);
	*/
        
}


//function loadLegend (paletteName, description, variableDesc, layer, metric, displayUnits, modelUpdate) {
//	return loadLegendCWS(paletteName, description, '', layer, metric, displayUnits, modelUpdate);
//}
function loadLegend (paletteName, description, variableDesc, layer, metric, displayUnits, modelUpdate, meta, spec) {

	
	R.clear();
	console.log("paletteName::" + paletteName);

	if(!paletteName){
   		paletteName = "mean.cpt";
	}
	
  if('pall' in queryString){
        paletteName = queryString.pall;
   }

        $.ajax({url: "xmlProxy.php?client=alex&client_password=trust_me&metric="+metric+"&product=palette&palette.name="+paletteName+"&format=json", 
                success: function(result){
                var palette = eval('(' + result + ')');
                var psize = palette.ColorPalette.size;
                var hues=new Array();
                var red=new Array();
                var green=new Array();
                var blue=new Array();
                var alpha=new Array();
                var levels=new Array();
		var cpt = palette.ColorPalette.table;
                for(i=0; i<  psize; i++){
                        hues[i]= palette.ColorPalette.table[i].lower.H;
                        levels[i]= palette.ColorPalette.table[i].lower.level;   
                        red[i]= palette.ColorPalette.table[i].lower.red;   
                        green[i]= palette.ColorPalette.table[i].lower.green;   
                        blue[i]= palette.ColorPalette.table[i].lower.blue;   
                        alpha[i]= palette.ColorPalette.table[i].lower.alpha;   
                }
		
                drawCells(hues, levels, psize, red, green, blue, alpha, cpt);
                drawTitle(meta, spec, paletteName, description, variableDesc, layer, metric, displayUnits, modelUpdate);
        }});

}

function Demo () {
	 //alert('do nothing');
}

function formatZ(numS){
  num = parseFloat(numS);
  if(num=="NaN") return "*";
  if(num==0) return "0";
  if(num<0.001) return num;
  if(num<0.01) return num.toFixed(3);
  if(num<0.1) return num.toFixed(2);
  if(num<1) return num.toFixed(1);
  return num.toFixed(0);
}
function toggleMetric(checkbox) {
	metric = checkbox.checked;
	$("#level_select").change();
}
function toggleLayer(checkbox, product) {
    if (checkbox.checked) {
        AddLayer(product);
	if(product.endsWith("e_0")){
	    loadLegend(product, descMap[product],product, metric);
	}
    } else {
        RemoveLayer(product);
    }
}

function RemoveLayer(product) {
    map.removeLayer(tileLayerMap[product]);
}

function AddLayer(product) {
    var attribution = new ol.Attribution({
        html: 'CWTiles &copy; <a href="http://www.customweather.com/"</a>'
    });
    var tileSource = new ol.source.XYZ({
        attributions: [attribution],
        url: 'http://maps-beta.customweather.com/smt/'+cwApiKey+'/'+product+'/{z}/{x}/{y}.png'
    });

    var tileLayer = new ol.layer.Tile({
        source: tileSource
    });
    tileLayer.setVisible(true);
    tileLayer.setOpacity(currentOpacity);
    map.getLayers().push((tileLayer));
    tileLayerMap[product] = tileLayer;

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





function getActiveModel(source){
    var indx=0;
    for(indx=0; indx<meta.length; indx++){
        if (meta[indx].hasOwnProperty(source)) {
            return meta[indx][source];
        }
    }
    return null;
}

function clearanim(){
    stopAnimate();
    counter=0;
    forecastDates=[];

    if(tileCollection.length!=0){
        for(var i=0; i<tileCollection.length; i++){
            map.removeLayer(tileCollection[i]);
        }
        tileCollection=[];
    }
        document.getElementById("cw_title_h2").innerHTML="CustomWeather MapTile Demo";
        document.getElementById("cw_title_h3").innerHTML="";

}

function toggleNavigation(checkbox){
    if(checkbox.checked){
        $( "#accordion" ).hide();
        document.getElementById('map').style.width = '1050px';
    }else{
        document.getElementById('map').style.width = '750px';
        $( "#accordion" ).show();
    }
}

function animinit(_source, _layer, _level, _run){

    activeCWSVariable = cwsspec[_source][_layer+":"+_level];
    var controls = document.getElementById("controls");
   
    $("#controls").show();

    clearanim();
    console.log(_source + "::" + _layer + "::" +  _level);
    var intervalTimerId = null;

    var cwApiKey = 'tx77ySpkpTu4y0Q_1QLgE82net5EykLQT8L5KCjCpjwKCMjaOnqB8kjDR-5csooY86CeRKSrgv2QMaxUO2Rvpg==';

    //console.log("activemodel:" + _source);
    activeModel = getActiveModel(_source);
    //console.log("activemodel:" + activeModel);

    var cwsLatest = new Date(_run + "Z");
    var now = cwsLatest;
    var initTime = cwsLatest;
    var initTimeStr = initTime.toISOString().substring(0, 19);


    numFrames = activeModel.num_timesteps/_incr;
    document.getElementById("slider").max=numFrames-1;
    var futureAnimTimestep = activeModel.fore_timestep_min*60*1000*_incr;
    var futureInitialOffset = 0;
    var futureInitialModulus = activeModel.fore_timestep_min*60*1000;
    var futureStartTimeMs = now.getTime() - now.getTime() % futureInitialModulus + futureInitialOffset;

    var futureLayerName = "cws/" + _source + "/" + _layer + "/" + _level + "/" + initTimeStr;
    for(ii=0;ii<activeModel.forecast_dates.length;ii++){
        forecastDates.push(new Date(activeModel.forecast_dates[ii] + "Z"));
	//console.log(moment.utc(activeModel.forecast_dates[ii] + "Z").format().substring(0, 19));
    }

    for(ii=0;ii<numFrames;ii++){
        var iterDate = forecastDates[ii];
        var ts = iterDate.toISOString().substring(0, 19);
        var isPast = iterDate.getTime()<now.getTime();
        var layerName = futureLayerName;
        var attribution = new ol.Attribution({
            html: 'CWTiles &copy; <a href="http://www.customweather.com/'+ii+'"</a>'
        });
        var tileSource = new ol.source.XYZ({
            attributions: [attribution],
            url: 'http://maps-beta.customweather.com/smt/'+cwApiKey+'/'+layerName+'/' + ts + '/{z}/{x}/{y}.png' 
        });
        var tile = new ol.layer.Tile({
            source: tileSource
        });
        tile.setVisible(true);
        tile.setOpacity(0.0);
        tileCollection.push(tile);
        map.addLayer(tile);
        var totalCount=0;
        tileSource.setTileLoadFunction((function() {
            var numLoadingTiles = 0;
            var tileLoadFn = tileSource.getTileLoadFunction();
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
    startAnimate();
}



            //var _url = 'beast'; //atileSource.getURL();
            //var _attra = tileSource.getAttributions();
            //var _attr = _attra[0];
            //var _html = _attr.getHTML();
//startAnimate();

function getGMTOffset() {
    off = 0;
    if(map){
        off = Math.round((ol.proj.transform(map.getView().getCenter(),  'EPSG:3857', 'EPSG:4326')[0])/15);
        //console.log(off);
    }
    return off;
}

function formatDate(date, activeModel){
	if(activeModel.time_unit === "MONTH"){
		return 'VALID FOR: ' + moment(date).format('MMMM  YYYY').toUpperCase() ;
	}
	if(true){
		return 'VALID FOR: ' + moment(date).format('D MMM hh:mm').toUpperCase() + 'Z';
	}
	
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

// register 
function speedChange(){ 
	// map interval {0, 1} to {-1, 1} -1 is slowest and 1 is fastest
	var speed = 2.0*(parseInt(document.getElementById("speed").value)/100.0)-1.0;

	// now reverse map this to {10^1, 10^-1} 10 is slowest and .1 is fastest (interval time)
	this.animationDelay = Math.pow(10, -speed) * 1000;
        clearInterval(this.intervalTimerId);
        this.intervalTimerId = setInterval('updateAnimation()', animationDelay);
}
function opacityChange(){ 
    this.currentOpacity = parseInt(document.getElementById("opacity").value)/100.0;
	console.log(currentOpacity);
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

		//  
        /**if(this.counter>this.numFrames){
            interval = fast;
        }*/
        this.intervalTimerId = setInterval('updateAnimation()', animationDelay);
    }
    console.log("startAnimation:");
}

function updateAnimation(){
    updateAnimationExplicit(false);
}

function updateAnimationExplicit(explicitCall){
    var currentFrame = this.iter%(tileCollection.length);
    //console.log("updateAnimation:" + explicitCall + ":" + currentFrame);


    var currentFrame = this.iter%(tileCollection.length);
    // console.log("updateAnimationExplicit("+explicitCall +"):" + new Date().getTime() + ": iter :" + this.iter + ":current frame:" + currentFrame);

    // If this was called from Interval Timer than set slider
    if(!explicitCall){
        var iter_ = parseInt(document.getElementById("slider").value);
        if(iter_!=currentFrame){
            document.getElementById("slider").value = currentFrame;
        }
    }

    // Update the timestamp

    var ts = formatDate(forecastDates[currentFrame], activeModel);

    //$('#isodate').html(ts + " ["+ currentFrame + "]");
    //document.getElementById("isodate").value = ts;
    $('#isodate').html("<strong>"+ts+"</strong>");


    //var vText = document.getElementById("cwtitle");
     document.getElementById("cw_title_h2").innerHTML=activeModel.description;
     document.getElementById("cw_title_h3").innerHTML=activeCWSVariable.description + "@" + activeCWSVariable.level + "&nbsp; Units:" + activeCWSVariable.display_units;

    // turn on current frame and off all others
    for(i=0; i<tileCollection.length; i++){
        if(i==(currentFrame)){ // +1 because base is in frame
            tileCollection[i].setOpacity(currentOpacity);
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
        //clearInterval(this.intervalTimerId);
        //this.intervalTimerId = setInterval('updateAnimation()', 2000);
    }
}




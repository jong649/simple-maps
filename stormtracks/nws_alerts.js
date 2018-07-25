
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
	center: new google.maps.LatLng(40, -135),
	mapTypeId:  google.maps.MapTypeId.ROADMAP
    };
    gMap = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
    warnings = new google.maps.Data();
    warnings.loadGeoJson('http://clients.customweather.com/templates/IAAI/maptile/nws_alerts/nws_alerts_poly.json');
    warnings.setMap(gMap);
    warnings.setStyle(warningStyle);
    warnings.addListener('click',  function (event) {
	handleMouseOver(event);
    });
    watches = new google.maps.Data();
    watches.loadGeoJson('http://clients.customweather.com/templates/IAAI/maptile/nws_alerts/nws_alerts_poly.json',{}, function (d){

	for(var i=0; i<d.length; i++){
	    var f = d[i];
	    var warning = isWarning(f);
	    var ev = f.getProperty("event").toUpperCase();
	    if(colorMap[ev]==null) continue;
	    if(ev.indexOf("SMALL CRAFT ADVISORY")==0 && ev!=="SMALL CRAFT ADVISORY") continue;

	    if(warning){
		warningKeys.push(ev);
	    }else{
		watchKeys.push(ev);
	    }
	}	
	warningKeys = warningKeys.unique().sort();
	watchKeys = watchKeys.unique().sort();
	drawCells(warningKeys);
    });
    watches.setMap(null);
    watches.setStyle(watchStyle);
    watches.addListener('click',  function (event) {
	handleMouseOver(event);
    });
	// IAAI LOCATION MARKERS
	//setMarkers();

}

function isWarning(feature){
    var ev = feature.getProperty('event').toUpperCase();
    if(ev.indexOf("WATCH")>=0) return false;
    if(ev.indexOf("WARNING")>=0) return true;
    if(ev.indexOf("STATEMENT")>=0) return false;
    if(ev.indexOf("OUTLOOK")>=0) return false;
    if(ev.indexOf("ADVISORY")>=0) return false;
    
    var loc = feature.getProperty('location_list');
    if(loc===null || loc===undefined || loc.length<4) return false;
    return loc.substring(2, 3) === 'C';
}

function warningStyle(feature) {
    if(!isWarning(feature)) return  { visible: false };
    var ev = feature.getProperty('event').toUpperCase();
    var color = colorMap[ev];

    if(color === undefined || color === null) color='grey';
    
    return {
	fillColor: color,
	strokeColor: color,
	strokeWeight: 2
    };
}

function watchStyle(feature) {
    if(isWarning(feature)) return  { visible: false };
    var ev = feature.getProperty('event').toUpperCase();
    var color = colorMap[ev];
    
    if(color === undefined || color === null) color='grey';
    
    return {
	fillColor: color,
	strokeColor: color,
	strokeWeight: 2
    };
}
function getPopulation(f){
    var locId = f.getProperty("location_list");
    var pop = population[locId];
    if(!pop){
	var list = zones[locId];
	if(list){
	    console.log(list);
	    pop=0;
	    for(var i=0; i<list.length; i++){
		var id = list[i];
		console.log(id + ":" + population[id]);
		var p = population[list[i]];
		if(p){
		    console.log(list[i] + ":" + p);
		    pop = pop + p;
		}
	    }
	    console.log(pop);
	}else{
	    pop = "< 100";
	    return pop;
	}
    }
    return pop;
}
function  handleMouseOver(event){
    var f = event.feature;
    var alertType  = isWarning(f) ? "NWS Warning" : "NWS Watch";
    var office = f.getProperty("nws_office");
    var locId = f.getProperty("location_list");
    var pop = getPopulation(f);
    var html = [
	'<div id="InfoPopup" class="info-popup">',
	'<div class="row title">',
	'<div class="col-sm-10 text-center"><h3>' + alertType +  "&nbsp;:&nbsp;" + f.getProperty("event") + '</h3></div>',
	'</div>',
	'<div class="row content-top">',
	'<div class="col-sm-12 text-center"><strong>Message:</strong> ' + f.getProperty("message") + '<br><br></div>',
	'</div>',
	'<div class="row"><div class="col-sm-4 text-right"><strong>Start Time:</strong> '+f.getProperty("issued_at") +' </div></div>',
	'<div class="row"><div class="col-sm-4 text-right"><strong>Expire Time:</strong> '+f.getProperty("valid_until") +' </div></div>',
	'<div class="row"><div class="col-sm-4 text-right"><strong>Timezone:</strong> '+f.getProperty("timezone") +' </div></div>',
	'<div class="row"><div class="col-sm-4 text-right"><strong>NWS Issuing Office:</strong> '+f.getProperty("nws_office") +' </div></div>',
	'<div class="row"><div class="col-sm-4 text-right"><strong>Location:</strong> '+f.getProperty("location_list") +' </div></div>',
	'<div class="row"><div class="col-sm-4 text-right"><strong>Population Affected:</strong> '+pop +' </div></div>',
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



var WX=840;
var HX=640;
var palette = document.getElementById("palette");
var R = Raphael(palette, WX, HX);

Raphael.fn.cell = function (x, y, w, h, hue, stroke) {
    return this.set(this.rect(x, y, w, h, 0).attr({fill : hue, opacity: 1 }));
};

function drawCells(vec){
    R.clear();
    var size=12;
    var width = WX/size;   // width per item
    var height = 20;
    var cnt = 0;
    var xstart = 0;
    var ok=true;
    var shim = 3;
    for (var i = 0; i < vec.length; i++) {
	var key = vec[i];
        var color = colorMap[key];
	if(i%8==0){
	    xstart=250*i/8;
	    cnt=0;
	}
        R.text(xstart+width+10, cnt*(20+shim)+10, key).attr({'text-anchor': 'start'});
        R.cell(xstart, cnt*(20+shim), width, height, color, true);
        cnt++;
    }
}


function setMarkers(){


   var i=0;
  for (i = 0; i < activeLocations.length; i++)
    {
	var location = activeLocations[i];

        var warnColor =  location.region_color;
        
        var warnImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + warnColor,
        new google.maps.Size(21, 34),
        new google.maps.Point(0,0),
        new google.maps.Point(10, 34));
     	
     	var pinShadow = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_shadow",
        new google.maps.Size(40, 37),
        new google.maps.Point(0, 0),
        new google.maps.Point(12, 35));
        
        var alert =  location.isalert;
        var _lat = location.latitude;
        var _lon = location.longitude;
        latlngset = new google.maps.LatLng(_lat, _lon);
        var marker = new google.maps.Marker({
                map: gMap,
                title: name ,
                position: latlngset,
                icon: warnImage,
                shadow: pinShadow,
		loc: location
        }) ;
	facArray.push(marker);
        marker.addListener('click',
            function(d,e,f,g) {
		var loc = this.loc;
		console.log(marker);
        	var name = loc.facabbr;
        	var branch = loc.branch_number;
        	var region = loc.region_name;
        	var _lat = loc.latitude;
        	var _lon = loc.longitude;
        	var _id = loc.id;

                /* close the previous info-window */
        	var content = '<div><p><b>Branch: ' + name +  ' [ # ' + branch + ' ]</b></p></div>' +
            	'<div><p>City: ' + loc.city + ', '  + loc.state_code  + '</p></div>' +
            	'<div><p>Region: ' + region + '</p></div>' +            
	    	'<div><a href="http://clients.customweather.com/templates/IAAI/current.php?trial_ID=iaai_portal&wid='+_id+'&metric=false&language=en" target="_blank">'+
            	'Weather Details</a></div>';
                facInfo.setContent(content);
                facInfo.open(gMap,this);
            }
        );

    }
}



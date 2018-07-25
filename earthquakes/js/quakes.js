var quakeArray;
var equmap,infobox;
quakeArray = new Array();
quakeArray['error'] = "";

function quickquakeXMLLoad () {
    if (window.XMLHttpRequest) {
        var xmlhttp=new XMLHttpRequest();
    } else {
        var xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
        
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4)
            {		
                if(xmlhttp.responseXML) {
                    var item = xmlhttp.responseXML.getElementsByTagName('item');		    

		    var index = 0;


                    //var index = 0;
                    //var nox = item.length;
		    //for(var i=nox-1;i>-1;i--) {
		    for(var i=0;i<(item.length);i++) {
			try { var daysOld = item[i].getElementsByTagName('cw:daysold')[0].childNodes[0].nodeValue; }
			catch (e) { var daysOld = item[i].getElementsByTagName('daysold')[0].childNodes[0].nodeValue; }
			
			if(!quakeArray[daysOld]) { quakeArray[daysOld] = new Array(); index = 0; }
                        quakeArray[daysOld][index] = buildQuakeData(item[i]);
			index++;
                    }
                    //console.log(daysOld);
                    loadEQ(daysOld);
                }
            }
    }
    
    xmlhttp.open("GET", "http://xml.customweather.com/xml?product=earthquake&format=georss&apikey=hbWKEwk8ozUK1C7cIYyUmdt_sIuccwKvteo3gi0sMIBhEBnBsXw6r5G1MgpchBtf");
    xmlhttp.send();
}

function buildQuakeData (obj) { 
    var quakeTarget = new Array();    
    
    try { var t = obj.getElementsByTagName('cw:time')[0].childNodes[0].nodeValue; }
    catch (e){ var t = obj.getElementsByTagName('time')[0].childNodes[0].nodeValue; }

    try { var lat = obj.getElementsByTagName('geo:lat')[0].childNodes[0].nodeValue; }
    catch (e){ var lat = obj.getElementsByTagName('lat')[0].childNodes[0].nodeValue; }
    
    try { var long = obj.getElementsByTagName('geo:long')[0].childNodes[0].nodeValue; }
    catch (e){ var long = obj.getElementsByTagName('long')[0].childNodes[0].nodeValue; }
    
    try { var depth = obj.getElementsByTagName('cw:depth')[0].childNodes[0].nodeValue; }
    catch (e){ var depth = obj.getElementsByTagName('depth')[0].childNodes[0].nodeValue; }
    
    try { var magn = obj.getElementsByTagName('cw:magn')[0].childNodes[0].nodeValue; }
    catch (e){ var magn = obj.getElementsByTagName('magn')[0].childNodes[0].nodeValue; }
    
    var title = obj.getElementsByTagName('title')[0].childNodes[0].nodeValue;

    quakeTarget['time'] = t;
    quakeTarget['location'] = title;
    quakeTarget['latitude'] = lat;
    quakeTarget['longitude'] = long;
    quakeTarget['depth'] = depth;
    quakeTarget['magnitude'] = magn;
    return quakeTarget;
}

function checkForEQArray() {
    return quakeArray;
    var recent_quakes = quakeArray;
    if(!recent_quakes) { recent_quakes = new Array(); recent_quakes['error']=1; return recent_quakes; }
    else { return recent_quakes;}
}



function getEQMaps(lat, lon)
{
    var equmap = new Microsoft.Maps.Map('#myeqMap', {
            credentials: 'AlTKIdLbd9a0y7u1gvJDbJn_5Bm3aG0PfwysxiiV71TkSYPsUXKAdOo1q5eHAfVY',
                mapTypeId: Microsoft.Maps.MapTypeId.aerial, //Hide the base map tile layer.
                maxZoom: 15, //Tiles are only available for the first 15 zoom levels.
                center: new Microsoft.Maps.Location(39.998467, -101.456718),
                zoom: 4,
                showDashboard: false 
        });

  var infobox = new Microsoft.Maps.Infobox( equmap.getCenter(), {
            visible: false
        });

        //Assign the infobox to a map instance.
        infobox.setMap(equmap);
//console.log(infobox);
return [equmap, infobox]; 
}


 /* name:  quake.js                           */
 /* title: Beta Earthquake Controller         */
 /* info:  load, update required data display */
 /* requires args: offset=current_day_index   */

function mouseoverbingEvent(infobox,title,info,lat,lon) {

 var loc = new Microsoft.Maps.Location(lat,lon);
        //Make sure the infobox has metadata to display.
            //Set the infobox options with the metadata of the pushpin.
            infobox.setOptions({
                //Use the location of where the mouse was clicked to position the infobox.
                location: loc, 
                title: title,
                description: info,
                visible: true
            });

    }

function mouseoutbingEvent(infobox) {
        infobox.setOptions({ visible: false });
    }

function clickEvent(e){
    equmap.HideInfoBox();
    
    var shape = equmap.GetShapeByID(e.elementID);
    var z = shape.GetZIndex();
    var offset = shape.GetZIndexPolyShape();
    var pts = shape.GetPoints();
    var lat = pts[0]['Latitude']; 
    var lon = pts[0]['Longitude'];
    var zoom = 4;

    updateBingMap (lat, lon, zoom, z, offset);
    //var focus = new VELatLong(pts[0]['Latitude'], pts[0]['Longitude']);
    //map.SetCenterAndZoom(focus, 4);
    //map.ShowInfoBox(shape, new VEPixel(100,20));
    //map.ShowInfoBox(shape);
}

function addQuakeGraphic (i, EQ, offset, rings, equmap, infobox) {

	if(rings>=7) {
	    var x = 7;
	    var distance = ((x+1)*40) + ((x*x)*15);
	    var circle = drawCircle(i, offset, new Microsoft.Maps.Location(EQ[i]['latitude'],EQ[i]['longitude']), distance, EQ[i]['location'], 'Time: ' + EQ[i]['time'] + '\nMagnitude: ' + EQ[i]['magnitude'] + '\nDepth(km): ' + EQ[i]['depth'],infobox );		
	    equmap.entities.push(circle);
	}

	if(rings>=6) {
	    var x = 6;
	    var distance = ((x+1)*40) + ((x*x)*15);
	    var circle = drawCircle(i, offset, new Microsoft.Maps.Location(EQ[i]['latitude'],EQ[i]['longitude']), distance, EQ[i]['location'], 'Time: ' + EQ[i]['time'] + '\nMagnitude: ' + EQ[i]['magnitude'] + '\nDepth(km): ' + EQ[i]['depth'],infobox );		
	    equmap.entities.push(circle);
	}

	if(rings>=5) {
	    var x = 5;
	    var distance = ((x+1)*40) + ((x*x)*15);
	    var circle = drawCircle(i, offset, new Microsoft.Maps.Location(EQ[i]['latitude'],EQ[i]['longitude']), distance, EQ[i]['location'], 'Time: ' + EQ[i]['time'] + '\nMagnitude: ' + EQ[i]['magnitude'] + '\nDepth(km): ' + EQ[i]['depth'],infobox );		
	    equmap.entities.push(circle);
	}

	if(rings>=4) {
	    var x = 4;
	    var distance = ((x+1)*40) + ((x*x)*15);
	    var circle = drawCircle(i, offset, new Microsoft.Maps.Location(EQ[i]['latitude'],EQ[i]['longitude']), distance, EQ[i]['location'], 'Time: ' + EQ[i]['time'] + '\nMagnitude: ' + EQ[i]['magnitude'] + '\nDepth(km): ' + EQ[i]['depth'],infobox );		
	    equmap.entities.push(circle);
	}

	if(rings>=3) {
	    var x = 3;
	    var distance = ((x+1)*40) + ((x*x)*15);
	    var circle = drawCircle(i, offset, new Microsoft.Maps.Location(EQ[i]['latitude'],EQ[i]['longitude']), distance, EQ[i]['location'], 'Time: ' + EQ[i]['time'] + '\nMagnitude: ' + EQ[i]['magnitude'] + '\nDepth(km): ' + EQ[i]['depth'],infobox );
	    equmap.entities.push(circle);	
	}

	if (rings>=2) {
	    var x = 2;
	    var distance = ((x+1)*40) + ((x*x)*15);	
	    var circle = drawCircle(i, offset, new Microsoft.Maps.Location(EQ[i]['latitude'],EQ[i]['longitude']), distance, EQ[i]['location'], 'Time: ' + EQ[i]['time'] + '\nMagnitude: ' + EQ[i]['magnitude'] + '\nDepth(km): ' + EQ[i]['depth'],infobox );	
	    equmap.entities.push(circle);
	}

	if (rings>=1) {
	    var x = 1;
	    var distance = ((x+1)*40) + ((x*x)*15);
	    var circle = drawCircle(i, offset, new Microsoft.Maps.Location(EQ[i]['latitude'],EQ[i]['longitude']), distance, EQ[i]['location'], 'Time: ' + EQ[i]['time'] + '\nMagnitude: ' + EQ[i]['magnitude'] + '\nDepth(km): ' + EQ[i]['depth'],infobox );		
	    equmap.entities.push(circle);
	}	

	if (rings) {
	    var x = 1;
	    var distance = (((x+1)*40) + ((x*x)*15))/2;
	    var circle = drawCircle(i, offset, new Microsoft.Maps.Location(EQ[i]['latitude'],EQ[i]['longitude']), distance, EQ[i]['location'], 'Time: ' + EQ[i]['time'] + '\nMagnitude: ' + EQ[i]['magnitude'] + '\nDepth(km): ' + EQ[i]['depth'],infobox );		
	    equmap.entities.push(circle);
	}	
}

function drawCircle(z,offset,origin,radius_in_km,title,info,infobox)
{  

    var earthRadius = 6371;
    var lat = (origin.latitude*Math.PI)/180; 
    var lon = (origin.longitude*Math.PI)/180; 
    var radius_in_degrees = radius_in_km/111; //111 km/deg at the equator (roughly)
    var radius_in_radians = (Math.PI * radius_in_degrees)/180.0;
    var d = Math.cos(lat) * radius_in_radians;  
    var points = new Array();
    for (i = 0; i <= 360; i=i+2) 
	{     
	    //var point = new VELatLong(0,0);     
            var point = new Microsoft.Maps.Location(0, 0);      
	    var bearing = i * Math.PI / 180;
	    point.latitude = Math.asin(Math.sin(lat)*Math.cos(d) + Math.cos(lat)*Math.sin(d)*Math.cos(bearing));
	    point.longitude = ((lon + Math.atan2(Math.sin(bearing)*Math.sin(d)*Math.cos(lat), Math.cos(d)-Math.sin(lat)*Math.sin(point.latitude))) * 180) / Math.PI;

	    point.latitude = (point.latitude * 180) / Math.PI;

//var newpoint= new Microsoft.Maps.Location(point.Latitude,point.Longitude);
	    points.push(point);
	}  
//alert(points);
    //var circle = new VEShape(VEShapeType.Polygon, points);
    //circle.HideIcon();
    //circle.SetLineWidth(1);
    //circle.SetLineColor(new VEColor(255,0,0,.5));
    //circle.SetFillColor(new VEColor(255,255,0,.2));

    //circle.SetCustomIcon(''); //custom image file
    //circle.ShowIcon();
    //circle.SetZIndex(z, offset);
    //circle.SetTitle(title);
   // circle.SetDescription("<div>" + info + "</div>");
    //circle.SetPhotoURL("../img/earthquake.gif");
   var circle = new Microsoft.Maps.Polygon(points, {
            fillColor: 'rgba(255, 255, 0, 0.2)',
            strokeColor: 'rgba(255, 0, 0, 0.5)',
            strokeThickness: 2,
            description: 'Pin description'
        });

        //Add an click event handler to the IPrimitive.
        Microsoft.Maps.Events.addHandler(circle, 'mouseover', function (e) { mouseoverbingEvent(infobox,title,info,origin.latitude,origin.longitude); });
        Microsoft.Maps.Events.addHandler(circle, 'mouseout', function (e) { mouseoutbingEvent(infobox); });
        

//console.log(circle);
    return circle;
}  

function loadEQ (offset) {
        
    var earthquake = new Microsoft.Maps.Layer();
    var eqArray = quakeArray;
    var widget = new quakeWidget('mfQuakeWidgetBeta', eqArray, offset, eqArray.length);
    //console.log(eqArray[offset][0]['latitude']);
    //insert wrapper object
    //Execute display function   
    widget.showWrapper();
    if (eqArray['error']){ widget.showError(0); }       
    else { widget.showDay(0); }
 
    var codes = getEQMaps(eqArray[offset][0]['latitude'], eqArray[offset][0]['longitude']);   
    //map.EnableShapeDisplayThreshold(false);
    //var handlerId = Microsoft.Maps.Events.addHandler(map, 'onmouseover', mouseoverEvent);
    //var secondhandlerId = Microsoft.Maps.Events.addHandler(map, 'onclick', clickEvent);
    //map.AttachEvent("onmouseover", mouseoverEvent);
    //map.AttachEvent("onclick", clickEvent);
    var equmap = codes[0];
var infobox = codes[1];

    var EQ = eqArray[offset];

    for(var i = 0; i < EQ.length; i++) {
	var magnitude = eqArray[offset][i]['magnitude'];
	var rings = (Math.floor(magnitude*100))/100;
//console.log(rings);
	var gfx = addQuakeGraphic(i, eqArray[offset], offset, rings, equmap, infobox);
    }    
    updateBingMap (eqArray[offset][0]['latitude'], eqArray[offset][0]['longitude'], 4, 0, offset, equmap);
}

function updateEQ (offset) {

    var eqArray = quakeArray; /* ajax load-data or basic jsp parser    */
    var widget = new quakeWidget('mfQuakeWidgetBeta', eqArray, offset, eqArray.length);
     var earthquake = new Microsoft.Maps.Layer();

    //Execute display function
    if (eqArray['error']){ widget.showError(0); }       
    else { widget.showDay(0); }

    var upcodes = getEQMaps(eqArray[offset][0]['latitude'], eqArray[offset][0]['longitude']);
   var equmap = upcodes[0];
var infobox = upcodes[1];
    var EQ = eqArray[offset];

    for(var i = 0; i < EQ.length; i++) {
	var magnitude = eqArray[offset][i]['magnitude'];
	var rings = (Math.floor(magnitude*100))/100;
//console.log(rings);
	var gfx = addQuakeGraphic(i, eqArray[offset], offset, rings, equmap, infobox);
    }    
    updateBingMap (eqArray[offset][0]['latitude'], eqArray[offset][0]['longitude'], 4, 0, offset, equmap);
}

function updateBingMap (lat, lon, zoom, z, offset, equmap) {

    //scrollTo(0, 300);
    equmap.setView({ center: new Microsoft.Maps.Location(lat, lon) }); 
    //var focus = new VELatLong(lat, lon);
   // map.SetCenter(focus);
   
    for(var m=0; m<quakeArray[offset].length; m++) { document.getElementById('ds'+m).style.backgroundColor=""; }
    //document.getElementById('ds'+z).style.backgroundColor="yellow";
}


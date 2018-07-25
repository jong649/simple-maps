
function AddLayer(product) {
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
  tileLayer[product]= new Microsoft.Maps.TileLayer({ mercator:tileSourceUrl, opacity:0.65 });
  map.entities.push(tileLayer[product]);
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
    map.entities.remove(tileLayer[product]);
  }
}

function toggleLayer(checkbox, product) {
  if (checkbox.checked) {
    AddLayer(product);
  } else {
    RemoveLayer(product);
    hideLegend();
  }
}
 
function loadshape(){

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
              	  	 var polygoncolor = new Microsoft.Maps.Color(100,100,0,100);
              		 var cone_shape = new Microsoft.Maps.Polygon(cones[i],{fillColor: polygoncolor, strokeColor: polygoncolor});			 
			 shapeLayer['hurricane'].cone[i] = cone_shape;
			 map.entities.push(cone_shape);
		  }
	 	  
		  shapeLayer['hurricane'].line = new Array();
		  for(var x=0;x<lines.length;x++) {
		  	  var polygoncolor = new Microsoft.Maps.Color(100,100,0,100);
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
	      var location = new Microsoft.Maps.Location(h.lat,h.long);
	      map.setView({zoom:5, center: location});
	    }
	    var url = "?product=hurricane&client=tile_demo2&apikey=zr_FX9XukUgZetYI9JIINzkhlcktJjS3yqEV3rKXuGFiNCDT1gtcCGKuFkc1jQzl&format=georss&metric=false";
            getGEORSS(url, callback);
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
  return false;


}

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
		       data.html += "<br />" + "Latitude: " + lat + "<br />Longitude: " + long + "<br />" + desc + ".";

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

		       		var peg = point.split(" ");
		       		var lat = peg[0];
		       		var long = peg[1];

		       		var data = new Object();
		       		data.html = title + "<br />" +  desc;

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

	    pins[id].box.setHtmlContent("<div style='z-index: 3000; position: relative; left: 24px; top: -55px; background-color: #FFF; padding: 10px; border: 3px solid #EEEEEE; width: 220px; min-height: 100px'>" +
	    "<div style='position:absolute; left: -20px; width:0px; height:0px; border-bottom:15px solid transparent; border-top:15px solid transparent; border-right:20px solid #FFF; font-size:0px; line-height:0px;'></div>"+
	    "<div style='position: relative; width: 200px; min-height: 100px;'>	           "+pins[id].html+"</div></div>");

    }
}

function HideLoc(e){
    if (e.targetType == 'pushpin'){
        var id = e.target.getZIndex();
            pins[id].box.setOptions({ visible:false });
	    pins[id].box.setHtmlContent("");
    }
}

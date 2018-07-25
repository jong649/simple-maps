var css = "<style>\n .cw-legend{max-width: 468px; border: 1px solid #CCCCCC; background-color: #FFFFFF; padding: 3px; margin: 10px}\n .cw-legend table{font-size: 8px; font-weight: bold; font-family: arial; text-align: left; width: 18px;}\n .cw-legend-tile{width: 14px; height: 12px; margin-left: 1px; margin-right: 1px}\n.cw-legend-unit{width: 14px;text-align:left;}\n.cw-legend-unit-box { min-width: 10px; text-align: right }\n .cw-legend-title{ margin: 0px 12px 0px 0px; color: #333; font-size: 11px; font-weight: bold }\n</style>";
var altcss = "<style>\n .cw-legend-alt{overflow: hidden; width: 340px; border: 1px solid #CCCCCC; background-color: #FFFFFF; padding: 3px; margin: 10px; cursor: pointer}\n .cw-legend-alt table{font-size: 8px; font-weight: bold; font-family: arial; text-align: left;}\n .cw-legend-tile-alt{width: 2px; height: 12px;}\n.cw-legend-unit-alt{width: 14px;text-align:left; }\n</style>";

var root = 'demoLegendDiv';
document.write("<div style='position:relative;'><div style='float: left; display: none' id='"+(root)+"'></div></div>"+css+altcss);

function cwLoadLegend(name, unit, callback) {
    if (window.XMLHttpRequest) { var xttp=new XMLHttpRequest();} 
    else {var xttp=new ActiveXObject("Microsoft.XMLHTTP");}        
    xttp.onreadystatechange=function() {
        if (xttp.readyState==4&&xttp.status==200) {			
	    if(xttp.responseText && callback) {
		callback(xttp);
	    }
	}
    }
    xttp.open("GET", "http://web-dev1.customweather.com/demos/maptiles/layer_info/xmlFEED.php?client=alex&client_password=trust_me&product=palette&palette.name="+name+"&metric="+unit+"&format=json", true);
    xttp.send();
};

function cwLoadCapabilities(name, callback) {
    if (window.XMLHttpRequest) { var xttp=new XMLHttpRequest();} 
    else {var xttp=new ActiveXObject("Microsoft.XMLHTTP");}        
    xttp.onreadystatechange=function() {
        if (xttp.readyState==4&&xttp.status==200) {			
	    if(xttp.responseText && callback) {
		var rawXMLText = xttp.responseText;			    
		var start = (rawXMLText.lastIndexOf('<Title>')+7);
		var end = rawXMLText.indexOf('</Title>', start);
		var length = (end)-start;
		var title = rawXMLText.substr(start,length);
		
		var extentTag = '<Extent name="time" default="';
		var strlength = extentTag.length;
		var start = rawXMLText.indexOf(extentTag,0)+strlength;
		var end = rawXMLText.indexOf('"',start);
		var length = (end)-start;
		var date = rawXMLText.substr(start,length);
		date = date.replace('T', ' ');
		callback(title, date);
	    }
	}
    }
    xttp.open("GET", "http://web-dev1.customweather.com/demos/maptiles/layer_info/imageFEED.php?REQUEST=capabilities&capdoc.extended=true&LAYERS="+name, true);
    xttp.send();
};

function hideLegend () {
    document.getElementById(root).innerHTML = "";
    document.getElementById(root).style.display = "none";
};

function loadLegend (name, lang) {
    if(!name) { var name = "mintemp_day_m_0"; }
    if(!new_units) { var new_units = ''; }
    var unit = (new_units == 'metric' ? 'true' : 'false');

    var callback = function (title, date) {
	var showLegendHtml = function (jSON) {
	    var palette = eval('(' + jSON.responseText + ')');
	    var units = palette.ColorPalette['units'];
	    var size = (palette.ColorPalette['size']);
	
	    var legend = new LegendPalette(palette.ColorPalette, title+"<small style='margin-left: 10px; float: right'>"+date+"</small>", units, size, root);
	    legend.show();
	}
	cwLoadLegend(name, unit, showLegendHtml);
    }
    //get title/date then load palette
    cwLoadCapabilities(name, callback);
};

function loadGradientLegend (name, lang) {
    if(!name) { var name = "mean"; }
    if(!new_units) { var new_units = 'english'; }
    var unit = (new_units == 'metric' ? 'true' : 'false');

    var callback = function (title, date) {
	var showLegendHtml = function (jSON) {
	    var palette = eval('(' + jSON.responseText + ')');
	    var units = palette.ColorPalette['units'];
	    var size = (palette.ColorPalette['size']);
	
	    var legend = new LegendPalette(palette.ColorPalette, title+"<small style='margin-left: 10px; float: right'>"+date+"</small>", units, size, root);
	    legend.showGradient();
	}
	cwLoadLegend(name, unit, showLegendHtml);
    }
    //get title/date then load palette
    cwLoadCapabilities(name, callback);
};

function LegendPalette (palette, layerTitle, units, size, root) {
    this._palette = palette;
    this._title = layerTitle;
    this._size = size; //int
    this._units = this.checkUnits(units); //string  F / C
    this._root = root; //divId
};

LegendPalette.prototype.buildSmoothLegend = function () {
    var palette = this._palette;
    var legend = palette;
    var size = this._size;
    var units = this._units;
    var layerTitle = this._title;

    var titlerow = "<div class='cw-legend-title'><center>"+(layerTitle)+"</center></div>";
    var table2 = titlerow + "<table border=0px cellpadding=0px cellspacing=0px><tr>";
    var toprow=""; var botrow="";
    toprow += "<td>&nbsp;&nbsp;&nbsp;</td>";
    toprow += "<td><DIV class='cw-legend-unit-alt'>"+(Math.round((legend.table[0].lower['level']*1)))+"</DIV></td>";		    
    botrow += "<td><DIV class='cw-legend-less-alt' style='border-color: transparent rgb("+legend.table[0].lower['red']+","+legend.table[0].lower['green']+","+legend.table[0].lower['blue']+") transparent transparent; border-style: solid; border-width:6px 12px 6px 2px;'></DIV></td>";

    var rate = Math.floor(size/20);		    
    for(i=0;i<size;i=i+rate) {var upper=Math.round(legend.table[i].upper['level']*1);
	toprow += "<td><DIV class='cw-legend-unit-alt'>"+(upper)+"</DIV></td>"; 
    }
    for(i=0;i<size;i++) {
			botrow += "<td><DIV class='cw-legend-tile-alt' style='background-color: rgb("+legend.table[i].upper['red']+","+legend.table[i].upper['green']+","+legend.table[i].upper['blue']+")'></DIV></td>";
    }i=i-1;
    botrow += "<td><DIV style='border-color: transparent transparent transparent rgb("+legend.table[i].upper['red']+","+legend.table[i].upper['green']+","+legend.table[i].upper['blue']+"); border-style: solid; border-width:6px 2px 6px 12px;'></DIV></td>";
    table2 += toprow;
    table2 += "<td><div>"+units+"</div></td>";
    table2 += "</tr></table>"+"<table border=0px cellpadding=0px cellspacing=0px><tr>";
    table2 += botrow;    
    table2 += "</tr></table>";
    table2 = "<div class='cw-legend-alt'>"+table2+"</div>";
    return table2;
};
    
LegendPalette.prototype.buildLegend = function () {
    var palette = this._palette;
    var size = this._size;
    var units = this._units;
    var layerTitle = this._title;

    var titlerow = "<div class='cw-legend-title'><center>"+(layerTitle)+"</center></div>";
    var table2 = titlerow + "<table width=0 border=0 cellpaddin=0 cellspacing=0><tr>";
    var toprow=""; var botrow="";
    
    toprow += "<td>&nbsp;&nbsp;&nbsp;</td>";
    toprow += "<td><DIV class='cw-legend-unit'>"+Math.round(palette.table[0].lower['level']*1)+"</DIV></td>";
    botrow += "<td><DIV class='cw-legend-less' style='border-color: transparent rgb("+palette.table['background'].lower['red']+","+palette.table['background'].lower['green']+","+palette.table['background'].lower['blue']+") transparent transparent; border-style: solid; border-width:6px 12px 6px 2px;'></DIV></td>";
    
    for(i=0;i<size;i++) {
	var level =  palette.table[i].upper['level']*1;
	if(level<1){level=(""+(Math.round(palette.table[i].upper['level']*100)/100)+"").substr(1,4);}
	else { level=Math.round(level);}
	toprow += "<td><DIV class='cw-legend-unit'>"+(level)+"</DIV></td>";
	botrow += "<td><DIV class='cw-legend-tile' style='background-color: rgb("+palette.table[i].upper['red']+","+palette.table[i].upper['green']+","+palette.table[i].upper['blue']+")'></DIV></td>";
    }
    
    botrow += "<td><DIV style='border-color: transparent transparent transparent rgb("+palette.table['foreground'].upper['red']+","+palette.table['foreground'].upper['green']+","+palette.table['foreground'].upper['blue']+"); border-style: solid; border-width:6px 2px 6px 12px;'></DIV></td>";
    table2 += toprow;
    table2 += "<td><div class='cw-legend-unit-box'>"+units+"</div></td>";
    table2 += "</tr></table><table border=0px cellpadding=0px cellspacing=0px><tr>";
    table2 += botrow;    
    table2 += "</tr></table>";
    table2 = "<div class='cw-legend'>"+table2+"</div>";
    return table2;
};

LegendPalette.prototype.show = function() {
    var table = this.buildLegend();    
    document.getElementById(this._root).innerHTML=table;
    document.getElementById(this._root).style.display="block";
};

LegendPalette.prototype.showGradient = function() {
    var table = this.buildSmoothLegend();    
    document.getElementById(this._root).innerHTML=table;
    document.getElementById(this._root).style.display="block";
};

LegendPalette.prototype.checkUnits = function(units_raw) {
    var units = units_raw;
    if (units == 'temperature_C' || units == 'temperature_deviation_C') {
	return "&deg;C";
    } else if(units == 'temperature_F' || units == 'temperature_deviation_F') {
	return "&deg;F";
    } else if (units == 'percent') {
	return "&#37;";
    }  else if (units == 'speed_kmh') {
	return "km/h";
    }  else if (units == 'speed_mph') {
	return "mph";
    }   else if (units == 'distance_cm') {
	return "cm";
    }	else if (units == 'distance_mm') {
	return "cm";
    }  else if (units == 'distance_in') {
        return "inches";
    } else if (units == 'rain_in'){
	return "inches";
    } else if (units == 'rain_mm'){
	return "mm";
    } else if (units == 'pressure_mb'){
	return "mb";
    } return ""; //unit info blank
};
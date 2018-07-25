var css = "<style>\n .cw-legend{max-width: 468px; border: 1px solid #CCCCCC; background-color: #FFFFFF; padding: 3px; margin: 10px}\n .cw-legend table{font-size: 8px; font-weight: bold; font-family: arial; text-align: left; width: 18px;}\n .cw-legend-tile{width: 14px; height: 12px; margin-left: 1px; margin-right: 1px}\n.cw-legend-unit{width: 14px;text-align:left;} .cw-legend-title{ margin: 0px 12px 0px 0px; color: #333; font-size: 11px; font-weight: bold }\n</style>";
var altcss = "<style>\n .cw-legend-alt{overflow: hidden; width: 340px; border: 1px solid #CCCCCC; background-color: #FFFFFF; padding: 3px; margin: 10px; cursor: pointer}\n .cw-legend-alt table{font-size: 8px; font-weight: bold; font-family: arial; text-align: left;}\n .cw-legend-tile-alt{width: 2px; height: 12px;}\n.cw-legend-unit-alt{width: 14px;text-align:left; }\n</style>";
document.write("<div style='position:relative;'><div style='float: left; display: none' id='root'></div></div>"+css);

function run_demo3 (layer, lang) {

    var name = layer;
    var lang = lang;

    if (window.XMLHttpRequest) {
        var xmlhttp=new XMLHttpRequest();
    } else {
        var xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
        
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4&&xmlhttp.status==200)
            {			
		if(xmlhttp.responseText) {
		    var palette = eval('(' + xmlhttp.responseText + ')');
		    var size = (palette.ColorPalette['size'])-1;
		    var units = palette.ColorPalette['units'];
		    var temp = checkUnits(units);

		    var legend = new LegendPalette(palette.ColorPalette, lang, temp, size, 'root');
		    legend.showGradient();
                }
            }
    }
    
    var new_units = false;
    if(document.getElementById('root')) { document.getElementById('root').innerHTML=""; }
    if(!name) { var name = "mean"; }
    if(!new_units) { var new_units = 'english'; }
    var unit = (new_units == 'metric' ? 'true' : 'false');

    var unit = "false";
    xmlhttp.open("GET", "http://web-dev1.customweather.com/demos/maptiles/layer_info/xmlFEED.php?client=alex&client_password=trust_me&product=palette&palette.name="+name+"&metric="+unit+"&format=json", true);
    xmlhttp.send();
}

function run_demo2 (layer, lang) {

    var name = layer;
    var lang = lang;

    if (window.XMLHttpRequest) {
        var xmlhttp=new XMLHttpRequest();
    } else {
        var xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
        
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4)
            {			
		if(xmlhttp.responseText) {
		    var palette = eval('(' + xmlhttp.responseText + ')');
		    var units = palette.ColorPalette['units'];
		    var temp = checkUnits(units);
		    var size = (palette.ColorPalette['size'])-1;

		    var legend = new LegendPalette(palette.ColorPalette, lang, temp, size, 'root');
		    legend.show();
                }
            }
    }

    if(document.getElementById('root')) { document.getElementById('root').innerHTML=""; }
    if(!name) { var name = "mintemp_day_m_0"; }
    if(!new_units) { var new_units = ''; }
    var unit = (new_units == 'metric' ? 'true' : 'false');

    xmlhttp.open("GET", "http://web-dev1.customweather.com/demos/maptiles/layer_info/xmlFEED.php?client=alex&client_password=trust_me&product=palette&palette.name="+name+"&metric="+unit+"&format=json", true);
    xmlhttp.send();
};

function checkUnits(units) {
    if (units == 'temperature_C' || units == 'temperature_deviation_C') {
	var temp = "&deg;C";
    } else if(units == 'temperature_F' || units == 'temperature_deviation_F') {
	var temp = "&deg;F";
    } else if (units == 'percent') {
	var temp = "&#37;";
    }  else if (units == 'speed_kmh') {
	var temp = "km/h";
    }  else if (units == 'speed_mph') {
	var temp = "mph";
    }   else if (units == 'distance_cm') {
	var temp = "cm";
    }	else if (units == 'distance_mm') {
	var temp = "cm";
    }  else if (units == 'distance_in') {
	var temp = "inches";
    } else if (units == 'rain_in'){
	var temp = "inches";
    } else if (units == 'rain_mm'){
	var temp = "mm";
    } else if (units == 'pressure_mb'){
	var temp = "mb";
    } else {
	var temp = "";
    }
    return temp;
};

function LegendPalette (palette, layerTitle, temp, size, root) {
    this._palette = palette;
    this._title = layerTitle;
    this._size = size; //int
    this._temp = temp; //string  F / C
    this._root = root; //divId
};

LegendPalette.prototype.buildSmoothLegend = function () {
    var palette = this._palette;
    var legend = palette;
    var size = this._size;
    var temp = this._temp;
    var layerTitle = this._title;

    var titlerow = "<div class='cw-legend-title'><center>"+(layerTitle)+"</center></div>";
    var table2 = titlerow + "<table border=0px cellpadding=0px cellspacing=0px><tr>";
    var toprow=""; var botrow="";
    toprow += "<td>&nbsp;&nbsp;&nbsp;</td>";
    toprow += "<td><DIV class='cw-legend-unit-alt'>"+(Math.round((legend.table[0].lower['level']*1)))+"</DIV></td>";		    
    botrow += "<td><DIV class='cw-legend-less-alt' style='border-color: transparent rgb("+legend.table[0].lower['red']+","+legend.table[0].lower['green']+","+legend.table[0].lower['blue']+") transparent transparent; border-style: solid; border-width:6px 12px 6px 2px;'></DIV></td>";

    var rate = Math.floor(size/20);		    
    for(i=0;i<=size;i=i+rate) {var upper=Math.round(legend.table[i].upper['level']*1);
	toprow += "<td><DIV class='cw-legend-unit-alt'>"+(upper)+"</DIV></td>"; 
    }
    for(i=0;i<=size;i++) {
			botrow += "<td><DIV class='cw-legend-tile-alt' style='background-color: rgb("+legend.table[i].upper['red']+","+legend.table[i].upper['green']+","+legend.table[i].upper['blue']+")'></DIV></td>";
    }i=i-1;
    botrow += "<td><DIV style='border-color: transparent transparent transparent rgb("+legend.table[i].upper['red']+","+legend.table[i].upper['green']+","+legend.table[i].upper['blue']+"); border-style: solid; border-width:6px 2px 6px 12px;'></DIV></td>";
    table2 += toprow;
    table2 += "</tr></table>"+"<table border=0px cellpadding=0px cellspacing=0px><tr>";
    table2 += botrow;
    table2 += "<td><div>"+temp+"</div></td>";
		    table2 += "</tr></table>";
    table2 = "<div class='cw-legend-alt'>"+table2+"</div>";
    return table2;
};
    
LegendPalette.prototype.buildLegend = function () {
	var palette = this._palette;
	var size = this._size;
	var temp = this._temp;
	var layerTitle = this._title;

    var titlerow = "<div class='cw-legend-title'><center>"+(layerTitle)+"</center></div>";
    var table2 = titlerow + "<table width=0 border=0 cellpaddin=0 cellspacing=0><tr>";
    var toprow=""; var botrow="";
    
    toprow += "<td>&nbsp;&nbsp;&nbsp;</td>";
    toprow += "<td><DIV class='cw-legend-unit'>"+Math.round(palette.table[0].lower['level']*1)+"</DIV></td>";		    
    botrow += "<td><DIV class='cw-legend-less' style='border-color: transparent rgb("+palette.table['background'].lower['red']+","+palette.table['background'].lower['green']+","+palette.table['background'].lower['blue']+") transparent transparent; border-style: solid; border-width:6px 12px 6px 2px;'></DIV></td>";
    
    for(i=0;i<size;i++) {
	var level =  palette.table[i].upper['level']*1;
	if(level<1){level=(""+(Math.round(palette.table[i].upper['level']*100)/100)+"").substr(1,5);}
	else { level=Math.round(level);}
	toprow += "<td><DIV class='cw-legend-unit'>"+(level)+"</DIV></td>";
	botrow += "<td><DIV class='cw-legend-tile' style='background-color: rgb("+palette.table[i].upper['red']+","+palette.table[i].upper['green']+","+palette.table[i].upper['blue']+")'></DIV></td>";
    }
    
    botrow += "<td><DIV style='border-color: transparent transparent transparent rgb("+palette.table['foreground'].upper['red']+","+palette.table['foreground'].upper['green']+","+palette.table['foreground'].upper['blue']+"); border-style: solid; border-width:6px 2px 6px 12px;'></DIV></td>";
    table2 += toprow;
    table2 += "</tr></table><table border=0px cellpadding=0px cellspacing=0px><tr>";
    table2 += botrow;
    table2 += "<td><div>"+temp+"</div></td>";
    table2 += "</tr></table>";
    table2 = "<div class='cw-legend'>"+table2+"</div>";
    return table2;
};

LegendPalette.prototype.show = function() {
    var table = this.buildLegend();    
    document.getElementById('root').innerHTML=table;
};

LegendPalette.prototype.showGradient = function() {
    var table = this.buildSmoothLegend();    
    document.getElementById('root').innerHTML=table;
}
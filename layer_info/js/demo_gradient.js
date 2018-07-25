var altcss = "<style>\n .cw-legend-alt{overflow: hidden; width: 340px; border: 1px solid #CCCCCC; background-color: #FFFFFF; padding: 3px; margin: 10px; cursor: pointer}\n .cw-legend-alt table{font-size: 8px; font-weight: bold; font-family: arial; text-align: left;}\n .cw-legend-tile-alt{width: 2px; height: 12px;}\n.cw-legend-unit-alt{width: 14px;text-align:left; }\n</style>";
document.write("<div style='position:relative;'><div style='float: left; display: none' id='root'></div></div>"+altcss);
//document.write(altcss);

function run_demo () {
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
		    var temp = (units == 'temperature_C' ? 'C' : 'F') ;
		    var size = (palette.ColorPalette['size']-1)-2;

		    var legend = palette.ColorPalette;
		    var table2 = "<table border=0px cellpadding=0px cellspacing=0px><tr>";
		    var toprow=""; var botrow="";
		    toprow += "<td>&nbsp;&nbsp;&nbsp;</td>";
		    toprow += "<td><DIV class='cw-legend-unit-alt'>"+(Math.round((legend.table[0].lower['level']*1)))+"</DIV></td>";		    
		    botrow += "<td><DIV class='cw-legend-less-alt' style='border-color: transparent rgb("+legend.table[0].lower['red']+","+legend.table[0].lower['green']+","+legend.table[0].lower['blue']+") transparent transparent; border-style: solid; border-width:6px 12px 6px 2px;'></DIV></td>";

		    var rate = Math.floor(size/20);		    
		    for(i=0;i<=size;i=i+rate) {var upper=Math.round(legend.table[i].upper['level']*1);
			toprow += "<td><DIV class='cw-legend-unit-alt'>"+(upper)+"</DIV></td>"; 
		    }
		    for(i=0;i<=size;i++) {
			botrow += "<td><DIV class='cw-legend-tile-alt' style='background-color: rgb("+palette.ColorPalette.table[i].upper['red']+","+palette.ColorPalette.table[i].upper['green']+","+palette.ColorPalette.table[i].upper['blue']+")'></DIV></td>";
		    }i=i-1;
		    botrow += "<td><DIV style='border-color: transparent transparent transparent rgb("+palette.ColorPalette.table[i].upper['red']+","+palette.ColorPalette.table[i].upper['green']+","+palette.ColorPalette.table[i].upper['blue']+"); border-style: solid; border-width:6px 2px 6px 12px;'></DIV></td>";
		    table2 += toprow;
		    table2 += "</tr></table>"+"<table border=0px cellpadding=0px cellspacing=0px><tr>";
		    table2 += botrow;
		    table2 += "<td><div>&deg;"+temp+"</div></td>";
		    table2 += "</tr></table>";
		    table2 = "<div class='cw-legend-alt'>"+table2+"</div>";
		    document.getElementById('root').innerHTML=table2;
                }
            }
    }

    document.getElementById('root').innerHTML="";    
    if(!name) { var name = "mean"; }
    if(!new_units) { var new_units = 'metric'; }
    var unit = (new_units == 'metric' ? 'metric' : 'false'); 

    xmlhttp.open("GET", "http://web-dev1.customweather.com/demos/maptiles/layer_info/xmlFEED.php?client=alex&client_password=trust_me&product=palette&palette.name=mean&unit="+unit+"&format=json", true);
    xmlhttp.send();
}
var WX=500;
var HX=480;
var req = false;

function cw_formatZ(numS){
  num = parseFloat(numS);
  if(num=="NaN") return "*";
  if(num==0) return "0";
  if(num<0.001) return num;
  if(num<0.01) return num.toFixed(3);
  if(num<0.1) return num.toFixed(2);
  if(num<1) return num.toFixed(1);
  return num.toFixed(0);
}

function cw_getQueryParameter ( parameterName ) {
  var queryString = window.top.location.search.substring(1);
  var parameterName = parameterName + "=";
  if ( queryString.length > 0 ) {
    begin = queryString.indexOf ( parameterName );
    if ( begin != -1 ) {
      begin += parameterName.length;
      end = queryString.indexOf ( "&" , begin );
        if ( end == -1 ) {
        end = queryString.length
      }
      return unescape ( queryString.substring ( begin, end ) );
    }
  }
  return "null";
} 

/*
function $(id) {
  return document.getElementById(id);
}
*/


function getPage () {   //show palette in celsius
  if (window.XMLHttpRequest) {
    req=new XMLHttpRequest();
   
  }else {
   
    req=new ActiveXObject("Microsoft.XMLHTTP");
  }
  //var paletteName = cw_getQueryParameter("palette.name");
  var paletteName =   'sst_day_metric.cpt';	
  if(paletteName==null) paletteName="mean.cpt";
  paletteHandler();

  //req.open("GET","data.json",true); // async=true
  //req.onreadystatechange = paletteHandler;
  //req.overrideMimeType("application/json");
  //req.send(null); // no parameter
}

function getPage1 () { //palette in fareheit
  if (window.XMLHttpRequest) {
    req=new XMLHttpRequest();
   
  }else {
   
    req=new ActiveXObject("Microsoft.XMLHTTP");
  }
  //var paletteName = cw_getQueryParameter("palette.name");
  var paletteName =   'sst_day_metric.cpt';	
  if(paletteName==null) paletteName="mean.cpt";
  paletteHandler1();

  //req.open("GET","data.json",true); // async=true
  //req.onreadystatechange = paletteHandler;
  //req.overrideMimeType("application/json");
  //req.send(null); // no parameter
}

function paletteHandler(){	 //palette in celsius
  //if(req.readyState == 4){ // complete
  //var palette = eval('(' + req.responseText + ')');
	
	var pName = 'sst_day_metric.cpt';	//cw_getQueryParameter("palette.name");
	$.ajax({
  	url: "http://xml.customweather.com/xml?client=alex&client_password=trust_me&product=palette&palette.name="+pName+"&format=json",
	dataType: "jsonp",	
  	success: function(data){
    
 	var palette = data;
 	

    var psize = palette.ColorPalette.size;
    var hues=new Array();
    var levels=new Array();
    for(i=0; i<  psize; i++){
      hues[i]= palette.ColorPalette.table[i].lower.H;
      levels[i]= palette.ColorPalette.table[i].lower.level;	
    }
    drawCells(hues, levels, psize);
    }
  });
  //}
}


function paletteHandler1(){	//palette in fareheit 
  //if(req.readyState == 4){ // complete
  //var palette = eval('(' + req.responseText + ')');
	
	var pName = 'sst_day_metric.cpt';	//cw_getQueryParameter("palette.name");
	$.ajax({
  	url: "http://clients.customweather.com/demos/maptiles/layer_info/xmlFEED.php?client=tile_demo2&apikey=zr_FX9XukUgZetYI9JIINzkhlcktJjS3yqEV3rKXuGFiNCDT1gtcCGKuFkc1jQzl&product=palette&palette.name="+pName+"&metric=false&format=json",

//http://xml.customweather.com/xml?client=alex&client_password=trust_me&product=palette&palette.name="+pName+"&metric=true&format=json
	dataType: "jsonp",	
  	success: function(data){
    
 	var palette = data;
 	

    var psize = palette.ColorPalette.size;
    var hues=new Array();
    var levels=new Array();
    for(i=0; i<  psize; i++){
      hues[i]= palette.ColorPalette.table[i].lower.H;
      levels[i]= palette.ColorPalette.table[i].lower.level;	
    }
    drawFCells(hues, levels, psize);
    }
  });
  //}
}

Raphael.fn.cell = function (x, y, w, h, hue, stroke) {
  hue = hue || 0;
  if(!stroke){ // do not draw outline
   return this.set(this.rect(x, y, w, h, 0).attr({fill : "hsb(" + hue+", 1.0, 1.0)", stroke: "hsb(" + hue+", 1.0, 1.0)", opacity: 1}));
  }else{
   return this.set(this.rect(x, y, w, h, 0).attr({fill : "hsb(" + hue+", 1.0, 1.0)", opacity: 1 }));
  }
};
function drawCells(colors, levels, size){
  var radius=10;
  var inrow=30;
  var R = Raphael("palette"), x = radius, y = radius, r =radius
  var wper = WX/size;   // width per item
  var posx = 0;
  var incr = parseInt(30/wper)+1;
  for(i=0; i<size; i++){
    if(i%incr==0) R.text(posx+12, y+r*2+10, cw_formatZ(levels[i])+'°C');
    R.cell(posx, y, wper, r*2, colors[i], (wper>10 ? true : false));
    posx+=wper;
  }
}
function drawFCells(colors, levels, size){
  var radius=10;
  var inrow=30;
  var R = Raphael("palette"), x = radius, y = radius, r =radius
  var wper = WX/size;   // width per item
  var posx = 0;
  var incr = parseInt(30/wper)+1;
  for(i=0; i<size; i++){
    if(i%incr==0) R.text(posx+12, y+r*2+10, cw_formatZ(levels[i])+'°F');
    R.cell(posx, y, wper, r*2, colors[i], (wper>10 ? true : false));
    posx+=wper;
  }
}

function loadCapabilities (name, callback) {

    var xmlhttp = false;    
    if (window.XMLHttpRequest) {
	xmlhttp=new XMLHttpRequest();
    } else {
	xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    
    xmlhttp.onreadystatechange=function()
	{
	    if (xmlhttp.readyState==4&&xmlhttp.status==200)
		{                                                                     
		    //xmlhttp.responseXML not responding / imageFEED.php
		    if(xmlhttp.responseText) {
			//XML RAW PARSE **fix** 
			var rawXMLText = xmlhttp.responseText;			    
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
			if(callback) {
			    callback(title, date);
			}
		    }
		}
	}
    xmlhttp.open("GET", "http://web-dev1.customweather.com/demos/maptiles/layer_info/imageFEED.php?REQUEST=capabilities&capdoc.extended=true&LAYERS="+name, true);
    xmlhttp.send();
}
<!--
var quakeArray;
quakeArray = new Array();
quakeArray['error'] = "";
  
function quickXMLLoad () {
    
    var xmlhttp = false;    
    if (window.XMLHttpRequest) {
        xmlhttp=new XMLHttpRequest();
    } else {
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    
    xmlhttp.onreadystatechange=function()
        {
        if (xmlhttp.readyState==4||xmlhttp.status==200)
            {                
                if(xmlhttp.responseXML) {
                    var item = xmlhttp.responseXML.getElementsByTagName('item');
                    quakeArray['0'] = new Array();
                    for(var i=0;i<item.length;i++) {
                        quakeArray['0'][i] = buildQuakeData(item[i]);
                    }
                }
                loadEQ(0);
            }
        }

    //xmlhttp.open("GET", "http://dev3.customweather.com/xml?product=earthquake&client=maps_demo&client_password=t3mp&format=georss", true);
    xmlhttp.open("GET", "EQ.xml");
    xmlhttp.send();
}

function buildQuakeData (obj) { 
        var quakeTarget = new Array();
        quakeTarget['time'] = "3:33 PST";
        quakeTarget['location'] = obj.getElementsByTagName('title')[0].childNodes[0].nodeValue;
        quakeTarget['latitude'] = obj.getElementsByTagName('geo:lat')[0].childNodes[0].nodeValue;    
        quakeTarget['longitude'] = obj.getElementsByTagName('geo:long')[0].childNodes[0].nodeValue;
        quakeTarget['magnitude'] = "4.8";
        quakeTarget['depth'] = "10 miles";
        return quakeTarget;
}

function checkForEQArray() {
    return quakeArray;
    var recent_quakes = quakeArray;
    if(!recent_quakes) { recent_quakes = new Array(); recent_quakes['error']=1; return recent_quakes; }
    else { return recent_quakes; }
}


var map   = null; 
function getMaps(lat, lon)
{
    map = null;
    map = new VEMap('myMap');
    map.SetDashboardSize(VEDashboardSize.Tiny);
    map.LoadMap(new VELatLong(lat, lon), 2);
}



/* name:  quake.js                           */
/* title: Beta Earthquake Controller         */
/* info:  load, update required data display */
/* requires args: offset=current_day_index   */

function loadEQ (offset) {
                
    var earthquake = new VEShapeLayer();
    var eqArray = quakeArray; //checkForEQArray(); /* ajax load-data or basic jsp parser    */
    var widget = new quakeWidget('mfQuakeWidgetBeta', eqArray[offset], offset, eqArray.length);
     
    //insert wrapper object
    widget.showWrapper();
    
    //Execute display function
    if (eqArray['error']){ widget.showError(0); }       
    else { widget.showDay(0); }
        
    getMaps(eqArray[offset][0]['latitude'], eqArray[offset][0]['longitude']); 
      
      url = "http://dev3.customweather.com/xml?product=earthquake&client=maps_demo&client_password=t3mp&format=georss";
      geoSpec = new VEShapeSourceSpecification(VEDataType.ImportXML, url, earthquake);
      geoSpec.MaxImportedShapes = 250;
      
      map.ImportShapeLayerData(geoSpec, false, false);            
}

function updateEQ (offset) {
    
    var eqArray = quakeArray; /* ajax load-data or basic jsp parser    */
    var widget = new quakeWidget('mfQuakeWidgetBeta', eqArray[offset], offset, eqArray.length);
    var earthquake = new VEShapeLayer();

    //Execute display function
    if (eqArray['error']){ widget.showError(0); }       
    else { widget.showDay(0); }
    
     
    getMaps(eqArray[offset][0]['latitude'], eqArray[offset][0]['longitude']);
    map.DeleteAllShapeLayers();
      
      url = "http://dev3.customweather.com/xml?product=earthquake&client=maps_demo&client_password=t3mp&format=georss";
      geoSpec = new VEShapeSourceSpecification(VEDataType.ImportXML, url, earthquake);
      geoSpec.MaxImportedShapes = 250;

      function showEQ() {
         var focus = new VELatLong(eqArray[offset][0]['latitude'], eqArray[offset][0]['longitude']);
         var zoom = 5;
         map.SetCenterAndZoom(focus, zoom);
      }      
      
      map.ImportShapeLayerData(geoSpec, showEQ, false);              
      earthquake.show();
}

function updateBingMap (lat, lon, zoom) {
         var focus = new VELatLong(lat, lon);
         map.SetCenterAndZoom(focus, zoom);
}
-->
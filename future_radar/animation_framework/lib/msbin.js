/**
* =========================================================================== 
*                                                                             
*  future_radar.sh                                                            
*                                                                             
*  Author:  Bradburn Young                                                    
*  Email:   bradburny@customweather.com                                       
*  style guide: https://google-styleguide.googlecode.com/svn/trunk/javascript.xml 
*  notes: http://jsfiddle.net/tschaub/Lkgx0qaa/                                                                             
* =========================================================================== 
*/

//url: 'http://maps-beta/tms/Y1ryKBJ-ClRwEfZR_rIo3PZNv-7JSHKmbqm13dt7srQgTZ5tZdPk2d-9Eggu_UiX/base/{z}/{x}/{-y}.png'
//url: 'http://maps-beta/smt/Y1ryKBJ-ClRwEfZR_rIo3PZNv-7JSHKmbqm13dt7srQgTZ5tZdPk2d-9Eggu_UiX/nws_radar_sfa_10min/{z}/{x}/{y}.png'
//url: 'http://server.arcgisonline.com/ArcGIS/rest/services/' + 'World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
// http://openlayrs.org/en/master/apidoc/ol.source.XYZ.html

http://jsfiddle.net/tschaub/Lkgx0qaa/

var attribution = new ol.Attribution({
  html: 'CWTiles &copy; <a href="http://www.customweather.com/"</a>'
});

var tileCollection = [];
var intervalTimerId = setInterval('updateAnimation()', 400);
var iter=0;

var now = new Date();
var ms = now.getTime();
var hour = 60*60*1000;
var qhour = 15*60*1000;
ms = ms - ms % hour + hour;

var base = new ol.layer.Tile({
            source: new ol.source.BingMaps({
              imagerySet: 'Aerial',
              //imagerySet: 'Road',
              //imagerySet: 'AerialWithLabels',
	      key: 'Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3'
              //key: 'Aq63PdcG0ddlLSi7wf0mYGOEp6l2fVZqDjlpBEIMjicZ38F6t9jlRdb1B0Y2tKgE'
            })
	});

/**
var base = new ol.layer.Tile({
      		source: new ol.source.XYZ({ 
        		attributions: [attribution],
			url: 'http://maps-beta/smt/tx77ySpkpTu4y0Q_1QLgE82net5EykLQT8L5KCjCpjwKCMjaOnqB8kjDR-5csooY86CeRKSrgv2QMaxUO2Rvpg==/base/{z}/{x}/{y}.png'
      		})
    	});
var base = new ol.layer.Tile({
            title: "Global Imagery",
            source: new ol.source.TileWMS({
              url: 'http://maps.opengeo.org/geowebcache/service/wms',
              params: {LAYERS: 'bluemarble', VERSION: '1.1.1'}
            })
          });
var base = new ol.layer.Tile({
            source: new ol.source.OSM()
        });
*/

tileCollection.push(base);

for(ii=0;ii<30;ii++){
	now.setTime(ms + ii*qhour);
	var timestamp = now.toISOString().substring(0, 19);

	var tile = new ol.layer.Tile({
      		source: new ol.source.XYZ({ 
        		attributions: [attribution],
			url: 'http://maps-beta/smt/tx77ySpkpTu4y0Q_1QLgE82net5EykLQT8L5KCjCpjwKCMjaOnqB8kjDR-5csooY86CeRKSrgv2QMaxUO2Rvpg==/bby_test/' + timestamp + '/{z}/{x}/{y}.png'
      		})
    	});
	tile.setOpacity(0.80);
	tileCollection.push(tile);
}

function updateAnimation(){
	var rem = iter++%(tileCollection.length-1);
	rem++;
	for(i=1; i<tileCollection.length; i++){
		if(i==rem){
			tileCollection[i].setVisible(true);	
			continue;
		}
		tileCollection[i].setVisible(false);	
	}
}

var map = new ol.Map({
  target: 'map',
  layers: tileCollection,
  view: new ol.View({
    center: ol.proj.transform([-95, 39], 'EPSG:4326', 'EPSG:3857'),
    zoom:4 
  })
});

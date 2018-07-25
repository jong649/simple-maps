
var attribution = new ol.Attribution({
  html: 'CWTiles &copy; <a href="http://www.customweather.com/"</a>'
});

var now = new Date();
var ms = now.getTime();
var hour = 60*60*1000;
var qhour = 15*60*1000;
ms = ms - ms % hour + hour;
now.setTime(ms + qhour);
var timestamp = now.toISOString().substring(0, 19);

var base = new ol.layer.Tile({
            source: new ol.source.OSM()
        });

var tile = new ol.layer.Tile({
    		source: new ol.source.XYZ({ 
        		attributions: [attribution],
			url: 'http://maps-beta/smt/tx77ySpkpTu4y0Q_1QLgE82net5EykLQT8L5KCjCpjwKCMjaOnqB8kjDR-5csooY86CeRKSrgv2QMaxUO2Rvpg==/bby_test/' + timestamp + '/{z}/{x}/{y}.png'
      		})
    	});
tile.setOpacity(0.80);



var map = new ol.Map({
  target: 'map',
  layers: [base, tile],
  view: new ol.View({
    center: ol.proj.transform([-95, 39], 'EPSG:4326', 'EPSG:3857'),
    zoom:4 
  })
});

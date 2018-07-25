
var tileSource = new ol.source.OSM();
var map = new ol.Map({
    target: 'map',
    layers: [
	new ol.layer.Tile({
            source: tileSource 
        })
    ],
    view: new ol.View({
      center: ol.proj.transform([37.41, 8.82], 'EPSG:4326', 'EPSG:3857'),
      zoom: 4
    })
  });

 tileSource.setTileLoadFunction((function() { 
      var numLoadingTiles = 0; 
      var tileLoadFn = tileSource.getTileLoadFunction(); 

      return function(tile, src) { 
        if (numLoadingTiles === 0) { 
          console.log('loading'); 
        } 
        ++numLoadingTiles; 
        var image = tile.getImage(); 
        image.onload = image.onerror = function() { 
          --numLoadingTiles; 
          if (numLoadingTiles === 0) { 
            console.log('idle'); 
          } 
        }; 
        tileLoadFn(tile, src); 
      }; 
    })()); 


var map;

var queryString = new QueryData();

var metric = true;

if('metric' in queryString){
        metric = queryString.metric=='true'; // force hrrr
}
var cwApiKey = 'tx77ySpkpTu4y0Q_1QLgE82net5EykLQT8L5KCjCpjwKCMjaOnqB8kjDR-5csooY86CeRKSrgv2QMaxUO2Rvpg==';
function init() {


var cc = new OpenLayers.Layer.XYZ(
    "Current Conditions Metric",
    [
        //"http://a.tiles.mapbox.com/v3/mapbox.natural-earth-hypso-bathy/${z}/${x}/${y}.png"
	'http://hail/smt/'+cwApiKey+'/' + (metric? 'cc_test_metric' : 'cc_test') + '/${z}/${x}/${y}.png'
    ], {
        attribution: "Tiles &copy; <a href='http://mapbox.com/'>MapBox</a>",
        sphericalMercator: true,
        wrapDateLine: true,
	isBaseLayer: false,
	animationEnabled: false
    }
);


    map = new OpenLayers.Map('map', {
        projection: 'EPSG:3857',
        layers: [
		cc,
            new OpenLayers.Layer.Google(
                "Google Physical",
                {type: google.maps.MapTypeId.TERRAIN}
            )
	/**
            new OpenLayers.Layer.Google(
                "Google Streets", // the default
                {numZoomLevels: 20}
            ),
            new OpenLayers.Layer.Google(
                "Google Hybrid",
                {type: google.maps.MapTypeId.HYBRID, numZoomLevels: 20}
            ),
            new OpenLayers.Layer.Google(
                "Google Satellite",
                {type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 22}
            ),

	*/
        ],
        center: new OpenLayers.LonLat(-95, 35)
            // Google.v3 uses web mercator as projection, so we have to
            // transform our coordinates
            .transform('EPSG:4326', 'EPSG:3857'),
        zoom: 4
    });
    //map.addControl(new OpenLayers.Control.LayerSwitcher());
	map.addLayer(cc);
    
	/**
    // add behavior to html
    var animate = document.getElementById("animate");
    animate.onclick = function() {
        for (var i=map.layers.length-1; i>=0; --i) {
            map.layers[i].animationEnabled = this.checked;
        }
    };
	*/
}
	/**
        "http://b.tiles.mapbox.com/v3/mapbox.natural-earth-hypso-bathy/${z}/${x}/${y}.png",
        "http://c.tiles.mapbox.com/v3/mapbox.natural-earth-hypso-bathy/${z}/${x}/${y}.png",
        "http://d.tiles.mapbox.com/v3/mapbox.natural-earth-hypso-bathy/${z}/${x}/${y}.png"
	*/

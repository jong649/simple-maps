
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>Weather for your world</title>
  <script>
    function update () {
    var palette = document.getElementById('palette').value;
    var title = document.getElementById('title').value;
    var layer = document.getElementById('layer').value;
    if(palette=='mean'||palette=='synoptic_temp'){loadGradientLegend(palette,(!title||title=='default'?'':title), 'synoptic_temp'); return false}
    loadLegend(palette,(!title||title=='default'?'':title),(!layer||layer=='default'?'':layer));
    }
    </script>
</head>

<body onload="loadLegend('meantemp_day_e_0');">

  <div style="height: 80px">
    <script type="text/javascript" src="http://web-dev1.customweather.com/demos/maptiles/layer_info/js/cwLegend.js"></script>
    <div style="float:left; clear: both; width: 100%"></div>
  </div>

  <div>
    <a href="javascript:loadLegend('rainfall_day_e_0')">Set the palette.name:</a> loadLegend('rainfall_day_e_0')<br />
    <a href="javascript:loadLegend('snowfall_day_e_0','Snow Forecast')">Set the palette.name, title:</a> loadLegend('snowfall_day_e_0','Snow Forecast')<br />
    <a href="javascript:loadGradientLegend('mean','Todays Temp','synoptic_temp')">Set the palette.name, title, layer:</a> loadGradientLegend('mean', 'Todays Temp', 'synoptic_temp')<br />
    <a href="javascript:loadGradientLegend('mean','Todays Temp','synoptic_temp','metric')">Set the palette.name, title, layer, units:</a> loadGradientLegend('synoptic_temp', 'Todays Temp', 'synoptic_temp', 'metric')<br />
  </div>

  <div>
    palette: <input id="palette" value="meantemp_day_e_0"/> title: <input id="title" value="default"/> layer: <input id="layer" value="default"/> <input type="button" value="show legend" onClick="update()">
  </div>

</body>
</html>
 

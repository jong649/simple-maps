<!DOCTYPE html>
<html>
<head>
    <title></title>
    <meta charset="utf-8" />
  <script src="lib/QueryData.js" type="text/javascript"></script>
  <script src="lib/model_update.js" type="text/javascript"></script>
  <script src="http://maps-beta.customweather.com/xml?product=model_update&source=hrrrsub3km&callback=model_update&client=templates&client_password=1nf0Wx!" type="text/javascript"></script>
  <script src="lib/futureradarnew.js" type="text/javascript"></script>
    <script type='text/javascript' src='https://www.bing.com/api/maps/mapcontrol?callback=GetMap&key=An_V-zl5WqQH2Sgd2OSaLDdHHN5zLsvB-diJvPXy6Btuh2OK1iTp9cmGaw882tWX' async defer></script>
<link rel="stylesheet" href="lib/bootstrap.css" type="text/css">
<link rel="stylesheet" href="lib/newlayout.css" type="text/css">
<link rel="stylesheet" href="lib/bootstrap-responsive.css" type="text/css">
</head>
<body>
    <div id="myMap" style="position:relative;width:800px;height:600px;"></div>
    <br/>
    <input type="button" value="Pause" onclick="animatedLayer.pause();"/>
    <input type="button" value="Play" onclick="animatedLayer.play();" />
    <input type="button" value="Stop" onclick="animatedLayer.stop();" />
<div id="key">
	<div><strong>Rain</strong></div>
	<div><strong>Snow</strong></div>
	<div><strong>Mixed</strong></div>
</div>
<div id="palette" class="palette"/>
	<div id="legend" class="legend"/>
	<strong>Light<strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	<strong>Moderate<strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	<strong>Heavy<strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	<strong>Severe<strong>
	</div>
	<div id="palette0" class="palette0"/><img src="lib/legend.png"></img></div>
</div> <!-- end of palette -->
</body>
</html>


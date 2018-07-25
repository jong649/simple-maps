<?php

# ORG: 2017-05-24
# VER: 2018-04-16

ob_start();

include("config.php");

date_default_timezone_set('America/Los_Angeles');
$year = date("Y");  

extract($_REQUEST, EXTR_PREFIX_ALL|EXTR_REFS, 'rvar');
global $rvar_wid;
global $rvar_prov;
global $rvar_tideLocationID;
global $rvar_product;
global $rvar_language;
global $rvar_metric;
global $rvar_page;
global $rvar_fn;
global $rvar_search;
global $rvar_color;
global $rvar_bgcolor;
global $rvar_link_color;
global $rvar_barcolor;
global $rvar_bar_text_color;
global $rvar_zip_code;
global $rvar_debug;
global $languages, $language, $translate, $debug;
global $rvar_trial_ID, $trial_ID;
global $rvar_rtype;
global $rvar_test;
global $lang;
global $rvar_type, $type;
global $rvar_source, $source, $model_source;
global $model_flag;

$trial_ID = $rvar_trial_ID;

$type=$rvar_type;
$rtype=$rvar_rtype;
$test=$rvar_test;
$tideLocationID=$rvar_tideLocationID;
$search=$rvar_search;
$wid=$rvar_wid;
$product=$rvar_product;
$metric=$rvar_metric;
$language=$rvar_language;
$page=$rvar_page;
$fn=$rvar_fn;
$color=$rvar_color;
$bgcolor=$rvar_bgcolor;
$link_color=$rvar_link_color;
$barcolor=$rvar_barcolor;
$bar_text_color=$rvar_bar_text_color;
$zipcode=$rvar_zip_code;
$province=$rvar_prov;
$model_source=$rvar_source;


#echo "Forecast model: = $model_name= [$model_source]<BR>";

if($bgcolor==""){$bgcolor="#FFFFFF";}
if($color==""){$color="#003399";}
if($barcolor==""){$barcolor="#003399";}
if($bar_text_color==""){$bar_text_color="#000000";}
if($link_color==""){$link_color="#003399";}
if($debug==""){$debug="N";}


//language
if($language!="") {
$languages=$language;
$language=substr($languages,0, 2);
$browser_lan=$language;
}
else {
$language=substr($_SERVER['HTTP_ACCEPT_LANGUAGE'],0, 2);
$browser_lan=$language;
}

//units
if($metric=="true") { 

$t_u="°C";
$ws_u="km/h";
$pp_u="mm";
$bp_u="hPa";
$sn_u="cm"; 
$vis_u="kilometers";
$wave_u="m";
}
else {
$t_u="°F";
$ws_u="mph";
$pp_u="&quot;";
$bp_u="\"";
$sn_u="\"";
$vis_u="miles";
$wave_u="ft";
} 

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta name="viewport" content="width=device-width, initial-scale=0.85, maximum-scale=5.0, minimum-scale=0.25, user-scalable=yes" />
<title>Interactive Maps demo - CustomWeather, Inc.</title>
<meta name="keywords" content="South Africa, Cape Town, Johanneburg, Cape Doctor, weather, meteorology, weather forecasts, weather forecasting, weatherman, meteorologist, internet, news, technology, forecasts, custom, customized, wireless, web, travel, ship routing, weather vertical, weather maps, Doppler radar, satellite, weather provider, weather alerts, severe weather, online weather, weather maps">
<meta name="description" content="1stweather is a comprehensive resource for online weather forecasts and reports for over 72,000 locations worldwide.  You'll find detailed 48-hour and 7-day extended forecasts, ski reports, marine forecasts and surf alerts, airport delay forecasts, fire danger outlooks, Doppler and satellite images, and thousands of maps.">

<META HTTP-EQUIV="Refresh" CONTENT="900; URL="_SELF"">
<META HTTP-EQUIV="PRAGMA" CONTENT="NO-CACHE">
<META HTTP-EQUIV="Expires" CONTENT="-1">
<meta http-equiv="X-UA-Compatible" content="IE=8" />

<!-- Import Style Sheets-->
<link rel="stylesheet" title="normal" href="/CSS/CONTACTRELIEF/mfstyle.css" type="text/css" />
<link rel="stylesheet" title="normal" href="/CSS/CONTACTRELIEF/main.css" type="text/css"  MEDIA="screen">
<link rel="stylesheet" title="normal" href="/CSS/CONTACTRELIEF/menu_blue.css" type="text/css"  MEDIA="screen">

<script language="JavaScript">
<!--
function goToURL(form)
  {

    var myindex=form.dropdownmenu.selectedIndex
    if(!myindex=="")
      {
        window.location.href=form.dropdownmenu.options[myindex].value;


      }
}
//-->
</script>

<!-- JQUERY-->
<!script src="http://code.jquery.com/jquery-1.12.4.js"></script>
<!script src="http://code.jquery.com/jquery-migrate-1.4.1.js"></script>



<!-- MENU -->
<!script type="text/javascript" src="/jquery/jquery-1.7.2.min.js" charset="utf-8"></script>
<script type="text/javascript" src="/javascript/1STWX/nagging-menu.js" charset="utf-8"></script>

<!-- HIGH CHARTS JS -->
<script src="/javascript/highcharts/js/highcharts.js" type="text/javascript"></script>
<script src="/javascript/highcharts/js/highstock.js" type="text/javascript"></script>
<script src="/javascript/highcharts/js/modules/exporting.js" type="text/javascript"></script>
<script type="text/javascript" src="/javascript/highcharts/js/themes/grid.js"></script>

<!-- THEME ROLLER -->
<!link href="/jquery/jquery-ui-1.10.3.custom/css/start/jquery-ui-1.10.3.custom.css" rel="stylesheet">
<!script src="/jquery/jquery-ui-1.10.3.custom/js/jquery-1.9.1.js"></script>
<!script src="/jquery/jquery-ui-1.10.3.custom/js/jquery-ui-1.10.3.custom.js"></script>

<link href="/jquery/jquery-ui-1.12.1.custom/jquery-ui.min.css" rel="stylesheet">
<script src="/jquery/jquery-ui-1.12.1.custom/external/jquery/jquery.js"></script>
<script src="/jquery/jquery-ui-1.12.1.custom/jquery-ui.min.js"></script>


<!-- SEARCH -->
<!script src="/javascript/search/templates/autocomplete.js"></script>



	<script>
	$(function() {
		
		//$( "#accordion" ).accordion();
		

		
		var availableTags = [
			"ActionScript",
			"AppleScript",
			"Asp",
			"BASIC",
			"C",
			"C++",
			"Clojure",
			"COBOL",
			"ColdFusion",
			"Erlang",
			"Fortran",
			"Groovy",
			"Haskell",
			"Java",
			"JavaScript",
			"Lisp",
			"Perl",
			"PHP",
			"Python",
			"Ruby",
			"Scala",
			"Scheme"
		];
		$( "#autocomplete" ).autocomplete({
			source: availableTags
		});
		

		
		$( "#button" ).button();
		$( "#radioset" ).buttonset();
		

		
		$( "#tabs" ).tabs();
		

		
		$( "#dialog" ).dialog({
			autoOpen: false,
			width: 400,
			buttons: [
				{
					text: "Ok",
					click: function() {
						$( this ).dialog( "close" );
					}
				},
				{
					text: "Cancel",
					click: function() {
						$( this ).dialog( "close" );
					}
				}
			]
		});

		// Link to open the dialog
		$( "#dialog-link" ).click(function( event ) {
			$( "#dialog" ).dialog( "open" );
			event.preventDefault();
		});
		

		
		$( "#datepicker" ).datepicker({
			inline: true
		});
		

		
		$( "#slider" ).slider({
			range: true,
			values: [ 17, 67 ]
		});
		

		
		$( "#progressbar" ).progressbar({
			value: 20
		});
		

		// Hover states on the static widgets
		$( "#dialog-link, #icons li" ).hover(
			function() {
				$( this ).addClass( "ui-state-hover" );
			},
			function() {
				$( this ).removeClass( "ui-state-hover" );
			}
		);
	});
	</script>
	
 <script>
$(function() {
$( "#accordion" ).accordion({
collapsible: true,
heightStyle: "content"
});
});
/*
* hoverIntent | Copyright 2011 Brian Cherne
* http://cherne.net/brian/resources/jquery.hoverIntent.html
* modified by the jQuery UI team
*/
$.event.special.hoverintent = {
setup: function() {
$( this ).bind( "mouseover", jQuery.event.special.hoverintent.handler );
},
teardown: function() {
$( this ).unbind( "mouseover", jQuery.event.special.hoverintent.handler );
},
handler: function( event ) {
var currentX, currentY, timeout,
args = arguments,
target = $( event.target ),
previousX = event.pageX,
previousY = event.pageY;
function track( event ) {
currentX = event.pageX;
currentY = event.pageY;
};
function clear() {
target
.unbind( "mousemove", track )
.unbind( "mouseout", clear );
clearTimeout( timeout );
}
function handler() {
var prop,
orig = event;
if ( ( Math.abs( previousX - currentX ) +
Math.abs( previousY - currentY ) ) < 7 ) {
clear();
event = $.Event( "hoverintent" );
for ( prop in orig ) {
if ( !( prop in event ) ) {
event[ prop ] = orig[ prop ];
}
}
// Prevent accessing the original event since the new event
// is fired asynchronously and the old event is no longer
// usable (#6028)
delete event.originalEvent;
target.trigger( event );
} else {
previousX = currentX;
previousY = currentY;
timeout = setTimeout( handler, 100 );
}
}
timeout = setTimeout( handler, 100 );
target.bind({
mousemove: track,
mouseout: clear
});
}
};
</script>

	<style>
	body{
		margin: 0px;
	}
	.demoHeaders {
		margin-top: 2em;
	}
	#dialog-link {
		padding: .4em 1em .4em 20px;
		text-decoration: none;
		position: relative;
	}
	#dialog-link span.ui-icon {
		margin: 0 5px 0 0;
		position: absolute;
		left: .2em;
		top: 50%;
		margin-top: -8px;
	}
	#icons {
		margin: 0;
		padding: 0;
	}
	#icons li {
		margin: 2px;
		position: relative;
		padding: 4px 0;
		cursor: pointer;
		float: left;
		list-style: none;
	}
	#icons span.ui-icon {
		float: left;
		margin: 0 4px;
	}
	.fakewindowcontain .ui-widget-overlay {
		position: absolute;
	}
	</style>
</head>

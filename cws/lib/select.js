$(document).ready(function(){
        //$('#layer_div').css("display", "none");
        //$('#level_div').css("display", "none");
        //$('#model_run_div').css("display", "none");
        for (var key in cwsspec) {
                if (cwsspec.hasOwnProperty(key)) {
			var m = getActiveModel(key);
			if(m!=null){
                		$('#source_select').append($("<option value=\""+key+"\">" + m.description + "</option>"));
                	}
		}
        }
	$("#source_select").html($("#source_select option").sort(function (a, b) {
    		return a.text == b.text ? 0 : a.text < b.text ? -1 : 1
	}));
	$("#source_select").prepend("<option value='select' selected='selected'>Select</option>");

     $("#source_select").change(function(){
                var source = document.getElementById("source_select").value;
		if(source === "select"){
			/**
        		$('#layer_div').css("display", "none");
        		$('#level_div').css("display", "none");
        		$('#model_run_div').css("display", "none");
			*/
                	$('#layer_select').empty();
                	$('#level_select').empty();
                	$('#model_run_select').empty();
			 return;
		}
		resetAnimation();
                $('#layer_select').empty();
                $('#level_select').empty();
                $('#model_run_select').empty();

			/**
                $('#layer_div').css("display", "inline");
        	$('#level_div').css("display", "none");
                $('#model_run_div').css("display", "inline");
			*/

		var layerSet = [];
		var layerDescLookup = {};
                for (var key in cwsspec[source]) {
                        if (cwsspec[source].hasOwnProperty(key)) {
				var layer = cwsspec[source][key].layer;
				layerDescLookup[layer] = cwsspec[source][key].description;
				if(layerSet.indexOf(layer)<0){
					layerSet.push(layer);
				}
                        }
                }

                layerSet.sort();
		for(var indx=0; indx<4; indx++){
			var run = getModelUpdateWithOffset(source, indx);
                	$('#model_run_select').append($("<option value=\""+run+"\">" + run + "</option>"));
		}

                for(indx=0; indx<layerSet.length; indx++){
                        $('#layer_select').append($("<option value=\""+layerSet[indx]+"\">" + layerDescLookup[layerSet[indx]] + "</option>"));
                }
		$("#layer_select").html($("#layer_select option").sort(function (a, b) { return a.text == b.text ? 0 : a.text < b.text ? -1 : 1; }));
		$("#layer_select").prepend("<option value='select' selected='selected'>Select</option>");

     });
     $("#layer_select").change(function(){
                $('#level_select').empty();
                //$('#level_div').css("display", "inline");
		resetAnimation();
                var source = document.getElementById("source_select").value;
                var layer = document.getElementById("layer_select").value;
		if(layer === "select") {
        		//$('#level_div').css("display", "none");
			return;
		}

                for (var key in cwsspec[source]) {
			if(cwsspec[source][key].layer === layer){
				var lev = cwsspec[source][key].level;	        
				var text = levelLookup[lev] == null ? lev : levelLookup[lev];
                		$('#level_select').append($("<option value=\""+lev+"\">" + text + "</option>"));
			}
        	}
		$("#level_select").html($("#level_select option").sort(function (a, b) { return a.text == b.text ? 0 : a.text < b.text ? -1 : 1; }));
		$("#level_select").prepend("<option value='select' selected='selected'>Select</option>");

		/**
                for(indx=0; indx<levelSet.length; indx++){
			var lookedUp = levelLookup[levelSet[indx]]; 
			if(lookedUp==null) lookedUp = levelSet[indx];
                        $('#level_select').append($("<option value=\""+levelSet[indx]+"\">" + levelSet[indx] + "--" + lookedUp + "</option>"));
                }
		*/
        });
		
     $("#level_select").change(function(){
		var source = $("#source_select" ).val();	
		var layer = $("#layer_select" ).val();	
		var level = $("#level_select" ).val();	
		var run = $("#model_run_select" ).val();	
		if(level === "select"){
			resetAnimation();
			return;
		}
	        runit(source, layer, level, run);
        });

     $("#model_run_select").change(function(){
	var source = $("#source_select" ).val();	
	var layer = $("#layer_select" ).val();	
	var level = $("#level_select" ).val();	
	var run = $("#model_run_select" ).val();	
	if(layer!=null && layer!=="select" &&
		level!=null && level!=="select"){
	        runit(source, layer, level, run);
	}
     });
}); //document ready

function runit(source, layer, level, run){
	animinit(source, layer, level, run);
        var m = getActiveModel(source);
        var s = cwsspec[source][layer+":"+level];
        loadLegend(s.palette, m.description,  s.description + " @ " + level, source + ":" + layer + ":" + level, metric,"cws_" + s.display_units,  run, m, s);
        $( "#palette" ).show();

	var myArray = calcFDates(m, run);

	console.log(myArray.length);
	for(var i=0; i < myArray.length; i++) {
  		//console.log("fat:" + myArray[i] + "--" + forecastDates[i].toISOString().substring(0, 19)); 
	}
}

function resetAnimation(){
	 clearanim();
         $("#controls").hide();
         $("#palette").hide();
}

function getModelUpdateWithOffset(source, offset){
	var m = getActiveModel(source);
	var modelUpdate = moment.utc(m.model_update + "Z");
	var run = moment.utc(modelUpdate.valueOf() - offset*m.init_timestep_min*60*1000).format().substring(0, 19);;	
	return run;
}
function calcFDates(meta, run){
	var start = moment.utc(run).add(meta.fore_timestep_min, 'm');
	var end = moment.utc(run).add(meta.fore_timestep_min, 'm');

        if("MONTH" === meta.time_unit){
            end.add((meta.num_timesteps-1), 'M');
        }else{
            end.add((meta.num_timesteps-1)*meta.fore_timestep_min, 'm');
        }
        return calcForecastDates(meta, start, end);
    }

function calcForecastDates(meta, start, end){
        var calendarInterval = 'm'; 
        var calendarIndx = meta.fore_timestep_min;

        if("MONTH" === meta.time_unit){
            calendarInterval = 'M'
            calendarIndx = 1;
        }
	var fDates = [];
	
	for(var cal = start ; !cal.isAfter(end); cal.add(calendarIndx, calendarInterval)){ 
            fDates.push(cal.format().substring(0, 19));
        }
        return fDates;
    }
/**
description: "Surface Convective Available Potential Energy"
display_units: "J/kg"
layer: "cape"
level: "sfc"
model_units: "J/kg"
notes: ""
period: "0"
*/

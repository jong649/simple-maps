
var _source = "gfs0p25";
var _layer = "temp";
var _level = "sfc";
model_update = function(data){
	var qd = new QueryData();
	if('source' in qd){
        	_source = qd.source;
	}
	if('layer' in qd){
        	_layer = qd.layer;
	}
	if('level' in qd){
        	_level = qd.level;
	}
	for(var b in data.model_update){
		if(data.model_update[b][_source]){
			meta=data.model_update[b][_source];
			break;
		}
	}
}


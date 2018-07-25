
var _source = "gfs0p25";
var _layer = "temp";
var _level = "sfc";
var _incr = 1;

cwslayers = function(data){
	__cwslayerspec = data[_source][_layer+":"+_level];	
	console.log(__cwslayerspec);
}

model_update = function(data){
	console.log("loaded");
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
	if('incr' in qd){
        	_incr = qd.incr;
	}
	for(var b in data.model_update){
		if(data.model_update[b][_source]){
			meta=data.model_update[b][_source];
			break;
		}
	}
}


<!--
/* name:  quakeWidgetBeta.js                  */  
/* title: Beta Earthquake Widget              */ 
/* info: Dynamic display components for all   */
/* available Earthquake data for single date. */

function quakeWidget (root, eqData, offset, days) {
   this._w = '720';
   this._h = '500';
   this._tileMode = 'basic';
   this._offset = offset; //number of days to offset from start of current day
   this._hardset = '20100928'; //current day to report (ymd)
   this._duration = days; //number of days to report
   this._dataSet = eqData;
   this._root = root;
}

quakeWidget.prototype.showWrapper = function () { 
    var name = this._root;
    document.write('<div id="'+name+'" class="mfQuakeWidgetBeta"></div>');
}
   
quakeWidget.prototype.showDay = function (offset) {
       var name = this._root;
       document.getElementById(name).innerHTML = this.basicHTML(offset,0);
}

quakeWidget.prototype.showError = function () {
       var name = this._root;
       document.getElementById(name).innerHTML = this.error();
}

quakeWidget.prototype.error = function() {
    return "Sorry for the inconvenience.<br />There is currently no Earthquake information to present at this time.";
}

quakeWidget.prototype.basicHTML = function(offset, size) {
    var basic = '<div style="width: 720px">';
    basic += this.basicNavigation();
    basic += this.basicBingMap();
    basic += '<div style="float: left; clear: both; height: 4px;"></div>'
            + '<div style="float: left; clear: both; min-height: 10px">'  
            + '<table width="720px"><tr><td>TIME</td><td>LOCATION</td><td>MAGNITUDE</td><td>DEPTH</td></tr>'            
            + this.basicRows()
            + '</table></div></div>';
    return basic;
}

quakeWidget.prototype.basicBingMap = function () {
     return '<div id="myMap" style="float: left; position: relative; width:720px; height: 500px; margin-top: 10px"></div>';
}

quakeWidget.prototype.basicRows = function () {
    var basic = '';
    var dataSet = this._dataSet;
    for(var i=0;i<dataSet.length;i++) {
       basic += '<tr><td>' + dataSet[i]['time'] + '</td>';
       basic += '<td><a onClick="updateBingMap (' + dataSet[i]['latitude'] + ', ' + dataSet[i]['longitude'] + ', 5)">' + dataSet[i]['location'] + '</a></td>';
       basic += '<td>' + dataSet[i]['magnitude'] + '</td>';
       basic += '<td>' + dataSet[i]['depth'] + '</td></tr>';
    }
    return basic;
}



quakeWidget.prototype.offsetText = function (num) {
    var val = num; var plu = ''; if(num>1) { plu = 's'; } if (num>0) { num = 1 }   
    var text = new Array();
    text[0] = 'Today';
    text[1] = val + ' Day' + plu + ' Ago';    
    return text[num];
}

quakeWidget.prototype.basicNavigation = function () {
    var nav = '<div style="float: left; position: relative; width: 720px;">';    

    if(this._offset < (this._duration-1)) { nav += '<div style="float: right; text-align: right" class="navButton"><a href="javascript: updateEQ(' + (this._offset+1) + '); void(0);">OLDER</a> &rarr;</div>'; } else { nav += '<div style="float: right; text-align: right" class="navButton">&nbsp;</div>'; }
    if(this._offset > 0) { nav += '<div style="float: left" class="navButton">&larr; <a href="javascript: updateEQ(' + (this._offset-1) + '); void(0);">NEWER</a></div>'; } else { nav += '<div style="float: left;" class="navButton">&nbsp;</div>'; }
    nav += '<div style="text-align: center; font-weight: bold; font-size: 16px; color: #3366CC">' + this.offsetText(this._offset) + '</div>';
    nav += '</div>';
    return nav;
}
-->
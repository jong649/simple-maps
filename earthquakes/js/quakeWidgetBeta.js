 scrollTo(300,0);

<!--//
 /* remote functions */
 /* create container */
    document.write('<div id="EQMAP"></div>');

/* name:  quakeWidgetBeta.js                  */  
/* title: Beta Earthquake Widget              */ 
/* info: Dynamic display components for all   */
/* available Earthquake data for single date. */

function quakeWidget (root, eqData, offset, days) {

   //console.log(eqData);
   this._w = '100%';
   this._h = '500';
   this._tileMode = 'basic';
   this._offset = (offset*1); //number of days to offset from start of current day
   this._hardset = '20100928'; //current day to report (ymd)
   this._duration = days; //number of days to report
   this._dataSet = eqData;
   this._root = root;
}

quakeWidget.prototype.showWrapper = function () { 
    var name = this._root;
    document.getElementById('EQMAP').innerHTML = ('<div style="position: relative"></div><div id="'+name+'" class="mfQuakeWidgetBeta" style="position: relative"></div>');
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
    var basic = '<div style="width: 100%">';
    basic += this.basicBingMap();
    basic += this.basicNavigation();
    basic += '<div style="float: left; clear: both; height: 4px;"></div>'
    + '<div style="float: left; clear: both; min-height: 10px;width: 100%;">'  
    + '<div style="width: 100%; height: 250px; overflow: auto">'
    + '<table width="100%" id="quakescss"><tr>'
    + this.basicRows()  
    + '</table></div></div>'
    + '</div>';
    basic += '<div style="float: left;"><small>Data provided by <a href="http://customweather.com">CustomWeather</a> &copy;2017</small></div>';
    return basic;
}

quakeWidget.prototype.basicBingMap = function () {
    return '<div id="myeqMap" style="float: left; position: relative; width:100%; height: 500px; margin-top: 10px"></div>';
}

quakeWidget.prototype.basicRows = function () {
    var basic = '';
    var dataSet = this._dataSet[this._offset];
    var nox = dataSet.length;
    for(var i=nox-1;i>-1;i--) {
       basic += '<tr><td>' + dataSet[i]['time'] + '</td>';
       basic += '<td><a style="cursor: pointer;';       
       basic += '" id="ds' + (i) + '" onClick="updateBingMap (' + dataSet[i]['latitude'] + ', ' + dataSet[i]['longitude'] + ', 5, ' + (i) + ', ' + (this._offset) + ')">' + dataSet[i]['location'] + '</a></td>';
       basic += '<td>Magnitude: <B>' + dataSet[i]['magnitude'] + '</B></td>';
       basic += '<td>[Depth: ' + dataSet[i]['depth'] + 'km]</td></tr>';
    }
    return basic;
}

quakeWidget.prototype.offsetText = function (num) {
    var val = num; var plu = '';
    if(num>1) { plu = 's'; }
    if (num>0) { num = 1; }   
    var text = new Array();
    text[0] = 'Recent Earthquakes (past 24 hours)';
    text[1] = val + ' Day' + plu + ' Ago';    
    return text[num];
}

quakeWidget.prototype.basicNavigation = function () {
    var nav = '<div style="float: left; position: relative; width: 720px;">';    
    if(this._dataSet[this._offset+1]) { nav += '<div style="float: right; text-align: right" class="navButton"><a href="javascript: updateEQ(' + (this._offset+1) + '); void(0);">OLDER</a> &rarr;</div>'; } else { nav += '<div style="float: right; text-align: right" class="navButton">&nbsp;</div>'; }
    if(this._dataSet[this._offset-1]) { nav += '<div style="float: left" class="navButton">&larr; <a href="javascript: updateEQ(' + (this._offset-1) + '); void(0);">NEWER</a></div>'; } else { nav += '<div style="float: left;" class="navButton">&nbsp;</div>'; }
    nav += '<div style="text-align: center; font-weight: bold; font-size: 16px; color: #3366CC">' + this.offsetText(this._offset) + '</div>';
    nav += '</div>';
    return nav;
}
-->

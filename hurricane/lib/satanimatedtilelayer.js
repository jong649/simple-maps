/*******************************************************************************
* Description:
* This module provides a framework for creating animated tilelayers in Bing Maps v7
* 
*******************************************************************************/
function SatAnimatedTileLayer(map, frames, options) {

  /**
  * PRIVATE MEMBERS
  */ 
  var _map = map; // The map onto which to add the layer
  var _frames = frames; // the URL for the frames of animation
  var _frame = 0; // The index of the current frame
  var _animatedTileLayer = null; // The queue of tilelayers
  var _intervalId = ""; // ID assigned by setInterval() method
  var _direction = 1; // Direction of animation: forwards(1) or backwards(-1)

  // Set default options
  var _options = {
    // Loop behaviour when animating past first/last frames: 'loop', 'stop', or 'bounce'
    loopbehaviour: 'loop',

    // Number of ms between frame changes
    framerate: 1000,

    // Opacity
    opacity: 1,

    // Safe mode uses only methods provided by the Bing Maps API
    // Dangerous mode uses direct DOM manipulation
    mode: 'safe',

    // Number of frames to load in advance onto the queue
    // Higher values may lead to smoother animation (since tiles will be pre-loaded
    // prior to display, but will incur greater resource usage
    lookAhead: 1,
    
    // Callback function to be fired each time frame is updated 
    frameChangeCallback: null
  };

  /**
  * PRIVATE METHODS
  */
  
  /* Initialisation */
  function _init() {
    // Override defaults with any options passed in the constructor
    _setOptions(options);

    // Create the tile queue and add it to the map
    _satanimatedTileLayer = new Microsoft.Maps.EntityCollection();
    map.entities.push(_satanimatedTileLayer);

    // Push the first frame of animation onto the tile queue
    _redraw();
  }

  /* Replace default options with user-specified values */
  function _setOptions(options) {
    for (attrname in options) {
      _options[attrname] = options[attrname];
    }
  }

  /* Play the animation in the current direction */
  function _play() {
    if (_intervalId == "") {
      _intervalId = setInterval(_nextFrame, _options.framerate);
    }
  }

  /* Reset the animation back to the first frame */
  function _reset() {
    _satanimatedTileLayer.clear();
    _frame = 0;
    _redraw();
  }

  /* Stop the animation if currently playing */
  function _stop() {
    if (_intervalId != "") {
      clearInterval(_intervalId);
      _intervalId = "";
    }
  }

  /* Jump to the specified frame index */
  function _goToFrame(n) {
    if (n > 0 && (n < _frames.length || _frames.length == 1)) {
      _satanimatedTileLayer.clear();
      _frame = n;
      _redraw();
    }
  }

  /* Advance to the next frame in a playing animation and, if we       */
  /* reach the end of the animation, adjust for desired loop behaviour */
  function _nextFrame() {
 
  // Increment (or decrement) the frame counter based on animation direction
  _frame += _direction;

  // Test if requested frame lies outside specified array of frames
  if (_frames.length > 1 && (_frame >= _frames.length -1 || _frame < 0)) {
    
    // Varies depending on desired loop behaviour
    switch (_options.loopbehaviour) {

      // Loop (default) the animation from the other end
      case 'loop':
        _frame = _frames.length - (_direction * _frame) -1;
        break;

      // Stop the animation
      case 'stop':
        _stop();
        _frame -= _direction;
        break;

      // Continue by reversing direction of animation
      case 'bounce':
       _direction *= -1;
       _frame = _frame + (2 * _direction);
       break;
      }
    }
    // Push the next frame onto the queue
    _redraw();
  }

  /* Add new layers to the end of the tile queue and display the current frame */
  function _redraw() {

    // Retrieve the URI of the next frame
    var uri = "";
    if (_frames.length > 1) { // Specified array of frames
      uri = _frames[_frame];
    }
    else {
      uri = _frames[0].replace('{frame}', _frame); // Single URL with {frame} placeholder
    }

    // Create a new tilelayer for the requested frame
    // Visibility must be set to true and the tilelayer must have non-zero opacity
    // in order for tiles to be requested
    var tileOptions = {
      mercator: new Microsoft.Maps.TileSource({ uriConstructor: uri }),
      opacity: 0.01,
      visible: true
    };

    // Add the tilelayer onto the end of the tile queue
    var tileLayer = new Microsoft.Maps.TileLayer(tileOptions);
    _satanimatedTileLayer.push(tileLayer);

    // If there is only one frame of animation in the queue, make it visible
    if (_satanimatedTileLayer.getLength() == 1) {
      var x = _satanimatedTileLayer.get(0);
      x.setOptions({ opacity: _options.opacity });
      //_animatedTileLayer.get(0).setOptions({ opacity: _options.opacity });
    }
    // If there is more than one frame
    else while (_satanimatedTileLayer.getLength() > _options.lookAhead + 1) {

      // Display the next frame depending on the mode selected
      switch (_options.mode) {

        case 'safe':
          // Set the opacity using the API method - incurs slight delay
          //_animatedTileLayer.get(1).setOptions({ opacity: _options.opacity });
          var x = _satanimatedTileLayer.get(1);
          x.setOptions({ opacity: _options.opacity });
          break;

        case 'dangerous':
          // Can reduce flicker by setting opacity directly through the DOM
          // See http://www.bing.com/community/maps/f/12284/t/665816.aspx
          _map.getModeLayer().children[0].children[1].style.opacity = _options.opacity;
          break;
      }
      // Remove the currently displayed frame
      _satanimatedTileLayer.removeAt(0);
      
    }

    // If specified, fire the frameChange callback
    if (_options.frameChangeCallback) {
      _options.frameChangeCallback(_frame);
    }
  }

  /**
  * PUBLIC METHODS
  */
  this.play = function() {
    _direction = 1;
    _play();
  }
  this.playbackwards = function() {
    _direction = -1;
    _play();
  }
  this.goToFrame = function(n) {
    _goToFrame(n);
  }
  this.stop = function() {
    _stop();
  }
  this.reset = function() {
    _reset();
  }
  this.setOptions = function(options) {
    _setOptions(options);
  }

  // Call the initalisation routine
  _init();

}
Microsoft.Maps.moduleLoaded('satanimatedTileLayerModule');

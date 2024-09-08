(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.VideomailClient = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(_dereq_,module,exports){
function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
module.exports = _arrayLikeToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{}],2:[function(_dereq_,module,exports){
var arrayLikeToArray = _dereq_("./arrayLikeToArray.js");
function _arrayWithoutHoles(r) {
  if (Array.isArray(r)) return arrayLikeToArray(r);
}
module.exports = _arrayWithoutHoles, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{"./arrayLikeToArray.js":1}],3:[function(_dereq_,module,exports){
var toPropertyKey = _dereq_("./toPropertyKey.js");
function _defineProperty(e, r, t) {
  return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t, e;
}
module.exports = _defineProperty, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{"./toPropertyKey.js":9}],4:[function(_dereq_,module,exports){
function _interopRequireDefault(e) {
  return e && e.__esModule ? e : {
    "default": e
  };
}
module.exports = _interopRequireDefault, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{}],5:[function(_dereq_,module,exports){
function _iterableToArray(r) {
  if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
}
module.exports = _iterableToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{}],6:[function(_dereq_,module,exports){
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
module.exports = _nonIterableSpread, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{}],7:[function(_dereq_,module,exports){
var arrayWithoutHoles = _dereq_("./arrayWithoutHoles.js");
var iterableToArray = _dereq_("./iterableToArray.js");
var unsupportedIterableToArray = _dereq_("./unsupportedIterableToArray.js");
var nonIterableSpread = _dereq_("./nonIterableSpread.js");
function _toConsumableArray(r) {
  return arrayWithoutHoles(r) || iterableToArray(r) || unsupportedIterableToArray(r) || nonIterableSpread();
}
module.exports = _toConsumableArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{"./arrayWithoutHoles.js":2,"./iterableToArray.js":5,"./nonIterableSpread.js":6,"./unsupportedIterableToArray.js":11}],8:[function(_dereq_,module,exports){
var _typeof = _dereq_("./typeof.js")["default"];
function toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
module.exports = toPrimitive, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{"./typeof.js":10}],9:[function(_dereq_,module,exports){
var _typeof = _dereq_("./typeof.js")["default"];
var toPrimitive = _dereq_("./toPrimitive.js");
function toPropertyKey(t) {
  var i = toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
module.exports = toPropertyKey, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{"./toPrimitive.js":8,"./typeof.js":10}],10:[function(_dereq_,module,exports){
function _typeof(o) {
  "@babel/helpers - typeof";

  return (module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports), _typeof(o);
}
module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{}],11:[function(_dereq_,module,exports){
var arrayLikeToArray = _dereq_("./arrayLikeToArray.js");
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? arrayLikeToArray(r, a) : void 0;
  }
}
module.exports = _unsupportedIterableToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{"./arrayLikeToArray.js":1}],12:[function(_dereq_,module,exports){
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["add-eventlistener-with-options"] = factory();
	else
		root["add-eventlistener-with-options"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = addEventListenerWithOptions;

	var _checkSupport = __webpack_require__(1);

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	/**
	 * Add event listener with additional options
	 * @param {EventTarget} target - The EventTarget element
	 * @param {string} name - The name of the event
	 * @param {function} listener - The event listener callback
	 * @param {object} options - The options explicitly passed from caller
	 * @param {string} optionName - The additioanl option to add to the event listener 
	 */
	function addEventListenerWithOptions(target, name, listener, options) {
	    var optionName = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'passive';

	    if (target.addEventListener !== undefined) {
	        var listenerOptions = _checkSupport.SupportMap[optionName] ? Object.assign({}, options, _defineProperty({}, optionName, true)) : options;
	        target.addEventListener(name, listener, listenerOptions);
	    }
	}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.SupportMap = undefined;

	var _OptionsMap;

	var _constants = __webpack_require__(2);

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	var OptionsMap = (_OptionsMap = {}, _defineProperty(_OptionsMap, _constants.PASSIVE, false), _defineProperty(_OptionsMap, _constants.CAPTURE, false), _defineProperty(_OptionsMap, _constants.ONCE, false), _OptionsMap);

	var getOptionsMap = function getOptionsMap() {
	    Object.keys(OptionsMap).forEach(function (k, i) {
	        OptionsMap[k] = checkSupportForProperty(k);
	    });

	    return OptionsMap;
	};

	function checkSupportForProperty(property) {
	    if (!!OptionsMap[property]) {
	        return OptionsMap[property];
	    }

	    try {
	        var opts = Object.defineProperty({}, property, {
	            get: function get() {
	                OptionsMap[property] = true;
	            }
	        });
	        window.addEventListener("test", null, opts);
	        window.removeListener("test", null);
	    } catch (e) {}

	    return OptionsMap[property];
	}

	var SupportMap = exports.SupportMap = getOptionsMap();

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var PASSIVE = exports.PASSIVE = 'passive';
	var CAPTURE = exports.CAPTURE = 'capture';
	var ONCE = exports.ONCE = 'once';

/***/ }
/******/ ])
});
;
},{}],13:[function(_dereq_,module,exports){
var EventEmitter          = _dereq_('events').EventEmitter,
    inherits              = _dereq_('inherits'),
    raf                   = _dereq_('raf'),
    methods;


//the same as off window unless polyfilled or in node
var defaultRAFObject = {
    requestAnimationFrame: raf,
    cancelAnimationFrame: raf.cancel
};

function returnTrue(){ return true; }

//manage FPS if < 60, else return true;
function makeThrottle(fps){
    var delay = 1000/fps;
    var lastTime = Date.now();


    if( fps<=0 || fps === Infinity ){
        return returnTrue;
    }

    //if an fps throttle has been set then we'll assume
    //it natively runs at 60fps,
    var half = Math.ceil(1000 / 60) / 2;

    return function(){
        //if a custom fps is requested
        var now = Date.now();
        //is this frame within 8.5ms of the target?
        //if so then next frame is gonna be too late
        if(now - lastTime < delay - half){
            return false;
        }
        lastTime = now;
        return true;
    };
}


/**
 * Animitter provides event-based loops for the browser and node,
 * using `requestAnimationFrame`
 * @param {Object} [opts]
 * @param {Number} [opts.fps=Infinity] the framerate requested, defaults to as fast as it can (60fps on window)
 * @param {Number} [opts.delay=0] milliseconds delay between invoking `start` and initializing the loop
 * @param {Object} [opts.requestAnimationFrameObject=global] the object on which to find `requestAnimationFrame` and `cancelAnimationFrame` methods
 * @param {Boolean} [opts.fixedDelta=false] if true, timestamps will pretend to be executed at fixed intervals always
 * @constructor
 */
function Animitter( opts ){
    opts = opts || {};

    this.__delay = opts.delay || 0;

    /** @expose */
    this.fixedDelta = !!opts.fixedDelta;

    /** @expose */
    this.frameCount = 0;
    /** @expose */
    this.deltaTime = 0;
    /** @expose */
    this.elapsedTime = 0;

    /** @private */
    this.__running = false;
    /** @private */
    this.__completed = false;

    this.setFPS(opts.fps || Infinity);
    this.setRequestAnimationFrameObject(opts.requestAnimationFrameObject || defaultRAFObject);
}

inherits(Animitter, EventEmitter);

function onStart(scope){
    var now = Date.now();
    var rAFID;
    //dont let a second animation start on the same object
    //use *.on('update',fn)* instead
    if(scope.__running){
        return scope;
    }

    exports.running += 1;
    scope.__running = true;
    scope.__lastTime = now;
    scope.deltaTime = 0;

    //emit **start** once at the beginning
    scope.emit('start', scope.deltaTime, 0, scope.frameCount);

    var lastRAFObject = scope.requestAnimationFrameObject;

    var drawFrame = function(){
        if(lastRAFObject !== scope.requestAnimationFrameObject){
            //if the requestAnimationFrameObject switched in-between,
            //then re-request with the new one to ensure proper update execution context
            //i.e. VRDisplay#submitFrame() may only be requested through VRDisplay#requestAnimationFrame(drawFrame)
            lastRAFObject = scope.requestAnimationFrameObject;
            scope.requestAnimationFrameObject.requestAnimationFrame(drawFrame);
            return;
        }
        if(scope.__isReadyForUpdate()){
            scope.update();
        }
        if(scope.__running){
            rAFID = scope.requestAnimationFrameObject.requestAnimationFrame(drawFrame);
        } else {
            scope.requestAnimationFrameObject.cancelAnimationFrame(rAFID);
        }
    };

    scope.requestAnimationFrameObject.requestAnimationFrame(drawFrame);

    return scope;
}

methods = {
    //EventEmitter Aliases
    off     : EventEmitter.prototype.removeListener,
    trigger : EventEmitter.prototype.emit,

    /**
     * stops the animation and marks it as completed
     * @emit Animitter#complete
     * @returns {Animitter}
     */
    complete: function(){
        this.stop();
        this.__completed = true;
        this.emit('complete', this.frameCount, this.deltaTime);
        return this;
    },

    /**
     * stops the animation and removes all listeners
     * @emit Animitter#stop
     * @returns {Animitter}
     */
    dispose: function(){
        this.stop();
        this.removeAllListeners();
        return this;
    },

    /**
     * get milliseconds between the last 2 updates
     *
     * @return {Number}
     */
    getDeltaTime: function(){
        return this.deltaTime;
    },

    /**
     * get the total milliseconds that the animation has ran.
     * This is the cumlative value of the deltaTime between frames
     *
     * @return {Number}
     */
    getElapsedTime: function(){
        return this.elapsedTime;
    },

    /**
     * get the instances frames per second as calculated by the last delta
     *
     * @return {Number}
     */
    getFPS: function(){
        return this.deltaTime > 0 ? 1000 / this.deltaTime : 0;
        if(this.deltaTime){
            return 1000 / this.deltaTime;
        }
    },

    /**
     * get the explicit FPS limit set via `Animitter#setFPS(fps)` or
     * via the initial `options.fps` property
     *
     * @returns {Number} either as set or Infinity
     */
    getFPSLimit: function(){
        return this.__fps;
    },

    /**
     * get the number of frames that have occurred
     *
     * @return {Number}
     */
    getFrameCount: function(){
        return this.frameCount;
    },


    /**
     * get the object providing `requestAnimationFrame`
     * and `cancelAnimationFrame` methods
     * @return {Object}
     */
    getRequestAnimationFrameObject: function(){
        return this.requestAnimationFrameObject;
    },

    /**
     * is the animation loop active
     *
     * @return {boolean}
     */
    isRunning: function(){
        return this.__running;
    },

    /**
     * is the animation marked as completed
     *
     * @return {boolean}
     */
    isCompleted: function(){
        return this.__completed;
    },

    /**
     * reset the animation loop, marks as incomplete,
     * leaves listeners intact
     *
     * @emit Animitter#reset
     * @return {Animitter}
     */
    reset: function(){
        this.stop();
        this.__completed = false;
        this.__lastTime = 0;
        this.deltaTime = 0;
        this.elapsedTime = 0;
        this.frameCount = 0;

        this.emit('reset', 0, 0, this.frameCount);
        return this;
    },

    /**
     * set the framerate for the animation loop
     *
     * @param {Number} fps
     * @return {Animitter}
     */
    setFPS: function(fps){
        this.__fps = fps;
        this.__isReadyForUpdate = makeThrottle(fps);
        return this;
    },

    /**
     * set the object that will provide `requestAnimationFrame`
     * and `cancelAnimationFrame` methods to this instance
     * @param {Object} object
     * @return {Animitter}
     */
    setRequestAnimationFrameObject: function(object){
        if(typeof object.requestAnimationFrame !== 'function' || typeof object.cancelAnimationFrame !== 'function'){
            throw new Error("Invalid object provide to `setRequestAnimationFrameObject`");
        }
        this.requestAnimationFrameObject = object;
        return this;
    },

    /**
     * start an animation loop
     * @emit Animitter#start
     * @return {Animitter}
     */
    start: function(){
        var self = this;
        if(this.__delay){
            setTimeout(function(){
                onStart(self);
            }, this.__delay);
        } else {
            onStart(this);
        }
        return this;
    },

    /**
     * stops the animation loop, does not mark as completed
     *
     * @emit Animitter#stop
     * @return {Animitter}
     */
    stop: function(){
        if( this.__running ){
            this.__running = false;
            exports.running -= 1;
            this.emit('stop', this.deltaTime, this.elapsedTime, this.frameCount);
        }
        return this;
    },

    /**
     * update the animation loop once
     *
     * @emit Animitter#update
     * @return {Animitter}
     */
    update: function(){
        this.frameCount++;
        /** @private */
        var now = Date.now();
        this.__lastTime = this.__lastTime || now;
        this.deltaTime = (this.fixedDelta || exports.globalFixedDelta) ? 1000/Math.min(60, this.__fps) : now - this.__lastTime;
        this.elapsedTime += this.deltaTime;
        this.__lastTime = now;

        this.emit('update', this.deltaTime, this.elapsedTime, this.frameCount);
        return this;
    }
};



for(var method in methods){
    Animitter.prototype[method] = methods[method];
}


/**
 * create an animitter instance,
 * @param {Object} [options]
 * @param {Function} fn( deltaTime:Number, elapsedTime:Number, frameCount:Number )
 * @returns {Animitter}
 */
function createAnimitter(options, fn){

    if( arguments.length === 1 && typeof options === 'function'){
        fn = options;
        options = {};
    }

    var _instance = new Animitter( options );

    if( fn ){
        _instance.on('update', fn);
    }

    return _instance;
}

module.exports = exports = createAnimitter;

/**
 * create an animitter instance,
 * where the scope is bound in all functions
 * @param {Object} [options]
 * @param {Function} fn( deltaTime:Number, elapsedTime:Number, frameCount:Number )
 * @returns {Animitter}
 */
exports.bound = function(options, fn){

    var loop = createAnimitter(options, fn),
        functionKeys = functions(Animitter.prototype),
        hasBind = !!Function.prototype.bind,
        fnKey;

    for(var i=0; i<functionKeys.length; i++){
        fnKey = functionKeys[i];
        loop[fnKey] = hasBind ? loop[fnKey].bind(loop) : bind(loop[fnKey], loop);
    }

    return loop;
};


exports.Animitter = Animitter;

/**
 * if true, all `Animitter` instances will behave as if `options.fixedDelta = true`
 */
exports.globalFixedDelta = false;

//helpful to inherit from when using bundled
exports.EventEmitter = EventEmitter;
//keep a global counter of all loops running, helpful to watch in dev tools
exports.running = 0;

function bind(fn, scope){
    if(typeof fn.bind === 'function'){
        return fn.bind(scope);
    }
    return function(){
        return fn.apply(scope, arguments);
    };
}

function functions(obj){
    var keys = Object.keys(obj);
    var arr = [];
    for(var i=0; i<keys.length; i++){
        if(typeof obj[keys[i]] === 'function'){
            arr.push(keys[i]);
        }
    }
    return arr;
}



//polyfill Date.now for real-old browsers
Date.now = Date.now || function now() {
    return new Date().getTime();
};

},{"events":44,"inherits":66,"raf":85}],14:[function(_dereq_,module,exports){
function t(t){return t&&"object"==typeof t&&"default"in t?t:{default:t}}var r=/*#__PURE__*/t(_dereq_("typedarray-to-buffer"));module.exports=/*#__PURE__*/function(){function t(t){this.float32Array=void 0,this.float32Array=t}return t.prototype.toBuffer=function(){var t=new Int16Array(this.float32Array.length);return this.float32Array.forEach(function(r,o){t[o]=32767*Math.min(1,r)}),r.default(t)},t}();


},{"typedarray-to-buffer":109}],15:[function(_dereq_,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],16:[function(_dereq_,module,exports){

},{}],17:[function(_dereq_,module,exports){
/*!
 * Cross-Browser Split 1.1.1
 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
 * Available under the MIT License
 * ECMAScript compliant, uniform cross-browser split method
 */

/**
 * Splits a string into an array of strings using a regex or string separator. Matches of the
 * separator are not included in the result array. However, if `separator` is a regex that contains
 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
 * cross-browser.
 * @param {String} str String to split.
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 * @example
 *
 * // Basic use
 * split('a b c d', ' ');
 * // -> ['a', 'b', 'c', 'd']
 *
 * // With limit
 * split('a b c d', ' ', 2);
 * // -> ['a', 'b']
 *
 * // Backreferences in result array
 * split('..word1 word2..', /([a-z]+)(\d+)/i);
 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
 */
module.exports = (function split(undef) {

  var nativeSplit = String.prototype.split,
    compliantExecNpcg = /()??/.exec("")[1] === undef,
    // NPCG: nonparticipating capturing group
    self;

  self = function(str, separator, limit) {
    // If `separator` is not a regex, use `nativeSplit`
    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
      return nativeSplit.call(str, separator, limit);
    }
    var output = [],
      flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + // Proposed for ES6
      (separator.sticky ? "y" : ""),
      // Firefox 3+
      lastLastIndex = 0,
      // Make `global` and avoid `lastIndex` issues by working with a copy
      separator = new RegExp(separator.source, flags + "g"),
      separator2, match, lastIndex, lastLength;
    str += ""; // Type-convert
    if (!compliantExecNpcg) {
      // Doesn't need flags gy, but they don't hurt
      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
    }
    /* Values for `limit`, per the spec:
     * If undefined: 4294967295 // Math.pow(2, 32) - 1
     * If 0, Infinity, or NaN: 0
     * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
     * If negative number: 4294967296 - Math.floor(Math.abs(limit))
     * If other: Type-convert, then use the above rules
     */
    limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
    limit >>> 0; // ToUint32(limit)
    while (match = separator.exec(str)) {
      // `separator.lastIndex` is not reliable cross-browser
      lastIndex = match.index + match[0].length;
      if (lastIndex > lastLastIndex) {
        output.push(str.slice(lastLastIndex, match.index));
        // Fix browsers whose `exec` methods don't consistently return `undefined` for
        // nonparticipating capturing groups
        if (!compliantExecNpcg && match.length > 1) {
          match[0].replace(separator2, function() {
            for (var i = 1; i < arguments.length - 2; i++) {
              if (arguments[i] === undef) {
                match[i] = undef;
              }
            }
          });
        }
        if (match.length > 1 && match.index < str.length) {
          Array.prototype.push.apply(output, match.slice(1));
        }
        lastLength = match[0].length;
        lastLastIndex = lastIndex;
        if (output.length >= limit) {
          break;
        }
      }
      if (separator.lastIndex === match.index) {
        separator.lastIndex++; // Avoid an infinite loop
      }
    }
    if (lastLastIndex === str.length) {
      if (lastLength || !separator.test("")) {
        output.push("");
      }
    } else {
      output.push(str.slice(lastLastIndex));
    }
    return output.length > limit ? output.slice(0, limit) : output;
  };

  return self;
})();

},{}],18:[function(_dereq_,module,exports){
(function (Buffer){(function (){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = _dereq_('base64-js')
var ieee754 = _dereq_('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function () { return 42 } }
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species != null &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayLike(value)
  }

  if (value == null) {
    throw TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  var valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  var b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(
      value[Symbol.toPrimitive]('string'), encodingOrOffset, length
    )
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      buf = Buffer.from(buf)
    }
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  var len = string.length
  var mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
        : (firstByte > 0xBF) ? 2
          : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (var i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    var len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

}).call(this)}).call(this,_dereq_("buffer").Buffer)
},{"base64-js":15,"buffer":18,"ieee754":64}],19:[function(_dereq_,module,exports){
'use strict';

var GetIntrinsic = _dereq_('get-intrinsic');

var callBind = _dereq_('./');

var $indexOf = callBind(GetIntrinsic('String.prototype.indexOf'));

module.exports = function callBoundIntrinsic(name, allowMissing) {
	var intrinsic = GetIntrinsic(name, !!allowMissing);
	if (typeof intrinsic === 'function' && $indexOf(name, '.prototype.') > -1) {
		return callBind(intrinsic);
	}
	return intrinsic;
};

},{"./":20,"get-intrinsic":51}],20:[function(_dereq_,module,exports){
'use strict';

var bind = _dereq_('function-bind');
var GetIntrinsic = _dereq_('get-intrinsic');
var setFunctionLength = _dereq_('set-function-length');

var $TypeError = _dereq_('es-errors/type');
var $apply = GetIntrinsic('%Function.prototype.apply%');
var $call = GetIntrinsic('%Function.prototype.call%');
var $reflectApply = GetIntrinsic('%Reflect.apply%', true) || bind.call($call, $apply);

var $defineProperty = _dereq_('es-define-property');
var $max = GetIntrinsic('%Math.max%');

module.exports = function callBind(originalFunction) {
	if (typeof originalFunction !== 'function') {
		throw new $TypeError('a function is required');
	}
	var func = $reflectApply(bind, $call, arguments);
	return setFunctionLength(
		func,
		1 + $max(0, originalFunction.length - (arguments.length - 1)),
		true
	);
};

var applyBind = function applyBind() {
	return $reflectApply(bind, $apply, arguments);
};

if ($defineProperty) {
	$defineProperty(module.exports, 'apply', { value: applyBind });
} else {
	module.exports.apply = applyBind;
}

},{"es-define-property":36,"es-errors/type":42,"function-bind":49,"get-intrinsic":51,"set-function-length":100}],21:[function(_dereq_,module,exports){
function t(t){return t&&"object"==typeof t&&"default"in t?t:{default:t}}var e,i=/*#__PURE__*/t(_dereq_("typedarray-to-buffer")),r="undefined"!=typeof document&&"function"==typeof document.createElement,n=r?["webp","jpeg"]:["png"],o=/*#__PURE__*/function(){function t(t,e,i){if(void 0===e&&(e=n),void 0===i&&(i=.5),this.quality=void 0,this.types=void 0,this.canvas=void 0,e.length>2)throw new Error("Too many image types are specified!");this.canvas=t,this.quality=i,this.types=e}var o=t.prototype;return o.composeMimeType=function(t){var e;return this.types[t]&&(e="image/"+this.types[t]),e},o.isMatch=function(t,e){return t.match(e)},o.getTestCanvas=function(){var t;return r?(t=document.createElement("canvas")).width=t.height=1:t=this.canvas,t},o.canvasSupportsMimeType=function(t){try{var e=this.getTestCanvas(),i=e.toDataURL&&e.toDataURL(t);return this.isMatch(i,t)}catch(t){return!1}},o.figureMimeType=function(){var t=this.composeMimeType(0);return t&&this.canvasSupportsMimeType(t)||(this.types[1]?(t=this.composeMimeType(1))&&!this.canvasSupportsMimeType(t)&&(t=void 0):t=void 0),t},o.uriToBuffer=function(e){var n,o=e.split(",")[1];if(!o)throw new Error("Empty uri string given!");if(!(n=r?window.atob(o):null==t.atob?void 0:t.atob(o)))throw new Error("Byte are empty, something within atob went wrong.");for(var a=new Uint8Array(n.length),s=0,u=n.length;s<u;s++)a[s]=n.charCodeAt(s);return i.default(a)},o.toBuffer=function(){var t,e=this.getMimeType();if(e){var i=this.canvas.toDataURL(e,this.quality);t=this.uriToBuffer(i)}return t},o.getMimeType=function(){return e&&r||(e=this.figureMimeType()),e},t}();o.atob=void 0,module.exports=o;


},{"typedarray-to-buffer":109}],22:[function(_dereq_,module,exports){
// contains, add, remove, toggle
var indexof = _dereq_('indexof')

module.exports = ClassList

function ClassList(elem) {
    var cl = elem.classList

    if (cl) {
        return cl
    }

    var classList = {
        add: add
        , remove: remove
        , contains: contains
        , toggle: toggle
        , toString: $toString
        , length: 0
        , item: item
    }

    return classList

    function add(token) {
        var list = getTokens()
        if (indexof(list, token) > -1) {
            return
        }
        list.push(token)
        setTokens(list)
    }

    function remove(token) {
        var list = getTokens()
            , index = indexof(list, token)

        if (index === -1) {
            return
        }

        list.splice(index, 1)
        setTokens(list)
    }

    function contains(token) {
        return indexof(getTokens(), token) > -1
    }

    function toggle(token) {
        if (contains(token)) {
            remove(token)
            return false
        } else {
            add(token)
            return true
        }
    }

    function $toString() {
        return elem.className
    }

    function item(index) {
        var tokens = getTokens()
        return tokens[index] || null
    }

    function getTokens() {
        var className = elem.className

        return filter(className.split(" "), isTruthy)
    }

    function setTokens(list) {
        var length = list.length

        elem.className = list.join(" ")
        classList.length = length

        for (var i = 0; i < list.length; i++) {
            classList[i] = list[i]
        }

        delete list[length]
    }
}

function filter (arr, fn) {
    var ret = []
    for (var i = 0; i < arr.length; i++) {
        if (fn(arr[i])) ret.push(arr[i])
    }
    return ret
}

function isTruthy(value) {
    return !!value
}

},{"indexof":65}],23:[function(_dereq_,module,exports){
/*
 * classList.js: Cross-browser full element.classList implementation.
 * 1.1.20150312
 *
 * By Eli Grey, http://eligrey.com
 * License: Dedicated to the public domain.
 *   See https://github.com/eligrey/classList.js/blob/master/LICENSE.md
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */

if ("document" in self) {

// Full polyfill for browsers with no classList support
// Including IE < Edge missing SVGElement.classList
if (!("classList" in document.createElement("_")) 
	|| document.createElementNS && !("classList" in document.createElementNS("http://www.w3.org/2000/svg","g"))) {

(function (view) {

"use strict";

if (!('Element' in view)) return;

var
	  classListProp = "classList"
	, protoProp = "prototype"
	, elemCtrProto = view.Element[protoProp]
	, objCtr = Object
	, strTrim = String[protoProp].trim || function () {
		return this.replace(/^\s+|\s+$/g, "");
	}
	, arrIndexOf = Array[protoProp].indexOf || function (item) {
		var
			  i = 0
			, len = this.length
		;
		for (; i < len; i++) {
			if (i in this && this[i] === item) {
				return i;
			}
		}
		return -1;
	}
	// Vendors: please allow content code to instantiate DOMExceptions
	, DOMEx = function (type, message) {
		this.name = type;
		this.code = DOMException[type];
		this.message = message;
	}
	, checkTokenAndGetIndex = function (classList, token) {
		if (token === "") {
			throw new DOMEx(
				  "SYNTAX_ERR"
				, "An invalid or illegal string was specified"
			);
		}
		if (/\s/.test(token)) {
			throw new DOMEx(
				  "INVALID_CHARACTER_ERR"
				, "String contains an invalid character"
			);
		}
		return arrIndexOf.call(classList, token);
	}
	, ClassList = function (elem) {
		var
			  trimmedClasses = strTrim.call(elem.getAttribute("class") || "")
			, classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
			, i = 0
			, len = classes.length
		;
		for (; i < len; i++) {
			this.push(classes[i]);
		}
		this._updateClassName = function () {
			elem.setAttribute("class", this.toString());
		};
	}
	, classListProto = ClassList[protoProp] = []
	, classListGetter = function () {
		return new ClassList(this);
	}
;
// Most DOMException implementations don't allow calling DOMException's toString()
// on non-DOMExceptions. Error's toString() is sufficient here.
DOMEx[protoProp] = Error[protoProp];
classListProto.item = function (i) {
	return this[i] || null;
};
classListProto.contains = function (token) {
	token += "";
	return checkTokenAndGetIndex(this, token) !== -1;
};
classListProto.add = function () {
	var
		  tokens = arguments
		, i = 0
		, l = tokens.length
		, token
		, updated = false
	;
	do {
		token = tokens[i] + "";
		if (checkTokenAndGetIndex(this, token) === -1) {
			this.push(token);
			updated = true;
		}
	}
	while (++i < l);

	if (updated) {
		this._updateClassName();
	}
};
classListProto.remove = function () {
	var
		  tokens = arguments
		, i = 0
		, l = tokens.length
		, token
		, updated = false
		, index
	;
	do {
		token = tokens[i] + "";
		index = checkTokenAndGetIndex(this, token);
		while (index !== -1) {
			this.splice(index, 1);
			updated = true;
			index = checkTokenAndGetIndex(this, token);
		}
	}
	while (++i < l);

	if (updated) {
		this._updateClassName();
	}
};
classListProto.toggle = function (token, force) {
	token += "";

	var
		  result = this.contains(token)
		, method = result ?
			force !== true && "remove"
		:
			force !== false && "add"
	;

	if (method) {
		this[method](token);
	}

	if (force === true || force === false) {
		return force;
	} else {
		return !result;
	}
};
classListProto.toString = function () {
	return this.join(" ");
};

if (objCtr.defineProperty) {
	var classListPropDesc = {
		  get: classListGetter
		, enumerable: true
		, configurable: true
	};
	try {
		objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
	} catch (ex) { // IE 8 doesn't support enumerable:true
		if (ex.number === -0x7FF5EC54) {
			classListPropDesc.enumerable = false;
			objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
		}
	}
} else if (objCtr[protoProp].__defineGetter__) {
	elemCtrProto.__defineGetter__(classListProp, classListGetter);
}

}(self));

} else {
// There is full or partial native classList support, so just check if we need
// to normalize the add/remove and toggle APIs.

(function () {
	"use strict";

	var testElement = document.createElement("_");

	testElement.classList.add("c1", "c2");

	// Polyfill for IE 10/11 and Firefox <26, where classList.add and
	// classList.remove exist but support only one argument at a time.
	if (!testElement.classList.contains("c2")) {
		var createMethod = function(method) {
			var original = DOMTokenList.prototype[method];

			DOMTokenList.prototype[method] = function(token) {
				var i, len = arguments.length;

				for (i = 0; i < len; i++) {
					token = arguments[i];
					original.call(this, token);
				}
			};
		};
		createMethod('add');
		createMethod('remove');
	}

	testElement.classList.toggle("c3", false);

	// Polyfill for IE 10 and Firefox <24, where classList.toggle does not
	// support the second argument.
	if (testElement.classList.contains("c3")) {
		var _toggle = DOMTokenList.prototype.toggle;

		DOMTokenList.prototype.toggle = function(token, force) {
			if (1 in arguments && !this.contains(token) === !force) {
				return force;
			} else {
				return _toggle.call(this, token);
			}
		};

	}

	testElement = null;
}());

}

}


},{}],24:[function(_dereq_,module,exports){

/**
 * Expose `Emitter`.
 */

if (typeof module !== 'undefined') {
  module.exports = Emitter;
}

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }

  // Remove event specific arrays for event types that no
  // one is subscribed for to avoid memory leak.
  if (callbacks.length === 0) {
    delete this._callbacks['$' + event];
  }

  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};

  var args = new Array(arguments.length - 1)
    , callbacks = this._callbacks['$' + event];

  for (var i = 1; i < arguments.length; i++) {
    args[i - 1] = arguments[i];
  }

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],25:[function(_dereq_,module,exports){
var DOCUMENT_POSITION_CONTAINED_BY = 16

module.exports = contains

function contains(container, elem) {
    if (container.contains) {
        return container.contains(elem)
    }

    var comparison = container.compareDocumentPosition(elem)

    return comparison === 0 || comparison & DOCUMENT_POSITION_CONTAINED_BY
}

},{}],26:[function(_dereq_,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.

function isArray(arg) {
  if (Array.isArray) {
    return Array.isArray(arg);
  }
  return objectToString(arg) === '[object Array]';
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = _dereq_('buffer').Buffer.isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

},{"buffer":18}],27:[function(_dereq_,module,exports){
//     create-error.js 0.3.1
//     (c) 2013 Tim Griesser
//     This source may be freely distributed under the MIT license.
(function(factory) {

"use strict";

// A simple utility for subclassing the "Error"
// object in multiple environments, while maintaining
// relevant stack traces, messages, and prototypes.
factory(function() {

var toString = Object.prototype.toString;

// Creates an new error type with a "name",
// and any additional properties that should be set
// on the error instance.
return function() {
  var args = new Array(arguments.length);
  for (var i = 0; i < args.length; ++i) {
    args[i] = arguments[i];
  }
  var name       = getName(args);
  var target     = getTarget(args);
  var properties = getProps(args);
  function ErrorCtor(message, obj) {
    attachProps(this, properties);
    attachProps(this, obj);
    this.message = (message || this.message);
    if (message instanceof Error) {
      this.message = message.message;
      this.stack = message.stack;
    } else if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
  function Err() { this.constructor = ErrorCtor; }
  Err.prototype = target['prototype'];
  ErrorCtor.prototype = new Err();
  ErrorCtor.prototype.name = ('' + name) || 'CustomError';
  return ErrorCtor;
};

// Just a few helpers to clean up the function above
// https://github.com/petkaantonov/bluebird/wiki/Optimization-killers
function getName(args) {
  if (args.length === 0) return '';
  return isError(args[0]) ? (args[1] || '') : args[0];
}
function getTarget(args) {
  if (args.length === 0) return Error;
  return isError(args[0]) ? args[0] : Error;
}
function getProps(args) {
  if (args.length === 0) return null;
  return isError(args[0]) ? args[2] : args[1];
}
function inheritedKeys(obj) {
  var ret = [];
  for (var key in obj) {
    ret.push(key);
  }
  return ret;
}

// Right now we're just assuming that a function in the first argument is an error.
function isError(obj) {
  return (typeof obj === "function");
}

// We don't need the full underscore check here, since it should either be
// an object-literal, or nothing at all.
function isObject(obj) {
  return (obj && typeof obj === "object" && toString.call(obj) === "[object Object]");
}

// Used to attach attributes to the error object in the constructor.
function attachProps(context, target) {
  if (isObject(target)) {
    var keys = inheritedKeys(target);
    for (var i = 0, l = keys.length; i < l; ++i) {
      context[keys[i]] = clone(target[keys[i]]);
    }
  }
}

// Don't need the full-out "clone" mechanism here, since if you're
// trying to set things other than empty arrays/objects on your
// sub-classed `Error` object, you're probably doing it wrong.
function clone(target) {
  if (target == null || typeof target !== "object") return target;
  var cloned = target.constructor ? target.constructor() : Object.create(null);
  for (var attr in target) {
    if (target.hasOwnProperty(attr)) {
      cloned[attr] = target[attr];
    }
  }
  return cloned;
}

});

// Boilerplate UMD definition block...
})(function(createErrorLib) {
  if (typeof define === "function" && define.amd) {
    define(createErrorLib);
  } else if (typeof exports === 'object') {
    module.exports = createErrorLib();
  } else {
    var root = this;
    var lastcreateError = root.createError;
    var createError = root.createError = createErrorLib();
    createError.noConflict = function() {
      root.createError = lastcreateError;
      return createError;
    };
  }
});

},{}],28:[function(_dereq_,module,exports){
'use strict';

var isMergeableObject = function isMergeableObject(value) {
	return isNonNullObject(value)
		&& !isSpecial(value)
};

function isNonNullObject(value) {
	return !!value && typeof value === 'object'
}

function isSpecial(value) {
	var stringValue = Object.prototype.toString.call(value);

	return stringValue === '[object RegExp]'
		|| stringValue === '[object Date]'
		|| isReactElement(value)
}

// see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;

function isReactElement(value) {
	return value.$$typeof === REACT_ELEMENT_TYPE
}

function emptyTarget(val) {
	return Array.isArray(val) ? [] : {}
}

function cloneUnlessOtherwiseSpecified(value, options) {
	return (options.clone !== false && options.isMergeableObject(value))
		? deepmerge(emptyTarget(value), value, options)
		: value
}

function defaultArrayMerge(target, source, options) {
	return target.concat(source).map(function(element) {
		return cloneUnlessOtherwiseSpecified(element, options)
	})
}

function getMergeFunction(key, options) {
	if (!options.customMerge) {
		return deepmerge
	}
	var customMerge = options.customMerge(key);
	return typeof customMerge === 'function' ? customMerge : deepmerge
}

function getEnumerableOwnPropertySymbols(target) {
	return Object.getOwnPropertySymbols
		? Object.getOwnPropertySymbols(target).filter(function(symbol) {
			return Object.propertyIsEnumerable.call(target, symbol)
		})
		: []
}

function getKeys(target) {
	return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target))
}

function propertyIsOnObject(object, property) {
	try {
		return property in object
	} catch(_) {
		return false
	}
}

// Protects from prototype poisoning and unexpected merging up the prototype chain.
function propertyIsUnsafe(target, key) {
	return propertyIsOnObject(target, key) // Properties are safe to merge if they don't exist in the target yet,
		&& !(Object.hasOwnProperty.call(target, key) // unsafe if they exist up the prototype chain,
			&& Object.propertyIsEnumerable.call(target, key)) // and also unsafe if they're nonenumerable.
}

function mergeObject(target, source, options) {
	var destination = {};
	if (options.isMergeableObject(target)) {
		getKeys(target).forEach(function(key) {
			destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
		});
	}
	getKeys(source).forEach(function(key) {
		if (propertyIsUnsafe(target, key)) {
			return
		}

		if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
			destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
		} else {
			destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
		}
	});
	return destination
}

function deepmerge(target, source, options) {
	options = options || {};
	options.arrayMerge = options.arrayMerge || defaultArrayMerge;
	options.isMergeableObject = options.isMergeableObject || isMergeableObject;
	// cloneUnlessOtherwiseSpecified is added to `options` so that custom arrayMerge()
	// implementations can use it. The caller may not replace it.
	options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;

	var sourceIsArray = Array.isArray(source);
	var targetIsArray = Array.isArray(target);
	var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

	if (!sourceAndTargetTypesMatch) {
		return cloneUnlessOtherwiseSpecified(source, options)
	} else if (sourceIsArray) {
		return options.arrayMerge(target, source, options)
	} else {
		return mergeObject(target, source, options)
	}
}

deepmerge.all = function deepmergeAll(array, options) {
	if (!Array.isArray(array)) {
		throw new Error('first argument should be an array')
	}

	return array.reduce(function(prev, next) {
		return deepmerge(prev, next, options)
	}, {})
};

var deepmerge_1 = deepmerge;

module.exports = deepmerge_1;

},{}],29:[function(_dereq_,module,exports){
'use strict';

var $defineProperty = _dereq_('es-define-property');

var $SyntaxError = _dereq_('es-errors/syntax');
var $TypeError = _dereq_('es-errors/type');

var gopd = _dereq_('gopd');

/** @type {import('.')} */
module.exports = function defineDataProperty(
	obj,
	property,
	value
) {
	if (!obj || (typeof obj !== 'object' && typeof obj !== 'function')) {
		throw new $TypeError('`obj` must be an object or a function`');
	}
	if (typeof property !== 'string' && typeof property !== 'symbol') {
		throw new $TypeError('`property` must be a string or a symbol`');
	}
	if (arguments.length > 3 && typeof arguments[3] !== 'boolean' && arguments[3] !== null) {
		throw new $TypeError('`nonEnumerable`, if provided, must be a boolean or null');
	}
	if (arguments.length > 4 && typeof arguments[4] !== 'boolean' && arguments[4] !== null) {
		throw new $TypeError('`nonWritable`, if provided, must be a boolean or null');
	}
	if (arguments.length > 5 && typeof arguments[5] !== 'boolean' && arguments[5] !== null) {
		throw new $TypeError('`nonConfigurable`, if provided, must be a boolean or null');
	}
	if (arguments.length > 6 && typeof arguments[6] !== 'boolean') {
		throw new $TypeError('`loose`, if provided, must be a boolean');
	}

	var nonEnumerable = arguments.length > 3 ? arguments[3] : null;
	var nonWritable = arguments.length > 4 ? arguments[4] : null;
	var nonConfigurable = arguments.length > 5 ? arguments[5] : null;
	var loose = arguments.length > 6 ? arguments[6] : false;

	/* @type {false | TypedPropertyDescriptor<unknown>} */
	var desc = !!gopd && gopd(obj, property);

	if ($defineProperty) {
		$defineProperty(obj, property, {
			configurable: nonConfigurable === null && desc ? desc.configurable : !nonConfigurable,
			enumerable: nonEnumerable === null && desc ? desc.enumerable : !nonEnumerable,
			value: value,
			writable: nonWritable === null && desc ? desc.writable : !nonWritable
		});
	} else if (loose || (!nonEnumerable && !nonWritable && !nonConfigurable)) {
		// must fall back to [[Set]], and was not explicitly asked to make non-enumerable, non-writable, or non-configurable
		obj[property] = value; // eslint-disable-line no-param-reassign
	} else {
		throw new $SyntaxError('This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.');
	}
};

},{"es-define-property":36,"es-errors/syntax":41,"es-errors/type":42,"gopd":55}],30:[function(_dereq_,module,exports){
'use strict';

module.exports = function defined() {
	for (var i = 0; i < arguments.length; i++) {
		if (typeof arguments[i] !== 'undefined') {
			return arguments[i];
		}
	}
};

},{}],31:[function(_dereq_,module,exports){
var inherits = _dereq_("inherits");
var global = _dereq_("global");
var EventEmitter = _dereq_("events");

var makeDespot = function () {
  var Despot = function () {
    if (global._singletonDespotInstance) {
      return global._singletonDespotInstance;
    }

    global._singletonDespotInstance = this;
    EventEmitter.call(this);
  };

  inherits(Despot, EventEmitter);

  return new Despot();
};

module.exports = makeDespot();

},{"events":44,"global":54,"inherits":66}],32:[function(_dereq_,module,exports){
'use strict'

var document = _dereq_('global/document')
var Event = _dereq_('geval')
var Keys = _dereq_('./keys')

module.exports = Visibility

function Visibility () {
  var keys = Keys(document)
  if (!keys) return noopShim()

  return {
    visible: visible,
    onChange: Event(listen)
  }

  function visible () {
    return !document[keys.hidden]
  }

  function listen (broadcast) {
    document.addEventListener(keys.event, function onVisibilityChange () {
      broadcast(visible())
    })
  }
}

function noopShim () {
  return {
    visible: function () {
      return true
    },
    onChange: noop
  }
}

function noop () {}

},{"./keys":33,"geval":53,"global/document":34}],33:[function(_dereq_,module,exports){
'use strict'

module.exports = keys

function keys (document) {
  var prefix = detectPrefix(document)
  if (prefix == null) return
  return {
    hidden: lowercaseFirst(prefix + 'Hidden'),
    event: prefix + 'visibilitychange'
  }
}

function detectPrefix (document) {
  if (document.hidden != null) return ''
  if (document.mozHidden != null) return 'moz'
  if (document.msHidden != null) return 'ms'
  if (document.webkitHidden != null) return 'webkit'
}

function lowercaseFirst (string) {
  return string.substring(0, 1).toLowerCase() + string.substring(1)
}

},{}],34:[function(_dereq_,module,exports){
(function (global){(function (){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = _dereq_('min-document');

var doccy;

if (typeof document !== 'undefined') {
    doccy = document;
} else {
    doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }
}

module.exports = doccy;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"min-document":16}],35:[function(_dereq_,module,exports){
(function (process){(function (){
var once = _dereq_('once');

var noop = function() {};

var isRequest = function(stream) {
	return stream.setHeader && typeof stream.abort === 'function';
};

var isChildProcess = function(stream) {
	return stream.stdio && Array.isArray(stream.stdio) && stream.stdio.length === 3
};

var eos = function(stream, opts, callback) {
	if (typeof opts === 'function') return eos(stream, null, opts);
	if (!opts) opts = {};

	callback = once(callback || noop);

	var ws = stream._writableState;
	var rs = stream._readableState;
	var readable = opts.readable || (opts.readable !== false && stream.readable);
	var writable = opts.writable || (opts.writable !== false && stream.writable);
	var cancelled = false;

	var onlegacyfinish = function() {
		if (!stream.writable) onfinish();
	};

	var onfinish = function() {
		writable = false;
		if (!readable) callback.call(stream);
	};

	var onend = function() {
		readable = false;
		if (!writable) callback.call(stream);
	};

	var onexit = function(exitCode) {
		callback.call(stream, exitCode ? new Error('exited with error code: ' + exitCode) : null);
	};

	var onerror = function(err) {
		callback.call(stream, err);
	};

	var onclose = function() {
		process.nextTick(onclosenexttick);
	};

	var onclosenexttick = function() {
		if (cancelled) return;
		if (readable && !(rs && (rs.ended && !rs.destroyed))) return callback.call(stream, new Error('premature close'));
		if (writable && !(ws && (ws.ended && !ws.destroyed))) return callback.call(stream, new Error('premature close'));
	};

	var onrequest = function() {
		stream.req.on('finish', onfinish);
	};

	if (isRequest(stream)) {
		stream.on('complete', onfinish);
		stream.on('abort', onclose);
		if (stream.req) onrequest();
		else stream.on('request', onrequest);
	} else if (writable && !ws) { // legacy streams
		stream.on('end', onlegacyfinish);
		stream.on('close', onlegacyfinish);
	}

	if (isChildProcess(stream)) stream.on('exit', onexit);

	stream.on('end', onend);
	stream.on('finish', onfinish);
	if (opts.error !== false) stream.on('error', onerror);
	stream.on('close', onclose);

	return function() {
		cancelled = true;
		stream.removeListener('complete', onfinish);
		stream.removeListener('abort', onclose);
		stream.removeListener('request', onrequest);
		if (stream.req) stream.req.removeListener('finish', onfinish);
		stream.removeListener('end', onlegacyfinish);
		stream.removeListener('close', onlegacyfinish);
		stream.removeListener('finish', onfinish);
		stream.removeListener('exit', onexit);
		stream.removeListener('end', onend);
		stream.removeListener('error', onerror);
		stream.removeListener('close', onclose);
	};
};

module.exports = eos;

}).call(this)}).call(this,_dereq_('_process'))
},{"_process":79,"once":76}],36:[function(_dereq_,module,exports){
'use strict';

var GetIntrinsic = _dereq_('get-intrinsic');

/** @type {import('.')} */
var $defineProperty = GetIntrinsic('%Object.defineProperty%', true) || false;
if ($defineProperty) {
	try {
		$defineProperty({}, 'a', { value: 1 });
	} catch (e) {
		// IE 8 has a broken defineProperty
		$defineProperty = false;
	}
}

module.exports = $defineProperty;

},{"get-intrinsic":51}],37:[function(_dereq_,module,exports){
'use strict';

/** @type {import('./eval')} */
module.exports = EvalError;

},{}],38:[function(_dereq_,module,exports){
'use strict';

/** @type {import('.')} */
module.exports = Error;

},{}],39:[function(_dereq_,module,exports){
'use strict';

/** @type {import('./range')} */
module.exports = RangeError;

},{}],40:[function(_dereq_,module,exports){
'use strict';

/** @type {import('./ref')} */
module.exports = ReferenceError;

},{}],41:[function(_dereq_,module,exports){
'use strict';

/** @type {import('./syntax')} */
module.exports = SyntaxError;

},{}],42:[function(_dereq_,module,exports){
'use strict';

/** @type {import('./type')} */
module.exports = TypeError;

},{}],43:[function(_dereq_,module,exports){
'use strict';

/** @type {import('./uri')} */
module.exports = URIError;

},{}],44:[function(_dereq_,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    };

    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}

},{}],45:[function(_dereq_,module,exports){
module.exports = stringify
stringify.default = stringify
stringify.stable = deterministicStringify
stringify.stableStringify = deterministicStringify

var LIMIT_REPLACE_NODE = '[...]'
var CIRCULAR_REPLACE_NODE = '[Circular]'

var arr = []
var replacerStack = []

function defaultOptions () {
  return {
    depthLimit: Number.MAX_SAFE_INTEGER,
    edgesLimit: Number.MAX_SAFE_INTEGER
  }
}

// Regular stringify
function stringify (obj, replacer, spacer, options) {
  if (typeof options === 'undefined') {
    options = defaultOptions()
  }

  decirc(obj, '', 0, [], undefined, 0, options)
  var res
  try {
    if (replacerStack.length === 0) {
      res = JSON.stringify(obj, replacer, spacer)
    } else {
      res = JSON.stringify(obj, replaceGetterValues(replacer), spacer)
    }
  } catch (_) {
    return JSON.stringify('[unable to serialize, circular reference is too complex to analyze]')
  } finally {
    while (arr.length !== 0) {
      var part = arr.pop()
      if (part.length === 4) {
        Object.defineProperty(part[0], part[1], part[3])
      } else {
        part[0][part[1]] = part[2]
      }
    }
  }
  return res
}

function setReplace (replace, val, k, parent) {
  var propertyDescriptor = Object.getOwnPropertyDescriptor(parent, k)
  if (propertyDescriptor.get !== undefined) {
    if (propertyDescriptor.configurable) {
      Object.defineProperty(parent, k, { value: replace })
      arr.push([parent, k, val, propertyDescriptor])
    } else {
      replacerStack.push([val, k, replace])
    }
  } else {
    parent[k] = replace
    arr.push([parent, k, val])
  }
}

function decirc (val, k, edgeIndex, stack, parent, depth, options) {
  depth += 1
  var i
  if (typeof val === 'object' && val !== null) {
    for (i = 0; i < stack.length; i++) {
      if (stack[i] === val) {
        setReplace(CIRCULAR_REPLACE_NODE, val, k, parent)
        return
      }
    }

    if (
      typeof options.depthLimit !== 'undefined' &&
      depth > options.depthLimit
    ) {
      setReplace(LIMIT_REPLACE_NODE, val, k, parent)
      return
    }

    if (
      typeof options.edgesLimit !== 'undefined' &&
      edgeIndex + 1 > options.edgesLimit
    ) {
      setReplace(LIMIT_REPLACE_NODE, val, k, parent)
      return
    }

    stack.push(val)
    // Optimize for Arrays. Big arrays could kill the performance otherwise!
    if (Array.isArray(val)) {
      for (i = 0; i < val.length; i++) {
        decirc(val[i], i, i, stack, val, depth, options)
      }
    } else {
      var keys = Object.keys(val)
      for (i = 0; i < keys.length; i++) {
        var key = keys[i]
        decirc(val[key], key, i, stack, val, depth, options)
      }
    }
    stack.pop()
  }
}

// Stable-stringify
function compareFunction (a, b) {
  if (a < b) {
    return -1
  }
  if (a > b) {
    return 1
  }
  return 0
}

function deterministicStringify (obj, replacer, spacer, options) {
  if (typeof options === 'undefined') {
    options = defaultOptions()
  }

  var tmp = deterministicDecirc(obj, '', 0, [], undefined, 0, options) || obj
  var res
  try {
    if (replacerStack.length === 0) {
      res = JSON.stringify(tmp, replacer, spacer)
    } else {
      res = JSON.stringify(tmp, replaceGetterValues(replacer), spacer)
    }
  } catch (_) {
    return JSON.stringify('[unable to serialize, circular reference is too complex to analyze]')
  } finally {
    // Ensure that we restore the object as it was.
    while (arr.length !== 0) {
      var part = arr.pop()
      if (part.length === 4) {
        Object.defineProperty(part[0], part[1], part[3])
      } else {
        part[0][part[1]] = part[2]
      }
    }
  }
  return res
}

function deterministicDecirc (val, k, edgeIndex, stack, parent, depth, options) {
  depth += 1
  var i
  if (typeof val === 'object' && val !== null) {
    for (i = 0; i < stack.length; i++) {
      if (stack[i] === val) {
        setReplace(CIRCULAR_REPLACE_NODE, val, k, parent)
        return
      }
    }
    try {
      if (typeof val.toJSON === 'function') {
        return
      }
    } catch (_) {
      return
    }

    if (
      typeof options.depthLimit !== 'undefined' &&
      depth > options.depthLimit
    ) {
      setReplace(LIMIT_REPLACE_NODE, val, k, parent)
      return
    }

    if (
      typeof options.edgesLimit !== 'undefined' &&
      edgeIndex + 1 > options.edgesLimit
    ) {
      setReplace(LIMIT_REPLACE_NODE, val, k, parent)
      return
    }

    stack.push(val)
    // Optimize for Arrays. Big arrays could kill the performance otherwise!
    if (Array.isArray(val)) {
      for (i = 0; i < val.length; i++) {
        deterministicDecirc(val[i], i, i, stack, val, depth, options)
      }
    } else {
      // Create a temporary object in the required way
      var tmp = {}
      var keys = Object.keys(val).sort(compareFunction)
      for (i = 0; i < keys.length; i++) {
        var key = keys[i]
        deterministicDecirc(val[key], key, i, stack, val, depth, options)
        tmp[key] = val[key]
      }
      if (typeof parent !== 'undefined') {
        arr.push([parent, k, val])
        parent[k] = tmp
      } else {
        return tmp
      }
    }
    stack.pop()
  }
}

// wraps replacer function to handle values we couldn't replace
// and mark them as replaced value
function replaceGetterValues (replacer) {
  replacer =
    typeof replacer !== 'undefined'
      ? replacer
      : function (k, v) {
        return v
      }
  return function (key, val) {
    if (replacerStack.length > 0) {
      for (var i = 0; i < replacerStack.length; i++) {
        var part = replacerStack[i]
        if (part[1] === key && part[0] === val) {
          val = part[2]
          replacerStack.splice(i, 1)
          break
        }
      }
    }
    return replacer.call(this, key, val)
  }
}

},{}],46:[function(_dereq_,module,exports){
/**
 * filesize
 *
 * @copyright 2024 Jason Mulligan <jason.mulligan@avoidwork.com>
 * @license BSD-3-Clause
 * @version 10.1.6
 */
'use strict';

const ARRAY = "array";
const BIT = "bit";
const BITS = "bits";
const BYTE = "byte";
const BYTES = "bytes";
const EMPTY = "";
const EXPONENT = "exponent";
const FUNCTION = "function";
const IEC = "iec";
const INVALID_NUMBER = "Invalid number";
const INVALID_ROUND = "Invalid rounding method";
const JEDEC = "jedec";
const OBJECT = "object";
const PERIOD = ".";
const ROUND = "round";
const S = "s";
const SI = "si";
const SI_KBIT = "kbit";
const SI_KBYTE = "kB";
const SPACE = " ";
const STRING = "string";
const ZERO = "0";
const STRINGS = {
	symbol: {
		iec: {
			bits: ["bit", "Kibit", "Mibit", "Gibit", "Tibit", "Pibit", "Eibit", "Zibit", "Yibit"],
			bytes: ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"]
		},
		jedec: {
			bits: ["bit", "Kbit", "Mbit", "Gbit", "Tbit", "Pbit", "Ebit", "Zbit", "Ybit"],
			bytes: ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
		}
	},
	fullform: {
		iec: ["", "kibi", "mebi", "gibi", "tebi", "pebi", "exbi", "zebi", "yobi"],
		jedec: ["", "kilo", "mega", "giga", "tera", "peta", "exa", "zetta", "yotta"]
	}
};

function filesize (arg, {
	bits = false,
	pad = false,
	base = -1,
	round = 2,
	locale = EMPTY,
	localeOptions = {},
	separator = EMPTY,
	spacer = SPACE,
	symbols = {},
	standard = EMPTY,
	output = STRING,
	fullform = false,
	fullforms = [],
	exponent = -1,
	roundingMethod = ROUND,
	precision = 0
} = {}) {
	let e = exponent,
		num = Number(arg),
		result = [],
		val = 0,
		u = EMPTY;

	// Sync base & standard
	if (standard === SI) {
		base = 10;
		standard = JEDEC;
	} else if (standard === IEC || standard === JEDEC) {
		base = 2;
	} else if (base === 2) {
		standard = IEC;
	} else {
		base = 10;
		standard = JEDEC;
	}

	const ceil = base === 10 ? 1000 : 1024,
		full = fullform === true,
		neg = num < 0,
		roundingFunc = Math[roundingMethod];

	if (typeof arg !== "bigint" && isNaN(arg)) {
		throw new TypeError(INVALID_NUMBER);
	}

	if (typeof roundingFunc !== FUNCTION) {
		throw new TypeError(INVALID_ROUND);
	}

	// Flipping a negative number to determine the size
	if (neg) {
		num = -num;
	}

	// Determining the exponent
	if (e === -1 || isNaN(e)) {
		e = Math.floor(Math.log(num) / Math.log(ceil));

		if (e < 0) {
			e = 0;
		}
	}

	// Exceeding supported length, time to reduce & multiply
	if (e > 8) {
		if (precision > 0) {
			precision += 8 - e;
		}

		e = 8;
	}

	if (output === EXPONENT) {
		return e;
	}

	// Zero is now a special case because bytes divide by 1
	if (num === 0) {
		result[0] = 0;
		u = result[1] = STRINGS.symbol[standard][bits ? BITS : BYTES][e];
	} else {
		val = num / (base === 2 ? Math.pow(2, e * 10) : Math.pow(1000, e));

		if (bits) {
			val = val * 8;

			if (val >= ceil && e < 8) {
				val = val / ceil;
				e++;
			}
		}

		const p = Math.pow(10, e > 0 ? round : 0);
		result[0] = roundingFunc(val * p) / p;

		if (result[0] === ceil && e < 8 && exponent === -1) {
			result[0] = 1;
			e++;
		}

		u = result[1] = base === 10 && e === 1 ? bits ? SI_KBIT : SI_KBYTE : STRINGS.symbol[standard][bits ? BITS : BYTES][e];
	}

	// Decorating a 'diff'
	if (neg) {
		result[0] = -result[0];
	}

	// Setting optional precision
	if (precision > 0) {
		result[0] = result[0].toPrecision(precision);
	}

	// Applying custom symbol
	result[1] = symbols[result[1]] || result[1];

	if (locale === true) {
		result[0] = result[0].toLocaleString();
	} else if (locale.length > 0) {
		result[0] = result[0].toLocaleString(locale, localeOptions);
	} else if (separator.length > 0) {
		result[0] = result[0].toString().replace(PERIOD, separator);
	}

	if (pad && round > 0) {
		const i =  result[0].toString(),
			x = separator || ((i.match(/(\D)/g) || []).pop() || PERIOD),
			tmp = i.toString().split(x),
			s = tmp[1] || EMPTY,
			l = s.length,
			n = round - l;

		result[0] = `${tmp[0]}${x}${s.padEnd(l + n, ZERO)}`;
	}

	if (full) {
		result[1] = fullforms[e] ? fullforms[e] : STRINGS.fullform[standard][e] + (bits ? BIT : BYTE) + (result[0] === 1 ? EMPTY : S);
	}

	// Returning Array, Object, or String (default)
	return output === ARRAY ? result : output === OBJECT ? {
		value: result[0],
		symbol: result[1],
		exponent: e,
		unit: u
	} : result.join(spacer);
}

// Partial application for functional programming
function partial ({
	bits = false,
	pad = false,
	base = -1,
	round = 2,
	locale = EMPTY,
	localeOptions = {},
	separator = EMPTY,
	spacer = SPACE,
	symbols = {},
	standard = EMPTY,
	output = STRING,
	fullform = false,
	fullforms = [],
	exponent = -1,
	roundingMethod = ROUND,
	precision = 0
} = {}) {
	return arg => filesize(arg, {
		bits,
		pad,
		base,
		round,
		locale,
		localeOptions,
		separator,
		spacer,
		symbols,
		standard,
		output,
		fullform,
		fullforms,
		exponent,
		roundingMethod,
		precision
	});
}

exports.filesize = filesize;
exports.partial = partial;

},{}],47:[function(_dereq_,module,exports){
function format(fmt) {
  var re = /(%?)(%([jds]))/g
    , args = Array.prototype.slice.call(arguments, 1);
  if(args.length) {
    fmt = fmt.replace(re, function(match, escaped, ptn, flag) {
      var arg = args.shift();
      switch(flag) {
        case 's':
          arg = '' + arg;
          break;
        case 'd':
          arg = Number(arg);
          break;
        case 'j':
          arg = JSON.stringify(arg);
          break;
      }
      if(!escaped) {
        return arg; 
      }
      args.unshift(arg);
      return match;
    })
  }

  // arguments remain after formatting
  if(args.length) {
    fmt += ' ' + args.join(' ');
  }

  // update escaped %% values
  fmt = fmt.replace(/%{2,2}/g, '%');

  return '' + fmt;
}

module.exports = format;

},{}],48:[function(_dereq_,module,exports){
'use strict';

/* eslint no-invalid-this: 1 */

var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var toStr = Object.prototype.toString;
var max = Math.max;
var funcType = '[object Function]';

var concatty = function concatty(a, b) {
    var arr = [];

    for (var i = 0; i < a.length; i += 1) {
        arr[i] = a[i];
    }
    for (var j = 0; j < b.length; j += 1) {
        arr[j + a.length] = b[j];
    }

    return arr;
};

var slicy = function slicy(arrLike, offset) {
    var arr = [];
    for (var i = offset || 0, j = 0; i < arrLike.length; i += 1, j += 1) {
        arr[j] = arrLike[i];
    }
    return arr;
};

var joiny = function (arr, joiner) {
    var str = '';
    for (var i = 0; i < arr.length; i += 1) {
        str += arr[i];
        if (i + 1 < arr.length) {
            str += joiner;
        }
    }
    return str;
};

module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.apply(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slicy(arguments, 1);

    var bound;
    var binder = function () {
        if (this instanceof bound) {
            var result = target.apply(
                this,
                concatty(args, arguments)
            );
            if (Object(result) === result) {
                return result;
            }
            return this;
        }
        return target.apply(
            that,
            concatty(args, arguments)
        );

    };

    var boundLength = max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs[i] = '$' + i;
    }

    bound = Function('binder', 'return function (' + joiny(boundArgs, ',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};

},{}],49:[function(_dereq_,module,exports){
'use strict';

var implementation = _dereq_('./implementation');

module.exports = Function.prototype.bind || implementation;

},{"./implementation":48}],50:[function(_dereq_,module,exports){
"use strict";

exports.__esModule = true;
exports["default"] = getFormData;
exports.getFieldData = getFieldData;

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var NODE_LIST_CLASSES = {
  '[object HTMLCollection]': true,
  '[object NodeList]': true,
  '[object RadioNodeList]': true
}; // .type values for elements which can appear in .elements and should be ignored

var IGNORED_ELEMENT_TYPES = {
  'button': true,
  'fieldset': true,
  'reset': true,
  'submit': true
};
var CHECKED_INPUT_TYPES = {
  'checkbox': true,
  'radio': true
};
var TRIM_RE = /^\s+|\s+$/g;
var slice = Array.prototype.slice;
var toString = Object.prototype.toString;
/**
 * @param {HTMLFormElement} form
 * @param {Object} [options]
 * @return {Object.<string,boolean|string|string[]>} an object containing
 *   submittable value(s) held in the form's .elements collection, with
 *   properties named as per element names or ids.
 */

function getFormData(form, options) {
  if (!form) {
    throw new Error("A form is required by getFormData, was given form=" + form);
  }

  options = _extends({
    includeDisabled: false,
    trim: false
  }, options);
  var data = {};
  var elementName;
  var elementNames = [];
  var elementNameLookup = {}; // Get unique submittable element names for the form

  for (var i = 0, l = form.elements.length; i < l; i++) {
    var element = form.elements[i];

    if (IGNORED_ELEMENT_TYPES[element.type] || element.disabled && !options.includeDisabled) {
      continue;
    }

    elementName = element.name || element.id;

    if (elementName && !elementNameLookup[elementName]) {
      elementNames.push(elementName);
      elementNameLookup[elementName] = true;
    }
  } // Extract element data name-by-name for consistent handling of special cases
  // around elements which contain multiple inputs.


  for (var _i = 0, _l = elementNames.length; _i < _l; _i++) {
    elementName = elementNames[_i];
    var value = getFieldData(form, elementName, options);

    if (value != null) {
      data[elementName] = value;
    }
  }

  return data;
}
/**
 * @param {HTMLFormElement} form
 * @param {string} fieldName
 * @param {Object} [options]
 * @return {?(boolean|string|string[]|File|File[])} submittable value(s) in the
 *   form for a  named element from its .elements collection, or null if there
 *   was no element with that name, or the element had no submittable value(s).
 */


function getFieldData(form, fieldName, options) {
  if (!form) {
    throw new Error("A form is required by getFieldData, was given form=" + form);
  }

  if (!fieldName && toString.call(fieldName) !== '[object String]') {
    throw new Error("A field name is required by getFieldData, was given fieldName=" + fieldName);
  }

  options = _extends({
    includeDisabled: false,
    trim: false
  }, options);
  var element = form.elements[fieldName];

  if (!element || element.disabled && !options.includeDisabled) {
    return null;
  }

  if (!NODE_LIST_CLASSES[toString.call(element)]) {
    return getFormElementValue(element, options.trim);
  } // Deal with multiple form controls which have the same name


  var data = [];
  var allRadios = true;

  for (var i = 0, l = element.length; i < l; i++) {
    if (element[i].disabled && !options.includeDisabled) {
      continue;
    }

    if (allRadios && element[i].type !== 'radio') {
      allRadios = false;
    }

    var value = getFormElementValue(element[i], options.trim);

    if (value != null) {
      data = data.concat(value);
    }
  } // Special case for an element with multiple same-named inputs which were all
  // radio buttons: if there was a selected value, only return the value.


  if (allRadios && data.length === 1) {
    return data[0];
  }

  return data.length > 0 ? data : null;
}
/**
 * @param {HTMLElement} element a form element.
 * @param {boolean} [trim] should values for text entry inputs be trimmed?
 * @return {?(boolean|string|string[]|File|File[])} the element's submittable
 *   value(s), or null if it had none.
 */


function getFormElementValue(element, trim) {
  var value = null;
  var type = element.type;

  if (type === 'select-one') {
    if (element.options.length) {
      value = element.options[element.selectedIndex].value;
    }

    return value;
  }

  if (type === 'select-multiple') {
    value = [];

    for (var i = 0, l = element.options.length; i < l; i++) {
      if (element.options[i].selected) {
        value.push(element.options[i].value);
      }
    }

    if (value.length === 0) {
      value = null;
    }

    return value;
  } // If a file input doesn't have a files attribute, fall through to using its
  // value attribute.


  if (type === 'file' && 'files' in element) {
    if (element.multiple) {
      value = slice.call(element.files);

      if (value.length === 0) {
        value = null;
      }
    } else {
      // Should be null if not present, according to the spec
      value = element.files[0];
    }

    return value;
  }

  if (!CHECKED_INPUT_TYPES[type]) {
    value = trim ? element.value.replace(TRIM_RE, '') : element.value;
  } else if (element.checked) {
    if (type === 'checkbox' && !element.hasAttribute('value')) {
      value = true;
    } else {
      value = element.value;
    }
  }

  return value;
} // For UMD build access to getFieldData


getFormData.getFieldData = getFieldData;
},{}],51:[function(_dereq_,module,exports){
'use strict';

var undefined;

var $Error = _dereq_('es-errors');
var $EvalError = _dereq_('es-errors/eval');
var $RangeError = _dereq_('es-errors/range');
var $ReferenceError = _dereq_('es-errors/ref');
var $SyntaxError = _dereq_('es-errors/syntax');
var $TypeError = _dereq_('es-errors/type');
var $URIError = _dereq_('es-errors/uri');

var $Function = Function;

// eslint-disable-next-line consistent-return
var getEvalledConstructor = function (expressionSyntax) {
	try {
		return $Function('"use strict"; return (' + expressionSyntax + ').constructor;')();
	} catch (e) {}
};

var $gOPD = Object.getOwnPropertyDescriptor;
if ($gOPD) {
	try {
		$gOPD({}, '');
	} catch (e) {
		$gOPD = null; // this is IE 8, which has a broken gOPD
	}
}

var throwTypeError = function () {
	throw new $TypeError();
};
var ThrowTypeError = $gOPD
	? (function () {
		try {
			// eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
			arguments.callee; // IE 8 does not throw here
			return throwTypeError;
		} catch (calleeThrows) {
			try {
				// IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
				return $gOPD(arguments, 'callee').get;
			} catch (gOPDthrows) {
				return throwTypeError;
			}
		}
	}())
	: throwTypeError;

var hasSymbols = _dereq_('has-symbols')();
var hasProto = _dereq_('has-proto')();

var getProto = Object.getPrototypeOf || (
	hasProto
		? function (x) { return x.__proto__; } // eslint-disable-line no-proto
		: null
);

var needsEval = {};

var TypedArray = typeof Uint8Array === 'undefined' || !getProto ? undefined : getProto(Uint8Array);

var INTRINSICS = {
	__proto__: null,
	'%AggregateError%': typeof AggregateError === 'undefined' ? undefined : AggregateError,
	'%Array%': Array,
	'%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer,
	'%ArrayIteratorPrototype%': hasSymbols && getProto ? getProto([][Symbol.iterator]()) : undefined,
	'%AsyncFromSyncIteratorPrototype%': undefined,
	'%AsyncFunction%': needsEval,
	'%AsyncGenerator%': needsEval,
	'%AsyncGeneratorFunction%': needsEval,
	'%AsyncIteratorPrototype%': needsEval,
	'%Atomics%': typeof Atomics === 'undefined' ? undefined : Atomics,
	'%BigInt%': typeof BigInt === 'undefined' ? undefined : BigInt,
	'%BigInt64Array%': typeof BigInt64Array === 'undefined' ? undefined : BigInt64Array,
	'%BigUint64Array%': typeof BigUint64Array === 'undefined' ? undefined : BigUint64Array,
	'%Boolean%': Boolean,
	'%DataView%': typeof DataView === 'undefined' ? undefined : DataView,
	'%Date%': Date,
	'%decodeURI%': decodeURI,
	'%decodeURIComponent%': decodeURIComponent,
	'%encodeURI%': encodeURI,
	'%encodeURIComponent%': encodeURIComponent,
	'%Error%': $Error,
	'%eval%': eval, // eslint-disable-line no-eval
	'%EvalError%': $EvalError,
	'%Float32Array%': typeof Float32Array === 'undefined' ? undefined : Float32Array,
	'%Float64Array%': typeof Float64Array === 'undefined' ? undefined : Float64Array,
	'%FinalizationRegistry%': typeof FinalizationRegistry === 'undefined' ? undefined : FinalizationRegistry,
	'%Function%': $Function,
	'%GeneratorFunction%': needsEval,
	'%Int8Array%': typeof Int8Array === 'undefined' ? undefined : Int8Array,
	'%Int16Array%': typeof Int16Array === 'undefined' ? undefined : Int16Array,
	'%Int32Array%': typeof Int32Array === 'undefined' ? undefined : Int32Array,
	'%isFinite%': isFinite,
	'%isNaN%': isNaN,
	'%IteratorPrototype%': hasSymbols && getProto ? getProto(getProto([][Symbol.iterator]())) : undefined,
	'%JSON%': typeof JSON === 'object' ? JSON : undefined,
	'%Map%': typeof Map === 'undefined' ? undefined : Map,
	'%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols || !getProto ? undefined : getProto(new Map()[Symbol.iterator]()),
	'%Math%': Math,
	'%Number%': Number,
	'%Object%': Object,
	'%parseFloat%': parseFloat,
	'%parseInt%': parseInt,
	'%Promise%': typeof Promise === 'undefined' ? undefined : Promise,
	'%Proxy%': typeof Proxy === 'undefined' ? undefined : Proxy,
	'%RangeError%': $RangeError,
	'%ReferenceError%': $ReferenceError,
	'%Reflect%': typeof Reflect === 'undefined' ? undefined : Reflect,
	'%RegExp%': RegExp,
	'%Set%': typeof Set === 'undefined' ? undefined : Set,
	'%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols || !getProto ? undefined : getProto(new Set()[Symbol.iterator]()),
	'%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer,
	'%String%': String,
	'%StringIteratorPrototype%': hasSymbols && getProto ? getProto(''[Symbol.iterator]()) : undefined,
	'%Symbol%': hasSymbols ? Symbol : undefined,
	'%SyntaxError%': $SyntaxError,
	'%ThrowTypeError%': ThrowTypeError,
	'%TypedArray%': TypedArray,
	'%TypeError%': $TypeError,
	'%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined : Uint8Array,
	'%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray,
	'%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined : Uint16Array,
	'%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined : Uint32Array,
	'%URIError%': $URIError,
	'%WeakMap%': typeof WeakMap === 'undefined' ? undefined : WeakMap,
	'%WeakRef%': typeof WeakRef === 'undefined' ? undefined : WeakRef,
	'%WeakSet%': typeof WeakSet === 'undefined' ? undefined : WeakSet
};

if (getProto) {
	try {
		null.error; // eslint-disable-line no-unused-expressions
	} catch (e) {
		// https://github.com/tc39/proposal-shadowrealm/pull/384#issuecomment-1364264229
		var errorProto = getProto(getProto(e));
		INTRINSICS['%Error.prototype%'] = errorProto;
	}
}

var doEval = function doEval(name) {
	var value;
	if (name === '%AsyncFunction%') {
		value = getEvalledConstructor('async function () {}');
	} else if (name === '%GeneratorFunction%') {
		value = getEvalledConstructor('function* () {}');
	} else if (name === '%AsyncGeneratorFunction%') {
		value = getEvalledConstructor('async function* () {}');
	} else if (name === '%AsyncGenerator%') {
		var fn = doEval('%AsyncGeneratorFunction%');
		if (fn) {
			value = fn.prototype;
		}
	} else if (name === '%AsyncIteratorPrototype%') {
		var gen = doEval('%AsyncGenerator%');
		if (gen && getProto) {
			value = getProto(gen.prototype);
		}
	}

	INTRINSICS[name] = value;

	return value;
};

var LEGACY_ALIASES = {
	__proto__: null,
	'%ArrayBufferPrototype%': ['ArrayBuffer', 'prototype'],
	'%ArrayPrototype%': ['Array', 'prototype'],
	'%ArrayProto_entries%': ['Array', 'prototype', 'entries'],
	'%ArrayProto_forEach%': ['Array', 'prototype', 'forEach'],
	'%ArrayProto_keys%': ['Array', 'prototype', 'keys'],
	'%ArrayProto_values%': ['Array', 'prototype', 'values'],
	'%AsyncFunctionPrototype%': ['AsyncFunction', 'prototype'],
	'%AsyncGenerator%': ['AsyncGeneratorFunction', 'prototype'],
	'%AsyncGeneratorPrototype%': ['AsyncGeneratorFunction', 'prototype', 'prototype'],
	'%BooleanPrototype%': ['Boolean', 'prototype'],
	'%DataViewPrototype%': ['DataView', 'prototype'],
	'%DatePrototype%': ['Date', 'prototype'],
	'%ErrorPrototype%': ['Error', 'prototype'],
	'%EvalErrorPrototype%': ['EvalError', 'prototype'],
	'%Float32ArrayPrototype%': ['Float32Array', 'prototype'],
	'%Float64ArrayPrototype%': ['Float64Array', 'prototype'],
	'%FunctionPrototype%': ['Function', 'prototype'],
	'%Generator%': ['GeneratorFunction', 'prototype'],
	'%GeneratorPrototype%': ['GeneratorFunction', 'prototype', 'prototype'],
	'%Int8ArrayPrototype%': ['Int8Array', 'prototype'],
	'%Int16ArrayPrototype%': ['Int16Array', 'prototype'],
	'%Int32ArrayPrototype%': ['Int32Array', 'prototype'],
	'%JSONParse%': ['JSON', 'parse'],
	'%JSONStringify%': ['JSON', 'stringify'],
	'%MapPrototype%': ['Map', 'prototype'],
	'%NumberPrototype%': ['Number', 'prototype'],
	'%ObjectPrototype%': ['Object', 'prototype'],
	'%ObjProto_toString%': ['Object', 'prototype', 'toString'],
	'%ObjProto_valueOf%': ['Object', 'prototype', 'valueOf'],
	'%PromisePrototype%': ['Promise', 'prototype'],
	'%PromiseProto_then%': ['Promise', 'prototype', 'then'],
	'%Promise_all%': ['Promise', 'all'],
	'%Promise_reject%': ['Promise', 'reject'],
	'%Promise_resolve%': ['Promise', 'resolve'],
	'%RangeErrorPrototype%': ['RangeError', 'prototype'],
	'%ReferenceErrorPrototype%': ['ReferenceError', 'prototype'],
	'%RegExpPrototype%': ['RegExp', 'prototype'],
	'%SetPrototype%': ['Set', 'prototype'],
	'%SharedArrayBufferPrototype%': ['SharedArrayBuffer', 'prototype'],
	'%StringPrototype%': ['String', 'prototype'],
	'%SymbolPrototype%': ['Symbol', 'prototype'],
	'%SyntaxErrorPrototype%': ['SyntaxError', 'prototype'],
	'%TypedArrayPrototype%': ['TypedArray', 'prototype'],
	'%TypeErrorPrototype%': ['TypeError', 'prototype'],
	'%Uint8ArrayPrototype%': ['Uint8Array', 'prototype'],
	'%Uint8ClampedArrayPrototype%': ['Uint8ClampedArray', 'prototype'],
	'%Uint16ArrayPrototype%': ['Uint16Array', 'prototype'],
	'%Uint32ArrayPrototype%': ['Uint32Array', 'prototype'],
	'%URIErrorPrototype%': ['URIError', 'prototype'],
	'%WeakMapPrototype%': ['WeakMap', 'prototype'],
	'%WeakSetPrototype%': ['WeakSet', 'prototype']
};

var bind = _dereq_('function-bind');
var hasOwn = _dereq_('hasown');
var $concat = bind.call(Function.call, Array.prototype.concat);
var $spliceApply = bind.call(Function.apply, Array.prototype.splice);
var $replace = bind.call(Function.call, String.prototype.replace);
var $strSlice = bind.call(Function.call, String.prototype.slice);
var $exec = bind.call(Function.call, RegExp.prototype.exec);

/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar = /\\(\\)?/g; /** Used to match backslashes in property paths. */
var stringToPath = function stringToPath(string) {
	var first = $strSlice(string, 0, 1);
	var last = $strSlice(string, -1);
	if (first === '%' && last !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected closing `%`');
	} else if (last === '%' && first !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected opening `%`');
	}
	var result = [];
	$replace(string, rePropName, function (match, number, quote, subString) {
		result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : number || match;
	});
	return result;
};
/* end adaptation */

var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
	var intrinsicName = name;
	var alias;
	if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
		alias = LEGACY_ALIASES[intrinsicName];
		intrinsicName = '%' + alias[0] + '%';
	}

	if (hasOwn(INTRINSICS, intrinsicName)) {
		var value = INTRINSICS[intrinsicName];
		if (value === needsEval) {
			value = doEval(intrinsicName);
		}
		if (typeof value === 'undefined' && !allowMissing) {
			throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
		}

		return {
			alias: alias,
			name: intrinsicName,
			value: value
		};
	}

	throw new $SyntaxError('intrinsic ' + name + ' does not exist!');
};

module.exports = function GetIntrinsic(name, allowMissing) {
	if (typeof name !== 'string' || name.length === 0) {
		throw new $TypeError('intrinsic name must be a non-empty string');
	}
	if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
		throw new $TypeError('"allowMissing" argument must be a boolean');
	}

	if ($exec(/^%?[^%]*%?$/, name) === null) {
		throw new $SyntaxError('`%` may not be present anywhere but at the beginning and end of the intrinsic name');
	}
	var parts = stringToPath(name);
	var intrinsicBaseName = parts.length > 0 ? parts[0] : '';

	var intrinsic = getBaseIntrinsic('%' + intrinsicBaseName + '%', allowMissing);
	var intrinsicRealName = intrinsic.name;
	var value = intrinsic.value;
	var skipFurtherCaching = false;

	var alias = intrinsic.alias;
	if (alias) {
		intrinsicBaseName = alias[0];
		$spliceApply(parts, $concat([0, 1], alias));
	}

	for (var i = 1, isOwn = true; i < parts.length; i += 1) {
		var part = parts[i];
		var first = $strSlice(part, 0, 1);
		var last = $strSlice(part, -1);
		if (
			(
				(first === '"' || first === "'" || first === '`')
				|| (last === '"' || last === "'" || last === '`')
			)
			&& first !== last
		) {
			throw new $SyntaxError('property names with quotes must have matching quotes');
		}
		if (part === 'constructor' || !isOwn) {
			skipFurtherCaching = true;
		}

		intrinsicBaseName += '.' + part;
		intrinsicRealName = '%' + intrinsicBaseName + '%';

		if (hasOwn(INTRINSICS, intrinsicRealName)) {
			value = INTRINSICS[intrinsicRealName];
		} else if (value != null) {
			if (!(part in value)) {
				if (!allowMissing) {
					throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.');
				}
				return void undefined;
			}
			if ($gOPD && (i + 1) >= parts.length) {
				var desc = $gOPD(value, part);
				isOwn = !!desc;

				// By convention, when a data property is converted to an accessor
				// property to emulate a data property that does not suffer from
				// the override mistake, that accessor's getter is marked with
				// an `originalValue` property. Here, when we detect this, we
				// uphold the illusion by pretending to see that original data
				// property, i.e., returning the value rather than the getter
				// itself.
				if (isOwn && 'get' in desc && !('originalValue' in desc.get)) {
					value = desc.get;
				} else {
					value = value[part];
				}
			} else {
				isOwn = hasOwn(value, part);
				value = value[part];
			}

			if (isOwn && !skipFurtherCaching) {
				INTRINSICS[intrinsicRealName] = value;
			}
		}
	}
	return value;
};

},{"es-errors":38,"es-errors/eval":37,"es-errors/range":39,"es-errors/ref":40,"es-errors/syntax":41,"es-errors/type":42,"es-errors/uri":43,"function-bind":49,"has-proto":57,"has-symbols":58,"hasown":60}],52:[function(_dereq_,module,exports){
module.exports = Event

function Event() {
    var listeners = []

    return { broadcast: broadcast, listen: event }

    function broadcast(value) {
        for (var i = 0; i < listeners.length; i++) {
            listeners[i](value)
        }
    }

    function event(listener) {
        listeners.push(listener)

        return removeListener

        function removeListener() {
            var index = listeners.indexOf(listener)
            if (index !== -1) {
                listeners.splice(index, 1)
            }
        }
    }
}

},{}],53:[function(_dereq_,module,exports){
var Event = _dereq_('./event.js')

module.exports = Source

function Source(broadcaster) {
    var tuple = Event()

    broadcaster(tuple.broadcast)

    return tuple.listen
}

},{"./event.js":52}],54:[function(_dereq_,module,exports){
(function (global){(function (){
var win;

if (typeof window !== "undefined") {
    win = window;
} else if (typeof global !== "undefined") {
    win = global;
} else if (typeof self !== "undefined"){
    win = self;
} else {
    win = {};
}

module.exports = win;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],55:[function(_dereq_,module,exports){
'use strict';

var GetIntrinsic = _dereq_('get-intrinsic');

var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true);

if ($gOPD) {
	try {
		$gOPD([], 'length');
	} catch (e) {
		// IE 8 has a broken gOPD
		$gOPD = null;
	}
}

module.exports = $gOPD;

},{"get-intrinsic":51}],56:[function(_dereq_,module,exports){
'use strict';

var $defineProperty = _dereq_('es-define-property');

var hasPropertyDescriptors = function hasPropertyDescriptors() {
	return !!$defineProperty;
};

hasPropertyDescriptors.hasArrayLengthDefineBug = function hasArrayLengthDefineBug() {
	// node v0.6 has a bug where array lengths can be Set but not Defined
	if (!$defineProperty) {
		return null;
	}
	try {
		return $defineProperty([], 'length', { value: 1 }).length !== 1;
	} catch (e) {
		// In Firefox 4-22, defining length on an array throws an exception.
		return true;
	}
};

module.exports = hasPropertyDescriptors;

},{"es-define-property":36}],57:[function(_dereq_,module,exports){
'use strict';

var test = {
	__proto__: null,
	foo: {}
};

var $Object = Object;

/** @type {import('.')} */
module.exports = function hasProto() {
	// @ts-expect-error: TS errors on an inherited property for some reason
	return { __proto__: test }.foo === test.foo
		&& !(test instanceof $Object);
};

},{}],58:[function(_dereq_,module,exports){
'use strict';

var origSymbol = typeof Symbol !== 'undefined' && Symbol;
var hasSymbolSham = _dereq_('./shams');

module.exports = function hasNativeSymbols() {
	if (typeof origSymbol !== 'function') { return false; }
	if (typeof Symbol !== 'function') { return false; }
	if (typeof origSymbol('foo') !== 'symbol') { return false; }
	if (typeof Symbol('bar') !== 'symbol') { return false; }

	return hasSymbolSham();
};

},{"./shams":59}],59:[function(_dereq_,module,exports){
'use strict';

/* eslint complexity: [2, 18], max-statements: [2, 33] */
module.exports = function hasSymbols() {
	if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') { return false; }
	if (typeof Symbol.iterator === 'symbol') { return true; }

	var obj = {};
	var sym = Symbol('test');
	var symObj = Object(sym);
	if (typeof sym === 'string') { return false; }

	if (Object.prototype.toString.call(sym) !== '[object Symbol]') { return false; }
	if (Object.prototype.toString.call(symObj) !== '[object Symbol]') { return false; }

	// temp disabled per https://github.com/ljharb/object.assign/issues/17
	// if (sym instanceof Symbol) { return false; }
	// temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
	// if (!(symObj instanceof Symbol)) { return false; }

	// if (typeof Symbol.prototype.toString !== 'function') { return false; }
	// if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }

	var symVal = 42;
	obj[sym] = symVal;
	for (sym in obj) { return false; } // eslint-disable-line no-restricted-syntax, no-unreachable-loop
	if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) { return false; }

	if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) { return false; }

	var syms = Object.getOwnPropertySymbols(obj);
	if (syms.length !== 1 || syms[0] !== sym) { return false; }

	if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) { return false; }

	if (typeof Object.getOwnPropertyDescriptor === 'function') {
		var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
		if (descriptor.value !== symVal || descriptor.enumerable !== true) { return false; }
	}

	return true;
};

},{}],60:[function(_dereq_,module,exports){
'use strict';

var call = Function.prototype.call;
var $hasOwn = Object.prototype.hasOwnProperty;
var bind = _dereq_('function-bind');

/** @type {import('.')} */
module.exports = bind.call(call, $hasOwn);

},{"function-bind":49}],61:[function(_dereq_,module,exports){
module.exports = shim

function shim (element, value) {
    if (value === undefined) {
        return element.style.display === 'none'
    }

    element.style.display = value ? 'none' : ''
}

},{}],62:[function(_dereq_,module,exports){
// HumanizeDuration.js - https://git.io/j0HgmQ

// @ts-check

/**
 * @typedef {string | ((unitCount: number) => string)} Unit
 */

/**
 * @typedef {("y" | "mo" | "w" | "d" | "h" | "m" | "s" | "ms")} UnitName
 */

/**
 * @typedef {Object} UnitMeasures
 * @prop {number} y
 * @prop {number} mo
 * @prop {number} w
 * @prop {number} d
 * @prop {number} h
 * @prop {number} m
 * @prop {number} s
 * @prop {number} ms
 */

/**
 * @internal
 * @typedef {[string, string, string, string, string, string, string, string, string, string]} DigitReplacements
 */

/**
 * @typedef {Object} Language
 * @prop {Unit} y
 * @prop {Unit} mo
 * @prop {Unit} w
 * @prop {Unit} d
 * @prop {Unit} h
 * @prop {Unit} m
 * @prop {Unit} s
 * @prop {Unit} ms
 * @prop {string} [decimal]
 * @prop {string} [delimiter]
 * @prop {DigitReplacements} [_digitReplacements]
 * @prop {boolean} [_numberFirst]
 * @prop {boolean} [_hideCountIf2]
 */

/**
 * @typedef {Object} Options
 * @prop {string} [language]
 * @prop {Record<string, Language>} [languages]
 * @prop {string[]} [fallbacks]
 * @prop {string} [delimiter]
 * @prop {string} [spacer]
 * @prop {boolean} [round]
 * @prop {number} [largest]
 * @prop {UnitName[]} [units]
 * @prop {string} [decimal]
 * @prop {string} [conjunction]
 * @prop {number} [maxDecimalPoints]
 * @prop {UnitMeasures} [unitMeasures]
 * @prop {boolean} [serialComma]
 * @prop {DigitReplacements} [digitReplacements]
 */

/**
 * @internal
 * @typedef {Required<Options>} NormalizedOptions
 */

(function () {
  // Fallback for `Object.assign` if relevant.
  var assign =
    Object.assign ||
    /** @param {...any} destination */
    function (destination) {
      var source;
      for (var i = 1; i < arguments.length; i++) {
        source = arguments[i];
        for (var prop in source) {
          if (has(source, prop)) {
            destination[prop] = source[prop];
          }
        }
      }
      return destination;
    };

  // Fallback for `Array.isArray` if relevant.
  var isArray =
    Array.isArray ||
    function (arg) {
      return Object.prototype.toString.call(arg) === "[object Array]";
    };

  // This has to be defined separately because of a bug: we want to alias
  // `gr` and `el` for backwards-compatiblity. In a breaking change, we can
  // remove `gr` entirely.
  // See https://github.com/EvanHahn/HumanizeDuration.js/issues/143 for more.
  var GREEK = language(
    function (c) {
      return c === 1 ? "χρόνος" : "χρόνια";
    },
    function (c) {
      return c === 1 ? "μήνας" : "μήνες";
    },
    function (c) {
      return c === 1 ? "εβδομάδα" : "εβδομάδες";
    },
    function (c) {
      return c === 1 ? "μέρα" : "μέρες";
    },
    function (c) {
      return c === 1 ? "ώρα" : "ώρες";
    },
    function (c) {
      return c === 1 ? "λεπτό" : "λεπτά";
    },
    function (c) {
      return c === 1 ? "δευτερόλεπτο" : "δευτερόλεπτα";
    },
    function (c) {
      return (c === 1 ? "χιλιοστό" : "χιλιοστά") + " του δευτερολέπτου";
    },
    ","
  );

  /**
   * @internal
   * @type {Record<string, Language>}
   */
  var LANGUAGES = {
    af: language(
      "jaar",
      function (c) {
        return "maand" + (c === 1 ? "" : "e");
      },
      function (c) {
        return c === 1 ? "week" : "weke";
      },
      function (c) {
        return c === 1 ? "dag" : "dae";
      },
      function (c) {
        return c === 1 ? "uur" : "ure";
      },
      function (c) {
        return c === 1 ? "minuut" : "minute";
      },
      function (c) {
        return "sekonde" + (c === 1 ? "" : "s");
      },
      function (c) {
        return "millisekonde" + (c === 1 ? "" : "s");
      },
      ","
    ),
    am: language("ዓመት", "ወር", "ሳምንት", "ቀን", "ሰዓት", "ደቂቃ", "ሰከንድ", "ሚሊሰከንድ"),
    ar: assign(
      language(
        function (c) {
          return ["سنة", "سنتان", "سنوات"][getArabicForm(c)];
        },
        function (c) {
          return ["شهر", "شهران", "أشهر"][getArabicForm(c)];
        },
        function (c) {
          return ["أسبوع", "أسبوعين", "أسابيع"][getArabicForm(c)];
        },
        function (c) {
          return ["يوم", "يومين", "أيام"][getArabicForm(c)];
        },
        function (c) {
          return ["ساعة", "ساعتين", "ساعات"][getArabicForm(c)];
        },
        function (c) {
          return ["دقيقة", "دقيقتان", "دقائق"][getArabicForm(c)];
        },
        function (c) {
          return ["ثانية", "ثانيتان", "ثواني"][getArabicForm(c)];
        },
        function (c) {
          return ["جزء من الثانية", "جزآن من الثانية", "أجزاء من الثانية"][
            getArabicForm(c)
          ];
        },
        ","
      ),
      {
        delimiter: " ﻭ ",
        _hideCountIf2: true,
        _digitReplacements: ["۰", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"]
      }
    ),
    bg: language(
      function (c) {
        return ["години", "година", "години"][getSlavicForm(c)];
      },
      function (c) {
        return ["месеца", "месец", "месеца"][getSlavicForm(c)];
      },
      function (c) {
        return ["седмици", "седмица", "седмици"][getSlavicForm(c)];
      },
      function (c) {
        return ["дни", "ден", "дни"][getSlavicForm(c)];
      },
      function (c) {
        return ["часа", "час", "часа"][getSlavicForm(c)];
      },
      function (c) {
        return ["минути", "минута", "минути"][getSlavicForm(c)];
      },
      function (c) {
        return ["секунди", "секунда", "секунди"][getSlavicForm(c)];
      },
      function (c) {
        return ["милисекунди", "милисекунда", "милисекунди"][getSlavicForm(c)];
      },
      ","
    ),
    bn: language(
      "বছর",
      "মাস",
      "সপ্তাহ",
      "দিন",
      "ঘন্টা",
      "মিনিট",
      "সেকেন্ড",
      "মিলিসেকেন্ড"
    ),
    ca: language(
      function (c) {
        return "any" + (c === 1 ? "" : "s");
      },
      function (c) {
        return "mes" + (c === 1 ? "" : "os");
      },
      function (c) {
        return "setman" + (c === 1 ? "a" : "es");
      },
      function (c) {
        return "di" + (c === 1 ? "a" : "es");
      },
      function (c) {
        return "hor" + (c === 1 ? "a" : "es");
      },
      function (c) {
        return "minut" + (c === 1 ? "" : "s");
      },
      function (c) {
        return "segon" + (c === 1 ? "" : "s");
      },
      function (c) {
        return "milisegon" + (c === 1 ? "" : "s");
      },
      ","
    ),
    ckb: language(
      "ساڵ",
      "مانگ",
      "هەفتە",
      "ڕۆژ",
      "کاژێر",
      "خولەک",
      "چرکە",
      "میلی چرکە",
      "."
    ),
    cs: language(
      function (c) {
        return ["rok", "roku", "roky", "let"][getCzechOrSlovakForm(c)];
      },
      function (c) {
        return ["měsíc", "měsíce", "měsíce", "měsíců"][getCzechOrSlovakForm(c)];
      },
      function (c) {
        return ["týden", "týdne", "týdny", "týdnů"][getCzechOrSlovakForm(c)];
      },
      function (c) {
        return ["den", "dne", "dny", "dní"][getCzechOrSlovakForm(c)];
      },
      function (c) {
        return ["hodina", "hodiny", "hodiny", "hodin"][getCzechOrSlovakForm(c)];
      },
      function (c) {
        return ["minuta", "minuty", "minuty", "minut"][getCzechOrSlovakForm(c)];
      },
      function (c) {
        return ["sekunda", "sekundy", "sekundy", "sekund"][
          getCzechOrSlovakForm(c)
        ];
      },
      function (c) {
        return ["milisekunda", "milisekundy", "milisekundy", "milisekund"][
          getCzechOrSlovakForm(c)
        ];
      },
      ","
    ),
    cy: language(
      "flwyddyn",
      "mis",
      "wythnos",
      "diwrnod",
      "awr",
      "munud",
      "eiliad",
      "milieiliad"
    ),
    da: language(
      "år",
      function (c) {
        return "måned" + (c === 1 ? "" : "er");
      },
      function (c) {
        return "uge" + (c === 1 ? "" : "r");
      },
      function (c) {
        return "dag" + (c === 1 ? "" : "e");
      },
      function (c) {
        return "time" + (c === 1 ? "" : "r");
      },
      function (c) {
        return "minut" + (c === 1 ? "" : "ter");
      },
      function (c) {
        return "sekund" + (c === 1 ? "" : "er");
      },
      function (c) {
        return "millisekund" + (c === 1 ? "" : "er");
      },
      ","
    ),
    de: language(
      function (c) {
        return "Jahr" + (c === 1 ? "" : "e");
      },
      function (c) {
        return "Monat" + (c === 1 ? "" : "e");
      },
      function (c) {
        return "Woche" + (c === 1 ? "" : "n");
      },
      function (c) {
        return "Tag" + (c === 1 ? "" : "e");
      },
      function (c) {
        return "Stunde" + (c === 1 ? "" : "n");
      },
      function (c) {
        return "Minute" + (c === 1 ? "" : "n");
      },
      function (c) {
        return "Sekunde" + (c === 1 ? "" : "n");
      },
      function (c) {
        return "Millisekunde" + (c === 1 ? "" : "n");
      },
      ","
    ),
    el: GREEK,
    en: language(
      function (c) {
        return "year" + (c === 1 ? "" : "s");
      },
      function (c) {
        return "month" + (c === 1 ? "" : "s");
      },
      function (c) {
        return "week" + (c === 1 ? "" : "s");
      },
      function (c) {
        return "day" + (c === 1 ? "" : "s");
      },
      function (c) {
        return "hour" + (c === 1 ? "" : "s");
      },
      function (c) {
        return "minute" + (c === 1 ? "" : "s");
      },
      function (c) {
        return "second" + (c === 1 ? "" : "s");
      },
      function (c) {
        return "millisecond" + (c === 1 ? "" : "s");
      }
    ),
    eo: language(
      function (c) {
        return "jaro" + (c === 1 ? "" : "j");
      },
      function (c) {
        return "monato" + (c === 1 ? "" : "j");
      },
      function (c) {
        return "semajno" + (c === 1 ? "" : "j");
      },
      function (c) {
        return "tago" + (c === 1 ? "" : "j");
      },
      function (c) {
        return "horo" + (c === 1 ? "" : "j");
      },
      function (c) {
        return "minuto" + (c === 1 ? "" : "j");
      },
      function (c) {
        return "sekundo" + (c === 1 ? "" : "j");
      },
      function (c) {
        return "milisekundo" + (c === 1 ? "" : "j");
      },
      ","
    ),
    es: language(
      function (c) {
        return "año" + (c === 1 ? "" : "s");
      },
      function (c) {
        return "mes" + (c === 1 ? "" : "es");
      },
      function (c) {
        return "semana" + (c === 1 ? "" : "s");
      },
      function (c) {
        return "día" + (c === 1 ? "" : "s");
      },
      function (c) {
        return "hora" + (c === 1 ? "" : "s");
      },
      function (c) {
        return "minuto" + (c === 1 ? "" : "s");
      },
      function (c) {
        return "segundo" + (c === 1 ? "" : "s");
      },
      function (c) {
        return "milisegundo" + (c === 1 ? "" : "s");
      },
      ","
    ),
    et: language(
      function (c) {
        return "aasta" + (c === 1 ? "" : "t");
      },
      function (c) {
        return "kuu" + (c === 1 ? "" : "d");
      },
      function (c) {
        return "nädal" + (c === 1 ? "" : "at");
      },
      function (c) {
        return "päev" + (c === 1 ? "" : "a");
      },
      function (c) {
        return "tund" + (c === 1 ? "" : "i");
      },
      function (c) {
        return "minut" + (c === 1 ? "" : "it");
      },
      function (c) {
        return "sekund" + (c === 1 ? "" : "it");
      },
      function (c) {
        return "millisekund" + (c === 1 ? "" : "it");
      },
      ","
    ),
    eu: language(
      "urte",
      "hilabete",
      "aste",
      "egun",
      "ordu",
      "minutu",
      "segundo",
      "milisegundo",
      ","
    ),
    fa: language(
      "سال",
      "ماه",
      "هفته",
      "روز",
      "ساعت",
      "دقیقه",
      "ثانیه",
      "میلی ثانیه"
    ),
    fi: language(
      function (c) {
        return c === 1 ? "vuosi" : "vuotta";
      },
      function (c) {
        return c === 1 ? "kuukausi" : "kuukautta";
      },
      function (c) {
        return "viikko" + (c === 1 ? "" : "a");
      },
      function (c) {
        return "päivä" + (c === 1 ? "" : "ä");
      },
      function (c) {
        return "tunti" + (c === 1 ? "" : "a");
      },
      function (c) {
        return "minuutti" + (c === 1 ? "" : "a");
      },
      function (c) {
        return "sekunti" + (c === 1 ? "" : "a");
      },
      function (c) {
        return "millisekunti" + (c === 1 ? "" : "a");
      },
      ","
    ),
    fo: language(
      "ár",
      function (c) {
        return c === 1 ? "mánaður" : "mánaðir";
      },
      function (c) {
        return c === 1 ? "vika" : "vikur";
      },
      function (c) {
        return c === 1 ? "dagur" : "dagar";
      },
      function (c) {
        return c === 1 ? "tími" : "tímar";
      },
      function (c) {
        return c === 1 ? "minuttur" : "minuttir";
      },
      "sekund",
      "millisekund",
      ","
    ),
    fr: language(
      function (c) {
        return "an" + (c >= 2 ? "s" : "");
      },
      "mois",
      function (c) {
        return "semaine" + (c >= 2 ? "s" : "");
      },
      function (c) {
        return "jour" + (c >= 2 ? "s" : "");
      },
      function (c) {
        return "heure" + (c >= 2 ? "s" : "");
      },
      function (c) {
        return "minute" + (c >= 2 ? "s" : "");
      },
      function (c) {
        return "seconde" + (c >= 2 ? "s" : "");
      },
      function (c) {
        return "milliseconde" + (c >= 2 ? "s" : "");
      },
      ","
    ),
    gr: GREEK,
    he: language(
      function (c) {
        return c === 1 ? "שנה" : "שנים";
      },
      function (c) {
        return c === 1 ? "חודש" : "חודשים";
      },
      function (c) {
        return c === 1 ? "שבוע" : "שבועות";
      },
      function (c) {
        return c === 1 ? "יום" : "ימים";
      },
      function (c) {
        return c === 1 ? "שעה" : "שעות";
      },
      function (c) {
        return c === 1 ? "דקה" : "דקות";
      },
      function (c) {
        return c === 1 ? "שניה" : "שניות";
      },
      function (c) {
        return c === 1 ? "מילישנייה" : "מילישניות";
      }
    ),
    hr: language(
      function (c) {
        if (c % 10 === 2 || c % 10 === 3 || c % 10 === 4) {
          return "godine";
        }
        return "godina";
      },
      function (c) {
        if (c === 1) {
          return "mjesec";
        } else if (c === 2 || c === 3 || c === 4) {
          return "mjeseca";
        }
        return "mjeseci";
      },
      function (c) {
        if (c % 10 === 1 && c !== 11) {
          return "tjedan";
        }
        return "tjedna";
      },
      function (c) {
        return c === 1 ? "dan" : "dana";
      },
      function (c) {
        if (c === 1) {
          return "sat";
        } else if (c === 2 || c === 3 || c === 4) {
          return "sata";
        }
        return "sati";
      },
      function (c) {
        var mod10 = c % 10;
        if ((mod10 === 2 || mod10 === 3 || mod10 === 4) && (c < 10 || c > 14)) {
          return "minute";
        }
        return "minuta";
      },
      function (c) {
        var mod10 = c % 10;
        if (mod10 === 5 || (Math.floor(c) === c && c >= 10 && c <= 19)) {
          return "sekundi";
        } else if (mod10 === 1) {
          return "sekunda";
        } else if (mod10 === 2 || mod10 === 3 || mod10 === 4) {
          return "sekunde";
        }
        return "sekundi";
      },
      function (c) {
        if (c === 1) {
          return "milisekunda";
        } else if (c % 10 === 2 || c % 10 === 3 || c % 10 === 4) {
          return "milisekunde";
        }
        return "milisekundi";
      },
      ","
    ),
    hi: language(
      "साल",
      function (c) {
        return c === 1 ? "महीना" : "महीने";
      },
      function (c) {
        return c === 1 ? "हफ़्ता" : "हफ्ते";
      },
      "दिन",
      function (c) {
        return c === 1 ? "घंटा" : "घंटे";
      },
      "मिनट",
      "सेकंड",
      "मिलीसेकंड"
    ),
    hu: language(
      "év",
      "hónap",
      "hét",
      "nap",
      "óra",
      "perc",
      "másodperc",
      "ezredmásodperc",
      ","
    ),
    id: language(
      "tahun",
      "bulan",
      "minggu",
      "hari",
      "jam",
      "menit",
      "detik",
      "milidetik"
    ),
    is: language(
      "ár",
      function (c) {
        return "mánuð" + (c === 1 ? "ur" : "ir");
      },
      function (c) {
        return "vik" + (c === 1 ? "a" : "ur");
      },
      function (c) {
        return "dag" + (c === 1 ? "ur" : "ar");
      },
      function (c) {
        return "klukkutím" + (c === 1 ? "i" : "ar");
      },
      function (c) {
        return "mínút" + (c === 1 ? "a" : "ur");
      },
      function (c) {
        return "sekúnd" + (c === 1 ? "a" : "ur");
      },
      function (c) {
        return "millisekúnd" + (c === 1 ? "a" : "ur");
      }
    ),
    it: language(
      function (c) {
        return "ann" + (c === 1 ? "o" : "i");
      },
      function (c) {
        return "mes" + (c === 1 ? "e" : "i");
      },
      function (c) {
        return "settiman" + (c === 1 ? "a" : "e");
      },
      function (c) {
        return "giorn" + (c === 1 ? "o" : "i");
      },
      function (c) {
        return "or" + (c === 1 ? "a" : "e");
      },
      function (c) {
        return "minut" + (c === 1 ? "o" : "i");
      },
      function (c) {
        return "second" + (c === 1 ? "o" : "i");
      },
      function (c) {
        return "millisecond" + (c === 1 ? "o" : "i");
      },
      ","
    ),
    ja: language("年", "ヶ月", "週", "日", "時間", "分", "秒", "ミリ秒"),
    km: language(
      "ឆ្នាំ",
      "ខែ",
      "សប្តាហ៍",
      "ថ្ងៃ",
      "ម៉ោង",
      "នាទី",
      "វិនាទី",
      "មិល្លីវិនាទី"
    ),
    kn: language(
      function (c) {
        return c === 1 ? "ವರ್ಷ" : "ವರ್ಷಗಳು";
      },
      function (c) {
        return c === 1 ? "ತಿಂಗಳು" : "ತಿಂಗಳುಗಳು";
      },
      function (c) {
        return c === 1 ? "ವಾರ" : "ವಾರಗಳು";
      },
      function (c) {
        return c === 1 ? "ದಿನ" : "ದಿನಗಳು";
      },
      function (c) {
        return c === 1 ? "ಗಂಟೆ" : "ಗಂಟೆಗಳು";
      },
      function (c) {
        return c === 1 ? "ನಿಮಿಷ" : "ನಿಮಿಷಗಳು";
      },
      function (c) {
        return c === 1 ? "ಸೆಕೆಂಡ್" : "ಸೆಕೆಂಡುಗಳು";
      },
      function (c) {
        return c === 1 ? "ಮಿಲಿಸೆಕೆಂಡ್" : "ಮಿಲಿಸೆಕೆಂಡುಗಳು";
      }
    ),
    ko: language("년", "개월", "주일", "일", "시간", "분", "초", "밀리 초"),
    ku: language(
      "sal",
      "meh",
      "hefte",
      "roj",
      "seet",
      "deqe",
      "saniye",
      "mîlîçirk",
      ","
    ),
    lo: language(
      "ປີ",
      "ເດືອນ",
      "ອາທິດ",
      "ມື້",
      "ຊົ່ວໂມງ",
      "ນາທີ",
      "ວິນາທີ",
      "ມິນລິວິນາທີ",
      ","
    ),
    lt: language(
      function (c) {
        return c % 10 === 0 || (c % 100 >= 10 && c % 100 <= 20)
          ? "metų"
          : "metai";
      },
      function (c) {
        return ["mėnuo", "mėnesiai", "mėnesių"][getLithuanianForm(c)];
      },
      function (c) {
        return ["savaitė", "savaitės", "savaičių"][getLithuanianForm(c)];
      },
      function (c) {
        return ["diena", "dienos", "dienų"][getLithuanianForm(c)];
      },
      function (c) {
        return ["valanda", "valandos", "valandų"][getLithuanianForm(c)];
      },
      function (c) {
        return ["minutė", "minutės", "minučių"][getLithuanianForm(c)];
      },
      function (c) {
        return ["sekundė", "sekundės", "sekundžių"][getLithuanianForm(c)];
      },
      function (c) {
        return ["milisekundė", "milisekundės", "milisekundžių"][
          getLithuanianForm(c)
        ];
      },
      ","
    ),
    lv: language(
      function (c) {
        return getLatvianForm(c) ? "gads" : "gadi";
      },
      function (c) {
        return getLatvianForm(c) ? "mēnesis" : "mēneši";
      },
      function (c) {
        return getLatvianForm(c) ? "nedēļa" : "nedēļas";
      },
      function (c) {
        return getLatvianForm(c) ? "diena" : "dienas";
      },
      function (c) {
        return getLatvianForm(c) ? "stunda" : "stundas";
      },
      function (c) {
        return getLatvianForm(c) ? "minūte" : "minūtes";
      },
      function (c) {
        return getLatvianForm(c) ? "sekunde" : "sekundes";
      },
      function (c) {
        return getLatvianForm(c) ? "milisekunde" : "milisekundes";
      },
      ","
    ),
    mk: language(
      function (c) {
        return c === 1 ? "година" : "години";
      },
      function (c) {
        return c === 1 ? "месец" : "месеци";
      },
      function (c) {
        return c === 1 ? "недела" : "недели";
      },
      function (c) {
        return c === 1 ? "ден" : "дена";
      },
      function (c) {
        return c === 1 ? "час" : "часа";
      },
      function (c) {
        return c === 1 ? "минута" : "минути";
      },
      function (c) {
        return c === 1 ? "секунда" : "секунди";
      },
      function (c) {
        return c === 1 ? "милисекунда" : "милисекунди";
      },
      ","
    ),
    mn: language(
      "жил",
      "сар",
      "долоо хоног",
      "өдөр",
      "цаг",
      "минут",
      "секунд",
      "миллисекунд"
    ),
    mr: language(
      function (c) {
        return c === 1 ? "वर्ष" : "वर्षे";
      },
      function (c) {
        return c === 1 ? "महिना" : "महिने";
      },
      function (c) {
        return c === 1 ? "आठवडा" : "आठवडे";
      },
      "दिवस",
      "तास",
      function (c) {
        return c === 1 ? "मिनिट" : "मिनिटे";
      },
      "सेकंद",
      "मिलिसेकंद"
    ),
    ms: language(
      "tahun",
      "bulan",
      "minggu",
      "hari",
      "jam",
      "minit",
      "saat",
      "milisaat"
    ),
    nl: language(
      "jaar",
      function (c) {
        return c === 1 ? "maand" : "maanden";
      },
      function (c) {
        return c === 1 ? "week" : "weken";
      },
      function (c) {
        return c === 1 ? "dag" : "dagen";
      },
      "uur",
      function (c) {
        return c === 1 ? "minuut" : "minuten";
      },
      function (c) {
        return c === 1 ? "seconde" : "seconden";
      },
      function (c) {
        return c === 1 ? "milliseconde" : "milliseconden";
      },
      ","
    ),
    no: language(
      "år",
      function (c) {
        return "måned" + (c === 1 ? "" : "er");
      },
      function (c) {
        return "uke" + (c === 1 ? "" : "r");
      },
      function (c) {
        return "dag" + (c === 1 ? "" : "er");
      },
      function (c) {
        return "time" + (c === 1 ? "" : "r");
      },
      function (c) {
        return "minutt" + (c === 1 ? "" : "er");
      },
      function (c) {
        return "sekund" + (c === 1 ? "" : "er");
      },
      function (c) {
        return "millisekund" + (c === 1 ? "" : "er");
      },
      ","
    ),
    pl: language(
      function (c) {
        return ["rok", "roku", "lata", "lat"][getPolishForm(c)];
      },
      function (c) {
        return ["miesiąc", "miesiąca", "miesiące", "miesięcy"][
          getPolishForm(c)
        ];
      },
      function (c) {
        return ["tydzień", "tygodnia", "tygodnie", "tygodni"][getPolishForm(c)];
      },
      function (c) {
        return ["dzień", "dnia", "dni", "dni"][getPolishForm(c)];
      },
      function (c) {
        return ["godzina", "godziny", "godziny", "godzin"][getPolishForm(c)];
      },
      function (c) {
        return ["minuta", "minuty", "minuty", "minut"][getPolishForm(c)];
      },
      function (c) {
        return ["sekunda", "sekundy", "sekundy", "sekund"][getPolishForm(c)];
      },
      function (c) {
        return ["milisekunda", "milisekundy", "milisekundy", "milisekund"][
          getPolishForm(c)
        ];
      },
      ","
    ),
    pt: language(
      function (c) {
        return "ano" + (c === 1 ? "" : "s");
      },
      function (c) {
        return c === 1 ? "mês" : "meses";
      },
      function (c) {
        return "semana" + (c === 1 ? "" : "s");
      },
      function (c) {
        return "dia" + (c === 1 ? "" : "s");
      },
      function (c) {
        return "hora" + (c === 1 ? "" : "s");
      },
      function (c) {
        return "minuto" + (c === 1 ? "" : "s");
      },
      function (c) {
        return "segundo" + (c === 1 ? "" : "s");
      },
      function (c) {
        return "milissegundo" + (c === 1 ? "" : "s");
      },
      ","
    ),
    ro: language(
      function (c) {
        return c === 1 ? "an" : "ani";
      },
      function (c) {
        return c === 1 ? "lună" : "luni";
      },
      function (c) {
        return c === 1 ? "săptămână" : "săptămâni";
      },
      function (c) {
        return c === 1 ? "zi" : "zile";
      },
      function (c) {
        return c === 1 ? "oră" : "ore";
      },
      function (c) {
        return c === 1 ? "minut" : "minute";
      },
      function (c) {
        return c === 1 ? "secundă" : "secunde";
      },
      function (c) {
        return c === 1 ? "milisecundă" : "milisecunde";
      },
      ","
    ),
    ru: language(
      function (c) {
        return ["лет", "год", "года"][getSlavicForm(c)];
      },
      function (c) {
        return ["месяцев", "месяц", "месяца"][getSlavicForm(c)];
      },
      function (c) {
        return ["недель", "неделя", "недели"][getSlavicForm(c)];
      },
      function (c) {
        return ["дней", "день", "дня"][getSlavicForm(c)];
      },
      function (c) {
        return ["часов", "час", "часа"][getSlavicForm(c)];
      },
      function (c) {
        return ["минут", "минута", "минуты"][getSlavicForm(c)];
      },
      function (c) {
        return ["секунд", "секунда", "секунды"][getSlavicForm(c)];
      },
      function (c) {
        return ["миллисекунд", "миллисекунда", "миллисекунды"][
          getSlavicForm(c)
        ];
      },
      ","
    ),
    sq: language(
      function (c) {
        return c === 1 ? "vit" : "vjet";
      },
      "muaj",
      "javë",
      "ditë",
      "orë",
      function (c) {
        return "minut" + (c === 1 ? "ë" : "a");
      },
      function (c) {
        return "sekond" + (c === 1 ? "ë" : "a");
      },
      function (c) {
        return "milisekond" + (c === 1 ? "ë" : "a");
      },
      ","
    ),
    sr: language(
      function (c) {
        return ["години", "година", "године"][getSlavicForm(c)];
      },
      function (c) {
        return ["месеци", "месец", "месеца"][getSlavicForm(c)];
      },
      function (c) {
        return ["недељи", "недеља", "недеље"][getSlavicForm(c)];
      },
      function (c) {
        return ["дани", "дан", "дана"][getSlavicForm(c)];
      },
      function (c) {
        return ["сати", "сат", "сата"][getSlavicForm(c)];
      },
      function (c) {
        return ["минута", "минут", "минута"][getSlavicForm(c)];
      },
      function (c) {
        return ["секунди", "секунда", "секунде"][getSlavicForm(c)];
      },
      function (c) {
        return ["милисекунди", "милисекунда", "милисекунде"][getSlavicForm(c)];
      },
      ","
    ),
    ta: language(
      function (c) {
        return c === 1 ? "வருடம்" : "ஆண்டுகள்";
      },
      function (c) {
        return c === 1 ? "மாதம்" : "மாதங்கள்";
      },
      function (c) {
        return c === 1 ? "வாரம்" : "வாரங்கள்";
      },
      function (c) {
        return c === 1 ? "நாள்" : "நாட்கள்";
      },
      function (c) {
        return c === 1 ? "மணி" : "மணிநேரம்";
      },
      function (c) {
        return "நிமிட" + (c === 1 ? "ம்" : "ங்கள்");
      },
      function (c) {
        return "வினாடி" + (c === 1 ? "" : "கள்");
      },
      function (c) {
        return "மில்லி விநாடி" + (c === 1 ? "" : "கள்");
      }
    ),
    te: language(
      function (c) {
        return "సంవత్స" + (c === 1 ? "రం" : "రాల");
      },
      function (c) {
        return "నెల" + (c === 1 ? "" : "ల");
      },
      function (c) {
        return c === 1 ? "వారం" : "వారాలు";
      },
      function (c) {
        return "రోజు" + (c === 1 ? "" : "లు");
      },
      function (c) {
        return "గంట" + (c === 1 ? "" : "లు");
      },
      function (c) {
        return c === 1 ? "నిమిషం" : "నిమిషాలు";
      },
      function (c) {
        return c === 1 ? "సెకను" : "సెకన్లు";
      },
      function (c) {
        return c === 1 ? "మిల్లీసెకన్" : "మిల్లీసెకన్లు";
      }
    ),
    uk: language(
      function (c) {
        return ["років", "рік", "роки"][getSlavicForm(c)];
      },
      function (c) {
        return ["місяців", "місяць", "місяці"][getSlavicForm(c)];
      },
      function (c) {
        return ["тижнів", "тиждень", "тижні"][getSlavicForm(c)];
      },
      function (c) {
        return ["днів", "день", "дні"][getSlavicForm(c)];
      },
      function (c) {
        return ["годин", "година", "години"][getSlavicForm(c)];
      },
      function (c) {
        return ["хвилин", "хвилина", "хвилини"][getSlavicForm(c)];
      },
      function (c) {
        return ["секунд", "секунда", "секунди"][getSlavicForm(c)];
      },
      function (c) {
        return ["мілісекунд", "мілісекунда", "мілісекунди"][getSlavicForm(c)];
      },
      ","
    ),
    ur: language(
      "سال",
      function (c) {
        return c === 1 ? "مہینہ" : "مہینے";
      },
      function (c) {
        return c === 1 ? "ہفتہ" : "ہفتے";
      },
      "دن",
      function (c) {
        return c === 1 ? "گھنٹہ" : "گھنٹے";
      },
      "منٹ",
      "سیکنڈ",
      "ملی سیکنڈ"
    ),
    sk: language(
      function (c) {
        return ["rok", "roky", "roky", "rokov"][getCzechOrSlovakForm(c)];
      },
      function (c) {
        return ["mesiac", "mesiace", "mesiace", "mesiacov"][
          getCzechOrSlovakForm(c)
        ];
      },
      function (c) {
        return ["týždeň", "týždne", "týždne", "týždňov"][
          getCzechOrSlovakForm(c)
        ];
      },
      function (c) {
        return ["deň", "dni", "dni", "dní"][getCzechOrSlovakForm(c)];
      },
      function (c) {
        return ["hodina", "hodiny", "hodiny", "hodín"][getCzechOrSlovakForm(c)];
      },
      function (c) {
        return ["minúta", "minúty", "minúty", "minút"][getCzechOrSlovakForm(c)];
      },
      function (c) {
        return ["sekunda", "sekundy", "sekundy", "sekúnd"][
          getCzechOrSlovakForm(c)
        ];
      },
      function (c) {
        return ["milisekunda", "milisekundy", "milisekundy", "milisekúnd"][
          getCzechOrSlovakForm(c)
        ];
      },
      ","
    ),
    sl: language(
      function (c) {
        if (c % 10 === 1) {
          return "leto";
        } else if (c % 100 === 2) {
          return "leti";
        } else if (
          c % 100 === 3 ||
          c % 100 === 4 ||
          (Math.floor(c) !== c && c % 100 <= 5)
        ) {
          return "leta";
        } else {
          return "let";
        }
      },
      function (c) {
        if (c % 10 === 1) {
          return "mesec";
        } else if (c % 100 === 2 || (Math.floor(c) !== c && c % 100 <= 5)) {
          return "meseca";
        } else if (c % 10 === 3 || c % 10 === 4) {
          return "mesece";
        } else {
          return "mesecev";
        }
      },
      function (c) {
        if (c % 10 === 1) {
          return "teden";
        } else if (c % 10 === 2 || (Math.floor(c) !== c && c % 100 <= 4)) {
          return "tedna";
        } else if (c % 10 === 3 || c % 10 === 4) {
          return "tedne";
        } else {
          return "tednov";
        }
      },
      function (c) {
        return c % 100 === 1 ? "dan" : "dni";
      },
      function (c) {
        if (c % 10 === 1) {
          return "ura";
        } else if (c % 100 === 2) {
          return "uri";
        } else if (c % 10 === 3 || c % 10 === 4 || Math.floor(c) !== c) {
          return "ure";
        } else {
          return "ur";
        }
      },
      function (c) {
        if (c % 10 === 1) {
          return "minuta";
        } else if (c % 10 === 2) {
          return "minuti";
        } else if (
          c % 10 === 3 ||
          c % 10 === 4 ||
          (Math.floor(c) !== c && c % 100 <= 4)
        ) {
          return "minute";
        } else {
          return "minut";
        }
      },
      function (c) {
        if (c % 10 === 1) {
          return "sekunda";
        } else if (c % 100 === 2) {
          return "sekundi";
        } else if (c % 100 === 3 || c % 100 === 4 || Math.floor(c) !== c) {
          return "sekunde";
        } else {
          return "sekund";
        }
      },
      function (c) {
        if (c % 10 === 1) {
          return "milisekunda";
        } else if (c % 100 === 2) {
          return "milisekundi";
        } else if (c % 100 === 3 || c % 100 === 4 || Math.floor(c) !== c) {
          return "milisekunde";
        } else {
          return "milisekund";
        }
      },
      ","
    ),
    sv: language(
      "år",
      function (c) {
        return "månad" + (c === 1 ? "" : "er");
      },
      function (c) {
        return "veck" + (c === 1 ? "a" : "or");
      },
      function (c) {
        return "dag" + (c === 1 ? "" : "ar");
      },
      function (c) {
        return "timm" + (c === 1 ? "e" : "ar");
      },
      function (c) {
        return "minut" + (c === 1 ? "" : "er");
      },
      function (c) {
        return "sekund" + (c === 1 ? "" : "er");
      },
      function (c) {
        return "millisekund" + (c === 1 ? "" : "er");
      },
      ","
    ),
    sw: assign(
      language(
        function (c) {
          return c === 1 ? "mwaka" : "miaka";
        },
        function (c) {
          return c === 1 ? "mwezi" : "miezi";
        },
        "wiki",
        function (c) {
          return c === 1 ? "siku" : "masiku";
        },
        function (c) {
          return c === 1 ? "saa" : "masaa";
        },
        "dakika",
        "sekunde",
        "milisekunde"
      ),
      { _numberFirst: true }
    ),
    tr: language(
      "yıl",
      "ay",
      "hafta",
      "gün",
      "saat",
      "dakika",
      "saniye",
      "milisaniye",
      ","
    ),
    th: language(
      "ปี",
      "เดือน",
      "สัปดาห์",
      "วัน",
      "ชั่วโมง",
      "นาที",
      "วินาที",
      "มิลลิวินาที"
    ),
    uz: language(
      "yil",
      "oy",
      "hafta",
      "kun",
      "soat",
      "minut",
      "sekund",
      "millisekund"
    ),
    uz_CYR: language(
      "йил",
      "ой",
      "ҳафта",
      "кун",
      "соат",
      "минут",
      "секунд",
      "миллисекунд"
    ),
    vi: language(
      "năm",
      "tháng",
      "tuần",
      "ngày",
      "giờ",
      "phút",
      "giây",
      "mili giây",
      ","
    ),
    zh_CN: language("年", "个月", "周", "天", "小时", "分钟", "秒", "毫秒"),
    zh_TW: language("年", "個月", "周", "天", "小時", "分鐘", "秒", "毫秒")
  };

  /**
   * Helper function for creating language definitions.
   *
   * @internal
   * @param {Unit} y
   * @param {Unit} mo
   * @param {Unit} w
   * @param {Unit} d
   * @param {Unit} h
   * @param {Unit} m
   * @param {Unit} s
   * @param {Unit} ms
   * @param {string} [decimal]
   * @returns {Language}
   */
  function language(y, mo, w, d, h, m, s, ms, decimal) {
    /** @type {Language} */
    var result = { y: y, mo: mo, w: w, d: d, h: h, m: m, s: s, ms: ms };
    if (typeof decimal !== "undefined") {
      result.decimal = decimal;
    }
    return result;
  }

  /**
   * Helper function for Arabic.
   *
   * @internal
   * @param {number} c
   * @returns {0 | 1 | 2}
   */
  function getArabicForm(c) {
    if (c === 2) {
      return 1;
    }
    if (c > 2 && c < 11) {
      return 2;
    }
    return 0;
  }

  /**
   * Helper function for Polish.
   *
   * @internal
   * @param {number} c
   * @returns {0 | 1 | 2 | 3}
   */
  function getPolishForm(c) {
    if (c === 1) {
      return 0;
    }
    if (Math.floor(c) !== c) {
      return 1;
    }
    if (c % 10 >= 2 && c % 10 <= 4 && !(c % 100 > 10 && c % 100 < 20)) {
      return 2;
    }
    return 3;
  }

  /**
   * Helper function for Slavic languages.
   *
   * @internal
   * @param {number} c
   * @returns {0 | 1 | 2 | 3}
   */
  function getSlavicForm(c) {
    if (Math.floor(c) !== c) {
      return 2;
    }
    if (
      (c % 100 >= 5 && c % 100 <= 20) ||
      (c % 10 >= 5 && c % 10 <= 9) ||
      c % 10 === 0
    ) {
      return 0;
    }
    if (c % 10 === 1) {
      return 1;
    }
    if (c > 1) {
      return 2;
    }
    return 0;
  }

  /**
   * Helper function for Czech or Slovak.
   *
   * @internal
   * @param {number} c
   * @returns {0 | 1 | 2 | 3}
   */
  function getCzechOrSlovakForm(c) {
    if (c === 1) {
      return 0;
    }
    if (Math.floor(c) !== c) {
      return 1;
    }
    if (c % 10 >= 2 && c % 10 <= 4 && c % 100 < 10) {
      return 2;
    }
    return 3;
  }

  /**
   * Helper function for Lithuanian.
   *
   * @internal
   * @param {number} c
   * @returns {0 | 1 | 2}
   */
  function getLithuanianForm(c) {
    if (c === 1 || (c % 10 === 1 && c % 100 > 20)) {
      return 0;
    }
    if (
      Math.floor(c) !== c ||
      (c % 10 >= 2 && c % 100 > 20) ||
      (c % 10 >= 2 && c % 100 < 10)
    ) {
      return 1;
    }
    return 2;
  }

  /**
   * Helper function for Latvian.
   *
   * @internal
   * @param {number} c
   * @returns {boolean}
   */
  function getLatvianForm(c) {
    return c % 10 === 1 && c % 100 !== 11;
  }

  /**
   * @internal
   * @template T
   * @param {T} obj
   * @param {keyof T} key
   * @returns {boolean}
   */
  function has(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }

  /**
   * @internal
   * @param {Pick<Required<Options>, "language" | "fallbacks" | "languages">} options
   * @throws {Error} Throws an error if language is not found.
   * @returns {Language}
   */
  function getLanguage(options) {
    var possibleLanguages = [options.language];

    if (has(options, "fallbacks")) {
      if (isArray(options.fallbacks) && options.fallbacks.length) {
        possibleLanguages = possibleLanguages.concat(options.fallbacks);
      } else {
        throw new Error("fallbacks must be an array with at least one element");
      }
    }

    for (var i = 0; i < possibleLanguages.length; i++) {
      var languageToTry = possibleLanguages[i];
      if (has(options.languages, languageToTry)) {
        return options.languages[languageToTry];
      }
      if (has(LANGUAGES, languageToTry)) {
        return LANGUAGES[languageToTry];
      }
    }

    throw new Error("No language found.");
  }

  /**
   * @internal
   * @param {Piece} piece
   * @param {Language} language
   * @param {Pick<Required<Options>, "decimal" | "spacer" | "maxDecimalPoints" | "digitReplacements">} options
   */
  function renderPiece(piece, language, options) {
    var unitName = piece.unitName;
    var unitCount = piece.unitCount;

    var spacer = options.spacer;
    var maxDecimalPoints = options.maxDecimalPoints;

    /** @type {string} */
    var decimal;
    if (has(options, "decimal")) {
      decimal = options.decimal;
    } else if (has(language, "decimal")) {
      decimal = language.decimal;
    } else {
      decimal = ".";
    }

    /** @type {undefined | DigitReplacements} */
    var digitReplacements;
    if ("digitReplacements" in options) {
      digitReplacements = options.digitReplacements;
    } else if ("_digitReplacements" in language) {
      digitReplacements = language._digitReplacements;
    }

    /** @type {string} */
    var formattedCount;
    var normalizedUnitCount =
      maxDecimalPoints === void 0
        ? unitCount
        : Math.floor(unitCount * Math.pow(10, maxDecimalPoints)) /
          Math.pow(10, maxDecimalPoints);
    var countStr = normalizedUnitCount.toString();

    if (language._hideCountIf2 && unitCount === 2) {
      formattedCount = "";
      spacer = "";
    } else {
      if (digitReplacements) {
        formattedCount = "";
        for (var i = 0; i < countStr.length; i++) {
          var char = countStr[i];
          if (char === ".") {
            formattedCount += decimal;
          } else {
            // @ts-ignore because `char` should always be 0-9 at this point.
            formattedCount += digitReplacements[char];
          }
        }
      } else {
        formattedCount = countStr.replace(".", decimal);
      }
    }

    var languageWord = language[unitName];
    var word;
    if (typeof languageWord === "function") {
      word = languageWord(unitCount);
    } else {
      word = languageWord;
    }

    if (language._numberFirst) {
      return word + spacer + formattedCount;
    }
    return formattedCount + spacer + word;
  }

  /**
   * @internal
   * @typedef {Object} Piece
   * @prop {UnitName} unitName
   * @prop {number} unitCount
   */

  /**
   * @internal
   * @param {number} ms
   * @param {Pick<Required<Options>, "units" | "unitMeasures" | "largest" | "round">} options
   * @returns {Piece[]}
   */
  function getPieces(ms, options) {
    /** @type {UnitName} */
    var unitName;

    /** @type {number} */
    var i;

    /** @type {number} */
    var unitCount;

    /** @type {number} */
    var msRemaining;

    var units = options.units;
    var unitMeasures = options.unitMeasures;
    var largest = "largest" in options ? options.largest : Infinity;

    if (!units.length) return [];

    // Get the counts for each unit. Doesn't round or truncate anything.
    // For example, might create an object like `{ y: 7, m: 6, w: 0, d: 5, h: 23.99 }`.
    /** @type {Partial<Record<UnitName, number>>} */
    var unitCounts = {};
    msRemaining = ms;
    for (i = 0; i < units.length; i++) {
      unitName = units[i];
      var unitMs = unitMeasures[unitName];

      var isLast = i === units.length - 1;
      unitCount = isLast
        ? msRemaining / unitMs
        : Math.floor(msRemaining / unitMs);
      unitCounts[unitName] = unitCount;

      msRemaining -= unitCount * unitMs;
    }

    if (options.round) {
      // Update counts based on the `largest` option.
      // For example, if `largest === 2` and `unitCount` is `{ y: 7, m: 6, w: 0, d: 5, h: 23.99 }`,
      // updates to something like `{ y: 7, m: 6.2 }`.
      var unitsRemainingBeforeRound = largest;
      for (i = 0; i < units.length; i++) {
        unitName = units[i];
        unitCount = unitCounts[unitName];

        if (unitCount === 0) continue;

        unitsRemainingBeforeRound--;

        // "Take" the rest of the units into this one.
        if (unitsRemainingBeforeRound === 0) {
          for (var j = i + 1; j < units.length; j++) {
            var smallerUnitName = units[j];
            var smallerUnitCount = unitCounts[smallerUnitName];
            unitCounts[unitName] +=
              (smallerUnitCount * unitMeasures[smallerUnitName]) /
              unitMeasures[unitName];
            unitCounts[smallerUnitName] = 0;
          }
          break;
        }
      }

      // Round the last piece (which should be the only non-integer).
      //
      // This can be a little tricky if the last piece "bubbles up" to a larger
      // unit. For example, "3 days, 23.99 hours" should be rounded to "4 days".
      // It can also require multiple passes. For example, "6 days, 23.99 hours"
      // should become "1 week".
      for (i = units.length - 1; i >= 0; i--) {
        unitName = units[i];
        unitCount = unitCounts[unitName];

        if (unitCount === 0) continue;

        var rounded = Math.round(unitCount);
        unitCounts[unitName] = rounded;

        if (i === 0) break;

        var previousUnitName = units[i - 1];
        var previousUnitMs = unitMeasures[previousUnitName];
        var amountOfPreviousUnit = Math.floor(
          (rounded * unitMeasures[unitName]) / previousUnitMs
        );
        if (amountOfPreviousUnit) {
          unitCounts[previousUnitName] += amountOfPreviousUnit;
          unitCounts[unitName] = 0;
        } else {
          break;
        }
      }
    }

    /** @type {Piece[]} */
    var result = [];
    for (i = 0; i < units.length && result.length < largest; i++) {
      unitName = units[i];
      unitCount = unitCounts[unitName];
      if (unitCount) {
        result.push({ unitName: unitName, unitCount: unitCount });
      }
    }
    return result;
  }

  /**
   * @internal
   * @param {Piece[]} pieces
   * @param {Pick<Required<Options>, "units" | "language" | "languages" | "fallbacks" | "delimiter" | "spacer" | "decimal" | "conjunction" | "maxDecimalPoints" | "serialComma" | "digitReplacements">} options
   * @returns {string}
   */
  function formatPieces(pieces, options) {
    var language = getLanguage(options);

    if (!pieces.length) {
      var units = options.units;
      var smallestUnitName = units[units.length - 1];
      return renderPiece(
        { unitName: smallestUnitName, unitCount: 0 },
        language,
        options
      );
    }

    var conjunction = options.conjunction;
    var serialComma = options.serialComma;

    var delimiter;
    if (has(options, "delimiter")) {
      delimiter = options.delimiter;
    } else if (has(language, "delimiter")) {
      delimiter = language.delimiter;
    } else {
      delimiter = ", ";
    }

    /** @type {string[]} */
    var renderedPieces = [];
    for (var i = 0; i < pieces.length; i++) {
      renderedPieces.push(renderPiece(pieces[i], language, options));
    }

    if (!conjunction || pieces.length === 1) {
      return renderedPieces.join(delimiter);
    }

    if (pieces.length === 2) {
      return renderedPieces.join(conjunction);
    }

    return (
      renderedPieces.slice(0, -1).join(delimiter) +
      (serialComma ? "," : "") +
      conjunction +
      renderedPieces.slice(-1)
    );
  }

  /**
   * Create a humanizer, which lets you change the default options.
   *
   * @param {Options} [passedOptions]
   */
  function humanizer(passedOptions) {
    /**
     * @param {number} ms
     * @param {Options} [humanizerOptions]
     * @returns {string}
     */
    var result = function humanizer(ms, humanizerOptions) {
      // Make sure we have a positive number.
      //
      // Has the nice side-effect of converting things to numbers. For example,
      // converts `"123"` and `Number(123)` to `123`.
      ms = Math.abs(ms);

      var options = assign({}, result, humanizerOptions || {});

      var pieces = getPieces(ms, options);

      return formatPieces(pieces, options);
    };

    return assign(
      result,
      {
        language: "en",
        spacer: " ",
        conjunction: "",
        serialComma: true,
        units: ["y", "mo", "w", "d", "h", "m", "s"],
        languages: {},
        round: false,
        unitMeasures: {
          y: 31557600000,
          mo: 2629800000,
          w: 604800000,
          d: 86400000,
          h: 3600000,
          m: 60000,
          s: 1000,
          ms: 1
        }
      },
      passedOptions
    );
  }

  /**
   * Humanize a duration.
   *
   * This is a wrapper around the default humanizer.
   */
  var humanizeDuration = assign(humanizer({}), {
    getSupportedLanguages: function getSupportedLanguages() {
      var result = [];
      for (var language in LANGUAGES) {
        if (has(LANGUAGES, language) && language !== "gr") {
          result.push(language);
        }
      }
      return result;
    },
    humanizer: humanizer
  });

  // @ts-ignore
  if (typeof define === "function" && define.amd) {
    // @ts-ignore
    define(function () {
      return humanizeDuration;
    });
  } else if (typeof module !== "undefined" && module.exports) {
    module.exports = humanizeDuration;
  } else {
    this.humanizeDuration = humanizeDuration;
  }
})();

},{}],63:[function(_dereq_,module,exports){
var split = _dereq_('browser-split')
var ClassList = _dereq_('class-list')

var w = typeof window === 'undefined' ? _dereq_('html-element') : window
var document = w.document
var Text = w.Text

function context () {

  var cleanupFuncs = []

  function h() {
    var args = [].slice.call(arguments), e = null
    function item (l) {
      var r
      function parseClass (string) {
        // Our minimal parser doesn’t understand escaping CSS special
        // characters like `#`. Don’t use them. More reading:
        // https://mathiasbynens.be/notes/css-escapes .

        var m = split(string, /([\.#]?[^\s#.]+)/)
        if(/^\.|#/.test(m[1]))
          e = document.createElement('div')
        forEach(m, function (v) {
          var s = v.substring(1,v.length)
          if(!v) return
          if(!e)
            e = document.createElement(v)
          else if (v[0] === '.')
            ClassList(e).add(s)
          else if (v[0] === '#')
            e.setAttribute('id', s)
        })
      }

      if(l == null)
        ;
      else if('string' === typeof l) {
        if(!e)
          parseClass(l)
        else
          e.appendChild(r = document.createTextNode(l))
      }
      else if('number' === typeof l
        || 'boolean' === typeof l
        || l instanceof Date
        || l instanceof RegExp ) {
          e.appendChild(r = document.createTextNode(l.toString()))
      }
      //there might be a better way to handle this...
      else if (isArray(l))
        forEach(l, item)
      else if(isNode(l))
        e.appendChild(r = l)
      else if(l instanceof Text)
        e.appendChild(r = l)
      else if ('object' === typeof l) {
        for (var k in l) {
          if('function' === typeof l[k]) {
            if(/^on\w+/.test(k)) {
              (function (k, l) { // capture k, l in the closure
                if (e.addEventListener){
                  e.addEventListener(k.substring(2), l[k], false)
                  cleanupFuncs.push(function(){
                    e.removeEventListener(k.substring(2), l[k], false)
                  })
                }else{
                  e.attachEvent(k, l[k])
                  cleanupFuncs.push(function(){
                    e.detachEvent(k, l[k])
                  })
                }
              })(k, l)
            } else {
              // observable
              e[k] = l[k]()
              cleanupFuncs.push(l[k](function (v) {
                e[k] = v
              }))
            }
          }
          else if(k === 'style') {
            if('string' === typeof l[k]) {
              e.style.cssText = l[k]
            }else{
              for (var s in l[k]) (function(s, v) {
                if('function' === typeof v) {
                  // observable
                  e.style.setProperty(s, v())
                  cleanupFuncs.push(v(function (val) {
                    e.style.setProperty(s, val)
                  }))
                } else
                  var match = l[k][s].match(/(.*)\W+!important\W*$/);
                  if (match) {
                    e.style.setProperty(s, match[1], 'important')
                  } else {
                    e.style.setProperty(s, l[k][s])
                  }
              })(s, l[k][s])
            }
          } else if(k === 'attrs') {
            for (var v in l[k]) {
              e.setAttribute(v, l[k][v])
            }
          }
          else if (k.substr(0, 5) === "data-") {
            e.setAttribute(k, l[k])
          } else {
            e[k] = l[k]
          }
        }
      } else if ('function' === typeof l) {
        //assume it's an observable!
        var v = l()
        e.appendChild(r = isNode(v) ? v : document.createTextNode(v))

        cleanupFuncs.push(l(function (v) {
          if(isNode(v) && r.parentElement)
            r.parentElement.replaceChild(v, r), r = v
          else
            r.textContent = v
        }))
      }

      return r
    }
    while(args.length)
      item(args.shift())

    return e
  }

  h.cleanup = function () {
    for (var i = 0; i < cleanupFuncs.length; i++){
      cleanupFuncs[i]()
    }
    cleanupFuncs.length = 0
  }

  return h
}

var h = module.exports = context()
h.context = context

function isNode (el) {
  return el && el.nodeName && el.nodeType
}

function forEach (arr, fn) {
  if (arr.forEach) return arr.forEach(fn)
  for (var i = 0; i < arr.length; i++) fn(arr[i], i)
}

function isArray (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]'
}



},{"browser-split":17,"class-list":22,"html-element":16}],64:[function(_dereq_,module,exports){
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],65:[function(_dereq_,module,exports){

var indexOf = [].indexOf;

module.exports = function(arr, obj){
  if (indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
},{}],66:[function(_dereq_,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}

},{}],67:[function(_dereq_,module,exports){
var containers = []; // will store container HTMLElement references
var styleElements = []; // will store {prepend: HTMLElement, append: HTMLElement}

var usage = 'insert-css: You need to provide a CSS string. Usage: insertCss(cssString[, options]).';

function insertCss(css, options) {
    options = options || {};

    if (css === undefined) {
        throw new Error(usage);
    }

    var position = options.prepend === true ? 'prepend' : 'append';
    var container = options.container !== undefined ? options.container : document.querySelector('head');
    var containerId = containers.indexOf(container);

    // first time we see this container, create the necessary entries
    if (containerId === -1) {
        containerId = containers.push(container) - 1;
        styleElements[containerId] = {};
    }

    // try to get the correponding container + position styleElement, create it otherwise
    var styleElement;

    if (styleElements[containerId] !== undefined && styleElements[containerId][position] !== undefined) {
        styleElement = styleElements[containerId][position];
    } else {
        styleElement = styleElements[containerId][position] = createStyleElement();

        if (position === 'prepend') {
            container.insertBefore(styleElement, container.childNodes[0]);
        } else {
            container.appendChild(styleElement);
        }
    }

    // strip potential UTF-8 BOM if css was read from a file
    if (css.charCodeAt(0) === 0xFEFF) { css = css.substr(1, css.length); }

    // actually add the stylesheet
    if (styleElement.styleSheet) {
        styleElement.styleSheet.cssText += css
    } else {
        styleElement.textContent += css;
    }

    return styleElement;
};

function createStyleElement() {
    var styleElement = document.createElement('style');
    styleElement.setAttribute('type', 'text/css');
    return styleElement;
}

module.exports = insertCss;
module.exports.insertCss = insertCss;

},{}],68:[function(_dereq_,module,exports){
/*! npm.im/intervalometer */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function intervalometer(cb, request, cancel, requestParameter) {
	var requestId;
	var previousLoopTime;
	function loop(now) {
		// Must be requested before cb() because that might call .stop()
		requestId = request(loop, requestParameter);

		// Called with "ms since last call". 0 on start()
		cb(now - (previousLoopTime || now));

		previousLoopTime = now;
	}

	return {
		start: function start() {
			if (!requestId) { // Prevent double starts
				loop(0);
			}
		},
		stop: function stop() {
			cancel(requestId);
			requestId = null;
			previousLoopTime = 0;
		}
	};
}

function frameIntervalometer(cb) {
	return intervalometer(cb, requestAnimationFrame, cancelAnimationFrame);
}

function timerIntervalometer(cb, delay) {
	return intervalometer(cb, setTimeout, clearTimeout, delay);
}

exports.intervalometer = intervalometer;
exports.frameIntervalometer = frameIntervalometer;
exports.timerIntervalometer = timerIntervalometer;
},{}],69:[function(_dereq_,module,exports){
/*! npm.im/iphone-inline-video 2.2.2 */
'use strict';

var intervalometer = _dereq_('intervalometer');

function preventEvent(element, eventName, test) {
	function handler(e) {
		if (!test || test(element, eventName)) {
			e.stopImmediatePropagation();
			// // console.log(eventName, 'prevented on', element);
		}
	}
	element.addEventListener(eventName, handler);

	// Return handler to allow to disable the prevention. Usage:
	// const preventionHandler = preventEvent(el, 'click');
	// el.removeEventHandler('click', preventionHandler);
	return handler;
}

function proxyProperty(object, propertyName, sourceObject, copyFirst) {
	function get() {
		return sourceObject[propertyName];
	}
	function set(value) {
		sourceObject[propertyName] = value;
	}

	if (copyFirst) {
		set(object[propertyName]);
	}

	Object.defineProperty(object, propertyName, {get: get, set: set});
}

function proxyEvent(object, eventName, sourceObject) {
	sourceObject.addEventListener(eventName, function () { return object.dispatchEvent(new Event(eventName)); });
}

function dispatchEventAsync(element, type) {
	Promise.resolve().then(function () {
		element.dispatchEvent(new Event(type));
	});
}

var iOS8or9 = typeof document === 'object' && 'object-fit' in document.head.style && !matchMedia('(-webkit-video-playable-inline)').matches;

var IIV = 'bfred-it:iphone-inline-video';
var IIVEvent = 'bfred-it:iphone-inline-video:event';
var IIVPlay = 'bfred-it:iphone-inline-video:nativeplay';
var IIVPause = 'bfred-it:iphone-inline-video:nativepause';

/**
 * UTILS
 */

function getAudioFromVideo(video) {
	var audio = new Audio();
	proxyEvent(video, 'play', audio);
	proxyEvent(video, 'playing', audio);
	proxyEvent(video, 'pause', audio);
	audio.crossOrigin = video.crossOrigin;

	// 'data:' causes audio.networkState > 0
	// which then allows to keep <audio> in a resumable playing state
	// i.e. once you set a real src it will keep playing if it was if .play() was called
	audio.src = video.src || video.currentSrc || 'data:';

	// // if (audio.src === 'data:') {
	//   TODO: wait for video to be selected
	// // }
	return audio;
}

var lastRequests = [];
var requestIndex = 0;
var lastTimeupdateEvent;

function setTime(video, time, rememberOnly) {
	// Allow one timeupdate event every 200+ ms
	if ((lastTimeupdateEvent || 0) + 200 < Date.now()) {
		video[IIVEvent] = true;
		lastTimeupdateEvent = Date.now();
	}
	if (!rememberOnly) {
		video.currentTime = time;
	}
	lastRequests[++requestIndex % 3] = time * 100 | 0 / 100;
}

function isPlayerEnded(player) {
	return player.driver.currentTime >= player.video.duration;
}

function update(timeDiff) {
	var player = this;
	// // console.log('update', player.video.readyState, player.video.networkState, player.driver.readyState, player.driver.networkState, player.driver.paused);
	if (player.video.readyState >= player.video.HAVE_FUTURE_DATA) {
		if (!player.hasAudio) {
			player.driver.currentTime = player.video.currentTime + ((timeDiff * player.video.playbackRate) / 1000);
			if (player.video.loop && isPlayerEnded(player)) {
				player.driver.currentTime = 0;
			}
		}
		setTime(player.video, player.driver.currentTime);
	} else if (player.video.networkState === player.video.NETWORK_IDLE && player.video.buffered.length === 0) {
		// This should happen when the source is available but:
		// - it's potentially playing (.paused === false)
		// - it's not ready to play
		// - it's not loading
		// If it hasAudio, that will be loaded in the 'emptied' handler below
		player.video.load();
		// // console.log('Will load');
	}

	// // console.assert(player.video.currentTime === player.driver.currentTime, 'Video not updating!');

	if (player.video.ended) {
		delete player.video[IIVEvent]; // Allow timeupdate event
		player.video.pause(true);
	}
}

/**
 * METHODS
 */

function play() {
	// // console.log('play');
	var video = this;
	var player = video[IIV];

	// If it's fullscreen, use the native player
	if (video.webkitDisplayingFullscreen) {
		video[IIVPlay]();
		return;
	}

	if (player.driver.src !== 'data:' && player.driver.src !== video.src) {
		// // console.log('src changed on play', video.src);
		setTime(video, 0, true);
		player.driver.src = video.src;
	}

	if (!video.paused) {
		return;
	}
	player.paused = false;

	if (video.buffered.length === 0) {
		// .load() causes the emptied event
		// the alternative is .play()+.pause() but that triggers play/pause events, even worse
		// possibly the alternative is preventing this event only once
		video.load();
	}

	player.driver.play();
	player.updater.start();

	if (!player.hasAudio) {
		dispatchEventAsync(video, 'play');
		if (player.video.readyState >= player.video.HAVE_ENOUGH_DATA) {
			// // console.log('onplay');
			dispatchEventAsync(video, 'playing');
		}
	}
}
function pause(forceEvents) {
	// // console.log('pause');
	var video = this;
	var player = video[IIV];

	player.driver.pause();
	player.updater.stop();

	// If it's fullscreen, the developer the native player.pause()
	// This is at the end of pause() because it also
	// needs to make sure that the simulation is paused
	if (video.webkitDisplayingFullscreen) {
		video[IIVPause]();
	}

	if (player.paused && !forceEvents) {
		return;
	}

	player.paused = true;
	if (!player.hasAudio) {
		dispatchEventAsync(video, 'pause');
	}

	// Handle the 'ended' event only if it's not fullscreen
	if (video.ended && !video.webkitDisplayingFullscreen) {
		video[IIVEvent] = true;
		dispatchEventAsync(video, 'ended');
	}
}

/**
 * SETUP
 */

function addPlayer(video, hasAudio) {
	var player = {};
	video[IIV] = player;
	player.paused = true; // Track whether 'pause' events have been fired
	player.hasAudio = hasAudio;
	player.video = video;
	player.updater = intervalometer.frameIntervalometer(update.bind(player));

	if (hasAudio) {
		player.driver = getAudioFromVideo(video);
	} else {
		video.addEventListener('canplay', function () {
			if (!video.paused) {
				// // console.log('oncanplay');
				dispatchEventAsync(video, 'playing');
			}
		});
		player.driver = {
			src: video.src || video.currentSrc || 'data:',
			muted: true,
			paused: true,
			pause: function () {
				player.driver.paused = true;
			},
			play: function () {
				player.driver.paused = false;
				// Media automatically goes to 0 if .play() is called when it's done
				if (isPlayerEnded(player)) {
					setTime(video, 0);
				}
			},
			get ended() {
				return isPlayerEnded(player);
			}
		};
	}

	// .load() causes the emptied event
	video.addEventListener('emptied', function () {
		// // console.log('driver src is', player.driver.src);
		var wasEmpty = !player.driver.src || player.driver.src === 'data:';
		if (player.driver.src && player.driver.src !== video.src) {
			// // console.log('src changed to', video.src);
			setTime(video, 0, true);
			player.driver.src = video.src;
			// Playing videos will only keep playing if no src was present when .play()’ed
			if (wasEmpty || (!hasAudio && video.autoplay)) {
				player.driver.play();
			} else {
				player.updater.stop();
			}
		}
	}, false);

	// Stop programmatic player when OS takes over
	video.addEventListener('webkitbeginfullscreen', function () {
		if (!video.paused) {
			// Make sure that the <audio> and the syncer/updater are stopped
			video.pause();

			// Play video natively
			video[IIVPlay]();
		} else if (hasAudio && player.driver.buffered.length === 0) {
			// If the first play is native,
			// the <audio> needs to be buffered manually
			// so when the fullscreen ends, it can be set to the same current time
			player.driver.load();
		}
	});
	if (hasAudio) {
		video.addEventListener('webkitendfullscreen', function () {
			// Sync audio to new video position
			player.driver.currentTime = video.currentTime;
			// // console.assert(player.driver.currentTime === video.currentTime, 'Audio not synced');
		});

		// Allow seeking
		video.addEventListener('seeking', function () {
			if (lastRequests.indexOf(video.currentTime * 100 | 0 / 100) < 0) {
				// // console.log('User-requested seeking');
				player.driver.currentTime = video.currentTime;
			}
		});
	}
}

function preventWithPropOrFullscreen(el) {
	var isAllowed = el[IIVEvent];
	delete el[IIVEvent];
	return !el.webkitDisplayingFullscreen && !isAllowed;
}

function overloadAPI(video) {
	var player = video[IIV];
	video[IIVPlay] = video.play;
	video[IIVPause] = video.pause;
	video.play = play;
	video.pause = pause;
	proxyProperty(video, 'paused', player.driver);
	proxyProperty(video, 'muted', player.driver, true);
	proxyProperty(video, 'playbackRate', player.driver, true);
	proxyProperty(video, 'ended', player.driver);
	proxyProperty(video, 'loop', player.driver, true);

	// IIV works by seeking 60 times per second.
	// These events are now useless.
	preventEvent(video, 'seeking', function (el) { return !el.webkitDisplayingFullscreen; });
	preventEvent(video, 'seeked', function (el) { return !el.webkitDisplayingFullscreen; });

	// Limit timeupdate events
	preventEvent(video, 'timeupdate', preventWithPropOrFullscreen);

	// Prevent occasional native ended events
	preventEvent(video, 'ended', preventWithPropOrFullscreen);
}

function enableInlineVideo(video, opts) {
	if ( opts === void 0 ) opts = {};

	// Stop if already enabled
	if (video[IIV]) {
		return;
	}

	// Allow the user to skip detection
	if (!opts.everywhere) {
		// Only iOS8 and 9 are supported
		if (!iOS8or9) {
			return;
		}

		// Stop if it's not an allowed device
		if (!(opts.iPad || opts.ipad ? /iPhone|iPod|iPad/ : /iPhone|iPod/).test(navigator.userAgent)) {
			return;
		}
	}

	// Try to pause
	video.pause();

	// Prevent autoplay.
	// An non-started autoplaying video can't be .pause()'d
	var willAutoplay = video.autoplay;
	video.autoplay = false;

	addPlayer(video, !video.muted);
	overloadAPI(video);
	video.classList.add('IIV');

	// Autoplay
	if (video.muted && willAutoplay) {
		video.play();
		video.addEventListener('playing', function restoreAutoplay() {
			video.autoplay = true;
			video.removeEventListener('playing', restoreAutoplay);
		});
	}

	if (!/iPhone|iPod|iPad/.test(navigator.platform)) {
		console.warn('iphone-inline-video is not guaranteed to work in emulated environments');
	}
}

module.exports = enableInlineVideo;

},{"intervalometer":68}],70:[function(_dereq_,module,exports){
'use strict';

module.exports = Number.isFinite || function (value) {
	return !(typeof value !== 'number' || value !== value || value === Infinity || value === -Infinity);
};

},{}],71:[function(_dereq_,module,exports){
module.exports = isPowerOfTwo

function isPowerOfTwo(n) {
  return n !== 0 && (n & (n - 1)) === 0
}
},{}],72:[function(_dereq_,module,exports){
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],73:[function(_dereq_,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

"use strict";

/**
 * Constructs an enumeration with keys equal to their value.
 *
 * For example:
 *
 *   var COLORS = keyMirror({blue: null, red: null});
 *   var myColor = COLORS.blue;
 *   var isColorValid = !!COLORS[myColor];
 *
 * The last line could not be performed if the values of the generated enum were
 * not equal to their keys.
 *
 *   Input:  {key1: val1, key2: val2}
 *   Output: {key1: key1, key2: key2}
 *
 * @param {object} obj
 * @return {object}
 */
var keyMirror = function(obj) {
  var ret = {};
  var key;
  if (!(obj instanceof Object && !Array.isArray(obj))) {
    throw new Error('keyMirror(...): Argument must be an object.');
  }
  for (key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }
    ret[key] = key;
  }
  return ret;
};

module.exports = keyMirror;

},{}],74:[function(_dereq_,module,exports){
'use strict';
var numberIsFinite = _dereq_('is-finite');

module.exports = Number.isInteger || function (x) {
	return numberIsFinite(x) && Math.floor(x) === x;
};

},{"is-finite":70}],75:[function(_dereq_,module,exports){
(function (global){(function (){
var hasMap = typeof Map === 'function' && Map.prototype;
var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, 'size') : null;
var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === 'function' ? mapSizeDescriptor.get : null;
var mapForEach = hasMap && Map.prototype.forEach;
var hasSet = typeof Set === 'function' && Set.prototype;
var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, 'size') : null;
var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === 'function' ? setSizeDescriptor.get : null;
var setForEach = hasSet && Set.prototype.forEach;
var hasWeakMap = typeof WeakMap === 'function' && WeakMap.prototype;
var weakMapHas = hasWeakMap ? WeakMap.prototype.has : null;
var hasWeakSet = typeof WeakSet === 'function' && WeakSet.prototype;
var weakSetHas = hasWeakSet ? WeakSet.prototype.has : null;
var hasWeakRef = typeof WeakRef === 'function' && WeakRef.prototype;
var weakRefDeref = hasWeakRef ? WeakRef.prototype.deref : null;
var booleanValueOf = Boolean.prototype.valueOf;
var objectToString = Object.prototype.toString;
var functionToString = Function.prototype.toString;
var $match = String.prototype.match;
var $slice = String.prototype.slice;
var $replace = String.prototype.replace;
var $toUpperCase = String.prototype.toUpperCase;
var $toLowerCase = String.prototype.toLowerCase;
var $test = RegExp.prototype.test;
var $concat = Array.prototype.concat;
var $join = Array.prototype.join;
var $arrSlice = Array.prototype.slice;
var $floor = Math.floor;
var bigIntValueOf = typeof BigInt === 'function' ? BigInt.prototype.valueOf : null;
var gOPS = Object.getOwnPropertySymbols;
var symToString = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? Symbol.prototype.toString : null;
var hasShammedSymbols = typeof Symbol === 'function' && typeof Symbol.iterator === 'object';
// ie, `has-tostringtag/shams
var toStringTag = typeof Symbol === 'function' && Symbol.toStringTag && (typeof Symbol.toStringTag === hasShammedSymbols ? 'object' : 'symbol')
    ? Symbol.toStringTag
    : null;
var isEnumerable = Object.prototype.propertyIsEnumerable;

var gPO = (typeof Reflect === 'function' ? Reflect.getPrototypeOf : Object.getPrototypeOf) || (
    [].__proto__ === Array.prototype // eslint-disable-line no-proto
        ? function (O) {
            return O.__proto__; // eslint-disable-line no-proto
        }
        : null
);

function addNumericSeparator(num, str) {
    if (
        num === Infinity
        || num === -Infinity
        || num !== num
        || (num && num > -1000 && num < 1000)
        || $test.call(/e/, str)
    ) {
        return str;
    }
    var sepRegex = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
    if (typeof num === 'number') {
        var int = num < 0 ? -$floor(-num) : $floor(num); // trunc(num)
        if (int !== num) {
            var intStr = String(int);
            var dec = $slice.call(str, intStr.length + 1);
            return $replace.call(intStr, sepRegex, '$&_') + '.' + $replace.call($replace.call(dec, /([0-9]{3})/g, '$&_'), /_$/, '');
        }
    }
    return $replace.call(str, sepRegex, '$&_');
}

var utilInspect = _dereq_('./util.inspect');
var inspectCustom = utilInspect.custom;
var inspectSymbol = isSymbol(inspectCustom) ? inspectCustom : null;

module.exports = function inspect_(obj, options, depth, seen) {
    var opts = options || {};

    if (has(opts, 'quoteStyle') && (opts.quoteStyle !== 'single' && opts.quoteStyle !== 'double')) {
        throw new TypeError('option "quoteStyle" must be "single" or "double"');
    }
    if (
        has(opts, 'maxStringLength') && (typeof opts.maxStringLength === 'number'
            ? opts.maxStringLength < 0 && opts.maxStringLength !== Infinity
            : opts.maxStringLength !== null
        )
    ) {
        throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
    }
    var customInspect = has(opts, 'customInspect') ? opts.customInspect : true;
    if (typeof customInspect !== 'boolean' && customInspect !== 'symbol') {
        throw new TypeError('option "customInspect", if provided, must be `true`, `false`, or `\'symbol\'`');
    }

    if (
        has(opts, 'indent')
        && opts.indent !== null
        && opts.indent !== '\t'
        && !(parseInt(opts.indent, 10) === opts.indent && opts.indent > 0)
    ) {
        throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
    }
    if (has(opts, 'numericSeparator') && typeof opts.numericSeparator !== 'boolean') {
        throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');
    }
    var numericSeparator = opts.numericSeparator;

    if (typeof obj === 'undefined') {
        return 'undefined';
    }
    if (obj === null) {
        return 'null';
    }
    if (typeof obj === 'boolean') {
        return obj ? 'true' : 'false';
    }

    if (typeof obj === 'string') {
        return inspectString(obj, opts);
    }
    if (typeof obj === 'number') {
        if (obj === 0) {
            return Infinity / obj > 0 ? '0' : '-0';
        }
        var str = String(obj);
        return numericSeparator ? addNumericSeparator(obj, str) : str;
    }
    if (typeof obj === 'bigint') {
        var bigIntStr = String(obj) + 'n';
        return numericSeparator ? addNumericSeparator(obj, bigIntStr) : bigIntStr;
    }

    var maxDepth = typeof opts.depth === 'undefined' ? 5 : opts.depth;
    if (typeof depth === 'undefined') { depth = 0; }
    if (depth >= maxDepth && maxDepth > 0 && typeof obj === 'object') {
        return isArray(obj) ? '[Array]' : '[Object]';
    }

    var indent = getIndent(opts, depth);

    if (typeof seen === 'undefined') {
        seen = [];
    } else if (indexOf(seen, obj) >= 0) {
        return '[Circular]';
    }

    function inspect(value, from, noIndent) {
        if (from) {
            seen = $arrSlice.call(seen);
            seen.push(from);
        }
        if (noIndent) {
            var newOpts = {
                depth: opts.depth
            };
            if (has(opts, 'quoteStyle')) {
                newOpts.quoteStyle = opts.quoteStyle;
            }
            return inspect_(value, newOpts, depth + 1, seen);
        }
        return inspect_(value, opts, depth + 1, seen);
    }

    if (typeof obj === 'function' && !isRegExp(obj)) { // in older engines, regexes are callable
        var name = nameOf(obj);
        var keys = arrObjKeys(obj, inspect);
        return '[Function' + (name ? ': ' + name : ' (anonymous)') + ']' + (keys.length > 0 ? ' { ' + $join.call(keys, ', ') + ' }' : '');
    }
    if (isSymbol(obj)) {
        var symString = hasShammedSymbols ? $replace.call(String(obj), /^(Symbol\(.*\))_[^)]*$/, '$1') : symToString.call(obj);
        return typeof obj === 'object' && !hasShammedSymbols ? markBoxed(symString) : symString;
    }
    if (isElement(obj)) {
        var s = '<' + $toLowerCase.call(String(obj.nodeName));
        var attrs = obj.attributes || [];
        for (var i = 0; i < attrs.length; i++) {
            s += ' ' + attrs[i].name + '=' + wrapQuotes(quote(attrs[i].value), 'double', opts);
        }
        s += '>';
        if (obj.childNodes && obj.childNodes.length) { s += '...'; }
        s += '</' + $toLowerCase.call(String(obj.nodeName)) + '>';
        return s;
    }
    if (isArray(obj)) {
        if (obj.length === 0) { return '[]'; }
        var xs = arrObjKeys(obj, inspect);
        if (indent && !singleLineValues(xs)) {
            return '[' + indentedJoin(xs, indent) + ']';
        }
        return '[ ' + $join.call(xs, ', ') + ' ]';
    }
    if (isError(obj)) {
        var parts = arrObjKeys(obj, inspect);
        if (!('cause' in Error.prototype) && 'cause' in obj && !isEnumerable.call(obj, 'cause')) {
            return '{ [' + String(obj) + '] ' + $join.call($concat.call('[cause]: ' + inspect(obj.cause), parts), ', ') + ' }';
        }
        if (parts.length === 0) { return '[' + String(obj) + ']'; }
        return '{ [' + String(obj) + '] ' + $join.call(parts, ', ') + ' }';
    }
    if (typeof obj === 'object' && customInspect) {
        if (inspectSymbol && typeof obj[inspectSymbol] === 'function' && utilInspect) {
            return utilInspect(obj, { depth: maxDepth - depth });
        } else if (customInspect !== 'symbol' && typeof obj.inspect === 'function') {
            return obj.inspect();
        }
    }
    if (isMap(obj)) {
        var mapParts = [];
        if (mapForEach) {
            mapForEach.call(obj, function (value, key) {
                mapParts.push(inspect(key, obj, true) + ' => ' + inspect(value, obj));
            });
        }
        return collectionOf('Map', mapSize.call(obj), mapParts, indent);
    }
    if (isSet(obj)) {
        var setParts = [];
        if (setForEach) {
            setForEach.call(obj, function (value) {
                setParts.push(inspect(value, obj));
            });
        }
        return collectionOf('Set', setSize.call(obj), setParts, indent);
    }
    if (isWeakMap(obj)) {
        return weakCollectionOf('WeakMap');
    }
    if (isWeakSet(obj)) {
        return weakCollectionOf('WeakSet');
    }
    if (isWeakRef(obj)) {
        return weakCollectionOf('WeakRef');
    }
    if (isNumber(obj)) {
        return markBoxed(inspect(Number(obj)));
    }
    if (isBigInt(obj)) {
        return markBoxed(inspect(bigIntValueOf.call(obj)));
    }
    if (isBoolean(obj)) {
        return markBoxed(booleanValueOf.call(obj));
    }
    if (isString(obj)) {
        return markBoxed(inspect(String(obj)));
    }
    // note: in IE 8, sometimes `global !== window` but both are the prototypes of each other
    /* eslint-env browser */
    if (typeof window !== 'undefined' && obj === window) {
        return '{ [object Window] }';
    }
    if (
        (typeof globalThis !== 'undefined' && obj === globalThis)
        || (typeof global !== 'undefined' && obj === global)
    ) {
        return '{ [object globalThis] }';
    }
    if (!isDate(obj) && !isRegExp(obj)) {
        var ys = arrObjKeys(obj, inspect);
        var isPlainObject = gPO ? gPO(obj) === Object.prototype : obj instanceof Object || obj.constructor === Object;
        var protoTag = obj instanceof Object ? '' : 'null prototype';
        var stringTag = !isPlainObject && toStringTag && Object(obj) === obj && toStringTag in obj ? $slice.call(toStr(obj), 8, -1) : protoTag ? 'Object' : '';
        var constructorTag = isPlainObject || typeof obj.constructor !== 'function' ? '' : obj.constructor.name ? obj.constructor.name + ' ' : '';
        var tag = constructorTag + (stringTag || protoTag ? '[' + $join.call($concat.call([], stringTag || [], protoTag || []), ': ') + '] ' : '');
        if (ys.length === 0) { return tag + '{}'; }
        if (indent) {
            return tag + '{' + indentedJoin(ys, indent) + '}';
        }
        return tag + '{ ' + $join.call(ys, ', ') + ' }';
    }
    return String(obj);
};

function wrapQuotes(s, defaultStyle, opts) {
    var quoteChar = (opts.quoteStyle || defaultStyle) === 'double' ? '"' : "'";
    return quoteChar + s + quoteChar;
}

function quote(s) {
    return $replace.call(String(s), /"/g, '&quot;');
}

function isArray(obj) { return toStr(obj) === '[object Array]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isDate(obj) { return toStr(obj) === '[object Date]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isRegExp(obj) { return toStr(obj) === '[object RegExp]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isError(obj) { return toStr(obj) === '[object Error]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isString(obj) { return toStr(obj) === '[object String]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isNumber(obj) { return toStr(obj) === '[object Number]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isBoolean(obj) { return toStr(obj) === '[object Boolean]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }

// Symbol and BigInt do have Symbol.toStringTag by spec, so that can't be used to eliminate false positives
function isSymbol(obj) {
    if (hasShammedSymbols) {
        return obj && typeof obj === 'object' && obj instanceof Symbol;
    }
    if (typeof obj === 'symbol') {
        return true;
    }
    if (!obj || typeof obj !== 'object' || !symToString) {
        return false;
    }
    try {
        symToString.call(obj);
        return true;
    } catch (e) {}
    return false;
}

function isBigInt(obj) {
    if (!obj || typeof obj !== 'object' || !bigIntValueOf) {
        return false;
    }
    try {
        bigIntValueOf.call(obj);
        return true;
    } catch (e) {}
    return false;
}

var hasOwn = Object.prototype.hasOwnProperty || function (key) { return key in this; };
function has(obj, key) {
    return hasOwn.call(obj, key);
}

function toStr(obj) {
    return objectToString.call(obj);
}

function nameOf(f) {
    if (f.name) { return f.name; }
    var m = $match.call(functionToString.call(f), /^function\s*([\w$]+)/);
    if (m) { return m[1]; }
    return null;
}

function indexOf(xs, x) {
    if (xs.indexOf) { return xs.indexOf(x); }
    for (var i = 0, l = xs.length; i < l; i++) {
        if (xs[i] === x) { return i; }
    }
    return -1;
}

function isMap(x) {
    if (!mapSize || !x || typeof x !== 'object') {
        return false;
    }
    try {
        mapSize.call(x);
        try {
            setSize.call(x);
        } catch (s) {
            return true;
        }
        return x instanceof Map; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isWeakMap(x) {
    if (!weakMapHas || !x || typeof x !== 'object') {
        return false;
    }
    try {
        weakMapHas.call(x, weakMapHas);
        try {
            weakSetHas.call(x, weakSetHas);
        } catch (s) {
            return true;
        }
        return x instanceof WeakMap; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isWeakRef(x) {
    if (!weakRefDeref || !x || typeof x !== 'object') {
        return false;
    }
    try {
        weakRefDeref.call(x);
        return true;
    } catch (e) {}
    return false;
}

function isSet(x) {
    if (!setSize || !x || typeof x !== 'object') {
        return false;
    }
    try {
        setSize.call(x);
        try {
            mapSize.call(x);
        } catch (m) {
            return true;
        }
        return x instanceof Set; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isWeakSet(x) {
    if (!weakSetHas || !x || typeof x !== 'object') {
        return false;
    }
    try {
        weakSetHas.call(x, weakSetHas);
        try {
            weakMapHas.call(x, weakMapHas);
        } catch (s) {
            return true;
        }
        return x instanceof WeakSet; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isElement(x) {
    if (!x || typeof x !== 'object') { return false; }
    if (typeof HTMLElement !== 'undefined' && x instanceof HTMLElement) {
        return true;
    }
    return typeof x.nodeName === 'string' && typeof x.getAttribute === 'function';
}

function inspectString(str, opts) {
    if (str.length > opts.maxStringLength) {
        var remaining = str.length - opts.maxStringLength;
        var trailer = '... ' + remaining + ' more character' + (remaining > 1 ? 's' : '');
        return inspectString($slice.call(str, 0, opts.maxStringLength), opts) + trailer;
    }
    // eslint-disable-next-line no-control-regex
    var s = $replace.call($replace.call(str, /(['\\])/g, '\\$1'), /[\x00-\x1f]/g, lowbyte);
    return wrapQuotes(s, 'single', opts);
}

function lowbyte(c) {
    var n = c.charCodeAt(0);
    var x = {
        8: 'b',
        9: 't',
        10: 'n',
        12: 'f',
        13: 'r'
    }[n];
    if (x) { return '\\' + x; }
    return '\\x' + (n < 0x10 ? '0' : '') + $toUpperCase.call(n.toString(16));
}

function markBoxed(str) {
    return 'Object(' + str + ')';
}

function weakCollectionOf(type) {
    return type + ' { ? }';
}

function collectionOf(type, size, entries, indent) {
    var joinedEntries = indent ? indentedJoin(entries, indent) : $join.call(entries, ', ');
    return type + ' (' + size + ') {' + joinedEntries + '}';
}

function singleLineValues(xs) {
    for (var i = 0; i < xs.length; i++) {
        if (indexOf(xs[i], '\n') >= 0) {
            return false;
        }
    }
    return true;
}

function getIndent(opts, depth) {
    var baseIndent;
    if (opts.indent === '\t') {
        baseIndent = '\t';
    } else if (typeof opts.indent === 'number' && opts.indent > 0) {
        baseIndent = $join.call(Array(opts.indent + 1), ' ');
    } else {
        return null;
    }
    return {
        base: baseIndent,
        prev: $join.call(Array(depth + 1), baseIndent)
    };
}

function indentedJoin(xs, indent) {
    if (xs.length === 0) { return ''; }
    var lineJoiner = '\n' + indent.prev + indent.base;
    return lineJoiner + $join.call(xs, ',' + lineJoiner) + '\n' + indent.prev;
}

function arrObjKeys(obj, inspect) {
    var isArr = isArray(obj);
    var xs = [];
    if (isArr) {
        xs.length = obj.length;
        for (var i = 0; i < obj.length; i++) {
            xs[i] = has(obj, i) ? inspect(obj[i], obj) : '';
        }
    }
    var syms = typeof gOPS === 'function' ? gOPS(obj) : [];
    var symMap;
    if (hasShammedSymbols) {
        symMap = {};
        for (var k = 0; k < syms.length; k++) {
            symMap['$' + syms[k]] = syms[k];
        }
    }

    for (var key in obj) { // eslint-disable-line no-restricted-syntax
        if (!has(obj, key)) { continue; } // eslint-disable-line no-restricted-syntax, no-continue
        if (isArr && String(Number(key)) === key && key < obj.length) { continue; } // eslint-disable-line no-restricted-syntax, no-continue
        if (hasShammedSymbols && symMap['$' + key] instanceof Symbol) {
            // this is to prevent shammed Symbols, which are stored as strings, from being included in the string key section
            continue; // eslint-disable-line no-restricted-syntax, no-continue
        } else if ($test.call(/[^\w$]/, key)) {
            xs.push(inspect(key, obj) + ': ' + inspect(obj[key], obj));
        } else {
            xs.push(key + ': ' + inspect(obj[key], obj));
        }
    }
    if (typeof gOPS === 'function') {
        for (var j = 0; j < syms.length; j++) {
            if (isEnumerable.call(obj, syms[j])) {
                xs.push('[' + inspect(syms[j]) + ']: ' + inspect(obj[syms[j]], obj));
            }
        }
    }
    return xs;
}

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./util.inspect":16}],76:[function(_dereq_,module,exports){
var wrappy = _dereq_('wrappy')
module.exports = wrappy(once)
module.exports.strict = wrappy(onceStrict)

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })

  Object.defineProperty(Function.prototype, 'onceStrict', {
    value: function () {
      return onceStrict(this)
    },
    configurable: true
  })
})

function once (fn) {
  var f = function () {
    if (f.called) return f.value
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  f.called = false
  return f
}

function onceStrict (fn) {
  var f = function () {
    if (f.called)
      throw new Error(f.onceError)
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  var name = fn.name || 'Function wrapped with `once`'
  f.onceError = name + " shouldn't be called more than once"
  f.called = false
  return f
}

},{"wrappy":115}],77:[function(_dereq_,module,exports){
(function (process){(function (){
// Generated by CoffeeScript 1.12.2
(function() {
  var getNanoSeconds, hrtime, loadTime, moduleLoadTime, nodeLoadTime, upTime;

  if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
    module.exports = function() {
      return performance.now();
    };
  } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
    module.exports = function() {
      return (getNanoSeconds() - nodeLoadTime) / 1e6;
    };
    hrtime = process.hrtime;
    getNanoSeconds = function() {
      var hr;
      hr = hrtime();
      return hr[0] * 1e9 + hr[1];
    };
    moduleLoadTime = getNanoSeconds();
    upTime = process.uptime() * 1e9;
    nodeLoadTime = moduleLoadTime - upTime;
  } else if (Date.now) {
    module.exports = function() {
      return Date.now() - loadTime;
    };
    loadTime = Date.now();
  } else {
    module.exports = function() {
      return new Date().getTime() - loadTime;
    };
    loadTime = new Date().getTime();
  }

}).call(this);



}).call(this)}).call(this,_dereq_('_process'))
},{"_process":79}],78:[function(_dereq_,module,exports){
(function (process){(function (){
'use strict';

if (typeof process === 'undefined' ||
    !process.version ||
    process.version.indexOf('v0.') === 0 ||
    process.version.indexOf('v1.') === 0 && process.version.indexOf('v1.8.') !== 0) {
  module.exports = { nextTick: nextTick };
} else {
  module.exports = process
}

function nextTick(fn, arg1, arg2, arg3) {
  if (typeof fn !== 'function') {
    throw new TypeError('"callback" argument must be a function');
  }
  var len = arguments.length;
  var args, i;
  switch (len) {
  case 0:
  case 1:
    return process.nextTick(fn);
  case 2:
    return process.nextTick(function afterTickOne() {
      fn.call(null, arg1);
    });
  case 3:
    return process.nextTick(function afterTickTwo() {
      fn.call(null, arg1, arg2);
    });
  case 4:
    return process.nextTick(function afterTickThree() {
      fn.call(null, arg1, arg2, arg3);
    });
  default:
    args = new Array(len - 1);
    i = 0;
    while (i < args.length) {
      args[i++] = arguments[i];
    }
    return process.nextTick(function afterTick() {
      fn.apply(null, args);
    });
  }
}


}).call(this)}).call(this,_dereq_('_process'))
},{"_process":79}],79:[function(_dereq_,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],80:[function(_dereq_,module,exports){
'use strict';

var replace = String.prototype.replace;
var percentTwenties = /%20/g;

var Format = {
    RFC1738: 'RFC1738',
    RFC3986: 'RFC3986'
};

module.exports = {
    'default': Format.RFC3986,
    formatters: {
        RFC1738: function (value) {
            return replace.call(value, percentTwenties, '+');
        },
        RFC3986: function (value) {
            return String(value);
        }
    },
    RFC1738: Format.RFC1738,
    RFC3986: Format.RFC3986
};

},{}],81:[function(_dereq_,module,exports){
'use strict';

var stringify = _dereq_('./stringify');
var parse = _dereq_('./parse');
var formats = _dereq_('./formats');

module.exports = {
    formats: formats,
    parse: parse,
    stringify: stringify
};

},{"./formats":80,"./parse":82,"./stringify":83}],82:[function(_dereq_,module,exports){
'use strict';

var utils = _dereq_('./utils');

var has = Object.prototype.hasOwnProperty;
var isArray = Array.isArray;

var defaults = {
    allowDots: false,
    allowPrototypes: false,
    allowSparse: false,
    arrayLimit: 20,
    charset: 'utf-8',
    charsetSentinel: false,
    comma: false,
    decoder: utils.decode,
    delimiter: '&',
    depth: 5,
    ignoreQueryPrefix: false,
    interpretNumericEntities: false,
    parameterLimit: 1000,
    parseArrays: true,
    plainObjects: false,
    strictNullHandling: false
};

var interpretNumericEntities = function (str) {
    return str.replace(/&#(\d+);/g, function ($0, numberStr) {
        return String.fromCharCode(parseInt(numberStr, 10));
    });
};

var parseArrayValue = function (val, options) {
    if (val && typeof val === 'string' && options.comma && val.indexOf(',') > -1) {
        return val.split(',');
    }

    return val;
};

// This is what browsers will submit when the ✓ character occurs in an
// application/x-www-form-urlencoded body and the encoding of the page containing
// the form is iso-8859-1, or when the submitted form has an accept-charset
// attribute of iso-8859-1. Presumably also with other charsets that do not contain
// the ✓ character, such as us-ascii.
var isoSentinel = 'utf8=%26%2310003%3B'; // encodeURIComponent('&#10003;')

// These are the percent-encoded utf-8 octets representing a checkmark, indicating that the request actually is utf-8 encoded.
var charsetSentinel = 'utf8=%E2%9C%93'; // encodeURIComponent('✓')

var parseValues = function parseQueryStringValues(str, options) {
    var obj = {};
    var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, '') : str;
    var limit = options.parameterLimit === Infinity ? undefined : options.parameterLimit;
    var parts = cleanStr.split(options.delimiter, limit);
    var skipIndex = -1; // Keep track of where the utf8 sentinel was found
    var i;

    var charset = options.charset;
    if (options.charsetSentinel) {
        for (i = 0; i < parts.length; ++i) {
            if (parts[i].indexOf('utf8=') === 0) {
                if (parts[i] === charsetSentinel) {
                    charset = 'utf-8';
                } else if (parts[i] === isoSentinel) {
                    charset = 'iso-8859-1';
                }
                skipIndex = i;
                i = parts.length; // The eslint settings do not allow break;
            }
        }
    }

    for (i = 0; i < parts.length; ++i) {
        if (i === skipIndex) {
            continue;
        }
        var part = parts[i];

        var bracketEqualsPos = part.indexOf(']=');
        var pos = bracketEqualsPos === -1 ? part.indexOf('=') : bracketEqualsPos + 1;

        var key, val;
        if (pos === -1) {
            key = options.decoder(part, defaults.decoder, charset, 'key');
            val = options.strictNullHandling ? null : '';
        } else {
            key = options.decoder(part.slice(0, pos), defaults.decoder, charset, 'key');
            val = utils.maybeMap(
                parseArrayValue(part.slice(pos + 1), options),
                function (encodedVal) {
                    return options.decoder(encodedVal, defaults.decoder, charset, 'value');
                }
            );
        }

        if (val && options.interpretNumericEntities && charset === 'iso-8859-1') {
            val = interpretNumericEntities(val);
        }

        if (part.indexOf('[]=') > -1) {
            val = isArray(val) ? [val] : val;
        }

        if (has.call(obj, key)) {
            obj[key] = utils.combine(obj[key], val);
        } else {
            obj[key] = val;
        }
    }

    return obj;
};

var parseObject = function (chain, val, options, valuesParsed) {
    var leaf = valuesParsed ? val : parseArrayValue(val, options);

    for (var i = chain.length - 1; i >= 0; --i) {
        var obj;
        var root = chain[i];

        if (root === '[]' && options.parseArrays) {
            obj = [].concat(leaf);
        } else {
            obj = options.plainObjects ? Object.create(null) : {};
            var cleanRoot = root.charAt(0) === '[' && root.charAt(root.length - 1) === ']' ? root.slice(1, -1) : root;
            var index = parseInt(cleanRoot, 10);
            if (!options.parseArrays && cleanRoot === '') {
                obj = { 0: leaf };
            } else if (
                !isNaN(index)
                && root !== cleanRoot
                && String(index) === cleanRoot
                && index >= 0
                && (options.parseArrays && index <= options.arrayLimit)
            ) {
                obj = [];
                obj[index] = leaf;
            } else if (cleanRoot !== '__proto__') {
                obj[cleanRoot] = leaf;
            }
        }

        leaf = obj;
    }

    return leaf;
};

var parseKeys = function parseQueryStringKeys(givenKey, val, options, valuesParsed) {
    if (!givenKey) {
        return;
    }

    // Transform dot notation to bracket notation
    var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, '[$1]') : givenKey;

    // The regex chunks

    var brackets = /(\[[^[\]]*])/;
    var child = /(\[[^[\]]*])/g;

    // Get the parent

    var segment = options.depth > 0 && brackets.exec(key);
    var parent = segment ? key.slice(0, segment.index) : key;

    // Stash the parent if it exists

    var keys = [];
    if (parent) {
        // If we aren't using plain objects, optionally prefix keys that would overwrite object prototype properties
        if (!options.plainObjects && has.call(Object.prototype, parent)) {
            if (!options.allowPrototypes) {
                return;
            }
        }

        keys.push(parent);
    }

    // Loop through children appending to the array until we hit depth

    var i = 0;
    while (options.depth > 0 && (segment = child.exec(key)) !== null && i < options.depth) {
        i += 1;
        if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {
            if (!options.allowPrototypes) {
                return;
            }
        }
        keys.push(segment[1]);
    }

    // If there's a remainder, just add whatever is left

    if (segment) {
        keys.push('[' + key.slice(segment.index) + ']');
    }

    return parseObject(keys, val, options, valuesParsed);
};

var normalizeParseOptions = function normalizeParseOptions(opts) {
    if (!opts) {
        return defaults;
    }

    if (opts.decoder !== null && opts.decoder !== undefined && typeof opts.decoder !== 'function') {
        throw new TypeError('Decoder has to be a function.');
    }

    if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
        throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
    }
    var charset = typeof opts.charset === 'undefined' ? defaults.charset : opts.charset;

    return {
        allowDots: typeof opts.allowDots === 'undefined' ? defaults.allowDots : !!opts.allowDots,
        allowPrototypes: typeof opts.allowPrototypes === 'boolean' ? opts.allowPrototypes : defaults.allowPrototypes,
        allowSparse: typeof opts.allowSparse === 'boolean' ? opts.allowSparse : defaults.allowSparse,
        arrayLimit: typeof opts.arrayLimit === 'number' ? opts.arrayLimit : defaults.arrayLimit,
        charset: charset,
        charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,
        comma: typeof opts.comma === 'boolean' ? opts.comma : defaults.comma,
        decoder: typeof opts.decoder === 'function' ? opts.decoder : defaults.decoder,
        delimiter: typeof opts.delimiter === 'string' || utils.isRegExp(opts.delimiter) ? opts.delimiter : defaults.delimiter,
        // eslint-disable-next-line no-implicit-coercion, no-extra-parens
        depth: (typeof opts.depth === 'number' || opts.depth === false) ? +opts.depth : defaults.depth,
        ignoreQueryPrefix: opts.ignoreQueryPrefix === true,
        interpretNumericEntities: typeof opts.interpretNumericEntities === 'boolean' ? opts.interpretNumericEntities : defaults.interpretNumericEntities,
        parameterLimit: typeof opts.parameterLimit === 'number' ? opts.parameterLimit : defaults.parameterLimit,
        parseArrays: opts.parseArrays !== false,
        plainObjects: typeof opts.plainObjects === 'boolean' ? opts.plainObjects : defaults.plainObjects,
        strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling
    };
};

module.exports = function (str, opts) {
    var options = normalizeParseOptions(opts);

    if (str === '' || str === null || typeof str === 'undefined') {
        return options.plainObjects ? Object.create(null) : {};
    }

    var tempObj = typeof str === 'string' ? parseValues(str, options) : str;
    var obj = options.plainObjects ? Object.create(null) : {};

    // Iterate over the keys and setup the new object

    var keys = Object.keys(tempObj);
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var newObj = parseKeys(key, tempObj[key], options, typeof str === 'string');
        obj = utils.merge(obj, newObj, options);
    }

    if (options.allowSparse === true) {
        return obj;
    }

    return utils.compact(obj);
};

},{"./utils":84}],83:[function(_dereq_,module,exports){
'use strict';

var getSideChannel = _dereq_('side-channel');
var utils = _dereq_('./utils');
var formats = _dereq_('./formats');
var has = Object.prototype.hasOwnProperty;

var arrayPrefixGenerators = {
    brackets: function brackets(prefix) {
        return prefix + '[]';
    },
    comma: 'comma',
    indices: function indices(prefix, key) {
        return prefix + '[' + key + ']';
    },
    repeat: function repeat(prefix) {
        return prefix;
    }
};

var isArray = Array.isArray;
var split = String.prototype.split;
var push = Array.prototype.push;
var pushToArray = function (arr, valueOrArray) {
    push.apply(arr, isArray(valueOrArray) ? valueOrArray : [valueOrArray]);
};

var toISO = Date.prototype.toISOString;

var defaultFormat = formats['default'];
var defaults = {
    addQueryPrefix: false,
    allowDots: false,
    charset: 'utf-8',
    charsetSentinel: false,
    delimiter: '&',
    encode: true,
    encoder: utils.encode,
    encodeValuesOnly: false,
    format: defaultFormat,
    formatter: formats.formatters[defaultFormat],
    // deprecated
    indices: false,
    serializeDate: function serializeDate(date) {
        return toISO.call(date);
    },
    skipNulls: false,
    strictNullHandling: false
};

var isNonNullishPrimitive = function isNonNullishPrimitive(v) {
    return typeof v === 'string'
        || typeof v === 'number'
        || typeof v === 'boolean'
        || typeof v === 'symbol'
        || typeof v === 'bigint';
};

var sentinel = {};

var stringify = function stringify(
    object,
    prefix,
    generateArrayPrefix,
    commaRoundTrip,
    strictNullHandling,
    skipNulls,
    encoder,
    filter,
    sort,
    allowDots,
    serializeDate,
    format,
    formatter,
    encodeValuesOnly,
    charset,
    sideChannel
) {
    var obj = object;

    var tmpSc = sideChannel;
    var step = 0;
    var findFlag = false;
    while ((tmpSc = tmpSc.get(sentinel)) !== void undefined && !findFlag) {
        // Where object last appeared in the ref tree
        var pos = tmpSc.get(object);
        step += 1;
        if (typeof pos !== 'undefined') {
            if (pos === step) {
                throw new RangeError('Cyclic object value');
            } else {
                findFlag = true; // Break while
            }
        }
        if (typeof tmpSc.get(sentinel) === 'undefined') {
            step = 0;
        }
    }

    if (typeof filter === 'function') {
        obj = filter(prefix, obj);
    } else if (obj instanceof Date) {
        obj = serializeDate(obj);
    } else if (generateArrayPrefix === 'comma' && isArray(obj)) {
        obj = utils.maybeMap(obj, function (value) {
            if (value instanceof Date) {
                return serializeDate(value);
            }
            return value;
        });
    }

    if (obj === null) {
        if (strictNullHandling) {
            return encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder, charset, 'key', format) : prefix;
        }

        obj = '';
    }

    if (isNonNullishPrimitive(obj) || utils.isBuffer(obj)) {
        if (encoder) {
            var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder, charset, 'key', format);
            if (generateArrayPrefix === 'comma' && encodeValuesOnly) {
                var valuesArray = split.call(String(obj), ',');
                var valuesJoined = '';
                for (var i = 0; i < valuesArray.length; ++i) {
                    valuesJoined += (i === 0 ? '' : ',') + formatter(encoder(valuesArray[i], defaults.encoder, charset, 'value', format));
                }
                return [formatter(keyValue) + (commaRoundTrip && isArray(obj) && valuesArray.length === 1 ? '[]' : '') + '=' + valuesJoined];
            }
            return [formatter(keyValue) + '=' + formatter(encoder(obj, defaults.encoder, charset, 'value', format))];
        }
        return [formatter(prefix) + '=' + formatter(String(obj))];
    }

    var values = [];

    if (typeof obj === 'undefined') {
        return values;
    }

    var objKeys;
    if (generateArrayPrefix === 'comma' && isArray(obj)) {
        // we need to join elements in
        objKeys = [{ value: obj.length > 0 ? obj.join(',') || null : void undefined }];
    } else if (isArray(filter)) {
        objKeys = filter;
    } else {
        var keys = Object.keys(obj);
        objKeys = sort ? keys.sort(sort) : keys;
    }

    var adjustedPrefix = commaRoundTrip && isArray(obj) && obj.length === 1 ? prefix + '[]' : prefix;

    for (var j = 0; j < objKeys.length; ++j) {
        var key = objKeys[j];
        var value = typeof key === 'object' && typeof key.value !== 'undefined' ? key.value : obj[key];

        if (skipNulls && value === null) {
            continue;
        }

        var keyPrefix = isArray(obj)
            ? typeof generateArrayPrefix === 'function' ? generateArrayPrefix(adjustedPrefix, key) : adjustedPrefix
            : adjustedPrefix + (allowDots ? '.' + key : '[' + key + ']');

        sideChannel.set(object, step);
        var valueSideChannel = getSideChannel();
        valueSideChannel.set(sentinel, sideChannel);
        pushToArray(values, stringify(
            value,
            keyPrefix,
            generateArrayPrefix,
            commaRoundTrip,
            strictNullHandling,
            skipNulls,
            encoder,
            filter,
            sort,
            allowDots,
            serializeDate,
            format,
            formatter,
            encodeValuesOnly,
            charset,
            valueSideChannel
        ));
    }

    return values;
};

var normalizeStringifyOptions = function normalizeStringifyOptions(opts) {
    if (!opts) {
        return defaults;
    }

    if (opts.encoder !== null && typeof opts.encoder !== 'undefined' && typeof opts.encoder !== 'function') {
        throw new TypeError('Encoder has to be a function.');
    }

    var charset = opts.charset || defaults.charset;
    if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
        throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
    }

    var format = formats['default'];
    if (typeof opts.format !== 'undefined') {
        if (!has.call(formats.formatters, opts.format)) {
            throw new TypeError('Unknown format option provided.');
        }
        format = opts.format;
    }
    var formatter = formats.formatters[format];

    var filter = defaults.filter;
    if (typeof opts.filter === 'function' || isArray(opts.filter)) {
        filter = opts.filter;
    }

    return {
        addQueryPrefix: typeof opts.addQueryPrefix === 'boolean' ? opts.addQueryPrefix : defaults.addQueryPrefix,
        allowDots: typeof opts.allowDots === 'undefined' ? defaults.allowDots : !!opts.allowDots,
        charset: charset,
        charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,
        delimiter: typeof opts.delimiter === 'undefined' ? defaults.delimiter : opts.delimiter,
        encode: typeof opts.encode === 'boolean' ? opts.encode : defaults.encode,
        encoder: typeof opts.encoder === 'function' ? opts.encoder : defaults.encoder,
        encodeValuesOnly: typeof opts.encodeValuesOnly === 'boolean' ? opts.encodeValuesOnly : defaults.encodeValuesOnly,
        filter: filter,
        format: format,
        formatter: formatter,
        serializeDate: typeof opts.serializeDate === 'function' ? opts.serializeDate : defaults.serializeDate,
        skipNulls: typeof opts.skipNulls === 'boolean' ? opts.skipNulls : defaults.skipNulls,
        sort: typeof opts.sort === 'function' ? opts.sort : null,
        strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling
    };
};

module.exports = function (object, opts) {
    var obj = object;
    var options = normalizeStringifyOptions(opts);

    var objKeys;
    var filter;

    if (typeof options.filter === 'function') {
        filter = options.filter;
        obj = filter('', obj);
    } else if (isArray(options.filter)) {
        filter = options.filter;
        objKeys = filter;
    }

    var keys = [];

    if (typeof obj !== 'object' || obj === null) {
        return '';
    }

    var arrayFormat;
    if (opts && opts.arrayFormat in arrayPrefixGenerators) {
        arrayFormat = opts.arrayFormat;
    } else if (opts && 'indices' in opts) {
        arrayFormat = opts.indices ? 'indices' : 'repeat';
    } else {
        arrayFormat = 'indices';
    }

    var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];
    if (opts && 'commaRoundTrip' in opts && typeof opts.commaRoundTrip !== 'boolean') {
        throw new TypeError('`commaRoundTrip` must be a boolean, or absent');
    }
    var commaRoundTrip = generateArrayPrefix === 'comma' && opts && opts.commaRoundTrip;

    if (!objKeys) {
        objKeys = Object.keys(obj);
    }

    if (options.sort) {
        objKeys.sort(options.sort);
    }

    var sideChannel = getSideChannel();
    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];

        if (options.skipNulls && obj[key] === null) {
            continue;
        }
        pushToArray(keys, stringify(
            obj[key],
            key,
            generateArrayPrefix,
            commaRoundTrip,
            options.strictNullHandling,
            options.skipNulls,
            options.encode ? options.encoder : null,
            options.filter,
            options.sort,
            options.allowDots,
            options.serializeDate,
            options.format,
            options.formatter,
            options.encodeValuesOnly,
            options.charset,
            sideChannel
        ));
    }

    var joined = keys.join(options.delimiter);
    var prefix = options.addQueryPrefix === true ? '?' : '';

    if (options.charsetSentinel) {
        if (options.charset === 'iso-8859-1') {
            // encodeURIComponent('&#10003;'), the "numeric entity" representation of a checkmark
            prefix += 'utf8=%26%2310003%3B&';
        } else {
            // encodeURIComponent('✓')
            prefix += 'utf8=%E2%9C%93&';
        }
    }

    return joined.length > 0 ? prefix + joined : '';
};

},{"./formats":80,"./utils":84,"side-channel":101}],84:[function(_dereq_,module,exports){
'use strict';

var formats = _dereq_('./formats');

var has = Object.prototype.hasOwnProperty;
var isArray = Array.isArray;

var hexTable = (function () {
    var array = [];
    for (var i = 0; i < 256; ++i) {
        array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
    }

    return array;
}());

var compactQueue = function compactQueue(queue) {
    while (queue.length > 1) {
        var item = queue.pop();
        var obj = item.obj[item.prop];

        if (isArray(obj)) {
            var compacted = [];

            for (var j = 0; j < obj.length; ++j) {
                if (typeof obj[j] !== 'undefined') {
                    compacted.push(obj[j]);
                }
            }

            item.obj[item.prop] = compacted;
        }
    }
};

var arrayToObject = function arrayToObject(source, options) {
    var obj = options && options.plainObjects ? Object.create(null) : {};
    for (var i = 0; i < source.length; ++i) {
        if (typeof source[i] !== 'undefined') {
            obj[i] = source[i];
        }
    }

    return obj;
};

var merge = function merge(target, source, options) {
    /* eslint no-param-reassign: 0 */
    if (!source) {
        return target;
    }

    if (typeof source !== 'object') {
        if (isArray(target)) {
            target.push(source);
        } else if (target && typeof target === 'object') {
            if ((options && (options.plainObjects || options.allowPrototypes)) || !has.call(Object.prototype, source)) {
                target[source] = true;
            }
        } else {
            return [target, source];
        }

        return target;
    }

    if (!target || typeof target !== 'object') {
        return [target].concat(source);
    }

    var mergeTarget = target;
    if (isArray(target) && !isArray(source)) {
        mergeTarget = arrayToObject(target, options);
    }

    if (isArray(target) && isArray(source)) {
        source.forEach(function (item, i) {
            if (has.call(target, i)) {
                var targetItem = target[i];
                if (targetItem && typeof targetItem === 'object' && item && typeof item === 'object') {
                    target[i] = merge(targetItem, item, options);
                } else {
                    target.push(item);
                }
            } else {
                target[i] = item;
            }
        });
        return target;
    }

    return Object.keys(source).reduce(function (acc, key) {
        var value = source[key];

        if (has.call(acc, key)) {
            acc[key] = merge(acc[key], value, options);
        } else {
            acc[key] = value;
        }
        return acc;
    }, mergeTarget);
};

var assign = function assignSingleSource(target, source) {
    return Object.keys(source).reduce(function (acc, key) {
        acc[key] = source[key];
        return acc;
    }, target);
};

var decode = function (str, decoder, charset) {
    var strWithoutPlus = str.replace(/\+/g, ' ');
    if (charset === 'iso-8859-1') {
        // unescape never throws, no try...catch needed:
        return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
    }
    // utf-8
    try {
        return decodeURIComponent(strWithoutPlus);
    } catch (e) {
        return strWithoutPlus;
    }
};

var encode = function encode(str, defaultEncoder, charset, kind, format) {
    // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
    // It has been adapted here for stricter adherence to RFC 3986
    if (str.length === 0) {
        return str;
    }

    var string = str;
    if (typeof str === 'symbol') {
        string = Symbol.prototype.toString.call(str);
    } else if (typeof str !== 'string') {
        string = String(str);
    }

    if (charset === 'iso-8859-1') {
        return escape(string).replace(/%u[0-9a-f]{4}/gi, function ($0) {
            return '%26%23' + parseInt($0.slice(2), 16) + '%3B';
        });
    }

    var out = '';
    for (var i = 0; i < string.length; ++i) {
        var c = string.charCodeAt(i);

        if (
            c === 0x2D // -
            || c === 0x2E // .
            || c === 0x5F // _
            || c === 0x7E // ~
            || (c >= 0x30 && c <= 0x39) // 0-9
            || (c >= 0x41 && c <= 0x5A) // a-z
            || (c >= 0x61 && c <= 0x7A) // A-Z
            || (format === formats.RFC1738 && (c === 0x28 || c === 0x29)) // ( )
        ) {
            out += string.charAt(i);
            continue;
        }

        if (c < 0x80) {
            out = out + hexTable[c];
            continue;
        }

        if (c < 0x800) {
            out = out + (hexTable[0xC0 | (c >> 6)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        if (c < 0xD800 || c >= 0xE000) {
            out = out + (hexTable[0xE0 | (c >> 12)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        i += 1;
        c = 0x10000 + (((c & 0x3FF) << 10) | (string.charCodeAt(i) & 0x3FF));
        /* eslint operator-linebreak: [2, "before"] */
        out += hexTable[0xF0 | (c >> 18)]
            + hexTable[0x80 | ((c >> 12) & 0x3F)]
            + hexTable[0x80 | ((c >> 6) & 0x3F)]
            + hexTable[0x80 | (c & 0x3F)];
    }

    return out;
};

var compact = function compact(value) {
    var queue = [{ obj: { o: value }, prop: 'o' }];
    var refs = [];

    for (var i = 0; i < queue.length; ++i) {
        var item = queue[i];
        var obj = item.obj[item.prop];

        var keys = Object.keys(obj);
        for (var j = 0; j < keys.length; ++j) {
            var key = keys[j];
            var val = obj[key];
            if (typeof val === 'object' && val !== null && refs.indexOf(val) === -1) {
                queue.push({ obj: obj, prop: key });
                refs.push(val);
            }
        }
    }

    compactQueue(queue);

    return value;
};

var isRegExp = function isRegExp(obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
};

var isBuffer = function isBuffer(obj) {
    if (!obj || typeof obj !== 'object') {
        return false;
    }

    return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
};

var combine = function combine(a, b) {
    return [].concat(a, b);
};

var maybeMap = function maybeMap(val, fn) {
    if (isArray(val)) {
        var mapped = [];
        for (var i = 0; i < val.length; i += 1) {
            mapped.push(fn(val[i]));
        }
        return mapped;
    }
    return fn(val);
};

module.exports = {
    arrayToObject: arrayToObject,
    assign: assign,
    combine: combine,
    compact: compact,
    decode: decode,
    encode: encode,
    isBuffer: isBuffer,
    isRegExp: isRegExp,
    maybeMap: maybeMap,
    merge: merge
};

},{"./formats":80}],85:[function(_dereq_,module,exports){
(function (global){(function (){
var now = _dereq_('performance-now')
  , root = typeof window === 'undefined' ? global : window
  , vendors = ['moz', 'webkit']
  , suffix = 'AnimationFrame'
  , raf = root['request' + suffix]
  , caf = root['cancel' + suffix] || root['cancelRequest' + suffix]

for(var i = 0; !raf && i < vendors.length; i++) {
  raf = root[vendors[i] + 'Request' + suffix]
  caf = root[vendors[i] + 'Cancel' + suffix]
      || root[vendors[i] + 'CancelRequest' + suffix]
}

// Some versions of FF have rAF but not cAF
if(!raf || !caf) {
  var last = 0
    , id = 0
    , queue = []
    , frameDuration = 1000 / 60

  raf = function(callback) {
    if(queue.length === 0) {
      var _now = now()
        , next = Math.max(0, frameDuration - (_now - last))
      last = next + _now
      setTimeout(function() {
        var cp = queue.slice(0)
        // Clear queue here to prevent
        // callbacks from appending listeners
        // to the current frame's queue
        queue.length = 0
        for(var i = 0; i < cp.length; i++) {
          if(!cp[i].cancelled) {
            try{
              cp[i].callback(last)
            } catch(e) {
              setTimeout(function() { throw e }, 0)
            }
          }
        }
      }, Math.round(next))
    }
    queue.push({
      handle: ++id,
      callback: callback,
      cancelled: false
    })
    return id
  }

  caf = function(handle) {
    for(var i = 0; i < queue.length; i++) {
      if(queue[i].handle === handle) {
        queue[i].cancelled = true
      }
    }
  }
}

module.exports = function(fn) {
  // Wrap in a new function to prevent
  // `cancel` potentially being assigned
  // to the native rAF function
  return raf.call(root, fn)
}
module.exports.cancel = function() {
  caf.apply(root, arguments)
}
module.exports.polyfill = function(object) {
  if (!object) {
    object = root;
  }
  object.requestAnimationFrame = raf
  object.cancelAnimationFrame = caf
}

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"performance-now":77}],86:[function(_dereq_,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.

'use strict';

/*<replacement>*/

var pna = _dereq_('process-nextick-args');
/*</replacement>*/

/*<replacement>*/
var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    keys.push(key);
  }return keys;
};
/*</replacement>*/

module.exports = Duplex;

/*<replacement>*/
var util = Object.create(_dereq_('core-util-is'));
util.inherits = _dereq_('inherits');
/*</replacement>*/

var Readable = _dereq_('./_stream_readable');
var Writable = _dereq_('./_stream_writable');

util.inherits(Duplex, Readable);

{
  // avoid scope creep, the keys array can then be collected
  var keys = objectKeys(Writable.prototype);
  for (var v = 0; v < keys.length; v++) {
    var method = keys[v];
    if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
  }
}

function Duplex(options) {
  if (!(this instanceof Duplex)) return new Duplex(options);

  Readable.call(this, options);
  Writable.call(this, options);

  if (options && options.readable === false) this.readable = false;

  if (options && options.writable === false) this.writable = false;

  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;

  this.once('end', onend);
}

Object.defineProperty(Duplex.prototype, 'writableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function () {
    return this._writableState.highWaterMark;
  }
});

// the no-half-open enforcer
function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended) return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  pna.nextTick(onEndNT, this);
}

function onEndNT(self) {
  self.end();
}

Object.defineProperty(Duplex.prototype, 'destroyed', {
  get: function () {
    if (this._readableState === undefined || this._writableState === undefined) {
      return false;
    }
    return this._readableState.destroyed && this._writableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (this._readableState === undefined || this._writableState === undefined) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._readableState.destroyed = value;
    this._writableState.destroyed = value;
  }
});

Duplex.prototype._destroy = function (err, cb) {
  this.push(null);
  this.end();

  pna.nextTick(cb, err);
};
},{"./_stream_readable":88,"./_stream_writable":90,"core-util-is":26,"inherits":66,"process-nextick-args":78}],87:[function(_dereq_,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.

'use strict';

module.exports = PassThrough;

var Transform = _dereq_('./_stream_transform');

/*<replacement>*/
var util = Object.create(_dereq_('core-util-is'));
util.inherits = _dereq_('inherits');
/*</replacement>*/

util.inherits(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough)) return new PassThrough(options);

  Transform.call(this, options);
}

PassThrough.prototype._transform = function (chunk, encoding, cb) {
  cb(null, chunk);
};
},{"./_stream_transform":89,"core-util-is":26,"inherits":66}],88:[function(_dereq_,module,exports){
(function (process,global){(function (){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

/*<replacement>*/

var pna = _dereq_('process-nextick-args');
/*</replacement>*/

module.exports = Readable;

/*<replacement>*/
var isArray = _dereq_('isarray');
/*</replacement>*/

/*<replacement>*/
var Duplex;
/*</replacement>*/

Readable.ReadableState = ReadableState;

/*<replacement>*/
var EE = _dereq_('events').EventEmitter;

var EElistenerCount = function (emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

/*<replacement>*/
var Stream = _dereq_('./internal/streams/stream');
/*</replacement>*/

/*<replacement>*/

var Buffer = _dereq_('safe-buffer').Buffer;
var OurUint8Array = (typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : {}).Uint8Array || function () {};
function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}
function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}

/*</replacement>*/

/*<replacement>*/
var util = Object.create(_dereq_('core-util-is'));
util.inherits = _dereq_('inherits');
/*</replacement>*/

/*<replacement>*/
var debugUtil = _dereq_('util');
var debug = void 0;
if (debugUtil && debugUtil.debuglog) {
  debug = debugUtil.debuglog('stream');
} else {
  debug = function () {};
}
/*</replacement>*/

var BufferList = _dereq_('./internal/streams/BufferList');
var destroyImpl = _dereq_('./internal/streams/destroy');
var StringDecoder;

util.inherits(Readable, Stream);

var kProxyEvents = ['error', 'close', 'destroy', 'pause', 'resume'];

function prependListener(emitter, event, fn) {
  // Sadly this is not cacheable as some libraries bundle their own
  // event emitter implementation with them.
  if (typeof emitter.prependListener === 'function') return emitter.prependListener(event, fn);

  // This is a hack to make sure that our error handler is attached before any
  // userland ones.  NEVER DO THIS. This is here only because this code needs
  // to continue to work with older versions of Node.js that do not include
  // the prependListener() method. The goal is to eventually remove this hack.
  if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (isArray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];
}

function ReadableState(options, stream) {
  Duplex = Duplex || _dereq_('./_stream_duplex');

  options = options || {};

  // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream.
  // These options can be provided separately as readableXXX and writableXXX.
  var isDuplex = stream instanceof Duplex;

  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;

  if (isDuplex) this.objectMode = this.objectMode || !!options.readableObjectMode;

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  var readableHwm = options.readableHighWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;

  if (hwm || hwm === 0) this.highWaterMark = hwm;else if (isDuplex && (readableHwm || readableHwm === 0)) this.highWaterMark = readableHwm;else this.highWaterMark = defaultHwm;

  // cast to ints.
  this.highWaterMark = Math.floor(this.highWaterMark);

  // A linked list is used to store data chunks instead of an array because the
  // linked list can remove elements from the beginning faster than
  // array.shift()
  this.buffer = new BufferList();
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // a flag to be able to tell if the event 'readable'/'data' is emitted
  // immediately, or on a later tick.  We set this to true at first, because
  // any actions that shouldn't happen until "later" should generally also
  // not happen before the first read call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;
  this.resumeScheduled = false;

  // has it been destroyed
  this.destroyed = false;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder) StringDecoder = _dereq_('string_decoder/').StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  Duplex = Duplex || _dereq_('./_stream_duplex');

  if (!(this instanceof Readable)) return new Readable(options);

  this._readableState = new ReadableState(options, this);

  // legacy
  this.readable = true;

  if (options) {
    if (typeof options.read === 'function') this._read = options.read;

    if (typeof options.destroy === 'function') this._destroy = options.destroy;
  }

  Stream.call(this);
}

Object.defineProperty(Readable.prototype, 'destroyed', {
  get: function () {
    if (this._readableState === undefined) {
      return false;
    }
    return this._readableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._readableState) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._readableState.destroyed = value;
  }
});

Readable.prototype.destroy = destroyImpl.destroy;
Readable.prototype._undestroy = destroyImpl.undestroy;
Readable.prototype._destroy = function (err, cb) {
  this.push(null);
  cb(err);
};

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function (chunk, encoding) {
  var state = this._readableState;
  var skipChunkCheck;

  if (!state.objectMode) {
    if (typeof chunk === 'string') {
      encoding = encoding || state.defaultEncoding;
      if (encoding !== state.encoding) {
        chunk = Buffer.from(chunk, encoding);
        encoding = '';
      }
      skipChunkCheck = true;
    }
  } else {
    skipChunkCheck = true;
  }

  return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function (chunk) {
  return readableAddChunk(this, chunk, null, true, false);
};

function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
  var state = stream._readableState;
  if (chunk === null) {
    state.reading = false;
    onEofChunk(stream, state);
  } else {
    var er;
    if (!skipChunkCheck) er = chunkInvalid(state, chunk);
    if (er) {
      stream.emit('error', er);
    } else if (state.objectMode || chunk && chunk.length > 0) {
      if (typeof chunk !== 'string' && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer.prototype) {
        chunk = _uint8ArrayToBuffer(chunk);
      }

      if (addToFront) {
        if (state.endEmitted) stream.emit('error', new Error('stream.unshift() after end event'));else addChunk(stream, state, chunk, true);
      } else if (state.ended) {
        stream.emit('error', new Error('stream.push() after EOF'));
      } else {
        state.reading = false;
        if (state.decoder && !encoding) {
          chunk = state.decoder.write(chunk);
          if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false);else maybeReadMore(stream, state);
        } else {
          addChunk(stream, state, chunk, false);
        }
      }
    } else if (!addToFront) {
      state.reading = false;
    }
  }

  return needMoreData(state);
}

function addChunk(stream, state, chunk, addToFront) {
  if (state.flowing && state.length === 0 && !state.sync) {
    stream.emit('data', chunk);
    stream.read(0);
  } else {
    // update the buffer info.
    state.length += state.objectMode ? 1 : chunk.length;
    if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);

    if (state.needReadable) emitReadable(stream);
  }
  maybeReadMore(stream, state);
}

function chunkInvalid(state, chunk) {
  var er;
  if (!_isUint8Array(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  return er;
}

// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state) {
  return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
}

Readable.prototype.isPaused = function () {
  return this._readableState.flowing === false;
};

// backwards compatibility.
Readable.prototype.setEncoding = function (enc) {
  if (!StringDecoder) StringDecoder = _dereq_('string_decoder/').StringDecoder;
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
  return this;
};

// Don't raise the hwm > 8MB
var MAX_HWM = 0x800000;
function computeNewHighWaterMark(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2 to prevent increasing hwm excessively in
    // tiny amounts
    n--;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    n++;
  }
  return n;
}

// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function howMuchToRead(n, state) {
  if (n <= 0 || state.length === 0 && state.ended) return 0;
  if (state.objectMode) return 1;
  if (n !== n) {
    // Only flow one buffer at a time
    if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
  }
  // If we're asking for more than the current hwm, then raise the hwm.
  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
  if (n <= state.length) return n;
  // Don't have enough
  if (!state.ended) {
    state.needReadable = true;
    return 0;
  }
  return state.length;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function (n) {
  debug('read', n);
  n = parseInt(n, 10);
  var state = this._readableState;
  var nOrig = n;

  if (n !== 0) state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    if (state.length === 0) endReadable(this);
    return null;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;
  debug('need readable', doRead);

  // if we currently have less than the highWaterMark, then also read some
  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  }

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  } else if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0) state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
    // If _read pushed data synchronously, then `reading` will be false,
    // and we need to re-evaluate how much data we can return to the user.
    if (!state.reading) n = howMuchToRead(nOrig, state);
  }

  var ret;
  if (n > 0) ret = fromList(n, state);else ret = null;

  if (ret === null) {
    state.needReadable = true;
    n = 0;
  } else {
    state.length -= n;
  }

  if (state.length === 0) {
    // If we have nothing in the buffer, then we want to know
    // as soon as we *do* get something into the buffer.
    if (!state.ended) state.needReadable = true;

    // If we tried to read() past the EOF, then emit end on the next tick.
    if (nOrig !== n && state.ended) endReadable(this);
  }

  if (ret !== null) this.emit('data', ret);

  return ret;
};

function onEofChunk(stream, state) {
  if (state.ended) return;
  if (state.decoder) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;

  // emit 'readable' now to make sure it gets picked up.
  emitReadable(stream);
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    if (state.sync) pna.nextTick(emitReadable_, stream);else emitReadable_(stream);
  }
}

function emitReadable_(stream) {
  debug('emit readable');
  stream.emit('readable');
  flow(stream);
}

// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    pna.nextTick(maybeReadMore_, stream, state);
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;else len = state.length;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function (n) {
  this.emit('error', new Error('_read() is not implemented'));
};

Readable.prototype.pipe = function (dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

  var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;

  var endFn = doEnd ? onend : unpipe;
  if (state.endEmitted) pna.nextTick(endFn);else src.once('end', endFn);

  dest.on('unpipe', onunpipe);
  function onunpipe(readable, unpipeInfo) {
    debug('onunpipe');
    if (readable === src) {
      if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
        unpipeInfo.hasUnpiped = true;
        cleanup();
      }
    }
  }

  function onend() {
    debug('onend');
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);

  var cleanedUp = false;
  function cleanup() {
    debug('cleanup');
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', unpipe);
    src.removeListener('data', ondata);

    cleanedUp = true;

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
  }

  // If the user pushes more data while we're writing to dest then we'll end up
  // in ondata again. However, we only want to increase awaitDrain once because
  // dest will only emit one 'drain' event for the multiple writes.
  // => Introduce a guard on increasing awaitDrain.
  var increasedAwaitDrain = false;
  src.on('data', ondata);
  function ondata(chunk) {
    debug('ondata');
    increasedAwaitDrain = false;
    var ret = dest.write(chunk);
    if (false === ret && !increasedAwaitDrain) {
      // If the user unpiped during `dest.write()`, it is possible
      // to get stuck in a permanently paused state if that write
      // also returned false.
      // => Check whether `dest` is still a piping destination.
      if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
        debug('false write response, pause', state.awaitDrain);
        state.awaitDrain++;
        increasedAwaitDrain = true;
      }
      src.pause();
    }
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (EElistenerCount(dest, 'error') === 0) dest.emit('error', er);
  }

  // Make sure our error handler is attached before userland ones.
  prependListener(dest, 'error', onerror);

  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);

  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }

  return dest;
};

function pipeOnDrain(src) {
  return function () {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain) state.awaitDrain--;
    if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
}

Readable.prototype.unpipe = function (dest) {
  var state = this._readableState;
  var unpipeInfo = { hasUnpiped: false };

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0) return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes) return this;

    if (!dest) dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest) dest.emit('unpipe', this, unpipeInfo);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;

    for (var i = 0; i < len; i++) {
      dests[i].emit('unpipe', this, { hasUnpiped: false });
    }return this;
  }

  // try to find the right one.
  var index = indexOf(state.pipes, dest);
  if (index === -1) return this;

  state.pipes.splice(index, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1) state.pipes = state.pipes[0];

  dest.emit('unpipe', this, unpipeInfo);

  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function (ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);

  if (ev === 'data') {
    // Start flowing on next tick if stream isn't explicitly paused
    if (this._readableState.flowing !== false) this.resume();
  } else if (ev === 'readable') {
    var state = this._readableState;
    if (!state.endEmitted && !state.readableListening) {
      state.readableListening = state.needReadable = true;
      state.emittedReadable = false;
      if (!state.reading) {
        pna.nextTick(nReadingNextTick, this);
      } else if (state.length) {
        emitReadable(this);
      }
    }
  }

  return res;
};
Readable.prototype.addListener = Readable.prototype.on;

function nReadingNextTick(self) {
  debug('readable nexttick read 0');
  self.read(0);
}

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function () {
  var state = this._readableState;
  if (!state.flowing) {
    debug('resume');
    state.flowing = true;
    resume(this, state);
  }
  return this;
};

function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    pna.nextTick(resume_, stream, state);
  }
}

function resume_(stream, state) {
  if (!state.reading) {
    debug('resume read 0');
    stream.read(0);
  }

  state.resumeScheduled = false;
  state.awaitDrain = 0;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading) stream.read(0);
}

Readable.prototype.pause = function () {
  debug('call pause flowing=%j', this._readableState.flowing);
  if (false !== this._readableState.flowing) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }
  return this;
};

function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);
  while (state.flowing && stream.read() !== null) {}
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function (stream) {
  var _this = this;

  var state = this._readableState;
  var paused = false;

  stream.on('end', function () {
    debug('wrapped end');
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) _this.push(chunk);
    }

    _this.push(null);
  });

  stream.on('data', function (chunk) {
    debug('wrapped data');
    if (state.decoder) chunk = state.decoder.write(chunk);

    // don't skip over falsy values in objectMode
    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;

    var ret = _this.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (this[i] === undefined && typeof stream[i] === 'function') {
      this[i] = function (method) {
        return function () {
          return stream[method].apply(stream, arguments);
        };
      }(i);
    }
  }

  // proxy certain important events.
  for (var n = 0; n < kProxyEvents.length; n++) {
    stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
  }

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  this._read = function (n) {
    debug('wrapped _read', n);
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return this;
};

Object.defineProperty(Readable.prototype, 'readableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function () {
    return this._readableState.highWaterMark;
  }
});

// exposed for testing purposes only.
Readable._fromList = fromList;

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromList(n, state) {
  // nothing buffered
  if (state.length === 0) return null;

  var ret;
  if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {
    // read it all, truncate the list
    if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.head.data;else ret = state.buffer.concat(state.length);
    state.buffer.clear();
  } else {
    // read part of list
    ret = fromListPartial(n, state.buffer, state.decoder);
  }

  return ret;
}

// Extracts only enough buffered data to satisfy the amount requested.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromListPartial(n, list, hasStrings) {
  var ret;
  if (n < list.head.data.length) {
    // slice is the same for buffers and strings
    ret = list.head.data.slice(0, n);
    list.head.data = list.head.data.slice(n);
  } else if (n === list.head.data.length) {
    // first chunk is a perfect match
    ret = list.shift();
  } else {
    // result spans more than one buffer
    ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
  }
  return ret;
}

// Copies a specified amount of characters from the list of buffered data
// chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBufferString(n, list) {
  var p = list.head;
  var c = 1;
  var ret = p.data;
  n -= ret.length;
  while (p = p.next) {
    var str = p.data;
    var nb = n > str.length ? str.length : n;
    if (nb === str.length) ret += str;else ret += str.slice(0, n);
    n -= nb;
    if (n === 0) {
      if (nb === str.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = str.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}

// Copies a specified amount of bytes from the list of buffered data chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBuffer(n, list) {
  var ret = Buffer.allocUnsafe(n);
  var p = list.head;
  var c = 1;
  p.data.copy(ret);
  n -= p.data.length;
  while (p = p.next) {
    var buf = p.data;
    var nb = n > buf.length ? buf.length : n;
    buf.copy(ret, ret.length - n, 0, nb);
    n -= nb;
    if (n === 0) {
      if (nb === buf.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = buf.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;

  // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.
  if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');

  if (!state.endEmitted) {
    state.ended = true;
    pna.nextTick(endReadableNT, state, stream);
  }
}

function endReadableNT(state, stream) {
  // Check that we didn't get one last unshift.
  if (!state.endEmitted && state.length === 0) {
    state.endEmitted = true;
    stream.readable = false;
    stream.emit('end');
  }
}

function indexOf(xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}
}).call(this)}).call(this,_dereq_('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./_stream_duplex":86,"./internal/streams/BufferList":91,"./internal/streams/destroy":92,"./internal/streams/stream":93,"_process":79,"core-util-is":26,"events":44,"inherits":66,"isarray":72,"process-nextick-args":78,"safe-buffer":94,"string_decoder/":95,"util":16}],89:[function(_dereq_,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.

'use strict';

module.exports = Transform;

var Duplex = _dereq_('./_stream_duplex');

/*<replacement>*/
var util = Object.create(_dereq_('core-util-is'));
util.inherits = _dereq_('inherits');
/*</replacement>*/

util.inherits(Transform, Duplex);

function afterTransform(er, data) {
  var ts = this._transformState;
  ts.transforming = false;

  var cb = ts.writecb;

  if (!cb) {
    return this.emit('error', new Error('write callback called multiple times'));
  }

  ts.writechunk = null;
  ts.writecb = null;

  if (data != null) // single equals check for both `null` and `undefined`
    this.push(data);

  cb(er);

  var rs = this._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    this._read(rs.highWaterMark);
  }
}

function Transform(options) {
  if (!(this instanceof Transform)) return new Transform(options);

  Duplex.call(this, options);

  this._transformState = {
    afterTransform: afterTransform.bind(this),
    needTransform: false,
    transforming: false,
    writecb: null,
    writechunk: null,
    writeencoding: null
  };

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;

  if (options) {
    if (typeof options.transform === 'function') this._transform = options.transform;

    if (typeof options.flush === 'function') this._flush = options.flush;
  }

  // When the writable side finishes, then flush out anything remaining.
  this.on('prefinish', prefinish);
}

function prefinish() {
  var _this = this;

  if (typeof this._flush === 'function') {
    this._flush(function (er, data) {
      done(_this, er, data);
    });
  } else {
    done(this, null, null);
  }
}

Transform.prototype.push = function (chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function (chunk, encoding, cb) {
  throw new Error('_transform() is not implemented');
};

Transform.prototype._write = function (chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function (n) {
  var ts = this._transformState;

  if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};

Transform.prototype._destroy = function (err, cb) {
  var _this2 = this;

  Duplex.prototype._destroy.call(this, err, function (err2) {
    cb(err2);
    _this2.emit('close');
  });
};

function done(stream, er, data) {
  if (er) return stream.emit('error', er);

  if (data != null) // single equals check for both `null` and `undefined`
    stream.push(data);

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  if (stream._writableState.length) throw new Error('Calling transform done when ws.length != 0');

  if (stream._transformState.transforming) throw new Error('Calling transform done when still transforming');

  return stream.push(null);
}
},{"./_stream_duplex":86,"core-util-is":26,"inherits":66}],90:[function(_dereq_,module,exports){
(function (process,global,setImmediate){(function (){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// A bit simpler than readable streams.
// Implement an async ._write(chunk, encoding, cb), and it'll handle all
// the drain event emission and buffering.

'use strict';

/*<replacement>*/

var pna = _dereq_('process-nextick-args');
/*</replacement>*/

module.exports = Writable;

/* <replacement> */
function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
  this.next = null;
}

// It seems a linked list but it is not
// there will be only 2 of these for each stream
function CorkedRequest(state) {
  var _this = this;

  this.next = null;
  this.entry = null;
  this.finish = function () {
    onCorkedFinish(_this, state);
  };
}
/* </replacement> */

/*<replacement>*/
var asyncWrite = !process.browser && ['v0.10', 'v0.9.'].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : pna.nextTick;
/*</replacement>*/

/*<replacement>*/
var Duplex;
/*</replacement>*/

Writable.WritableState = WritableState;

/*<replacement>*/
var util = Object.create(_dereq_('core-util-is'));
util.inherits = _dereq_('inherits');
/*</replacement>*/

/*<replacement>*/
var internalUtil = {
  deprecate: _dereq_('util-deprecate')
};
/*</replacement>*/

/*<replacement>*/
var Stream = _dereq_('./internal/streams/stream');
/*</replacement>*/

/*<replacement>*/

var Buffer = _dereq_('safe-buffer').Buffer;
var OurUint8Array = (typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : {}).Uint8Array || function () {};
function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}
function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}

/*</replacement>*/

var destroyImpl = _dereq_('./internal/streams/destroy');

util.inherits(Writable, Stream);

function nop() {}

function WritableState(options, stream) {
  Duplex = Duplex || _dereq_('./_stream_duplex');

  options = options || {};

  // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream.
  // These options can be provided separately as readableXXX and writableXXX.
  var isDuplex = stream instanceof Duplex;

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  if (isDuplex) this.objectMode = this.objectMode || !!options.writableObjectMode;

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  var writableHwm = options.writableHighWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;

  if (hwm || hwm === 0) this.highWaterMark = hwm;else if (isDuplex && (writableHwm || writableHwm === 0)) this.highWaterMark = writableHwm;else this.highWaterMark = defaultHwm;

  // cast to ints.
  this.highWaterMark = Math.floor(this.highWaterMark);

  // if _final has been called
  this.finalCalled = false;

  // drain event flag.
  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // has it been destroyed
  this.destroyed = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // when true all writes will be buffered until .uncork() call
  this.corked = 0;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function (er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;

  this.bufferedRequest = null;
  this.lastBufferedRequest = null;

  // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted
  this.pendingcb = 0;

  // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams
  this.prefinished = false;

  // True if the error was already emitted and should not be thrown again
  this.errorEmitted = false;

  // count buffered requests
  this.bufferedRequestCount = 0;

  // allocate the first CorkedRequest, there is always
  // one allocated and free to use, and we maintain at most two
  this.corkedRequestsFree = new CorkedRequest(this);
}

WritableState.prototype.getBuffer = function getBuffer() {
  var current = this.bufferedRequest;
  var out = [];
  while (current) {
    out.push(current);
    current = current.next;
  }
  return out;
};

(function () {
  try {
    Object.defineProperty(WritableState.prototype, 'buffer', {
      get: internalUtil.deprecate(function () {
        return this.getBuffer();
      }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.', 'DEP0003')
    });
  } catch (_) {}
})();

// Test _writableState for inheritance to account for Duplex streams,
// whose prototype chain only points to Readable.
var realHasInstance;
if (typeof Symbol === 'function' && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === 'function') {
  realHasInstance = Function.prototype[Symbol.hasInstance];
  Object.defineProperty(Writable, Symbol.hasInstance, {
    value: function (object) {
      if (realHasInstance.call(this, object)) return true;
      if (this !== Writable) return false;

      return object && object._writableState instanceof WritableState;
    }
  });
} else {
  realHasInstance = function (object) {
    return object instanceof this;
  };
}

function Writable(options) {
  Duplex = Duplex || _dereq_('./_stream_duplex');

  // Writable ctor is applied to Duplexes, too.
  // `realHasInstance` is necessary because using plain `instanceof`
  // would return false, as no `_writableState` property is attached.

  // Trying to use the custom `instanceof` for Writable here will also break the
  // Node.js LazyTransform implementation, which has a non-trivial getter for
  // `_writableState` that would lead to infinite recursion.
  if (!realHasInstance.call(Writable, this) && !(this instanceof Duplex)) {
    return new Writable(options);
  }

  this._writableState = new WritableState(options, this);

  // legacy.
  this.writable = true;

  if (options) {
    if (typeof options.write === 'function') this._write = options.write;

    if (typeof options.writev === 'function') this._writev = options.writev;

    if (typeof options.destroy === 'function') this._destroy = options.destroy;

    if (typeof options.final === 'function') this._final = options.final;
  }

  Stream.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function () {
  this.emit('error', new Error('Cannot pipe, not readable'));
};

function writeAfterEnd(stream, cb) {
  var er = new Error('write after end');
  // TODO: defer error events consistently everywhere, not just the cb
  stream.emit('error', er);
  pna.nextTick(cb, er);
}

// Checks that a user-supplied chunk is valid, especially for the particular
// mode the stream is in. Currently this means that `null` is never accepted
// and undefined/non-string values are only allowed in object mode.
function validChunk(stream, state, chunk, cb) {
  var valid = true;
  var er = false;

  if (chunk === null) {
    er = new TypeError('May not write null values to stream');
  } else if (typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  if (er) {
    stream.emit('error', er);
    pna.nextTick(cb, er);
    valid = false;
  }
  return valid;
}

Writable.prototype.write = function (chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;
  var isBuf = !state.objectMode && _isUint8Array(chunk);

  if (isBuf && !Buffer.isBuffer(chunk)) {
    chunk = _uint8ArrayToBuffer(chunk);
  }

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (isBuf) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;

  if (typeof cb !== 'function') cb = nop;

  if (state.ended) writeAfterEnd(this, cb);else if (isBuf || validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
  }

  return ret;
};

Writable.prototype.cork = function () {
  var state = this._writableState;

  state.corked++;
};

Writable.prototype.uncork = function () {
  var state = this._writableState;

  if (state.corked) {
    state.corked--;

    if (!state.writing && !state.corked && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
  }
};

Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
  // node::ParseEncoding() requires lower case.
  if (typeof encoding === 'string') encoding = encoding.toLowerCase();
  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new TypeError('Unknown encoding: ' + encoding);
  this._writableState.defaultEncoding = encoding;
  return this;
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
    chunk = Buffer.from(chunk, encoding);
  }
  return chunk;
}

Object.defineProperty(Writable.prototype, 'writableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function () {
    return this._writableState.highWaterMark;
  }
});

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
  if (!isBuf) {
    var newChunk = decodeChunk(state, chunk, encoding);
    if (chunk !== newChunk) {
      isBuf = true;
      encoding = 'buffer';
      chunk = newChunk;
    }
  }
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  // we must ensure that previous needDrain will not be reset to false.
  if (!ret) state.needDrain = true;

  if (state.writing || state.corked) {
    var last = state.lastBufferedRequest;
    state.lastBufferedRequest = {
      chunk: chunk,
      encoding: encoding,
      isBuf: isBuf,
      callback: cb,
      next: null
    };
    if (last) {
      last.next = state.lastBufferedRequest;
    } else {
      state.bufferedRequest = state.lastBufferedRequest;
    }
    state.bufferedRequestCount += 1;
  } else {
    doWrite(stream, state, false, len, chunk, encoding, cb);
  }

  return ret;
}

function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  --state.pendingcb;

  if (sync) {
    // defer the callback if we are being called synchronously
    // to avoid piling up things on the stack
    pna.nextTick(cb, er);
    // this can emit finish, and it will always happen
    // after error
    pna.nextTick(finishMaybe, stream, state);
    stream._writableState.errorEmitted = true;
    stream.emit('error', er);
  } else {
    // the caller expect this to happen before if
    // it is async
    cb(er);
    stream._writableState.errorEmitted = true;
    stream.emit('error', er);
    // this can emit finish, but finish must
    // always follow error
    finishMaybe(stream, state);
  }
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;

  onwriteStateUpdate(state);

  if (er) onwriteError(stream, state, sync, er, cb);else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(state);

    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
      clearBuffer(stream, state);
    }

    if (sync) {
      /*<replacement>*/
      asyncWrite(afterWrite, stream, state, finished, cb);
      /*</replacement>*/
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished) onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}

// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;
  var entry = state.bufferedRequest;

  if (stream._writev && entry && entry.next) {
    // Fast case, write everything using _writev()
    var l = state.bufferedRequestCount;
    var buffer = new Array(l);
    var holder = state.corkedRequestsFree;
    holder.entry = entry;

    var count = 0;
    var allBuffers = true;
    while (entry) {
      buffer[count] = entry;
      if (!entry.isBuf) allBuffers = false;
      entry = entry.next;
      count += 1;
    }
    buffer.allBuffers = allBuffers;

    doWrite(stream, state, true, state.length, buffer, '', holder.finish);

    // doWrite is almost always async, defer these to save a bit of time
    // as the hot path ends with doWrite
    state.pendingcb++;
    state.lastBufferedRequest = null;
    if (holder.next) {
      state.corkedRequestsFree = holder.next;
      holder.next = null;
    } else {
      state.corkedRequestsFree = new CorkedRequest(state);
    }
    state.bufferedRequestCount = 0;
  } else {
    // Slow case, write chunks one-by-one
    while (entry) {
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;

      doWrite(stream, state, false, len, chunk, encoding, cb);
      entry = entry.next;
      state.bufferedRequestCount--;
      // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.
      if (state.writing) {
        break;
      }
    }

    if (entry === null) state.lastBufferedRequest = null;
  }

  state.bufferedRequest = entry;
  state.bufferProcessing = false;
}

Writable.prototype._write = function (chunk, encoding, cb) {
  cb(new Error('_write() is not implemented'));
};

Writable.prototype._writev = null;

Writable.prototype.end = function (chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding);

  // .end() fully uncorks
  if (state.corked) {
    state.corked = 1;
    this.uncork();
  }

  // ignore unnecessary end() calls.
  if (!state.ending) endWritable(this, state, cb);
};

function needFinish(state) {
  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
}
function callFinal(stream, state) {
  stream._final(function (err) {
    state.pendingcb--;
    if (err) {
      stream.emit('error', err);
    }
    state.prefinished = true;
    stream.emit('prefinish');
    finishMaybe(stream, state);
  });
}
function prefinish(stream, state) {
  if (!state.prefinished && !state.finalCalled) {
    if (typeof stream._final === 'function') {
      state.pendingcb++;
      state.finalCalled = true;
      pna.nextTick(callFinal, stream, state);
    } else {
      state.prefinished = true;
      stream.emit('prefinish');
    }
  }
}

function finishMaybe(stream, state) {
  var need = needFinish(state);
  if (need) {
    prefinish(stream, state);
    if (state.pendingcb === 0) {
      state.finished = true;
      stream.emit('finish');
    }
  }
  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished) pna.nextTick(cb);else stream.once('finish', cb);
  }
  state.ended = true;
  stream.writable = false;
}

function onCorkedFinish(corkReq, state, err) {
  var entry = corkReq.entry;
  corkReq.entry = null;
  while (entry) {
    var cb = entry.callback;
    state.pendingcb--;
    cb(err);
    entry = entry.next;
  }

  // reuse the free corkReq.
  state.corkedRequestsFree.next = corkReq;
}

Object.defineProperty(Writable.prototype, 'destroyed', {
  get: function () {
    if (this._writableState === undefined) {
      return false;
    }
    return this._writableState.destroyed;
  },
  set: function (value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._writableState) {
      return;
    }

    // backward compatibility, the user is explicitly
    // managing destroyed
    this._writableState.destroyed = value;
  }
});

Writable.prototype.destroy = destroyImpl.destroy;
Writable.prototype._undestroy = destroyImpl.undestroy;
Writable.prototype._destroy = function (err, cb) {
  this.end();
  cb(err);
};
}).call(this)}).call(this,_dereq_('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},_dereq_("timers").setImmediate)
},{"./_stream_duplex":86,"./internal/streams/destroy":92,"./internal/streams/stream":93,"_process":79,"core-util-is":26,"inherits":66,"process-nextick-args":78,"safe-buffer":94,"timers":108,"util-deprecate":111}],91:[function(_dereq_,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Buffer = _dereq_('safe-buffer').Buffer;
var util = _dereq_('util');

function copyBuffer(src, target, offset) {
  src.copy(target, offset);
}

module.exports = function () {
  function BufferList() {
    _classCallCheck(this, BufferList);

    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  BufferList.prototype.push = function push(v) {
    var entry = { data: v, next: null };
    if (this.length > 0) this.tail.next = entry;else this.head = entry;
    this.tail = entry;
    ++this.length;
  };

  BufferList.prototype.unshift = function unshift(v) {
    var entry = { data: v, next: this.head };
    if (this.length === 0) this.tail = entry;
    this.head = entry;
    ++this.length;
  };

  BufferList.prototype.shift = function shift() {
    if (this.length === 0) return;
    var ret = this.head.data;
    if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
    --this.length;
    return ret;
  };

  BufferList.prototype.clear = function clear() {
    this.head = this.tail = null;
    this.length = 0;
  };

  BufferList.prototype.join = function join(s) {
    if (this.length === 0) return '';
    var p = this.head;
    var ret = '' + p.data;
    while (p = p.next) {
      ret += s + p.data;
    }return ret;
  };

  BufferList.prototype.concat = function concat(n) {
    if (this.length === 0) return Buffer.alloc(0);
    var ret = Buffer.allocUnsafe(n >>> 0);
    var p = this.head;
    var i = 0;
    while (p) {
      copyBuffer(p.data, ret, i);
      i += p.data.length;
      p = p.next;
    }
    return ret;
  };

  return BufferList;
}();

if (util && util.inspect && util.inspect.custom) {
  module.exports.prototype[util.inspect.custom] = function () {
    var obj = util.inspect({ length: this.length });
    return this.constructor.name + ' ' + obj;
  };
}
},{"safe-buffer":94,"util":16}],92:[function(_dereq_,module,exports){
'use strict';

/*<replacement>*/

var pna = _dereq_('process-nextick-args');
/*</replacement>*/

// undocumented cb() API, needed for core, not for public API
function destroy(err, cb) {
  var _this = this;

  var readableDestroyed = this._readableState && this._readableState.destroyed;
  var writableDestroyed = this._writableState && this._writableState.destroyed;

  if (readableDestroyed || writableDestroyed) {
    if (cb) {
      cb(err);
    } else if (err) {
      if (!this._writableState) {
        pna.nextTick(emitErrorNT, this, err);
      } else if (!this._writableState.errorEmitted) {
        this._writableState.errorEmitted = true;
        pna.nextTick(emitErrorNT, this, err);
      }
    }

    return this;
  }

  // we set destroyed to true before firing error callbacks in order
  // to make it re-entrance safe in case destroy() is called within callbacks

  if (this._readableState) {
    this._readableState.destroyed = true;
  }

  // if this is a duplex stream mark the writable part as destroyed as well
  if (this._writableState) {
    this._writableState.destroyed = true;
  }

  this._destroy(err || null, function (err) {
    if (!cb && err) {
      if (!_this._writableState) {
        pna.nextTick(emitErrorNT, _this, err);
      } else if (!_this._writableState.errorEmitted) {
        _this._writableState.errorEmitted = true;
        pna.nextTick(emitErrorNT, _this, err);
      }
    } else if (cb) {
      cb(err);
    }
  });

  return this;
}

function undestroy() {
  if (this._readableState) {
    this._readableState.destroyed = false;
    this._readableState.reading = false;
    this._readableState.ended = false;
    this._readableState.endEmitted = false;
  }

  if (this._writableState) {
    this._writableState.destroyed = false;
    this._writableState.ended = false;
    this._writableState.ending = false;
    this._writableState.finalCalled = false;
    this._writableState.prefinished = false;
    this._writableState.finished = false;
    this._writableState.errorEmitted = false;
  }
}

function emitErrorNT(self, err) {
  self.emit('error', err);
}

module.exports = {
  destroy: destroy,
  undestroy: undestroy
};
},{"process-nextick-args":78}],93:[function(_dereq_,module,exports){
module.exports = _dereq_('events').EventEmitter;

},{"events":44}],94:[function(_dereq_,module,exports){
/* eslint-disable node/no-deprecated-api */
var buffer = _dereq_('buffer')
var Buffer = buffer.Buffer

// alternative to using Object.keys for old browsers
function copyProps (src, dst) {
  for (var key in src) {
    dst[key] = src[key]
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports)
  exports.Buffer = SafeBuffer
}

function SafeBuffer (arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer)

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  var buf = Buffer(size)
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding)
    } else {
      buf.fill(fill)
    }
  } else {
    buf.fill(0)
  }
  return buf
}

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return Buffer(size)
}

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return buffer.SlowBuffer(size)
}

},{"buffer":18}],95:[function(_dereq_,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

/*<replacement>*/

var Buffer = _dereq_('safe-buffer').Buffer;
/*</replacement>*/

var isEncoding = Buffer.isEncoding || function (encoding) {
  encoding = '' + encoding;
  switch (encoding && encoding.toLowerCase()) {
    case 'hex':case 'utf8':case 'utf-8':case 'ascii':case 'binary':case 'base64':case 'ucs2':case 'ucs-2':case 'utf16le':case 'utf-16le':case 'raw':
      return true;
    default:
      return false;
  }
};

function _normalizeEncoding(enc) {
  if (!enc) return 'utf8';
  var retried;
  while (true) {
    switch (enc) {
      case 'utf8':
      case 'utf-8':
        return 'utf8';
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return 'utf16le';
      case 'latin1':
      case 'binary':
        return 'latin1';
      case 'base64':
      case 'ascii':
      case 'hex':
        return enc;
      default:
        if (retried) return; // undefined
        enc = ('' + enc).toLowerCase();
        retried = true;
    }
  }
};

// Do not cache `Buffer.isEncoding` when checking encoding names as some
// modules monkey-patch it to support additional encodings
function normalizeEncoding(enc) {
  var nenc = _normalizeEncoding(enc);
  if (typeof nenc !== 'string' && (Buffer.isEncoding === isEncoding || !isEncoding(enc))) throw new Error('Unknown encoding: ' + enc);
  return nenc || enc;
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters.
exports.StringDecoder = StringDecoder;
function StringDecoder(encoding) {
  this.encoding = normalizeEncoding(encoding);
  var nb;
  switch (this.encoding) {
    case 'utf16le':
      this.text = utf16Text;
      this.end = utf16End;
      nb = 4;
      break;
    case 'utf8':
      this.fillLast = utf8FillLast;
      nb = 4;
      break;
    case 'base64':
      this.text = base64Text;
      this.end = base64End;
      nb = 3;
      break;
    default:
      this.write = simpleWrite;
      this.end = simpleEnd;
      return;
  }
  this.lastNeed = 0;
  this.lastTotal = 0;
  this.lastChar = Buffer.allocUnsafe(nb);
}

StringDecoder.prototype.write = function (buf) {
  if (buf.length === 0) return '';
  var r;
  var i;
  if (this.lastNeed) {
    r = this.fillLast(buf);
    if (r === undefined) return '';
    i = this.lastNeed;
    this.lastNeed = 0;
  } else {
    i = 0;
  }
  if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
  return r || '';
};

StringDecoder.prototype.end = utf8End;

// Returns only complete characters in a Buffer
StringDecoder.prototype.text = utf8Text;

// Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
StringDecoder.prototype.fillLast = function (buf) {
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
  this.lastNeed -= buf.length;
};

// Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
// continuation byte. If an invalid byte is detected, -2 is returned.
function utf8CheckByte(byte) {
  if (byte <= 0x7F) return 0;else if (byte >> 5 === 0x06) return 2;else if (byte >> 4 === 0x0E) return 3;else if (byte >> 3 === 0x1E) return 4;
  return byte >> 6 === 0x02 ? -1 : -2;
}

// Checks at most 3 bytes at the end of a Buffer in order to detect an
// incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
// needed to complete the UTF-8 character (if applicable) are returned.
function utf8CheckIncomplete(self, buf, i) {
  var j = buf.length - 1;
  if (j < i) return 0;
  var nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 1;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 2;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) {
      if (nb === 2) nb = 0;else self.lastNeed = nb - 3;
    }
    return nb;
  }
  return 0;
}

// Validates as many continuation bytes for a multi-byte UTF-8 character as
// needed or are available. If we see a non-continuation byte where we expect
// one, we "replace" the validated continuation bytes we've seen so far with
// a single UTF-8 replacement character ('\ufffd'), to match v8's UTF-8 decoding
// behavior. The continuation byte check is included three times in the case
// where all of the continuation bytes for a character exist in the same buffer.
// It is also done this way as a slight performance increase instead of using a
// loop.
function utf8CheckExtraBytes(self, buf, p) {
  if ((buf[0] & 0xC0) !== 0x80) {
    self.lastNeed = 0;
    return '\ufffd';
  }
  if (self.lastNeed > 1 && buf.length > 1) {
    if ((buf[1] & 0xC0) !== 0x80) {
      self.lastNeed = 1;
      return '\ufffd';
    }
    if (self.lastNeed > 2 && buf.length > 2) {
      if ((buf[2] & 0xC0) !== 0x80) {
        self.lastNeed = 2;
        return '\ufffd';
      }
    }
  }
}

// Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
function utf8FillLast(buf) {
  var p = this.lastTotal - this.lastNeed;
  var r = utf8CheckExtraBytes(this, buf, p);
  if (r !== undefined) return r;
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, p, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, p, 0, buf.length);
  this.lastNeed -= buf.length;
}

// Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
// partial character, the character's bytes are buffered until the required
// number of bytes are available.
function utf8Text(buf, i) {
  var total = utf8CheckIncomplete(this, buf, i);
  if (!this.lastNeed) return buf.toString('utf8', i);
  this.lastTotal = total;
  var end = buf.length - (total - this.lastNeed);
  buf.copy(this.lastChar, 0, end);
  return buf.toString('utf8', i, end);
}

// For UTF-8, a replacement character is added when ending on a partial
// character.
function utf8End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + '\ufffd';
  return r;
}

// UTF-16LE typically needs two bytes per character, but even if we have an even
// number of bytes available, we need to check if we end on a leading/high
// surrogate. In that case, we need to wait for the next two bytes in order to
// decode the last character properly.
function utf16Text(buf, i) {
  if ((buf.length - i) % 2 === 0) {
    var r = buf.toString('utf16le', i);
    if (r) {
      var c = r.charCodeAt(r.length - 1);
      if (c >= 0xD800 && c <= 0xDBFF) {
        this.lastNeed = 2;
        this.lastTotal = 4;
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
        return r.slice(0, -1);
      }
    }
    return r;
  }
  this.lastNeed = 1;
  this.lastTotal = 2;
  this.lastChar[0] = buf[buf.length - 1];
  return buf.toString('utf16le', i, buf.length - 1);
}

// For UTF-16LE we do not explicitly append special replacement characters if we
// end on a partial character, we simply let v8 handle that.
function utf16End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) {
    var end = this.lastTotal - this.lastNeed;
    return r + this.lastChar.toString('utf16le', 0, end);
  }
  return r;
}

function base64Text(buf, i) {
  var n = (buf.length - i) % 3;
  if (n === 0) return buf.toString('base64', i);
  this.lastNeed = 3 - n;
  this.lastTotal = 3;
  if (n === 1) {
    this.lastChar[0] = buf[buf.length - 1];
  } else {
    this.lastChar[0] = buf[buf.length - 2];
    this.lastChar[1] = buf[buf.length - 1];
  }
  return buf.toString('base64', i, buf.length - n);
}

function base64End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed);
  return r;
}

// Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
function simpleWrite(buf) {
  return buf.toString(this.encoding);
}

function simpleEnd(buf) {
  return buf && buf.length ? this.write(buf) : '';
}
},{"safe-buffer":94}],96:[function(_dereq_,module,exports){
exports = module.exports = _dereq_('./lib/_stream_readable.js');
exports.Stream = exports;
exports.Readable = exports;
exports.Writable = _dereq_('./lib/_stream_writable.js');
exports.Duplex = _dereq_('./lib/_stream_duplex.js');
exports.Transform = _dereq_('./lib/_stream_transform.js');
exports.PassThrough = _dereq_('./lib/_stream_passthrough.js');

},{"./lib/_stream_duplex.js":86,"./lib/_stream_passthrough.js":87,"./lib/_stream_readable.js":88,"./lib/_stream_transform.js":89,"./lib/_stream_writable.js":90}],97:[function(_dereq_,module,exports){
/**
 * request-frame - requestAnimationFrame & cancelAnimationFrame polyfill for optimal cross-browser development.
 * @version v1.5.3
 * @license MIT
 * Copyright Julien Etienne 2015 All Rights Reserved.
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.requestFrame = factory());
}(this, (function () { 'use strict';

/**
 * @param  {String} type - request | cancel | native.
 * @return {Function} Timing function.
 */
function requestFrame(type) {
    // The only vendor prefixes required.
    var vendors = ['moz', 'webkit'];

    // Disassembled timing function abbreviations.
    var aF = 'AnimationFrame';
    var rqAF = 'Request' + aF;

    // Checks for firefox 4 - 10 function pair mismatch.
    var mozRAF = window.mozRequestAnimationFrame;
    var mozCAF = window.mozCancelAnimationFrame;
    var hasMozMismatch = mozRAF && !mozCAF;

    // Final assigned functions.
    var assignedRequestAnimationFrame;
    var assignedCancelAnimationFrame;

    // Initial time of the timing lapse.
    var previousTime = 0;

    var requestFrameMain;

    // Date.now polyfill, mainly for legacy IE versions.
    if (!Date.now) {
        Date.now = function () {
            return new Date().getTime();
        };
    }

    /**
     * hasIOS6RequestAnimationFrameBug.
     * @See {@Link https://gist.github.com/julienetie/86ac394ec41f1271ff0a}
     * - for Commentary.
     * @Copyright 2015 - Julien Etienne. 
     * @License: MIT.
     */
    function hasIOS6RequestAnimationFrameBug() {
        var webkitRAF = window.webkitRequestAnimationFrame;
        var rAF = window.requestAnimationFrame;

        // CSS/ Device with max for iOS6 Devices.
        var hasMobileDeviceWidth = screen.width <= 768 ? true : false;

        // Only supports webkit prefixed requestAnimtionFrane.
        var requiresWebkitprefix = !(webkitRAF && rAF);

        // iOS6 webkit browsers don't support performance now.
        var hasNoNavigationTiming = window.performance ? false : true;

        var iOS6Notice = 'setTimeout is being used as a substitiue for \n            requestAnimationFrame due to a bug within iOS 6 builds';

        var hasIOS6Bug = requiresWebkitprefix && hasMobileDeviceWidth && hasNoNavigationTiming;

        var bugCheckresults = function bugCheckresults(timingFnA, timingFnB, notice) {
            if (timingFnA || timingFnB) {
                console.warn(notice);
                return true;
            } else {
                return false;
            }
        };

        var displayResults = function displayResults(hasBug, hasBugNotice, webkitFn, nativeFn) {
            if (hasBug) {
                return bugCheckresults(webkitFn, nativeFn, hasBugNotice);
            } else {
                return false;
            }
        };

        return displayResults(hasIOS6Bug, iOS6Notice, webkitRAF, rAF);
    }

    /**
     * Native clearTimeout function.
     * @return {Function}
     */
    function clearTimeoutWithId(id) {
        clearTimeout(id);
    }

    /**
     * Based on a polyfill by Erik, introduced by Paul Irish & 
     * further improved by Darius Bacon.
     * @see  {@link http://www.paulirish.com/2011/
     * requestanimationframe-for-smart-animating}
     * @see  {@link https://github.com/darius/requestAnimationFrame/blob/
     * master/requestAnimationFrame.js}
     * @callback {Number} Timestamp.
     * @return {Function} setTimeout Function.
     */
    function setTimeoutWithTimestamp(callback) {
        var immediateTime = Date.now();
        var lapsedTime = Math.max(previousTime + 16, immediateTime);
        return setTimeout(function () {
            callback(previousTime = lapsedTime);
        }, lapsedTime - immediateTime);
    }

    /**
     * Queries the native function, prefixed function 
     * or use the setTimeoutWithTimestamp function.
     * @return {Function}
     */
    function queryRequestAnimationFrame() {
        if (Array.prototype.filter) {
            assignedRequestAnimationFrame = window['request' + aF] || window[vendors.filter(function (vendor) {
                if (window[vendor + rqAF] !== undefined) return vendor;
            }) + rqAF] || setTimeoutWithTimestamp;
        } else {
            return setTimeoutWithTimestamp;
        }
        if (!hasIOS6RequestAnimationFrameBug()) {
            return assignedRequestAnimationFrame;
        } else {
            return setTimeoutWithTimestamp;
        }
    }

    /**
     * Queries the native function, prefixed function 
     * or use the clearTimeoutWithId function.
     * @return {Function}
     */
    function queryCancelAnimationFrame() {
        var cancellationNames = [];
        if (Array.prototype.map) {
            vendors.map(function (vendor) {
                return ['Cancel', 'CancelRequest'].map(function (cancellationNamePrefix) {
                    cancellationNames.push(vendor + cancellationNamePrefix + aF);
                });
            });
        } else {
            return clearTimeoutWithId;
        }

        /**
         * Checks for the prefixed cancelAnimationFrame implementation.
         * @param  {Array} prefixedNames - An array of the prefixed names. 
         * @param  {Number} i - Iteration start point.
         * @return {Function} prefixed cancelAnimationFrame function.
         */
        function prefixedCancelAnimationFrame(prefixedNames, i) {
            var cancellationFunction = void 0;
            for (; i < prefixedNames.length; i++) {
                if (window[prefixedNames[i]]) {
                    cancellationFunction = window[prefixedNames[i]];
                    break;
                }
            }
            return cancellationFunction;
        }

        // Use truthly function
        assignedCancelAnimationFrame = window['cancel' + aF] || prefixedCancelAnimationFrame(cancellationNames, 0) || clearTimeoutWithId;

        // Check for iOS 6 bug
        if (!hasIOS6RequestAnimationFrameBug()) {
            return assignedCancelAnimationFrame;
        } else {
            return clearTimeoutWithId;
        }
    }

    function getRequestFn() {
        if (hasMozMismatch) {
            return setTimeoutWithTimestamp;
        } else {
            return queryRequestAnimationFrame();
        }
    }

    function getCancelFn() {
        return queryCancelAnimationFrame();
    }

    function setNativeFn() {
        if (hasMozMismatch) {
            window.requestAnimationFrame = setTimeoutWithTimestamp;
            window.cancelAnimationFrame = clearTimeoutWithId;
        } else {
            window.requestAnimationFrame = queryRequestAnimationFrame();
            window.cancelAnimationFrame = queryCancelAnimationFrame();
        }
    }

    /**
     * The type value "request" singles out firefox 4 - 10 and 
     * assigns the setTimeout function if plausible.
     */

    switch (type) {
        case 'request':
        case '':
            requestFrameMain = getRequestFn();
            break;

        case 'cancel':
            requestFrameMain = getCancelFn();
            break;

        case 'native':
            setNativeFn();
            break;
        default:
            throw new Error('RequestFrame parameter is not a type.');
    }
    return requestFrameMain;
}

return requestFrame;

})));

},{}],98:[function(_dereq_,module,exports){
/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
/* eslint-disable node/no-deprecated-api */
var buffer = _dereq_('buffer')
var Buffer = buffer.Buffer

// alternative to using Object.keys for old browsers
function copyProps (src, dst) {
  for (var key in src) {
    dst[key] = src[key]
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports)
  exports.Buffer = SafeBuffer
}

function SafeBuffer (arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.prototype = Object.create(Buffer.prototype)

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer)

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  var buf = Buffer(size)
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding)
    } else {
      buf.fill(fill)
    }
  } else {
    buf.fill(0)
  }
  return buf
}

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return Buffer(size)
}

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return buffer.SlowBuffer(size)
}

},{"buffer":18}],99:[function(_dereq_,module,exports){
var hasProp = Object.prototype.hasOwnProperty;

function throwsMessage(err) {
	return '[Throws: ' + (err ? err.message : '?') + ']';
}

function safeGetValueFromPropertyOnObject(obj, property) {
	if (hasProp.call(obj, property)) {
		try {
			return obj[property];
		}
		catch (err) {
			return throwsMessage(err);
		}
	}

	return obj[property];
}

function ensureProperties(obj) {
	var seen = [ ]; // store references to objects we have seen before

	function visit(obj) {
		if (obj === null || typeof obj !== 'object') {
			return obj;
		}

		if (seen.indexOf(obj) !== -1) {
			return '[Circular]';
		}
		seen.push(obj);

		if (typeof obj.toJSON === 'function') {
			try {
				var fResult = visit(obj.toJSON());
				seen.pop();
				return fResult;
			} catch(err) {
				return throwsMessage(err);
			}
		}

		if (Array.isArray(obj)) {
			var aResult = obj.map(visit);
			seen.pop();
			return aResult;
		}

		var result = Object.keys(obj).reduce(function(result, prop) {
			// prevent faulty defined getter properties
			result[prop] = visit(safeGetValueFromPropertyOnObject(obj, prop));
			return result;
		}, {});
		seen.pop();
		return result;
	};

	return visit(obj);
}

module.exports = function(data, replacer, space) {
	return JSON.stringify(ensureProperties(data), replacer, space);
}

module.exports.ensureProperties = ensureProperties;

},{}],100:[function(_dereq_,module,exports){
'use strict';

var GetIntrinsic = _dereq_('get-intrinsic');
var define = _dereq_('define-data-property');
var hasDescriptors = _dereq_('has-property-descriptors')();
var gOPD = _dereq_('gopd');

var $TypeError = _dereq_('es-errors/type');
var $floor = GetIntrinsic('%Math.floor%');

/** @type {import('.')} */
module.exports = function setFunctionLength(fn, length) {
	if (typeof fn !== 'function') {
		throw new $TypeError('`fn` is not a function');
	}
	if (typeof length !== 'number' || length < 0 || length > 0xFFFFFFFF || $floor(length) !== length) {
		throw new $TypeError('`length` must be a positive 32-bit integer');
	}

	var loose = arguments.length > 2 && !!arguments[2];

	var functionLengthIsConfigurable = true;
	var functionLengthIsWritable = true;
	if ('length' in fn && gOPD) {
		var desc = gOPD(fn, 'length');
		if (desc && !desc.configurable) {
			functionLengthIsConfigurable = false;
		}
		if (desc && !desc.writable) {
			functionLengthIsWritable = false;
		}
	}

	if (functionLengthIsConfigurable || functionLengthIsWritable || !loose) {
		if (hasDescriptors) {
			define(/** @type {Parameters<define>[0]} */ (fn), 'length', length, true, true);
		} else {
			define(/** @type {Parameters<define>[0]} */ (fn), 'length', length);
		}
	}
	return fn;
};

},{"define-data-property":29,"es-errors/type":42,"get-intrinsic":51,"gopd":55,"has-property-descriptors":56}],101:[function(_dereq_,module,exports){
'use strict';

var GetIntrinsic = _dereq_('get-intrinsic');
var callBound = _dereq_('call-bind/callBound');
var inspect = _dereq_('object-inspect');

var $TypeError = _dereq_('es-errors/type');
var $WeakMap = GetIntrinsic('%WeakMap%', true);
var $Map = GetIntrinsic('%Map%', true);

var $weakMapGet = callBound('WeakMap.prototype.get', true);
var $weakMapSet = callBound('WeakMap.prototype.set', true);
var $weakMapHas = callBound('WeakMap.prototype.has', true);
var $mapGet = callBound('Map.prototype.get', true);
var $mapSet = callBound('Map.prototype.set', true);
var $mapHas = callBound('Map.prototype.has', true);

/*
* This function traverses the list returning the node corresponding to the given key.
*
* That node is also moved to the head of the list, so that if it's accessed again we don't need to traverse the whole list. By doing so, all the recently used nodes can be accessed relatively quickly.
*/
/** @type {import('.').listGetNode} */
var listGetNode = function (list, key) { // eslint-disable-line consistent-return
	/** @type {typeof list | NonNullable<(typeof list)['next']>} */
	var prev = list;
	/** @type {(typeof list)['next']} */
	var curr;
	for (; (curr = prev.next) !== null; prev = curr) {
		if (curr.key === key) {
			prev.next = curr.next;
			// eslint-disable-next-line no-extra-parens
			curr.next = /** @type {NonNullable<typeof list.next>} */ (list.next);
			list.next = curr; // eslint-disable-line no-param-reassign
			return curr;
		}
	}
};

/** @type {import('.').listGet} */
var listGet = function (objects, key) {
	var node = listGetNode(objects, key);
	return node && node.value;
};
/** @type {import('.').listSet} */
var listSet = function (objects, key, value) {
	var node = listGetNode(objects, key);
	if (node) {
		node.value = value;
	} else {
		// Prepend the new node to the beginning of the list
		objects.next = /** @type {import('.').ListNode<typeof value>} */ ({ // eslint-disable-line no-param-reassign, no-extra-parens
			key: key,
			next: objects.next,
			value: value
		});
	}
};
/** @type {import('.').listHas} */
var listHas = function (objects, key) {
	return !!listGetNode(objects, key);
};

/** @type {import('.')} */
module.exports = function getSideChannel() {
	/** @type {WeakMap<object, unknown>} */ var $wm;
	/** @type {Map<object, unknown>} */ var $m;
	/** @type {import('.').RootNode<unknown>} */ var $o;

	/** @type {import('.').Channel} */
	var channel = {
		assert: function (key) {
			if (!channel.has(key)) {
				throw new $TypeError('Side channel does not contain ' + inspect(key));
			}
		},
		get: function (key) { // eslint-disable-line consistent-return
			if ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {
				if ($wm) {
					return $weakMapGet($wm, key);
				}
			} else if ($Map) {
				if ($m) {
					return $mapGet($m, key);
				}
			} else {
				if ($o) { // eslint-disable-line no-lonely-if
					return listGet($o, key);
				}
			}
		},
		has: function (key) {
			if ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {
				if ($wm) {
					return $weakMapHas($wm, key);
				}
			} else if ($Map) {
				if ($m) {
					return $mapHas($m, key);
				}
			} else {
				if ($o) { // eslint-disable-line no-lonely-if
					return listHas($o, key);
				}
			}
			return false;
		},
		set: function (key, value) {
			if ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {
				if (!$wm) {
					$wm = new $WeakMap();
				}
				$weakMapSet($wm, key, value);
			} else if ($Map) {
				if (!$m) {
					$m = new $Map();
				}
				$mapSet($m, key, value);
			} else {
				if (!$o) {
					// Initialize the linked list as an empty node, so that we don't have to special-case handling of the first node: we can always refer to it as (previous node).next, instead of something like (list).head
					$o = { key: {}, next: null };
				}
				listSet($o, key, value);
			}
		}
	};
	return channel;
};

},{"call-bind/callBound":19,"es-errors/type":42,"get-intrinsic":51,"object-inspect":75}],102:[function(_dereq_,module,exports){
module.exports = shift

function shift (stream) {
  var rs = stream._readableState
  if (!rs) return null
  return (rs.objectMode || typeof stream._duplexState === 'number') ? stream.read() : stream.read(getStateLength(rs))
}

function getStateLength (state) {
  if (state.buffer.length) {
    var idx = state.bufferIndex || 0
    // Since node 6.3.0 state.buffer is a BufferList not an array
    if (state.buffer.head) {
      return state.buffer.head.data.length
    } else if (state.buffer.length - idx > 0 && state.buffer[idx]) {
      return state.buffer[idx].length
    }
  }

  return state.length
}

},{}],103:[function(_dereq_,module,exports){
"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function Agent() {
  this._defaults = [];
}
for (var _i = 0, _arr = ['use', 'on', 'once', 'set', 'query', 'type', 'accept', 'auth', 'withCredentials', 'sortQuery', 'retry', 'ok', 'redirects', 'timeout', 'buffer', 'serialize', 'parse', 'ca', 'key', 'pfx', 'cert', 'disableTLSCerts']; _i < _arr.length; _i++) {
  const fn = _arr[_i];
  // Default setting for all requests from this agent
  Agent.prototype[fn] = function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    this._defaults.push({
      fn,
      args
    });
    return this;
  };
}
Agent.prototype._setDefaults = function (request) {
  var _iterator = _createForOfIteratorHelper(this._defaults),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      const def = _step.value;
      request[def.fn](...def.args);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
};
module.exports = Agent;

},{}],104:[function(_dereq_,module,exports){
"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
/**
 * Root reference for iframes.
 */

let root;
if (typeof window !== 'undefined') {
  // Browser window
  root = window;
} else if (typeof self === 'undefined') {
  // Other environments
  console.warn('Using browser-only version of superagent in non-browser environment');
  root = void 0;
} else {
  // Web Worker
  root = self;
}
const Emitter = _dereq_('component-emitter');
const safeStringify = _dereq_('fast-safe-stringify');
const qs = _dereq_('qs');
const RequestBase = _dereq_('./request-base');
const _require = _dereq_('./utils'),
  isObject = _require.isObject,
  mixin = _require.mixin,
  hasOwn = _require.hasOwn;
const ResponseBase = _dereq_('./response-base');
const Agent = _dereq_('./agent-base');

/**
 * Noop.
 */

function noop() {}

/**
 * Expose `request`.
 */

module.exports = function (method, url) {
  // callback
  if (typeof url === 'function') {
    return new exports.Request('GET', method).end(url);
  }

  // url first
  if (arguments.length === 1) {
    return new exports.Request('GET', method);
  }
  return new exports.Request(method, url);
};
exports = module.exports;
const request = exports;
exports.Request = Request;

/**
 * Determine XHR.
 */

request.getXHR = () => {
  if (root.XMLHttpRequest) {
    return new root.XMLHttpRequest();
  }
  throw new Error('Browser-only version of superagent could not find XHR');
};

/**
 * Removes leading and trailing whitespace, added to support IE.
 *
 * @param {String} s
 * @return {String}
 * @api private
 */

const trim = ''.trim ? s => s.trim() : s => s.replace(/(^\s*|\s*$)/g, '');

/**
 * Serialize the given `obj`.
 *
 * @param {Object} obj
 * @return {String}
 * @api private
 */

function serialize(object) {
  if (!isObject(object)) return object;
  const pairs = [];
  for (const key in object) {
    if (hasOwn(object, key)) pushEncodedKeyValuePair(pairs, key, object[key]);
  }
  return pairs.join('&');
}

/**
 * Helps 'serialize' with serializing arrays.
 * Mutates the pairs array.
 *
 * @param {Array} pairs
 * @param {String} key
 * @param {Mixed} val
 */

function pushEncodedKeyValuePair(pairs, key, value) {
  if (value === undefined) return;
  if (value === null) {
    pairs.push(encodeURI(key));
    return;
  }
  if (Array.isArray(value)) {
    var _iterator = _createForOfIteratorHelper(value),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        const v = _step.value;
        pushEncodedKeyValuePair(pairs, key, v);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  } else if (isObject(value)) {
    for (const subkey in value) {
      if (hasOwn(value, subkey)) pushEncodedKeyValuePair(pairs, `${key}[${subkey}]`, value[subkey]);
    }
  } else {
    pairs.push(encodeURI(key) + '=' + encodeURIComponent(value));
  }
}

/**
 * Expose serialization method.
 */

request.serializeObject = serialize;

/**
 * Parse the given x-www-form-urlencoded `str`.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function parseString(string_) {
  const object = {};
  const pairs = string_.split('&');
  let pair;
  let pos;
  for (let i = 0, length_ = pairs.length; i < length_; ++i) {
    pair = pairs[i];
    pos = pair.indexOf('=');
    if (pos === -1) {
      object[decodeURIComponent(pair)] = '';
    } else {
      object[decodeURIComponent(pair.slice(0, pos))] = decodeURIComponent(pair.slice(pos + 1));
    }
  }
  return object;
}

/**
 * Expose parser.
 */

request.parseString = parseString;

/**
 * Default MIME type map.
 *
 *     superagent.types.xml = 'application/xml';
 *
 */

request.types = {
  html: 'text/html',
  json: 'application/json',
  xml: 'text/xml',
  urlencoded: 'application/x-www-form-urlencoded',
  form: 'application/x-www-form-urlencoded',
  'form-data': 'application/x-www-form-urlencoded'
};

/**
 * Default serialization map.
 *
 *     superagent.serialize['application/xml'] = function(obj){
 *       return 'generated xml here';
 *     };
 *
 */

request.serialize = {
  'application/x-www-form-urlencoded': qs.stringify,
  'application/json': safeStringify
};

/**
 * Default parsers.
 *
 *     superagent.parse['application/xml'] = function(str){
 *       return { object parsed from str };
 *     };
 *
 */

request.parse = {
  'application/x-www-form-urlencoded': parseString,
  'application/json': JSON.parse
};

/**
 * Parse the given header `str` into
 * an object containing the mapped fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function parseHeader(string_) {
  const lines = string_.split(/\r?\n/);
  const fields = {};
  let index;
  let line;
  let field;
  let value;
  for (let i = 0, length_ = lines.length; i < length_; ++i) {
    line = lines[i];
    index = line.indexOf(':');
    if (index === -1) {
      // could be empty line, just skip it
      continue;
    }
    field = line.slice(0, index).toLowerCase();
    value = trim(line.slice(index + 1));
    fields[field] = value;
  }
  return fields;
}

/**
 * Check if `mime` is json or has +json structured syntax suffix.
 *
 * @param {String} mime
 * @return {Boolean}
 * @api private
 */

function isJSON(mime) {
  // should match /json or +json
  // but not /json-seq
  return /[/+]json($|[^-\w])/i.test(mime);
}

/**
 * Initialize a new `Response` with the given `xhr`.
 *
 *  - set flags (.ok, .error, etc)
 *  - parse header
 *
 * Examples:
 *
 *  Aliasing `superagent` as `request` is nice:
 *
 *      request = superagent;
 *
 *  We can use the promise-like API, or pass callbacks:
 *
 *      request.get('/').end(function(res){});
 *      request.get('/', function(res){});
 *
 *  Sending data can be chained:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' })
 *        .end(function(res){});
 *
 *  Or passed to `.send()`:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' }, function(res){});
 *
 *  Or passed to `.post()`:
 *
 *      request
 *        .post('/user', { name: 'tj' })
 *        .end(function(res){});
 *
 * Or further reduced to a single call for simple cases:
 *
 *      request
 *        .post('/user', { name: 'tj' }, function(res){});
 *
 * @param {XMLHTTPRequest} xhr
 * @param {Object} options
 * @api private
 */

function Response(request_) {
  this.req = request_;
  this.xhr = this.req.xhr;
  // responseText is accessible only if responseType is '' or 'text' and on older browsers
  this.text = this.req.method !== 'HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text') || typeof this.xhr.responseType === 'undefined' ? this.xhr.responseText : null;
  this.statusText = this.req.xhr.statusText;
  let status = this.xhr.status;
  // handle IE9 bug: http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
  if (status === 1223) {
    status = 204;
  }
  this._setStatusProperties(status);
  this.headers = parseHeader(this.xhr.getAllResponseHeaders());
  this.header = this.headers;
  // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
  // getResponseHeader still works. so we get content-type even if getting
  // other headers fails.
  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
  this._setHeaderProperties(this.header);
  if (this.text === null && request_._responseType) {
    this.body = this.xhr.response;
  } else {
    this.body = this.req.method === 'HEAD' ? null : this._parseBody(this.text ? this.text : this.xhr.response);
  }
}
mixin(Response.prototype, ResponseBase.prototype);

/**
 * Parse the given body `str`.
 *
 * Used for auto-parsing of bodies. Parsers
 * are defined on the `superagent.parse` object.
 *
 * @param {String} str
 * @return {Mixed}
 * @api private
 */

Response.prototype._parseBody = function (string_) {
  let parse = request.parse[this.type];
  if (this.req._parser) {
    return this.req._parser(this, string_);
  }
  if (!parse && isJSON(this.type)) {
    parse = request.parse['application/json'];
  }
  return parse && string_ && (string_.length > 0 || string_ instanceof Object) ? parse(string_) : null;
};

/**
 * Return an `Error` representative of this response.
 *
 * @return {Error}
 * @api public
 */

Response.prototype.toError = function () {
  const req = this.req;
  const method = req.method;
  const url = req.url;
  const message = `cannot ${method} ${url} (${this.status})`;
  const error = new Error(message);
  error.status = this.status;
  error.method = method;
  error.url = url;
  return error;
};

/**
 * Expose `Response`.
 */

request.Response = Response;

/**
 * Initialize a new `Request` with the given `method` and `url`.
 *
 * @param {String} method
 * @param {String} url
 * @api public
 */

function Request(method, url) {
  const self = this;
  this._query = this._query || [];
  this.method = method;
  this.url = url;
  this.header = {}; // preserves header name case
  this._header = {}; // coerces header names to lowercase
  this.on('end', () => {
    let error = null;
    let res = null;
    try {
      res = new Response(self);
    } catch (err) {
      error = new Error('Parser is unable to parse the response');
      error.parse = true;
      error.original = err;
      // issue #675: return the raw response if the response parsing fails
      if (self.xhr) {
        // ie9 doesn't have 'response' property
        error.rawResponse = typeof self.xhr.responseType === 'undefined' ? self.xhr.responseText : self.xhr.response;
        // issue #876: return the http status code if the response parsing fails
        error.status = self.xhr.status ? self.xhr.status : null;
        error.statusCode = error.status; // backwards-compat only
      } else {
        error.rawResponse = null;
        error.status = null;
      }
      return self.callback(error);
    }
    self.emit('response', res);
    let new_error;
    try {
      if (!self._isResponseOK(res)) {
        new_error = new Error(res.statusText || res.text || 'Unsuccessful HTTP response');
      }
    } catch (err) {
      new_error = err; // ok() callback can throw
    }

    // #1000 don't catch errors from the callback to avoid double calling it
    if (new_error) {
      new_error.original = error;
      new_error.response = res;
      new_error.status = new_error.status || res.status;
      self.callback(new_error, res);
    } else {
      self.callback(null, res);
    }
  });
}

/**
 * Mixin `Emitter` and `RequestBase`.
 */

// eslint-disable-next-line new-cap
Emitter(Request.prototype);
mixin(Request.prototype, RequestBase.prototype);

/**
 * Set Content-Type to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.xml = 'application/xml';
 *
 *      request.post('/')
 *        .type('xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 *      request.post('/')
 *        .type('application/xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 * @param {String} type
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.type = function (type) {
  this.set('Content-Type', request.types[type] || type);
  return this;
};

/**
 * Set Accept to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.json = 'application/json';
 *
 *      request.get('/agent')
 *        .accept('json')
 *        .end(callback);
 *
 *      request.get('/agent')
 *        .accept('application/json')
 *        .end(callback);
 *
 * @param {String} accept
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.accept = function (type) {
  this.set('Accept', request.types[type] || type);
  return this;
};

/**
 * Set Authorization field value with `user` and `pass`.
 *
 * @param {String} user
 * @param {String} [pass] optional in case of using 'bearer' as type
 * @param {Object} options with 'type' property 'auto', 'basic' or 'bearer' (default 'basic')
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.auth = function (user, pass, options) {
  if (arguments.length === 1) pass = '';
  if (typeof pass === 'object' && pass !== null) {
    // pass is optional and can be replaced with options
    options = pass;
    pass = '';
  }
  if (!options) {
    options = {
      type: typeof btoa === 'function' ? 'basic' : 'auto'
    };
  }
  const encoder = options.encoder ? options.encoder : string => {
    if (typeof btoa === 'function') {
      return btoa(string);
    }
    throw new Error('Cannot use basic auth, btoa is not a function');
  };
  return this._auth(user, pass, options, encoder);
};

/**
 * Add query-string `val`.
 *
 * Examples:
 *
 *   request.get('/shoes')
 *     .query('size=10')
 *     .query({ color: 'blue' })
 *
 * @param {Object|String} val
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.query = function (value) {
  if (typeof value !== 'string') value = serialize(value);
  if (value) this._query.push(value);
  return this;
};

/**
 * Queue the given `file` as an attachment to the specified `field`,
 * with optional `options` (or filename).
 *
 * ``` js
 * request.post('/upload')
 *   .attach('content', new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
 *   .end(callback);
 * ```
 *
 * @param {String} field
 * @param {Blob|File} file
 * @param {String|Object} options
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.attach = function (field, file, options) {
  if (file) {
    if (this._data) {
      throw new Error("superagent can't mix .send() and .attach()");
    }
    this._getFormData().append(field, file, options || file.name);
  }
  return this;
};
Request.prototype._getFormData = function () {
  if (!this._formData) {
    this._formData = new root.FormData();
  }
  return this._formData;
};

/**
 * Invoke the callback with `err` and `res`
 * and handle arity check.
 *
 * @param {Error} err
 * @param {Response} res
 * @api private
 */

Request.prototype.callback = function (error, res) {
  if (this._shouldRetry(error, res)) {
    return this._retry();
  }
  const fn = this._callback;
  this.clearTimeout();
  if (error) {
    if (this._maxRetries) error.retries = this._retries - 1;
    this.emit('error', error);
  }
  fn(error, res);
};

/**
 * Invoke callback with x-domain error.
 *
 * @api private
 */

Request.prototype.crossDomainError = function () {
  const error = new Error('Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.');
  error.crossDomain = true;
  error.status = this.status;
  error.method = this.method;
  error.url = this.url;
  this.callback(error);
};

// This only warns, because the request is still likely to work
Request.prototype.agent = function () {
  console.warn('This is not supported in browser version of superagent');
  return this;
};
Request.prototype.ca = Request.prototype.agent;
Request.prototype.buffer = Request.prototype.ca;

// This throws, because it can't send/receive data as expected
Request.prototype.write = () => {
  throw new Error('Streaming is not supported in browser version of superagent');
};
Request.prototype.pipe = Request.prototype.write;

/**
 * Check if `obj` is a host object,
 * we don't want to serialize these :)
 *
 * @param {Object} obj host object
 * @return {Boolean} is a host object
 * @api private
 */
Request.prototype._isHost = function (object) {
  // Native objects stringify to [object File], [object Blob], [object FormData], etc.
  return object && typeof object === 'object' && !Array.isArray(object) && Object.prototype.toString.call(object) !== '[object Object]';
};

/**
 * Initiate request, invoking callback `fn(res)`
 * with an instanceof `Response`.
 *
 * @param {Function} fn
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.end = function (fn) {
  if (this._endCalled) {
    console.warn('Warning: .end() was called twice. This is not supported in superagent');
  }
  this._endCalled = true;

  // store callback
  this._callback = fn || noop;

  // querystring
  this._finalizeQueryString();
  this._end();
};
Request.prototype._setUploadTimeout = function () {
  const self = this;

  // upload timeout it's wokrs only if deadline timeout is off
  if (this._uploadTimeout && !this._uploadTimeoutTimer) {
    this._uploadTimeoutTimer = setTimeout(() => {
      self._timeoutError('Upload timeout of ', self._uploadTimeout, 'ETIMEDOUT');
    }, this._uploadTimeout);
  }
};

// eslint-disable-next-line complexity
Request.prototype._end = function () {
  if (this._aborted) return this.callback(new Error('The request has been aborted even before .end() was called'));
  const self = this;
  this.xhr = request.getXHR();
  const xhr = this.xhr;
  let data = this._formData || this._data;
  this._setTimeouts();

  // state change
  xhr.addEventListener('readystatechange', () => {
    const readyState = xhr.readyState;
    if (readyState >= 2 && self._responseTimeoutTimer) {
      clearTimeout(self._responseTimeoutTimer);
    }
    if (readyState !== 4) {
      return;
    }

    // In IE9, reads to any property (e.g. status) off of an aborted XHR will
    // result in the error "Could not complete the operation due to error c00c023f"
    let status;
    try {
      status = xhr.status;
    } catch (err) {
      status = 0;
    }
    if (!status) {
      if (self.timedout || self._aborted) return;
      return self.crossDomainError();
    }
    self.emit('end');
  });

  // progress
  const handleProgress = (direction, e) => {
    if (e.total > 0) {
      e.percent = e.loaded / e.total * 100;
      if (e.percent === 100) {
        clearTimeout(self._uploadTimeoutTimer);
      }
    }
    e.direction = direction;
    self.emit('progress', e);
  };
  if (this.hasListeners('progress')) {
    try {
      xhr.addEventListener('progress', handleProgress.bind(null, 'download'));
      if (xhr.upload) {
        xhr.upload.addEventListener('progress', handleProgress.bind(null, 'upload'));
      }
    } catch (err) {
      // Accessing xhr.upload fails in IE from a web worker, so just pretend it doesn't exist.
      // Reported here:
      // https://connect.microsoft.com/IE/feedback/details/837245/xmlhttprequest-upload-throws-invalid-argument-when-used-from-web-worker-context
    }
  }
  if (xhr.upload) {
    this._setUploadTimeout();
  }

  // initiate request
  try {
    if (this.username && this.password) {
      xhr.open(this.method, this.url, true, this.username, this.password);
    } else {
      xhr.open(this.method, this.url, true);
    }
  } catch (err) {
    // see #1149
    return this.callback(err);
  }

  // CORS
  if (this._withCredentials) xhr.withCredentials = true;

  // body
  if (!this._formData && this.method !== 'GET' && this.method !== 'HEAD' && typeof data !== 'string' && !this._isHost(data)) {
    // serialize stuff
    const contentType = this._header['content-type'];
    let serialize = this._serializer || request.serialize[contentType ? contentType.split(';')[0] : ''];
    if (!serialize && isJSON(contentType)) {
      serialize = request.serialize['application/json'];
    }
    if (serialize) data = serialize(data);
  }

  // set header fields
  for (const field in this.header) {
    if (this.header[field] === null) continue;
    if (hasOwn(this.header, field)) xhr.setRequestHeader(field, this.header[field]);
  }
  if (this._responseType) {
    xhr.responseType = this._responseType;
  }

  // send stuff
  this.emit('request', this);

  // IE11 xhr.send(undefined) sends 'undefined' string as POST payload (instead of nothing)
  // We need null here if data is undefined
  xhr.send(typeof data === 'undefined' ? null : data);
};
request.agent = () => new Agent();
for (var _i = 0, _arr = ['GET', 'POST', 'OPTIONS', 'PATCH', 'PUT', 'DELETE']; _i < _arr.length; _i++) {
  const method = _arr[_i];
  Agent.prototype[method.toLowerCase()] = function (url, fn) {
    const request_ = new request.Request(method, url);
    this._setDefaults(request_);
    if (fn) {
      request_.end(fn);
    }
    return request_;
  };
}
Agent.prototype.del = Agent.prototype.delete;

/**
 * GET `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.get = (url, data, fn) => {
  const request_ = request('GET', url);
  if (typeof data === 'function') {
    fn = data;
    data = null;
  }
  if (data) request_.query(data);
  if (fn) request_.end(fn);
  return request_;
};

/**
 * HEAD `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.head = (url, data, fn) => {
  const request_ = request('HEAD', url);
  if (typeof data === 'function') {
    fn = data;
    data = null;
  }
  if (data) request_.query(data);
  if (fn) request_.end(fn);
  return request_;
};

/**
 * OPTIONS query to `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.options = (url, data, fn) => {
  const request_ = request('OPTIONS', url);
  if (typeof data === 'function') {
    fn = data;
    data = null;
  }
  if (data) request_.send(data);
  if (fn) request_.end(fn);
  return request_;
};

/**
 * DELETE `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

function del(url, data, fn) {
  const request_ = request('DELETE', url);
  if (typeof data === 'function') {
    fn = data;
    data = null;
  }
  if (data) request_.send(data);
  if (fn) request_.end(fn);
  return request_;
}
request.del = del;
request.delete = del;

/**
 * PATCH `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.patch = (url, data, fn) => {
  const request_ = request('PATCH', url);
  if (typeof data === 'function') {
    fn = data;
    data = null;
  }
  if (data) request_.send(data);
  if (fn) request_.end(fn);
  return request_;
};

/**
 * POST `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.post = (url, data, fn) => {
  const request_ = request('POST', url);
  if (typeof data === 'function') {
    fn = data;
    data = null;
  }
  if (data) request_.send(data);
  if (fn) request_.end(fn);
  return request_;
};

/**
 * PUT `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.put = (url, data, fn) => {
  const request_ = request('PUT', url);
  if (typeof data === 'function') {
    fn = data;
    data = null;
  }
  if (data) request_.send(data);
  if (fn) request_.end(fn);
  return request_;
};

},{"./agent-base":103,"./request-base":105,"./response-base":106,"./utils":107,"component-emitter":24,"fast-safe-stringify":45,"qs":81}],105:[function(_dereq_,module,exports){
(function (process){(function (){
"use strict";

const semver = _dereq_('semver');

/**
 * Module of mixed-in functions shared between node and client code
 */
const _require = _dereq_('./utils'),
  isObject = _require.isObject,
  hasOwn = _require.hasOwn;

/**
 * Expose `RequestBase`.
 */

module.exports = RequestBase;

/**
 * Initialize a new `RequestBase`.
 *
 * @api public
 */

function RequestBase() {}

/**
 * Clear previous timeout.
 *
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.clearTimeout = function () {
  clearTimeout(this._timer);
  clearTimeout(this._responseTimeoutTimer);
  clearTimeout(this._uploadTimeoutTimer);
  delete this._timer;
  delete this._responseTimeoutTimer;
  delete this._uploadTimeoutTimer;
  return this;
};

/**
 * Override default response body parser
 *
 * This function will be called to convert incoming data into request.body
 *
 * @param {Function}
 * @api public
 */

RequestBase.prototype.parse = function (fn) {
  this._parser = fn;
  return this;
};

/**
 * Set format of binary response body.
 * In browser valid formats are 'blob' and 'arraybuffer',
 * which return Blob and ArrayBuffer, respectively.
 *
 * In Node all values result in Buffer.
 *
 * Examples:
 *
 *      req.get('/')
 *        .responseType('blob')
 *        .end(callback);
 *
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.responseType = function (value) {
  this._responseType = value;
  return this;
};

/**
 * Override default request body serializer
 *
 * This function will be called to convert data set via .send or .attach into payload to send
 *
 * @param {Function}
 * @api public
 */

RequestBase.prototype.serialize = function (fn) {
  this._serializer = fn;
  return this;
};

/**
 * Set timeouts.
 *
 * - response timeout is time between sending request and receiving the first byte of the response. Includes DNS and connection time.
 * - deadline is the time from start of the request to receiving response body in full. If the deadline is too short large files may not load at all on slow connections.
 * - upload is the time  since last bit of data was sent or received. This timeout works only if deadline timeout is off
 *
 * Value of 0 or false means no timeout.
 *
 * @param {Number|Object} ms or {response, deadline}
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.timeout = function (options) {
  if (!options || typeof options !== 'object') {
    this._timeout = options;
    this._responseTimeout = 0;
    this._uploadTimeout = 0;
    return this;
  }
  for (const option in options) {
    if (hasOwn(options, option)) {
      switch (option) {
        case 'deadline':
          this._timeout = options.deadline;
          break;
        case 'response':
          this._responseTimeout = options.response;
          break;
        case 'upload':
          this._uploadTimeout = options.upload;
          break;
        default:
          console.warn('Unknown timeout option', option);
      }
    }
  }
  return this;
};

/**
 * Set number of retry attempts on error.
 *
 * Failed requests will be retried 'count' times if timeout or err.code >= 500.
 *
 * @param {Number} count
 * @param {Function} [fn]
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.retry = function (count, fn) {
  // Default to 1 if no count passed or true
  if (arguments.length === 0 || count === true) count = 1;
  if (count <= 0) count = 0;
  this._maxRetries = count;
  this._retries = 0;
  this._retryCallback = fn;
  return this;
};

//
// NOTE: we do not include ESOCKETTIMEDOUT because that is from `request` package
//       <https://github.com/sindresorhus/got/pull/537>
//
// NOTE: we do not include EADDRINFO because it was removed from libuv in 2014
//       <https://github.com/libuv/libuv/commit/02e1ebd40b807be5af46343ea873331b2ee4e9c1>
//       <https://github.com/request/request/search?q=ESOCKETTIMEDOUT&unscoped_q=ESOCKETTIMEDOUT>
//
//
// TODO: expose these as configurable defaults
//
const ERROR_CODES = new Set(['ETIMEDOUT', 'ECONNRESET', 'EADDRINUSE', 'ECONNREFUSED', 'EPIPE', 'ENOTFOUND', 'ENETUNREACH', 'EAI_AGAIN']);
const STATUS_CODES = new Set([408, 413, 429, 500, 502, 503, 504, 521, 522, 524]);

// TODO: we would need to make this easily configurable before adding it in (e.g. some might want to add POST)
// const METHODS = new Set(['GET', 'PUT', 'HEAD', 'DELETE', 'OPTIONS', 'TRACE']);

/**
 * Determine if a request should be retried.
 * (Inspired by https://github.com/sindresorhus/got#retry)
 *
 * @param {Error} err an error
 * @param {Response} [res] response
 * @returns {Boolean} if segment should be retried
 */
RequestBase.prototype._shouldRetry = function (error, res) {
  if (!this._maxRetries || this._retries++ >= this._maxRetries) {
    return false;
  }
  if (this._retryCallback) {
    try {
      const override = this._retryCallback(error, res);
      if (override === true) return true;
      if (override === false) return false;
      // undefined falls back to defaults
    } catch (err) {
      console.error(err);
    }
  }

  // TODO: we would need to make this easily configurable before adding it in (e.g. some might want to add POST)
  /*
  if (
    this.req &&
    this.req.method &&
    !METHODS.has(this.req.method.toUpperCase())
  )
    return false;
  */
  if (res && res.status && STATUS_CODES.has(res.status)) return true;
  if (error) {
    if (error.code && ERROR_CODES.has(error.code)) return true;
    // Superagent timeout
    if (error.timeout && error.code === 'ECONNABORTED') return true;
    if (error.crossDomain) return true;
  }
  return false;
};

/**
 * Retry request
 *
 * @return {Request} for chaining
 * @api private
 */

RequestBase.prototype._retry = function () {
  this.clearTimeout();

  // node
  if (this.req) {
    this.req = null;
    this.req = this.request();
  }
  this._aborted = false;
  this.timedout = false;
  this.timedoutError = null;
  return this._end();
};

/**
 * Promise support
 *
 * @param {Function} resolve
 * @param {Function} [reject]
 * @return {Request}
 */

RequestBase.prototype.then = function (resolve, reject) {
  if (!this._fullfilledPromise) {
    const self = this;
    if (this._endCalled) {
      console.warn('Warning: superagent request was sent twice, because both .end() and .then() were called. Never call .end() if you use promises');
    }
    this._fullfilledPromise = new Promise((resolve, reject) => {
      self.on('abort', () => {
        if (this._maxRetries && this._maxRetries > this._retries) {
          return;
        }
        if (this.timedout && this.timedoutError) {
          reject(this.timedoutError);
          return;
        }
        const error = new Error('Aborted');
        error.code = 'ABORTED';
        error.status = this.status;
        error.method = this.method;
        error.url = this.url;
        reject(error);
      });
      self.end((error, res) => {
        if (error) reject(error);else resolve(res);
      });
    });
  }
  return this._fullfilledPromise.then(resolve, reject);
};
RequestBase.prototype.catch = function (callback) {
  return this.then(undefined, callback);
};

/**
 * Allow for extension
 */

RequestBase.prototype.use = function (fn) {
  fn(this);
  return this;
};
RequestBase.prototype.ok = function (callback) {
  if (typeof callback !== 'function') throw new Error('Callback required');
  this._okCallback = callback;
  return this;
};
RequestBase.prototype._isResponseOK = function (res) {
  if (!res) {
    return false;
  }
  if (this._okCallback) {
    return this._okCallback(res);
  }
  return res.status >= 200 && res.status < 300;
};

/**
 * Get request header `field`.
 * Case-insensitive.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

RequestBase.prototype.get = function (field) {
  return this._header[field.toLowerCase()];
};

/**
 * Get case-insensitive header `field` value.
 * This is a deprecated internal API. Use `.get(field)` instead.
 *
 * (getHeader is no longer used internally by the superagent code base)
 *
 * @param {String} field
 * @return {String}
 * @api private
 * @deprecated
 */

RequestBase.prototype.getHeader = RequestBase.prototype.get;

/**
 * Set header `field` to `val`, or multiple fields with one object.
 * Case-insensitive.
 *
 * Examples:
 *
 *      req.get('/')
 *        .set('Accept', 'application/json')
 *        .set('X-API-Key', 'foobar')
 *        .end(callback);
 *
 *      req.get('/')
 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
 *        .end(callback);
 *
 * @param {String|Object} field
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.set = function (field, value) {
  if (isObject(field)) {
    for (const key in field) {
      if (hasOwn(field, key)) this.set(key, field[key]);
    }
    return this;
  }
  this._header[field.toLowerCase()] = value;
  this.header[field] = value;
  return this;
};

/**
 * Remove header `field`.
 * Case-insensitive.
 *
 * Example:
 *
 *      req.get('/')
 *        .unset('User-Agent')
 *        .end(callback);
 *
 * @param {String} field field name
 */
RequestBase.prototype.unset = function (field) {
  delete this._header[field.toLowerCase()];
  delete this.header[field];
  return this;
};

/**
 * Write the field `name` and `val`, or multiple fields with one object
 * for "multipart/form-data" request bodies.
 *
 * ``` js
 * request.post('/upload')
 *   .field('foo', 'bar')
 *   .end(callback);
 *
 * request.post('/upload')
 *   .field({ foo: 'bar', baz: 'qux' })
 *   .end(callback);
 * ```
 *
 * @param {String|Object} name name of field
 * @param {String|Blob|File|Buffer|fs.ReadStream} val value of field
 * @param {String} options extra options, e.g. 'blob'
 * @return {Request} for chaining
 * @api public
 */
RequestBase.prototype.field = function (name, value, options) {
  // name should be either a string or an object.
  if (name === null || undefined === name) {
    throw new Error('.field(name, val) name can not be empty');
  }
  if (this._data) {
    throw new Error(".field() can't be used if .send() is used. Please use only .send() or only .field() & .attach()");
  }
  if (isObject(name)) {
    for (const key in name) {
      if (hasOwn(name, key)) this.field(key, name[key]);
    }
    return this;
  }
  if (Array.isArray(value)) {
    for (const i in value) {
      if (hasOwn(value, i)) this.field(name, value[i]);
    }
    return this;
  }

  // val should be defined now
  if (value === null || undefined === value) {
    throw new Error('.field(name, val) val can not be empty');
  }
  if (typeof value === 'boolean') {
    value = String(value);
  }

  // fix https://github.com/ladjs/superagent/issues/1680
  if (options) this._getFormData().append(name, value, options);else this._getFormData().append(name, value);
  return this;
};

/**
 * Abort the request, and clear potential timeout.
 *
 * @return {Request} request
 * @api public
 */
RequestBase.prototype.abort = function () {
  if (this._aborted) {
    return this;
  }
  this._aborted = true;
  if (this.xhr) this.xhr.abort(); // browser
  if (this.req) {
    // Node v13 has major differences in `abort()`
    // https://github.com/nodejs/node/blob/v12.x/lib/internal/streams/end-of-stream.js
    // https://github.com/nodejs/node/blob/v13.x/lib/internal/streams/end-of-stream.js
    // https://github.com/nodejs/node/blob/v14.x/lib/internal/streams/end-of-stream.js
    // (if you run a diff across these you will see the differences)
    //
    // References:
    // <https://github.com/nodejs/node/issues/31630>
    // <https://github.com/ladjs/superagent/pull/1084/commits/dc18679a7c5ccfc6046d882015e5126888973bc8>
    //
    // Thanks to @shadowgate15 and @niftylettuce
    if (semver.gte(process.version, 'v13.0.0') && semver.lt(process.version, 'v14.0.0')) {
      // Note that the reason this doesn't work is because in v13 as compared to v14
      // there is no `callback = nop` set in end-of-stream.js above
      throw new Error('Superagent does not work in v13 properly with abort() due to Node.js core changes');
    }
    this.req.abort(); // node
  }

  this.clearTimeout();
  this.emit('abort');
  return this;
};
RequestBase.prototype._auth = function (user, pass, options, base64Encoder) {
  switch (options.type) {
    case 'basic':
      this.set('Authorization', `Basic ${base64Encoder(`${user}:${pass}`)}`);
      break;
    case 'auto':
      this.username = user;
      this.password = pass;
      break;
    case 'bearer':
      // usage would be .auth(accessToken, { type: 'bearer' })
      this.set('Authorization', `Bearer ${user}`);
      break;
    default:
      break;
  }
  return this;
};

/**
 * Enable transmission of cookies with x-domain requests.
 *
 * Note that for this to work the origin must not be
 * using "Access-Control-Allow-Origin" with a wildcard,
 * and also must set "Access-Control-Allow-Credentials"
 * to "true".
 * @param {Boolean} [on=true] - Set 'withCredentials' state
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.withCredentials = function (on) {
  // This is browser-only functionality. Node side is no-op.
  if (on === undefined) on = true;
  this._withCredentials = on;
  return this;
};

/**
 * Set the max redirects to `n`. Does nothing in browser XHR implementation.
 *
 * @param {Number} n
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.redirects = function (n) {
  this._maxRedirects = n;
  return this;
};

/**
 * Maximum size of buffered response body, in bytes. Counts uncompressed size.
 * Default 200MB.
 *
 * @param {Number} n number of bytes
 * @return {Request} for chaining
 */
RequestBase.prototype.maxResponseSize = function (n) {
  if (typeof n !== 'number') {
    throw new TypeError('Invalid argument');
  }
  this._maxResponseSize = n;
  return this;
};

/**
 * Convert to a plain javascript object (not JSON string) of scalar properties.
 * Note as this method is designed to return a useful non-this value,
 * it cannot be chained.
 *
 * @return {Object} describing method, url, and data of this request
 * @api public
 */

RequestBase.prototype.toJSON = function () {
  return {
    method: this.method,
    url: this.url,
    data: this._data,
    headers: this._header
  };
};

/**
 * Send `data` as the request body, defaulting the `.type()` to "json" when
 * an object is given.
 *
 * Examples:
 *
 *       // manual json
 *       request.post('/user')
 *         .type('json')
 *         .send('{"name":"tj"}')
 *         .end(callback)
 *
 *       // auto json
 *       request.post('/user')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // manual x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send('name=tj')
 *         .end(callback)
 *
 *       // auto x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // defaults to x-www-form-urlencoded
 *      request.post('/user')
 *        .send('name=tobi')
 *        .send('species=ferret')
 *        .end(callback)
 *
 * @param {String|Object} data
 * @return {Request} for chaining
 * @api public
 */

// eslint-disable-next-line complexity
RequestBase.prototype.send = function (data) {
  const isObject_ = isObject(data);
  let type = this._header['content-type'];
  if (this._formData) {
    throw new Error(".send() can't be used if .attach() or .field() is used. Please use only .send() or only .field() & .attach()");
  }
  if (isObject_ && !this._data) {
    if (Array.isArray(data)) {
      this._data = [];
    } else if (!this._isHost(data)) {
      this._data = {};
    }
  } else if (data && this._data && this._isHost(this._data)) {
    throw new Error("Can't merge these send calls");
  }

  // merge
  if (isObject_ && isObject(this._data)) {
    for (const key in data) {
      if (typeof data[key] == 'bigint' && !data[key].toJSON) throw new Error('Cannot serialize BigInt value to json');
      if (hasOwn(data, key)) this._data[key] = data[key];
    }
  } else if (typeof data === 'bigint') throw new Error("Cannot send value of type BigInt");else if (typeof data === 'string') {
    // default to x-www-form-urlencoded
    if (!type) this.type('form');
    type = this._header['content-type'];
    if (type) type = type.toLowerCase().trim();
    if (type === 'application/x-www-form-urlencoded') {
      this._data = this._data ? `${this._data}&${data}` : data;
    } else {
      this._data = (this._data || '') + data;
    }
  } else {
    this._data = data;
  }
  if (!isObject_ || this._isHost(data)) {
    return this;
  }

  // default to json
  if (!type) this.type('json');
  return this;
};

/**
 * Sort `querystring` by the sort function
 *
 *
 * Examples:
 *
 *       // default order
 *       request.get('/user')
 *         .query('name=Nick')
 *         .query('search=Manny')
 *         .sortQuery()
 *         .end(callback)
 *
 *       // customized sort function
 *       request.get('/user')
 *         .query('name=Nick')
 *         .query('search=Manny')
 *         .sortQuery(function(a, b){
 *           return a.length - b.length;
 *         })
 *         .end(callback)
 *
 *
 * @param {Function} sort
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.sortQuery = function (sort) {
  // _sort default to true but otherwise can be a function or boolean
  this._sort = typeof sort === 'undefined' ? true : sort;
  return this;
};

/**
 * Compose querystring to append to req.url
 *
 * @api private
 */
RequestBase.prototype._finalizeQueryString = function () {
  const query = this._query.join('&');
  if (query) {
    this.url += (this.url.includes('?') ? '&' : '?') + query;
  }
  this._query.length = 0; // Makes the call idempotent

  if (this._sort) {
    const index = this.url.indexOf('?');
    if (index >= 0) {
      const queryArray = this.url.slice(index + 1).split('&');
      if (typeof this._sort === 'function') {
        queryArray.sort(this._sort);
      } else {
        queryArray.sort();
      }
      this.url = this.url.slice(0, index) + '?' + queryArray.join('&');
    }
  }
};

// For backwards compat only
RequestBase.prototype._appendQueryString = () => {
  console.warn('Unsupported');
};

/**
 * Invoke callback with timeout error.
 *
 * @api private
 */

RequestBase.prototype._timeoutError = function (reason, timeout, errno) {
  if (this._aborted) {
    return;
  }
  const error = new Error(`${reason + timeout}ms exceeded`);
  error.timeout = timeout;
  error.code = 'ECONNABORTED';
  error.errno = errno;
  this.timedout = true;
  this.timedoutError = error;
  this.abort();
  this.callback(error);
};
RequestBase.prototype._setTimeouts = function () {
  const self = this;

  // deadline
  if (this._timeout && !this._timer) {
    this._timer = setTimeout(() => {
      self._timeoutError('Timeout of ', self._timeout, 'ETIME');
    }, this._timeout);
  }

  // response timeout
  if (this._responseTimeout && !this._responseTimeoutTimer) {
    this._responseTimeoutTimer = setTimeout(() => {
      self._timeoutError('Response timeout of ', self._responseTimeout, 'ETIMEDOUT');
    }, this._responseTimeout);
  }
};

}).call(this)}).call(this,_dereq_('_process'))
},{"./utils":107,"_process":79,"semver":16}],106:[function(_dereq_,module,exports){
"use strict";

/**
 * Module dependencies.
 */

const utils = _dereq_('./utils');

/**
 * Expose `ResponseBase`.
 */

module.exports = ResponseBase;

/**
 * Initialize a new `ResponseBase`.
 *
 * @api public
 */

function ResponseBase() {}

/**
 * Get case-insensitive `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

ResponseBase.prototype.get = function (field) {
  return this.header[field.toLowerCase()];
};

/**
 * Set header related properties:
 *
 *   - `.type` the content type without params
 *
 * A response of "Content-Type: text/plain; charset=utf-8"
 * will provide you with a `.type` of "text/plain".
 *
 * @param {Object} header
 * @api private
 */

ResponseBase.prototype._setHeaderProperties = function (header) {
  // TODO: moar!
  // TODO: make this a util

  // content-type
  const ct = header['content-type'] || '';
  this.type = utils.type(ct);

  // params
  const parameters = utils.params(ct);
  for (const key in parameters) {
    if (Object.prototype.hasOwnProperty.call(parameters, key)) this[key] = parameters[key];
  }
  this.links = {};

  // links
  try {
    if (header.link) {
      this.links = utils.parseLinks(header.link);
    }
  } catch (err) {
    // ignore
  }
};

/**
 * Set flags such as `.ok` based on `status`.
 *
 * For example a 2xx response will give you a `.ok` of __true__
 * whereas 5xx will be __false__ and `.error` will be __true__. The
 * `.clientError` and `.serverError` are also available to be more
 * specific, and `.statusType` is the class of error ranging from 1..5
 * sometimes useful for mapping respond colors etc.
 *
 * "sugar" properties are also defined for common cases. Currently providing:
 *
 *   - .noContent
 *   - .badRequest
 *   - .unauthorized
 *   - .notAcceptable
 *   - .notFound
 *
 * @param {Number} status
 * @api private
 */

ResponseBase.prototype._setStatusProperties = function (status) {
  const type = Math.trunc(status / 100);

  // status / class
  this.statusCode = status;
  this.status = this.statusCode;
  this.statusType = type;

  // basics
  this.info = type === 1;
  this.ok = type === 2;
  this.redirect = type === 3;
  this.clientError = type === 4;
  this.serverError = type === 5;
  this.error = type === 4 || type === 5 ? this.toError() : false;

  // sugar
  this.created = status === 201;
  this.accepted = status === 202;
  this.noContent = status === 204;
  this.badRequest = status === 400;
  this.unauthorized = status === 401;
  this.notAcceptable = status === 406;
  this.forbidden = status === 403;
  this.notFound = status === 404;
  this.unprocessableEntity = status === 422;
};

},{"./utils":107}],107:[function(_dereq_,module,exports){
"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
/**
 * Return the mime type for the given `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

exports.type = string_ => string_.split(/ *; */).shift();

/**
 * Return header field parameters.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

exports.params = value => {
  const object = {};
  var _iterator = _createForOfIteratorHelper(value.split(/ *; */)),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      const string_ = _step.value;
      const parts = string_.split(/ *= */);
      const key = parts.shift();
      const value = parts.shift();
      if (key && value) object[key] = value;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return object;
};

/**
 * Parse Link header fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

exports.parseLinks = value => {
  const object = {};
  var _iterator2 = _createForOfIteratorHelper(value.split(/ *, */)),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      const string_ = _step2.value;
      const parts = string_.split(/ *; */);
      const url = parts[0].slice(1, -1);
      const rel = parts[1].split(/ *= */)[1].slice(1, -1);
      object[rel] = url;
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  return object;
};

/**
 * Strip content related fields from `header`.
 *
 * @param {Object} header
 * @return {Object} header
 * @api private
 */

exports.cleanHeader = (header, changesOrigin) => {
  delete header['content-type'];
  delete header['content-length'];
  delete header['transfer-encoding'];
  delete header.host;
  // secuirty
  if (changesOrigin) {
    delete header.authorization;
    delete header.cookie;
  }
  return header;
};

/**
 * Check if `obj` is an object.
 *
 * @param {Object} object
 * @return {Boolean}
 * @api private
 */
exports.isObject = object => {
  return object !== null && typeof object === 'object';
};

/**
 * Object.hasOwn fallback/polyfill.
 *
 * @type {(object: object, property: string) => boolean} object
 * @api private
 */
exports.hasOwn = Object.hasOwn || function (object, property) {
  if (object == null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }
  return Object.prototype.hasOwnProperty.call(new Object(object), property);
};
exports.mixin = (target, source) => {
  for (const key in source) {
    if (exports.hasOwn(source, key)) {
      target[key] = source[key];
    }
  }
};

},{}],108:[function(_dereq_,module,exports){
(function (setImmediate,clearImmediate){(function (){
var nextTick = _dereq_('process/browser.js').nextTick;
var apply = Function.prototype.apply;
var slice = Array.prototype.slice;
var immediateIds = {};
var nextImmediateId = 0;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) { timeout.close(); };

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// That's not how node.js implements it but the exposed api is the same.
exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
  var id = nextImmediateId++;
  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

  immediateIds[id] = true;

  nextTick(function onNextTick() {
    if (immediateIds[id]) {
      // fn.call() is faster so we optimize for the common use-case
      // @see http://jsperf.com/call-apply-segu
      if (args) {
        fn.apply(null, args);
      } else {
        fn.call(null);
      }
      // Prevent ids from leaking
      exports.clearImmediate(id);
    }
  });

  return id;
};

exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
  delete immediateIds[id];
};
}).call(this)}).call(this,_dereq_("timers").setImmediate,_dereq_("timers").clearImmediate)
},{"process/browser.js":79,"timers":108}],109:[function(_dereq_,module,exports){
(function (Buffer){(function (){
/*! typedarray-to-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
/**
 * Convert a typed array to a Buffer without a copy
 *
 * Author:   Feross Aboukhadijeh <https://feross.org>
 * License:  MIT
 *
 * `npm install typedarray-to-buffer`
 */

module.exports = function typedarrayToBuffer (arr) {
  return ArrayBuffer.isView(arr)
    // To avoid a copy, use the typed array's underlying ArrayBuffer to back
    // new Buffer, respecting the "view", i.e. byteOffset and byteLength
    ? Buffer.from(arr.buffer, arr.byteOffset, arr.byteLength)
    // Pass through all other types to `Buffer.from`
    : Buffer.from(arr)
}

}).call(this)}).call(this,_dereq_("buffer").Buffer)
},{"buffer":18}],110:[function(_dereq_,module,exports){
/////////////////////////////////////////////////////////////////////////////////
/* UAParser.js v1.0.38
   Copyright © 2012-2021 Faisal Salman <f@faisalman.com>
   MIT License *//*
   Detect Browser, Engine, OS, CPU, and Device type/model from User-Agent data.
   Supports browser & node.js environment. 
   Demo   : https://faisalman.github.io/ua-parser-js
   Source : https://github.com/faisalman/ua-parser-js */
/////////////////////////////////////////////////////////////////////////////////

(function (window, undefined) {

    'use strict';

    //////////////
    // Constants
    /////////////


    var LIBVERSION  = '1.0.38',
        EMPTY       = '',
        UNKNOWN     = '?',
        FUNC_TYPE   = 'function',
        UNDEF_TYPE  = 'undefined',
        OBJ_TYPE    = 'object',
        STR_TYPE    = 'string',
        MAJOR       = 'major',
        MODEL       = 'model',
        NAME        = 'name',
        TYPE        = 'type',
        VENDOR      = 'vendor',
        VERSION     = 'version',
        ARCHITECTURE= 'architecture',
        CONSOLE     = 'console',
        MOBILE      = 'mobile',
        TABLET      = 'tablet',
        SMARTTV     = 'smarttv',
        WEARABLE    = 'wearable',
        EMBEDDED    = 'embedded',
        UA_MAX_LENGTH = 500;

    var AMAZON  = 'Amazon',
        APPLE   = 'Apple',
        ASUS    = 'ASUS',
        BLACKBERRY = 'BlackBerry',
        BROWSER = 'Browser',
        CHROME  = 'Chrome',
        EDGE    = 'Edge',
        FIREFOX = 'Firefox',
        GOOGLE  = 'Google',
        HUAWEI  = 'Huawei',
        LG      = 'LG',
        MICROSOFT = 'Microsoft',
        MOTOROLA  = 'Motorola',
        OPERA   = 'Opera',
        SAMSUNG = 'Samsung',
        SHARP   = 'Sharp',
        SONY    = 'Sony',
        XIAOMI  = 'Xiaomi',
        ZEBRA   = 'Zebra',
        FACEBOOK    = 'Facebook',
        CHROMIUM_OS = 'Chromium OS',
        MAC_OS  = 'Mac OS';

    ///////////
    // Helper
    //////////

    var extend = function (regexes, extensions) {
            var mergedRegexes = {};
            for (var i in regexes) {
                if (extensions[i] && extensions[i].length % 2 === 0) {
                    mergedRegexes[i] = extensions[i].concat(regexes[i]);
                } else {
                    mergedRegexes[i] = regexes[i];
                }
            }
            return mergedRegexes;
        },
        enumerize = function (arr) {
            var enums = {};
            for (var i=0; i<arr.length; i++) {
                enums[arr[i].toUpperCase()] = arr[i];
            }
            return enums;
        },
        has = function (str1, str2) {
            return typeof str1 === STR_TYPE ? lowerize(str2).indexOf(lowerize(str1)) !== -1 : false;
        },
        lowerize = function (str) {
            return str.toLowerCase();
        },
        majorize = function (version) {
            return typeof(version) === STR_TYPE ? version.replace(/[^\d\.]/g, EMPTY).split('.')[0] : undefined;
        },
        trim = function (str, len) {
            if (typeof(str) === STR_TYPE) {
                str = str.replace(/^\s\s*/, EMPTY);
                return typeof(len) === UNDEF_TYPE ? str : str.substring(0, UA_MAX_LENGTH);
            }
    };

    ///////////////
    // Map helper
    //////////////

    var rgxMapper = function (ua, arrays) {

            var i = 0, j, k, p, q, matches, match;

            // loop through all regexes maps
            while (i < arrays.length && !matches) {

                var regex = arrays[i],       // even sequence (0,2,4,..)
                    props = arrays[i + 1];   // odd sequence (1,3,5,..)
                j = k = 0;

                // try matching uastring with regexes
                while (j < regex.length && !matches) {

                    if (!regex[j]) { break; }
                    matches = regex[j++].exec(ua);

                    if (!!matches) {
                        for (p = 0; p < props.length; p++) {
                            match = matches[++k];
                            q = props[p];
                            // check if given property is actually array
                            if (typeof q === OBJ_TYPE && q.length > 0) {
                                if (q.length === 2) {
                                    if (typeof q[1] == FUNC_TYPE) {
                                        // assign modified match
                                        this[q[0]] = q[1].call(this, match);
                                    } else {
                                        // assign given value, ignore regex match
                                        this[q[0]] = q[1];
                                    }
                                } else if (q.length === 3) {
                                    // check whether function or regex
                                    if (typeof q[1] === FUNC_TYPE && !(q[1].exec && q[1].test)) {
                                        // call function (usually string mapper)
                                        this[q[0]] = match ? q[1].call(this, match, q[2]) : undefined;
                                    } else {
                                        // sanitize match using given regex
                                        this[q[0]] = match ? match.replace(q[1], q[2]) : undefined;
                                    }
                                } else if (q.length === 4) {
                                        this[q[0]] = match ? q[3].call(this, match.replace(q[1], q[2])) : undefined;
                                }
                            } else {
                                this[q] = match ? match : undefined;
                            }
                        }
                    }
                }
                i += 2;
            }
        },

        strMapper = function (str, map) {

            for (var i in map) {
                // check if current value is array
                if (typeof map[i] === OBJ_TYPE && map[i].length > 0) {
                    for (var j = 0; j < map[i].length; j++) {
                        if (has(map[i][j], str)) {
                            return (i === UNKNOWN) ? undefined : i;
                        }
                    }
                } else if (has(map[i], str)) {
                    return (i === UNKNOWN) ? undefined : i;
                }
            }
            return str;
    };

    ///////////////
    // String map
    //////////////

    // Safari < 3.0
    var oldSafariMap = {
            '1.0'   : '/8',
            '1.2'   : '/1',
            '1.3'   : '/3',
            '2.0'   : '/412',
            '2.0.2' : '/416',
            '2.0.3' : '/417',
            '2.0.4' : '/419',
            '?'     : '/'
        },
        windowsVersionMap = {
            'ME'        : '4.90',
            'NT 3.11'   : 'NT3.51',
            'NT 4.0'    : 'NT4.0',
            '2000'      : 'NT 5.0',
            'XP'        : ['NT 5.1', 'NT 5.2'],
            'Vista'     : 'NT 6.0',
            '7'         : 'NT 6.1',
            '8'         : 'NT 6.2',
            '8.1'       : 'NT 6.3',
            '10'        : ['NT 6.4', 'NT 10.0'],
            'RT'        : 'ARM'
    };

    //////////////
    // Regex map
    /////////////

    var regexes = {

        browser : [[

            /\b(?:crmo|crios)\/([\w\.]+)/i                                      // Chrome for Android/iOS
            ], [VERSION, [NAME, 'Chrome']], [
            /edg(?:e|ios|a)?\/([\w\.]+)/i                                       // Microsoft Edge
            ], [VERSION, [NAME, 'Edge']], [

            // Presto based
            /(opera mini)\/([-\w\.]+)/i,                                        // Opera Mini
            /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i,                 // Opera Mobi/Tablet
            /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i                           // Opera
            ], [NAME, VERSION], [
            /opios[\/ ]+([\w\.]+)/i                                             // Opera mini on iphone >= 8.0
            ], [VERSION, [NAME, OPERA+' Mini']], [
            /\bop(?:rg)?x\/([\w\.]+)/i                                          // Opera GX
            ], [VERSION, [NAME, OPERA+' GX']], [
            /\bopr\/([\w\.]+)/i                                                 // Opera Webkit
            ], [VERSION, [NAME, OPERA]], [

            // Mixed
            /\bb[ai]*d(?:uhd|[ub]*[aekoprswx]{5,6})[\/ ]?([\w\.]+)/i            // Baidu
            ], [VERSION, [NAME, 'Baidu']], [
            /(kindle)\/([\w\.]+)/i,                                             // Kindle
            /(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i,      // Lunascape/Maxthon/Netfront/Jasmine/Blazer
            // Trident based
            /(avant|iemobile|slim)\s?(?:browser)?[\/ ]?([\w\.]*)/i,             // Avant/IEMobile/SlimBrowser
            /(?:ms|\()(ie) ([\w\.]+)/i,                                         // Internet Explorer

            // Webkit/KHTML based                                               // Flock/RockMelt/Midori/Epiphany/Silk/Skyfire/Bolt/Iron/Iridium/PhantomJS/Bowser/QupZilla/Falkon
            /(flock|rockmelt|midori|epiphany|silk|skyfire|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|qq|duckduckgo)\/([-\w\.]+)/i,
                                                                                // Rekonq/Puffin/Brave/Whale/QQBrowserLite/QQ, aka ShouQ
            /(heytap|ovi)browser\/([\d\.]+)/i,                                  // Heytap/Ovi
            /(weibo)__([\d\.]+)/i                                               // Weibo
            ], [NAME, VERSION], [
            /\bddg\/([\w\.]+)/i                                                 // DuckDuckGo
            ], [VERSION, [NAME, 'DuckDuckGo']], [
            /(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i                 // UCBrowser
            ], [VERSION, [NAME, 'UC'+BROWSER]], [
            /microm.+\bqbcore\/([\w\.]+)/i,                                     // WeChat Desktop for Windows Built-in Browser
            /\bqbcore\/([\w\.]+).+microm/i,
            /micromessenger\/([\w\.]+)/i                                        // WeChat
            ], [VERSION, [NAME, 'WeChat']], [
            /konqueror\/([\w\.]+)/i                                             // Konqueror
            ], [VERSION, [NAME, 'Konqueror']], [
            /trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i                       // IE11
            ], [VERSION, [NAME, 'IE']], [
            /ya(?:search)?browser\/([\w\.]+)/i                                  // Yandex
            ], [VERSION, [NAME, 'Yandex']], [
            /slbrowser\/([\w\.]+)/i                                             // Smart Lenovo Browser
            ], [VERSION, [NAME, 'Smart Lenovo '+BROWSER]], [
            /(avast|avg)\/([\w\.]+)/i                                           // Avast/AVG Secure Browser
            ], [[NAME, /(.+)/, '$1 Secure '+BROWSER], VERSION], [
            /\bfocus\/([\w\.]+)/i                                               // Firefox Focus
            ], [VERSION, [NAME, FIREFOX+' Focus']], [
            /\bopt\/([\w\.]+)/i                                                 // Opera Touch
            ], [VERSION, [NAME, OPERA+' Touch']], [
            /coc_coc\w+\/([\w\.]+)/i                                            // Coc Coc Browser
            ], [VERSION, [NAME, 'Coc Coc']], [
            /dolfin\/([\w\.]+)/i                                                // Dolphin
            ], [VERSION, [NAME, 'Dolphin']], [
            /coast\/([\w\.]+)/i                                                 // Opera Coast
            ], [VERSION, [NAME, OPERA+' Coast']], [
            /miuibrowser\/([\w\.]+)/i                                           // MIUI Browser
            ], [VERSION, [NAME, 'MIUI '+BROWSER]], [
            /fxios\/([-\w\.]+)/i                                                // Firefox for iOS
            ], [VERSION, [NAME, FIREFOX]], [
            /\bqihu|(qi?ho?o?|360)browser/i                                     // 360
            ], [[NAME, '360 ' + BROWSER]], [
            /(oculus|sailfish|huawei|vivo)browser\/([\w\.]+)/i
            ], [[NAME, /(.+)/, '$1 ' + BROWSER], VERSION], [                    // Oculus/Sailfish/HuaweiBrowser/VivoBrowser
            /samsungbrowser\/([\w\.]+)/i                                        // Samsung Internet
            ], [VERSION, [NAME, SAMSUNG + ' Internet']], [
            /(comodo_dragon)\/([\w\.]+)/i                                       // Comodo Dragon
            ], [[NAME, /_/g, ' '], VERSION], [
            /metasr[\/ ]?([\d\.]+)/i                                            // Sogou Explorer
            ], [VERSION, [NAME, 'Sogou Explorer']], [
            /(sogou)mo\w+\/([\d\.]+)/i                                          // Sogou Mobile
            ], [[NAME, 'Sogou Mobile'], VERSION], [
            /(electron)\/([\w\.]+) safari/i,                                    // Electron-based App
            /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,                   // Tesla
            /m?(qqbrowser|2345Explorer)[\/ ]?([\w\.]+)/i                        // QQBrowser/2345 Browser
            ], [NAME, VERSION], [
            /(lbbrowser)/i,                                                     // LieBao Browser
            /\[(linkedin)app\]/i                                                // LinkedIn App for iOS & Android
            ], [NAME], [

            // WebView
            /((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i       // Facebook App for iOS & Android
            ], [[NAME, FACEBOOK], VERSION], [
            /(Klarna)\/([\w\.]+)/i,                                             // Klarna Shopping Browser for iOS & Android
            /(kakao(?:talk|story))[\/ ]([\w\.]+)/i,                             // Kakao App
            /(naver)\(.*?(\d+\.[\w\.]+).*\)/i,                                  // Naver InApp
            /safari (line)\/([\w\.]+)/i,                                        // Line App for iOS
            /\b(line)\/([\w\.]+)\/iab/i,                                        // Line App for Android
            /(alipay)client\/([\w\.]+)/i,                                       // Alipay
            /(twitter)(?:and| f.+e\/([\w\.]+))/i,                               // Twitter
            /(chromium|instagram|snapchat)[\/ ]([-\w\.]+)/i                     // Chromium/Instagram/Snapchat
            ], [NAME, VERSION], [
            /\bgsa\/([\w\.]+) .*safari\//i                                      // Google Search Appliance on iOS
            ], [VERSION, [NAME, 'GSA']], [
            /musical_ly(?:.+app_?version\/|_)([\w\.]+)/i                        // TikTok
            ], [VERSION, [NAME, 'TikTok']], [

            /headlesschrome(?:\/([\w\.]+)| )/i                                  // Chrome Headless
            ], [VERSION, [NAME, CHROME+' Headless']], [

            / wv\).+(chrome)\/([\w\.]+)/i                                       // Chrome WebView
            ], [[NAME, CHROME+' WebView'], VERSION], [

            /droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i           // Android Browser
            ], [VERSION, [NAME, 'Android '+BROWSER]], [

            /(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i       // Chrome/OmniWeb/Arora/Tizen/Nokia
            ], [NAME, VERSION], [

            /version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i                      // Mobile Safari
            ], [VERSION, [NAME, 'Mobile Safari']], [
            /version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i                // Safari & Safari Mobile
            ], [VERSION, NAME], [
            /webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i                      // Safari < 3.0
            ], [NAME, [VERSION, strMapper, oldSafariMap]], [

            /(webkit|khtml)\/([\w\.]+)/i
            ], [NAME, VERSION], [

            // Gecko based
            /(navigator|netscape\d?)\/([-\w\.]+)/i                              // Netscape
            ], [[NAME, 'Netscape'], VERSION], [
            /mobile vr; rv:([\w\.]+)\).+firefox/i                               // Firefox Reality
            ], [VERSION, [NAME, FIREFOX+' Reality']], [
            /ekiohf.+(flow)\/([\w\.]+)/i,                                       // Flow
            /(swiftfox)/i,                                                      // Swiftfox
            /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i,
                                                                                // IceDragon/Iceweasel/Camino/Chimera/Fennec/Maemo/Minimo/Conkeror/Klar
            /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i,
                                                                                // Firefox/SeaMonkey/K-Meleon/IceCat/IceApe/Firebird/Phoenix
            /(firefox)\/([\w\.]+)/i,                                            // Other Firefox-based
            /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i,                         // Mozilla

            // Other
            /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i,
                                                                                // Polaris/Lynx/Dillo/iCab/Doris/Amaya/w3m/NetSurf/Sleipnir/Obigo/Mosaic/Go/ICE/UP.Browser
            /(links) \(([\w\.]+)/i,                                             // Links
            /panasonic;(viera)/i                                                // Panasonic Viera
            ], [NAME, VERSION], [
            
            /(cobalt)\/([\w\.]+)/i                                              // Cobalt
            ], [NAME, [VERSION, /master.|lts./, ""]]
        ],

        cpu : [[

            /(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i                     // AMD64 (x64)
            ], [[ARCHITECTURE, 'amd64']], [

            /(ia32(?=;))/i                                                      // IA32 (quicktime)
            ], [[ARCHITECTURE, lowerize]], [

            /((?:i[346]|x)86)[;\)]/i                                            // IA32 (x86)
            ], [[ARCHITECTURE, 'ia32']], [

            /\b(aarch64|arm(v?8e?l?|_?64))\b/i                                 // ARM64
            ], [[ARCHITECTURE, 'arm64']], [

            /\b(arm(?:v[67])?ht?n?[fl]p?)\b/i                                   // ARMHF
            ], [[ARCHITECTURE, 'armhf']], [

            // PocketPC mistakenly identified as PowerPC
            /windows (ce|mobile); ppc;/i
            ], [[ARCHITECTURE, 'arm']], [

            /((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i                            // PowerPC
            ], [[ARCHITECTURE, /ower/, EMPTY, lowerize]], [

            /(sun4\w)[;\)]/i                                                    // SPARC
            ], [[ARCHITECTURE, 'sparc']], [

            /((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i
                                                                                // IA64, 68K, ARM/64, AVR/32, IRIX/64, MIPS/64, SPARC/64, PA-RISC
            ], [[ARCHITECTURE, lowerize]]
        ],

        device : [[

            //////////////////////////
            // MOBILES & TABLETS
            /////////////////////////

            // Samsung
            /\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i
            ], [MODEL, [VENDOR, SAMSUNG], [TYPE, TABLET]], [
            /\b((?:s[cgp]h|gt|sm)-\w+|sc[g-]?[\d]+a?|galaxy nexus)/i,
            /samsung[- ]([-\w]+)/i,
            /sec-(sgh\w+)/i
            ], [MODEL, [VENDOR, SAMSUNG], [TYPE, MOBILE]], [

            // Apple
            /(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i                          // iPod/iPhone
            ], [MODEL, [VENDOR, APPLE], [TYPE, MOBILE]], [
            /\((ipad);[-\w\),; ]+apple/i,                                       // iPad
            /applecoremedia\/[\w\.]+ \((ipad)/i,
            /\b(ipad)\d\d?,\d\d?[;\]].+ios/i
            ], [MODEL, [VENDOR, APPLE], [TYPE, TABLET]], [
            /(macintosh);/i
            ], [MODEL, [VENDOR, APPLE]], [

            // Sharp
            /\b(sh-?[altvz]?\d\d[a-ekm]?)/i
            ], [MODEL, [VENDOR, SHARP], [TYPE, MOBILE]], [

            // Huawei
            /\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i
            ], [MODEL, [VENDOR, HUAWEI], [TYPE, TABLET]], [
            /(?:huawei|honor)([-\w ]+)[;\)]/i,
            /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i
            ], [MODEL, [VENDOR, HUAWEI], [TYPE, MOBILE]], [

            // Xiaomi
            /\b(poco[\w ]+|m2\d{3}j\d\d[a-z]{2})(?: bui|\))/i,                  // Xiaomi POCO
            /\b; (\w+) build\/hm\1/i,                                           // Xiaomi Hongmi 'numeric' models
            /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i,                             // Xiaomi Hongmi
            /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i,                   // Xiaomi Redmi
            /oid[^\)]+; (m?[12][0-389][01]\w{3,6}[c-y])( bui|; wv|\))/i,        // Xiaomi Redmi 'numeric' models
            /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i // Xiaomi Mi
            ], [[MODEL, /_/g, ' '], [VENDOR, XIAOMI], [TYPE, MOBILE]], [
            /oid[^\)]+; (2\d{4}(283|rpbf)[cgl])( bui|\))/i,                     // Redmi Pad
            /\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i                        // Mi Pad tablets
            ],[[MODEL, /_/g, ' '], [VENDOR, XIAOMI], [TYPE, TABLET]], [

            // OPPO
            /; (\w+) bui.+ oppo/i,
            /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i
            ], [MODEL, [VENDOR, 'OPPO'], [TYPE, MOBILE]], [
            /\b(opd2\d{3}a?) bui/i
            ], [MODEL, [VENDOR, 'OPPO'], [TYPE, TABLET]], [

            // Vivo
            /vivo (\w+)(?: bui|\))/i,
            /\b(v[12]\d{3}\w?[at])(?: bui|;)/i
            ], [MODEL, [VENDOR, 'Vivo'], [TYPE, MOBILE]], [

            // Realme
            /\b(rmx[1-3]\d{3})(?: bui|;|\))/i
            ], [MODEL, [VENDOR, 'Realme'], [TYPE, MOBILE]], [

            // Motorola
            /\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,
            /\bmot(?:orola)?[- ](\w*)/i,
            /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i
            ], [MODEL, [VENDOR, MOTOROLA], [TYPE, MOBILE]], [
            /\b(mz60\d|xoom[2 ]{0,2}) build\//i
            ], [MODEL, [VENDOR, MOTOROLA], [TYPE, TABLET]], [

            // LG
            /((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i
            ], [MODEL, [VENDOR, LG], [TYPE, TABLET]], [
            /(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,
            /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i,
            /\blg-?([\d\w]+) bui/i
            ], [MODEL, [VENDOR, LG], [TYPE, MOBILE]], [

            // Lenovo
            /(ideatab[-\w ]+)/i,
            /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i
            ], [MODEL, [VENDOR, 'Lenovo'], [TYPE, TABLET]], [

            // Nokia
            /(?:maemo|nokia).*(n900|lumia \d+)/i,
            /nokia[-_ ]?([-\w\.]*)/i
            ], [[MODEL, /_/g, ' '], [VENDOR, 'Nokia'], [TYPE, MOBILE]], [

            // Google
            /(pixel c)\b/i                                                      // Google Pixel C
            ], [MODEL, [VENDOR, GOOGLE], [TYPE, TABLET]], [
            /droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i                         // Google Pixel
            ], [MODEL, [VENDOR, GOOGLE], [TYPE, MOBILE]], [

            // Sony
            /droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i
            ], [MODEL, [VENDOR, SONY], [TYPE, MOBILE]], [
            /sony tablet [ps]/i,
            /\b(?:sony)?sgp\w+(?: bui|\))/i
            ], [[MODEL, 'Xperia Tablet'], [VENDOR, SONY], [TYPE, TABLET]], [

            // OnePlus
            / (kb2005|in20[12]5|be20[12][59])\b/i,
            /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i
            ], [MODEL, [VENDOR, 'OnePlus'], [TYPE, MOBILE]], [

            // Amazon
            /(alexa)webm/i,
            /(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i,                             // Kindle Fire without Silk / Echo Show
            /(kf[a-z]+)( bui|\)).+silk\//i                                      // Kindle Fire HD
            ], [MODEL, [VENDOR, AMAZON], [TYPE, TABLET]], [
            /((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i                     // Fire Phone
            ], [[MODEL, /(.+)/g, 'Fire Phone $1'], [VENDOR, AMAZON], [TYPE, MOBILE]], [

            // BlackBerry
            /(playbook);[-\w\),; ]+(rim)/i                                      // BlackBerry PlayBook
            ], [MODEL, VENDOR, [TYPE, TABLET]], [
            /\b((?:bb[a-f]|st[hv])100-\d)/i,
            /\(bb10; (\w+)/i                                                    // BlackBerry 10
            ], [MODEL, [VENDOR, BLACKBERRY], [TYPE, MOBILE]], [

            // Asus
            /(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i
            ], [MODEL, [VENDOR, ASUS], [TYPE, TABLET]], [
            / (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i
            ], [MODEL, [VENDOR, ASUS], [TYPE, MOBILE]], [

            // HTC
            /(nexus 9)/i                                                        // HTC Nexus 9
            ], [MODEL, [VENDOR, 'HTC'], [TYPE, TABLET]], [
            /(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i,                         // HTC

            // ZTE
            /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i,
            /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i         // Alcatel/GeeksPhone/Nexian/Panasonic/Sony
            ], [VENDOR, [MODEL, /_/g, ' '], [TYPE, MOBILE]], [

            // Acer
            /droid.+; ([ab][1-7]-?[0178a]\d\d?)/i
            ], [MODEL, [VENDOR, 'Acer'], [TYPE, TABLET]], [

            // Meizu
            /droid.+; (m[1-5] note) bui/i,
            /\bmz-([-\w]{2,})/i
            ], [MODEL, [VENDOR, 'Meizu'], [TYPE, MOBILE]], [
                
            // Ulefone
            /; ((?:power )?armor(?:[\w ]{0,8}))(?: bui|\))/i
            ], [MODEL, [VENDOR, 'Ulefone'], [TYPE, MOBILE]], [

            // MIXED
            /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron|infinix|tecno)[-_ ]?([-\w]*)/i,
                                                                                // BlackBerry/BenQ/Palm/Sony-Ericsson/Acer/Asus/Dell/Meizu/Motorola/Polytron
            /(hp) ([\w ]+\w)/i,                                                 // HP iPAQ
            /(asus)-?(\w+)/i,                                                   // Asus
            /(microsoft); (lumia[\w ]+)/i,                                      // Microsoft Lumia
            /(lenovo)[-_ ]?([-\w]+)/i,                                          // Lenovo
            /(jolla)/i,                                                         // Jolla
            /(oppo) ?([\w ]+) bui/i                                             // OPPO
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [

            /(kobo)\s(ereader|touch)/i,                                         // Kobo
            /(archos) (gamepad2?)/i,                                            // Archos
            /(hp).+(touchpad(?!.+tablet)|tablet)/i,                             // HP TouchPad
            /(kindle)\/([\w\.]+)/i,                                             // Kindle
            /(nook)[\w ]+build\/(\w+)/i,                                        // Nook
            /(dell) (strea[kpr\d ]*[\dko])/i,                                   // Dell Streak
            /(le[- ]+pan)[- ]+(\w{1,9}) bui/i,                                  // Le Pan Tablets
            /(trinity)[- ]*(t\d{3}) bui/i,                                      // Trinity Tablets
            /(gigaset)[- ]+(q\w{1,9}) bui/i,                                    // Gigaset Tablets
            /(vodafone) ([\w ]+)(?:\)| bui)/i                                   // Vodafone
            ], [VENDOR, MODEL, [TYPE, TABLET]], [

            /(surface duo)/i                                                    // Surface Duo
            ], [MODEL, [VENDOR, MICROSOFT], [TYPE, TABLET]], [
            /droid [\d\.]+; (fp\du?)(?: b|\))/i                                 // Fairphone
            ], [MODEL, [VENDOR, 'Fairphone'], [TYPE, MOBILE]], [
            /(u304aa)/i                                                         // AT&T
            ], [MODEL, [VENDOR, 'AT&T'], [TYPE, MOBILE]], [
            /\bsie-(\w*)/i                                                      // Siemens
            ], [MODEL, [VENDOR, 'Siemens'], [TYPE, MOBILE]], [
            /\b(rct\w+) b/i                                                     // RCA Tablets
            ], [MODEL, [VENDOR, 'RCA'], [TYPE, TABLET]], [
            /\b(venue[\d ]{2,7}) b/i                                            // Dell Venue Tablets
            ], [MODEL, [VENDOR, 'Dell'], [TYPE, TABLET]], [
            /\b(q(?:mv|ta)\w+) b/i                                              // Verizon Tablet
            ], [MODEL, [VENDOR, 'Verizon'], [TYPE, TABLET]], [
            /\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i                       // Barnes & Noble Tablet
            ], [MODEL, [VENDOR, 'Barnes & Noble'], [TYPE, TABLET]], [
            /\b(tm\d{3}\w+) b/i
            ], [MODEL, [VENDOR, 'NuVision'], [TYPE, TABLET]], [
            /\b(k88) b/i                                                        // ZTE K Series Tablet
            ], [MODEL, [VENDOR, 'ZTE'], [TYPE, TABLET]], [
            /\b(nx\d{3}j) b/i                                                   // ZTE Nubia
            ], [MODEL, [VENDOR, 'ZTE'], [TYPE, MOBILE]], [
            /\b(gen\d{3}) b.+49h/i                                              // Swiss GEN Mobile
            ], [MODEL, [VENDOR, 'Swiss'], [TYPE, MOBILE]], [
            /\b(zur\d{3}) b/i                                                   // Swiss ZUR Tablet
            ], [MODEL, [VENDOR, 'Swiss'], [TYPE, TABLET]], [
            /\b((zeki)?tb.*\b) b/i                                              // Zeki Tablets
            ], [MODEL, [VENDOR, 'Zeki'], [TYPE, TABLET]], [
            /\b([yr]\d{2}) b/i,
            /\b(dragon[- ]+touch |dt)(\w{5}) b/i                                // Dragon Touch Tablet
            ], [[VENDOR, 'Dragon Touch'], MODEL, [TYPE, TABLET]], [
            /\b(ns-?\w{0,9}) b/i                                                // Insignia Tablets
            ], [MODEL, [VENDOR, 'Insignia'], [TYPE, TABLET]], [
            /\b((nxa|next)-?\w{0,9}) b/i                                        // NextBook Tablets
            ], [MODEL, [VENDOR, 'NextBook'], [TYPE, TABLET]], [
            /\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i                  // Voice Xtreme Phones
            ], [[VENDOR, 'Voice'], MODEL, [TYPE, MOBILE]], [
            /\b(lvtel\-)?(v1[12]) b/i                                           // LvTel Phones
            ], [[VENDOR, 'LvTel'], MODEL, [TYPE, MOBILE]], [
            /\b(ph-1) /i                                                        // Essential PH-1
            ], [MODEL, [VENDOR, 'Essential'], [TYPE, MOBILE]], [
            /\b(v(100md|700na|7011|917g).*\b) b/i                               // Envizen Tablets
            ], [MODEL, [VENDOR, 'Envizen'], [TYPE, TABLET]], [
            /\b(trio[-\w\. ]+) b/i                                              // MachSpeed Tablets
            ], [MODEL, [VENDOR, 'MachSpeed'], [TYPE, TABLET]], [
            /\btu_(1491) b/i                                                    // Rotor Tablets
            ], [MODEL, [VENDOR, 'Rotor'], [TYPE, TABLET]], [
            /(shield[\w ]+) b/i                                                 // Nvidia Shield Tablets
            ], [MODEL, [VENDOR, 'Nvidia'], [TYPE, TABLET]], [
            /(sprint) (\w+)/i                                                   // Sprint Phones
            ], [VENDOR, MODEL, [TYPE, MOBILE]], [
            /(kin\.[onetw]{3})/i                                                // Microsoft Kin
            ], [[MODEL, /\./g, ' '], [VENDOR, MICROSOFT], [TYPE, MOBILE]], [
            /droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i             // Zebra
            ], [MODEL, [VENDOR, ZEBRA], [TYPE, TABLET]], [
            /droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i
            ], [MODEL, [VENDOR, ZEBRA], [TYPE, MOBILE]], [

            ///////////////////
            // SMARTTVS
            ///////////////////

            /smart-tv.+(samsung)/i                                              // Samsung
            ], [VENDOR, [TYPE, SMARTTV]], [
            /hbbtv.+maple;(\d+)/i
            ], [[MODEL, /^/, 'SmartTV'], [VENDOR, SAMSUNG], [TYPE, SMARTTV]], [
            /(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i        // LG SmartTV
            ], [[VENDOR, LG], [TYPE, SMARTTV]], [
            /(apple) ?tv/i                                                      // Apple TV
            ], [VENDOR, [MODEL, APPLE+' TV'], [TYPE, SMARTTV]], [
            /crkey/i                                                            // Google Chromecast
            ], [[MODEL, CHROME+'cast'], [VENDOR, GOOGLE], [TYPE, SMARTTV]], [
            /droid.+aft(\w+)( bui|\))/i                                         // Fire TV
            ], [MODEL, [VENDOR, AMAZON], [TYPE, SMARTTV]], [
            /\(dtv[\);].+(aquos)/i,
            /(aquos-tv[\w ]+)\)/i                                               // Sharp
            ], [MODEL, [VENDOR, SHARP], [TYPE, SMARTTV]],[
            /(bravia[\w ]+)( bui|\))/i                                              // Sony
            ], [MODEL, [VENDOR, SONY], [TYPE, SMARTTV]], [
            /(mitv-\w{5}) bui/i                                                 // Xiaomi
            ], [MODEL, [VENDOR, XIAOMI], [TYPE, SMARTTV]], [
            /Hbbtv.*(technisat) (.*);/i                                         // TechniSAT
            ], [VENDOR, MODEL, [TYPE, SMARTTV]], [
            /\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i,                          // Roku
            /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i         // HbbTV devices
            ], [[VENDOR, trim], [MODEL, trim], [TYPE, SMARTTV]], [
            /\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i                   // SmartTV from Unidentified Vendors
            ], [[TYPE, SMARTTV]], [

            ///////////////////
            // CONSOLES
            ///////////////////

            /(ouya)/i,                                                          // Ouya
            /(nintendo) ([wids3utch]+)/i                                        // Nintendo
            ], [VENDOR, MODEL, [TYPE, CONSOLE]], [
            /droid.+; (shield) bui/i                                            // Nvidia
            ], [MODEL, [VENDOR, 'Nvidia'], [TYPE, CONSOLE]], [
            /(playstation [345portablevi]+)/i                                   // Playstation
            ], [MODEL, [VENDOR, SONY], [TYPE, CONSOLE]], [
            /\b(xbox(?: one)?(?!; xbox))[\); ]/i                                // Microsoft Xbox
            ], [MODEL, [VENDOR, MICROSOFT], [TYPE, CONSOLE]], [

            ///////////////////
            // WEARABLES
            ///////////////////

            /((pebble))app/i                                                    // Pebble
            ], [VENDOR, MODEL, [TYPE, WEARABLE]], [
            /(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i                              // Apple Watch
            ], [MODEL, [VENDOR, APPLE], [TYPE, WEARABLE]], [
            /droid.+; (glass) \d/i                                              // Google Glass
            ], [MODEL, [VENDOR, GOOGLE], [TYPE, WEARABLE]], [
            /droid.+; (wt63?0{2,3})\)/i
            ], [MODEL, [VENDOR, ZEBRA], [TYPE, WEARABLE]], [
            /(quest( \d| pro)?)/i                                               // Oculus Quest
            ], [MODEL, [VENDOR, FACEBOOK], [TYPE, WEARABLE]], [

            ///////////////////
            // EMBEDDED
            ///////////////////

            /(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i                              // Tesla
            ], [VENDOR, [TYPE, EMBEDDED]], [
            /(aeobc)\b/i                                                        // Echo Dot
            ], [MODEL, [VENDOR, AMAZON], [TYPE, EMBEDDED]], [

            ////////////////////
            // MIXED (GENERIC)
            ///////////////////

            /droid .+?; ([^;]+?)(?: bui|; wv\)|\) applew).+? mobile safari/i    // Android Phones from Unidentified Vendors
            ], [MODEL, [TYPE, MOBILE]], [
            /droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i       // Android Tablets from Unidentified Vendors
            ], [MODEL, [TYPE, TABLET]], [
            /\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i                      // Unidentifiable Tablet
            ], [[TYPE, TABLET]], [
            /(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i    // Unidentifiable Mobile
            ], [[TYPE, MOBILE]], [
            /(android[-\w\. ]{0,9});.+buil/i                                    // Generic Android Device
            ], [MODEL, [VENDOR, 'Generic']]
        ],

        engine : [[

            /windows.+ edge\/([\w\.]+)/i                                       // EdgeHTML
            ], [VERSION, [NAME, EDGE+'HTML']], [

            /webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i                         // Blink
            ], [VERSION, [NAME, 'Blink']], [

            /(presto)\/([\w\.]+)/i,                                             // Presto
            /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i, // WebKit/Trident/NetFront/NetSurf/Amaya/Lynx/w3m/Goanna
            /ekioh(flow)\/([\w\.]+)/i,                                          // Flow
            /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i,                           // KHTML/Tasman/Links
            /(icab)[\/ ]([23]\.[\d\.]+)/i,                                      // iCab
            /\b(libweb)/i
            ], [NAME, VERSION], [

            /rv\:([\w\.]{1,9})\b.+(gecko)/i                                     // Gecko
            ], [VERSION, NAME]
        ],

        os : [[

            // Windows
            /microsoft (windows) (vista|xp)/i                                   // Windows (iTunes)
            ], [NAME, VERSION], [
            /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i             // Windows Phone
            ], [NAME, [VERSION, strMapper, windowsVersionMap]], [
            /windows nt 6\.2; (arm)/i,                                        // Windows RT
            /windows[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i,
            /(?:win(?=3|9|n)|win 9x )([nt\d\.]+)/i
            ], [[VERSION, strMapper, windowsVersionMap], [NAME, 'Windows']], [

            // iOS/macOS
            /ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i,              // iOS
            /(?:ios;fbsv\/|iphone.+ios[\/ ])([\d\.]+)/i,
            /cfnetwork\/.+darwin/i
            ], [[VERSION, /_/g, '.'], [NAME, 'iOS']], [
            /(mac os x) ?([\w\. ]*)/i,
            /(macintosh|mac_powerpc\b)(?!.+haiku)/i                             // Mac OS
            ], [[NAME, MAC_OS], [VERSION, /_/g, '.']], [

            // Mobile OSes
            /droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i                    // Android-x86/HarmonyOS
            ], [VERSION, NAME], [                                               // Android/WebOS/QNX/Bada/RIM/Maemo/MeeGo/Sailfish OS
            /(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i,
            /(blackberry)\w*\/([\w\.]*)/i,                                      // Blackberry
            /(tizen|kaios)[\/ ]([\w\.]+)/i,                                     // Tizen/KaiOS
            /\((series40);/i                                                    // Series 40
            ], [NAME, VERSION], [
            /\(bb(10);/i                                                        // BlackBerry 10
            ], [VERSION, [NAME, BLACKBERRY]], [
            /(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i         // Symbian
            ], [VERSION, [NAME, 'Symbian']], [
            /mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i // Firefox OS
            ], [VERSION, [NAME, FIREFOX+' OS']], [
            /web0s;.+rt(tv)/i,
            /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i                              // WebOS
            ], [VERSION, [NAME, 'webOS']], [
            /watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i                              // watchOS
            ], [VERSION, [NAME, 'watchOS']], [

            // Google Chromecast
            /crkey\/([\d\.]+)/i                                                 // Google Chromecast
            ], [VERSION, [NAME, CHROME+'cast']], [
            /(cros) [\w]+(?:\)| ([\w\.]+)\b)/i                                  // Chromium OS
            ], [[NAME, CHROMIUM_OS], VERSION],[

            // Smart TVs
            /panasonic;(viera)/i,                                               // Panasonic Viera
            /(netrange)mmh/i,                                                   // Netrange
            /(nettv)\/(\d+\.[\w\.]+)/i,                                         // NetTV

            // Console
            /(nintendo|playstation) ([wids345portablevuch]+)/i,                 // Nintendo/Playstation
            /(xbox); +xbox ([^\);]+)/i,                                         // Microsoft Xbox (360, One, X, S, Series X, Series S)

            // Other
            /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i,                            // Joli/Palm
            /(mint)[\/\(\) ]?(\w*)/i,                                           // Mint
            /(mageia|vectorlinux)[; ]/i,                                        // Mageia/VectorLinux
            /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i,
                                                                                // Ubuntu/Debian/SUSE/Gentoo/Arch/Slackware/Fedora/Mandriva/CentOS/PCLinuxOS/RedHat/Zenwalk/Linpus/Raspbian/Plan9/Minix/RISCOS/Contiki/Deepin/Manjaro/elementary/Sabayon/Linspire
            /(hurd|linux) ?([\w\.]*)/i,                                         // Hurd/Linux
            /(gnu) ?([\w\.]*)/i,                                                // GNU
            /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i, // FreeBSD/NetBSD/OpenBSD/PC-BSD/GhostBSD/DragonFly
            /(haiku) (\w+)/i                                                    // Haiku
            ], [NAME, VERSION], [
            /(sunos) ?([\w\.\d]*)/i                                             // Solaris
            ], [[NAME, 'Solaris'], VERSION], [
            /((?:open)?solaris)[-\/ ]?([\w\.]*)/i,                              // Solaris
            /(aix) ((\d)(?=\.|\)| )[\w\.])*/i,                                  // AIX
            /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i, // BeOS/OS2/AmigaOS/MorphOS/OpenVMS/Fuchsia/HP-UX/SerenityOS
            /(unix) ?([\w\.]*)/i                                                // UNIX
            ], [NAME, VERSION]
        ]
    };

    /////////////////
    // Constructor
    ////////////////

    var UAParser = function (ua, extensions) {

        if (typeof ua === OBJ_TYPE) {
            extensions = ua;
            ua = undefined;
        }

        if (!(this instanceof UAParser)) {
            return new UAParser(ua, extensions).getResult();
        }

        var _navigator = (typeof window !== UNDEF_TYPE && window.navigator) ? window.navigator : undefined;
        var _ua = ua || ((_navigator && _navigator.userAgent) ? _navigator.userAgent : EMPTY);
        var _uach = (_navigator && _navigator.userAgentData) ? _navigator.userAgentData : undefined;
        var _rgxmap = extensions ? extend(regexes, extensions) : regexes;
        var _isSelfNav = _navigator && _navigator.userAgent == _ua;

        this.getBrowser = function () {
            var _browser = {};
            _browser[NAME] = undefined;
            _browser[VERSION] = undefined;
            rgxMapper.call(_browser, _ua, _rgxmap.browser);
            _browser[MAJOR] = majorize(_browser[VERSION]);
            // Brave-specific detection
            if (_isSelfNav && _navigator && _navigator.brave && typeof _navigator.brave.isBrave == FUNC_TYPE) {
                _browser[NAME] = 'Brave';
            }
            return _browser;
        };
        this.getCPU = function () {
            var _cpu = {};
            _cpu[ARCHITECTURE] = undefined;
            rgxMapper.call(_cpu, _ua, _rgxmap.cpu);
            return _cpu;
        };
        this.getDevice = function () {
            var _device = {};
            _device[VENDOR] = undefined;
            _device[MODEL] = undefined;
            _device[TYPE] = undefined;
            rgxMapper.call(_device, _ua, _rgxmap.device);
            if (_isSelfNav && !_device[TYPE] && _uach && _uach.mobile) {
                _device[TYPE] = MOBILE;
            }
            // iPadOS-specific detection: identified as Mac, but has some iOS-only properties
            if (_isSelfNav && _device[MODEL] == 'Macintosh' && _navigator && typeof _navigator.standalone !== UNDEF_TYPE && _navigator.maxTouchPoints && _navigator.maxTouchPoints > 2) {
                _device[MODEL] = 'iPad';
                _device[TYPE] = TABLET;
            }
            return _device;
        };
        this.getEngine = function () {
            var _engine = {};
            _engine[NAME] = undefined;
            _engine[VERSION] = undefined;
            rgxMapper.call(_engine, _ua, _rgxmap.engine);
            return _engine;
        };
        this.getOS = function () {
            var _os = {};
            _os[NAME] = undefined;
            _os[VERSION] = undefined;
            rgxMapper.call(_os, _ua, _rgxmap.os);
            if (_isSelfNav && !_os[NAME] && _uach && _uach.platform && _uach.platform != 'Unknown') {
                _os[NAME] = _uach.platform  
                                    .replace(/chrome os/i, CHROMIUM_OS)
                                    .replace(/macos/i, MAC_OS);           // backward compatibility
            }
            return _os;
        };
        this.getResult = function () {
            return {
                ua      : this.getUA(),
                browser : this.getBrowser(),
                engine  : this.getEngine(),
                os      : this.getOS(),
                device  : this.getDevice(),
                cpu     : this.getCPU()
            };
        };
        this.getUA = function () {
            return _ua;
        };
        this.setUA = function (ua) {
            _ua = (typeof ua === STR_TYPE && ua.length > UA_MAX_LENGTH) ? trim(ua, UA_MAX_LENGTH) : ua;
            return this;
        };
        this.setUA(_ua);
        return this;
    };

    UAParser.VERSION = LIBVERSION;
    UAParser.BROWSER =  enumerize([NAME, VERSION, MAJOR]);
    UAParser.CPU = enumerize([ARCHITECTURE]);
    UAParser.DEVICE = enumerize([MODEL, VENDOR, TYPE, CONSOLE, MOBILE, SMARTTV, TABLET, WEARABLE, EMBEDDED]);
    UAParser.ENGINE = UAParser.OS = enumerize([NAME, VERSION]);

    ///////////
    // Export
    //////////

    // check js environment
    if (typeof(exports) !== UNDEF_TYPE) {
        // nodejs env
        if (typeof module !== UNDEF_TYPE && module.exports) {
            exports = module.exports = UAParser;
        }
        exports.UAParser = UAParser;
    } else {
        // requirejs env (optional)
        if (typeof(define) === FUNC_TYPE && define.amd) {
            define(function () {
                return UAParser;
            });
        } else if (typeof window !== UNDEF_TYPE) {
            // browser env
            window.UAParser = UAParser;
        }
    }

    // jQuery/Zepto specific (optional)
    // Note:
    //   In AMD env the global scope should be kept clean, but jQuery is an exception.
    //   jQuery always exports to global scope, unless jQuery.noConflict(true) is used,
    //   and we should catch that.
    var $ = typeof window !== UNDEF_TYPE && (window.jQuery || window.Zepto);
    if ($ && !$.ua) {
        var parser = new UAParser();
        $.ua = parser.getResult();
        $.ua.get = function () {
            return parser.getUA();
        };
        $.ua.set = function (ua) {
            parser.setUA(ua);
            var result = parser.getResult();
            for (var prop in result) {
                $.ua[prop] = result[prop];
            }
        };
    }

})(typeof window === 'object' ? window : this);

},{}],111:[function(_dereq_,module,exports){
(function (global){(function (){

/**
 * Module exports.
 */

module.exports = deprecate;

/**
 * Mark that a method should not be used.
 * Returns a modified function which warns once by default.
 *
 * If `localStorage.noDeprecation = true` is set, then it is a no-op.
 *
 * If `localStorage.throwDeprecation = true` is set, then deprecated functions
 * will throw an Error when invoked.
 *
 * If `localStorage.traceDeprecation = true` is set, then deprecated functions
 * will invoke `console.trace()` instead of `console.error()`.
 *
 * @param {Function} fn - the function to deprecate
 * @param {String} msg - the string to print to the console when `fn` is invoked
 * @returns {Function} a new "deprecated" version of `fn`
 * @api public
 */

function deprecate (fn, msg) {
  if (config('noDeprecation')) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (config('throwDeprecation')) {
        throw new Error(msg);
      } else if (config('traceDeprecation')) {
        console.trace(msg);
      } else {
        console.warn(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
}

/**
 * Checks `localStorage` for boolean values for the given `name`.
 *
 * @param {String} name
 * @returns {Boolean}
 * @api private
 */

function config (name) {
  // accessing global.localStorage can trigger a DOMException in sandboxed iframes
  try {
    if (!global.localStorage) return false;
  } catch (_) {
    return false;
  }
  var val = global.localStorage[name];
  if (null == val) return false;
  return String(val).toLowerCase() === 'true';
}

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],112:[function(_dereq_,module,exports){
(function (process,Buffer){(function (){
var stream = _dereq_('readable-stream')
var eos = _dereq_('end-of-stream')
var inherits = _dereq_('inherits')
var shift = _dereq_('stream-shift')

var SIGNAL_FLUSH = (Buffer.from && Buffer.from !== Uint8Array.from)
  ? Buffer.from([0])
  : new Buffer([0])

var onuncork = function(self, fn) {
  if (self._corked) self.once('uncork', fn)
  else fn()
}

var autoDestroy = function (self, err) {
  if (self._autoDestroy) self.destroy(err)
}

var destroyer = function(self, end) {
  return function(err) {
    if (err) autoDestroy(self, err.message === 'premature close' ? null : err)
    else if (end && !self._ended) self.end()
  }
}

var end = function(ws, fn) {
  if (!ws) return fn()
  if (ws._writableState && ws._writableState.finished) return fn()
  if (ws._writableState) return ws.end(fn)
  ws.end()
  fn()
}

var toStreams2 = function(rs) {
  return new (stream.Readable)({objectMode:true, highWaterMark:16}).wrap(rs)
}

var Duplexify = function(writable, readable, opts) {
  if (!(this instanceof Duplexify)) return new Duplexify(writable, readable, opts)
  stream.Duplex.call(this, opts)

  this._writable = null
  this._readable = null
  this._readable2 = null

  this._autoDestroy = !opts || opts.autoDestroy !== false
  this._forwardDestroy = !opts || opts.destroy !== false
  this._forwardEnd = !opts || opts.end !== false
  this._corked = 1 // start corked
  this._ondrain = null
  this._drained = false
  this._forwarding = false
  this._unwrite = null
  this._unread = null
  this._ended = false

  this.destroyed = false

  if (writable) this.setWritable(writable)
  if (readable) this.setReadable(readable)
}

inherits(Duplexify, stream.Duplex)

Duplexify.obj = function(writable, readable, opts) {
  if (!opts) opts = {}
  opts.objectMode = true
  opts.highWaterMark = 16
  return new Duplexify(writable, readable, opts)
}

Duplexify.prototype.cork = function() {
  if (++this._corked === 1) this.emit('cork')
}

Duplexify.prototype.uncork = function() {
  if (this._corked && --this._corked === 0) this.emit('uncork')
}

Duplexify.prototype.setWritable = function(writable) {
  if (this._unwrite) this._unwrite()

  if (this.destroyed) {
    if (writable && writable.destroy) writable.destroy()
    return
  }

  if (writable === null || writable === false) {
    this.end()
    return
  }

  var self = this
  var unend = eos(writable, {writable:true, readable:false}, destroyer(this, this._forwardEnd))

  var ondrain = function() {
    var ondrain = self._ondrain
    self._ondrain = null
    if (ondrain) ondrain()
  }

  var clear = function() {
    self._writable.removeListener('drain', ondrain)
    unend()
  }

  if (this._unwrite) process.nextTick(ondrain) // force a drain on stream reset to avoid livelocks

  this._writable = writable
  this._writable.on('drain', ondrain)
  this._unwrite = clear

  this.uncork() // always uncork setWritable
}

Duplexify.prototype.setReadable = function(readable) {
  if (this._unread) this._unread()

  if (this.destroyed) {
    if (readable && readable.destroy) readable.destroy()
    return
  }

  if (readable === null || readable === false) {
    this.push(null)
    this.resume()
    return
  }

  var self = this
  var unend = eos(readable, {writable:false, readable:true}, destroyer(this))

  var onreadable = function() {
    self._forward()
  }

  var onend = function() {
    self.push(null)
  }

  var clear = function() {
    self._readable2.removeListener('readable', onreadable)
    self._readable2.removeListener('end', onend)
    unend()
  }

  this._drained = true
  this._readable = readable
  this._readable2 = readable._readableState ? readable : toStreams2(readable)
  this._readable2.on('readable', onreadable)
  this._readable2.on('end', onend)
  this._unread = clear

  this._forward()
}

Duplexify.prototype._read = function() {
  this._drained = true
  this._forward()
}

Duplexify.prototype._forward = function() {
  if (this._forwarding || !this._readable2 || !this._drained) return
  this._forwarding = true

  var data

  while (this._drained && (data = shift(this._readable2)) !== null) {
    if (this.destroyed) continue
    this._drained = this.push(data)
  }

  this._forwarding = false
}

Duplexify.prototype.destroy = function(err) {
  if (this.destroyed) return
  this.destroyed = true

  var self = this
  process.nextTick(function() {
    self._destroy(err)
  })
}

Duplexify.prototype._destroy = function(err) {
  if (err) {
    var ondrain = this._ondrain
    this._ondrain = null
    if (ondrain) ondrain(err)
    else this.emit('error', err)
  }

  if (this._forwardDestroy) {
    if (this._readable && this._readable.destroy) this._readable.destroy()
    if (this._writable && this._writable.destroy) this._writable.destroy()
  }

  this.emit('close')
}

Duplexify.prototype._write = function(data, enc, cb) {
  if (this.destroyed) return cb()
  if (this._corked) return onuncork(this, this._write.bind(this, data, enc, cb))
  if (data === SIGNAL_FLUSH) return this._finish(cb)
  if (!this._writable) return cb()

  if (this._writable.write(data) === false) this._ondrain = cb
  else cb()
}

Duplexify.prototype._finish = function(cb) {
  var self = this
  this.emit('preend')
  onuncork(this, function() {
    end(self._forwardEnd && self._writable, function() {
      // haxx to not emit prefinish twice
      if (self._writableState.prefinished === false) self._writableState.prefinished = true
      self.emit('prefinish')
      onuncork(self, cb)
    })
  })
}

Duplexify.prototype.end = function(data, enc, cb) {
  if (typeof data === 'function') return this.end(null, null, data)
  if (typeof enc === 'function') return this.end(data, null, enc)
  this._ended = true
  if (data) this.write(data)
  if (!this._writableState.ending) this.write(SIGNAL_FLUSH)
  return stream.Writable.prototype.end.call(this, cb)
}

module.exports = Duplexify

}).call(this)}).call(this,_dereq_('_process'),_dereq_("buffer").Buffer)
},{"_process":79,"buffer":18,"end-of-stream":35,"inherits":66,"readable-stream":96,"stream-shift":102}],113:[function(_dereq_,module,exports){
(function (process,global){(function (){
'use strict'

var Transform = _dereq_('readable-stream').Transform
var duplexify = _dereq_('duplexify')
var WS = _dereq_('ws')
var Buffer = _dereq_('safe-buffer').Buffer

module.exports = WebSocketStream

function buildProxy (options, socketWrite, socketEnd) {
  var proxy = new Transform({
    objectMode: options.objectMode
  })

  proxy._write = socketWrite
  proxy._flush = socketEnd

  return proxy
}

function WebSocketStream(target, protocols, options) {
  var stream, socket

  var isBrowser = process.title === 'browser'
  var isNative = !!global.WebSocket
  var socketWrite = isBrowser ? socketWriteBrowser : socketWriteNode

  if (protocols && !Array.isArray(protocols) && 'object' === typeof protocols) {
    // accept the "options" Object as the 2nd argument
    options = protocols
    protocols = null

    if (typeof options.protocol === 'string' || Array.isArray(options.protocol)) {
      protocols = options.protocol;
    }
  }

  if (!options) options = {}

  if (options.objectMode === undefined) {
    options.objectMode = !(options.binary === true || options.binary === undefined)
  }

  var proxy = buildProxy(options, socketWrite, socketEnd)

  if (!options.objectMode) {
    proxy._writev = writev
  }

  // browser only: sets the maximum socket buffer size before throttling
  var bufferSize = options.browserBufferSize || 1024 * 512

  // browser only: how long to wait when throttling
  var bufferTimeout = options.browserBufferTimeout || 1000

  // use existing WebSocket object that was passed in
  if (typeof target === 'object') {
    socket = target
  // otherwise make a new one
  } else {
    // special constructor treatment for native websockets in browsers, see
    // https://github.com/maxogden/websocket-stream/issues/82
    if (isNative && isBrowser) {
      socket = new WS(target, protocols)
    } else {
      socket = new WS(target, protocols, options)
    }

    socket.binaryType = 'arraybuffer'
  }
  
  // according to https://github.com/baygeldin/ws-streamify/issues/1
  // Nodejs WebSocketServer cause memory leak
  // Handlers like onerror, onclose, onmessage and onopen are accessible via setter/getter
  // And setter first of all fires removeAllListeners, that doesnt make inner array of clients on WebSocketServer cleared ever
  var eventListenerSupport = ('undefined' === typeof socket.addEventListener)

  // was already open when passed in
  if (socket.readyState === socket.OPEN) {
    stream = proxy
  } else {
    stream = stream = duplexify(undefined, undefined, options)
    if (!options.objectMode) {
      stream._writev = writev
    }
    
    if (eventListenerSupport) {
       socket.addEventListener('open', onopen)
    } else {
       socket.onopen = onopen
    }
  }

  stream.socket = socket

  if (eventListenerSupport) {
     socket.addEventListener('close', onclose)
     socket.addEventListener('error', onerror)
     socket.addEventListener('message', onmessage)
  } else {
     socket.onclose = onclose
     socket.onerror = onerror
     socket.onmessage = onmessage
  }

  proxy.on('close', destroy)

  var coerceToBuffer = !options.objectMode

  function socketWriteNode(chunk, enc, next) {
    // avoid errors, this never happens unless
    // destroy() is called
    if (socket.readyState !== socket.OPEN) {
      next()
      return
    }

    if (coerceToBuffer && typeof chunk === 'string') {
      chunk = Buffer.from(chunk, 'utf8')
    }
    socket.send(chunk, next)
  }

  function socketWriteBrowser(chunk, enc, next) {
    if (socket.bufferedAmount > bufferSize) {
      setTimeout(socketWriteBrowser, bufferTimeout, chunk, enc, next)
      return
    }

    if (coerceToBuffer && typeof chunk === 'string') {
      chunk = Buffer.from(chunk, 'utf8')
    }

    try {
      socket.send(chunk)
    } catch(err) {
      return next(err)
    }

    next()
  }

  function socketEnd(done) {
    socket.close()
    done()
  }

  function onopen() {
    stream.setReadable(proxy)
    stream.setWritable(proxy)
    stream.emit('connect')
  }

  function onclose() {
    stream.end()
    stream.destroy()
  }

  function onerror(err) {
    stream.destroy(err)
  }

  function onmessage(event) {
    var data = event.data
    if (data instanceof ArrayBuffer) data = Buffer.from(data)
    else data = Buffer.from(data, 'utf8')
    proxy.push(data)
  }

  function destroy() {
    socket.close()
  }

  // this is to be enabled only if objectMode is false
  function writev (chunks, cb) {
    var buffers = new Array(chunks.length)
    for (var i = 0; i < chunks.length; i++) {
      if (typeof chunks[i].chunk === 'string') {
        buffers[i] = Buffer.from(chunks[i], 'utf8')
      } else {
        buffers[i] = chunks[i].chunk
      }
    }

    this._write(Buffer.concat(buffers), 'binary', cb)
  }

  return stream
}

}).call(this)}).call(this,_dereq_('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":79,"duplexify":112,"readable-stream":96,"safe-buffer":98,"ws":114}],114:[function(_dereq_,module,exports){

var ws = null

if (typeof WebSocket !== 'undefined') {
  ws = WebSocket
} else if (typeof MozWebSocket !== 'undefined') {
  ws = MozWebSocket
} else if (typeof window !== 'undefined') {
  ws = window.WebSocket || window.MozWebSocket
}

module.exports = ws

},{}],115:[function(_dereq_,module,exports){
// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
module.exports = wrappy
function wrappy (fn, cb) {
  if (fn && cb) return wrappy(fn)(cb)

  if (typeof fn !== 'function')
    throw new TypeError('need wrapper function')

  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k]
  })

  return wrapper

  function wrapper() {
    var args = new Array(arguments.length)
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i]
    }
    var ret = fn.apply(this, args)
    var cb = args[args.length-1]
    if (typeof ret === 'function' && ret !== cb) {
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k]
      })
    }
    return ret
  }
}

},{}],116:[function(_dereq_,module,exports){
module.exports={
  "name": "videomail-client",
  "version": "9.2.22",
  "description": "A wicked npm package to record videos directly in the browser, wohooo!",
  "keywords": [
    "webcam",
    "video",
    "videomail",
    "encoder",
    "getusermedia",
    "audio",
    "recorder"
  ],
  "homepage": "https://videomail.io",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/binarykitchen/videomail-client.git"
  },
  "license": "CC0-1.0",
  "author": "Michael Heuberger <michael.heuberger@binarykitchen.com>",
  "contributors": [
    {
      "name": "Michael Heuberger",
      "email": "michael.heuberger@binarykitchen.com"
    }
  ],
  "main": "prototype/js/videomail-client.js",
  "scripts": {
    "audit": "npx audit-ci --config audit-ci.json",
    "build": "gulp build",
    "clean": "rm -rf node_modules && rm -rf package-lock.json",
    "lint": "eslint --color ./src ./test ./gulpfile.js",
    "lint:fix": "npm --silent run lint -- --fix",
    "major": "./env/dev/release.sh --importance=major",
    "minor": "./env/dev/release.sh --importance=minor",
    "patch": "./env/dev/release.sh --importance=patch",
    "prettier": "prettier --check ./src ./test ./prototype/*.html gulpfile.js",
    "prettier:fix": "prettier --write ./src ./test ./prototype/*.html gulpfile.js",
    "test": "gulp test",
    "watch": "NODE_NO_HTTP2=1 gulp watch"
  },
  "prettier": "./prettier.config.cjs",
  "dependencies": {
    "@babel/core": "7.25.2",
    "add-eventlistener-with-options": "1.25.5",
    "animitter": "3.0.0",
    "audio-sample": "4.0.1",
    "canvas-to-buffer": "4.0.1",
    "classlist.js": "1.1.20150312",
    "contains": "0.1.1",
    "core-js": "3.38.1",
    "create-error": "0.3.1",
    "deepmerge": "4.3.1",
    "defined": "1.0.1",
    "despot": "2.0.0",
    "document-visibility": "1.0.1",
    "filesize": "10.1.6",
    "format-util": "1.0.5",
    "get-form-data": "3.0.0",
    "hidden": "1.1.1",
    "humanize-duration": "3.32.1",
    "hyperscript": "2.0.2",
    "inherits": "2.0.4",
    "insert-css": "2.0.0",
    "iphone-inline-video": "2.2.2",
    "is-power-of-two": "1.0.0",
    "keymirror": "0.1.1",
    "number-is-integer": "2.0.0",
    "request-frame": "1.5.3",
    "safe-json-stringify": "1.2.0",
    "superagent": "8.1.2",
    "ua-parser-js": "1.0.38",
    "websocket-stream": "5.5.2"
  },
  "devDependencies": {
    "@babel/eslint-parser": "7.25.1",
    "@babel/plugin-transform-runtime": "7.25.4",
    "@babel/preset-env": "7.25.4",
    "audit-ci": "7.1.0",
    "autoprefixer": "10.4.20",
    "babelify": "10.0.0",
    "body-parser": "1.20.2",
    "browserify": "17.0.0",
    "connect-send-json": "1.0.0",
    "cssnano": "6.0.5",
    "del": "6.1.1",
    "eslint": "8.57.0",
    "eslint-config-prettier": "9.1.0",
    "eslint-plugin-import": "2.30.0",
    "eslint-plugin-node": "11.1.0",
    "eslint-plugin-promise": "6.2.0",
    "fancy-log": "2.0.0",
    "glob": "10.4.2",
    "gulp": "4.0.2",
    "gulp-bump": "3.2.0",
    "gulp-bytediff": "1.0.0",
    "gulp-concat": "2.6.1",
    "gulp-connect": "5.7.0",
    "gulp-derequire": "3.0.0",
    "gulp-if": "3.0.0",
    "gulp-inject-string": "1.1.2",
    "gulp-load-plugins": "2.0.8",
    "gulp-plumber": "1.2.1",
    "gulp-postcss": "10.0.0",
    "gulp-rename": "2.0.0",
    "gulp-sourcemaps": "3.0.0",
    "gulp-stylus": "3.0.1",
    "gulp-terser": "2.1.0",
    "minimist": "1.2.8",
    "nib": "1.2.0",
    "postcss": "8.4.45",
    "prettier": "3.3.3",
    "prettier-plugin-curly": "0.2.2",
    "prettier-plugin-organize-imports": "4.0.0",
    "prettier-plugin-packagejson": "2.5.2",
    "prettier-plugin-sh": "0.14.0",
    "router": "1.3.8",
    "tape": "5.8.1",
    "tape-catch": "1.0.6",
    "tape-run": "11.0.0",
    "vinyl-buffer": "1.0.1",
    "vinyl-source-stream": "2.0.0",
    "watchify": "4.0.0"
  },
  "engines": {
    "node": "^20.16.0",
    "npm": "^10.8.1"
  },
  "readmeFilename": "README.md"
}

},{}],117:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _deepmerge = _interopRequireDefault(_dereq_("deepmerge"));
var _inherits = _interopRequireDefault(_dereq_("inherits"));
var _constants = _interopRequireDefault(_dereq_("./constants"));
var _events = _interopRequireDefault(_dereq_("./events"));
var _options = _interopRequireDefault(_dereq_("./options"));
var _resource = _interopRequireDefault(_dereq_("./resource"));
var _browser = _interopRequireDefault(_dereq_("./util/browser"));
var _collectLogger = _interopRequireDefault(_dereq_("./util/collectLogger"));
var _eventEmitter = _interopRequireDefault(_dereq_("./util/eventEmitter"));
var _container = _interopRequireDefault(_dereq_("./wrappers/container"));
var _addOptionsFunctions = _interopRequireDefault(_dereq_("./util/addOptionsFunctions"));
var collectLogger;
var browser;
function adjustOptions() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var localOptions = (0, _deepmerge.default)(_options.default, options, {
    arrayMerge: function arrayMerge(_destination, source) {
      return source;
    }
  });
  collectLogger || (collectLogger = new _collectLogger.default(localOptions));
  localOptions.logger = collectLogger;
  localOptions.debug = localOptions.logger.debug;
  var localOptionsWithFunctions = (0, _addOptionsFunctions.default)(localOptions);
  return localOptionsWithFunctions;
}
function getBrowser(localOptions) {
  if (!browser) {
    browser = new _browser.default(localOptions);
  }
  return browser;
}
var VideomailClient = function VideomailClient(options) {
  var localOptions = adjustOptions(options);
  var container = new _container.default(localOptions);
  var debug = localOptions.debug;
  this.events = _events.default;
  _eventEmitter.default.call(this, localOptions, "VideomailClient");
  this.build = function () {
    var building = false;

    /*
     * it can happen that it gets called twice, i.E. when an error is thrown
     * in the middle of the build() fn
     */
    if (!building && !container.isBuilt()) {
      debug("Client: build()");
      building = true;
      container.build();
      building = false;
    }
  };
  this.show = function () {
    if (!container.isBuilt()) {
      this.build();
    }
    container.show();
  };

  /*
   * Automatically adds a <video> element inside the given parentElement and
   * loads it with the videomail
   */
  this.replay = function (videomail, replayParentElement) {
    if (!container.isBuilt()) {
      container.build(true, replayParentElement);
    }
    if (videomail) {
      videomail = container.addPlayerDimensions(videomail);
    }
    container.buildForm();
    container.loadForm(videomail);

    // Wait until ready to avoid HTTP 416 errors (request range unavailable)
    this.once(_events.default.REPLAY_SHOWN, function () {
      container.showReplayOnly();
    });
    var replay = container.getReplay();
    replay.setVideomail(videomail);
  };
  this.startOver = function (params) {
    var replay = container.getReplay();
    if (replay) {
      replay.hide();
      replay.reset();
    }
    container.startOver(params);
  };
  this.unload = function (e) {
    this.removeAllListeners();
    container.unload(e);
  };
  this.hide = function () {
    container.hide();
  };
  this.getByAlias = function (alias, cb) {
    var resource = new _resource.default(localOptions);
    resource.getByAlias(alias, function (err, videomail) {
      if (err) {
        cb(err);
      } else {
        cb(null, container.addPlayerDimensions(videomail));
      }
    });
  };

  // Shim, backward compat
  this.get = this.getByAlias;
  this.getByKey = function (key, cb) {
    var resource = new _resource.default(localOptions);
    resource.getByKey(key, function (err, videomail) {
      if (err) {
        cb(err);
      } else {
        cb(null, container.addPlayerDimensions(videomail));
      }
    });
  };
  this.canRecord = function () {
    return getBrowser(localOptions).canRecord();
  };

  // Returns true when a video has been recorded but is not submitted yet
  this.isDirty = function () {
    return container.isDirty();
  };
  this.isBuilt = function () {
    return container.isBuilt();
  };
  this.isRecording = function () {
    return container.isRecording();
  };
  this.submit = function () {
    container.submit();
  };
  this.getLogLines = function () {
    if (localOptions.logger && localOptions.logger.getLines) {
      return localOptions.logger.getLines();
    }
  };
};
(0, _inherits.default)(VideomailClient, _eventEmitter.default);
Object.keys(_constants.default.public).forEach(function (name) {
  VideomailClient[name] = _constants.default.public[name];
});

// just another convenient thing
VideomailClient.Events = _events.default;
var _default = exports.default = VideomailClient;

},{"./constants":118,"./events":119,"./options":120,"./resource":121,"./util/addOptionsFunctions":122,"./util/browser":124,"./util/collectLogger":125,"./util/eventEmitter":126,"./wrappers/container":133,"@babel/runtime/helpers/interopRequireDefault":4,"deepmerge":28,"inherits":66}],118:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
// constants (changing these only break down functionality, so be careful)
var _default = exports.default = {
  SITE_NAME_LABEL: "x-videomail-site-name",
  VERSION_LABEL: "videomailClientVersion",
  public: {
    ENC_TYPE_APP_JSON: "application/json",
    ENC_TYPE_FORM: "application/x-www-form-urlencoded"
  }
};

},{}],119:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _keymirror = _interopRequireDefault(_dereq_("keymirror"));
var _default = exports.default = (0, _keymirror.default)({
  BUILT: null,
  // all dom elements are ready, are in the DOM
  FORM_READY: null,
  // form is ready, available in the DOM
  LOADING_USER_MEDIA: null,
  // asking for webcam access
  USER_MEDIA_READY: null,
  // user media (= webcam) is ready, loaded
  CONNECTING: null,
  // socket is connecting to server
  CONNECTED: null,
  // socket is connected to server
  DISCONNECTED: null,
  // socket to server is disconnected
  COUNTDOWN: null,
  // countdown for recording has started
  RECORDING: null,
  // webcam is recording
  STOPPING: null,
  // recording is being stopped (= preview)
  STOPPED: null,
  // recording has stopped
  PROGRESS: null,
  // start sending
  BEGIN_AUDIO_ENCODING: null,
  // encoding video
  BEGIN_VIDEO_ENCODING: null,
  // encoding video
  RESETTING: null,
  // resetting everything to go back to initial state
  PAUSED: null,
  // recording is being paused
  RESUMING: null,
  // recording is resumed
  PREVIEW: null,
  // video preview is set
  PREVIEW_SHOWN: null,
  // video preview is shown
  REPLAY_SHOWN: null,
  // submitted video is shown
  INVALID: null,
  // form is invalid
  VALIDATING: null,
  // form is being validated
  VALID: null,
  // form is valid
  SUBMITTING: null,
  // form is being submitted
  SUBMITTED: null,
  // form has been successfully submitted
  ERROR: null,
  // an error occurred
  BLOCKING: null,
  // something serious, most likely an error, is shown and blocks
  SENDING_FIRST_FRAME: null,
  // emitted before the first frame is being computed
  FIRST_FRAME_SENT: null,
  // emitted once when fist frame has been sent to server
  HIDE: null,
  // emitted when hidden
  NOTIFYING: null,
  // notifies user about something (not blocking)
  ENABLING_AUDIO: null,
  // about to enable audio
  DISABLING_AUDIO: null,
  // about to disable audio
  LOADED_META_DATA: null,
  // raised when webcam knows its dimensions
  EVENT_EMITTED: null,
  // for debugging only, is emitted when an event is emitted lol,
  GOING_BACK: null,
  // switch from replaying back to recording
  STARTING_OVER: null,
  // starting all over again back to its initial state
  ASKING_WEBCAM_PERMISSION: null,
  // when about to ask for webcam permissions
  VISIBLE: null,
  // document just became visible
  INVISIBLE: null,
  // document just became INvisible
  SWITCH_FACING_MODE: null,
  // to switch camera on mobiles between front and back
  SERVER_READY: null,
  // Gets emitted when the ready command is sent through sockets from the server for recording
  UNLOADING: null
});

},{"@babel/runtime/helpers/interopRequireDefault":4,"keymirror":73}],120:[function(_dereq_,module,exports){
(function (process){(function (){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _package = _dereq_("../../package.json");
var _addOptionsFunctions = _interopRequireDefault(_dereq_("./util/addOptionsFunctions"));
var PRODUCTION = process.env.NODE_ENV === "production";
var options = {
  logger: null,
  // define logging instance. leave null for default, console.
  logStackSize: 30,
  // limits the stack size of log outputs to collect
  verbose: !PRODUCTION,
  // set true to log more info
  baseUrl: "https://videomail.io",
  // leave as it, permanent API url to post videos
  socketUrl: "wss://videomail.io",
  // leave as it, permanent websocket url to send frames
  siteName: "videomail-client-demo",
  // Required for API, use https://videomail.io/whitelist
  insertCss: true,
  // inserts predefined CSS, see examples
  enablePause: true,
  // enable pause/resume button
  enableAutoPause: true,
  // automatically pauses when window becomes inactive
  enableSpace: true,
  // hitting space can pause recording
  submitWithVideomail: false,
  // when enabled, all videomail metadata is submitted
  // under the `videomail` key inside the form data body.
  disableSubmit: false,
  // set this to true if you do not want to submit videos,
  // but just want to record and replay these temporarily
  enableAutoValidation: true,
  // automatically validates all form inputs if any exist and
  enableAutoUnload: true,
  // automatically unloads VC when navigating away
  /*
   * does not /enable disable submit button after recording
   * when something else seems invalid.
   */
  enableAutoSubmission: true,
  // automatically submits the form where the videomail-client
  /*
   * appears upon press of submit button. disable it when
   * you want a framework to deal with the form submission itself.
   */

  enctype: "application/json",
  // enctype for the form submission. currently implemented are:
  // 'application/json' and 'application/x-www-form-urlencoded'

  // default CSS selectors you can alter, see examples
  selectors: {
    containerId: "videomail",
    containerClass: "videomail",
    replayClass: "replay",
    userMediaClass: "userMedia",
    visualsClass: "visuals",
    buttonClass: null,
    // can also be used as a default class for all buttons
    buttonsClass: "buttons",
    recordButtonClass: "record",
    pauseButtonClass: "pause",
    resumeButtonClass: "resume",
    previewButtonClass: "preview",
    recordAgainButtonClass: "recordAgain",
    submitButtonClass: "submit",
    subjectInputName: "subject",
    // the form input name for subject
    fromInputName: "from",
    // the form input name for the from email
    toInputName: "to",
    // the form input name for the to email
    ccInputName: "cc",
    // the form input name for the cc email
    bccInputName: "bcc",
    // the form input name for the bcc email
    bodyInputName: "body",
    // the form input name for the message (body)
    sendCopyInputName: "sendCopy",
    // the form checkbox name for sending myself a copy

    keyInputName: "videomail_key",
    parentKeyInputName: "videomail_parent_key",
    formId: null,
    // automatically detects form if any
    submitButtonId: null,
    // semi-automatically detects submit button in the form
    // but if that does not work, try using the
    submitButtonSelector: null // submitButtonSelector
  },
  audio: {
    enabled: false,
    // set to true for experimental audio recording
    switch: false,
    // enables a switcher for audio recording (on/off)
    volume: 0.2,
    // must be between 0 .. 1 but 0.20 is recommended to avoid
    // distorting at the higher volume peaks
    bufferSize: "auto" // decides how often the audio is being sampled,
    /*
     * can be 'auto' or an integer being a power of two like 512 or 2048
     * the higher the less traffic, but harder to adjust with rubberband
     * to match with the video length on server side during encoding
     */
  },
  video: {
    fps: 15,
    // depends on your connection
    limitSeconds: 30,
    // recording automatically stops after that limit
    countdown: 3,
    // set it to 0 or false to disable it

    /*
     * it is recommended to set one dimension only and leave the other one to auto
     * because each webcam has a different aspect ratio
     */

    width: "auto",
    // or use an integer for exact pixels
    height: "auto",
    // or use an integer for exact pixels
    facingMode: "user",
    // can be 'user', 'environment', 'left' or 'right'. useful for mobiles.
    facingModeButton: false,
    stretch: false // Set to true if you want the video to take the full width of the parent container
  },
  image: {
    quality: 0.42,
    types: ["webp", "jpeg"] // recommended settings to make most of all browsers
  },
  // alter these text for internationalization
  text: {
    pausedHeader: "Paused",
    pausedHint: null,
    sending: "Teleporting",
    encoding: "Encoding",
    limitReached: "Limit reached",
    audioOff: "Audio off",
    audioOn: "Audio on",
    buttons: {
      record: "Record video",
      recordAgain: "Record again",
      resume: "Resume",
      pause: "Pause",
      preview: "Preview"
    }
  },
  notifier: {
    entertain: false,
    // when true, user is entertained while waiting, see examples
    entertainClass: "bg",
    entertainLimit: 6,
    entertainInterval: 9000
  },
  timeouts: {
    userMedia: 20e3,
    // in milliseconds, increase if you want user give more time to enable webcam
    connection: 1e4,
    // in seconds, increase if api is slow
    pingInterval: 30e3 // in milliseconds, keeps web stream (connection) alive when pausing
  },
  loadUserMediaOnRecord: false,
  // when true, user media is loaded only when record button is pressed

  callbacks: {
    /*
     * a custom callback to tweak form data before posting to server
     * this is for advanced use only and shouldn't be used if possible
     */
    adjustFormDataBeforePosting: null
  },
  defaults: {
    from: null,
    // define default FROM email address
    to: null,
    // define default TO email address
    cc: null,
    // define default CC email address
    bcc: null,
    // define default BCC email address
    subject: null,
    // define default subject line
    body: null // define default body content
  },
  // show errors inside the container?
  displayErrors: true,
  // true = all form inputs get disabled and disappear when browser can't record
  adjustFormOnBrowserError: false,
  /*
   * when true, any errors will be sent to the videomail server for analysis
   * ps: can be a function too returning a boolean
   */
  reportErrors: false,
  // just for testing purposes to simulate browser agent handling
  fakeUaString: null,
  version: _package.version
};

// Add some helper functions to options
var optionsWithFunctions = (0, _addOptionsFunctions.default)(options);
var _default = exports.default = optionsWithFunctions;

}).call(this)}).call(this,_dereq_('_process'))
},{"../../package.json":116,"./util/addOptionsFunctions":122,"@babel/runtime/helpers/interopRequireDefault":4,"_process":79}],121:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _superagent = _interopRequireDefault(_dereq_("superagent"));
var _constants = _interopRequireDefault(_dereq_("./constants"));
var timezoneId = Intl.DateTimeFormat().resolvedOptions().timeZone;
function _default(options) {
  function applyDefaultValue(videomail, name) {
    if (options.defaults[name] && !videomail[name]) {
      videomail[name] = options.defaults[name];
    }
    return videomail;
  }
  function applyDefaultValues(videomail) {
    if (options.defaults) {
      videomail = applyDefaultValue(videomail, "from");
      videomail = applyDefaultValue(videomail, "to");
      videomail = applyDefaultValue(videomail, "cc");
      videomail = applyDefaultValue(videomail, "bcc");
      videomail = applyDefaultValue(videomail, "subject");
      videomail = applyDefaultValue(videomail, "body");
    }
    return videomail;
  }
  function setProperty(packedError, property, value) {
    Object.defineProperty(packedError, property, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  }
  function packError(err, res) {
    if (res && res.body && res.body.error) {
      var originalError = res.body.error;
      var packedError = new Error();
      setProperty(packedError, "name", originalError.name);
      setProperty(packedError, "type", originalError.type);
      setProperty(packedError, "message", originalError.message || res.statusText);
      setProperty(packedError, "cause", originalError.cause);
      setProperty(packedError, "status", originalError.status);
      setProperty(packedError, "code", originalError.code);
      setProperty(packedError, "errno", originalError.errno);
      setProperty(packedError, "details", originalError.details);
      setProperty(packedError, "stack", originalError.stack);
      return packedError;
    }
    return err;
  }
  function fetch(identifierName, identifierValue, cb) {
    var url = "".concat(options.baseUrl, "/videomail/").concat(identifierName, "/").concat(identifierValue, "/snapshot");
    var request = (0, _superagent.default)("get", url);
    request.type("json").set("Accept", "application/json").set("Timezone-Id", timezoneId).set(_constants.default.SITE_NAME_LABEL, options.siteName).timeout(options.timeouts.connection).end(function (err, res) {
      if (err) {
        var prettyError = packError(err, res);
        cb(prettyError);
      } else {
        var videomail = res.body ? res.body : null;
        cb(null, videomail);
      }
    });
  }
  function write(method, videomail, identifier, cb) {
    if (!cb) {
      cb = identifier;
      identifier = null;
    }
    var queryParams = {};
    var url = "".concat(options.baseUrl, "/videomail/");
    if (identifier) {
      url += identifier;
    }
    var request = (0, _superagent.default)(method, url);
    queryParams[_constants.default.SITE_NAME_LABEL] = options.siteName;
    request.query(queryParams).set("Timezone-Id", timezoneId).send(videomail).timeout(options.timeout).end(function (err, res) {
      if (err) {
        var prettyError = packError(err, res);
        cb(prettyError);
      } else {
        var returnedVideomail = res.body && res.body.videomail ? res.body.videomail : null;
        cb(null, returnedVideomail, res.body);
      }
    });
  }
  this.getByAlias = function (alias, cb) {
    fetch("alias", alias, cb);
  };
  this.getByKey = function (key, cb) {
    fetch("key", key, cb);
  };
  this.reportError = function (err, cb) {
    var queryParams = {};
    var url = "".concat(options.baseUrl, "/client-error/");
    var request = (0, _superagent.default)("post", url);
    queryParams[_constants.default.SITE_NAME_LABEL] = options.siteName;
    request.query(queryParams).send(err).timeout(options.timeout).end(function (err, res) {
      if (err) {
        var prettyError = packError(err, res);
        cb && cb(prettyError);
      } else {
        cb && cb();
      }
    });
  };
  this.post = function (videomail, cb) {
    videomail = applyDefaultValues(videomail);

    /*
     * always good to know the version of the client
     * the videomail was submitted with
     */
    videomail[_constants.default.VERSION_LABEL] = options.version;
    if (options.callbacks.adjustFormDataBeforePosting) {
      options.callbacks.adjustFormDataBeforePosting(videomail, function (err, adjustedVideomail) {
        if (err) {
          cb(err);
        } else {
          write("post", adjustedVideomail, cb);
        }
      });
    } else {
      write("post", videomail, cb);
    }
  };
  this.put = function (videomail, cb) {
    write("put", videomail, videomail.key, cb);
  };
  this.form = function (formData, url, cb) {
    var formType;
    switch (options.enctype) {
      case _constants.default.public.ENC_TYPE_APP_JSON:
        formType = "json";
        break;
      case _constants.default.public.ENC_TYPE_FORM:
        formType = "form";
        break;
      default:
        // keep all callbacks async
        setTimeout(function () {
          cb(new Error("Invalid enctype given: ".concat(options.enctype)));
        }, 0);
    }
    if (formType) {
      _superagent.default.post(url).type(formType).set("Timezone-Id", timezoneId).send(formData).timeout(options.timeout).end(function (err, res) {
        if (err) {
          var prettyError = packError(err, res);
          cb(prettyError);
        } else {
          cb(null, res);
        }
      });
    }
  };
}

},{"./constants":118,"@babel/runtime/helpers/interopRequireDefault":4,"superagent":104}],122:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function addOptionsFunctions(options) {
  var audioEnabled = options.audio && options.audio.enabled;
  options.hasDefinedWidth = function () {
    return this.video.width && this.video.width !== "auto";
  };
  options.hasDefinedHeight = function () {
    return this.video.height && this.video.height !== "auto";
  };
  options.hasDefinedDimension = function () {
    return this.hasDefinedWidth() || this.hasDefinedHeight();
  };
  options.hasDefinedDimensions = function () {
    return this.hasDefinedWidth() && this.hasDefinedHeight();
  };
  options.getRatio = function () {
    var ratio = 1; // just a default one when no computations are possible

    // todo fix this, it's not really an option
    var hasVideoDimensions = this.videoHeight && this.videoWidth;
    if (this.hasDefinedDimensions()) {
      if (hasVideoDimensions) {
        // figure out first which one to pick
        if (this.videoHeight < this.video.height || this.videoWidth < this.video.width) {
          ratio = this.videoHeight / this.videoWidth;
        } else {
          ratio = this.video.height / this.video.width;
        }
      } else {
        ratio = this.video.height / this.video.width;
      }
    } else if (hasVideoDimensions) {
      ratio = this.videoHeight / this.videoWidth;
    }
    return ratio;
  };
  options.isAudioEnabled = function () {
    return audioEnabled;
  };
  options.setAudioEnabled = function (enabled) {
    audioEnabled = enabled;
  };
  options.isAutoPauseEnabled = function () {
    return this.enableAutoPause && this.enablePause;
  };
  return options;
}
var _default = exports.default = addOptionsFunctions;

},{}],123:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _audioSample = _interopRequireDefault(_dereq_("audio-sample"));
var _isPowerOfTwo = _interopRequireDefault(_dereq_("is-power-of-two"));
var _browser = _interopRequireDefault(_dereq_("./browser"));
var _videomailError = _interopRequireDefault(_dereq_("./videomailError"));
var CHANNELS = 1;

/*
 * for inspiration see
 * https://github.com/saebekassebil/microphone-stream
 */

// todo code needs rewrite

function _default(userMedia, options) {
  var scriptProcessor;
  var audioInput;
  var vcAudioContext;
  var browser = new _browser.default(options);
  function getAudioContextClass() {
    return window.AudioContext || window.webkitAudioContext;
  }
  function hasAudioContext() {
    return Boolean(getAudioContextClass()) && Boolean(getAudioContext());
  }
  function getAudioContext() {
    // instantiate only once
    if (!vcAudioContext) {
      var AudioContext = getAudioContextClass();
      vcAudioContext = new AudioContext();
    }
    return vcAudioContext;
  }
  function onAudioProcess(e, cb) {
    if (!userMedia.isRecording() || userMedia.isPaused()) {
      return;
    }

    /*
     * Returns a Float32Array containing the PCM data associated with the channel,
     * defined by the channel parameter (with 0 representing the first channel)
     */
    var float32Array = e.inputBuffer.getChannelData(0);
    cb(new _audioSample.default(float32Array));
  }
  this.init = function (localMediaStream) {
    options.debug("AudioRecorder: init()");

    // creates an audio node from the microphone incoming stream
    var volume = getAudioContext().createGain();
    try {
      audioInput = getAudioContext().createMediaStreamSource(localMediaStream);
    } catch (exc) {
      throw _videomailError.default.create("Webcam has no audio", exc.toString(), options);
    }
    var bufferSize = options.audio.bufferSize;

    // see https://github.com/binarykitchen/videomail-client/issues/184
    if (bufferSize === "auto") {
      if (browser.isFirefox()) {
        bufferSize = 512;
      } else {
        bufferSize = 2048;
      }
    }
    if (!(0, _isPowerOfTwo.default)(bufferSize)) {
      throw _videomailError.default.create("Audio buffer size must be a power of two.", options);
    }
    if (!options.audio.volume || options.audio.volume > 1) {
      throw _videomailError.default.create("Audio volume must be between zero and one.", options);
    }
    volume.gain.value = options.audio.volume;

    /*
     * Create a ScriptProcessorNode with the given bufferSize and
     * a single input and output channel
     */
    scriptProcessor = getAudioContext().createScriptProcessor(bufferSize, CHANNELS, CHANNELS);

    // connect stream to our scriptProcessor
    audioInput.connect(scriptProcessor);

    // connect our scriptProcessor to the previous destination
    scriptProcessor.connect(getAudioContext().destination);

    // connect volume
    audioInput.connect(volume);
    volume.connect(scriptProcessor);
  };
  this.record = function (cb) {
    options.debug("AudioRecorder: record()");
    scriptProcessor.onaudioprocess = function (e) {
      onAudioProcess(e, cb);
    };
  };
  this.stop = function () {
    options.debug("AudioRecorder: stop()");
    if (scriptProcessor) {
      scriptProcessor.onaudioprocess = undefined;
    }
    if (audioInput) {
      audioInput.disconnect();
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/close
    if (hasAudioContext()) {
      if (getAudioContext().close) {
        getAudioContext().close().then(function () {
          options.debug("AudioRecorder: audio context is closed");
          vcAudioContext = null;
        }).catch(function (err) {
          throw _videomailError.default.create(err, options);
        });
      } else {
        vcAudioContext = null;
      }
    }
  };
  this.getSampleRate = function () {
    if (hasAudioContext()) {
      return getAudioContext().sampleRate;
    }
    return -1;
  };
}

},{"./browser":124,"./videomailError":131,"@babel/runtime/helpers/interopRequireDefault":4,"audio-sample":14,"is-power-of-two":71}],124:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _typeof2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/typeof"));
var _defined = _interopRequireDefault(_dereq_("defined"));
var _uaParserJs = _interopRequireDefault(_dereq_("ua-parser-js"));
var _videomailError = _interopRequireDefault(_dereq_("./videomailError"));
var FALLBACK_VIDEO_TYPE = "mp4";
var Browser = function Browser(options) {
  options || (options = {});
  var firefoxDownload = "http://www.mozilla.org/firefox/update/";
  var edgeDownload = "https://www.microsoft.com/en-us/download/details.aspx?id=48126";
  var chromeDownload = "http://www.google.com/chrome/";
  var chromiumDownload = "http://www.chromium.org/getting-involved/download-chromium";
  var ua = (0, _defined.default)(options.fakeUaString, typeof window !== "undefined" && window.navigator && window.navigator.userAgent, "");
  var uaParser = new _uaParserJs.default(ua).getResult();
  var isIOS = uaParser.os.name === "iOS";
  var browserVersion = parseFloat(uaParser.browser.version);
  var isChrome = uaParser.browser.name === "Chrome";
  var isBrave = uaParser.browser.name === "Brave";
  var isChromium = uaParser.browser.name === "Chromium";
  var firefox = uaParser.browser.name === "Firefox";
  var osVersion = parseFloat(uaParser.os.version);
  var isWindows = uaParser.os.name === "Windows";
  var isEdge = uaParser.browser.name === "Edge" || isWindows && osVersion >= 10;
  var isSafari = /Safari/.test(uaParser.browser.name);
  var isOpera = /Opera/.test(uaParser.browser.name);
  var isAndroid = /Android/.test(uaParser.os.name);
  var chromeBased = isChrome || isChromium;
  var isFacebook = uaParser.browser.name === "Facebook"; // Facebook App for iOS & Android

  var isMobile = isIOS || isAndroid;
  var isOkSafari = isSafari && browserVersion >= 11;
  var isOkIOS = isIOS && osVersion >= 11;
  var isBadIOS = isIOS && osVersion < 11;
  // unfortunately need to be able to fake https because tape-run can't run on https
  var isHTTPS = options.fakeHttps || window.location.protocol === "https:";
  var okBrowser = chromeBased || firefox || isAndroid || isOpera || isEdge || isOkSafari || isOkIOS || isBrave;
  var self = this;
  var videoType;
  function getRecommendation() {
    var warning;
    if (firefox) {
      if (isIOS) {
        warning = "Firefox on iOS is not ready for cameras yet. Hopefully in near future ...";
      } else {
        warning = "Probably you need to <a href=\"".concat(firefoxDownload, "\" target=\"_blank\">") + "upgrade Firefox</a> to fix this.";
      }
    } else if (isChrome) {
      if (isIOS) {
        warning = "Use Safari instead. Apple doesn't give Chrome access to iPhone cameras (booo).";
      } else {
        warning = "Probably you need to <a href=\"".concat(chromeDownload, "\" target=\"_blank\">") + "upgrade Chrome</a> to fix this.";
      }
    } else if (isChromium) {
      warning = "Probably you need to <a href=\"".concat(chromiumDownload, "\" target=\"_blank\">") + "upgrade Chromium</a> to fix this.";
    } else if (isOkSafari) {
      warning = "Probably you need to shut down Safari and restart it, this for correct webcam access.";
    } else if (isSafari) {
      warning = "Safari below version 11 has no webcam support.<br/>Better upgrade Safari or pick" + " <a href=\"".concat(chromeDownload, "\" target=\"_blank\">Chrome</a>,") + " <a href=\"".concat(firefoxDownload, "\" target=\"_blank\">Firefox</a> or Android.");
    }
    return warning;
  }
  function getUserMediaWarning() {
    var warning;
    if (isBadIOS) {
      warning = "On iPads or iPhones below iOS v11 this camera feature is missing.<br/><br/>" + "For now, we recommend you to upgrade iOS or to use an Android device.";
    } else {
      warning = getRecommendation();
    }
    if (!warning) {
      if (self.isChromeBased() || self.isFirefox() || isSafari) {
        warning = "For the webcam feature, your browser needs an upgrade.";
      } else if (isFacebook) {
        warning = "Hence we recommend you to use a real browser like " + "<a href=\"".concat(chromeDownload, "\" target=\"_blank\">Chrome</a>, ") + "<a href=\"".concat(firefoxDownload, "\" target=\"_blank\">Firefox</a> or ") + "<a href=\"".concat(edgeDownload, "\" target=\"_blank\">Edge</a>.");
      } else {
        warning = "Hence we recommend you to use either " + "<a href=\"".concat(chromeDownload, "\" target=\"_blank\">Chrome</a>, ") + "<a href=\"".concat(firefoxDownload, "\" target=\"_blank\">Firefox</a>, ") + "<a href=\"".concat(edgeDownload, "\" target=\"_blank\">Edge</a> or Android.");
      }
    }
    return warning;
  }
  this.canRecord = function () {
    var hasNavigator = typeof navigator !== "undefined";
    var canRecord = false;
    if (hasNavigator && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      canRecord = true;
    } else {
      var getUserMediaType = hasNavigator && (0, _typeof2.default)(navigator.getUserMedia_);
      canRecord = getUserMediaType === "function";
    }
    return canRecord;
  };
  this.checkRecordingCapabilities = function () {
    var err;
    if (!isHTTPS) {
      err = _videomailError.default.create("Sorry, your page is insecure", "Please switch to HTTPS to ensure all is encrypted.", options, {
        classList: [_videomailError.default.BROWSER_PROBLEM]
      });
    } else if (!okBrowser || !this.canRecord()) {
      var classList = [];
      if (isBadIOS) {
        classList.push(_videomailError.default.IOS_PROBLEM);
      } else {
        classList.push(_videomailError.default.BROWSER_PROBLEM);
      }
      var message;

      // good to be able to distinguish between two reasons why and what sort of camera it is
      if (!okBrowser) {
        if (isMobile) {
          message = "Sorry, your browser is unable to use your mobile camera";
        } else {
          message = "Sorry, your browser is unable to use webcams";
        }
      } else if (isMobile) {
        if (isFacebook) {
          message = "Sorry, the Facebook app cannot record from your mobile camera";
        } else {
          message = "Sorry, your browser cannot record from your mobile camera";
        }
      } else {
        message = "Sorry, your browser cannot record from webcams";
      }
      if (isBadIOS) {
        /*
         * on older iPhones length of JSON is limited and breaking
         * so just don't report and ignore
         */
        options.reportErrors = false;
      }
      err = _videomailError.default.create(message, getUserMediaWarning(), options, {
        classList: classList
      });
    }
    return err;
  };
  this.checkBufferTypes = function () {
    var err;
    if (typeof window === "undefined" || typeof window.atob === "undefined") {
      err = _videomailError.default.create("atob is not supported", options);
    } else if (typeof window.ArrayBuffer === "undefined") {
      err = _videomailError.default.create("ArrayBuffers are not supported", options);
    } else if (typeof window.Uint8Array === "undefined") {
      err = _videomailError.default.create("Uint8Arrays are not supported", options);
    }
    return err;
  };
  function canPlayType(video, type) {
    var canPlayType;
    if (video && video.canPlayType) {
      canPlayType = video.canPlayType("video/".concat(type));
    }

    // definitely cannot be played here
    if (canPlayType === "") {
      return false;
    }
    return canPlayType;
  }
  this.getVideoType = function (video) {
    if (!videoType && video) {
      if (canPlayType(video, "mp4")) {
        videoType = "mp4";
      } else if (canPlayType(video, "webm")) {
        videoType = "webm";
      }
    }
    if (videoType !== "webm" && videoType !== "mp4") {
      // we only support these two. anything else defaults to the fallback.
      videoType = FALLBACK_VIDEO_TYPE;
    }
    if (!videoType || videoType === "") {
      // just as a fallback
      videoType = FALLBACK_VIDEO_TYPE;
    }
    return videoType;
  };
  this.getNoAccessIssue = function () {
    var message = "Unable to access webcam";
    var explanation;
    if (this.isChromeBased()) {
      explanation = "Click on the allow button to grant access to your webcam";
    } else if (this.isFirefox()) {
      explanation = "Please grant Firefox access to your webcam";
    } else {
      explanation = "Your system does not let your browser access your webcam";
    }
    return _videomailError.default.create(message, explanation, options);
  };
  this.isChromeBased = function () {
    return chromeBased;
  };
  this.isFirefox = function () {
    return firefox;
  };
  this.isEdge = function () {
    return isEdge;
  };
  this.isAndroid = function () {
    return isAndroid;
  };
  this.isMobile = function () {
    return uaParser.device.type === "mobile";
  };
  this.isOkSafari = function () {
    return isOkSafari;
  };
  this.isIOS = function () {
    return isIOS;
  };
  this.getUsefulData = function () {
    return {
      browser: uaParser.browser,
      cpu: uaParser.cpu.architecture ? uaParser.cpu : undefined,
      device: uaParser.device.type ? uaParser.device : undefined,
      engine: uaParser.engine,
      os: uaParser.os.name && uaParser.os.version ? uaParser.os : undefined
    };
  };
};
var _default = exports.default = Browser;

},{"./videomailError":131,"@babel/runtime/helpers/interopRequireDefault":4,"@babel/runtime/helpers/typeof":10,"defined":30,"ua-parser-js":110}],125:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _toConsumableArray2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/toConsumableArray"));
var _formatUtil = _interopRequireDefault(_dereq_("format-util"));
var _browser = _interopRequireDefault(_dereq_("./browser"));
function _default() {
  var localOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var browser = new _browser.default(localOptions);
  var logger = localOptions.logger || console;
  var containerId = localOptions.selectors && localOptions.selectors.containerId || "undefined container id";
  var stack = [];
  function lifo(level, parameters) {
    var line = _formatUtil.default.apply(void 0, (0, _toConsumableArray2.default)(parameters));
    if (stack.length > localOptions.logStackSize) {
      stack.pop();
    }
    stack.push("[".concat(level, "] ").concat(line));
    return line;
  }
  function addContainerId(firstArgument) {
    return "#".concat(containerId, " [").concat(new Date().toLocaleTimeString(), "] > ").concat(firstArgument);
  }

  /*
   * workaround: since we cannot overwrite console.log without having the correct file and line number
   * we'll use groupCollapsed() and trace() instead to get these.
   */
  this.debug = function () {
    // always add it for better client error reports
    var args = [].slice.call(arguments, 0);
    args[0] = addContainerId(args[0]);
    var output = lifo("debug", args);
    if (localOptions.verbose) {
      if (browser.isFirefox()) {
        logger.debug(output);
      } else if (logger.groupCollapsed) {
        logger.groupCollapsed(output);
        logger.trace("Trace");
        logger.groupEnd();
      } else if (logger.debug) {
        logger.debug(output);
      } else {
        // last resort if everything else fails for any weird reasons
        console.log(output);
      }
    }
  };
  this.error = function () {
    var args = [].slice.call(arguments, 0);
    args[0] = addContainerId(args[0]);
    logger.error(lifo("error", args));
  };
  this.warn = function () {
    var args = [].slice.call(arguments, 0);
    args[0] = addContainerId(args[0]);
    logger.warn(lifo("warn", args));
  };
  this.getLines = function () {
    return stack;
  };
}

},{"./browser":124,"@babel/runtime/helpers/interopRequireDefault":4,"@babel/runtime/helpers/toConsumableArray":7,"format-util":47}],126:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _despot = _interopRequireDefault(_dereq_("despot"));
var _safeJsonStringify = _interopRequireDefault(_dereq_("safe-json-stringify"));
var _events = _interopRequireDefault(_dereq_("./../events"));
var _videomailError = _interopRequireDefault(_dereq_("./videomailError"));
// TODO: MAKE EVENT EMITTING IN DESPOT NOT GLOBAL BUT BY CONTAINER ID INSTEAD

function _default(options, name) {
  this.emit = function (event) {
    var args = Array.prototype.slice.call(arguments, 0);
    if (!event) {
      throw _videomailError.default.create("You cannot emit without an event.", options);
    }

    // Automatically convert errors to videomail errors
    if (event === _events.default.ERROR) {
      var err = args[1];
      err = _videomailError.default.create(err, options);
      args[1] = err;
    }
    if (options.debug) {
      if (event !== "removeListener" && event !== "newListener") {
        var moreArguments;
        if (args[1]) {
          moreArguments = args.slice(1);
        }
        if (moreArguments) {
          options.debug("".concat(name, " emits ").concat(event, " with ").concat((0, _safeJsonStringify.default)(moreArguments)));
        } else {
          options.debug("".concat(name, " emits ").concat(event));
        }
      }
    }
    var result = _despot.default.emit.apply(_despot.default, args);

    /*
     * Todo: have this emitted through a configuration because it is pretty noisy
     * if (event !== Events.EVENT_EMITTED)
     *     this.emit(Events.EVENT_EMITTED, event)
     */

    return result;
  };
  this.on = function (eventName, cb) {
    return _despot.default.on(eventName, cb);
  };
  this.once = function (eventName, cb) {
    return _despot.default.once(eventName, cb);
  };
  this.listeners = function (eventName) {
    return _despot.default.listeners(eventName);
  };
  this.removeListener = function (eventName, cb) {
    return _despot.default.removeListener(eventName, cb);
  };
  this.removeAllListeners = function () {
    _despot.default.removeAllListeners();
  };
}

},{"./../events":119,"./videomailError":131,"@babel/runtime/helpers/interopRequireDefault":4,"despot":31,"safe-json-stringify":99}],127:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _filesize2 = _dereq_("filesize");
var _humanizeDuration = _interopRequireDefault(_dereq_("humanize-duration"));
// todo get rid of this class and use those imports directly
var _default = exports.default = {
  filesize: function filesize(bytes, round) {
    return (0, _filesize2.filesize)(bytes, {
      round: round
    });
  },
  toTime: function toTime(t) {
    return (0, _humanizeDuration.default)(t);
  }
};

},{"@babel/runtime/helpers/interopRequireDefault":4,"filesize":46,"humanize-duration":62}],128:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
/*
 * taken from
 * https://bbc.github.io/tal/jsdoc/events_mediaevent.js.html
 */
var _default = exports.default = [
/*
 * The user agent begins looking for media data, as part of
 * the resource selection algorithm.
 */
"loadstart",
/*
 * The user agent is intentionally not currently fetching media data,
 * but does not have the entire media resource downloaded. networkState equals NETWORK_IDLE
 */
"suspend",
/*
 * Playback has begun. Fired after the play() method has returned,
 * or when the autoplay attribute has caused playback to begin.
 * paused is newly false.
 * 'play', commented out since it has special treatment
 */

/*
 * The user agent has just determined the duration and dimensions of the
 * media resource and the timed tracks are ready.
 * readyState is newly equal to HAVE_METADATA or greater for the first time.
 * 'loadedmetadata', commented out since it has special treatment
 */

// The user agent is fetching media data.
"progress",
/*
 * The user agent is intentionally not currently fetching media data,
 * but does not have the entire media resource downloaded.
 * 'suspend', // commented out, we are already listening to it in code
 */

/*
 * Event The user agent stops fetching the media data before it is completely downloaded,
 * but not due to an error.  error is an object with the code MEDIA_ERR_ABORTED.
 */
"abort",
/*
 * A media element whose networkState was previously not in the NETWORK_EMPTY
 * state has just switched to that state (either because of a fatal error
 * during load that's about to be reported, or because the load() method was
 * invoked while the resource selection algorithm was already running).
 */
"emptied",
/*
 * The user agent is trying to fetch media data, but data is
 * unexpectedly not forthcoming
 */
"stalled",
/*
 * Playback has been paused. Fired after the pause() method has returned.
 * paused is newly true.
 */
"pause",
/*
 * The user agent can render the media data at the current playback position
 * for the first time.
 * readyState newly increased to HAVE_CURRENT_DATA or greater for the first time.
 */
"loadeddata",
/*
 * Playback has stopped because the next frame is not available, but the user
 * agent expects that frame to become available in due course.
 * readyState is newly equal to or less than HAVE_CURRENT_DATA,
 * and paused is false. Either seeking is true, or the current playback
 * position is not contained in any of the ranges in buffered.
 * It is possible for playback to stop for two other reasons without
 * paused being false, but those two reasons do not fire this event:
 * maybe playback ended, or playback stopped due to errors.
 */
"waiting",
/*
 * Playback has started. readyState is newly equal to or greater than
 * HAVE_FUTURE_DATA, paused is false, seeking is false,
 * or the current playback position is contained in one of the ranges in buffered.
 */
"playing",
/*
 * The user agent can resume playback of the media data,
 * but estimates that if playback were to be started now, the media resource
 * could not be rendered at the current playback rate up to its end without
 * having to stop for further buffering of content.
 * readyState newly increased to HAVE_FUTURE_DATA or greater.
 */
"canplay",
/*
 * The user agent estimates that if playback were to be started now,
 * the media resource could be rendered at the current playback rate
 * all the way to its end without having to stop for further buffering.
 * readyState is newly equal to HAVE_ENOUGH_DATA.
 */
"canplaythrough",
/*
 * The seeking IDL attribute changed to true and the seek operation is
 * taking long enough that the user agent has time to fire the event.
 */
"seeking",
// The seeking IDL attribute changed to false.
"seeked",
/*
 * Playback has stopped because the end of the media resource was reached.
 * currentTime equals the end of the media resource; ended is true.
 */
"ended",
/*
 * Either the defaultPlaybackRate or the playbackRate attribute
 * has just been updated.
 */
"ratechange",
// The duration attribute has just been updated.
"durationchange",
/*
 * Either the volume attribute or the muted attribute has changed.
 * Fired after the relevant attribute's setter has returned.
 */
"volumechange"

// commented out, happen too often

/*
 * The current playback position changed as part of normal playback or in
 * an especially interesting way, for example discontinuously.
 * 'timeupdate'
 */];

},{}],129:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _typeof2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/typeof"));
var _safeJsonStringify = _interopRequireDefault(_dereq_("safe-json-stringify"));
var DASH = "- ";
var SEPARATOR = "<br/>".concat(DASH);
function arrayToString(array) {
  if (array && array.length > 0) {
    var lines = [];
    array.forEach(function (element) {
      if (element) {
        lines.push((0, _safeJsonStringify.default)(element));
      }
    });
    return DASH + lines.join(SEPARATOR);
  }
}
function objectToString(object, options) {
  var propertyNames = Object.getOwnPropertyNames(object);
  var excludes = options && options.excludes || [];
  var lines = [];
  var sLines;

  // always ignore these
  excludes.push("stack");
  if (propertyNames && propertyNames.length > 0) {
    var exclude = false;
    propertyNames.forEach(function (name) {
      if (excludes) {
        exclude = excludes.indexOf(name) >= 0;
      }
      if (!exclude && object[name]) {
        /*
         * this to cover this problem:
         * https://github.com/binarykitchen/videomail-client/issues/157
         */
        lines.push((0, _safeJsonStringify.default)(object[name]));
      }
    });
  }
  if (lines.length === 1) {
    sLines = lines.join();
  } else if (lines.length > 1) {
    sLines = DASH + lines.join(SEPARATOR);
  }
  return sLines;
}
function _default(anything, options) {
  if (anything === null) {
    return "null";
  } else if (typeof anything === "undefined") {
    return "undefined";
  } else if (typeof anything === "string") {
    return anything;
  } else if (Array.isArray(anything)) {
    return arrayToString(anything);
  } else if ((0, _typeof2.default)(anything) === "object") {
    return objectToString(anything, options);
  }
  return anything.toString();
}

},{"@babel/runtime/helpers/interopRequireDefault":4,"@babel/runtime/helpers/typeof":10,"safe-json-stringify":99}],130:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
_dereq_("classlist.js");
var _requestFrame = _interopRequireDefault(_dereq_("request-frame"));
// https://github.com/julienetie/request-frame

// use those default params for unit tests
function _default() {
  var window = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var navigator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  // https://github.com/julienetie/request-frame/issues/6
  if (!window.screen) {
    window.screen = {};
  }
  (0, _requestFrame.default)("native");

  /*
   * avoids warning "navigator.mozGetUserMedia has been replaced by navigator.mediaDevices.getUserMedia",
   * see https://github.com/binarykitchen/videomail-client/issues/79
   */
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // do not shim
  } else {
    navigator.getUserMedia_ = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
  }
  if (!window.AudioContext && window.webkitAudioContext) {
    window.AudioContext = window.webkitAudioContext;
  }
  if (!window.URL) {
    window.URL = window.webkitURL || window.mozURL || window.msURL;
  }
  if (!navigator.connection) {
    navigator.connection = navigator.mozConnection || navigator.webkitConnection;
  }
  var methods = ["debug", "groupCollapsed", "groupEnd", "error", "exception", "info", "log", "trace", "warn"];
  var console = {};
  if (window.console) {
    console = window.console;
  } else {
    window.console = function () {};
  }
  var method;
  var length = methods.length;
  while (length--) {
    method = methods[length];
    if (!console[method]) {
      console[method] = function () {};
    }
  }
}

},{"@babel/runtime/helpers/interopRequireDefault":4,"classlist.js":23,"request-frame":97}],131:[function(_dereq_,module,exports){
(function (global){(function (){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _typeof2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/typeof"));
var _resource = _interopRequireDefault(_dereq_("./../resource"));
var _createError = _interopRequireDefault(_dereq_("create-error"));
var _safeJsonStringify = _interopRequireDefault(_dereq_("safe-json-stringify"));
var _pretty = _interopRequireDefault(_dereq_("./pretty"));
// https://github.com/tgriesser/create-error

var VIDEOMAIL_ERR_NAME = "Videomail Error";
var VideomailError = (0, _createError.default)(Error, VIDEOMAIL_ERR_NAME, {
  title: undefined,
  message: undefined,
  explanation: undefined,
  logLines: undefined,
  siteName: undefined,
  cookie: undefined,
  location: undefined,
  err: undefined,
  promise: undefined,
  cause: undefined,
  reason: undefined,
  browser: undefined,
  cpu: undefined,
  device: undefined,
  engine: undefined,
  os: undefined,
  screen: undefined,
  orientation: undefined
});

// shim pretty to exclude stack always
var pretty = function pretty(anything) {
  return (0, _pretty.default)(anything, {
    excludes: ["stack"]
  });
};

// static and public attribute of this class
VideomailError.PERMISSION_DENIED = "PERMISSION_DENIED";
VideomailError.NOT_ALLOWED_ERROR = "NotAllowedError";
VideomailError.NOT_CONNECTED = "Not connected";
VideomailError.DOM_EXCEPTION = "DOMException";
VideomailError.STARTING_FAILED = "Starting video failed";
VideomailError.MEDIA_DEVICE_NOT_SUPPORTED = "MediaDeviceNotSupported";
VideomailError.BROWSER_PROBLEM = "browser-problem";
VideomailError.WEBCAM_PROBLEM = "webcam-problem";
VideomailError.IOS_PROBLEM = "ios-problem";
VideomailError.OVERCONSTRAINED = "OverconstrainedError";
VideomailError.NOT_FOUND_ERROR = "NotFoundError";
VideomailError.NOT_READABLE_ERROR = "NotReadableError";
VideomailError.SECURITY_ERROR = "SecurityError";
VideomailError.TRACK_START_ERROR = "TrackStartError";
VideomailError.INVALID_STATE_ERROR = "InvalidStateError";

// static function to convert an error into a videomail error
VideomailError.create = function (err, explanation, options, parameters) {
  var _err$constructor;
  if (err && err.name === VIDEOMAIL_ERR_NAME) {
    return err;
  }
  if (!options && explanation) {
    options = explanation;
    explanation = undefined;
  }
  options || (options = {});
  parameters || (parameters = {});
  var audioEnabled = options && options.isAudioEnabled && options.isAudioEnabled();
  var classList = parameters.classList || [];

  /*
   * Require Browser here, not at the top of the file to avoid
   * recursion. Because the Browser class is requiring this file as well.
   */
  var Browser = _dereq_("./browser").default;
  var browser = new Browser(options);
  var errType;
  var message;

  // whole code is ugly because all browsers behave so differently :(

  if ((0, _typeof2.default)(err) === "object") {
    if (err.name === VideomailError.TRACK_START_ERROR) {
      errType = VideomailError.TRACK_START_ERROR;
    } else if (err.name === VideomailError.SECURITY_ERROR) {
      errType = VideomailError.SECURITY_ERROR;
    } else if (err.code === 8 && err.name === VideomailError.NotFoundError) {
      errType = VideomailError.NotFoundError;
    } else if (err.code === 35 || err.name === VideomailError.NOT_ALLOWED_ERROR) {
      // https://github.com/binarykitchen/videomail.io/issues/411
      errType = VideomailError.NOT_ALLOWED_ERROR;
    } else if (err.code === 1 && err.PERMISSION_DENIED === 1) {
      errType = VideomailError.PERMISSION_DENIED;
    } else if (err.constructor && err.constructor.name === VideomailError.DOM_EXCEPTION) {
      if (err.name === VideomailError.NOT_READABLE_ERROR) {
        errType = VideomailError.NOT_READABLE_ERROR;
      } else {
        errType = VideomailError.DOM_EXCEPTION;
      }
    } else if (err.constructor && err.constructor.name === VideomailError.OVERCONSTRAINED) {
      errType = VideomailError.OVERCONSTRAINED;
    } else if (err.explanation === VideomailError.STARTING_FAILED) {
      errType = err.explanation;
    } else if (err.name) {
      errType = err.name;
    } else if (err.type === "error" && err.target.bufferedAmount === 0) {
      errType = VideomailError.NOT_CONNECTED;
    }
  } else if (err === VideomailError.NOT_CONNECTED) {
    errType = VideomailError.NOT_CONNECTED;
  } else {
    errType = err;
  }
  switch (errType) {
    case VideomailError.SECURITY_ERROR:
      message = "The operation was insecure";
      explanation = "Probably you have disallowed Cookies for this page?";
      classList.push(VideomailError.BROWSER_PROBLEM);
      break;
    case VideomailError.OVERCONSTRAINED:
      message = "Invalid webcam constraints";
      if (err.constraint) {
        if (err.constraint === "width") {
          explanation = "Your webcam does not meet the width requirement.";
        } else {
          explanation = "Unmet constraint: ".concat(err.constraint);
        }
      } else {
        explanation = err.toString();
      }
      break;
    case "MediaDeviceFailedDueToShutdown":
      message = "Webcam is shutting down";
      explanation = "This happens your webcam is already switching off and not giving you permission to use it.";
      break;
    case "SourceUnavailableError":
      message = "Source of your webcam cannot be accessed";
      explanation = "Probably it is locked from another process or has a hardware error.";
      if (err.explanation) {
        err.explanation += " Details: ".concat(err.explanation);
      }
      break;
    case VideomailError.NOT_FOUND_ERROR:
    case "NO_DEVICES_FOUND":
      if (audioEnabled) {
        message = "No webcam nor microphone found";
        explanation = "Your browser cannot find a webcam with microphone attached to your machine.";
      } else {
        message = "No webcam found";
        explanation = "Your browser cannot find a webcam attached to your machine.";
      }
      classList.push(VideomailError.WEBCAM_PROBLEM);
      break;
    case "PermissionDismissedError":
      message = "Ooops, you didn't give me any permissions?";
      explanation = "Looks like you skipped the webcam permission dialogue.<br/>" + "Please grant access next time the dialogue appears.";
      classList.push(VideomailError.WEBCAM_PROBLEM);
      break;
    case VideomailError.NOT_ALLOWED_ERROR:
    case VideomailError.PERMISSION_DENIED:
    case "PermissionDeniedError":
      message = "Permission denied";
      explanation = "Cannot access your webcam. This can have two reasons:<br/>" + "a) you blocked access to webcam; or<br/>" + "b) your webcam is already in use.";
      classList.push(VideomailError.WEBCAM_PROBLEM);
      break;
    case "HARDWARE_UNAVAILABLE":
      message = "Webcam is unavailable";
      explanation = "Maybe it is already busy in another window?";
      if (browser.isChromeBased() || browser.isFirefox()) {
        explanation += " Or you have to allow access above?";
      }
      classList.push(VideomailError.WEBCAM_PROBLEM);
      break;
    case VideomailError.NOT_CONNECTED:
      message = "Unable to connect";
      explanation = "Either the videomail server or your connection is down. " + "Trying to reconnect every few seconds …";
      break;
    case "NO_VIDEO_FEED":
      message = "No video feed found!";
      explanation = "Your webcam is already used in another browser.";
      classList.push(VideomailError.WEBCAM_PROBLEM);
      break;
    case VideomailError.STARTING_FAILED:
      message = "Starting video failed";
      explanation = "Most likely this happens when the webcam is already active in another browser.";
      classList.push(VideomailError.WEBCAM_PROBLEM);
      break;
    case "DevicesNotFoundError":
      message = "No available webcam could be found";
      explanation = "Looks like you do not have any webcam attached to your machine; or " + "the one you plugged in is already used.";
      classList.push(VideomailError.WEBCAM_PROBLEM);
      break;
    case VideomailError.NOT_READABLE_ERROR:
    case VideomailError.TRACK_START_ERROR:
      message = "No access to webcam";
      explanation = "A hardware error occurred which prevented access to your webcam.";
      classList.push(VideomailError.WEBCAM_PROBLEM);
      break;
    case VideomailError.INVALID_STATE_ERROR:
      message = "Invalid state";
      explanation = "Video recording stream from your webcam already has finished.";
      classList.push(VideomailError.WEBCAM_PROBLEM);
      break;
    case VideomailError.DOM_EXCEPTION:
      switch (err.code) {
        case 8:
          message = "Requested webcam not found";
          explanation = "A webcam is needed but could not be found";
          classList.push(VideomailError.WEBCAM_PROBLEM);
          break;
        case 9:
          {
            var newUrl = "https:".concat(window.location.href.substring(window.location.protocol.length));
            message = "Security upgrade needed";
            explanation = "Click <a href=\"".concat(newUrl, "\">here</a> to switch to HTTPs which is more safe ") + " and enables encrypted videomail transfers.";
            classList.push(VideomailError.BROWSER_PROBLEM);
            break;
          }
        case 11:
          message = "Invalid State";
          explanation = "The object is in an invalid, unusable state.";
          classList.push(VideomailError.BROWSER_PROBLEM);
          break;
        default:
          message = "DOM Exception";
          explanation = pretty(err);
          classList.push(VideomailError.BROWSER_PROBLEM);
          break;
      }
      break;

    /*
     * Chrome has a weird problem where if you try to do a getUserMedia request too early, it
     * can return a MediaDeviceNotSupported error (even though nothing is wrong and permission
     * has been granted). Look at userMediaErrorCallback() in recorder, there we do not
     * emit those kind of errors further and just retry.
     *
     * but for whatever reasons, if it happens to reach this code, then investigate this further.
     */
    case VideomailError.MEDIA_DEVICE_NOT_SUPPORTED:
      message = "Media device not supported";
      explanation = pretty(err);
      break;
    default:
      {
        var originalExplanation = explanation;
        if (explanation && (0, _typeof2.default)(explanation) === "object") {
          explanation = pretty(explanation);
        }

        /*
         * it can be that explanation itself is an error object
         * error objects can be prettified to undefined sometimes
         */
        if (!explanation && originalExplanation) {
          if (originalExplanation.explanation) {
            explanation = originalExplanation.explanation;
          } else {
            // tried toString before but nah
            explanation = "Inspected: ".concat((0, _safeJsonStringify.default)(originalExplanation));
          }
        }
        if (err) {
          if (typeof err === "string") {
            message = err;
          } else {
            if (err.message) {
              message = pretty(err.message) + " (pretty)";
            }
            if (err.explanation) {
              if (!explanation) {
                explanation = pretty(err.explanation);
              } else {
                explanation += ";<br/>".concat(pretty(err.explanation));
              }
            }
            if (err.details) {
              var details = pretty(err.details);
              if (!explanation) {
                explanation = details;
              } else if (details) {
                explanation += ";<br/>".concat(details);
              }
            }
          }
        }

        // for weird, undefined cases
        if (!message) {
          if (errType) {
            message = errType + " (weird)";
          }
          if (!explanation && err) {
            explanation = pretty(err, {
              excludes: ["stack"]
            });
          }

          // avoid dupes
          if (pretty(message) === explanation) {
            explanation = undefined;
          }
        }
        break;
      }
  }
  var logLines = null;
  if (options.logger && options.logger.getLines) {
    logLines = options.logger.getLines();
  }

  // be super robust
  var debug = options && options.debug || console.log;
  debug("VideomailError: create()", message, explanation || "(no explanation set)");
  var usefulClientData = browser.getUsefulData();
  var cookies = global.document.cookie.split("; ");
  var errData = {
    title: "videomail-client error",
    message: message,
    explanation: explanation,
    logLines: logLines,
    siteName: options.siteName,
    browser: usefulClientData.browser,
    cpu: usefulClientData.cpu,
    device: usefulClientData.device,
    engine: usefulClientData.engine,
    os: usefulClientData.os,
    location: window.location.href,
    cookie: cookies.length > 0 ? cookies.join(",\n") : undefined,
    screen: [screen.width, screen.height, screen.colorDepth].join("×"),
    orientation: typeof screen.orientation === "string" ? screen.orientation : screen.orientation.type.toString(),
    // Consider removing later once sorted
    errNo: err === null || err === void 0 ? void 0 : err.errno,
    errCode: err === null || err === void 0 ? void 0 : err.code,
    errName: err === null || err === void 0 ? void 0 : err.name,
    errType: err === null || err === void 0 ? void 0 : err.type,
    errConstraint: err === null || err === void 0 ? void 0 : err.constraint,
    errConstructorName: err === null || err === void 0 || (_err$constructor = err.constructor) === null || _err$constructor === void 0 ? void 0 : _err$constructor.name
  };
  var videomailError = new VideomailError(err instanceof Error ? err : message, errData);
  var resource;
  var reportErrors = false;
  if (options.reportErrors) {
    if (typeof options.reportErrors === "function") {
      reportErrors = options.reportErrors(videomailError);
    } else {
      reportErrors = options.reportErrors;
    }
  }
  if (reportErrors) {
    resource = new _resource.default(options);
  }
  if (resource) {
    resource.reportError(videomailError, function (err2) {
      if (err2) {
        console.error("Unable to report error", err2);
      }
    });
  }
  function hasClass(name) {
    return classList.indexOf(name) >= 0;
  }
  function isBrowserProblem() {
    return hasClass(VideomailError.BROWSER_PROBLEM) || parameters.browserProblem;
  }

  // add some public functions

  // this one is useful so that the notifier can have different css classes
  videomailError.getClassList = function () {
    return classList;
  };
  videomailError.removeDimensions = function () {
    return hasClass(VideomailError.IOS_PROBLEM) || browser.isMobile();
  };
  videomailError.hideButtons = function () {
    return isBrowserProblem() || hasClass(VideomailError.IOS_PROBLEM);
  };
  videomailError.hideForm = function () {
    return hasClass(VideomailError.IOS_PROBLEM);
  };
  return videomailError;
};
var _default = exports.default = VideomailError;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./../resource":121,"./browser":124,"./pretty":129,"@babel/runtime/helpers/interopRequireDefault":4,"@babel/runtime/helpers/typeof":10,"create-error":27,"safe-json-stringify":99}],132:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _contains = _interopRequireDefault(_dereq_("contains"));
var _hidden = _interopRequireDefault(_dereq_("hidden"));
var _hyperscript = _interopRequireDefault(_dereq_("hyperscript"));
var _inherits = _interopRequireDefault(_dereq_("inherits"));
var _events = _interopRequireDefault(_dereq_("../events"));
var _eventEmitter = _interopRequireDefault(_dereq_("../util/eventEmitter"));
var Buttons = function Buttons(container, options) {
  _eventEmitter.default.call(this, options, "Buttons");
  var self = this;
  var debug = options.debug;
  var buttonsElement;
  var recordButton;
  var pauseButton;
  var resumeButton;
  var previewButton;
  var recordAgainButton;
  var submitButton;
  var audioOnRadioPair;
  var audioOffRadioPair;
  var built;
  function hide(elements) {
    if (elements && !Array.isArray(elements)) {
      elements = [elements];
    }
    elements && elements.forEach(function (element) {
      (0, _hidden.default)(element, true);
    });
  }
  function show(elements) {
    if (elements && !Array.isArray(elements)) {
      elements = [elements];
    }
    elements && elements.forEach(function (element) {
      (0, _hidden.default)(element, false);
    });
  }
  function isShown(elements) {
    var isShown = elements && true;
    if (elements && !Array.isArray(elements)) {
      elements = [elements];
    }
    elements && elements.forEach(function (element) {
      isShown && (isShown = element && !(0, _hidden.default)(element));
    });
    return isShown;
  }
  function disable(elements) {
    if (elements && !Array.isArray(elements)) {
      elements = [elements];
    }
    elements && elements.forEach(function (element) {
      // https://github.com/binarykitchen/videomail-client/issues/148
      if (element) {
        if (element.tagName === "INPUT" || element.tagName === "BUTTON") {
          element.disabled = true;
        } else {
          element.classList.add("disabled");
        }
      }
    });
  }
  function enable(elements) {
    if (elements && !Array.isArray(elements)) {
      elements = [elements];
    }
    elements && elements.forEach(function (element) {
      // https://github.com/binarykitchen/videomail-client/issues/148
      if (element) {
        if (element.tagName === "INPUT" || element.tagName === "BUTTON") {
          element.disabled = false;
        } else {
          element.classList.remove("disabled");
        }
      }
    });
  }
  function adjustButton(buttonElement, show, type, disabled) {
    if (disabled) {
      disable(buttonElement);
    }
    if (type) {
      buttonElement.type = type;
    } else if (!buttonElement.type) {
      buttonElement.type = "button";
    }
    !show && hide(buttonElement);
    return buttonElement;
  }
  function replaceClickHandler(element, clickHandler) {
    var wrappedClickHandler = function wrappedClickHandler(e) {
      e && e.preventDefault();
      try {
        clickHandler({
          event: e
        });
      } catch (exc) {
        self.emit(_events.default.ERROR, exc);
      }
    };
    element.onclick = wrappedClickHandler;
  }
  function makeRadioButtonPair(options) {
    var radioButtonElement;
    var radioButtonGroup;
    if (options.id) {
      radioButtonElement = document.getElementById(options.id);
    }
    if (!radioButtonElement) {
      radioButtonElement = (0, _hyperscript.default)("input#".concat(options.id), {
        type: "radio",
        name: options.name,
        value: options.value,
        checked: options.checked
      });
      radioButtonGroup = (0, _hyperscript.default)("span.radioGroup", radioButtonElement, (0, _hyperscript.default)("label", {
        htmlFor: options.id
      }, options.label));

      // double check that submit button is already in the buttonsElement container as a child?
      if (submitButton && (0, _contains.default)(buttonsElement, submitButton)) {
        buttonsElement.insertBefore(radioButtonGroup, submitButton);
      } else {
        buttonsElement.appendChild(radioButtonGroup);
      }
    }
    if (options.changeHandler) {
      radioButtonElement.onchange = options.changeHandler;
    }
    disable(radioButtonElement);
    return radioButtonElement;
  }
  function makeButton(buttonClass, text, clickHandler, show, id, type, selector) {
    var disabled = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : true;
    var buttonElement;
    if (id) {
      buttonElement = document.getElementById(id);
    } else if (selector) {
      buttonElement = document.querySelector(selector);
    } else {
      buttonElement = buttonsElement.querySelector(".".concat(buttonClass));
    }
    if (!buttonElement) {
      if (options.selectors.buttonClass) {
        buttonClass += ".".concat(options.selectors.buttonClass);
      }
      buttonElement = (0, _hyperscript.default)("button.".concat(buttonClass));
      buttonElement = adjustButton(buttonElement, show, type, disabled);
      buttonElement.innerHTML = text;

      // double check that submit button is already in the buttonsElement container
      if (submitButton && (0, _contains.default)(buttonsElement, submitButton)) {
        buttonsElement.insertBefore(buttonElement, submitButton);
      } else {
        buttonsElement.appendChild(buttonElement);
      }
    } else {
      buttonElement = adjustButton(buttonElement, show, type, disabled);
    }
    if (clickHandler) {
      replaceClickHandler(buttonElement, clickHandler);
    }
    return buttonElement;
  }
  function buildButtons() {
    if (!options.disableSubmit) {
      if (!submitButton) {
        submitButton = makeButton(options.selectors.submitButtonClass, "Submit", null, true, options.selectors.submitButtonId, "submit", options.selectors.submitButtonSelector, options.enableAutoValidation);
      } else {
        disable(submitButton);
      }

      /*
       * no need to listen to the submit event when it's already listened
       * within the form element class
       */
      if (!container.hasForm() && submitButton) {
        replaceClickHandler(submitButton, submit);
      }
    }
    recordButton = makeButton(options.selectors.recordButtonClass, options.text.buttons.record, record, false);
    if (options.enablePause) {
      pauseButton = makeButton(options.selectors.pauseButtonClass, options.text.buttons.pause, container.pause, false);
    }
    if (options.enablePause) {
      resumeButton = makeButton(options.selectors.resumeButtonClass, options.text.buttons.resume, container.resume, false);
    }

    /*
     * show stop only when pause is enabled - looks better that way otherwise button
     * move left and right between record and stop (preview)
     */
    previewButton = makeButton(options.selectors.previewButtonClass, options.text.buttons.preview, container.stop, false);
    recordAgainButton = makeButton(options.selectors.recordAgainButtonClass, options.text.buttons.recordAgain, recordAgain, false);
    if (options.audio && options.audio.switch) {
      audioOffRadioPair = makeRadioButtonPair({
        id: "audioOffOption",
        name: "audio",
        value: "off",
        label: options.text.audioOff,
        checked: !options.isAudioEnabled(),
        changeHandler: function changeHandler() {
          container.disableAudio();
        }
      });
      audioOnRadioPair = makeRadioButtonPair({
        id: "audioOnOption",
        name: "audio",
        value: "on",
        label: options.text.audioOn,
        checked: options.isAudioEnabled(),
        changeHandler: function changeHandler() {
          container.enableAudio();
        }
      });
    }
  }
  function onFormReady(params) {
    // no need to show record button when doing a record again
    if (!isShown(recordAgainButton)) {
      if (!params.paused) {
        show(recordButton);
      }
    }
    if (!params.paused) {
      disable(previewButton);
      hide(previewButton);
    }
    if (!options.enableAutoValidation) {
      enable(submitButton);
    }
  }
  function onGoingBack() {
    hide(recordAgainButton);
    show(recordButton);
    show(submitButton);
  }
  function onReplayShown() {
    self.hide();
  }
  function onUserMediaReady(params) {
    onFormReady(params);
    if (isShown(recordButton) && !params.recordWhenReady) {
      enable(recordButton);
    }
    if (options.enableAutoValidation) {
      disable(submitButton);
    }
    if (!params.recordWhenReady) {
      if (isShown(audioOnRadioPair)) {
        enable(audioOnRadioPair);
      }
      if (isShown(audioOffRadioPair)) {
        enable(audioOffRadioPair);
      }
    }
  }
  function onResetting() {
    disable(submitButton);
    self.reset();
  }
  function onPreview() {
    hide(recordButton);
    hide(previewButton);
    disable(audioOnRadioPair);
    disable(audioOffRadioPair);
    show(recordAgainButton);
    enable(recordAgainButton);
    if (!options.enableAutoValidation) {
      enable(submitButton);
    }
  }
  this.enableSubmit = function () {
    enable(submitButton);
  };
  this.adjustButtonsForPause = function () {
    if (!self.isCountingDown()) {
      pauseButton && hide(pauseButton);
      show(resumeButton);
      enable(resumeButton);
      hide(recordButton);
      show(previewButton);
      enable(previewButton);
    }
  };
  function onFirstFrameSent() {
    hide(recordButton);
    hide(recordAgainButton);
    if (pauseButton) {
      show(pauseButton);
      enable(pauseButton);
    }
    enable(previewButton);
    show(previewButton);
  }
  function onRecording(framesCount) {
    /*
     * it is possible to hide while recording, hence
     * check framesCount first (coming from recorder)
     */
    if (framesCount > 1) {
      onFirstFrameSent();
    } else {
      disable(audioOffRadioPair);
      disable(audioOnRadioPair);
      disable(recordAgainButton);
      disable(recordButton);
    }
  }
  function onResuming() {
    hide(resumeButton);
    hide(recordButton);
    if (pauseButton) {
      enable(pauseButton);
      show(pauseButton);
    }
  }
  function onStopping() {
    disable(previewButton);
    disable(recordButton);
    hide(pauseButton);
    hide(resumeButton);
  }
  function onCountdown() {
    disable(recordButton);
    disable(audioOffRadioPair);
    disable(audioOnRadioPair);
  }
  function onSubmitting() {
    debug("Buttons: onSubmitting()");
    disable(submitButton);
    disable(recordAgainButton);
  }
  function onSubmitted() {
    disable(previewButton);
    disable(recordAgainButton);
    disable(recordButton);
    disable(submitButton);
  }
  function onInvalid() {
    if (options.enableAutoValidation) {
      disable(submitButton);
    }
  }
  function onValid() {
    if (options.enableAutoValidation) {
      enable(submitButton);
    }
  }
  function onHidden() {
    hide(recordButton);
    hide(previewButton);
    hide(recordAgainButton);
    hide(resumeButton);
    hide(audioOnRadioPair);
    hide(audioOffRadioPair);
  }
  function onEnablingAudio() {
    debug("Buttons: onEnablingAudio()");
    disable(recordButton);
    disable(audioOnRadioPair);
    disable(audioOffRadioPair);
  }
  function onDisablingAudio() {
    debug("Buttons: onDisablingAudio()");
    disable(recordButton);
    disable(audioOnRadioPair);
    disable(audioOffRadioPair);
  }
  function recordAgain() {
    disable(recordAgainButton);
    container.beginWaiting();
    container.recordAgain();
  }
  function onStartingOver() {
    show(submitButton);
  }
  function submit() {
    container.submit();
  }
  function record(params) {
    disable(recordButton);
    container.record(params);
  }
  function initEvents() {
    debug("Buttons: initEvents()");
    self.on(_events.default.USER_MEDIA_READY, function (params) {
      if (!params.switchingFacingMode) {
        onUserMediaReady(params);
      }
    }).on(_events.default.PREVIEW, function () {
      onPreview();
    }).on(_events.default.PAUSED, function () {
      self.adjustButtonsForPause();
    }).on(_events.default.RECORDING, function (framesCount) {
      onRecording(framesCount);
    }).on(_events.default.FIRST_FRAME_SENT, function () {
      onFirstFrameSent();
    }).on(_events.default.RESUMING, function () {
      onResuming();
    }).on(_events.default.STOPPING, function () {
      onStopping();
    }).on(_events.default.COUNTDOWN, function () {
      onCountdown();
    }).on(_events.default.SUBMITTING, function () {
      onSubmitting();
    }).on(_events.default.RESETTING, function () {
      onResetting();
    }).on(_events.default.INVALID, function () {
      onInvalid();
    }).on(_events.default.VALID, function () {
      onValid();
    }).on(_events.default.SUBMITTED, function () {
      onSubmitted();
    }).on(_events.default.HIDE, function () {
      onHidden();
    }).on(_events.default.FORM_READY, function (params) {
      onFormReady(params);
    }).on(_events.default.REPLAY_SHOWN, function () {
      onReplayShown();
    }).on(_events.default.GOING_BACK, function () {
      onGoingBack();
    }).on(_events.default.ENABLING_AUDIO, function () {
      onEnablingAudio();
    }).on(_events.default.DISABLING_AUDIO, function () {
      onDisablingAudio();
    }).on(_events.default.STARTING_OVER, function () {
      onStartingOver();
    }).on(_events.default.CONNECTED, function () {
      if (options.loadUserMediaOnRecord) {
        if (isShown(recordButton)) {
          enable(recordButton);
        }
      }
    }).on(_events.default.DISCONNECTED, function () {
      disable(recordButton);
      disable(audioOnRadioPair);
      disable(audioOffRadioPair);
    }).on(_events.default.ERROR, function (err) {
      /*
       * since https://github.com/binarykitchen/videomail-client/issues/60
       * we hide areas to make it easier for the user
       */
      if (err.hideButtons && err.hideButtons() && options.adjustFormOnBrowserError) {
        self.hide();
      }
    });
  }
  this.reset = function () {
    options.debug("Buttons: reset()");
    disable(pauseButton);
    disable(resumeButton);
    disable(recordButton);
    disable(previewButton);
    disable(recordAgainButton);
    disable(audioOnRadioPair);
    disable(audioOffRadioPair);
  };
  this.isRecordAgainButtonEnabled = function () {
    return !recordAgainButton.disabled;
  };
  this.isReady = function () {
    if (!recordButton) {
      // No recordButton? Ok, must be in playerOnly mode. So, not ready for recording
      return false;
    }
    return this.isRecordButtonEnabled();
  };
  this.isRecordButtonEnabled = function () {
    return !recordButton.disabled;
  };
  this.setSubmitButton = function (newSubmitButton) {
    submitButton = newSubmitButton;
  };
  this.getSubmitButton = function () {
    return submitButton;
  };
  this.build = function () {
    buttonsElement = container.querySelector(".".concat(options.selectors.buttonsClass));
    if (!buttonsElement) {
      buttonsElement = (0, _hyperscript.default)("div.".concat(options.selectors.buttonsClass));
      container.appendChild(buttonsElement);
    }
    buildButtons();
    !built && initEvents();
    built = true;
  };
  this.unload = function () {
    if (built) {
      // Disables all buttons
      self.reset();
      debug("Buttons: unload()");
      self.removeAllListeners();
      built = false;
    }
  };
  this.hide = function (params) {
    hide(buttonsElement);
    if (params && params.deep) {
      hide(recordButton);
      hide(pauseButton);
      hide(resumeButton);
      hide(previewButton);
      hide(recordAgainButton);
      hide(submitButton);
      hide(audioOnRadioPair);
      hide(audioOffRadioPair);
    }
  };
  this.show = function () {
    show(buttonsElement);
  };
  this.isCountingDown = function () {
    return container.isCountingDown();
  };
};
(0, _inherits.default)(Buttons, _eventEmitter.default);
var _default = exports.default = Buttons;

},{"../events":119,"../util/eventEmitter":126,"@babel/runtime/helpers/interopRequireDefault":4,"contains":25,"hidden":61,"hyperscript":63,"inherits":66}],133:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _defineProperty2 = _interopRequireDefault(_dereq_("@babel/runtime/helpers/defineProperty"));
var _documentVisibility = _interopRequireDefault(_dereq_("document-visibility"));
var _hidden = _interopRequireDefault(_dereq_("hidden"));
var _insertCss = _interopRequireDefault(_dereq_("insert-css"));
var _safeJsonStringify = _interopRequireDefault(_dereq_("safe-json-stringify"));
var _inherits = _interopRequireDefault(_dereq_("inherits"));
var _mainMinCss = _interopRequireDefault(_dereq_("../../styles/css/main.min.css.js"));
var _events = _interopRequireDefault(_dereq_("../events"));
var _resource = _interopRequireDefault(_dereq_("../resource"));
var _eventEmitter = _interopRequireDefault(_dereq_("../util/eventEmitter"));
var _videomailError = _interopRequireDefault(_dereq_("../util/videomailError"));
var _buttons = _interopRequireDefault(_dereq_("./buttons"));
var _dimension = _interopRequireDefault(_dereq_("./dimension"));
var _form = _interopRequireDefault(_dereq_("./form"));
var _optionsWrapper = _interopRequireDefault(_dereq_("./optionsWrapper"));
var _visuals = _interopRequireDefault(_dereq_("./visuals"));
var Container = function Container(options) {
  _eventEmitter.default.call(this, options, "Container");
  var self = this;
  var visibility = (0, _documentVisibility.default)();
  var visuals = new _visuals.default(this, options);
  var buttons = new _buttons.default(this, options);
  var resource = new _resource.default(options);
  var htmlElement = document.querySelector("html");
  var debug = options.debug;
  var hasError = false;
  var submitted = false;
  var lastValidation = false;
  var containerElement;
  var built;
  var form;
  validateOptions();

  // since https://github.com/binarykitchen/videomail-client/issues/87
  function findParentFormElement() {
    if (!containerElement) {
      // Must be in player only mode
      return;
    }
    return containerElement.closest("form");
  }
  function getFormElement() {
    var formElement;
    if (containerElement && containerElement.tagName === "FORM") {
      formElement = containerElement;
    } else if (options.selectors.formId) {
      formElement = document.getElementById(options.selectors.formId);
    } else {
      formElement = findParentFormElement();
    }
    return formElement;
  }
  this.buildForm = function () {
    if (form) {
      return; // already built
    }
    var formElement = getFormElement();
    if (formElement) {
      form = new _form.default(self, formElement, options);
      var submitButton = form.findSubmitButton();
      if (submitButton) {
        buttons.setSubmitButton(submitButton);
      }
      form.build();
    }
  };
  function buildChildren() {
    var playerOnly = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var replayParentElement = arguments.length > 1 ? arguments[1] : undefined;
    debug("Container: buildChildren (playerOnly = ".concat(playerOnly).concat(replayParentElement ? ", replayParentElement=\"".concat(replayParentElement, "\"") : "", ")"));
    if (containerElement) {
      containerElement.classList.add(options.selectors.containerClass);
    }
    if (!playerOnly) {
      buttons.build();
    }
    visuals.build(playerOnly, replayParentElement);
  }
  function processError(err) {
    hasError = true;
    if (err.stack) {
      options.logger.error(err.stack);
    } else {
      options.logger.error(err);
    }
    if (options.displayErrors) {
      visuals.error(err);
    } else {
      visuals.reset();
    }
  }
  function initEvents() {
    var playerOnly = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    debug("Container: initEvents (playerOnly = ".concat(playerOnly, ")"));
    if (options.enableAutoUnload) {
      window.addEventListener("beforeunload", function (e) {
        self.unload(e);
      }, {
        once: true
      });
    }
    if (!playerOnly) {
      visibility.onChange(function (visible) {
        // built? see https://github.com/binarykitchen/videomail.io/issues/326
        if (built) {
          if (visible) {
            if (options.isAutoPauseEnabled() && self.isCountingDown()) {
              self.resume();
            }
            self.emit(_events.default.VISIBLE);
          } else {
            if (options.isAutoPauseEnabled() && (self.isCountingDown() || self.isRecording())) {
              self.pause("document invisible");
            }
            self.emit(_events.default.INVISIBLE);
          }
        }
      });
    }
    if (options.enableSpace) {
      if (!playerOnly) {
        window.addEventListener("keypress", function (e) {
          var tagName = e.target.tagName;
          var isEditable = e.target.isContentEditable || e.target.contentEditable === "true" || e.target.contentEditable === true;

          // beware of rich text editors, hence the isEditable check (wordpress plugin issue)
          if (!isEditable && tagName !== "INPUT" && tagName !== "TEXTAREA") {
            var code = e.code;
            if (code === 32) {
              e.preventDefault();
              if (options.enablePause) {
                visuals.pauseOrResume();
              } else {
                visuals.recordOrStop();
              }
            }
          }
        });
      }
    }

    /*
     * better to keep the one and only error listeners
     * at one spot, here, because unload() will do a removeAllListeners()
     */
    self.on(_events.default.ERROR, function (err) {
      processError(err);
      unloadChildren(err);
      if (err.removeDimensions && err.removeDimensions()) {
        removeDimensions();
      }
    });
    if (!playerOnly) {
      self.on(_events.default.LOADED_META_DATA, function () {
        correctDimensions();
      });
    }
  }
  function validateOptions() {
    if (options.hasDefinedWidth() && options.video.width % 2 !== 0) {
      throw _videomailError.default.create("Width must be divisible by two.", options);
    }
    if (options.hasDefinedHeight() && options.video.height % 2 !== 0) {
      throw _videomailError.default.create("Height must be divisible by two.", options);
    }
  }

  /*
   * This will just set the width but not the height because
   * it can be a form with more inputs elements
   */
  function correctDimensions() {
    if (options.video.stretch) {
      removeDimensions();
    } else if (containerElement) {
      var width = visuals.getRecorderWidth(true);
      if (width < 1) {
        throw _videomailError.default.create("Recorder width cannot be less than 1!", options);
      } else {
        containerElement.style.width = "".concat(width, "px");
      }
    }
  }
  function removeDimensions() {
    if (!containerElement) {
      return;
    }
    containerElement.style.width = "auto";
  }
  function unloadChildren(e) {
    visuals.unload(e);
    buttons.unload();
    if (form) {
      form.unload();
      form = undefined;
    }
    self.endWaiting();
  }
  function hideMySelf() {
    (0, _hidden.default)(containerElement, true);
  }
  function submitVideomail(formData, method, cb) {
    var videomailFormData = form.transformFormData(formData);

    // when method is undefined, treat it as a post
    if (isPost(method) || !method) {
      videomailFormData.recordingStats = visuals.getRecordingStats();
      videomailFormData.width = visuals.getRecorderWidth(true);
      videomailFormData.height = visuals.getRecorderHeight(true);
      if (navigator.connection) {
        videomailFormData.connection = {
          downlink: "".concat(navigator.connection.downlink, " Mbit/s"),
          effectiveType: navigator.connection.effectiveType,
          rtt: navigator.connection.rtt,
          type: navigator.connection.type
        };
      }
      resource.post(videomailFormData, cb);
    } else if (isPut(method)) {
      resource.put(videomailFormData, cb);
    }
  }
  function submitForm(formData, videomailResponse, url, cb) {
    /*
     * for now, accept POSTs only which have an URL unlike null and
     * treat all other submissions as direct submissions
     */

    if (!url || url === "") {
      url = options.baseUrl;
    }

    // can be missing when no videomail was recorded and is not required
    if (videomailResponse) {
      /*
       * this in case if user wants all videomail metadata to be posted
       * altogether with the remaining form
       */
      if (options.submitWithVideomail) {
        formData.videomail = videomailResponse.videomail;
      }
    }
    resource.form(formData, url, cb);
  }
  function finalizeSubmissions(err, method, videomail, response, formResponse) {
    self.endWaiting();
    if (err) {
      self.emit(_events.default.ERROR, err);
    } else {
      submitted = true;

      // merge two json response bodies to fake as if it were only one request
      if (response && formResponse && formResponse.body) {
        Object.keys(formResponse.body).forEach(function (key) {
          response[key] = formResponse.body[key];
        });
      }
      self.emit(_events.default.SUBMITTED, videomail, response || formResponse);
      if (formResponse && formResponse.type === "text/html" && formResponse.text) {
        // server replied with HTML contents - display these
        document.body.innerHTML = formResponse.text;

        /*
         * todo: figure out how to fire dom's onload event again
         * todo: or how to run all the scripts over again
         */
      }
    }
  }
  this.addPlayerDimensions = function (videomail) {
    try {
      if (!videomail) {
        throw new Error("Videomail data is missing for attaching player dimensions");
      }
      var replay = self.getReplay();
      var replayParentElement = replay.getParentElement();
      videomail.playerHeight = self.calculateHeight({
        responsive: true,
        videoWidth: videomail.width,
        ratio: videomail.height / videomail.width
      }, replayParentElement);
      videomail.playerWidth = self.calculateWidth({
        responsive: true,
        videoHeight: videomail.playerHeight,
        ratio: videomail.height / videomail.width
      });
      return videomail;
    } catch (exc) {
      self.emit(_events.default.ERROR, exc);
    }
  };
  this.limitWidth = function (width) {
    return _dimension.default.limitWidth(containerElement, width, options);
  };
  this.limitHeight = function (height) {
    return _dimension.default.limitHeight(height, options);
  };
  this.calculateWidth = function (fnOptions) {
    return _dimension.default.calculateWidth(_optionsWrapper.default.merge(options, fnOptions));
  };
  this.calculateHeight = function (fnOptions, element) {
    if (!element) {
      if (containerElement) {
        element = containerElement;
      } else {
        // better than nothing
        element = document.body;
      }
    }
    return _dimension.default.calculateHeight(element, _optionsWrapper.default.merge(options, fnOptions));
  };
  function areVisualsHidden() {
    return visuals.isHidden();
  }
  this.hasElement = function () {
    return Boolean(containerElement);
  };
  function prependDefaultCss() {
    (0, _insertCss.default)(_mainMinCss.default, {
      prepend: true
    });
  }
  this.build = function () {
    var playerOnly = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var replayParentElement = arguments.length > 1 ? arguments[1] : undefined;
    debug("Container: build (playerOnly = ".concat(playerOnly).concat(replayParentElement ? ", replayParentElement=\"".concat(replayParentElement, "\"") : "", ")"));
    try {
      options.insertCss && prependDefaultCss();

      // Note, it can be undefined when e.g. just replaying a videomail
      containerElement = document.getElementById(options.selectors.containerId);

      // Check if the replayParentElement could act as the container element perhaps?
      if (!containerElement && replayParentElement) {
        var _replayParentElement;
        if (typeof replayParentElement === "string") {
          replayParentElement = document.getElementById(replayParentElement);
        }
        if ((_replayParentElement = replayParentElement) !== null && _replayParentElement !== void 0 && _replayParentElement.classList.contains(options.selectors.containerClass)) {
          containerElement = replayParentElement;
        }
      }
      !built && initEvents(playerOnly);
      correctDimensions();

      // Building form also applies for when `playerOnly` because of
      // correcting mode on Videomail. This function will skip if there is no form. Easy.
      self.buildForm();

      // If a container element has been found, no need to pass on replayParentElement further
      buildChildren(playerOnly, containerElement ? undefined : replayParentElement);
      if (!hasError) {
        debug("Container: built.");
        built = true;
        self.emit(_events.default.BUILT);
      } else {
        debug("Container: building failed due to an error.");
      }
    } catch (exc) {
      self.emit(_events.default.ERROR, exc);
    }
  };
  this.getSubmitButton = function () {
    return buttons.getSubmitButton();
  };
  this.querySelector = function (selector) {
    if (!containerElement) {
      // Must be in player only mode
      return;
    }
    return containerElement.querySelector(selector);
  };
  this.beginWaiting = function () {
    htmlElement.classList && htmlElement.classList.add("wait");
  };
  this.endWaiting = function () {
    htmlElement.classList && htmlElement.classList.remove("wait");
  };
  this.appendChild = function (child) {
    if (!containerElement) {
      // Must be in player only mode
      return;
    }
    containerElement.appendChild(child);
  };
  this.insertBefore = function (child, reference) {
    if (!containerElement) {
      // Must be in player only mode
      return;
    }
    containerElement.insertBefore(child, reference);
  };
  this.unload = function (e) {
    try {
      if (!built) {
        return;
      }
      debug("Container: unload(".concat(e ? (0, _safeJsonStringify.default)(e) : "", ")"));
      self.emit(_events.default.UNLOADING);
      unloadChildren(e);
      self.removeAllListeners();
      built = submitted = false;
    } catch (exc) {
      self.emit(_events.default.ERROR, exc);
    }
  };
  this.show = function () {
    if (containerElement) {
      (0, _hidden.default)(containerElement, false);
      visuals.show();
      if (!hasError) {
        var paused = self.isPaused();
        if (paused) {
          buttons.adjustButtonsForPause();
        }

        /*
         * since https://github.com/binarykitchen/videomail-client/issues/60
         * we hide areas to make it easier for the user
         */
        buttons.show();
        if (self.isReplayShown()) {
          self.emit(_events.default.PREVIEW);
        } else {
          self.emit(_events.default.FORM_READY, {
            paused: paused
          });
        }
      }
    }
  };
  this.hide = function () {
    debug("Container: hide()");
    hasError = false;
    self.isRecording() && self.pause();
    visuals.hide();
    if (submitted) {
      buttons.hide();
      hideMySelf();
    }
  };
  this.startOver = function (params) {
    try {
      self.emit(_events.default.STARTING_OVER);
      submitted = false;
      form.show();
      visuals.back(params, function () {
        if (params && params.keepHidden) {
          /*
           * just enable form, do nothing else.
           * see example contact_form.html when you submit without videomail
           * and go back
           */
          self.enableForm();
        } else {
          self.show(params);
        }
      });
    } catch (exc) {
      self.emit(_events.default.ERROR, exc);
    }
  };
  this.showReplayOnly = function () {
    hasError = false;
    self.isRecording() && self.pause();
    visuals.showReplayOnly();
    submitted && buttons.hide();
  };
  this.isNotifying = function () {
    return visuals.isNotifying();
  };
  this.isPaused = function () {
    return visuals.isPaused();
  };
  this.pause = function (params) {
    visuals.pause(params);
  };

  // this code needs a good rewrite :(
  this.validate = function (event, force) {
    var runValidation = true;
    var valid = true;
    if (!options.enableAutoValidation) {
      runValidation = false;
      lastValidation = true; // needed so that it can be submitted anyway, see submit()
    } else if (force) {
      runValidation = force;
    } else if (self.isNotifying()) {
      runValidation = false;
    } else if (visuals.isConnected()) {
      runValidation = visuals.isUserMediaLoaded() || visuals.isReplayShown();
    } else if (visuals.isConnecting()) {
      runValidation = false;
    }
    if (runValidation) {
      var _event$target;
      var targetName = event === null || event === void 0 || (_event$target = event.target) === null || _event$target === void 0 ? void 0 : _event$target.name;
      if (targetName) {
        self.emit(_events.default.VALIDATING, {
          targetName: targetName
        });
      } else {
        self.emit(_events.default.VALIDATING, event);
      }
      var visualsValid = visuals.validate() && buttons.isRecordAgainButtonEnabled();
      var whyInvalid;
      var invalidData;
      if (form) {
        var invalidInput = form.getInvalidElement();
        if (invalidInput) {
          valid = false;
          whyInvalid = "Input \"".concat(invalidInput.name, "\" seems wrong \uD83E\uDD14");
          invalidData = (0, _defineProperty2.default)({}, invalidInput.name, invalidInput.value);
        } else if (!areVisualsHidden() && !visualsValid) {
          // TODO Improve this check to have this based on `key`
          if (buttonsAreReady() || self.isRecording() || self.isPaused() || self.isCountingDown()) {
            valid = false;
            whyInvalid = "Don't forget to record a video 😉";
            invalidData = {
              key: undefined
            };
          }
        }
        if (valid) {
          var _recipients$to, _recipients$cc, _recipients$bcc;
          /*
           * If CC and/or BCC exist, validate one more time to ensure at least
           * one recipient is given
           */
          var recipients = form.getRecipients();
          var toIsConfigured = "to" in recipients;
          var ccIsConfigured = "cc" in recipients;
          var bccIsConfigured = "bcc" in recipients;
          var hasTo = ((_recipients$to = recipients.to) === null || _recipients$to === void 0 ? void 0 : _recipients$to.length) > 0;
          var hasCc = ((_recipients$cc = recipients.cc) === null || _recipients$cc === void 0 ? void 0 : _recipients$cc.length) > 0;
          var hasBcc = ((_recipients$bcc = recipients.bcc) === null || _recipients$bcc === void 0 ? void 0 : _recipients$bcc.length) > 0;
          if (toIsConfigured) {
            if (!hasTo) {
              if (ccIsConfigured && bccIsConfigured) {
                if (!hasCc && !hasBcc) {
                  valid = false;
                }
              } else if (ccIsConfigured) {
                if (!hasCc) {
                  valid = false;
                }
              } else if (bccIsConfigured) {
                if (!hasBcc) {
                  valid = false;
                }
              } else {
                valid = false;
              }
            }
          } else if (ccIsConfigured) {
            if (!hasCc) {
              if (bccIsConfigured && !hasBcc) {
                valid = false;
              }
            }
          } else if (bccIsConfigured) {
            // Skip as it's hidden
          } else {
            // Form has no input fields for recipients, so don't validate
            // recipients at all
          }
          if (!valid) {
            whyInvalid = "At least one recipient is required";
          }
        }
      } else {
        valid = visualsValid;
      }
      if (valid) {
        self.emit(_events.default.VALID);
      } else if (invalidData) {
        self.emit(_events.default.INVALID, whyInvalid, invalidData);
      } else {
        self.emit(_events.default.INVALID, whyInvalid);
      }
      lastValidation = valid;
    }
    return valid;
  };
  this.disableForm = function (buttonsToo) {
    form && form.disable(buttonsToo);
  };
  this.enableForm = function (buttonsToo) {
    form && form.enable(buttonsToo);
  };
  this.hasForm = function () {
    return Boolean(form);
  };
  function buttonsAreReady() {
    return buttons.isReady();
  }
  function isPost(method) {
    return method && method.toUpperCase() === "POST";
  }
  function isPut(method) {
    return method && method.toUpperCase() === "PUT";
  }
  this.submitAll = function (formData, method, url) {
    debug("Container: submitAll(".concat(method, ": \"").concat(url, "\")"));
    var post = isPost(method);
    var hasVideomailKey = Boolean(formData[options.selectors.keyInputName]);
    function startSubmission() {
      self.beginWaiting();
      self.disableForm(true);
      self.emit(_events.default.SUBMITTING);
    }

    // a closure so that we can access method
    var submitVideomailCallback = function submitVideomailCallback(err1, videomail, videomailResponse) {
      if (err1) {
        finalizeSubmissions(err1, method, videomail, videomailResponse);
      } else if (post) {
        submitForm(formData, videomailResponse, url, function (err2, formResponse) {
          finalizeSubmissions(err2, method, videomail, videomailResponse, formResponse);
        });
      } else {
        // it's a direct submission
        finalizeSubmissions(null, method, videomail, videomailResponse);
      }
    };

    /*
     * !hasVideomailKey makes it possible to submit form when videomail itself
     * is not optional.
     */
    if (!hasVideomailKey) {
      if (options.enableAutoSubmission) {
        startSubmission();
        submitForm(formData, null, url, function (err2, formResponse) {
          finalizeSubmissions(err2, method, null, null, formResponse);
        });
      }
      /*
       * ... and when the enableAutoSubmission option is false,
       * then that can mean, leave it to the framework to process with the form
       * validation/handling/submission itself. for example the ninja form
       * will want to highlight which one input are wrong.
       */
    } else {
      startSubmission();
      submitVideomail(formData, method, submitVideomailCallback);
    }
  };
  this.isBuilt = function () {
    return built;
  };
  this.isReplayShown = function () {
    return visuals.isReplayShown();
  };
  this.isDirty = function () {
    var isDirty = false;
    if (form) {
      if (visuals.isRecorderUnloaded()) {
        isDirty = false;
      } else if (submitted) {
        isDirty = false;
      } else if (self.isReplayShown() || self.isPaused()) {
        isDirty = true;
      }
    }
    return isDirty;
  };
  this.getReplay = function () {
    return visuals.getReplay();
  };
  this.isOutsideElementOf = function (element) {
    return element.parentNode !== containerElement && element !== containerElement;
  };
  this.hideForm = function (params) {
    // form check needed, see https://github.com/binarykitchen/videomail-client/issues/127
    form && form.hide();
    buttons && buttons.hide(params);
  };
  this.loadForm = function (videomail) {
    if (form) {
      form.loadVideomail(videomail);
      self.validate();
    }
  };
  this.enableAudio = function () {
    options.setAudioEnabled(true);
    self.emit(_events.default.ENABLING_AUDIO);
  };
  this.disableAudio = function () {
    options.setAudioEnabled(false);
    self.emit(_events.default.DISABLING_AUDIO);
  };
  this.submit = function () {
    debug("Container: submit()");
    lastValidation && form && form.doTheSubmit();
  };
  this.isCountingDown = visuals.isCountingDown.bind(visuals);
  this.isRecording = visuals.isRecording.bind(visuals);
  this.record = visuals.record.bind(visuals);
  this.resume = visuals.resume.bind(visuals);
  this.stop = visuals.stop.bind(visuals);
  this.recordAgain = visuals.recordAgain.bind(visuals);
};
(0, _inherits.default)(Container, _eventEmitter.default);
var _default = exports.default = Container;

},{"../../styles/css/main.min.css.js":148,"../events":119,"../resource":121,"../util/eventEmitter":126,"../util/videomailError":131,"./buttons":132,"./dimension":134,"./form":135,"./optionsWrapper":136,"./visuals":137,"@babel/runtime/helpers/defineProperty":3,"@babel/runtime/helpers/interopRequireDefault":4,"document-visibility":32,"hidden":61,"inherits":66,"insert-css":67,"safe-json-stringify":99}],134:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _numberIsInteger = _interopRequireDefault(_dereq_("number-is-integer"));
var _videomailError = _interopRequireDefault(_dereq_("./../util/videomailError"));
function getOuterWidth(element) {
  var outerWidth = 0;
  var rect = element.getBoundingClientRect();
  if (rect) {
    outerWidth = rect.right - rect.left;
  }
  if (outerWidth < 1) {
    // last effort, can happen when replaying only
    rect = document.body.getBoundingClientRect();
    outerWidth = rect.right - rect.left;
  }
  return outerWidth;
}
function figureMinHeight(height, options) {
  if (options.hasDefinedHeight()) {
    if (!height) {
      height = options.video.height;
    } else {
      height = Math.min(options.video.height, height);
    }
  }
  if ((0, _numberIsInteger.default)(height) && height < 1) {
    throw _videomailError.default.create("Got a video height less than 1 (".concat(height, ") while figuring out the minimum!"), options);
  }

  // just return it, can be "auto"
  return height;
}
var _default = exports.default = {
  limitWidth: function limitWidth(element, width, options) {
    var limitedWidth;
    var outerWidth = getOuterWidth(element);
    if (width) {
      // only when that element has a defined width, apply this logic
      limitedWidth = outerWidth > 0 && outerWidth < width ? outerWidth : width;
    } else {
      // else apply the outer width when the element has no defined width yet
      limitedWidth = outerWidth;
    }
    if ((0, _numberIsInteger.default)(limitedWidth) && limitedWidth < 1) {
      throw _videomailError.default.create("Limited width cannot be less than 1!", options);
    } else {
      return limitedWidth;
    }
  },
  /*
   * this is difficult to compute and is not entirely correct.
   * but good enough for now to ensure some stability.
   */
  limitHeight: function limitHeight(height, options) {
    if ((0, _numberIsInteger.default)(height) && height < 1) {
      throw _videomailError.default.create("Passed limit-height argument cannot be less than 1!", options);
    } else {
      var limitedHeight = Math.min(height,
      // document.body.scrollHeight,
      document.documentElement.clientHeight);
      if (limitedHeight < 1) {
        throw _videomailError.default.create("Limited height cannot be less than 1!", options);
      } else {
        return limitedHeight;
      }
    }
  },
  calculateWidth: function calculateWidth(options) {
    var height = options.videoHeight || null;
    var ratio = options.ratio || options.getRatio();
    height = figureMinHeight(height, options);
    if (options.responsive) {
      height = this.limitHeight(height, options);
    }
    if ((0, _numberIsInteger.default)(height) && height < 1) {
      throw _videomailError.default.create("Height cannot be smaller than 1 when calculating width.", options);
    } else {
      var calculatedWidth = parseInt(height / ratio);
      if (calculatedWidth < 1) {
        throw _videomailError.default.create("Calculated width cannot be smaller than 1!", options);
      } else {
        return calculatedWidth;
      }
    }
  },
  calculateHeight: function calculateHeight(element, options) {
    var width = options.videoWidth || null;
    var height;
    var ratio = options.ratio || options.getRatio();
    if (options.hasDefinedWidth()) {
      width = options.video.width;
    }
    if ((0, _numberIsInteger.default)(width) && width < 1) {
      throw _videomailError.default.create("Unable to calculate height when width is less than 1.", options);
    } else if (options.responsive) {
      width = this.limitWidth(element, width, options);
    }
    if (width) {
      height = parseInt(width * ratio);
    }
    if ((0, _numberIsInteger.default)(height) && height < 1) {
      throw _videomailError.default.create("Just calculated a height less than 1 which is wrong.", options);
    } else {
      return figureMinHeight(height, options);
    }
  }
};

},{"./../util/videomailError":131,"@babel/runtime/helpers/interopRequireDefault":4,"number-is-integer":74}],135:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _getFormData = _interopRequireDefault(_dereq_("get-form-data"));
var _hidden = _interopRequireDefault(_dereq_("hidden"));
var _hyperscript = _interopRequireDefault(_dereq_("hyperscript"));
var _inherits = _interopRequireDefault(_dereq_("inherits"));
var _safeJsonStringify = _interopRequireDefault(_dereq_("safe-json-stringify"));
var _events = _interopRequireDefault(_dereq_("../events"));
var _eventEmitter = _interopRequireDefault(_dereq_("../util/eventEmitter"));
var _videomailError = _interopRequireDefault(_dereq_("../util/videomailError"));
// fixes https://github.com/binarykitchen/videomail-client/issues/71
function trimEmail(email) {
  return email.replace(/(^[,\s]+)|([,\s]+$)/g, "");
}
var Form = function Form(container, formElement, options) {
  _eventEmitter.default.call(this, options, "Form");
  var debug = options.debug;
  var self = this;
  var FORM_FIELDS = {
    subject: options.selectors.subjectInputName,
    from: options.selectors.fromInputName,
    to: options.selectors.toInputName,
    cc: options.selectors.ccInputName,
    bcc: options.selectors.bccInputName,
    body: options.selectors.bodyInputName,
    key: options.selectors.keyInputName,
    parentKey: options.selectors.parentKeyInputName,
    sendCopy: options.selectors.sendCopyInputName
  };
  var keyInput;
  function getData() {
    return (0, _getFormData.default)(formElement, {
      includeDisabled: true
    });
  }
  this.transformFormData = function (formData) {
    var transformedFormData = {};
    Object.keys(FORM_FIELDS).forEach(function (key) {
      var formFieldValue = FORM_FIELDS[key];
      if (formFieldValue in formData) {
        var value = formData[formFieldValue];
        if (value === undefined) {
          // skip
        } else {
          transformedFormData[key] = value;
        }
      }
    });
    if (transformedFormData.from) {
      transformedFormData.from = trimEmail(transformedFormData.from);
    }
    if (transformedFormData.to) {
      transformedFormData.to = trimEmail(transformedFormData.to);
    }
    if (transformedFormData.cc) {
      transformedFormData.cc = trimEmail(transformedFormData.cc);
    }
    if (transformedFormData.bcc) {
      transformedFormData.bcc = trimEmail(transformedFormData.bcc);
    }
    return transformedFormData;
  };
  this.getRecipients = function () {
    var videomailFormData = this.transformFormData(getData());
    var recipients = {};
    if ("to" in videomailFormData) {
      recipients.to = videomailFormData.to;
    }
    if ("cc" in videomailFormData) {
      recipients.cc = videomailFormData.cc;
    }
    if ("bcc" in videomailFormData) {
      recipients.bcc = videomailFormData.bcc;
    }
    return recipients;
  };
  this.loadVideomail = function (videomail) {
    debug("Form: loadVideomail()");
    var limit = formElement.elements.length;
    var input;
    var name;
    for (var i = 0; i < limit; i++) {
      input = formElement.elements[i];
      name = input.name;
      if (videomail[name]) {
        input.value = videomail[name];
      }
      if (name === options.selectors.subjectInputName || name === options.selectors.bodyInputName) {
        input.disabled = true;
      }
    }
    formElement.setAttribute("method", "put");
  };
  function isNotButton(element) {
    return element.tagName !== "BUTTON" && element.type !== "submit";
  }
  function setDisabled(disabled, buttonsToo) {
    var limit = formElement.elements.length;
    for (var i = 0; i < limit; i++) {
      if (buttonsToo || !buttonsToo && isNotButton(formElement.elements[i])) {
        formElement.elements[i].disabled = disabled;
      }
    }
  }
  function hideAll() {
    var limit = formElement.elements.length;
    for (var i = 0; i < limit; i++) {
      (0, _hidden.default)(formElement.elements[i], true);
    }
    (0, _hidden.default)(formElement, true);
  }
  function isRegisteredFormField(formElement) {
    var formElementName = formElement.name;
    var registeredFormFieldNames = Object.values(FORM_FIELDS);
    var isRegistered = registeredFormFieldNames.includes(formElementName);
    return isRegistered;
  }
  function getRegisteredFormElements() {
    var elements = formElement.querySelectorAll("input, textarea, select");
    var registeredElements = [];
    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      if (isRegisteredFormField(element)) {
        registeredElements.push(element);
      }
    }
    return registeredElements;
  }
  this.disable = function (buttonsToo) {
    setDisabled(true, buttonsToo);
  };
  this.enable = function (buttonsToo) {
    setDisabled(false, buttonsToo);
  };
  this.build = function () {
    debug("Form: build()");
    keyInput = formElement.querySelector("input[name=\"".concat(options.selectors.keyInputName, "\"]"));
    if (!keyInput) {
      keyInput = (0, _hyperscript.default)("input", {
        name: options.selectors.keyInputName,
        type: "hidden"
      });
      formElement.appendChild(keyInput);
    }
    if (options.enableAutoValidation) {
      var inputElements = getRegisteredFormElements();
      for (var i = 0, len = inputElements.length; i < len; i++) {
        var inputElement = inputElements[i];
        var type = inputElement.type;
        if (type === "radio" || type === "select") {
          inputElement.addEventListener("change", container.validate);
        } else {
          inputElement.addEventListener("input", container.validate);
        }
      }
    }
    this.on(_events.default.PREVIEW, function (videomailKey) {
      /*
       * beware that preview doesn't always come with a key, i.E.
       * container.show() can emit PREVIEW without a key when a replay already exists
       * (can happen when showing - hiding - showing videomail over again)
       */

      // only emit error if key is missing AND the input has no key (value) yet
      if (!videomailKey && !keyInput.value) {
        self.emit(_events.default.ERROR, _videomailError.default.create("Videomail key for preview is missing!", options));
      } else if (videomailKey) {
        keyInput.value = videomailKey;
        // Important so that any other JS framework can detect changes
        keyInput.dispatchEvent(new Event("input", {
          bubbles: true
        }));
      }
      /*
       * else leave as it and use existing keyInput.value
       */
    });

    // fixes https://github.com/binarykitchen/videomail-client/issues/91
    this.on(_events.default.GOING_BACK, function () {
      keyInput.value = null;
      keyInput.dispatchEvent(new Event("input", {
        bubbles: true
      }));
    });
    this.on(_events.default.INVALID, function () {
      formElement.classList.add("invalid");
    });
    this.on(_events.default.VALID, function () {
      formElement.classList.remove("invalid");
    });
    this.on(_events.default.ERROR, function (err) {
      /*
       * since https://github.com/binarykitchen/videomail-client/issues/60
       * we hide areas to make it easier for the user to process an error
       * (= less distractions)
       */
      if (err.hideForm && err.hideForm() && options.adjustFormOnBrowserError) {
        hideAll();
      } else if (err.hideButtons && err.hideButtons() && options.adjustFormOnBrowserError) {
        hideSubmitButton();
      }
    });
    this.on(_events.default.BUILT, function () {
      startListeningToSubmitEvents();
    });
  };
  function removeAllInputListeners() {
    var inputElements = getRegisteredFormElements();
    for (var i = 0, len = inputElements.length; i < len; i++) {
      var inputElement = inputElements[i];
      var type = inputElement.type;
      if (type === "radio" || type === "select") {
        inputElement.removeEventListener("change", container.validate);
      } else {
        inputElement.removeEventListener("input", container.validate);
      }
    }
  }
  function hideSubmitButton() {
    var submitButton = self.findSubmitButton();
    (0, _hidden.default)(submitButton, true);
  }
  this.unload = function () {
    debug("Form: unload()");
    removeAllInputListeners();
    this.removeAllListeners();
    stopListeningToSubmitEvents();
  };
  function startListeningToSubmitEvents() {
    var submitButton = container.getSubmitButton();
    submitButton.onclick = self.doTheSubmit.bind(self);
  }
  function stopListeningToSubmitEvents() {
    var submitButton = container.getSubmitButton();
    submitButton.onclick = null;
  }
  this.doTheSubmit = function (e) {
    if (e) {
      debug("Form: doTheSubmit(".concat((0, _safeJsonStringify.default)(e), ")"));
      e.preventDefault();
    } else {
      debug("Form: doTheSubmit()");
    }

    /*
     * only submit when there is a container,
     * otherwise do nothing and leave as it
     */
    if (container.hasElement()) {
      container.submitAll(getData(), formElement.getAttribute("method"), formElement.getAttribute("action"));
    }
    return false; // important to stop submission
  };
  this.getInvalidElement = function () {
    var inputElements = getRegisteredFormElements();
    var i = 0;
    for (var len = inputElements.length; i < len; i++) {
      if (!inputElements[i].validity.valid) {
        return inputElements[i];
      }
    }
    return null;
  };
  this.findSubmitButton = function () {
    return formElement.querySelector("[type='submit']");
  };
  this.hide = function () {
    formElement && (0, _hidden.default)(formElement, true);
  };
  this.show = function () {
    formElement && (0, _hidden.default)(formElement, false);
  };
};
(0, _inherits.default)(Form, _eventEmitter.default);
var _default = exports.default = Form;

},{"../events":119,"../util/eventEmitter":126,"../util/videomailError":131,"@babel/runtime/helpers/interopRequireDefault":4,"get-form-data":50,"hidden":61,"hyperscript":63,"inherits":66,"safe-json-stringify":99}],136:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _deepmerge = _interopRequireDefault(_dereq_("deepmerge"));
// enhances options with useful functions we can reuse everywhere
var _default = exports.default = {
  /*
   * not very elegant but works! and if you here are reading this, and
   * start to doubt, rest assured, it's solid and run thousand times over
   * and over again each day. and other large sites out there have their own
   * tech debts. hope i have shattered your illusion on perfection?
   */
  merge: function merge(defaultOptions, newOptions) {
    var options = (0, _deepmerge.default)(defaultOptions, newOptions, {
      arrayMerge: function arrayMerge(_destination, source) {
        return source;
      }
    });
    return options;
  }
};

},{"@babel/runtime/helpers/interopRequireDefault":4,"deepmerge":28}],137:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _hidden = _interopRequireDefault(_dereq_("hidden"));
var _hyperscript = _interopRequireDefault(_dereq_("hyperscript"));
var _inherits = _interopRequireDefault(_dereq_("inherits"));
var _safeJsonStringify = _interopRequireDefault(_dereq_("safe-json-stringify"));
var _events = _interopRequireDefault(_dereq_("../events"));
var _eventEmitter = _interopRequireDefault(_dereq_("../util/eventEmitter"));
var _recorderInsides = _interopRequireDefault(_dereq_("./visuals/inside/recorderInsides"));
var _notifier = _interopRequireDefault(_dereq_("./visuals/notifier"));
var _recorder = _interopRequireDefault(_dereq_("./visuals/recorder"));
var _replay = _interopRequireDefault(_dereq_("./visuals/replay"));
var Visuals = function Visuals(container, options) {
  _eventEmitter.default.call(this, options, "Visuals");
  var self = this;

  // can be overwritten with setter fn
  var replay = new _replay.default(this, options);
  var recorder = new _recorder.default(this, replay, options);
  var recorderInsides = new _recorderInsides.default(this, options);
  var notifier = new _notifier.default(this, options);
  var debug = options.debug;
  var visualsElement;
  var built;
  function buildNoScriptTag() {
    var noScriptElement = container.querySelector("noscript");
    if (noScriptElement) {
      noScriptElement = (0, _hyperscript.default)("noscript");
      noScriptElement.innerHTML = "Please enable Javascript";
      visualsElement.appendChild(noScriptElement);
    }
  }
  function buildChildren() {
    var playerOnly = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var replayParentElement = arguments.length > 1 ? arguments[1] : undefined;
    debug("Visuals: buildChildren (playerOnly = ".concat(playerOnly).concat(replayParentElement ? ", replayParentElement=\"".concat(replayParentElement, "\"") : "", ")"));
    buildNoScriptTag();
    if (!playerOnly) {
      notifier.build();
      recorderInsides.build();
    }
    replay.build(replayParentElement);
  }
  function initEvents() {
    var playerOnly = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    if (!playerOnly) {
      debug("Visuals: initEvents (playerOnly = ".concat(playerOnly, ")"));
      self.on(_events.default.USER_MEDIA_READY, function () {
        built = true;
        self.endWaiting();
        container.enableForm(false);
      }).on(_events.default.PREVIEW, function () {
        self.endWaiting();
      }).on(_events.default.BLOCKING, function (blockingOptions) {
        if (!blockingOptions.hideForm && !options.adjustFormOnBrowserError) {
          /*
           * do nothing, user still can enter form inputs
           * can be useful when you are on i.E. Seeflow's contact page and
           * still want to tick off the webcam option
           */
        } else {
          container.disableForm(true);
        }
      }).on(_events.default.PREVIEW_SHOWN, function () {
        container.validate(undefined, true);
      }).on(_events.default.LOADED_META_DATA, function () {
        correctDimensions();
      }).on(_events.default.ERROR, function (err) {
        if (err.removeDimensions && err.removeDimensions()) {
          removeDimensions();
        }
      });
    }
  }
  function correctDimensions() {
    if (options.video.stretch) {
      removeDimensions();
    } else if (visualsElement && recorder) {
      visualsElement.style.width = "".concat(self.getRecorderWidth(true), "px");
      visualsElement.style.height = "".concat(self.getRecorderHeight(true), "px");
    }
  }
  function removeDimensions() {
    if (!visualsElement) {
      return;
    }
    visualsElement.style.width = "auto";
    visualsElement.style.height = "auto";
  }
  this.getRatio = function () {
    if (visualsElement.clientWidth) {
      // special case for safari, see getRatio() in recorder
      return visualsElement.clientHeight / visualsElement.clientWidth;
    }
    return 0;
  };
  function isRecordable() {
    return !self.isNotifying() && !replay.isShown() && !self.isCountingDown();
  }
  this.isCountingDown = function () {
    return recorderInsides.isCountingDown();
  };
  this.build = function () {
    var playerOnly = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var replayParentElement = arguments.length > 1 ? arguments[1] : undefined;
    if (container) {
      visualsElement = container.querySelector(".".concat(options.selectors.visualsClass));
      if (!visualsElement) {
        visualsElement = (0, _hyperscript.default)("div.".concat(options.selectors.visualsClass));
        var buttonsElement = container.querySelector(".".concat(options.selectors.buttonsClass));

        /*
         * Make sure it's placed before the buttons, but only if it's a child
         * element of the container = inside the container
         */
        if (buttonsElement && !container.isOutsideElementOf(buttonsElement)) {
          container.insertBefore(visualsElement, buttonsElement);
        } else {
          container.appendChild(visualsElement);
        }
      }

      /*
       * Do not hide visuals element so that apps can give it a predefined
       * width or height through css but hide all children
       */
      visualsElement.classList.add("visuals");
    }
    correctDimensions();
    !built && initEvents(playerOnly);
    buildChildren(playerOnly, replayParentElement);
    built = true;
  };
  this.querySelector = function (selector) {
    return visualsElement && visualsElement.querySelector(selector);
  };
  this.appendChild = function (child) {
    visualsElement && visualsElement.appendChild(child);
  };
  this.removeChild = function (child) {
    visualsElement.removeChild(child);
  };
  this.reset = function () {
    this.endWaiting();
    recorder.reset();
  };
  this.beginWaiting = function () {
    container.beginWaiting();
  };
  this.endWaiting = function () {
    container.endWaiting();
  };
  this.stop = function (params) {
    recorder.stop(params);
    recorderInsides.hidePause();
  };
  this.back = function (params, cb) {
    if (!cb && params) {
      cb = params;
      params = {};
    }
    replay.hide();
    notifier.hide();
    if (params && params.keepHidden) {
      recorder.hide();
      cb && cb();
    } else {
      recorder.back(cb);
    }
  };
  this.recordAgain = function () {
    this.back(function () {
      if (options.loadUserMediaOnRecord) {
        self.once(_events.default.SERVER_READY, function () {
          self.record();
        });
      } else {
        self.once(_events.default.USER_MEDIA_READY, function () {
          self.record();
        });
      }
    });
  };
  this.unload = function (e) {
    try {
      if (!built) {
        return;
      }
      debug("Visuals: unload(".concat(e ? (0, _safeJsonStringify.default)(e) : "", ")"));
      self.removeAllListeners();
      recorder.unload(e);
      recorderInsides.unload(e);
      replay.unload();
      built = false;
    } catch (exc) {
      this.emit(_events.default.ERROR, exc);
    }
  };
  this.isNotifying = function () {
    return notifier.isVisible();
  };
  this.isReplayShown = function () {
    return replay.isShown();
  };
  this.pause = function (params) {
    recorder.pause(params);
    recorderInsides.showPause();
  };
  this.resume = function () {
    if (recorderInsides.isCountingDown()) {
      recorderInsides.resumeCountdown();
    } else {
      recorder.resume();
    }
    recorderInsides.hidePause();
  };
  this.pauseOrResume = function () {
    if (isRecordable.call(this)) {
      if (this.isRecording()) {
        this.pause();
      } else if (recorder.isPaused()) {
        this.resume();
      } else if (recorder.isReady()) {
        this.record();
      }
    }
  };
  this.recordOrStop = function () {
    if (isRecordable()) {
      if (this.isRecording()) {
        this.stop();
      } else if (recorder.isReady()) {
        this.record();
      }
    }
  };
  this.record = function () {
    if (options.video.countdown) {
      this.emit(_events.default.COUNTDOWN);
      recorderInsides.startCountdown(recorder.record.bind(recorder));
    } else {
      recorder.record();
    }
  };
  this.getRecorder = function () {
    return recorder;
  };
  this.getReplay = function () {
    return replay;
  };
  this.validate = function () {
    return recorder.validate() && this.isReplayShown();
  };
  this.getRecordingStats = function () {
    return recorder.getRecordingStats();
  };
  this.getAudioSampleRate = function () {
    return recorder.getAudioSampleRate();
  };
  this.isPaused = function () {
    return recorder.isPaused();
  };
  this.error = function (err) {
    notifier.error(err);
  };
  this.hide = function () {
    if (visualsElement) {
      (0, _hidden.default)(visualsElement, true);
      this.emit(_events.default.HIDE);
    }
  };
  this.isHidden = function () {
    if (!built) {
      return true;
    } else if (visualsElement) {
      return (0, _hidden.default)(visualsElement);
    }
  };
  this.showVisuals = function () {
    visualsElement && (0, _hidden.default)(visualsElement, false);
  };
  this.show = function () {
    !this.isReplayShown() && visualsElement && recorder.build();
    this.showVisuals();
  };
  this.showReplayOnly = function () {
    replay.show();
    this.show();
    recorder.hide();
    notifier.hide();
  };
  this.isRecorderUnloaded = function () {
    return recorder.isUnloaded();
  };
  this.isConnecting = function () {
    return recorder.isConnecting();
  };
  this.getRecorderWidth = function (responsive) {
    return recorder.getRecorderWidth(responsive);
  };
  this.getRecorderHeight = function (responsive, useBoundingClientRect) {
    return recorder.getRecorderHeight(responsive, useBoundingClientRect);
  };
  this.limitWidth = function (width) {
    return container.limitWidth(width, options);
  };
  this.limitHeight = function (height) {
    return container.limitHeight(height);
  };
  this.calculateWidth = function (options) {
    return container.calculateWidth(options);
  };
  this.calculateHeight = function (options) {
    return container.calculateHeight(options);
  };
  this.getReplay = function () {
    return replay;
  };
  this.getBoundingClientRect = function () {
    // fixes https://github.com/binarykitchen/videomail-client/issues/126
    return visualsElement && visualsElement.getBoundingClientRect();
  };
  this.checkTimer = function (intervalSum) {
    recorderInsides.checkTimer(intervalSum);
  };
  this.isNotifierBuilt = function () {
    return notifier && notifier.isBuilt();
  };
  this.isReplayShown = replay.isShown.bind(replay);
  this.hideReplay = replay.hide.bind(replay);
  this.hideRecorder = recorder.hide.bind(recorder);
  this.isRecording = recorder.isRecording.bind(recorder);
  this.isUserMediaLoaded = recorder.isUserMediaLoaded.bind(recorder);
  this.isConnected = recorder.isConnected.bind(recorder);
};
(0, _inherits.default)(Visuals, _eventEmitter.default);
var _default = exports.default = Visuals;

},{"../events":119,"../util/eventEmitter":126,"./visuals/inside/recorderInsides":143,"./visuals/notifier":144,"./visuals/recorder":145,"./visuals/replay":146,"@babel/runtime/helpers/interopRequireDefault":4,"hidden":61,"hyperscript":63,"inherits":66,"safe-json-stringify":99}],138:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _hidden = _interopRequireDefault(_dereq_("hidden"));
var _hyperscript = _interopRequireDefault(_dereq_("hyperscript"));
function _default(visuals, options) {
  var self = this;
  var countdownElement;
  var intervalId;
  var countdown;
  var paused;
  function fire(cb) {
    self.unload();
    self.hide();

    // keep all callbacks async
    setTimeout(function () {
      cb();
    }, 0);
  }
  function countBackward(cb) {
    if (!paused) {
      options.debug("Countdown", countdown);
      countdown--;
      if (countdown < 1) {
        fire(cb);
      } else {
        countdownElement.innerHTML = countdown;
      }
    }
  }
  this.start = function (cb) {
    countdownElement.innerHTML = countdown = options.video.countdown;
    this.show();
    intervalId = setInterval(countBackward.bind(this, cb), 950);
  };
  this.pause = function () {
    paused = true;
  };
  this.resume = function () {
    paused = false;
  };
  this.build = function () {
    countdownElement = visuals.querySelector(".countdown");
    if (!countdownElement) {
      countdownElement = (0, _hyperscript.default)("p.countdown");
      this.hide();
      visuals.appendChild(countdownElement);
    } else {
      this.hide();
    }
  };
  this.show = function () {
    (0, _hidden.default)(countdownElement, false);
  };
  this.isCountingDown = function () {
    return Boolean(intervalId);
  };
  this.unload = function () {
    clearInterval(intervalId);
    paused = false;
    intervalId = null;
  };
  this.hide = function () {
    (0, _hidden.default)(countdownElement, true);
    this.unload();
  };
}

},{"@babel/runtime/helpers/interopRequireDefault":4,"hidden":61,"hyperscript":63}],139:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _hidden = _interopRequireDefault(_dereq_("hidden"));
var _hyperscript = _interopRequireDefault(_dereq_("hyperscript"));
var _events = _interopRequireDefault(_dereq_("./../../../../events"));
var _eventEmitter = _interopRequireDefault(_dereq_("./../../../../util/eventEmitter"));
function _default(visuals, options) {
  _eventEmitter.default.call(this, options, "Facing Mode");
  var self = this;
  var facingModeElement;
  function initEvents() {
    self.on(_events.default.ERROR, function () {
      self.hide();
    });
  }
  this.build = function () {
    facingModeElement = visuals.querySelector(".facingMode");
    if (!facingModeElement) {
      facingModeElement = (0, _hyperscript.default)("button.facingMode");
      facingModeElement.innerHTML = "⤾";
      facingModeElement.onclick = function (e) {
        e && e.preventDefault();
        try {
          self.emit(_events.default.SWITCH_FACING_MODE);
        } catch (exc) {
          self.emit(_events.default.ERROR, exc);
        }
      };
      this.hide();
      visuals.appendChild(facingModeElement);
    } else {
      this.hide();
    }
    initEvents();
  };
  this.hide = function () {
    (0, _hidden.default)(facingModeElement, true);
  };
  this.show = function () {
    (0, _hidden.default)(facingModeElement, false);
  };
}

},{"./../../../../events":119,"./../../../../util/eventEmitter":126,"@babel/runtime/helpers/interopRequireDefault":4,"hidden":61,"hyperscript":63}],140:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _hidden = _interopRequireDefault(_dereq_("hidden"));
var _hyperscript = _interopRequireDefault(_dereq_("hyperscript"));
var _videomailError = _interopRequireDefault(_dereq_("./../../../../util/videomailError"));
function _default(visuals, options) {
  if (!options.text.pausedHeader) {
    throw _videomailError.default.create("Paused header cannot be empty", options);
  }
  var pausedBlockElement;
  var pausedHeaderElement;
  var pausedHintElement;
  function hasPausedHint() {
    return options.text.pausedHint;
  }
  this.build = function () {
    pausedBlockElement = visuals.querySelector(".paused");
    pausedHeaderElement = visuals.querySelector(".pausedHeader");
    if (!pausedHeaderElement) {
      pausedBlockElement = (0, _hyperscript.default)("div.paused");
      pausedHeaderElement = (0, _hyperscript.default)("p.pausedHeader");
      this.hide();
      pausedHeaderElement.innerHTML = options.text.pausedHeader;
      pausedBlockElement.appendChild(pausedHeaderElement);
      if (hasPausedHint()) {
        pausedHintElement = visuals.querySelector(".pausedHint");
        pausedHintElement = (0, _hyperscript.default)("p.pausedHint");
        pausedHintElement.innerHTML = options.text.pausedHint;
        pausedBlockElement.appendChild(pausedHintElement);
      }
      visuals.appendChild(pausedBlockElement);
    } else {
      this.hide();
      pausedHeaderElement.innerHTML = options.text.pausedHeader;
      if (hasPausedHint()) {
        pausedHintElement.innerHTML = options.text.pausedHint;
      }
    }
  };
  this.hide = function () {
    (0, _hidden.default)(pausedBlockElement, true);
  };
  this.show = function () {
    (0, _hidden.default)(pausedBlockElement, false);
  };
}

},{"./../../../../util/videomailError":131,"@babel/runtime/helpers/interopRequireDefault":4,"hidden":61,"hyperscript":63}],141:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _hidden = _interopRequireDefault(_dereq_("hidden"));
var _hyperscript = _interopRequireDefault(_dereq_("hyperscript"));
function _default(visuals) {
  var recordNoteElement;
  this.build = function () {
    recordNoteElement = visuals.querySelector(".recordNote");
    if (!recordNoteElement) {
      recordNoteElement = (0, _hyperscript.default)("p.recordNote");
      this.hide();
      visuals.appendChild(recordNoteElement);
    } else {
      this.hide();
    }
  };
  this.stop = function () {
    this.hide();
    recordNoteElement.classList.remove("near");
    recordNoteElement.classList.remove("nigh");
  };
  this.setNear = function () {
    recordNoteElement.classList.add("near");
  };
  this.setNigh = function () {
    recordNoteElement.classList.add("nigh");
  };
  this.hide = function () {
    (0, _hidden.default)(recordNoteElement, true);
  };
  this.show = function () {
    (0, _hidden.default)(recordNoteElement, false);
  };
}

},{"@babel/runtime/helpers/interopRequireDefault":4,"hidden":61,"hyperscript":63}],142:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _hidden = _interopRequireDefault(_dereq_("hidden"));
var _hyperscript = _interopRequireDefault(_dereq_("hyperscript"));
function _default(visuals, recordNote, options) {
  var recordTimerElement;
  var nearComputed = false;
  var endNighComputed = false;
  var started;
  var countdown;
  function pad(n) {
    return n < 10 ? "0".concat(n) : n;
  }
  function thresholdReached(secs, threshold) {
    return secs >= options.video.limitSeconds * threshold;
  }
  function isNear(secs) {
    if (!nearComputed && thresholdReached(secs, 0.6)) {
      nearComputed = true;
      return true;
    }
    return false;
  }
  function endIsNigh(secs) {
    if (!endNighComputed && thresholdReached(secs, 0.8)) {
      endNighComputed = true;
      return true;
    }
    return false;
  }
  function setNear() {
    recordTimerElement.classList.add("near");
  }
  function setNigh() {
    recordTimerElement.classList.add("nigh");
  }
  this.check = function (opts) {
    var newCountdown = getStartSeconds() - Math.floor(opts.intervalSum / 1e3);

    // performance optimisation (another reason we need react here!)
    if (newCountdown !== countdown) {
      countdown = newCountdown;
      update();
      countdown < 1 && visuals.stop(true);
    }
  };
  function update() {
    var mins = parseInt(countdown / 60, 10);
    var secs = countdown - mins * 60;
    if (!nearComputed || !endNighComputed) {
      var remainingSeconds = options.video.limitSeconds - countdown;
      if (isNear(remainingSeconds)) {
        recordNote.setNear();
        setNear();
        options.debug("End is near, ".concat(countdown, " seconds to go"));
      } else if (endIsNigh(remainingSeconds)) {
        recordNote.setNigh();
        setNigh();
        options.debug("End is nigh, ".concat(countdown, " seconds to go"));
      }
    }
    recordTimerElement.innerHTML = "".concat(mins, ":").concat(pad(secs));
  }
  function hide() {
    (0, _hidden.default)(recordTimerElement, true);
  }
  function show() {
    recordTimerElement.classList.remove("near");
    recordTimerElement.classList.remove("nigh");
    (0, _hidden.default)(recordTimerElement, false);
  }
  function getSecondsRecorded() {
    return getStartSeconds() - countdown;
  }
  function getStartSeconds() {
    return options.video.limitSeconds;
  }
  this.start = function () {
    countdown = getStartSeconds();
    nearComputed = endNighComputed = false;
    started = true;
    update();
    show();
  };
  this.pause = function () {
    recordNote.hide();
  };
  this.resume = function () {
    recordNote.show();
  };
  function isStopped() {
    return countdown === null;
  }
  this.stop = function () {
    if (!isStopped() && started) {
      options.debug("Stopping record timer. Was recording for about ~".concat(getSecondsRecorded(), " seconds."));
      hide();
      recordNote.stop();
      countdown = null;
      started = false;
    }
  };
  this.build = function () {
    recordTimerElement = visuals.querySelector(".recordTimer");
    if (!recordTimerElement) {
      recordTimerElement = (0, _hyperscript.default)("p.recordTimer");
      hide();
      visuals.appendChild(recordTimerElement);
    } else {
      hide();
    }
  };
}

},{"@babel/runtime/helpers/interopRequireDefault":4,"hidden":61,"hyperscript":63}],143:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _inherits = _interopRequireDefault(_dereq_("inherits"));
var _events = _interopRequireDefault(_dereq_("./../../../events"));
var _browser = _interopRequireDefault(_dereq_("./../../../util/browser"));
var _eventEmitter = _interopRequireDefault(_dereq_("./../../../util/eventEmitter"));
var _countdown = _interopRequireDefault(_dereq_("./recorder/countdown"));
var _facingMode = _interopRequireDefault(_dereq_("./recorder/facingMode"));
var _pausedNote = _interopRequireDefault(_dereq_("./recorder/pausedNote"));
var _recordNote = _interopRequireDefault(_dereq_("./recorder/recordNote"));
var _recordTimer = _interopRequireDefault(_dereq_("./recorder/recordTimer"));
var RecorderInsides = function RecorderInsides(visuals, options) {
  _eventEmitter.default.call(this, options, "RecorderInsides");
  var self = this;
  var debug = options.debug;
  var recordNote = new _recordNote.default(visuals);
  var recordTimer = new _recordTimer.default(visuals, recordNote, options);
  var browser = new _browser.default(options);
  var countdown;
  var pausedNote;
  var built;
  var facingMode;
  if (options.video.countdown) {
    countdown = new _countdown.default(visuals, options);
  }
  if (options.video.facingModeButton && browser.isMobile()) {
    facingMode = new _facingMode.default(visuals, options);
  }
  if (options.enablePause) {
    pausedNote = new _pausedNote.default(visuals, options);
  }
  function startRecording() {
    recordTimer.start();
  }
  function resumeRecording() {
    recordTimer.resume();
  }
  function stopRecording() {
    recordTimer.stop();
  }
  function pauseRecording() {
    if (self.isCountingDown()) {
      countdown.pause();
    } else {
      recordTimer.pause();
    }
  }
  function onResetting() {
    self.hidePause();
    self.hideCountdown();
    recordTimer.stop();
    facingMode && facingMode.hide();
  }
  function initEvents() {
    debug("RecorderInsides: initEvents()");
    self.on(_events.default.USER_MEDIA_READY, function () {
      facingMode && facingMode.show();
    }).on(_events.default.RECORDING, function () {
      startRecording();
    }).on(_events.default.RESUMING, function () {
      resumeRecording();
    }).on(_events.default.STOPPING, function () {
      stopRecording();
    }).on(_events.default.PAUSED, function () {
      pauseRecording();
    }).on(_events.default.ERROR, onResetting).on(_events.default.RESETTING, onResetting).on(_events.default.HIDE, function () {
      self.hideCountdown();
    });
  }
  this.build = function () {
    debug("RecorderInsides: build()");
    countdown && countdown.build();
    pausedNote && pausedNote.build();
    facingMode && facingMode.build();
    recordNote.build();
    recordTimer.build();
    !built && initEvents();
    built = true;
  };
  this.unload = function () {
    countdown && countdown.unload();
    built = false;
  };
  this.showPause = function () {
    pausedNote && pausedNote.show();
  };
  this.hidePause = function () {
    pausedNote && pausedNote.hide();
  };
  this.hideCountdown = function () {
    countdown && countdown.hide();
  };
  this.startCountdown = function (cb) {
    countdown && countdown.start(cb);
  };
  this.resumeCountdown = function () {
    countdown && countdown.resume();
  };
  this.isCountingDown = function () {
    return countdown && countdown.isCountingDown();
  };
  this.checkTimer = function (intervalSum) {
    recordTimer.check(intervalSum);
  };
};
(0, _inherits.default)(RecorderInsides, _eventEmitter.default);
var _default = exports.default = RecorderInsides;

},{"./../../../events":119,"./../../../util/browser":124,"./../../../util/eventEmitter":126,"./recorder/countdown":138,"./recorder/facingMode":139,"./recorder/pausedNote":140,"./recorder/recordNote":141,"./recorder/recordTimer":142,"@babel/runtime/helpers/interopRequireDefault":4,"inherits":66}],144:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _hidden = _interopRequireDefault(_dereq_("hidden"));
var _hyperscript = _interopRequireDefault(_dereq_("hyperscript"));
var _inherits = _interopRequireDefault(_dereq_("inherits"));
var _events = _interopRequireDefault(_dereq_("../../events"));
var _eventEmitter = _interopRequireDefault(_dereq_("../../util/eventEmitter"));
var NOTIFIER_MESSAGE_ID = "notifierMessage";
var Notifier = function Notifier(visuals, options) {
  _eventEmitter.default.call(this, options, "Notifier");
  var self = this;
  var debug = options && options.debug;
  var notifyElement;
  var explanationElement;
  var entertainTimeoutId;
  var entertaining;
  var built;
  function onStopping(limitReached) {
    var lead = "";
    visuals.beginWaiting();
    if (limitReached) {
      debug("Limit reached");
      lead += "".concat(options.text.limitReached, ".<br/>");
    }
    lead += "".concat(options.text.sending, " \u2026");
    self.notify(lead, null, {
      stillWait: true,
      entertain: options.notifier.entertain
    });
  }
  function onConnecting() {
    self.notify("Connecting …");
  }
  function onLoadingUserMedia() {
    self.notify("Loading webcam …");
  }
  function onProgress(frameProgress, sampleProgress) {
    var overallProgress;
    if (options.isAudioEnabled()) {
      overallProgress = "Video: ".concat(frameProgress);
      if (sampleProgress) {
        overallProgress += ", Audio: ".concat(sampleProgress);
      }
    } else {
      overallProgress = frameProgress;
    }
    self.setExplanation(overallProgress);
  }
  function onBeginVideoEncoding() {
    visuals.beginWaiting();
    var lead = "".concat(options.text.encoding, " \u2026");
    self.notify(lead, null, {
      stillWait: true,
      entertain: options.notifier.entertain
    });
    hideExplanation();
  }
  function initEvents() {
    debug("Notifier: initEvents()");
    self.on(_events.default.CONNECTING, function () {
      onConnecting();
    }).on(_events.default.LOADING_USER_MEDIA, function () {
      onLoadingUserMedia();
    }).on(_events.default.USER_MEDIA_READY, function () {
      // Ensure notifier has correct dimensions, especially when stretched
      correctNotifierDimensions();
      self.hide();
    }).on(_events.default.LOADED_META_DATA, function () {}).on(_events.default.PREVIEW, function () {
      self.hide();
    }).on(_events.default.STOPPING, function (limitReached) {
      onStopping(limitReached);
    }).on(_events.default.PROGRESS, function (frameProgress, sampleProgress) {
      onProgress(frameProgress, sampleProgress);
    }).on(_events.default.BEGIN_VIDEO_ENCODING, function () {
      onBeginVideoEncoding();
    }).on(_events.default.UNLOADING, function () {
      self.notify("Unloading …");
    }).on(_events.default.DISCONNECTED, function () {
      self.notify("Disconnected");
    }).on(_events.default.CONNECTED, function () {
      self.notify("Connected");
      if (options.loadUserMediaOnRecord) {
        self.hide();
      }
    });
  }
  function correctNotifierDimensions() {
    if (options.video.stretch) {
      notifyElement.style.width = "auto";
      notifyElement.style.height = "".concat(visuals.getRecorderHeight(true, true), "px");
    } else {
      notifyElement.style.width = "".concat(visuals.getRecorderWidth(true), "px");
      notifyElement.style.height = "".concat(visuals.getRecorderHeight(true), "px");
    }
  }
  function show() {
    notifyElement && (0, _hidden.default)(notifyElement, false);
  }
  function runEntertainment() {
    if (options.notifier.entertain) {
      if (!entertaining) {
        var randomBackgroundClass = Math.floor(Math.random() * options.notifier.entertainLimit + 1);
        notifyElement.className = "notifier entertain ".concat(options.notifier.entertainClass).concat(randomBackgroundClass);
        entertainTimeoutId = setTimeout(runEntertainment, options.notifier.entertainInterval);
        entertaining = true;
      }
    } else {
      cancelEntertainment();
    }
  }
  function cancelEntertainment() {
    if (notifyElement) {
      notifyElement.classList.remove("entertain");
    }
    clearTimeout(entertainTimeoutId);
    entertainTimeoutId = null;
    entertaining = false;
  }
  function setMessage(message, messageOptions) {
    var notifierMessage = getNotifierMessage();
    if (notifierMessage) {
      options.debug("Notifier: setMessage(".concat(message, ")"));
      if (message.length > 0) {
        var problem = messageOptions.problem ? messageOptions.problem : false;
        notifierMessage.innerHTML = (problem ? "&#x2639; " : "") + message;
      } else {
        options.logger.warn("Not going to update notifierMessage element because message is empty", message);
      }
      (0, _hidden.default)(notifierMessage, false);
    } else {
      // Must be unloaded, do nothing further
    }
  }
  this.error = function (err) {
    var message = err.message ? err.message.toString() : err.toString();
    var explanation = err.explanation ? err.explanation.toString() : null;
    if (!message) {
      options.debug("Weird empty error message generated for error", err);
    }
    self.notify(message, explanation, {
      blocking: true,
      problem: true,
      hideForm: err.hideForm && err.hideForm(),
      classList: err.getClassList && err.getClassList(),
      removeDimensions: err.removeDimensions && err.removeDimensions()
    });
  };
  this.setExplanation = function (explanation) {
    if (!explanationElement) {
      explanationElement = (0, _hyperscript.default)("p", {
        className: "explanation"
      });
      if (notifyElement) {
        notifyElement.appendChild(explanationElement);
      } else {
        options.logger.warn("Unable to show explanation because notifyElement is empty:", explanation);
      }
    }
    explanationElement.innerHTML = explanation;
    (0, _hidden.default)(explanationElement, false);
  };
  this.build = function () {
    options.debug("Notifier: build()");
    notifyElement = visuals.querySelector(".notifier");
    if (!notifyElement) {
      notifyElement = (0, _hyperscript.default)(".notifier"); // defaults to div

      this.hide();
      visuals.appendChild(notifyElement);
    } else {
      this.hide();
    }
    !built && initEvents();
    built = true;
  };
  function hideMessage() {
    var notifierMessage = getNotifierMessage();
    if (notifierMessage) {
      (0, _hidden.default)(notifierMessage, true);
    }
  }
  function hideExplanation() {
    if (explanationElement) {
      (0, _hidden.default)(explanationElement, true);
    }
  }
  this.hide = function () {
    cancelEntertainment();
    if (notifyElement) {
      (0, _hidden.default)(notifyElement, true);
      notifyElement.classList.remove("blocking");
    }
    hideMessage();
    hideExplanation();
  };
  this.isVisible = function () {
    if (!built) {
      return false;
    }
    return notifyElement && !(0, _hidden.default)(notifyElement);
  };
  this.isBuilt = function () {
    return built;
  };
  function getNotifierMessage() {
    return document.getElementById(NOTIFIER_MESSAGE_ID);
  }
  this.notify = function (message, explanation) {
    var notifyOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var params = [message, explanation].filter(Boolean);
    options.debug("Notifier: notify(".concat(params.join(", "), ")"));
    var stillWait = notifyOptions.stillWait ? notifyOptions.stillWait : false;
    var entertain = notifyOptions.entertain ? notifyOptions.entertain : false;
    var blocking = notifyOptions.blocking ? notifyOptions.blocking : false;
    var hideForm = notifyOptions.hideForm ? notifyOptions.hideForm : false;
    var classList = notifyOptions.classList ? notifyOptions.classList : false;
    var removeDimensions = notifyOptions.removeDimensions ? notifyOptions.removeDimensions : false;
    var notifierMessage = getNotifierMessage();
    if (!notifierMessage && notifyElement) {
      var messageElement = (0, _hyperscript.default)("h2", {
        id: NOTIFIER_MESSAGE_ID
      });
      notifyElement.appendChild(messageElement);
    }
    notifierMessage = getNotifierMessage();
    if (notifyElement && notifierMessage && explanationElement) {
      notifyElement.insertBefore(notifierMessage, explanationElement);
    }
    if (notifyElement) {
      // reset
      if (!entertain) {
        notifyElement.className = "notifier";
      }
      if (classList) {
        classList.forEach(function (className) {
          notifyElement.classList.add(className);
        });
      }
      if (removeDimensions) {
        notifyElement.style.width = "auto";
        notifyElement.style.height = "auto";
      }
    }
    if (blocking) {
      notifyElement && notifyElement.classList.add("blocking");
      this.emit(_events.default.BLOCKING, {
        hideForm: hideForm
      });
    } else {
      this.emit(_events.default.NOTIFYING);
    }
    visuals.hideReplay();
    visuals.hideRecorder();
    setMessage(message, notifyOptions);
    if (explanation && explanation.length > 0) {
      this.setExplanation(explanation);
    }
    if (entertain) {
      runEntertainment();
    } else {
      cancelEntertainment();
    }

    /*
     * just as a safety in case if an error is thrown in the middle of the build process
     * and visuals aren't built/shown yet.
     */
    visuals.showVisuals();
    show();
    !stillWait && visuals.endWaiting();
  };
};
(0, _inherits.default)(Notifier, _eventEmitter.default);
var _default = exports.default = Notifier;

},{"../../events":119,"../../util/eventEmitter":126,"@babel/runtime/helpers/interopRequireDefault":4,"hidden":61,"hyperscript":63,"inherits":66}],145:[function(_dereq_,module,exports){
(function (Buffer){(function (){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _animitter = _interopRequireDefault(_dereq_("animitter"));
var _canvasToBuffer = _interopRequireDefault(_dereq_("canvas-to-buffer"));
var _deepmerge = _interopRequireDefault(_dereq_("deepmerge"));
var _hidden = _interopRequireDefault(_dereq_("hidden"));
var _hyperscript = _interopRequireDefault(_dereq_("hyperscript"));
var _inherits = _interopRequireDefault(_dereq_("inherits"));
var _safeJsonStringify = _interopRequireDefault(_dereq_("safe-json-stringify"));
var _websocketStream = _interopRequireDefault(_dereq_("websocket-stream"));
var _constants = _interopRequireDefault(_dereq_("../../constants"));
var _events = _interopRequireDefault(_dereq_("../../events"));
var _browser = _interopRequireDefault(_dereq_("../../util/browser"));
var _eventEmitter = _interopRequireDefault(_dereq_("../../util/eventEmitter"));
var _humanize = _interopRequireDefault(_dereq_("../../util/humanize"));
var _pretty = _interopRequireDefault(_dereq_("../../util/pretty"));
var _videomailError = _interopRequireDefault(_dereq_("../../util/videomailError"));
var _userMedia = _interopRequireDefault(_dereq_("./userMedia"));
// credits http://1lineart.kulaone.com/#/
var PIPE_SYMBOL = "°º¤ø,¸¸,ø¤º°`°º¤ø,¸,ø¤°º¤ø,¸¸,ø¤º°`°º¤ø,¸ ";
var Recorder = function Recorder(visuals, replay) {
  var defaultOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  _eventEmitter.default.call(this, defaultOptions, "Recorder");
  var browser = new _browser.default(defaultOptions);
  var options = (0, _deepmerge.default)(defaultOptions, {
    image: {
      // automatically lower quality when on mobile
      quality: browser.isMobile() ? defaultOptions.image.quality - 0.05 : defaultOptions.image.quality
    }
  });

  // validate some options this class needs
  if (!options.video || !options.video.fps) {
    throw _videomailError.default.create("FPS must be defined", options);
  }
  var self = this;
  var debug = options.debug;
  var loop = null;
  var originalAnimationFrameObject;
  var samplesCount = 0;
  var framesCount = 0;
  var facingMode = options.video.facingMode; // default is 'user'

  var recordingStats = {};
  var confirmedFrameNumber = 0;
  var confirmedSampleNumber = 0;
  var recorderElement;
  var userMedia;
  var userMediaTimeout;
  var retryTimeout;
  var bytesSum;
  var frameProgress;
  var sampleProgress;
  var canvas;
  var ctx;
  var userMediaLoaded;
  var userMediaLoading;
  var submitting;
  var unloaded;
  var stopTime;
  var stream;
  var connecting;
  var connected;
  var blocking;
  var built;
  var key;
  var waitingTime;
  var pingInterval;
  var frame;
  var recordingBufferLength;
  var recordingBuffer;
  function writeStream(buffer, opts) {
    if (stream) {
      if (stream.destroyed) {
        // prevents https://github.com/binarykitchen/videomail.io/issues/393
        stopPings();
        self.emit(_events.default.ERROR, _videomailError.default.create("Already disconnected", "Sorry, connection to the server has been destroyed. Please reload.", options));
      } else {
        var onFlushedCallback = opts && opts.onFlushedCallback;
        try {
          stream.write(buffer, function () {
            if (!onFlushedCallback) {
              return;
            }
            try {
              onFlushedCallback(opts);
            } catch (exc) {
              self.emit(_events.default.ERROR, _videomailError.default.create("Failed to write stream buffer", "stream.write() failed because of ".concat((0, _pretty.default)(exc)), options));
            }
          });
        } catch (exc) {
          self.emit(_events.default.ERROR, _videomailError.default.create("Failed writing to server", "stream.write() failed because of ".concat((0, _pretty.default)(exc)), options));
        }
      }
    }
  }
  function sendPings() {
    pingInterval = window.setInterval(function () {
      debug("Recorder: pinging...");
      writeStream(Buffer.from(""));
    }, options.timeouts.pingInterval);
  }
  function stopPings() {
    clearInterval(pingInterval);
  }
  function onAudioSample(audioSample) {
    samplesCount++;
    var audioBuffer = audioSample.toBuffer();

    /*
     * if (options.verbose) {
     *     debug(
     *         'Sample #' + samplesCount + ' (' + audioBuffer.length + ' bytes):'
     *     )
     * }
     */

    writeStream(audioBuffer);
  }
  function show() {
    recorderElement && (0, _hidden.default)(recorderElement, false);
  }
  function onUserMediaReady() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    try {
      debug("Recorder: onUserMediaReady()", (0, _safeJsonStringify.default)(params));
      var switchingFacingMode = params.switchingFacingMode;
      userMediaLoading = blocking = unloaded = submitting = false;
      userMediaLoaded = true;
      if (!switchingFacingMode) {
        loop = createLoop();
      }
      show();
      if (params.recordWhenReady) {
        self.record();
      }
      self.emit(_events.default.USER_MEDIA_READY, {
        switchingFacingMode: params.switchingFacingMode,
        paused: self.isPaused(),
        recordWhenReady: params.recordWhenReady
      });
    } catch (exc) {
      self.emit(_events.default.ERROR, exc);
    }
  }
  function clearRetryTimeout() {
    if (!retryTimeout) {
      return;
    }
    debug("Recorder: clearRetryTimeout()");
    clearTimeout(retryTimeout);
    retryTimeout = null;
  }
  function calculateFrameProgress() {
    return "".concat((confirmedFrameNumber / (framesCount || 1) * 100).toFixed(2), "%");
  }
  function calculateSampleProgress() {
    return "".concat((confirmedSampleNumber / (samplesCount || 1) * 100).toFixed(2), "%");
  }
  function updateOverallProgress() {
    /*
     * when progresses aren't initialized,
     * then do a first calculation to avoid `infinite` or `null` displays
     */

    if (!frameProgress) {
      frameProgress = calculateFrameProgress();
    }
    if (!sampleProgress) {
      sampleProgress = calculateSampleProgress();
    }
    self.emit(_events.default.PROGRESS, frameProgress, sampleProgress);
  }
  function updateFrameProgress(args) {
    confirmedFrameNumber = args.frame ? args.frame : confirmedFrameNumber;
    frameProgress = calculateFrameProgress();
    updateOverallProgress();
  }
  function updateSampleProgress(args) {
    confirmedSampleNumber = args.sample ? args.sample : confirmedSampleNumber;
    sampleProgress = calculateSampleProgress();
    updateOverallProgress();
  }
  function preview(args) {
    confirmedFrameNumber = confirmedSampleNumber = samplesCount = framesCount = 0;
    sampleProgress = frameProgress = null;
    key = args.key;

    /*
     * We are not serving MP4 videos anymore due to licensing but are keeping code
     * for compatibility and documentation
     */
    if (args.mp4) {
      replay.setMp4Source("".concat(args.mp4 + _constants.default.SITE_NAME_LABEL, "/").concat(options.siteName, "/videomail.mp4"), true);
    }
    if (args.webm) {
      replay.setWebMSource("".concat(args.webm + _constants.default.SITE_NAME_LABEL, "/").concat(options.siteName, "/videomail.webm"), true);
    }
    self.hide();
    var width = self.getRecorderWidth(true);
    var height = self.getRecorderHeight(true);
    self.emit(_events.default.PREVIEW, key, width, height);

    // keep it for recording stats
    waitingTime = Date.now() - stopTime;
    recordingStats.waitingTime = waitingTime;
    if (options.debug) {
      debug("While recording, %s have been transferred and waiting time was %s", _humanize.default.filesize(bytesSum, 2), _humanize.default.toTime(waitingTime));
    }
  }
  function initSocket(cb) {
    if (!connected) {
      connecting = true;
      debug("Recorder: initializing web socket to %s", options.socketUrl);
      self.emit(_events.default.CONNECTING);

      // https://github.com/maxogden/websocket-stream#binary-sockets

      /*
       * we use query parameters here because we cannot set custom headers in web sockets,
       * see https://github.com/websockets/ws/issues/467
       */

      var url2Connect = "".concat(options.socketUrl, "?").concat(encodeURIComponent(_constants.default.SITE_NAME_LABEL), "=").concat(encodeURIComponent(options.siteName));
      try {
        /*
         * websocket options cannot be set on client side, only on server, see
         * https://github.com/maxogden/websocket-stream/issues/116#issuecomment-296421077
         */
        stream = (0, _websocketStream.default)(url2Connect, {
          perMessageDeflate: false,
          // see https://github.com/maxogden/websocket-stream/issues/117#issuecomment-298826011
          objectMode: true
        });
      } catch (exc) {
        connecting = connected = false;
        var err;
        if (typeof _websocketStream.default === "undefined") {
          err = _videomailError.default.create("There is no websocket", "Cause: ".concat((0, _pretty.default)(exc)), options);
        } else {
          err = _videomailError.default.create("Failed to connect to server", "Please upgrade your browser. Your current version does not seem to support websockets.", options, {
            browserProblem: true
          });
        }
        self.emit(_events.default.ERROR, err);
      }
      if (stream) {
        // useful for debugging streams

        /*
         * if (!stream.originalEmit) {
         *   stream.originalEmit = stream.emit
         * }
         */

        /*
         * stream.emit = function (type) {
         *   if (stream) {
         *     debug(PIPE_SYMBOL + 'Debugging stream event:', type)
         *     var args = Array.prototype.slice.call(arguments, 0)
         *     return stream.originalEmit.apply(stream, args)
         *   }
         * }
         */

        stream.on("close", function (err) {
          debug("".concat(PIPE_SYMBOL, "Stream has closed"));
          if (err) {
            connecting = connected = false;
            self.emit(_events.default.ERROR, err || "Unhandled websocket error");
          } else {
            // COMMENTED OUT TEMPORARILY, PROBABLY OLD CODE TOO
            // UPON CLOSE IT SHOULD TRY TO RECONNECT INSTEAD OF DISCONNECT.
            // self.emit(Events.DISCONNECTED);
            // // prevents from https://github.com/binarykitchen/videomail.io/issues/297 happening
            // cancelAnimationFrame();
          }
        });
        stream.on("connect", function () {
          debug("".concat(PIPE_SYMBOL, "Stream *connect* event emitted"));
          var isClosing = this.socket.readyState === WebSocket.CLOSING;
          if (!connected && !isClosing && !unloaded) {
            connected = true;
            connecting = unloaded = false;
            self.emit(_events.default.CONNECTED);
            cb && cb();
          }
        });
        stream.on("data", function (data) {
          debug("".concat(PIPE_SYMBOL, "Stream *data* event emitted"));
          var command;
          try {
            command = JSON.parse(data.toString());
          } catch (exc) {
            debug("Failed to parse command:", exc);
            self.emit(_events.default.ERROR, _videomailError.default.create("Invalid server command", // toString() since https://github.com/binarykitchen/videomail.io/issues/288
            "Contact us asap. Bad command was ".concat(data.toString(), ". "), options));
          } finally {
            executeCommand.call(self, command);
          }
        });
        stream.on("error", function (err) {
          debug("".concat(PIPE_SYMBOL, "Stream *error* event emitted: ").concat(err.message));

          // OLD CODE, COMMENTED OUT TEMPORARILY FOR INVESTIGATIONS
          // IT SHOULD RECONNECT INSTEAD OF CLOSING THE CONNECTION

          // connecting = connected = false;

          // let videomailError;

          // if (browser.isIOS()) {
          //   /*
          //    * setting custom text since that err object isn't really an error
          //    * on iPhones when locked, and unlocked, this err is actually
          //    * an event object with stuff we can't use at all (an external bug)
          //    */
          //   videomailError = VideomailError.create(
          //     err,
          //     `iPhones cannot maintain a live connection for too long. Original error message is: ${err.toString()}`,
          //     options,
          //   );

          //   /*
          //    * Changed to the above temporarily for better investigations
          //    * videomailError = VideomailError.create(
          //    *   'Sorry, connection has timed out',
          //    *   'iPhones cannot maintain a live connection for too long,
          //    *   options
          //    * )
          //    */
          // } else {
          //   // or else it could be a poor wifi connection...
          //   videomailError = VideomailError.create(
          //     "Data exchange interrupted",
          //     "Please check your network connection and reload",
          //     options,
          //   );
          // }

          // self.emit(Events.ERROR, videomailError);
        });

        // just experimental

        stream.on("drain", function () {
          debug("".concat(PIPE_SYMBOL, "Stream *drain* event emitted (should not happen!)"));
        });
        stream.on("preend", function () {
          debug("".concat(PIPE_SYMBOL, "Stream *preend* event emitted"));
        });
        stream.on("end", function () {
          debug("".concat(PIPE_SYMBOL, "Stream *end* event emitted"));
        });
        stream.on("drain", function () {
          debug("".concat(PIPE_SYMBOL, "Stream *drain* event emitted"));
        });
        stream.on("pipe", function () {
          debug("".concat(PIPE_SYMBOL, "Stream *pipe* event emitted"));
        });
        stream.on("unpipe", function () {
          debug("".concat(PIPE_SYMBOL, "Stream *unpipe* event emitted"));
        });
        stream.on("resume", function () {
          debug("".concat(PIPE_SYMBOL, "Stream *resume* event emitted"));
        });
        stream.on("uncork", function () {
          debug("".concat(PIPE_SYMBOL, "Stream *uncork* event emitted"));
        });
        stream.on("readable", function () {
          debug("".concat(PIPE_SYMBOL, "Stream *preend* event emitted"));
        });
        stream.on("prefinish", function () {
          debug("".concat(PIPE_SYMBOL, "Stream *preend* event emitted"));
        });
        stream.on("finish", function () {
          debug("".concat(PIPE_SYMBOL, "Stream *preend* event emitted"));
        });
      }
    }
  }
  function showUserMedia() {
    /*
     * use connected flag to prevent this from happening
     * https://github.com/binarykitchen/videomail.io/issues/323
     */
    return connected && (isNotifying() || !isHidden() || blocking);
  }
  function userMediaErrorCallback(err) {
    userMediaLoading = false;
    clearUserMediaTimeout();
    debug("Recorder: userMediaErrorCallback(), name: ".concat(err.name, ", message: ").concat(err.message, " and Webcam characteristics: ").concat((0, _safeJsonStringify.default)(userMedia.getCharacteristics())));
    var errorListeners = self.listeners(_events.default.ERROR);
    if (errorListeners && errorListeners.length) {
      if (err.name !== _videomailError.default.MEDIA_DEVICE_NOT_SUPPORTED) {
        self.emit(_events.default.ERROR, _videomailError.default.create(err, options));
      } else {
        // do not emit but retry since MEDIA_DEVICE_NOT_SUPPORTED can be a race condition
        debug("Recorder: ignore user media error", err);
      }

      // retry after a while
      retryTimeout = setTimeout(initSocket, options.timeouts.userMedia);
    } else if (unloaded) {
      /*
       * This can happen when a container is unloaded but some user media related callbacks
       * are still in process. In that case ignore error.
       */
      debug("Recorder: already unloaded. Not going to throw error", err);
    } else {
      debug("Recorder: no error listeners attached but throwing error", err);

      // weird situation, throw it instead of emitting since there are no error listeners
      throw _videomailError.default.create(err, "Unable to process this error since there are no error listeners anymore.", options);
    }
  }
  function getUserMediaCallback(localStream, params) {
    debug("Recorder: getUserMediaCallback()", (0, _safeJsonStringify.default)(params));
    if (showUserMedia()) {
      try {
        clearUserMediaTimeout();
        userMedia.init(localStream, function () {
          onUserMediaReady(params);
        }, onAudioSample.bind(self), function (err) {
          self.emit(_events.default.ERROR, err);
        }, params);
      } catch (exc) {
        self.emit(_events.default.ERROR, exc);
      }
    }
  }
  function loadGenuineUserMedia(params) {
    if (!navigator) {
      throw new Error("Navigator is missing!");
    }
    debug("Recorder: loadGenuineUserMedia()");
    self.emit(_events.default.ASKING_WEBCAM_PERMISSION);

    // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // prefer the front camera (if one is available) over the rear one
      var constraints = {
        video: {
          facingMode: facingMode,
          frameRate: {
            ideal: options.video.fps
          }
        },
        audio: options.isAudioEnabled()
      };
      if (browser.isOkSafari()) {
        /*
         * do not use those width/height constraints yet,
         * current safari would throw an error
         * todo in https://github.com/binarykitchen/videomail-client/issues/142
         */
      } else {
        if (options.hasDefinedWidth()) {
          constraints.video.width = {
            ideal: options.video.width
          };
        } else {
          /*
           * otherwise try to apply the same width as the element is having
           * but there is no 100% guarantee that this will happen. not
           * all webcam drivers behave the same way
           */
          constraints.video.width = {
            ideal: self.limitWidth()
          };
        }
        if (options.hasDefinedHeight()) {
          constraints.video.height = {
            ideal: options.video.height
          };
        }
      }
      debug("Recorder: navigator.mediaDevices.getUserMedia()", (0, _safeJsonStringify.default)(constraints));
      if (navigator.mediaDevices.getSupportedConstraints) {
        debug("Recorder: navigator.mediaDevices.getSupportedConstraints()", (0, _safeJsonStringify.default)(navigator.mediaDevices.getSupportedConstraints()));
      }
      var genuineUserMediaRequest = navigator.mediaDevices.getUserMedia(constraints);
      if (genuineUserMediaRequest) {
        genuineUserMediaRequest.then(function (localStream) {
          getUserMediaCallback(localStream, params);
        }).catch(userMediaErrorCallback);
      } else {
        /*
         * this to trap errors like these
         * Cannot read property 'then' of undefined
         */

        // todo retry with navigator.getUserMedia_() maybe?
        throw _videomailError.default.create("Sorry, your browser is unable to use cameras.", "Try a different browser with better user media functionalities.", options);
      }
    } else {
      debug("Recorder: navigator.getUserMedia()");
      navigator.getUserMedia_({
        video: true,
        audio: options.isAudioEnabled()
      }, getUserMediaCallback, userMediaErrorCallback);
    }
  }
  function loadUserMedia() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    if (userMediaLoaded) {
      debug("Recorder: skipping loadUserMedia() because it is already loaded");
      onUserMediaReady(params);
      return false;
    } else if (userMediaLoading) {
      debug("Recorder: skipping loadUserMedia() because it is already asking for permission");
      return false;
    }
    debug("Recorder: loadUserMedia(".concat((0, _safeJsonStringify.default)(params), ")"));
    self.emit(_events.default.LOADING_USER_MEDIA);
    try {
      userMediaTimeout = setTimeout(function () {
        if (!self.isReady()) {
          self.emit(_events.default.ERROR, browser.getNoAccessIssue());
        }
      }, options.timeouts.userMedia);
      userMediaLoading = true;
      loadGenuineUserMedia(params);
    } catch (exc) {
      debug("Recorder: failed to load genuine user media");
      userMediaLoading = false;
      var errorListeners = self.listeners(_events.default.ERROR);
      if (errorListeners.length) {
        self.emit(_events.default.ERROR, exc);
      } else {
        debug("Recorder: no error listeners attached but throwing exception", exc);
        throw exc; // throw it further
      }
    }
  }
  function executeCommand(command) {
    if (unloaded) {
      // Skip
      return;
    }
    try {
      if (command.args) {
        debug("Server commanded: ".concat(command.command, " with ").concat((0, _safeJsonStringify.default)(command.args)));
      } else {
        debug("Server commanded: ".concat(command.command));
      }
      switch (command.command) {
        case "ready":
          this.emit(_events.default.SERVER_READY);
          if (!userMediaTimeout) {
            if (options.loadUserMediaOnRecord) {
              // Still show it but have it blank
              show();
            } else {
              loadUserMedia();
            }
          }
          break;
        case "preview":
          preview(command.args);
          break;
        case "error":
          this.emit(_events.default.ERROR, _videomailError.default.create("Oh no, server error!", command.args.err.toString() || "(No message given)", options));
          break;
        case "confirmFrame":
          updateFrameProgress(command.args);
          break;
        case "confirmSample":
          updateSampleProgress(command.args);
          break;
        case "beginAudioEncoding":
          this.emit(_events.default.BEGIN_AUDIO_ENCODING);
          break;
        case "beginVideoEncoding":
          this.emit(_events.default.BEGIN_VIDEO_ENCODING);
          break;
        default:
          this.emit(_events.default.ERROR, "Unknown server command: ".concat(command.command));
          break;
      }
    } catch (exc) {
      self.emit(_events.default.ERROR, exc);
    }
  }
  function isNotifying() {
    return visuals.isNotifying();
  }
  function isHidden() {
    return !recorderElement || (0, _hidden.default)(recorderElement);
  }
  function writeCommand(command, args, cb) {
    if (!cb && args && args.constructor === Function) {
      cb = args;
      args = null;
    }
    if (!connected) {
      debug("Reconnecting for the command", command, "…");
      initSocket(function () {
        writeCommand(command, args);
        cb && cb();
      });
    } else if (stream) {
      if (args) {
        debug("$ ".concat(command, " with ").concat((0, _safeJsonStringify.default)(args)));
      } else {
        debug("$ ".concat(command));
      }
      var commandObj = {
        command: command,
        args: args
      };

      /*
       * todo commented out because for some reasons server does
       * not accept such a long array of many log lines. to examine later.
       *
       * add some useful debug info to examine weird stuff like this one
       * UnprocessableError: Unable to encode a video with FPS near zero.
       * todo consider removing this later or have it for debug=1 only?
       *
       * if (options.logger && options.logger.getLines) {
       *   commandObj.logLines = options.logger.getLines()
       * }
       */

      writeStream(Buffer.from((0, _safeJsonStringify.default)(commandObj)));
      if (cb) {
        // keep all callbacks async
        setTimeout(function () {
          cb();
        }, 0);
      }
    }
  }
  function cancelAnimationFrame() {
    loop && loop.dispose();
  }
  function getIntervalSum() {
    return loop.getElapsedTime();
  }
  function getAvgInterval() {
    return getIntervalSum() / framesCount;
  }
  function getAvgFps() {
    return framesCount / getIntervalSum() * 1000;
  }
  this.getRecordingStats = function () {
    return recordingStats;
  };
  this.getAudioSampleRate = function () {
    return userMedia.getAudioSampleRate();
  };
  this.stop = function (params) {
    debug("stop(".concat((0, _safeJsonStringify.default)(params), ")"));
    var limitReached = params.limitReached;
    this.emit(_events.default.STOPPING, limitReached);
    loop.complete();
    var self = this;

    /*
     * needed to give dom enough time to prepare the replay element
     * to show up upon the STOPPING event so that we can evaluate
     * the right video type
     */
    setTimeout(function () {
      stopTime = Date.now();
      recordingStats = {
        /*
         * do not use loop.getFPS() as this will only return the fps from the last delta,
         * not the average. see https://github.com/hapticdata/animitter/issues/3
         */
        avgFps: getAvgFps(),
        wantedFps: options.video.fps,
        avgInterval: getAvgInterval(),
        wantedInterval: 1e3 / options.video.fps,
        intervalSum: getIntervalSum(),
        framesCount: framesCount,
        videoType: replay.getVideoType()
      };
      if (options.isAudioEnabled()) {
        recordingStats.samplesCount = samplesCount;
        recordingStats.sampleRate = userMedia.getAudioSampleRate();
      }
      writeCommand("stop", recordingStats, function () {
        self.emit(_events.default.STOPPED, {
          recordingStats: recordingStats
        });
      });

      // beware, resetting will set framesCount to zero, so leave this here
      self.reset();
    }, 60);
  };
  this.back = function (cb) {
    this.emit(_events.default.GOING_BACK);
    show();
    this.reset();
    writeCommand("back", cb);
  };
  function reInitializeAudio() {
    debug("Recorder: reInitializeAudio()");
    clearUserMediaTimeout();

    // important to free memory
    userMedia && userMedia.stop();
    userMediaLoaded = key = canvas = ctx = null;
    loadUserMedia();
  }
  this.unload = function (e) {
    if (unloaded || !built) {
      return; // already unloaded
    }
    var cause;
    if (e) {
      cause = e.name || e.statusText || e.toString();
    }
    debug("Recorder: unload()".concat(cause ? ", cause: ".concat(cause) : ""));
    this.reset();
    clearUserMediaTimeout();
    if (userMedia) {
      // prevents https://github.com/binarykitchen/videomail-client/issues/114
      userMedia.unloadRemainingEventListeners();
    }
    if (submitting) {
      // server will disconnect socket automatically after submitting
    } else if (stream) {
      /*
       * force to disconnect socket right now to clean temp files on server
       * event listeners will do the rest
       */
      debug("Recorder: ending stream ...");
      stream.destroy();
      stream = undefined;
    }
    unloaded = true;
    built = connecting = connected = false;
  };
  this.reset = function () {
    // no need to reset when already unloaded
    if (!unloaded) {
      debug("Recorder: reset()");
      this.emit(_events.default.RESETTING);
      cancelAnimationFrame();

      // important to free memory
      userMedia && userMedia.stop();
      replay.reset();
      userMediaLoaded = key = canvas = ctx = recordingBuffer = recordingBufferLength = null;
    }
  };
  function clearUserMediaTimeout() {
    if (userMediaTimeout) {
      debug("Recorder: clearUserMediaTimeout()");
      userMediaTimeout && clearTimeout(userMediaTimeout);
      userMediaTimeout = null;
    }
  }
  this.validate = function () {
    return connected && canvas === null;
  };
  this.isReady = function () {
    return userMedia.isReady();
  };
  this.pause = function (params) {
    var e = params && params.event;
    if (e instanceof window.Event) {
      params.eventType = e.type;
    }
    if (params) {
      debug("pause() at frame ".concat(framesCount, " with ").concat((0, _safeJsonStringify.default)(params)));
    } else {
      debug("pause() at frame ".concat(framesCount));
    }
    userMedia.pause();
    loop.stop();
    this.emit(_events.default.PAUSED);
    sendPings();
  };
  this.isPaused = function () {
    return userMedia && userMedia.isPaused();
  };
  this.resume = function () {
    debug("Recorder: resume() with frame ".concat(framesCount));
    stopPings();
    this.emit(_events.default.RESUMING);
    userMedia.resume();
    loop.start();
  };
  function onFlushed(opts) {
    var frameNumber = opts && opts.frameNumber;
    if (frameNumber === 1) {
      self.emit(_events.default.FIRST_FRAME_SENT);
    }
  }
  function draw(deltaTime, elapsedTime) {
    try {
      // ctx and stream might become null while unloading
      if (!self.isPaused() && stream && ctx) {
        if (framesCount === 0) {
          self.emit(_events.default.SENDING_FIRST_FRAME);
        }
        framesCount++;
        ctx.drawImage(userMedia.getRawVisuals(), 0, 0, canvas.width, canvas.height);
        recordingBuffer = frame.toBuffer();
        recordingBufferLength = recordingBuffer.length;
        if (recordingBufferLength < 1) {
          throw _videomailError.default.create("Failed to extract webcam data.", options);
        }
        bytesSum += recordingBufferLength;
        var frameControlBuffer = Buffer.from((0, _safeJsonStringify.default)({
          frameNumber: framesCount
        }));
        var frameBuffer = Buffer.concat([recordingBuffer, frameControlBuffer]);
        writeStream(frameBuffer, {
          frameNumber: framesCount,
          onFlushedCallback: onFlushed
        });

        /*
         * if (options.verbose) {
         *   debug(
         *     'Frame #' + framesCount + ' (' + recordingBufferLength + ' bytes):',
         *     ' delta=' + deltaTime + 'ms, ' +
         *     ' elapsed=' + elapsedTime + 'ms'
         *   )
         * }
         */

        visuals.checkTimer({
          intervalSum: elapsedTime
        });
      }
    } catch (exc) {
      self.emit(_events.default.ERROR, exc);
    }
  }
  function createLoop() {
    var newLoop = (0, _animitter.default)({
      fps: options.video.fps
    }, draw);

    // remember it first
    originalAnimationFrameObject = newLoop.getRequestAnimationFrameObject();
    return newLoop;
  }
  this.record = function () {
    if (unloaded) {
      return false;
    }

    // reconnect when needed
    if (!connected) {
      debug("Recorder: reconnecting before recording ...");
      initSocket(function () {
        self.once(_events.default.USER_MEDIA_READY, self.record);
      });
      return false;
    }
    if (!userMediaLoaded) {
      if (options.loadUserMediaOnRecord) {
        loadUserMedia({
          recordWhenReady: true
        });
      } else {
        self.emit(_events.default.ERROR, _videomailError.default.create("Load and enable your camera first", options));
      }
      return false; // do nothing further
    }
    try {
      canvas = userMedia.createCanvas();
    } catch (exc) {
      self.emit(_events.default.ERROR, _videomailError.default.create(exc, options));
      return false;
    }
    ctx = canvas.getContext("2d");
    if (!canvas.width) {
      self.emit(_events.default.ERROR, _videomailError.default.create("Canvas has an invalid width.", options));
      return false;
    }
    if (!canvas.height) {
      self.emit(_events.default.ERROR, _videomailError.default.create("Canvas has an invalid height.", options));
      return false;
    }
    bytesSum = 0;
    frame = new _canvasToBuffer.default(canvas, options.image.types, options.image.quality);
    debug("Recorder: record()");
    userMedia.record();
    self.emit(_events.default.RECORDING, framesCount);

    // see https://github.com/hapticdata/animitter/issues/3
    loop.on("update", function (_deltaTime, elapsedTime) {
      // x1000 because of milliseconds
      var avgFPS = framesCount / elapsedTime * 1000;
      debug("Recorder: avgFps = ".concat(Math.round(avgFPS), ", framesCount = ").concat(framesCount));
    });
    loop.start();
  };
  function setAnimationFrameObject(newObj) {
    /*
     * must stop and then start to make it become effective, see
     * https://github.com/hapticdata/animitter/issues/5#issuecomment-292019168
     */
    if (loop) {
      var isRecording = self.isRecording();
      loop.stop();
      loop.setRequestAnimationFrameObject(newObj);
      if (isRecording) {
        loop.start();
      }
    }
  }
  function restoreAnimationFrameObject() {
    debug("Recorder: restoreAnimationFrameObject()");
    setAnimationFrameObject(originalAnimationFrameObject);
  }
  function loopWithTimeouts() {
    debug("Recorder: loopWithTimeouts()");
    var wantedInterval = 1e3 / options.video.fps;
    var processingTime = 0;
    var start;
    function raf(fn) {
      return setTimeout(function () {
        start = Date.now();
        fn();
        processingTime = Date.now() - start;
      },
      /*
       * reducing wanted interval by respecting the time it takes to
       * compute internally since this is not multi-threaded like
       * requestAnimationFrame
       */
      wantedInterval - processingTime);
    }
    function cancel(id) {
      clearTimeout(id);
    }
    setAnimationFrameObject({
      requestAnimationFrame: raf,
      cancelAnimationFrame: cancel
    });
  }
  function buildElement() {
    recorderElement = (0, _hyperscript.default)("video.".concat(options.selectors.userMediaClass));
    visuals.appendChild(recorderElement);
  }
  function correctDimensions() {
    if (options.hasDefinedWidth()) {
      recorderElement.width = self.getRecorderWidth(true);
    }
    if (options.hasDefinedHeight()) {
      recorderElement.height = self.getRecorderHeight(true);
    }
  }
  function switchFacingMode() {
    if (!browser.isMobile()) {
      return false;
    }
    if (facingMode === "user") {
      facingMode = "environment";
    } else if (facingMode === "environment") {
      facingMode = "user";
    } else {
      debug("Recorder: unsupported facing mode", facingMode);
    }
    loadGenuineUserMedia({
      switchingFacingMode: true
    });
  }
  function initEvents() {
    debug("Recorder: initEvents()");
    self.on(_events.default.SUBMITTING, function () {
      submitting = true;
    }).on(_events.default.SUBMITTED, function () {
      submitting = false;
    }).on(_events.default.BLOCKING, function () {
      blocking = true;
      clearUserMediaTimeout();
    }).on(_events.default.HIDE, function () {
      self.hide();
    }).on(_events.default.LOADED_META_DATA, function () {
      correctDimensions();
    }).on(_events.default.DISABLING_AUDIO, function () {
      reInitializeAudio();
    }).on(_events.default.ENABLING_AUDIO, function () {
      reInitializeAudio();
    }).on(_events.default.INVISIBLE, function () {
      loopWithTimeouts();
    }).on(_events.default.VISIBLE, function () {
      restoreAnimationFrameObject();
    }).on(_events.default.SWITCH_FACING_MODE, function () {
      switchFacingMode();
    });
  }
  this.build = function () {
    var err = browser.checkRecordingCapabilities();
    if (!err) {
      err = browser.checkBufferTypes();
    }
    if (err) {
      this.emit(_events.default.ERROR, err);
    } else {
      recorderElement = visuals.querySelector("video.".concat(options.selectors.userMediaClass));
      if (!recorderElement) {
        buildElement();
      }
      correctDimensions();

      /*
       * prevent audio feedback, see
       * https://github.com/binarykitchen/videomail-client/issues/35
       */
      recorderElement.muted = true;

      // for iphones, see https://github.com/webrtc/samples/issues/929
      recorderElement.setAttribute("playsinline", true);
      recorderElement.setAttribute("webkit-playsinline", "webkit-playsinline");

      /*
       * add these here, not in CSS because users can configure custom
       * class names
       */
      recorderElement.style.transform = "rotateY(180deg)";
      recorderElement.style["-webkit-transform"] = "rotateY(180deg)";
      recorderElement.style["-moz-transform"] = "rotateY(180deg)";
      if (options.video.stretch) {
        recorderElement.style.width = "100%";
      }
      if (!userMedia) {
        userMedia = new _userMedia.default(this, options);
      }
      show();
      if (!built) {
        initEvents();
        if (!connected) {
          initSocket();
        } else if (!options.loadUserMediaOnRecord) {
          loadUserMedia();
        }
      } else if (options.loadUserMediaOnRecord) {
        loadUserMedia();
      }
      built = true;
    }
  };
  this.isPaused = function () {
    return userMedia && userMedia.isPaused() && !loop.isRunning();
  };
  this.isRecording = function () {
    /*
     * checking for stream.destroyed needed since
     * https://github.com/binarykitchen/videomail.io/issues/296
     */
    return loop && loop.isRunning() && !this.isPaused() && !isNotifying() && stream && !stream.destroyed;
  };
  this.hide = function () {
    if (!isHidden()) {
      recorderElement && (0, _hidden.default)(recorderElement, true);
      clearUserMediaTimeout();
      clearRetryTimeout();
    }
  };
  this.isUnloaded = function () {
    return unloaded;
  };

  /*
   * these two return the true dimensions of the webcam area.
   * needed because on mobiles they might be different.
   */

  this.getRecorderWidth = function (responsive) {
    if (userMedia && userMedia.hasVideoWidth()) {
      return userMedia.getRawWidth(responsive);
    } else if (responsive && options.hasDefinedWidth()) {
      return this.limitWidth(options.video.width);
    }
  };
  this.getRecorderHeight = function (responsive, useBoundingClientRect) {
    if (userMedia && useBoundingClientRect) {
      return recorderElement.getBoundingClientRect().height;
    } else if (userMedia) {
      return userMedia.getRawHeight(responsive);
    } else if (responsive && options.hasDefinedHeight()) {
      return this.calculateHeight(responsive);
    }
  };
  function getRatio() {
    var ratio;
    if (userMedia) {
      var userMediaVideoWidth = userMedia.getVideoWidth();

      // avoid division by zero
      if (userMediaVideoWidth < 1) {
        // use as a last resort fallback computation (needed for safari 11)
        ratio = visuals.getRatio();
      } else {
        ratio = userMedia.getVideoHeight() / userMediaVideoWidth;
      }
    } else {
      ratio = options.getRatio();
    }
    return ratio;
  }
  this.calculateWidth = function (responsive) {
    var videoHeight;
    if (userMedia) {
      videoHeight = userMedia.getVideoHeight();
    } else if (recorderElement) {
      videoHeight = recorderElement.videoHeight || recorderElement.height;
    }
    return visuals.calculateWidth({
      responsive: responsive,
      ratio: getRatio(),
      videoHeight: videoHeight
    });
  };
  this.calculateHeight = function (responsive) {
    var videoWidth;
    if (userMedia) {
      videoWidth = userMedia.getVideoWidth();
    } else if (recorderElement) {
      videoWidth = recorderElement.videoWidth || recorderElement.width;
    }
    return visuals.calculateHeight({
      responsive: responsive,
      ratio: getRatio(),
      videoWidth: videoWidth
    });
  };
  this.getRawVisualUserMedia = function () {
    return recorderElement;
  };
  this.isConnected = function () {
    return connected;
  };
  this.isConnecting = function () {
    return connecting;
  };
  this.limitWidth = function (width) {
    return visuals.limitWidth(width);
  };
  this.limitHeight = function (height) {
    return visuals.limitHeight(height);
  };
  this.isUserMediaLoaded = function () {
    return userMediaLoaded;
  };
};
(0, _inherits.default)(Recorder, _eventEmitter.default);
var _default = exports.default = Recorder;

}).call(this)}).call(this,_dereq_("buffer").Buffer)
},{"../../constants":118,"../../events":119,"../../util/browser":124,"../../util/eventEmitter":126,"../../util/humanize":127,"../../util/pretty":129,"../../util/videomailError":131,"./userMedia":147,"@babel/runtime/helpers/interopRequireDefault":4,"animitter":13,"buffer":18,"canvas-to-buffer":21,"deepmerge":28,"hidden":61,"hyperscript":63,"inherits":66,"safe-json-stringify":99,"websocket-stream":113}],146:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _addEventlistenerWithOptions = _interopRequireDefault(_dereq_("add-eventlistener-with-options"));
var _hidden = _interopRequireDefault(_dereq_("hidden"));
var _hyperscript = _interopRequireDefault(_dereq_("hyperscript"));
var _inherits = _interopRequireDefault(_dereq_("inherits"));
var _iphoneInlineVideo = _interopRequireDefault(_dereq_("iphone-inline-video"));
var _events = _interopRequireDefault(_dereq_("../../events"));
var _browser = _interopRequireDefault(_dereq_("../../util/browser"));
var _eventEmitter = _interopRequireDefault(_dereq_("../../util/eventEmitter"));
var Replay = function Replay(parentElement, options) {
  _eventEmitter.default.call(this, options, "Replay");
  var self = this;
  var browser = new _browser.default(options);
  var debug = options.debug;
  var built;
  var replayElement;
  var videomail;
  function buildElement() {
    var replayParentElement = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : parentElement;
    replayElement = (0, _hyperscript.default)("video.".concat(options.selectors.replayClass));
    if (typeof replayParentElement === "string") {
      replayParentElement = document.getElementById(replayParentElement);
      if (!replayParentElement) {
        throw new Error("No replay parent element container with ID ".concat(replayParentElement, " found."));
      }
    }
    replayParentElement.appendChild(replayElement);
  }
  function isStandalone() {
    return parentElement.constructor.name === "HTMLDivElement";
  }
  function copyAttributes(newVideomail) {
    var attributeContainer;
    Object.keys(newVideomail).forEach(function (attribute) {
      attributeContainer = parentElement.querySelector(".".concat(attribute));
      if (attributeContainer) {
        var empty = !attributeContainer.innerHTML || attributeContainer.innerHTML.length < 1;

        // Do not overwrite when already set before, e
        // e.g. with a React component adding links to the body
        if (empty) {
          attributeContainer.innerHTML = newVideomail[attribute];
        }
      }
    });
  }
  function correctDimensions(options) {
    var height, width;
    if (videomail && videomail.playerWidth) {
      width = videomail.playerWidth;
    } else if (parentElement.calculateWidth) {
      width = parentElement.calculateWidth(options);
    }
    if (videomail && videomail.playerHeight) {
      height = videomail.playerHeight;
    } else if (parentElement.calculateHeight) {
      height = parentElement.calculateHeight(options);
    }
    if (width > 0) {
      replayElement.style.width = "".concat(width, "px");
    } else {
      replayElement.style.width = "auto";
    }
    if (height > 0) {
      replayElement.style.height = "".concat(height, "px");
    } else {
      replayElement.style.height = "auto";
    }
  }
  this.setVideomail = function (newVideomail) {
    videomail = newVideomail;
    if (videomail) {
      if (videomail.mp4) {
        this.setMp4Source(videomail.mp4);
      }
      if (videomail.webm) {
        this.setWebMSource(videomail.webm);
      }
      if (videomail.poster) {
        replayElement.setAttribute("poster", videomail.poster);
      }
      copyAttributes(videomail);
    }
    var hasAudio = videomail && videomail.recordingStats && videomail.recordingStats.sampleRate > 0;
    this.show(videomail && videomail.width, videomail && videomail.height, hasAudio);
  };
  this.show = function (recorderWidth, recorderHeight, hasAudio) {
    if (!replayElement) {
      return;
    }
    if (self.isShown()) {
      // Skip, already shown
      return;
    }
    debug("Replay: show()");
    if (videomail) {
      correctDimensions({
        responsive: true,
        // beware that recorderWidth and recorderHeight can be null sometimes
        videoWidth: recorderWidth || replayElement.videoWidth,
        videoHeight: recorderHeight || replayElement.videoHeight
      });
    }
    (0, _hidden.default)(replayElement, false);

    // parent element can be any object, be careful!
    if (parentElement) {
      if (parentElement.style) {
        (0, _hidden.default)(parentElement, false);
      } else if (parentElement.show) {
        parentElement.show();
      }
    }
    if (hasAudio) {
      /*
       * https://github.com/binarykitchen/videomail-client/issues/115
       * do not set mute to false as this will mess up. just do not mention this attribute at all
       */
      replayElement.setAttribute("volume", 1);
    } else if (!options.isAudioEnabled()) {
      replayElement.setAttribute("muted", true);
    }

    /*
     * this must be called after setting the sources and when becoming visible
     * see https://github.com/bfred-it/iphone-inline-video/issues/16
     */
    _iphoneInlineVideo.default && (0, _iphoneInlineVideo.default)(replayElement, {
      iPad: true
    });

    // this forces to actually fetch the videos from the server
    replayElement.load();
    if (!videomail) {
      replayElement.addEventListener("canplaythrough", function () {
        self.emit(_events.default.PREVIEW_SHOWN);
      }, {
        once: true
      });
    } else {
      replayElement.addEventListener("canplaythrough", function () {
        self.emit(_events.default.REPLAY_SHOWN);
      }, {
        once: true
      });
    }
  };
  this.build = function (replayParentElement) {
    debug("Replay: build (".concat(replayParentElement ? "replayParentElement=\"".concat(replayParentElement, "\"") : "", ")"));
    replayElement = parentElement.querySelector("video.".concat(options.selectors.replayClass));
    if (!replayElement) {
      buildElement(replayParentElement);
    }
    this.hide();
    replayElement.setAttribute("autoplay", true);
    replayElement.setAttribute("autostart", true);
    replayElement.setAttribute("autobuffer", true);
    replayElement.setAttribute("playsinline", true);
    replayElement.setAttribute("webkit-playsinline", "webkit-playsinline");
    replayElement.setAttribute("controls", "controls");
    replayElement.setAttribute("preload", "auto");
    if (!built) {
      if (!isStandalone()) {
        this.on(_events.default.PREVIEW, function (_key, recorderWidth, recorderHeight) {
          self.show(recorderWidth, recorderHeight);
        });
      }

      /*
       * makes use of passive option automatically for better performance
       * https://www.npmjs.com/package/add-eventlistener-with-options
       */
      (0, _addEventlistenerWithOptions.default)(replayElement, "touchstart", function (e) {
        try {
          e && e.preventDefault();
        } catch (exc) {
          /*
           * ignore errors like
           * Unable to preventDefault inside passive event listener invocation.
           */
        }
        if (this.paused) {
          play();
        } else {
          pause();
        }
      });
      replayElement.onclick = function (e) {
        e && e.preventDefault();
        if (this.paused) {
          play();
        } else {
          pause();
        }
      };
    }
    built = true;
    debug("Replay: built.");
  };
  this.unload = function () {
    debug("Replay: unload()");
    self.removeAllListeners();
    replayElement.remove();
    replayElement = undefined;
    videomail = undefined;
    built = false;
  };
  this.getVideoSource = function (type) {
    if (!replayElement) {
      return;
    }
    var sources = replayElement.getElementsByTagName("source");
    var l = sources && sources.length;
    var videoType = "video/".concat(type);
    var source;
    if (l) {
      var i;
      for (i = 0; i < l && !source; i++) {
        if (sources[i].getAttribute("type") === videoType) {
          source = sources[i];
        }
      }
    }
    return source;
  };
  function setVideoSource(type, src, bustCache) {
    var source = self.getVideoSource(type);
    if (src && bustCache) {
      src += "?".concat(Date.now());
    }
    if (!source) {
      if (src) {
        var fps = options.video.fps;

        // Ensure it's greater than the frame duration itself
        var t = 2 * (1 / fps);
        source = (0, _hyperscript.default)("source", {
          /*
           * Ensures HTML video thumbnail turns up on iOS, see
           * https://muffinman.io/blog/hack-for-ios-safari-to-display-html-video-thumbnail/
           */
          src: "".concat(src, "#t=").concat(t),
          type: "video/".concat(type)
        });
        replayElement.appendChild(source);
      }
    } else if (src) {
      source.setAttribute("src", src);
    } else {
      replayElement.removeChild(source);
    }
  }
  this.setMp4Source = function (src, bustCache) {
    setVideoSource("mp4", src, bustCache);
  };
  this.setWebMSource = function (src, bustCache) {
    setVideoSource("webm", src, bustCache);
  };
  this.getVideoType = function () {
    return browser.getVideoType(replayElement);
  };
  function pause(cb) {
    /*
     * avoids race condition, inspired by
     * http://stackoverflow.com/questions/36803176/how-to-prevent-the-play-request-was-interrupted-by-a-call-to-pause-error
     */
    setTimeout(function () {
      try {
        if (replayElement) {
          replayElement.pause();
        }
      } catch (exc) {
        // just ignore, see https://github.com/binarykitchen/videomail.io/issues/386
        options.logger.warn(exc);
      }
      cb && cb();
    }, 15);
  }
  function play() {
    if (replayElement && replayElement.play) {
      var p;
      try {
        p = replayElement.play();
      } catch (exc) {
        /*
         * this in the hope to catch InvalidStateError, see
         * https://github.com/binarykitchen/videomail-client/issues/149
         */
        options.logger.warn("Caught replay exception:", exc);
      }
      if (p && typeof Promise !== "undefined" && p instanceof Promise) {
        p.catch(function (reason) {
          options.logger.warn("Caught pending replay promise exception: %s", reason);
        });
      }
    }
  }
  this.reset = function (cb) {
    // pause video to make sure it won't consume any memory
    pause(function () {
      if (replayElement) {
        self.setMp4Source(null);
        self.setWebMSource(null);
      }
      cb && cb();
    });
  };
  this.hide = function () {
    if (isStandalone()) {
      (0, _hidden.default)(parentElement, true);
    } else {
      replayElement && (0, _hidden.default)(replayElement, true);
    }
  };
  this.isShown = function () {
    return replayElement && !(0, _hidden.default)(replayElement);
  };
  this.getParentElement = function () {
    return parentElement;
  };
};
(0, _inherits.default)(Replay, _eventEmitter.default);
var _default = exports.default = Replay;

},{"../../events":119,"../../util/browser":124,"../../util/eventEmitter":126,"@babel/runtime/helpers/interopRequireDefault":4,"add-eventlistener-with-options":12,"hidden":61,"hyperscript":63,"inherits":66,"iphone-inline-video":69}],147:[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _hyperscript = _interopRequireDefault(_dereq_("hyperscript"));
var _safeJsonStringify = _interopRequireDefault(_dereq_("safe-json-stringify"));
var _events = _interopRequireDefault(_dereq_("./../../events"));
var _audioRecorder = _interopRequireDefault(_dereq_("./../../util/audioRecorder"));
var _browser = _interopRequireDefault(_dereq_("./../../util/browser"));
var _eventEmitter = _interopRequireDefault(_dereq_("./../../util/eventEmitter"));
var _mediaEvents = _interopRequireDefault(_dereq_("./../../util/mediaEvents"));
var _pretty = _interopRequireDefault(_dereq_("./../../util/pretty"));
var _videomailError = _interopRequireDefault(_dereq_("./../../util/videomailError"));
var EVENT_ASCII = "|—O—|";
function _default(recorder, options) {
  _eventEmitter.default.call(this, options, "UserMedia");
  var rawVisualUserMedia = recorder && recorder.getRawVisualUserMedia();
  var browser = new _browser.default(options);
  var self = this;
  var paused = false;
  var record = false;
  var audioRecorder;
  var currentVisualStream;
  function attachMediaStream(stream) {
    currentVisualStream = stream;
    if (typeof rawVisualUserMedia.srcObject !== "undefined") {
      rawVisualUserMedia.srcObject = stream;
    } else if (typeof rawVisualUserMedia.src !== "undefined") {
      var URL = window.URL || window.webkitURL;
      rawVisualUserMedia.src = URL.createObjectURL(stream) || stream;
    } else {
      throw _videomailError.default.create("Error attaching stream to element.", "Contact the developer about this", options);
    }
  }
  function setVisualStream(localMediaStream) {
    if (localMediaStream) {
      attachMediaStream(localMediaStream);
    } else {
      rawVisualUserMedia.removeAttribute("srcObject");
      rawVisualUserMedia.removeAttribute("src");
      currentVisualStream = null;
    }
  }
  function getVisualStream() {
    if (rawVisualUserMedia.mozSrcObject) {
      return rawVisualUserMedia.mozSrcObject;
    } else if (rawVisualUserMedia.srcObject) {
      return rawVisualUserMedia.srcObject;
    }
    return currentVisualStream;
  }
  function hasEnded() {
    if (rawVisualUserMedia.ended) {
      return rawVisualUserMedia.ended;
    }
    var visualStream = getVisualStream();
    return visualStream && visualStream.ended;
  }
  function hasInvalidDimensions() {
    if (rawVisualUserMedia.videoWidth && rawVisualUserMedia.videoWidth < 3 || rawVisualUserMedia.height && rawVisualUserMedia.height < 3) {
      return true;
    }
  }
  function getTracks(localMediaStream) {
    var tracks;
    if (localMediaStream && localMediaStream.getTracks) {
      tracks = localMediaStream.getTracks();
    }
    return tracks;
  }
  function getVideoTracks(localMediaStream) {
    var videoTracks;
    if (localMediaStream && localMediaStream.getVideoTracks) {
      videoTracks = localMediaStream.getVideoTracks();
    }
    return videoTracks;
  }
  function getFirstVideoTrack(localMediaStream) {
    var videoTracks = getVideoTracks(localMediaStream);
    var videoTrack;
    if (videoTracks && videoTracks[0]) {
      videoTrack = videoTracks[0];
    }
    return videoTrack;
  }
  function logEvent(event, params) {
    options.debug("UserMedia: ...", EVENT_ASCII, "event", event, (0, _safeJsonStringify.default)(params));
  }
  function isPromise(anything) {
    return anything && typeof Promise !== "undefined" && anything instanceof Promise;
  }
  function outputEvent(e) {
    logEvent(e.type, {
      readyState: rawVisualUserMedia.readyState
    });

    // remove myself
    rawVisualUserMedia.removeEventListener && rawVisualUserMedia.removeEventListener(e.type, outputEvent);
  }
  this.unloadRemainingEventListeners = function () {
    options.debug("UserMedia: unloadRemainingEventListeners()");
    _mediaEvents.default.forEach(function (eventName) {
      rawVisualUserMedia.removeEventListener(eventName, outputEvent);
    });
  };
  this.init = function (localMediaStream, videoCallback, audioCallback, endedEarlyCallback) {
    var params = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
    this.stop(localMediaStream, {
      aboutToInitialize: true,
      switchingFacingMode: params.switchingFacingMode
    });
    var onPlayReached = false;
    var onLoadedMetaDataReached = false;
    var playingPromiseReached = false;
    if (options && options.isAudioEnabled()) {
      audioRecorder || (audioRecorder = new _audioRecorder.default(this, options));
    }
    function audioRecord() {
      self.removeListener(_events.default.SENDING_FIRST_FRAME, audioRecord);
      audioRecorder && audioRecorder.record(audioCallback);
    }
    function unloadAllEventListeners() {
      options.debug("UserMedia: unloadAllEventListeners()");
      self.unloadRemainingEventListeners();
      self.removeListener(_events.default.SENDING_FIRST_FRAME, audioRecord);
      rawVisualUserMedia.removeEventListener && rawVisualUserMedia.removeEventListener("play", onPlay);
      rawVisualUserMedia.removeEventListener && rawVisualUserMedia.removeEventListener("loadedmetadata", onLoadedMetaData);
    }
    function play() {
      // Resets the media element and restarts the media resource. Any pending events are discarded.
      try {
        rawVisualUserMedia.load();

        /*
         * fixes https://github.com/binarykitchen/videomail.io/issues/401
         * see https://github.com/MicrosoftEdge/Demos/blob/master/photocapture/scripts/demo.js#L27
         */
        if (rawVisualUserMedia.paused) {
          options.debug("UserMedia: play()", "media.readyState=".concat(rawVisualUserMedia.readyState), "media.paused=".concat(rawVisualUserMedia.paused), "media.ended=".concat(rawVisualUserMedia.ended), "media.played=".concat((0, _pretty.default)(rawVisualUserMedia.played)));
          var p;
          try {
            p = rawVisualUserMedia.play();
          } catch (exc) {
            /*
             * this in the hope to catch InvalidStateError, see
             * https://github.com/binarykitchen/videomail-client/issues/149
             */
            options.logger.warn("Caught raw usermedia play exception:", exc);
          }

          /*
           * using the promise here just experimental for now
           * and this to catch any weird errors early if possible
           */
          if (isPromise(p)) {
            p.then(function () {
              if (!playingPromiseReached) {
                options.debug("UserMedia: play promise successful. Playing now.");
                playingPromiseReached = true;
              }
            }).catch(function (reason) {
              /*
               * promise can be interrupted, i.E. when switching tabs
               * and promise can get resumed when switching back to tab, hence
               * do not treat this like an error
               */
              options.logger.warn("Caught pending usermedia promise exception: %s", reason.toString());
            });
          }
        }
      } catch (exc) {
        unloadAllEventListeners();
        endedEarlyCallback(exc);
      }
    }
    function fireCallbacks() {
      var readyState = rawVisualUserMedia.readyState;

      // ready state, see https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/readyState
      options.debug("UserMedia: fireCallbacks(" + "readyState=".concat(readyState, ", ") + "onPlayReached=".concat(onPlayReached, ", ") + "onLoadedMetaDataReached=".concat(onLoadedMetaDataReached, ")"));
      if (onPlayReached && onLoadedMetaDataReached) {
        videoCallback();
        if (audioRecorder && audioCallback) {
          try {
            audioRecorder.init(localMediaStream);
            self.on(_events.default.SENDING_FIRST_FRAME, audioRecord);
          } catch (exc) {
            unloadAllEventListeners();
            endedEarlyCallback(exc);
          }
        }
      }
    }
    function onPlay() {
      try {
        logEvent("play", {
          readyState: rawVisualUserMedia.readyState,
          audio: options.isAudioEnabled(),
          width: rawVisualUserMedia.width,
          height: rawVisualUserMedia.height,
          videoWidth: rawVisualUserMedia.videoWidth,
          videoHeight: rawVisualUserMedia.videoHeight
        });
        rawVisualUserMedia.removeEventListener && rawVisualUserMedia.removeEventListener("play", onPlay);
        if (hasEnded() || hasInvalidDimensions()) {
          endedEarlyCallback(_videomailError.default.create("Already busy", "Probably another browser window is using your webcam?", options));
        } else {
          onPlayReached = true;
          fireCallbacks();
        }
      } catch (exc) {
        unloadAllEventListeners();
        endedEarlyCallback(exc);
      }
    }

    // player modifications to perform that must wait until `loadedmetadata` has been triggered
    function onLoadedMetaData() {
      logEvent("loadedmetadata", {
        readyState: rawVisualUserMedia.readyState,
        paused: rawVisualUserMedia.paused,
        width: rawVisualUserMedia.width,
        height: rawVisualUserMedia.height,
        videoWidth: rawVisualUserMedia.videoWidth,
        videoHeight: rawVisualUserMedia.videoHeight
      });
      rawVisualUserMedia.removeEventListener && rawVisualUserMedia.removeEventListener("loadedmetadata", onLoadedMetaData);
      if (!hasEnded() && !hasInvalidDimensions()) {
        self.emit(_events.default.LOADED_META_DATA);

        /*
         * for android devices, we cannot call play() unless meta data has been loaded!
         * todo consider removing that if it's not the case anymore (for better performance)
         */
        if (browser.isAndroid()) {
          play();
        }
        onLoadedMetaDataReached = true;
        fireCallbacks();
      }
    }
    try {
      var videoTrack = getFirstVideoTrack(localMediaStream);
      if (!videoTrack) {
        options.debug("UserMedia: detected (but no video tracks exist");
      } else if (!videoTrack.enabled) {
        throw _videomailError.default.create("Webcam is disabled", "The video track seems to be disabled. Enable it in your system.", options);
      } else {
        var description;
        if (videoTrack.label && videoTrack.label.length > 0) {
          description = videoTrack.label;
        }
        description += " with enabled=".concat(videoTrack.enabled);
        description += ", muted=".concat(videoTrack.muted);
        description += ", remote=".concat(videoTrack.remote);
        description += ", readyState=".concat(videoTrack.readyState);
        description += ", error=".concat(videoTrack.error);
        options.debug("UserMedia: ".concat(videoTrack.kind, " detected."), description || "");
      }

      // very useful i think, so leave this and just use options.debug()
      var heavyDebugging = true;
      if (heavyDebugging) {
        _mediaEvents.default.forEach(function (eventName) {
          rawVisualUserMedia.addEventListener(eventName, outputEvent, false);
        });
      }
      rawVisualUserMedia.addEventListener("loadedmetadata", onLoadedMetaData);
      rawVisualUserMedia.addEventListener("play", onPlay);

      /*
       * experimental, not sure if this is ever needed/called? since 2 apr 2017
       * An error occurs while fetching the media data.
       * Error can be an object with the code MEDIA_ERR_NETWORK or higher.
       * networkState equals either NETWORK_EMPTY or NETWORK_IDLE, depending on when the download was aborted.
       */
      rawVisualUserMedia.addEventListener("error", function (err) {
        options.logger.warn("Caught video element error event: %s", (0, _pretty.default)(err));
      });
      setVisualStream(localMediaStream);
      play();
    } catch (exc) {
      self.emit(_events.default.ERROR, exc);
    }
  };
  this.isReady = function () {
    return Boolean(rawVisualUserMedia.src);
  };
  this.stop = function (visualStream) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    try {
      // do not stop "too much" when going to initialize anyway
      var aboutToInitialize = params.aboutToInitialize;
      var switchingFacingMode = params.switchingFacingMode;
      if (!aboutToInitialize) {
        if (!visualStream) {
          visualStream = getVisualStream();
        }
        var tracks = getTracks(visualStream);
        var newStopApiFound = false;
        if (tracks) {
          tracks.forEach(function (track) {
            if (track.stop) {
              newStopApiFound = true;
              track.stop();
            }
          });
        }

        // will probably become obsolete in one year (after june 2017)
        !newStopApiFound && visualStream && visualStream.stop && visualStream.stop();
        setVisualStream(null);
        audioRecorder && audioRecorder.stop();
        audioRecorder = null;
      }

      /*
       * don't have to reset these states when just switching camera
       * while still recording or pausing
       */
      if (!switchingFacingMode) {
        paused = record = false;
      }
    } catch (exc) {
      self.emit(_events.default.ERROR, exc);
    }
  };
  this.createCanvas = function () {
    return (0, _hyperscript.default)("canvas", {
      width: this.getRawWidth(true),
      height: this.getRawHeight(true)
    });
  };
  this.getVideoHeight = function () {
    return rawVisualUserMedia.videoHeight;
  };
  this.getVideoWidth = function () {
    return rawVisualUserMedia.videoWidth;
  };
  this.hasVideoWidth = function () {
    return this.getVideoWidth() > 0;
  };
  this.getRawWidth = function (responsive) {
    var rawWidth = this.getVideoWidth();
    var widthDefined = options.hasDefinedWidth();
    if (widthDefined || options.hasDefinedHeight()) {
      if (!responsive && widthDefined) {
        rawWidth = options.video.width;
      } else {
        rawWidth = recorder.calculateWidth(responsive);
      }
    }
    if (responsive) {
      rawWidth = recorder.limitWidth(rawWidth);
    }
    return rawWidth;
  };
  this.getRawHeight = function (responsive) {
    var rawHeight;
    if (options.hasDefinedDimension()) {
      rawHeight = recorder.calculateHeight(responsive);
      if (rawHeight < 1) {
        throw _videomailError.default.create("Bad dimensions", "Calculated raw height cannot be less than 1!", options);
      }
    } else {
      rawHeight = this.getVideoHeight();
      if (rawHeight < 1) {
        throw _videomailError.default.create("Bad dimensions", "Raw video height from DOM element cannot be less than 1!", options);
      }
    }
    if (responsive) {
      rawHeight = recorder.limitHeight(rawHeight);
    }
    return rawHeight;
  };
  this.getRawVisuals = function () {
    return rawVisualUserMedia;
  };
  this.pause = function () {
    paused = true;
  };
  this.isPaused = function () {
    return paused;
  };
  this.resume = function () {
    paused = false;
  };
  this.record = function () {
    record = true;
  };
  this.isRecording = function () {
    return record;
  };
  this.getAudioSampleRate = function () {
    if (audioRecorder) {
      return audioRecorder.getSampleRate();
    }
    return -1;
  };
  this.getCharacteristics = function () {
    return {
      audioSampleRate: this.getAudioSampleRate(),
      muted: rawVisualUserMedia && rawVisualUserMedia.muted,
      width: rawVisualUserMedia && rawVisualUserMedia.width,
      height: rawVisualUserMedia && rawVisualUserMedia.height,
      videoWidth: rawVisualUserMedia && rawVisualUserMedia.videoWidth,
      videoHeight: rawVisualUserMedia && rawVisualUserMedia.videoHeight
    };
  };
}

},{"./../../events":119,"./../../util/audioRecorder":123,"./../../util/browser":124,"./../../util/eventEmitter":126,"./../../util/mediaEvents":128,"./../../util/pretty":129,"./../../util/videomailError":131,"@babel/runtime/helpers/interopRequireDefault":4,"hyperscript":63,"safe-json-stringify":99}],148:[function(_dereq_,module,exports){
"use strict";

module.exports = '@-webkit-keyframes blink{0%{opacity:.9}35%{opacity:.9}50%{opacity:.1}85%{opacity:.1}to{opacity:.9}}@keyframes blink{0%{opacity:.9}35%{opacity:.9}50%{opacity:.1}85%{opacity:.1}to{opacity:.9}}.IIV::-webkit-media-controls-play-button,.IIV::-webkit-media-controls-start-playback-button{opacity:0;pointer-events:none;width:5px}.videomail .visuals{position:relative}.videomail .visuals video.replay{height:100%;width:100%}.videomail .countdown,.videomail .pausedHeader,.videomail .pausedHint,.videomail .recordNote,.videomail .recordTimer{height:auto;margin:0}.videomail .countdown,.videomail .facingMode,.videomail .paused,.videomail .recordNote,.videomail .recordTimer,.videomail noscript{position:absolute;z-index:100}.videomail .countdown,.videomail .pausedHeader,.videomail .pausedHint,.videomail .recordNote,.videomail .recordTimer,.videomail noscript{font-weight:700}.videomail .countdown,.videomail .paused,.videomail noscript{top:50%;-webkit-transform:translateY(-50%);-ms-transform:translateY(-50%);transform:translateY(-50%);width:100%}.videomail .countdown,.videomail .pausedHeader,.videomail .pausedHint{letter-spacing:4px;text-align:center;text-shadow:-2px 0 #fff,0 2px #fff,2px 0 #fff,0 -2px #fff}.videomail .countdown,.videomail .pausedHeader{font-size:460%;opacity:.9}.videomail .pausedHint{font-size:150%}.videomail .facingMode{background:rgba(30,30,30,.5);border:none;bottom:.6em;color:hsla(0,0%,96%,.9);font-family:monospace;font-size:1.2em;outline:none;padding:.1em .3em;right:.7em;-webkit-transition:all .2s ease;transition:all .2s ease;z-index:10}.videomail .facingMode:hover{background:rgba(50,50,50,.7);cursor:pointer}.videomail .recordNote,.videomail .recordTimer{background:hsla(0,0%,4%,.8);color:#00d814;font-family:monospace;opacity:.9;padding:.3em .4em;right:.7em;-webkit-transition:all 1s ease;transition:all 1s ease}.videomail .recordNote.near,.videomail .recordTimer.near{color:#eb9369}.videomail .recordNote.nigh,.videomail .recordTimer.nigh{color:#ea4b2a}.videomail .recordTimer{top:.7em}.videomail .recordNote{top:3.6em}.videomail .recordNote:before{-webkit-animation:blink 1s infinite;animation:blink 1s infinite;content:"REC"}.videomail .notifier{-webkit-box-sizing:border-box;box-sizing:border-box;height:100%;overflow:hidden}.videomail .radioGroup{display:block}.videomail video{margin-bottom:0}.videomail video.userMedia{background-color:rgba(50,50,50,.1)}';

},{}],"videomail-client":[function(_dereq_,module,exports){
"use strict";

var _interopRequireDefault = _dereq_("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _client = _interopRequireDefault(_dereq_("./client"));
var _standardize = _interopRequireDefault(_dereq_("./util/standardize"));
// Ensures Videomail functionality is not broken on exotic browsers with shims.
(0, _standardize.default)(window, navigator);
var _default = exports.default = _client.default;

},{"./client":117,"./util/standardize":130,"@babel/runtime/helpers/interopRequireDefault":4}]},{},["videomail-client"])("videomail-client")
});

(function(e){if("function"==typeof bootstrap)bootstrap("pinchzoom",e);else if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else if("undefined"!=typeof ses){if(!ses.ok())return;ses.makePinchZoom=e}else"undefined"!=typeof window?window.PinchZoom=e():global.PinchZoom=e()})(function(){var define,ses,bootstrap,module,exports;
return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function(defaults, options) {

	var obj = {},
		i;

	options = Object(options);

	for (i in defaults) {
		if (defaults.hasOwnProperty(i)) {
			obj[i] = (options[i] === undefined) ? defaults[i] : options[i];
		}
	}

	return obj;
};
},{}],2:[function(require,module,exports){
module.exports = Listeners;

function Listeners(el, obj) {
    this.el        = el;
    this.obj       = obj;
    this._bindings = {};
}
Listeners.prototype.bind = function(type, method) {
	this.el.addEventListener(type, this.addBinding(type, method));
};
Listeners.prototype.unbind = function(type, method) {
	this.el.removeEventListener(type, this._bindings[type][method]);
};
Listeners.prototype.addBinding = function(type, method) {
	this._bindings[type] = this._bindings[type] || {};
	this._bindings[type][method] = this.obj[method].bind(this.obj);
	return this._bindings[type][method];
};
Listeners.prototype.unbindAll = function() {
	var type, method;
	for (type in this._bindings) {
		for (method in this._bindings[type]) {
			this.unbind(type, method);
		}
	}
};

},{}],3:[function(require,module,exports){
// Determine whether multitouch is supported.
// There appears to be no nice programmatic way to detect this.  Devices which support multitouch include
// iOS, Android 3.0+, PlayBook, but not WebOS.  Across these devices it therefore tracks SVG support
// accurately - use this test, which might be overly generous on future devices, but works on current devices.


module.exports = require('./track-pointer-events') ? (window.navigator.msMaxTouchPoints && window.navigator.msMaxTouchPoints > 1) :
							(require('./track-touch-events') && document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#BasicStructure', '1.1'));

},{"./track-pointer-events":5,"./track-touch-events":6}],4:[function(require,module,exports){
/**
 * PinchZoom: Support pinching and zooming on an element.
 *
 * @codingstandard ftlabs-jsv2
 * @copyright The Financial Times Limited [All rights reserved]
 */

/*jshint node:true*/

'use strict';

module.exports = PinchZoom;
module.exports.PinchZoom = PinchZoom;


/**
 * Master constructor for a pinch/zoom handler on an image.
 * By default, the parent element will be used as the container in which to constrain the image;
 * specify this.containerNode to override this.
 *
 * Images will be initially displayed at to-fit size, using a scale transform for speed.
 *
 * TODO:RB:20111130: While this could be extended to other elements using a 3d transform (scale),
 * rendering within that element would be blurry, so doesn't seem worth implementing at the moment.
 *
 * TODO:RB:20111201: Additional elements - pinch-zoom instruction and zoom controls - rely on parent
 * page to style them...
 */
function PinchZoom(image, containerNode, options) {

	var defaultConfig = {
            maxScale:           2.5,
            hardScaleLimit:     false,
            stepZoomIncrement:  0.25,
            animationDuration:  0.5,   // (seconds)
            zoomControlClass:   'pinchzoomcontrol',
            zoomControlMessage: 'Drag image to pan; pinch to zoom',
			zoomControlText: {
				zoomin:  '+',
				zoomout: '-'
			}
		},

		Listeners = require('./event-listeners'),

		cssPrefix = require('./vendor-css-prefix');

	// Ensure this is an instantiated object, enabling eg. require('pinchzoom')(image, ...)
	if (!(this instanceof PinchZoom)) return new PinchZoom(image, containerNode, options);

	if (!(image instanceof HTMLImageElement) || !image.parentNode) {
		throw new TypeError('PinchZoom requires an Image node which is inserted in the DOM');
	}

	this.config = require('./defaults')(defaultConfig, options);
	if (!this.config.zoomControlText || !this.config.zoomControlText.zoomin || !this.config.zoomControlText.zoomout) {
		throw new TypeError('zoomControlText must be an object in the form {zoomin: "+", zoomout: "-"}.');
	}

	this.cssTransform                = cssPrefix.transform;
	this.cssTransformOrigin          = this.cssTransform + 'Origin';
	this.cssTransitionProperty       = cssPrefix.transition + 'Property';
	this.cssTransitionTimingFunction = cssPrefix.transition + 'TimingFunction';
	this.cssTransitionDuration       = cssPrefix.transition + 'Duration';
	this.trackPointerEvents          = require('./track-pointer-events');
	this.multitouchSupport           = require('./multitouch-support');

	this.image               = image;
	this.imageStyle          = this.image.style;
	this.containerNode       = containerNode || this.image.parentNode;
	this.listeners           = new Listeners(this.containerNode, this);
	this.documentListeners   = new Listeners(document, this);

	this.imageDimensions     = { w: this.image.naturalWidth, h: this.image.naturalHeight };
	this.offset              = { x: 0, y: 0, savedX: 0, savedY: 0 };
	this.roundFactor         = window.devicePixelRatio || 1;

	this.activeInputs        = { length: 0 };
	this.allowClickEvent     = true;
	this.trackingInput       = false;
	this.capturedInputs      = {};

	this.animationTimeout    = false;
	this.mouseWheelThrottle  = false;

	// Set and reset base styles on the image
	this.imageStyle.position                     = 'absolute';
	this.imageStyle.top                          = 0;
	this.imageStyle.left                         = 0;
	this.imageStyle.height                       = 'auto';
	this.imageStyle.width                        = 'auto';
	this.imageStyle.maxWidth                     = 'none';
	this.imageStyle.maxHeight                    = 'none';
	this.imageStyle[this.cssTransformOrigin]          = '0 0';
	this.imageStyle[this.cssTransitionProperty]       = 'scale, translate';
	this.imageStyle[this.cssTransitionTimingFunction] = 'ease-out';

	this.update();

	if (this.trackPointerEvents) {
		this.listeners.bind('MSPointerDown', 'onPointerDown');
		this.listeners.bind('MSPointerMove', 'onPointerMove');
		this.listeners.bind('MSPointerUp', 'onPointerUp');
		this.listeners.bind('MSPointerCancel', 'onPointerCancel');
	} else if (this.multitouchSupport) {
		this.listeners.bind('touchstart', 'onTouchStart');
		this.listeners.bind('touchmove', 'onTouchMove');
		this.listeners.bind('touchend', 'onTouchEnd');
		this.listeners.bind('touchcancel', 'onTouchCancel');
	} else {
		this.listeners.bind('mousewheel', 'onMouseWheel');
		this.listeners.bind('DOMMouseScroll', 'onMouseWheel');
		this.listeners.bind('mousedown', 'onMouseDown');
	}
	this.listeners.bind('click', 'onClick');
}


/* TOUCH INPUT HANDLERS */

PinchZoom.prototype.onTouchStart = function(event) {
	var i, l, eachTouch, newIdentifier;

	// Ignore touches past the second
	if (this.activeInputs.length >= 2) {
		return;
	}

	// Record initial event details
	for (i = 0, l = event.targetTouches.length; i < l; i++) {
		eachTouch = event.targetTouches[i];
		if (this.activeInputs.length >= 2 || this.activeInputs[eachTouch.identifier] !== undefined) {
			continue;
		}

		this.activeInputs[eachTouch.identifier] = {
			originX: eachTouch.clientX,
			originY: eachTouch.clientY,
			lastX: false,
			lastY: false,
			time: event.timeStamp
		};
		this.activeInputs.length++;
		newIdentifier = eachTouch.identifier;
	}

	// Process the events as appropriate
	this.processInputStart(newIdentifier);

	event.preventDefault();
	event.stopPropagation();
};

PinchZoom.prototype.onTouchMove = function(event) {
	var i, l, eachTouch, trackedTouch;

	if (!this.activeInputs.length) {
		return;
	}

	// Update touch event movements
	for (i = 0, l = event.touches.length; i < l; i++) {
		eachTouch = event.touches[i];
		if (this.activeInputs[eachTouch.identifier] === undefined) {
			continue;
		}

		trackedTouch = this.activeInputs[eachTouch.identifier];
		trackedTouch.lastX = eachTouch.clientX;
		trackedTouch.lastY = eachTouch.clientY;
		trackedTouch.time = event.timeStamp;
	}

	// Trigger an element update in response to the move
	this.processInputMove();

	event.preventDefault();
	event.stopPropagation();
};

PinchZoom.prototype.onTouchEnd = function(event) {
	var i, l, eachTouch, touchesDeleted = 0;

	for (i = 0, l = event.changedTouches.length; i < l; i++) {
		eachTouch = event.changedTouches[i];
		if (this.activeInputs[eachTouch.identifier] !== undefined) {
			delete this.activeInputs[eachTouch.identifier];
			this.releaseCapture(eachTouch.identifier);
			touchesDeleted++;
		}
	}
	this.activeInputs.length -= touchesDeleted;

	// If no touches were deleted, no further action required
	if (touchesDeleted === 0) {
		return;
	}

	// Reset the origins of the remaining touches to allow changes to take
	// effect correctly
	for (i in this.activeInputs) {
		if (this.activeInputs.hasOwnProperty(i)) {
			eachTouch = this.activeInputs[i];
			if (typeof eachTouch !== 'object' || eachTouch.lastX === false) {
				continue;
			}
			eachTouch.originX = eachTouch.lastX;
			eachTouch.originY = eachTouch.lastY;
		}
	}

	// If there are no touches remaining, clean up
	if (!this.activeInputs.length) {
		this.processInputEnd();
	}
};

PinchZoom.prototype.onTouchCancel = function() {
	var i;

	if (!this.activeInputs.length) {
		return;
	}

	for (i in this.activeInputs) {
		if (this.activeInputs.hasOwnProperty(i)) {
			if (i === 'length') {
				continue;
			}
			delete this.activeInputs[i];
		}
	}
	this.activeInputs.length = 0;
	this.processInputEnd();
};


/* MOUSE INPUT HANDLERS */

PinchZoom.prototype.onMouseDown = function(event) {

	// Don't track the right mouse buttons
	if (event.button && event.button === 2) return;

	this.activeInputs.click = {
		originX: event.clientX,
		originY: event.clientY,
		lastX: false,
		lastY: false,
		time: event.timeStamp
	};
	this.activeInputs.length = 1;

	// Add move & up handlers to the *document* to allow handling outside the element
	this.documentListeners.bind('mousemove', 'onMouseMove');
	this.documentListeners.bind('mouseup', 'onMouseUp');

	event.preventDefault();
	this.processInputStart(false);
};

PinchZoom.prototype.onMouseMove = function(event) {
	if (!this.activeInputs.length) {
		return;
	}

	this.activeInputs.click.lastX = event.clientX;
	this.activeInputs.click.lastY = event.clientY;
	this.activeInputs.click.time = event.timeStamp;

	this.processInputMove();

	this.allowClickEvent = false;
	event.preventDefault();
};

PinchZoom.prototype.onMouseUp = function() {
	if (!this.activeInputs.length) {
		return;
	}

	this.documentListeners.unbind('mousemove', 'onMouseMove');
	this.documentListeners.unbind('mouseup', 'onMouseUp');

	delete this.activeInputs.click;
	this.activeInputs.length = 0;

	this.processInputEnd();
};

PinchZoom.prototype.onMouseWheel = function(event) {

	var self = this;

	if (this.mouseWheelThrottle) {
		return;
	}

	this.mouseWheelThrottle = window.setTimeout(function _cancelThrottle() {
		self.mouseWheelThrottle = null;
	}, 200);

	if (event.wheelDelta > 0) {
		this.stepZoom('in');
	} else if (event.wheelDelta < 0) {
		this.stepZoom('out');
	}

	event.stopPropagation();
	event.preventDefault();
	return false;
};


/* POINTER INPUT HANDLERS */

PinchZoom.prototype.onPointerDown = function(event) {

	// Ignore pointers past the second
	if (this.activeInputs.length >= 2) {
		return;
	}

	// Track the pointer
	this.activeInputs[event.pointerId] = {
		originX: event.clientX,
		originY: event.clientY,

		// COMPLEX:MA:20120528 Set the last position to be the same as the origin
		// otherwise the calculations in processInputMove fail. (redmine #7923)
		lastX: event.clientX,
		lastY: event.clientY,
		time: event.timeStamp
	};
	this.activeInputs.length++;

	// Process the events as appropriate
	this.processInputStart(event.pointerId);
};

PinchZoom.prototype.onPointerMove = function(event) {
	var trackedTouch;
	if (this.activeInputs[event.pointerId] === undefined) {
		return;
	}

	// Update this tracked move
	trackedTouch = this.activeInputs[event.pointerId];
	trackedTouch.lastX = event.clientX;
	trackedTouch.lastY = event.clientY;
	trackedTouch.time = event.timeStamp;

	// Prevent clicks after a small move
	if (this.allowClickEvent) {
		if ((Math.abs(trackedTouch.originX - trackedTouch.lastX) > 2) || (Math.abs(trackedTouch.originY - trackedTouch.lastY) > 2)) {
			this.allowClickEvent = false;
		}
	}

	// Trigger an element update in response to the move
	this.processInputMove();

	event.preventDefault();
};

PinchZoom.prototype.onPointerUp = function(event) {
	var i, eachTouch;

	if (this.activeInputs[event.pointerId] === undefined) {
		return;
	}

	delete this.activeInputs[event.pointerId];
	this.activeInputs.length--;
	this.releaseCapture(event.pointerId);

	// Reset the origins of the remaining touches to allow changes to take
	// effect correctly
	for (i in this.activeInputs) {
		if (this.activeInputs.hasOwnProperty(i)) {
			eachTouch = this.activeInputs[i];
			if (typeof eachTouch !== 'object' || eachTouch.lastX === false) {
				continue;
			}
			eachTouch.originX = eachTouch.lastX;
			eachTouch.originY = eachTouch.lastY;
		}
	}

	// If there are no touches remaining, clean up
	if (!this.activeInputs.length) {
		this.processInputEnd();
	}
};

PinchZoom.prototype.onPointerCancel = function() {
	var i;

	if (!this.activeInputs.length) {
		return;
	}

	for (i in this.activeInputs) {
		if (this.activeInputs.hasOwnProperty(i)) {
			if (i === 'length') {
				continue;
			}
			delete this.activeInputs[i];
		}
	}

	this.activeInputs.length = 0;

	this.processInputEnd();
};


PinchZoom.prototype.captureInput = function(identifier) {
	if (identifier === false || this.capturedInputs.identifier) {
		return;
	}

	// Capture pointers on IE 10+
	if (this.trackPointerEvents) {
		this.containerNode.msSetPointerCapture(identifier);
		this.listeners.bind('MSLostPointerCapture', 'onPointerCancel');
	}

	this.capturedInputs[identifier] = true;
};

PinchZoom.prototype.releaseCapture = function(identifier) {
	if (identifier === false || !this.capturedInputs.identifier) {
		return;
	}

	if (this.trackPointerEvents) {
		this.listeners.unbind('MSLostPointerCapture', 'onPointerCancel');
		this.containerNode.msReleasePointerCapture(identifier);
	}

	delete this.capturedInputs[identifier];
};

PinchZoom.prototype.releaseAllCapturedInputs = function() {
	var i;

	for (i in this.capturedInputs) {
		if (this.capturedInputs.hasOwnProperty(i)) {
			this.releaseCapture(i);
			delete this.capturedInputs[i];
		}
	}
};

/**
 * Input-triggered click
 */
PinchZoom.prototype.onClick = function(event) {
	if (!this.allowClickEvent) {
		event.stopPropagation();
		event.preventDefault(true);
		return false;
	}
	return true;
};

/**
 * A click on the + or - buttons
 */
PinchZoom.prototype.onStepZoomClick = function(direction, event) {

	this.stepZoom(direction);

	event.stopPropagation();
	event.preventDefault();
	return false;
};








/* POSITIONING */

PinchZoom.prototype.updateDimensions = function() {

	var style  = window.getComputedStyle(this.containerNode),
		width  = this.containerNode.offsetWidth,
		height = this.containerNode.offsetHeight,
		tp     = parseInt(style.paddingTop, 10),
		lp     = parseInt(style.paddingLeft, 10),
		bp     = parseInt(style.paddingBottom, 10),
		rp     = parseInt(style.paddingRight, 10),
		tb     = parseInt(style.borderTopWidth, 10),
		lb     = parseInt(style.borderLeftWidth, 10),
		bb     = parseInt(style.borderBottomWidth, 10),
		rb     = parseInt(style.borderRightWidth, 10);

	this.containerDimensions = {
		tp: tp,
		lp: lp,
		bp: bp,
		rp: rp,
		tb: tb,
		lb: lb,
		bb: bb,
		rb: rb,
		w:  width - lp - rp - lb - rb,
		h:  height - tp - bp - tb - bb
	};

	// Set scale to fit
	this.scale      = Math.min(1.0, this.containerDimensions.w / this.imageDimensions.w, this.containerDimensions.h / this.imageDimensions.h);
	this.scaleSaved = this.scale;
};

PinchZoom.prototype.updatePosition = function() {

	var x, y;

	// Begin with the current offsets
	x = this.offset.x;
	y = this.offset.y;

	// Modify by the original container's padding
	x += this.containerDimensions.lp;
	y += this.containerDimensions.tp;

	// Modify so that a position of 0,0 will be centered in the container;
	// the CSS style rules will result in a top-left basis for simplicity.
	x += (this.containerDimensions.w - (this.imageDimensions.w * this.scale)) / 2;
	y += (this.containerDimensions.h - (this.imageDimensions.h * this.scale)) / 2;

	// Amend with the current scale factor and round to nearest pixel
	x = Math.round(x / this.scale * this.roundFactor) / this.roundFactor;
	y = Math.round(y / this.scale * this.roundFactor) / this.roundFactor;

	// Render
	this.imageStyle[this.cssTransform] = 'scale('+this.scale+') translate3d(' + x + 'px,' + y + 'px,0)';
};

PinchZoom.prototype.updatePositionWithAnimationDuration = function() {

	var self = this;

	this.imageStyle[this.cssTransitionDuration] = this.config.animationDuration + 's';
	this.updatePosition();
	this.animationTimeout = window.setTimeout(function() {
		self.imageStyle[this.cssTransitionDuration] = '0s';
		self.animationTimeout = false;
	}, this.config.animationDuration * 1000);
};

/**
 * Process the start of a touch-like input, starting the image move
 * or changing to a zoom/pan as appropriate.
 */
PinchZoom.prototype.processInputStart = function(identifier) {
	var i, eachTouch;

	// Start a move if approprate
	if (!this.trackingInput) {

		this.trackingInput = true;
		this.allowClickEvent = true;
		this.offset.x = 0;
		this.offset.y = 0;
		this.imageStyle[this.cssTransitionDuration] = '0s';

	// For subsequent touches, reset all drag origins to the current position to allow
	// multitouch to alter behaviour correctly
	} else {
		for (i in this.activeInputs) {
			if (this.activeInputs.hasOwnProperty(i)) {
				eachTouch = this.activeInputs[i];
				if (typeof eachTouch !== 'object' || eachTouch.lastX === false) {
					continue;
				}

				eachTouch.originX = eachTouch.lastX;
				eachTouch.originY = eachTouch.lastY;
			}
		}

		this.offset.savedX = this.offset.x;
		this.offset.savedY = this.offset.y;
		this.scaleSaved = this.scale;
	}

	// Capture each input if appropriate
	this.captureInput(identifier);
};

// During movements, update the position according to event position changes, possibly
// including multiple points
PinchZoom.prototype.processInputMove = function() {

	var e1, e2, k;

	if (!this.trackingInput) {
		return;
	}

	// Work out a new image scale if there's multiple touches
	if (this.activeInputs.length === 2) {
		for (k in this.activeInputs) {
			if (this.activeInputs.hasOwnProperty(k)) {
				if (k === 'length') {
					continue;
				}
				if (!e1) {
					e1 = this.activeInputs[k];
				} else {
					e2 = this.activeInputs[k];
				}
			}
		}
		var originalDistance = Math.sqrt(Math.pow(e2.originX - e1.originX, 2) + Math.pow(e2.originY - e1.originY, 2));
		var newDistance = Math.sqrt(Math.pow(e2.lastX - e1.lastX, 2) + Math.pow(e2.lastY - e1.lastY, 2));

		this.scale = this.scaleSaved * (newDistance / originalDistance);
		if (this.config.hardScaleLimit) {
			this.scale = Math.min(this.config.maxScale, this.scale);
		}
	}

	// Work out a new image offset position
	var totalX = 0;
	var totalY = 0;
	for (k in this.activeInputs) {
		if (this.activeInputs.hasOwnProperty(k)) {
			if (k === 'length') {
				continue;
			}
			totalX += this.activeInputs[k].lastX - this.activeInputs[k].originX;
			totalY += this.activeInputs[k].lastY - this.activeInputs[k].originY;
		}
	}
	this.offset.x = this.offset.savedX + (totalX / this.activeInputs.length);
	this.offset.y = this.offset.savedY + (totalY / this.activeInputs.length);
	this.updatePosition();
};

// At the end of moves, snap the scale or position back to within bounds if appropriate
PinchZoom.prototype.processInputEnd = function() {
	if (!this.trackingInput) {
		return;
	}

	this.offset.savedX = this.offset.x;
	this.offset.savedY = this.offset.y;
	this.scaleSaved = this.scale;
	this.trackingInput = false;

	// Snap back scale
	var targetScale = Math.max(this.scale, Math.min(1.0, this.containerDimensions.w/this.imageDimensions.w, this.containerDimensions.h/this.imageDimensions.h));
	if (targetScale > this.config.maxScale) targetScale = this.config.maxScale;

	// Snap back position.
	var pos = {
		imageX: Math.ceil(this.imageDimensions.w * targetScale / 2),
		imageY: Math.ceil(this.imageDimensions.h * targetScale / 2),
		containerX: Math.ceil(this.containerDimensions.w / 2),
		containerY: Math.ceil(this.containerDimensions.h / 2),
		offsetX: Math.ceil(this.offset.x / targetScale),
		offsetY: Math.ceil(this.offset.y / targetScale)
	};

	// If the image is smaller in width than the container, recenter; otherwise, move edges out
	if (this.imageDimensions.w * targetScale <= this.containerDimensions.w) {
		this.offset.x = 0;
	} else if (pos.containerX + pos.offsetX > pos.imageX) {
		this.offset.x = Math.round((pos.imageX - pos.containerX) * targetScale);
	} else if (pos.containerX > pos.offsetX + pos.imageX) {
		this.offset.x = Math.round((pos.containerX - pos.imageX) * targetScale);
	}

	// Do the same for height
	if (this.imageDimensions.h * targetScale <= this.containerDimensions.h) {
		this.offset.y = 0;
	} else if (pos.containerY + pos.offsetY > pos.imageY) {
		this.offset.y = Math.round((pos.imageY - pos.containerY) * targetScale);
	} else if (pos.containerY > pos.offsetY + pos.imageY) {
		this.offset.y = Math.round((pos.containerY - pos.imageY) * targetScale);
	}

	// If nothing has changed, no snap required
	if (targetScale === this.scale && this.offset.savedX === this.offset.x && this.offset.savedY === this.offset.y) {
		return;
	}
	this.scaleSaved = this.scale = targetScale;
	this.offset.savedX = this.offset.x;
	this.offset.savedY = this.offset.y;

	this.updatePositionWithAnimationDuration();
	this.releaseAllCapturedInputs();
};

PinchZoom.prototype.stepZoom = function(direction) {
	if (direction === 'out') {
		this.scale = Math.max(Math.min(1.0, this.containerDimensions.w/this.imageDimensions.w, this.containerDimensions.h/this.imageDimensions.h), this.scale - this.config.stepZoomIncrement);
	} else {
		this.scale = Math.min(this.config.maxScale, this.scale + this.config.stepZoomIncrement);
	}
	this.scaleSaved = this.scale;

	this.updatePositionWithAnimationDuration();
};

/**
 * Zoom in to the image by one step
 */
PinchZoom.prototype.zoomIn = function() {
	return this.stepZoom('in');
};

/**
 * Zoom out of the image by one step
 */
PinchZoom.prototype.zoomOut = function() {
	return this.stepZoom('out');
};

/**
 * Creates controls in the supplied element.
 */
PinchZoom.prototype.addControlsTo = function(anEle) {

	var singleZoomControlClass = this.config.zoomControlClass + ' ' + this.config.zoomControlClass + '_zoom';

	if (!anEle || !anEle.appendChild) throw new TypeError('addControlsTo requires a valid DOM node');

	if (!this.zoomControls) {

		this.zoomControls = document.createElement('DIV');
		this.zoomControls.className = this.config.zoomControlClass + 's';
		if (this.trackPointerEvents || this.multitouchSupport) {

			// TODO: this needs testing
			if (this.config.zoomControlMessage) this.zoomControls.innerHTML = '<div class="' + this.config.zoomControlClass + '_message">' + this.config.zoomControlMessage + '</div>';
		} else {
			this.zoomControls.innerHTML = '<button class="' + singleZoomControlClass + 'out">' + this.config.zoomControlText.zoomout + '</button>' +
											'<button class="' + singleZoomControlClass + 'in">' + this.config.zoomControlText.zoomin + '</button>';
			this.zoomControls.getElementsByClassName(singleZoomControlClass + 'out')[0].addEventListener('click', this.onStepZoomClick.bind(this, 'out'), false);
			this.zoomControls.getElementsByClassName(singleZoomControlClass + 'in')[0].addEventListener('click', this.onStepZoomClick.bind(this, 'in'), false);
		}
	}

	anEle.appendChild(this.zoomControls);
};

/**
 * Unbinds all event listeners to prevent circular references preventing
 * items from being deallocated, and clean up references to dom elements.
 */
PinchZoom.prototype.destroy = function() {

	this.listeners.unbindAll();
	this.documentListeners.unbindAll();

	this.containerNode     =
	this.image             =
	this.zoomControls      =
	this.listeners         =
	this.documentListeners = null;

};

PinchZoom.prototype.update = function() {

	if (!this.containerNode) {
		return false;
	}

	this.updateDimensions();
	this.updatePosition();
};









},{"./defaults":1,"./event-listeners":2,"./multitouch-support":3,"./track-pointer-events":5,"./vendor-css-prefix":7}],5:[function(require,module,exports){
module.exports = window.navigator.msPointerEnabled;
},{}],6:[function(require,module,exports){
module.exports = !require('./track-pointer-events') && window.ontouchstart !== undefined;
},{"./track-pointer-events":5}],7:[function(require,module,exports){
var prefix = (window.opera && Object.prototype.toString.call(window.opera) === '[object Opera]') ? 'o' :
					(document.documentElement.style.hasOwnProperty('MozAppearance')) ? 'Moz' :
					(document.documentElement.style.hasOwnProperty('WebkitAppearance')) ? 'webkit' :
					(typeof navigator.cpuClass === 'string') ? 'ms' : '';

module.exports = {
	transform:  (prefix ? prefix + 'T' : 't') + 'ransform',
	transition: (prefix ? prefix + 'T' : 't') + 'ransition'
};
},{}]},{},[4])(4)
});
;
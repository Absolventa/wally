(function() {
  window.Absolventa = window.Absolventa || {};
}());

(function() {

    'use strict';

    // Set namespace if necessary
    var Absolventa = window.Absolventa || {};

    Absolventa.Wally = function(selector, config) {
        var _defaultConfig;

        _defaultConfig = {
            containerHeight: 500,
            marginBetweenElements : 0,
            containerCssClassName : 'wally_container',
            imageWrapperCssClassName : 'wally_images',
            overlayCssClassName : 'wally_overlay',
            cloneCssClassName : 'wally_clone_images',
            scrollingSpeed : 200,
            overlay : true,
            overlayColor : '#0D596B',
            overlayOpacity : 0.6,
            filterBlur : false,
            filterColoring : false,
            filterColoringMethod : 'sepia', // 'sepia' or 'grayscale'
            scrollAnimation : true,
            scrollAnimationStoppable : true,
            beforeMount : function() {
                // callback
            },
            afterMount : function() {
                // callback
            }
        };

        this.elements = [];
        this.images = [];
        this.container = undefined;
        this.imageWrapper = undefined;
        this.animationInterval = undefined;
        this.necessaryClones = 0;
        this.singleWrapperWidth = 0;
        this.distanceToScroll = undefined;
        this.requestId = 0;
        this.svgFiltersBase64 = 'PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGZpbHRlciBpZD0iYmx1ciI+CiAgICA8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSI0IiAvPgogIDwvZmlsdGVyPgogIDxmaWx0ZXIgaWQ9InNlcGlhIj4KICAgIDxmZUNvbG9yTWF0cml4CiAgICAgIHR5cGU9Im1hdHJpeCIKICAgICAgdmFsdWVzPSIuMzQzIC42NjkgLjExOSAwIDAKICAgICAgICAgICAgICAuMjQ5IC42MjYgLjEzMCAwIDAKICAgICAgICAgICAgICAuMTcyIC4zMzQgLjExMSAwIDAKICAgICAgICAgICAgICAuMDAwIC4wMDAgLjAwMCAxIDAgIi8+CiAgPC9maWx0ZXI+CiAgPGZpbHRlciBpZD0iZ3JheXNjYWxlIj4KICAgIDxmZUNvbG9yTWF0cml4IHR5cGU9Im1hdHJpeCIgdmFsdWVzPSIwLjMzMzMgMC4zMzMzIDAuMzMzMyAwIDAgMC4zMzMzIDAuMzMzMyAwLjMzMzMgMCAwIDAuMzMzMyAwLjMzMzMgMC4zMzMzIDAgMCAwIDAgMCAxIDAiLz4KICA8L2ZpbHRlcj4KICA8ZmlsdGVyIGlkPSJncmF5c2NhbGVfYmx1ciI+CiAgICA8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSI0IiAvPgogICAgPGZlQ29sb3JNYXRyaXggdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAuMzMzMyAwLjMzMzMgMC4zMzMzIDAgMCAwLjMzMzMgMC4zMzMzIDAuMzMzMyAwIDAgMC4zMzMzIDAuMzMzMyAwLjMzMzMgMCAwIDAgMCAwIDEgMCIvPgogIDwvZmlsdGVyPgogIDxmaWx0ZXIgaWQ9InNlcGlhX2JsdXIiPgogICAgPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iNCIgLz4KICAgIDxmZUNvbG9yTWF0cml4CiAgICAgIHR5cGU9Im1hdHJpeCIKICAgICAgdmFsdWVzPSIuMzQzIC42NjkgLjExOSAwIDAKICAgICAgICAgICAgICAuMjQ5IC42MjYgLjEzMCAwIDAKICAgICAgICAgICAgICAuMTcyIC4zMzQgLjExMSAwIDAKICAgICAgICAgICAgICAuMDAwIC4wMDAgLjAwMCAxIDAgIi8+CiAgPC9maWx0ZXI+Cjwvc3ZnPg==';

        // first argument is possibly a config object
        if (Object.prototype.toString.call(selector) === '[object Object]') {
            this.config = Absolventa.Wally.Helpers.createConfigObject(selector, _defaultConfig);
        } else {
            this.config = Absolventa.Wally.Helpers.createConfigObject(config, _defaultConfig);
        }

        Absolventa.Wally.Helpers._addRequestAnimationPolyfill();

        // first argument is possibly a css selector string
        if (typeof selector === 'string') {
            this._mountElements(selector);
        }
    };

    Absolventa.Wally.prototype._mountContainer = function() {
        var container,
            targetElement,
            i;

        if (!this.container && this.elements.length > 0) {
            targetElement = this.elements[0].parentNode;
            container = this._createContainer();

            this._styleImages();

            // invoke before-callback
            this.config.beforeMount(container);

            targetElement.appendChild(container);

            // we set width of image wrapper, when images are appended to the dom
            Absolventa.Wally.Styler.styleImageWrapper(this.imageWrapper, this._getNecessaryWrapperWidth(), this.config);

            if (this.config.scrollAnimation) {
                this._startAnimation();
                if (this.config.scrollAnimationStoppable) {
                    this._addEventHandlerForContainerHovering();
                }
            }

            for (i = 0; i < this.necessaryClones; i += 1) {
                this._mountImageWrapperClone();
            }

            // invoke after-callback
            this.config.afterMount(container);
        }
    };

    Absolventa.Wally.prototype._mountImageWrapperClone = function() {
        var clone = this.imageWrapper.cloneNode(true);

        clone.className = clone.className + ' ' + this.config.cloneCssClassName;

        clone.style.position = 'relative';
        clone.style.left = 0;
        clone.style.top = 0;
        clone.style.display = 'inline-block';
        clone.style.width = 'auto';
        clone.style.cssFloat = 'left';
        clone.style.styleFloat = 'left'; // IE

        this.imageWrapper.appendChild(clone);
    };

    Absolventa.Wally.prototype._createContainer = function() {
        var container,
            imageWrapper,
            overlay;

        if (!this.container) {
            container = document.createElement('div');
            container.className = this.config.containerCssClassName;
            imageWrapper = this._createImageWrapper();
            container.appendChild(imageWrapper);
            if (this.config.overlay) {
                overlay = this._createOverlay();
                container.appendChild(overlay);
            }
            container = Absolventa.Wally.Styler.styleContainer(container, this.config);
            this.container = container;
        }

        return container;
    };

    Absolventa.Wally.prototype._createOverlay = function() {
        var overlay;

        overlay = document.createElement('div');
        overlay.className = this.config.overlayCssClassName;
        overlay = Absolventa.Wally.Styler.styleOverlay(overlay, this.config);

        return overlay;
    };

    Absolventa.Wally.prototype._createImageWrapper = function() {
        var imageWrapper,
            i,
            imagesLength = this.elements.length;

        // Only create a wrapper, if necessary
        if (!this.imageWrapper) {
            imageWrapper = document.createElement('div');
            imageWrapper.className = this.config.imageWrapperCssClassName;
            for (i = 0; i < imagesLength; i += 1) {
                Absolventa.Wally.Styler.styleImage(this.elements[i].wallyImageElement, this.config);
                imageWrapper.appendChild(this.elements[i]);
            }
            imageWrapper = Absolventa.Wally.Styler.styleImageWrapper(imageWrapper, this._getNecessaryWrapperWidth(), this.config);

            this.imageWrapper = imageWrapper;

            return imageWrapper;
        }
    };

    Absolventa.Wally.prototype._getNecessaryWrapperWidth = function() {
        var i,
            imagesLength = this.images.length,
            wrapperWidth = 0,
            imageWidth = 0,
            necessaryClones = 1;

        for (i = 0; i < imagesLength; i += 1) {
            imageWidth = parseInt(this.images[i].style.width.replace('px', ''), 10);

            imageWidth += this.config.marginBetweenElements;

            wrapperWidth += imageWidth;
        }

        this.singleWrapperWidth = wrapperWidth;

        wrapperWidth += wrapperWidth;

        while (wrapperWidth <= 2 * screen.width) {
            necessaryClones += 1;
            wrapperWidth += wrapperWidth;
        }

        this.necessaryClones = necessaryClones;

        return wrapperWidth;
    };

    Absolventa.Wally.prototype._styleImages = function() {
        var i,
            imagesLength = this.images.length;

        for (i = 0; i < imagesLength; i += 1) {
            if (this.config.filterBlur || this.config.filterColoring) {
                // hint: using blur via filter or svg is performance critical. You should consider using already blurred images
                this.images[i].style.WebkitFilter = Absolventa.Wally.Styler.getWebkitFilterString(this.config);
                this.images[i].style.filter = 'url(data:image/svg+xml;base64,' + this.svgFiltersBase64 + Absolventa.Wally.Styler.getSvgFilterId(this.config) + ')';
            }
        }
    };

    Absolventa.Wally.prototype._mountElements = function(selector) {
        var selectors = Absolventa.Wally.Helpers._generateSelectorStringArray(selector),
            i,
            selectorsLength = selectors.length;

        for (i = 0; i < selectorsLength; i += 1) {
            this._mountElement(selectors[i]);
        }

        this._mountContainer();
    };

    Absolventa.Wally.prototype._mountElement = function(selectorString) {
        var elements = document.querySelectorAll(selectorString),
            elementsLength = elements.length,
            i;

        if (elementsLength > 0) {
            for (i = 0; i < elementsLength; i += 1) {
                this.elements.push(elements[i]);
                this._mountImage(elements[i]);
            }
        }
    };

    Absolventa.Wally.prototype._mountImage = function(element, parentElement) {
        if (!parentElement) {
            parentElement = element;
        }

        if (element.nodeName === 'IMG') {
            this.images.push(element);
            element.wallyParentElement = parentElement;
            parentElement.wallyImageElement = element;
        } else {
            this._mountImage(element.childNodes[0], parentElement);
        }
    };

    Absolventa.Wally.prototype._addEventHandlerForContainerHovering = function() {
        var that = this,
            stopAnimation = function() {
                that._stopAnimation();
            },
            startAnimation = function(e) {
                var shouldStartAnimation = that._shouldAnimationStart(e);

                if (shouldStartAnimation) {
                    that._startAnimation();
                }
            };
        Absolventa.Wally.Helpers._addEventListener(this.container, 'mouseover', stopAnimation);
        Absolventa.Wally.Helpers._addEventListener(this.container, 'mouseout', startAnimation);
    };

    Absolventa.Wally.prototype._shouldAnimationStart = function(e) {
        var i,
            imagesLength = this.images.length,
            elementsLength = this.elements.length;

        for (i = 0; i < imagesLength; i += 1) {
            if (this.images[i] === e.relatedTarget) {
                return false;
            }
        }

        for (i = 0; i < elementsLength; i += 1) {
            if (this.elements[i] === e.relatedTarget) {
                return false;
            }
        }

        return true;
    };

    Absolventa.Wally.prototype._startAnimation = function() {
        this._startAnimationViaRequestAnimationFrame();
    };

    Absolventa.Wally.prototype._stopAnimation = function() {
        this._stopRequestAnimationFrame();
    };

    Absolventa.Wally.prototype._stopRequestAnimationFrame = function() {
        if (this.requestId) {
            window.cancelAnimationFrame(this.requestId);
            this.requestId = undefined;
        }
    };

    Absolventa.Wally.prototype._startAnimationViaRequestAnimationFrame = function() {
        var imageWrapper = this.imageWrapper,
            scrollingSpeed = this.config.scrollingSpeed / 100,
            that = this;

        this.distanceToScroll = this.distanceToScroll || this.singleWrapperWidth - 1;

        function animation() {
            that.distanceToScroll -= scrollingSpeed;
            imageWrapper.style.left = -(that.singleWrapperWidth - that.distanceToScroll) + "px";
            if (that.distanceToScroll <= 0) {
                that.distanceToScroll = that.singleWrapperWidth - 1;
            }
            that.requestId = window.requestAnimationFrame(animation);
        }
        if (!this.requestId) {
            window.requestAnimationFrame(animation);
        }

    };

    Absolventa.Wally.prototype._convertScrollingSpeedToSeconds = function() {
        var pixelsPerSecond = (this.config.scrollingSpeed / 100) / 2.5,
            seconds = (1 / pixelsPerSecond * this.singleWrapperWidth);

        return seconds / 100;
    };

}());

(function() {
    'use strict';

    // Set namespace if necessary
    var Absolventa = window.Absolventa || {};
    Absolventa.Wally = Absolventa.Wally || {};

    Absolventa.Wally.Helpers = {};

    Absolventa.Wally.Helpers.mergeObjects = function(configObject, defaultObject) {
        var mergedObject = {};

        mergedObject = this.copyObjectPropertiesFromTo(mergedObject, defaultObject);
        mergedObject = this.copyObjectPropertiesFromTo(mergedObject, configObject);

        return mergedObject;
    };

    Absolventa.Wally.Helpers.copyObjectPropertiesFromTo = function (targetObject, senderObject) {
        var prop;

        for (prop in senderObject) {
            try {
                // Property in destination object set; update its value.
                if (senderObject[prop].constructor === Object) {
                    targetObject[prop] = this.mergeObjects(targetObject[prop], senderObject[prop]);
                } else {
                    targetObject[prop] = senderObject[prop];
                }
            } catch (e) {
                // Property in destination object not set; create it and set its value.
                targetObject[prop] = senderObject[prop];
            }
        }

        return targetObject;
    };

    Absolventa.Wally.Helpers.createConfigObject = function(configObject, defaultObject) {
        var mergedObject = {};


        if (configObject === null || typeof configObject !== 'object') {
            configObject = {};
        }

        mergedObject = this.mergeObjects(configObject, defaultObject);

        return mergedObject;
    };

    Absolventa.Wally.Helpers._addEventListener = function(obj, evt, fnc) {
        /**
        * Cross Browser helper to addEventListener.
        *
        * @param {HTMLElement} obj The Element to attach event to.
        * @param {string} evt The event that will trigger the binded function.
        * @param {function(event)} fnc The function to bind to the element.
        * @return {boolean} true if it was successfuly binded.
        */

        // W3C model
        if (obj.addEventListener) {
            obj.addEventListener(evt, fnc, false);
            return true;
        }
        // Microsoft model
        if (obj.attachEvent) {
            return obj.attachEvent('on' + evt, fnc);
        }
        // Browser don't support W3C or MSFT model, go on with traditional
        evt = 'on' + evt;
        if (typeof obj[evt] === 'function') {
            // Object already has a function on traditional
            // Let's wrap it with our own function inside another function
            fnc = (function(f1, f2) {
                return function() {
                    f1.apply(this, arguments);
                    f2.apply(this, arguments);
                };
            }(obj[evt], fnc));
        }
        obj[evt] = fnc;
        return true;
    };

    Absolventa.Wally.Helpers.insertAfter = function(referenceNode, newNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    };

    Absolventa.Wally.Helpers.getPosition = function(element) {
        var xPosition = 0,
            yPosition = 0,
            elementScrollTopCounter = 0;

        while (element) {
            xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
            yPosition += (element.offsetTop - element.scrollTop + element.clientTop);

            // Fix scrollTop Issues on IE
            // element.scrollTop is always 0 in IE9 and below, so we use document.documentElement.scrollTop once
            elementScrollTopCounter += element.scrollTop; // stays at 0 for IE9 and below

            if (!element.offsetParent && elementScrollTopCounter === 0) { // IE 9 does not know offsetParent
                yPosition -= document.documentElement.scrollTop;
            }

            element = element.offsetParent;
        }

        return {
            x : xPosition,
            y : yPosition
        };
    };

    Absolventa.Wally.Helpers.triggerEvent = function(element, name) {
        var event; // The custom event that will be created

        if (document.createEvent) {
            event = document.createEvent("HTMLEvents");
            event.initEvent(name, true, true);
        } else {
            event = document.createEventObject();
            event.eventType = name;
        }

        event.eventName = name;

        if (document.createEvent) {
            element.dispatchEvent(event);
        } else {
            element.fireEvent("on" + event.eventType, event);
        }
    };

    Absolventa.Wally.Helpers.createBoundedWrapper = function(object, method) {
        return function() {
            return method.apply(object, arguments);
        };
    };

    Absolventa.Wally.Helpers.isRgbaSupported = function() {
        var result = null,
            value,
            el,
            re;

        if (document.createElement) {
            value = 'rgba(1,1,1,0.5)';
            el = document.createElement('p');
            re = /^rgba/;

            if (el && el.style && typeof re.test === 'function') {
                try {
                    el.style.color = value;
                    result = re.test(el.style.color);
                } catch (e) {
                    result = false;
                }
            }
        }

        return result;
    };

    Absolventa.Wally.Helpers.convertRgbaToHex = function(colorString) {
        var regex = /[\d\.]+/g,
            matches = colorString.match(regex),
            r = parseInt(matches[0], 10).toString(16),
            g = parseInt(matches[1], 10).toString(16),
            b = parseInt(matches[2], 10).toString(16),
            a = matches[3],
            hexColor;

        r = this.addLeadingZeroToHexString(r);
        g = this.addLeadingZeroToHexString(g);
        b = this.addLeadingZeroToHexString(b);

        if (r > 255 || g > 255 || b > 255 || a > 255) {
            throw "Invalid color component";
        }

        hexColor = '#' + r + g + b;

        return hexColor;
    };

    Absolventa.Wally.Helpers.addLeadingZeroToHexString = function(hexString) {
        return hexString.length === 1 ? '0' + hexString : hexString;
    };

    Absolventa.Wally.Helpers._generateSelectorStringArray = function(selector) {
        var selectors = [];

        // check for param availability
        if (selector !== undefined) {

            // convert to array, if param is a string
            if (typeof selector === 'string') {
                selectors.push(selector);
            }

            // is param an array?
            if (Object.prototype.toString.call(selector) === '[object Array]') {
                selectors = selectors.concat(selector);
            }
        }

        return selectors;
    };

    Absolventa.Wally.Helpers._setPrefixes = function(element, property, value) {
        element.style["Webkit" + property] = value;
        element.style["Moz" + property] = value;
        element.style["ms" + property] = value;
        element.style["O" + property] = value;
        element.style[property] = value;
    };

    Absolventa.Wally.Helpers._addRequestAnimationPolyfill = function() {
        // rAF polyfill via http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/

        var lastTime = 0,
            vendors = ['webkit', 'moz'],
            x,
            vendorsLength = vendors.length;

        for (x = 0; x < vendorsLength && !window.requestAnimationFrame; x += 1) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function(callback) {
                var currTime = new Date().getTime(),
                    timeToCall = Math.max(0, 16 - (currTime - lastTime)),
                    id = window.setTimeout(function() {
                        callback(currTime + timeToCall);
                    }, timeToCall);

                lastTime = currTime + timeToCall;

                return id;
            };
        }

        if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
        }
    };

}());

(function() {
    'use strict';

    // Set namespace if necessary
    var Absolventa = window.Absolventa || {};
    Absolventa.Wally = Absolventa.Wally || {};

    Absolventa.Wally.Styler = {};

    Absolventa.Wally.Styler.styleImage = function(element, config) {
        element.style.cssFloat = 'left';
        element.style.styleFloat = 'left'; // IE
        element.style.height = config.containerHeight + 'px';
        element.style.marginRight = config.marginBetweenElements + 'px';

        element.style.width = element.width / element.height * config.containerHeight + 'px';

        return element;
    };

    Absolventa.Wally.Styler.styleImageWrapper = function(wrapperElement, targetWidth, config) {
        if (targetWidth) {
            wrapperElement.style.width = targetWidth + 'px';
        }
        wrapperElement.style.height = config.containerHeight + 'px';
        wrapperElement.style.overflowY = 'hidden';
        wrapperElement.style.position = 'absolute';

        return wrapperElement;
    };

    Absolventa.Wally.Styler.styleContainer = function(containerElement, config) {
        containerElement.style.height = config.containerHeight + 'px';
        containerElement.style.width = 'auto';
        containerElement.style.overflowX = 'hidden';
        containerElement.style.position = 'relative';

        return containerElement;
    };

    Absolventa.Wally.Styler.styleOverlay = function(overlayElement, config) {
        overlayElement.style.height = config.containerHeight;
        overlayElement.style.width = '100%';
        overlayElement.style.position = 'absolute';
        overlayElement.style.backgroundColor = config.overlayColor;
        overlayElement.style.opacity = config.overlayOpacity;
        overlayElement.style.filter = 'alpha(opacity=' + config.overlayOpacity * 100 + ')';

        return overlayElement;
    };

    Absolventa.Wally.Styler.getWebkitFilterString = function(config) {
        var webkitFilterString = '';

        if (config.filterBlur) {
            webkitFilterString += ' blur(5px)';
        }

        if (config.filterColoring && config.filterColoringMethod === 'grayscale') {
            webkitFilterString += ' grayscale(100%)';
        }

        if (config.filterColoring && config.filterColoringMethod === 'sepia') {
            webkitFilterString += ' sepia(100%)';
        }

        return webkitFilterString;
    };

    Absolventa.Wally.Styler.getSvgFilterId = function(config) {
        var svgFilterId = '';

        if (config.filterColoring && config.filterColoringMethod === 'grayscale' && config.filterBlur) {
            svgFilterId = '#grayscale_blur';
        } else if (config.filterColoring && config.filterColoringMethod === 'sepia' && config.filterBlur) {
            svgFilterId = '#sepia_blur';
        } else {
            if (config.filterBlur) {
                svgFilterId = '#blur';
            }
            if (config.filterColoring && config.filterColoringMethod === 'grayscale') {
                svgFilterId = '#grayscale';
            }
            if (config.filterColoring && config.filterColoringMethod === 'sepia') {
                svgFilterId = '#sepia';
            }
        }

        return svgFilterId;
    };

}());

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
            containerHeight: 350,
            containerCssClassName : 'wally_container',
            imageWrapperCssClassName : 'wally_images',
            beforeMount : function(element) {

            },
            afterMount : function(element) {

            }
        };

        this.images = [];
        this.container = undefined;
        this.imageWrapper = undefined;

        // first argument is possibly a config object
        if (Object.prototype.toString.call(selector) === '[object Object]') {
            this.config = Absolventa.Wally.Helpers.createConfigObject(selector, _defaultConfig);
        } else {
            this.config = Absolventa.Wally.Helpers.createConfigObject(config, _defaultConfig);
        }

        // first argument is possibly a css selector string
        if (typeof selector === 'string') {
            this._mountElements(selector);
        }
    };

    Absolventa.Wally.prototype._mountContainer = function() {
        var container,
            targetElement,
            imageWrapper;

        if (!this.container) {
            targetElement = this.images[0].parentNode;
            container = this._createContainer();

            // invoke before-callback
            this.config.beforeMount(container);

            targetElement.appendChild(container);

            // invoke after-callback
            this.config.afterMount(container);
        }
    };

    Absolventa.Wally.prototype._createContainer = function() {
        var container,
            imageWrapper;

        if (!this.container) {
            container = document.createElement('div');
            container.className = this.config.containerCssClassName;
            imageWrapper = this._createImageWrapper();
            container.appendChild(imageWrapper);
            container = this._styleContainer(container);
            this.container = container;
        }

        return container;
    };

    Absolventa.Wally.prototype._createImageWrapper = function() {
        var imageWrapper,
            i,
            imagesLength = this.images.length;

        // Only create a wrapper, if necessary
        if (!this.imageWrapper) {
            imageWrapper = document.createElement('div');
            imageWrapper.className = this.config.imageWrapperCssClassName;
            for (i = 0; i < imagesLength; i += 1) {
                imageWrapper.appendChild(this._styleImage(this.images[i]));
            }
            imageWrapper = this._styleImageWrapper(imageWrapper);

            this.imageWrapper = imageWrapper;

            return imageWrapper;
        }
    };

    Absolventa.Wally.prototype._getNecessaryWrapperWidth = function() {
        var i,
            imagesLength = this.images.length,
            wrapperWidth = 0,
            imageWidth;

        for (i = 0; i < imagesLength; i += 1) {
            imageWidth = Math.round(this.images[i].width / this.images[i].height * parseInt(this.images[i].style.height, 10));
            wrapperWidth += imageWidth;
        }

        return wrapperWidth;
    };

    Absolventa.Wally.prototype._styleImage = function(imageElement) {
        imageElement.style.float = 'left';
        imageElement.style.height = this.config.containerHeight;

        return imageElement;
    };

    Absolventa.Wally.prototype._styleImageWrapper = function(wrapperElement) {
        wrapperElement.style.height = this.config.containerHeight;
        wrapperElement.style.width = this._getNecessaryWrapperWidth();

        return wrapperElement;
    };

    Absolventa.Wally.prototype._styleContainer = function(containerElement) {
        containerElement.style.height = this.config.containerHeight;
        containerElement.style.width = 'auto';
        containerElement.style.overflowX = 'hidden';

        return containerElement;
    };

    Absolventa.Wally.prototype._mountElements = function(selector) {
        var selectors = this._generateSelectorStringArray(selector),
            i,
            selectorsLength = selectors.length;

        for (i = 0; i < selectorsLength; i += 1) {
            this._mountElement(selectors[i]);
        }

        this._mountContainer();
    };

    Absolventa.Wally.prototype._generateSelectorStringArray = function(selector) {
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

    Absolventa.Wally.prototype._mountElement = function(selectorString) {
        var elements = document.querySelectorAll(selectorString),
            elementsLength = elements.length,
            i;

        if (elementsLength > 0) {
            for (i = 0; i < elementsLength; i += 1) {
                this.images.push(elements[i]);
            }
        }
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

}());

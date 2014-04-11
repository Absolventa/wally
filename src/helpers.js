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

}());

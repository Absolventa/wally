(function() {

    'use strict';

    // Set namespace if necessary
    var Absolventa = window.Absolventa || {};

    Absolventa.Wally = function(selector, config) {
        var _defaultConfig;

        _defaultConfig = {
            containerHeight: 200,
            marginBetweenElements : 0,
            containerCssClassName : 'wally_container',
            imageWrapperCssClassName : 'wally_images',
            overlayCssClassName : 'wally_overlay',
            cloneCssClassName : 'wally_clone_images',
            scrollingSpeed : 2,
            overlay : true,
            overlayColor : '#0D596B',
            overlayOpacity : 0.6,
            blur : false,
            scrollAnimation : true,
            beforeMount : function(element) {

            },
            afterMount : function(element) {

            }
        };

        this.elements = [];
        this.images = [];
        this.container = undefined;
        this.imageWrapper = undefined;
        this.animationInterval = undefined;
        this.necessaryClones = 0;
        this.singleWrapperWidth = 0;

        // first argument is possibly a config object
        if (Object.prototype.toString.call(selector) === '[object Object]') {
            this.config = Absolventa.Wally.Helpers.createConfigObject(selector, _defaultConfig);
        } else {
            this.config = Absolventa.Wally.Helpers.createConfigObject(config, _defaultConfig);
        }

        this._addRequestAnimationPolyfill();

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
            this._styleImageWrapper(this.imageWrapper);

            this._startAnimation();

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
                // TODO: Check if opacity is supported. Otherwise, older browsers would hide the images with the overlay
                overlay = document.createElement('div');
                overlay.className = this.config.overlayCssClassName;
                overlay = this._styleOverlay(overlay);
                container.appendChild(overlay);
            }
            container = this._styleContainer(container);
            this.container = container;
        }

        return container;
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
                this._styleImage(this.elements[i].wallyImageElement);
                imageWrapper.appendChild(this.elements[i]);
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
            imageWidth = 0,
            necessaryClones = 1;

        for (i = 0; i < imagesLength; i += 1) {
            //imageWidth = (this.images[i].offsetWidth / this.images[i].offsetHeight * parseInt(this.images[i].style.height, 10));
            imageWidth = parseInt(this.images[i].style.width.replace('px', ''), 10);

            imageWidth += this.config.marginBetweenElements;

            wrapperWidth += imageWidth;
        }

        // Manual fix for wrong image dimension rounding
        // wrapperWidth = wrapperWidth + (this.images.length + 1);

        this.singleWrapperWidth = wrapperWidth;

        wrapperWidth += wrapperWidth;

        while (wrapperWidth <= screen.width) {
            necessaryClones += 1;
            wrapperWidth += wrapperWidth;
        }

        this.necessaryClones = necessaryClones;

        return wrapperWidth;
    };

    Absolventa.Wally.prototype._styleImage = function(element) {
        element.style.cssFloat = 'left';
        element.style.styleFloat = 'left'; // IE
        element.style.height = this.config.containerHeight + 'px';
        element.style.marginRight = this.config.marginBetweenElements + 'px';

        element.style.width = element.width / element.height * this.config.containerHeight + 'px';

        return element;
    };

    Absolventa.Wally.prototype._styleImageWrapper = function(wrapperElement) {
        var targetWidth = this._getNecessaryWrapperWidth();

        if (targetWidth) {
            wrapperElement.style.width = targetWidth + 'px';
        }
        wrapperElement.style.height = this.config.containerHeight + 'px';
        wrapperElement.style.overflowY = 'hidden';
        wrapperElement.style.position = 'absolute';

        return wrapperElement;
    };

    Absolventa.Wally.prototype._styleImages = function() {
        var i,
            imagesLength = this.images.length;
        for (i = 0; i < imagesLength; i += 1) {
            if (this.config.blur) {
                // hint: using blur via filter or svg is performance critical. You should consider using already blurred images
                this.images[i].style.WebkitFilter = 'blur(5px)';
                this.images[i].style.filter = 'url(images/blur.svg#blur)';
            }
        }
    };

    Absolventa.Wally.prototype._styleContainer = function(containerElement) {
        containerElement.style.height = this.config.containerHeight + 'px';
        containerElement.style.width = 'auto';
        containerElement.style.overflowX = 'hidden';
        containerElement.style.position = 'relative';


        return containerElement;
    };

    Absolventa.Wally.prototype._styleOverlay = function(overlayElement) {
        overlayElement.style.height = this.config.containerHeight;
        overlayElement.style.width = '100%';
        overlayElement.style.position = 'absolute';
        overlayElement.style.backgroundColor = this.config.overlayColor;
        overlayElement.style.opacity = this.config.overlayOpacity;
        overlayElement.style.filter = 'alpha(opacity=' + this.config.overlayOpacity * 100 + ')'

        return overlayElement;
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

    Absolventa.Wally.prototype._startAnimation = function() {
        if (this.config.scrollAnimation) {
            this._startAnimationViaRequestAnimationFrame();
            // this._startAnimationViaCssTransition();
        }
    };

    Absolventa.Wally.prototype._startAnimationViaCssTransition = function() {
        var element = this.imageWrapper,
            property = 'Transition',
            value = "left 120s linear",
            distanceToScroll = this._getNecessaryWrapperWidth(),
            that = this,
            boundAnimation = function() {
                that.imageWrapper.style.left = -distanceToScroll + 'px';
            };

        element.style["Webkit" + property] = value;
        element.style["Moz" + property] = value;
        element.style["ms" + property] = value;
        element.style["O" + property] = value;
        element.style.left = 0;

        setTimeout(boundAnimation, 1);
    };

    Absolventa.Wally.prototype._startAnimationViaRequestAnimationFrame = function() {
        var distancePassed = 0,
            imageWrapper = this.imageWrapper,
            scrollingSpeed = this.config.scrollingSpeed,
            that = this;

        function animation() {
            distancePassed += scrollingSpeed;
            imageWrapper.style.left = -distancePassed + "px";
            if (distancePassed >= that.singleWrapperWidth - 1) {
                distancePassed = 0;
            }
            window.requestAnimationFrame(animation);
        }
        window.requestAnimationFrame(animation);
    };

    Absolventa.Wally.prototype._addRequestAnimationPolyfill = function() {
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

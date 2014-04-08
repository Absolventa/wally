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
            overlayCssClassName : 'wally_overlay',
            scrollingSpeed : 50,
            overlay : true,
            overlayColor : '#0D596B',
            overlayOpacity : 0.6,
            blur : true,
            beforeMount : function(element) {

            },
            afterMount : function(element) {

            }
        };

        this.images = [];
        this.container = undefined;
        this.imageWrapper = undefined;
        this.animationInterval = undefined;

        // first argument is possibly a config object
        if (Object.prototype.toString.call(selector) === '[object Object]') {
            this.config = Absolventa.Wally.Helpers.createConfigObject(selector, _defaultConfig);
        } else {
            this.config = Absolventa.Wally.Helpers.createConfigObject(config, _defaultConfig);
        }

        // first argument is possibly a css selector string
        if (typeof selector === 'string') {
            this._mountElements(selector);
            this._startAnimation();
        }
    };

    Absolventa.Wally.prototype._mountContainer = function() {
        var container,
            targetElement,
            imageWrapper;

        if (!this.container) {
            targetElement = this.images[0].parentNode;
            container = this._createContainer();

            this._styleImages();

            // invoke before-callback
            this.config.beforeMount(container);

            targetElement.appendChild(container);

            // we set width of image wrapper, when images are appended to the dom
            this._styleImageWrapper(this.imageWrapper);

            // invoke after-callback
            this.config.afterMount(container);
        }
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
        imageElement.style.height = this.config.containerHeight + 'px';

        return imageElement;
    };

    Absolventa.Wally.prototype._styleImageWrapper = function(wrapperElement) {
        var targetWidth = this._getNecessaryWrapperWidth();
        if (targetWidth) {
            wrapperElement.style.width = this._getNecessaryWrapperWidth() + 'px';
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
    }

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
                this.images.push(elements[i]);
            }
        }
    };

    Absolventa.Wally.prototype._startAnimation = function() {
        var scrollDistance = this._getNecessaryWrapperWidth(),
            distancePassed = 0,
            that = this,
            boundAnimation = function() {
                that.imageWrapper.style.left = -distancePassed + 'px';
                distancePassed += 1;
            };

        this.animationInterval = setInterval(boundAnimation, this.config.scrollingSpeed);
    };

}());

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

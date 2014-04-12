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
            Absolventa.Wally.Styler.styleImageWrapper(this.imageWrapper, this.config, this._getNecessaryWrapperWidth());

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
            imageWrapper = Absolventa.Wally.Styler.styleImageWrapper(imageWrapper, this.config, this._getNecessaryWrapperWidth());

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

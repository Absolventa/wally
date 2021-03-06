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

    Absolventa.Wally.Styler.styleImageWrapper = function(wrapperElement, config, targetWidth) {
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

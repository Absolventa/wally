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

}());

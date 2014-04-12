/*global runs, waits*/

describe("Sticks", function() {

    'use strict';

    beforeEach(function () {
        var i;
        // handle fixtures
        $('body').prepend('<div id="fixtures"></div>');
        for (i = 0; i < 5; i += 1) {
            $('#fixtures').append('<img src="/base/src/images/image_' + (i+1) + '" class="wally_image">');
        }
    });

    afterEach(function() {
        $('#fixtures').remove();
    });

    it("returns correct webkit filter string for blur param", function() {
        var filterString = Absolventa.Wally.Styler.getWebkitFilterString({
            filterBlur : true,
            filterColoring : false
        });

        expect(filterString).toContain('blur(5px)');
        expect(filterString).not.toContain('grayscale');
        expect(filterString).not.toContain('sepia');
    });

    it("returns correct webkit filter string for grayscale param", function() {
        var filterString = Absolventa.Wally.Styler.getWebkitFilterString({
            filterBlur : false,
            filterColoring : true,
            filterColoringMethod : 'grayscale'
        });

        expect(filterString).toContain('grayscale');
        expect(filterString).not.toContain('blur');
        expect(filterString).not.toContain('sepia');
    });

    it("returns correct webkit filter string for sepia param", function() {
        var filterString = Absolventa.Wally.Styler.getWebkitFilterString({
            filterBlur : false,
            filterColoring : true,
            filterColoringMethod : 'sepia'
        });

        expect(filterString).toContain('sepia(100%)');
        expect(filterString).not.toContain('blur');
        expect(filterString).not.toContain('grayscale');
    });

    it("returns correct webkit filter string for blur and grayscale param", function() {
        var filterString = Absolventa.Wally.Styler.getWebkitFilterString({
            filterBlur : true,
            filterColoring : true,
            filterColoringMethod : 'grayscale'
        });

        expect(filterString).not.toContain('sepia');
        expect(filterString).toContain('blur');
        expect(filterString).toContain('grayscale');
    });

    it("returns correct webkit filter string for blur and grayscale param", function() {
        var filterString = Absolventa.Wally.Styler.getWebkitFilterString({
            filterBlur : true,
            filterColoring : true,
            filterColoringMethod : 'sepia'
        });

        expect(filterString).toContain('sepia');
        expect(filterString).toContain('blur');
        expect(filterString).not.toContain('grayscale');
    });

});

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

    describe("selector string generation", function() {
        it("returns empty array for undefined params", function() {
            var wally = new Absolventa.Wally();

            expect(wally._generateSelectorStringArray()).toEqual([]);
        });
        it("converts string to array", function() {
            var wally = new Absolventa.Wally();

            expect(wally._generateSelectorStringArray('.wally_image')).toEqual(['.wally_image']);
        });
        it("converts string to array", function() {
            var wally = new Absolventa.Wally();

            expect(wally._generateSelectorStringArray(['.wally_image', '.another_wally_image'])).toEqual(['.wally_image', '.another_wally_image']);
        });
    });

    describe("mounts element", function() {
        it("when an element is given as param", function() {
            var wally = new Absolventa.Wally();

            wally._mountElement('img');

            expect(wally.images.length).toEqual(5);
        });
        it("ignores undefined param", function() {
            var wally = new Absolventa.Wally();

            wally._mountElement();

            expect(wally.images.length).toEqual(0);
        });
    });

    describe("image wrapper", function() {
        it("is not created, if already present", function() {
            var wally = new Absolventa.Wally('.wally_image');

            expect(wally._createImageWrapper()).toEqual(undefined);
        });
    });

    describe("container wrapper", function() {
        it("is not created, if already present", function() {
            var wally = new Absolventa.Wally('.wally_image');

            expect(wally._createContainer()).toEqual(undefined);
        });
    });
});

/*global runs, waits*/

describe("Wally Helpers", function() {

    'use strict';

    describe("selector string generation", function() {
        it("returns empty array for undefined params", function() {
            expect(Absolventa.Wally.Helpers._generateSelectorStringArray()).toEqual([]);
        });
        it("converts string to array", function() {
            expect(Absolventa.Wally.Helpers._generateSelectorStringArray('.wally_image')).toEqual(['.wally_image']);
        });
        it("converts string to array", function() {
            expect(Absolventa.Wally.Helpers._generateSelectorStringArray(['.wally_image', '.another_wally_image'])).toEqual(['.wally_image', '.another_wally_image']);
        });
    });

});
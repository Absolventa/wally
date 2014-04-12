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

    describe("styleContainer method", function() {

        var element;

        beforeEach(function() {
            element = document.createElement('div');
            Absolventa.Wally.Styler.styleContainer(element, {
                containerHeight : 350
            });
        });
        it("returns valid node element", function() {
            expect(element.nodeType).toEqual(1);
        });
        it("sets height correctly", function() {
            expect(element.style.height).toEqual('350px');
        });

        it("sets width correctly", function() {
            expect(element.style.width).toEqual('auto');
        });

        it("sets overflow-x hidden", function() {
            expect(element.style.overflowX).toEqual('hidden');
        });

        it("sets position to relative", function() {
            expect(element.style.position).toEqual('relative');
        });
    });

    describe("styleImageWrapper method", function() {

        var element;

        beforeEach(function() {
            element = document.createElement('div');
            Absolventa.Wally.Styler.styleImageWrapper(element, 1920, {
                containerHeight : 350
            });
        });
        it("returns valid node element", function() {
            expect(element.nodeType).toEqual(1);
        });
        it("sets height correctly", function() {
            expect(element.style.height).toEqual('350px');
        });

        it("sets overflow-y hidden", function() {
            expect(element.style.overflowY).toEqual('hidden');
        });

        it("sets position to absolute", function() {
            expect(element.style.position).toEqual('absolute');
        });
    });

    describe("styleImage method", function() {

        var img;

        beforeEach(function() {
            img = document.createElement('img');
            img.width = 200;
            img.height = 200;
            Absolventa.Wally.Styler.styleImage(img, {
                containerHeight : 350,
                marginBetweenElements : 20
            });
        });
        it("returns valid node element", function() {
            expect(img.nodeType).toEqual(1);
        });
        it("sets height correctly", function() {
            expect(img.style.height).toEqual('350px');
        });

        it("sets float correctly", function() {
            if (img.style.cssFloat) {
                expect(img.style.cssFloat).toEqual('left');
            }
            if (img.style.syleFloat) {
                expect(img.style.syleFloat).toEqual('left');
            }

        });

        it("sets margin right", function() {
            expect(img.style.marginRight).toEqual('20px');
        });

        it("sets width correclty", function() {
            expect(img.style.width).toEqual('350px');
        });
    });

    describe("webkit filter string method", function() {
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

        it("returns correct webkit filter string for blur and sepia param", function() {
            var filterString = Absolventa.Wally.Styler.getWebkitFilterString({
                filterBlur : true,
                filterColoring : true,
                filterColoringMethod : 'sepia'
            });

            expect(filterString).toContain('sepia');
            expect(filterString).toContain('blur');
            expect(filterString).not.toContain('grayscale');
        });

        it("returns correct webkit filter string for blur and disabled coloring param", function() {
            var filterString = Absolventa.Wally.Styler.getWebkitFilterString({
                filterBlur : true,
                filterColoring : false,
                filterColoringMethod : 'sepia'
            });

            expect(filterString).not.toContain('sepia');
            expect(filterString).toContain('blur');
            expect(filterString).not.toContain('grayscale');
        });
    });

    describe("svg filter id method", function() {


        it("returns correct svg id string for blur param", function() {
            var filterString = Absolventa.Wally.Styler.getSvgFilterId({
                filterBlur : true,
                filterColoring : false
            });

            expect(filterString).toContain('blur');
            expect(filterString).not.toContain('grayscale');
            expect(filterString).not.toContain('sepia');
        });

        it("returns correct svg id string for grayscale param", function() {
            var filterString = Absolventa.Wally.Styler.getSvgFilterId({
                filterBlur : false,
                filterColoring : true,
                filterColoringMethod : 'grayscale'
            });

            expect(filterString).toContain('grayscale');
            expect(filterString).not.toContain('blur');
            expect(filterString).not.toContain('sepia');
        });

        it("returns correct svg id string for sepia param", function() {
            var filterString = Absolventa.Wally.Styler.getSvgFilterId({
                filterBlur : false,
                filterColoring : true,
                filterColoringMethod : 'sepia'
            });

            expect(filterString).toContain('sepia');
            expect(filterString).not.toContain('blur');
            expect(filterString).not.toContain('grayscale');
        });

        it("returns correct svg id string for blur and grayscale param", function() {
            var filterString = Absolventa.Wally.Styler.getSvgFilterId({
                filterBlur : true,
                filterColoring : true,
                filterColoringMethod : 'grayscale'
            });

            expect(filterString).not.toContain('sepia');
            expect(filterString).toContain('blur');
            expect(filterString).toContain('grayscale');
        });

        it("returns correct svg id string for blur and sepia param", function() {
            var filterString = Absolventa.Wally.Styler.getSvgFilterId({
                filterBlur : true,
                filterColoring : true,
                filterColoringMethod : 'sepia'
            });

            expect(filterString).toContain('sepia');
            expect(filterString).toContain('blur');
            expect(filterString).not.toContain('grayscale');
        });

        it("returns correct svg id string for blur and disabled coloring param", function() {
            var filterString = Absolventa.Wally.Styler.getSvgFilterId({
                filterBlur : true,
                filterColoring : false,
                filterColoringMethod : 'sepia'
            });

            expect(filterString).not.toContain('sepia');
            expect(filterString).toContain('blur');
            expect(filterString).not.toContain('grayscale');
        });
    });


});

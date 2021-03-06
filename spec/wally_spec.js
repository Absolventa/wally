/*global runs, waits*/

describe("Wally", function() {

    'use strict';

    beforeEach(function () {
        var i;
        // handle fixtures
        $('body').prepend('<div id="fixtures"></div>');
        for (i = 0; i < 5; i += 1) {
            $('#fixtures').append('<img src="/base/src/images/image_' + i + '.jpg" class="wally_image">');
        }
    });

    afterEach(function() {
        $('#fixtures').remove();
    });

    it("sets Absolventa namespace correctly", function() {
        expect(Absolventa).toBeDefined();
    });

    it("sets Absolventa Wally namespace correctly", function() {
        expect(Absolventa.Wally).toBeDefined();
    });

    it("is instantiable", function() {
        var wall = new Absolventa.Wally();
        expect(wall).toBeDefined();
    });

    it("creates config object", function() {
        var wall = new Absolventa.Wally();
        expect(wall.config).toBeDefined();
    });

    it("overwrites default config object with missing selector string param", function() {
        var wall = new Absolventa.Wally();
        expect(wall.config.testKey).toBeUndefined();
        wall = new Absolventa.Wally({
            testKey : 'hooray'
        });
        expect(wall.config.testKey).toEqual('hooray');
    });

    it("overwrites default config object with selector string param", function() {
        var wall = new Absolventa.Wally();
        expect(wall.config.testKey).toBeUndefined();
        wall = new Absolventa.Wally('.wally_image', {
            testKey : 'hooray'
        });
        expect(wall.config.testKey).toEqual('hooray');
    });

    it("has a default height", function() {
        var wally = new Absolventa.Wally();

        expect(wally.config.containerHeight).toBeDefined();
    });

    it("overwrites default config object with selector array param", function() {
        var wally = new Absolventa.Wally();
        expect(wally.config.testKey).toBeUndefined();
        wally = new Absolventa.Wally(['.wally_image', '.another_wally_image'], {
            testKey : 'hooray'
        });
        expect(wally.config.testKey).toEqual('hooray');
    });

    it("mounts images with selector", function() {
        var wally = new Absolventa.Wally('.wally_image');
        expect(wally.elements.length).toEqual(5);
    });

    it("sorts child images into images array", function() {
        var wally;
        $('#fixtures').append('<a href="#" id="my-image-link" class="wally_image"><img src="/base/src/images/image_1000.jpg"></a>');
        wally = new Absolventa.Wally('.wally_image');
        expect(wally.images[wally.images.length - 1].src).toContain('/base/src/images/image_1000.jpg');
    });

    it("sorts parent elements of child images into elements array", function() {
        var wally;
        $('#fixtures').append('<a href="#" id="my-image-link" class="wally_image"><img src="/base/src/images/image_1000.jpg"></a>');
        wally = new Absolventa.Wally('.wally_image');
        expect(wally.elements[wally.elements.length - 1].id).toEqual('my-image-link');
    });

    it("creates a container element", function() {
        var wally = new Absolventa.Wally('.wally_image'),
            container = document.getElementsByClassName(wally.config.containerCssClassName);

        expect(container.length).toEqual(1);
    });

    it("creates an overlay element when param is true", function() {
        var wally = new Absolventa.Wally('.wally_image', {
                overlay : true
            }),
            overlay = document.getElementsByClassName(wally.config.overlayCssClassName);

        expect(overlay[0].nodeType).toEqual(1);
    });

    it("does not create an overlay element when param is false", function() {
        var wally = new Absolventa.Wally('.wally_image', {
                overlay : false
            }),
            overlay = document.getElementsByClassName(wally.config.overlayCssClassName);

        expect(overlay[0]).not.toBeDefined();
    });

    it("creates an image wrapper element for images", function() {
        var wally = new Absolventa.Wally('.wally_image'),
            wrapper = document.getElementsByClassName(wally.config.imageWrapperCssClassName);

        expect(wrapper.length).toBeTruthy();
    });

    it("has a beforeMount callback", function() {
        var called = 0,
            wally = new Absolventa.Wally('.wally_image', {
                beforeMount : function() {
                    called += 1;
                },
            });

        expect(called).toEqual(1);
    });

    it("container element is available within beforeMount callback", function() {
        var testElement,
            wally = new Absolventa.Wally('.wally_image', {
                beforeMount : function(element) {
                    testElement = element;
                },
            });

        expect(testElement).toEqual(wally.container);
    });

    it("has a afterMount callback", function() {
        var called = 0,
            wally = new Absolventa.Wally('.wally_image', {
                afterMount : function() {
                    called += 1;
                },
            });

        expect(called).toEqual(1);
    });

    it("container element is available within afterMount callback", function() {
        var testElement,
            wally = new Absolventa.Wally('.wally_image', {
                afterMount : function(element) {
                    testElement = element;
                },
            });

        expect(testElement).toEqual(wally.container);
    });

});

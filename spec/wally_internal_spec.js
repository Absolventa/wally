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

    describe("mounts container", function() {
        it("only once", function() {
            var wally = new Absolventa.Wally('.wally_image'),
                wallyContainer = wally.container;

            wally._mountContainer();

            expect(wally.container).toEqual(wallyContainer);
        });
    });

    describe("animation", function() {
        it("is started when param is set", function() {
            spyOn(Absolventa.Wally.prototype, '_startAnimation').andCallThrough();
            var wally = new Absolventa.Wally('.wally_image', {
                scrollAnimation : false
            });

            expect(Absolventa.Wally.prototype._startAnimation).not.toHaveBeenCalled();
        });
        it("calls event handler for container hovering when param is set", function() {
            spyOn(Absolventa.Wally.prototype, '_addEventHandlerForContainerHovering').andCallThrough();
            var wally = new Absolventa.Wally('.wally_image', {
                scrollAnimationStoppable : true
            });

            expect(Absolventa.Wally.prototype._addEventHandlerForContainerHovering).toHaveBeenCalled();
        });

        it("does not call event handler for container hovering when param is not set", function() {
            spyOn(Absolventa.Wally.prototype, '_addEventHandlerForContainerHovering').andCallThrough();
            var wally = new Absolventa.Wally('.wally_image', {
                scrollAnimationStoppable : false
            });

            expect(Absolventa.Wally.prototype._addEventHandlerForContainerHovering).not.toHaveBeenCalled();
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
